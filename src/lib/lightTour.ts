import { ensureDurableHydrated, readJsonFile, writeJsonFileAsync } from "./dataFs";
import { haversineMeters, type TourHoliday } from "./lightTourShared";

export {
  DRIVING_CANDIDATE_CAP,
  DEFAULT_STOPS,
  GEOFENCE_METERS,
  HOLIDAY_LABELS,
  MAX_STOPS,
  TOUR_HOLIDAYS,
  haversineMeters,
} from "./lightTourShared";
export type { TourHoliday };

export const LIGHT_TOUR_FILE = "light-tour.json";

let writeChain: Promise<unknown> = Promise.resolve();

/** Keep pin and tour writes in order so two saves cannot overwrite each other. */
function enqueue<T>(work: () => Promise<T>): Promise<T> {
  const run = writeChain.then(work, work);
  writeChain = run.then(
    () => undefined,
    () => undefined
  );
  return run;
}

export type LightPin = {
  id: string;
  holiday: TourHoliday;
  latitude: number;
  longitude: number;
  address: string;
  photoUrl: string;
  note: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
};

export type LightTourLog = {
  id: string;
  sessionId: string;
  holiday: TourHoliday;
  stopCount: number;
  startedAt: string;
  completedAt: string;
};

type Store = { pins: LightPin[]; tours: LightTourLog[] };

export type PublicPin = Omit<LightPin, "createdBy">;

function emptyStore(): Store {
  return { pins: [], tours: [] };
}

function asHoliday(value: unknown): TourHoliday | null {
  const text = String(value || "").trim().toLowerCase();
  if (text === "halloween" || text === "christmas" || text === "other") return text;
  if (text === "xmas" || text === "holiday") return "christmas";
  return null;
}

function num(value: unknown): number | null {
  const n = typeof value === "number" ? value : Number(String(value || "").trim());
  return Number.isFinite(n) ? n : null;
}

function clip(value: unknown, max: number) {
  return String(value || "").trim().slice(0, max);
}

export function holidayFrom(value: unknown): TourHoliday | null {
  return asHoliday(value);
}

export function publicPin(pin: LightPin): PublicPin {
  const { createdBy: _createdBy, ...rest } = pin;
  return rest;
}

function normalizePin(raw: unknown): LightPin | null {
  if (!raw || typeof raw !== "object") return null;
  const row = raw as Partial<LightPin>;
  const holiday = asHoliday(row.holiday);
  const latitude = num(row.latitude);
  const longitude = num(row.longitude);
  if (!holiday || latitude == null || longitude == null) return null;
  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) return null;
  const id = clip(row.id, 80);
  if (!id) return null;
  return {
    id,
    holiday,
    latitude,
    longitude,
    address: clip(row.address, 180),
    photoUrl: clip(row.photoUrl, 400),
    note: clip(row.note, 160),
    createdAt: clip(row.createdAt, 40) || new Date().toISOString(),
    updatedAt: clip(row.updatedAt, 40) || new Date().toISOString(),
    createdBy: clip(row.createdBy, 120) || "admin",
  };
}

export async function readLightTour(): Promise<Store> {
  await ensureDurableHydrated();
  const raw = readJsonFile<Partial<Store>>(LIGHT_TOUR_FILE);
  const pins = Array.isArray(raw?.pins) ? raw.pins.map(normalizePin).filter((pin): pin is LightPin => !!pin) : [];
  const tours = Array.isArray(raw?.tours) ? raw.tours.filter((row) => row && typeof row === "object") as LightTourLog[] : [];
  return { pins, tours: tours.slice(-400) };
}

async function writeStore(store: Store) {
  await writeJsonFileAsync(LIGHT_TOUR_FILE, {
    pins: store.pins,
    tours: store.tours.slice(-400),
  });
}

export function newPinId() {
  return `pin-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function savePin(input: {
  id?: string;
  holiday: TourHoliday;
  latitude: number;
  longitude: number;
  address?: string;
  photoUrl?: string;
  note?: string;
  createdBy: string;
}): Promise<LightPin> {
  return enqueue(async () => {
    const store = await readLightTour();
    const now = new Date().toISOString();
    const id = clip(input.id, 80);
    const existing = id ? store.pins.find((pin) => pin.id === id) : undefined;
    const pin: LightPin = {
      id: existing?.id || id || newPinId(),
      holiday: input.holiday,
      latitude: input.latitude,
      longitude: input.longitude,
      address: clip(input.address ?? existing?.address, 180),
      photoUrl: clip(input.photoUrl ?? existing?.photoUrl, 400),
      note: clip(input.note ?? existing?.note, 160),
      createdAt: existing?.createdAt || now,
      updatedAt: now,
      createdBy: existing?.createdBy || clip(input.createdBy, 120) || "admin",
    };
    store.pins = existing
      ? store.pins.map((row) => (row.id === pin.id ? pin : row))
      : [pin, ...store.pins];
    await writeStore(store);
    return pin;
  });
}

export function deletePin(id: string): Promise<boolean> {
  return enqueue(async () => {
    const store = await readLightTour();
    const next = store.pins.filter((pin) => pin.id !== id);
    if (next.length === store.pins.length) return false;
    store.pins = next;
    await writeStore(store);
    return true;
  });
}

function sameHouse(
  a: { holiday: TourHoliday; latitude: number; longitude: number },
  b: { holiday: TourHoliday; latitude: number; longitude: number }
) {
  return a.holiday === b.holiday && haversineMeters(a, b) < 30;
}

export function importPins(
  pins: Array<Omit<LightPin, "id" | "createdAt" | "updatedAt" | "createdBy"> & { createdBy?: string }>,
  createdBy: string
): Promise<LightPin[]> {
  return enqueue(async () => {
    const store = await readLightTour();
    const now = new Date().toISOString();
    const added: LightPin[] = [];
    for (const pin of pins) {
      const spot = { holiday: pin.holiday, latitude: pin.latitude, longitude: pin.longitude };
      if (store.pins.some((existing) => sameHouse(existing, spot))) continue;
      if (added.some((existing) => sameHouse(existing, spot))) continue;
      added.push({
        ...pin,
        id: newPinId(),
        address: clip(pin.address, 180),
        photoUrl: clip(pin.photoUrl, 400),
        note: clip(pin.note, 160),
        createdAt: now,
        updatedAt: now,
        createdBy: clip(createdBy, 120) || "admin",
      });
    }
    if (added.length) {
      store.pins = [...added, ...store.pins];
      await writeStore(store);
    }
    return added;
  });
}

export function logTour(input: {
  sessionId: string;
  holiday: TourHoliday;
  stopCount: number;
  startedAt?: string;
  completedAt?: string;
}): Promise<void> {
  return enqueue(async () => {
    const store = await readLightTour();
    const sessionId = clip(input.sessionId, 80);
    const existing = store.tours.find((tour) => tour.sessionId === sessionId && tour.holiday === input.holiday && !tour.completedAt);
    if (existing && input.completedAt) {
      existing.completedAt = input.completedAt;
      existing.stopCount = input.stopCount;
    } else if (!existing) {
      store.tours.push({
        id: `tour-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
        sessionId,
        holiday: input.holiday,
        stopCount: input.stopCount,
        startedAt: input.startedAt || new Date().toISOString(),
        completedAt: input.completedAt || "",
      });
    }
    await writeStore(store);
  });
}

/**
 * Greedy nearest-neighbor order.
 * Version one does not run a full traveling-salesman search.
 * `durations[i][j]` is travel time from point i to point j.
 * Index 0 is the visitor. Returned indexes are the stops, in drive order.
 */
export function nearestNeighborOrder(durations: number[][]): number[] {
  const count = durations.length;
  const left = new Set<number>();
  for (let i = 1; i < count; i++) left.add(i);
  const order: number[] = [];
  let current = 0;
  while (left.size) {
    let best = -1;
    let bestDur = Number.POSITIVE_INFINITY;
    for (const j of left) {
      const dur = durations[current]?.[j];
      const score = Number.isFinite(dur) ? dur : Number.POSITIVE_INFINITY;
      if (score < bestDur) {
        best = j;
        bestDur = score;
      }
    }
    if (best < 0) break;
    order.push(best);
    left.delete(best);
    current = best;
  }
  return order;
}

export function straightLineDurations(
  points: { latitude: number; longitude: number }[]
): number[][] {
  return points.map((from) =>
    points.map((to) => {
      if (from === to) return 0;
      return haversineMeters(from, to) / 13;
    })
  );
}

type DraftPin = Omit<LightPin, "id" | "createdAt" | "updatedAt" | "createdBy">;

function draft(holiday: TourHoliday, latitude: number, longitude: number, note = "", address = ""): DraftPin {
  return { holiday, latitude, longitude, address, photoUrl: "", note: clip(note, 160) };
}

type PendingPlace = {
  holiday: TourHoliday;
  note: string;
  address: string;
  mapUrl: string;
};

type PinImport = {
  pins: DraftPin[];
  pending: PendingPlace[];
  skipped: number;
};

function emptyImport(): PinImport {
  return { pins: [], pending: [], skipped: 0 };
}

function mergeImports(parts: PinImport[]): PinImport {
  return {
    pins: parts.flatMap((part) => part.pins),
    pending: parts.flatMap((part) => part.pending),
    skipped: parts.reduce((sum, part) => sum + part.skipped, 0),
  };
}

function pair(latRaw: string, lngRaw: string): { latitude: number; longitude: number } | null {
  const latitude = num(latRaw);
  const longitude = num(lngRaw);
  if (latitude == null || longitude == null) return null;
  if (Math.abs(latitude) > 90 || Math.abs(longitude) > 180) return null;
  if (Math.abs(latitude) < 0.01 && Math.abs(longitude) < 0.01) return null;
  return { latitude, longitude };
}

function coordsIn(text: string): { latitude: number; longitude: number } | null {
  const at = text.match(/@(-?\d{1,2}\.\d{2,})\s*,\s*(-?\d{1,3}\.\d{2,})/);
  if (at) {
    const hit = pair(at[1], at[2]);
    if (hit) return hit;
  }
  const packed = text.match(/!3d(-?\d{1,2}\.\d{2,})!4d(-?\d{1,3}\.\d{2,})/);
  if (packed) {
    const hit = pair(packed[1], packed[2]);
    if (hit) return hit;
  }
  const query = text.match(/[?&](?:q|ll|query|center)=(-?\d{1,2}\.\d{2,})\s*(?:,|%2C)\s*(-?\d{1,3}\.\d{2,})/i);
  if (query) {
    const hit = pair(query[1], query[2]);
    if (hit) return hit;
  }
  const re = /(-?\d{1,2}\.\d{3,})\s*[, ]\s*(-?\d{1,3}\.\d{3,})/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(text))) {
    const before = match.index > 0 ? text[match.index - 1] : "";
    if (before && /[0-9.]/.test(before)) continue;
    const hit = pair(match[1], match[2]);
    if (hit) return hit;
  }
  return null;
}

function firstCoords(text: string): { latitude: number; longitude: number } | null {
  const direct = coordsIn(text);
  if (direct) return direct;
  try {
    return coordsIn(decodeURIComponent(text.replace(/\+/g, " ")));
  } catch {
    return null;
  }
}

const MAP_URL_RE =
  /https?:\/\/(?:maps\.app\.goo\.gl\/[^\s<>"')]+|goo\.gl\/maps\/[^\s<>"')]+|maps\.google\.com\/[^\s<>"')]+|(?:www\.)?google\.com\/maps[^\s<>"')]+)/i;

function firstMapUrl(text: string): string {
  const match = text.match(MAP_URL_RE);
  if (!match) return "";
  const url = match[0].replace(/[.,);]+$/, "");
  if (firstCoords(url)) return "";
  return url;
}

const STREET_RE =
  /\b\d{1,6}\s+(?:[A-Za-z0-9.'’#-]+\s+){1,5}(?:Street|St|Avenue|Ave|Road|Rd|Drive|Dr|Lane|Ln|Court|Ct|Circle|Cir|Boulevard|Blvd|Way|Place|Pl|Trail|Trl|Parkway|Pkwy|Terrace|Ter|Loop|Path|Run|Cove|Bend|Crossing|Trace|Point|Ridge)\b\.?/i;

function firstAddress(text: string): string {
  const match = text.replace(/https?:\/\/\S+/g, " ").match(STREET_RE);
  return match ? clip(match[0].replace(/\s+/g, " ").trim(), 180) : "";
}

function addressFromMapsPlace(text: string): string {
  const match = text.match(/\/maps\/place\/([^/?#"']+)/i);
  if (!match) return "";
  let decoded = match[1].replace(/\+/g, " ");
  try {
    decoded = decodeURIComponent(decoded);
  } catch {
    /* Plus signs are already spaces. */
  }
  if (!/\d/.test(decoded)) return "";
  return clip(decoded.trim(), 180);
}

function addressFromMapQuery(text: string): string {
  const match = text.match(/[?&](?:q|query)=([^&\s<>"']+)/i);
  if (!match) return "";
  let decoded = match[1].replace(/\+/g, " ");
  try {
    decoded = decodeURIComponent(decoded);
  } catch {
    /* The query is still usable with plus signs turned into spaces. */
  }
  if (firstCoords(decoded)) return "";
  return clip(decoded, 180);
}

function scrubNote(text: string, address: string) {
  let next = text.replace(/https?:\/\/\S+/g, " ");
  if (address) next = next.split(address).join(" ");
  return next.replace(/\s+/g, " ").trim();
}

function looseAddr(value: string) {
  return value
    .toLowerCase()
    .replace(/\b(florida|fl|lady lake|the villages|wildwood|summerfield|oxford|fruitland park)\b/g, " ")
    .replace(/\b\d{5}\b/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isAddressLabel(text: string, address: string) {
  const a = looseAddr(text);
  const b = looseAddr(address);
  if (!a || !b) return false;
  return a === b || a.startsWith(b) || b.startsWith(a);
}

function noteFrom(title: string, body: string, address: string) {
  const fromBody = scrubNote(body, address);
  if (fromBody && !isAddressLabel(fromBody, address)) return clip(fromBody, 160);
  const fromTitle = scrubNote(title, address);
  if (fromTitle && !isAddressLabel(fromTitle, address)) return clip(fromTitle, 160);
  return "";
}

function holidayFromLabel(value: unknown): TourHoliday | null {
  const text = String(value || "").trim().toLowerCase();
  if (/\bhalloween\b/.test(text)) return "halloween";
  if (/\bchristmas\b/.test(text) || /\bxmas\b/.test(text)) return "christmas";
  return null;
}

function hasPlace(text: string) {
  return !!(firstCoords(text) || firstMapUrl(text) || firstAddress(text) || addressFromMapQuery(text));
}

function withTitle(imported: PinImport, title: string): PinImport {
  const fallback = clip(scrubNote(title, ""), 160);
  if (!fallback) return imported;
  return {
    pins: imported.pins.map((pin) => ({ ...pin, note: pin.note || fallback })),
    pending: imported.pending.map((item) => ({ ...item, note: item.note || fallback })),
    skipped: imported.skipped,
  };
}

function textToPlace(title: string, body: string, holiday: TourHoliday): PinImport {
  const blocks = body.split(/\n\s*\n/).map((block) => block.trim()).filter(Boolean);
  const placedBlocks = blocks.filter((block) => hasPlace(block));
  if (blocks.length >= 2 && placedBlocks.length >= 2) {
    return withTitle(mergeImports(placedBlocks.map((block) => textToPlace("", block, holiday))), title);
  }
  const lines = body.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const placed = lines.filter((line) => hasPlace(line));
  if (placed.length >= 2) return withTitle(mergeImports(placed.map((line) => textToPlace("", line, holiday))), title);
  const blob = [title, body].filter(Boolean).join("\n");
  if (!blob.trim()) return emptyImport();
  const address = addressFromMapsPlace(blob) || firstAddress(blob) || addressFromMapQuery(blob);
  const coords = firstCoords(blob);
  const note = noteFrom(title, body, address);
  if (coords) {
    return { pins: [draft(holiday, coords.latitude, coords.longitude, note, address)], pending: [], skipped: 0 };
  }
  const mapUrl = firstMapUrl(blob);
  if (address || mapUrl) return { pins: [], pending: [{ holiday, note, address, mapUrl }], skipped: 0 };
  return { pins: [], pending: [], skipped: 1 };
}

type KeepNote = {
  title?: unknown;
  textContent?: unknown;
  listContent?: { text?: unknown }[];
  labels?: unknown;
  annotations?: unknown;
  isTrashed?: unknown;
  color?: unknown;
  userEditedTimestampUsec?: unknown;
  createdTimestampUsec?: unknown;
  isPinned?: unknown;
};

function isKeepNote(value: unknown): value is KeepNote {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const row = value as Record<string, unknown>;
  if (row.type === "Feature" || row.type === "FeatureCollection" || row.geometry) return false;
  const hasBody =
    typeof row.textContent === "string" || Array.isArray(row.listContent) || Array.isArray(row.annotations);
  const hasMeta =
    Array.isArray(row.labels) ||
    "userEditedTimestampUsec" in row ||
    "createdTimestampUsec" in row ||
    "isTrashed" in row ||
    "isPinned" in row ||
    "color" in row;
  return hasBody || (typeof row.title === "string" && hasMeta);
}

function keepNotesFrom(value: unknown): KeepNote[] | null {
  if (Array.isArray(value)) {
    const notes = value.filter(isKeepNote);
    return notes.length ? notes : null;
  }
  if (!value || typeof value !== "object") return null;
  const row = value as { notes?: unknown };
  if (Array.isArray(row.notes)) {
    const notes = row.notes.filter(isKeepNote);
    if (notes.length) return notes;
  }
  return isKeepNote(value) ? [value] : null;
}

function labelHoliday(labels: unknown, fallback: TourHoliday): TourHoliday {
  if (!Array.isArray(labels)) return fallback;
  for (const label of labels) {
    const name = typeof label === "string" ? label : (label as { name?: unknown })?.name;
    const hit = holidayFromLabel(name);
    if (hit) return hit;
  }
  return fallback;
}

function annotationBlob(value: unknown) {
  if (!Array.isArray(value)) return "";
  return value
    .map((item) => {
      if (!item || typeof item !== "object") return "";
      const row = item as { url?: unknown; title?: unknown; description?: unknown };
      return [row.url, row.title, row.description].map((part) => String(part || "")).filter(Boolean).join(" ");
    })
    .filter(Boolean)
    .join("\n");
}

function keepNoteToImport(note: KeepNote, fallback: TourHoliday): PinImport {
  if (note.isTrashed === true) return emptyImport();
  const holiday = labelHoliday(note.labels, fallback);
  const title = clip(note.title, 180);
  const list = Array.isArray(note.listContent) ? note.listContent.map((item) => clip(item?.text, 500)).filter(Boolean) : [];
  const placed = list.filter((line) => hasPlace(line));
  if (placed.length >= 2) return withTitle(mergeImports(placed.map((line) => textToPlace("", line, holiday))), title);
  const body = [typeof note.textContent === "string" ? note.textContent : "", ...list, annotationBlob(note.annotations)]
    .filter(Boolean)
    .join("\n");
  return textToPlace(title, body, holiday);
}

function decodeHtml(value: string) {
  return value
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(?:p|li|div|h1|tr)>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&#(\d+);/g, (_, digits: string) => {
      const code = Number(digits);
      return code > 0 && code < 65536 ? String.fromCharCode(code) : "";
    })
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

function htmlGroup(chunk: string, pattern: RegExp) {
  const match = chunk.match(pattern);
  return match ? decodeHtml(match[1]) : "";
}

function parseHtmlNote(chunk: string, fallback: TourHoliday): PinImport {
  const title =
    htmlGroup(chunk, /class="heading"[^>]*>([\s\S]*?)<\/div>/i) ||
    htmlGroup(chunk, /class="title"[^>]*>([\s\S]*?)<\/div>/i) ||
    htmlGroup(chunk, /<h1[^>]*>([\s\S]*?)<\/h1>/i) ||
    htmlGroup(chunk, /<title[^>]*>([\s\S]*?)<\/title>/i);
  const closed = chunk.match(/class="content"[^>]*>([\s\S]*?)<\/div>\s*(?:<div class="(?:labels|chips|archived)"|<\/div>\s*<\/div>\s*<\/body>|$)/i);
  const loose = chunk.match(/class="content"[^>]*>([\s\S]*)/i)?.[1]?.split(/<div class="(?:labels|archived)"|<\/body>/i)[0];
  const content = decodeHtml(closed?.[1] || loose || "");
  const labels = [...chunk.matchAll(/class="[^"]*\blabel\b[^"]*"[^>]*>([\s\S]*?)<\//gi)].map((match) => decodeHtml(match[1]));
  let holiday = fallback;
  for (const label of labels) {
    const hit = holidayFromLabel(label);
    if (hit) {
      holiday = hit;
      break;
    }
  }
  if (!title && !content) return emptyImport();
  return textToPlace(title, content, holiday);
}

function parseKeepHtml(raw: string, fallback: TourHoliday): PinImport | null {
  if (!/<html[\s>]|class="(?:note|content|heading)"/i.test(raw)) return null;
  const docs = raw.split(/<html\b/i).filter((part) => /class="(?:heading|content|note|title)"/i.test(part));
  const chunks = docs.length ? docs : [raw];
  return mergeImports(chunks.map((chunk) => parseHtmlNote(chunk, fallback)));
}

function looksLikeGeo(value: unknown) {
  if (Array.isArray(value)) {
    return value.some((row) => !!row && typeof row === "object" && (row as { type?: string }).type === "Feature");
  }
  if (!value || typeof value !== "object") return false;
  const row = value as { type?: string; features?: unknown };
  return row.type === "Feature" || row.type === "FeatureCollection" || Array.isArray(row.features);
}

/** Coordinates, CSV, GeoJSON, or a Google Keep note with an address or map link. */
export function collectPinImport(text: string, fallbackHoliday: TourHoliday): PinImport {
  const raw = text.trim();
  if (!raw) return emptyImport();
  if (raw.startsWith("{") || raw.startsWith("[")) {
    try {
      const parsed = JSON.parse(raw) as unknown;
      const geo = parseGeoJson(parsed, fallbackHoliday);
      if (geo.length) return { pins: geo, pending: [], skipped: 0 };
      if (looksLikeGeo(parsed)) return emptyImport();
      const keep = keepNotesFrom(parsed);
      if (keep) return mergeImports(keep.map((note) => keepNoteToImport(note, fallbackHoliday)));
    } catch {
      /* Plain text that only started with a brace. */
    }
  }
  const html = parseKeepHtml(raw, fallbackHoliday);
  if (html && (html.pins.length || html.pending.length || html.skipped)) return html;

  const lines = raw.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (!lines.length) return emptyImport();
  const header = splitCsv(lines[0]).map((cell) => cell.toLowerCase());
  const latCol = header.findIndex((cell) => cell === "lat" || cell === "latitude" || cell === "y");
  const lonCol = header.findIndex((cell) => cell === "lng" || cell === "lon" || cell === "longitude" || cell === "x");
  if (latCol >= 0 && lonCol >= 0) {
    const noteCol = header.findIndex((cell) => cell === "note" || cell === "name" || cell === "title" || cell === "description");
    const addrCol = header.findIndex((cell) => cell === "address");
    const holidayCol = header.findIndex((cell) => cell === "holiday" || cell === "tag");
    const out: DraftPin[] = [];
    for (const line of lines.slice(1)) {
      const cells = splitCsv(line);
      const hit = pair(String(cells[latCol] || ""), String(cells[lonCol] || ""));
      if (!hit) continue;
      out.push(
        draft(
          asHoliday(cells[holidayCol]) || fallbackHoliday,
          hit.latitude,
          hit.longitude,
          noteCol >= 0 ? cells[noteCol] : "",
          addrCol >= 0 ? cells[addrCol] : ""
        )
      );
    }
    return { pins: out, pending: [], skipped: 0 };
  }
  const out: DraftPin[] = [];
  for (const line of lines) {
    const match = line.match(/^\s*(-?\d+(?:\.\d+)?)\s*[,;\s]\s*(-?\d+(?:\.\d+)?)(?:\s*[,;]\s*|\s+)?(.*)$/);
    if (!match) continue;
    const hit = pair(match[1], match[2]);
    if (!hit) continue;
    out.push(draft(fallbackHoliday, hit.latitude, hit.longitude, match[3] || ""));
  }
  if (out.length) return { pins: out, pending: [], skipped: 0 };
  return textToPlace("", raw, fallbackHoliday);
}

export function parsePinImport(text: string, fallbackHoliday: TourHoliday): DraftPin[] {
  return collectPinImport(text, fallbackHoliday).pins;
}

function parseGeoJson(value: unknown, fallbackHoliday: TourHoliday): DraftPin[] {
  const features = Array.isArray(value)
    ? value
    : value && typeof value === "object" && Array.isArray((value as { features?: unknown[] }).features)
      ? (value as { features: unknown[] }).features
      : [];
  const out: DraftPin[] = [];
  for (const feature of features) {
    if (!feature || typeof feature !== "object") continue;
    const row = feature as { geometry?: { type?: string; coordinates?: unknown[] }; properties?: Record<string, unknown> };
    const coords = row.geometry?.type === "Point" ? row.geometry.coordinates : null;
    if (!coords || coords.length < 2) continue;
    const hit = pair(String(coords[1] ?? ""), String(coords[0] ?? ""));
    if (!hit) continue;
    const props = row.properties || {};
    out.push(
      draft(
        asHoliday(props.holiday || props.tag) || fallbackHoliday,
        hit.latitude,
        hit.longitude,
        clip(props.note || props.name || props.title || props.description, 160),
        clip(props.address, 180)
      )
    );
  }
  return out;
}

function splitCsv(line: string): string[] {
  const cells: string[] = [];
  let current = "";
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (quoted && line[i + 1] === '"') {
        current += '"';
        i++;
      } else quoted = !quoted;
      continue;
    }
    if (ch === "," && !quoted) {
      cells.push(current.trim());
      current = "";
      continue;
    }
    current += ch;
  }
  cells.push(current.trim());
  return cells;
}

export async function reverseGeocode(latitude: number, longitude: number): Promise<string> {
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;
  try {
    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": "TheVillagesEverythingApp/1.0 (holiday-light-tour)",
      },
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return "";
    const data = (await res.json()) as { display_name?: string };
    return clip(data.display_name, 180);
  } catch {
    return "";
  }
}

const LOOKUP_CAP = 30;
const LOOKUP_BUDGET_MS = 45_000;
const VILLAGES_BOX = { minLat: 28.65, maxLat: 29.25, minLng: -82.25, maxLng: -81.7 };
const NOMINATIM_UA = "TheVillagesEverythingApp/1.0 (holiday-light-tour)";

function nearVillages(latitude: number, longitude: number) {
  return (
    latitude >= VILLAGES_BOX.minLat &&
    latitude <= VILLAGES_BOX.maxLat &&
    longitude >= VILLAGES_BOX.minLng &&
    longitude <= VILLAGES_BOX.maxLng
  );
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normAddr(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function addressSaved(pins: LightPin[], item: PendingPlace) {
  const addr = normAddr(item.address);
  if (addr.length < 8) return false;
  return pins.some((pin) => pin.holiday === item.holiday && normAddr(pin.address).includes(addr));
}

function allowedMapUrl(url: string) {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return false;
    const host = parsed.hostname.toLowerCase();
    if (host === "maps.app.goo.gl" || host === "goo.gl" || host === "maps.google.com") return true;
    return (host === "google.com" || host === "www.google.com") && parsed.pathname.startsWith("/maps");
  } catch {
    return false;
  }
}

function coordsFromMapPage(html: string): { latitude: number; longitude: number } | null {
  const decoded = html.replace(/%2C/gi, ",");
  const centers = decoded.match(/center=(-?\d{1,2}\.\d{4,}),(-?\d{1,3}\.\d{4,})/);
  if (centers) {
    const hit = pair(centers[1], centers[2]);
    if (hit && nearVillages(hit.latitude, hit.longitude)) return hit;
  }
  const direct = firstCoords(decoded);
  if (direct && nearVillages(direct.latitude, direct.longitude)) return direct;
  const packed = decoded.match(/!3d(-?\d{1,2}\.\d{4,})!4d(-?\d{1,3}\.\d{4,})/);
  return packed ? pair(packed[1], packed[2]) : null;
}

async function resolveMapLink(url: string): Promise<{ latitude: number; longitude: number } | null> {
  if (!allowedMapUrl(url)) return null;
  try {
    const res = await fetch(url, {
      redirect: "follow",
      headers: { Accept: "text/html", "User-Agent": NOMINATIM_UA },
      signal: AbortSignal.timeout(5000),
    });
    const fromUrl = firstCoords(res.url || url);
    if (fromUrl) return fromUrl;
    const html = (await res.text()).slice(0, 220_000);
    return coordsFromMapPage(html);
  } catch {
    return null;
  }
}

export async function forwardGeocode(
  query: string
): Promise<{ latitude: number; longitude: number; address: string } | null> {
  const q = /,|\bflorida\b|\bfl\b|the villages/i.test(query) ? query : `${query}, The Villages, Florida`;
  const url =
    "https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=us&bounded=1&viewbox=-82.25,29.25,-81.70,28.65&q=" +
    encodeURIComponent(q);
  try {
    const res = await fetch(url, {
      headers: { Accept: "application/json", "User-Agent": NOMINATIM_UA },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { lat?: string; lon?: string; display_name?: string }[];
    const row = data[0];
    const hit = row ? pair(String(row.lat || ""), String(row.lon || "")) : null;
    if (!hit || !nearVillages(hit.latitude, hit.longitude)) return null;
    return { ...hit, address: clip(row?.display_name, 180) };
  } catch {
    return null;
  }
}

export type PinImportResult = {
  pins: DraftPin[];
  skipped: number;
  missed: number;
  capped: number;
  already: number;
};

/** Nominatim allows about one search per second, so address lookups stay in a short batch. */
export async function placePinImport(text: string, fallbackHoliday: TourHoliday): Promise<PinImportResult> {
  const found = collectPinImport(text, fallbackHoliday);
  const store = await readLightTour();
  const pins = found.pins.filter((pin) => !store.pins.some((existing) => sameHouse(existing, pin)));
  let already = found.pins.length - pins.length;
  const seen = new Set<string>();
  const pending = found.pending.filter((item) => {
    const key = `${item.holiday}|${normAddr(item.address)}|${item.mapUrl}`;
    if (seen.has(key)) return false;
    seen.add(key);
    if (addressSaved(store.pins, item)) {
      already += 1;
      return false;
    }
    return true;
  });
  let missed = 0;
  let capped = 0;
  let lookups = 0;
  const started = Date.now();
  const overBudget = () => lookups >= LOOKUP_CAP || Date.now() - started > LOOKUP_BUDGET_MS;

  for (let index = 0; index < pending.length; index++) {
    if (pins.length >= 2000 || overBudget()) {
      capped += pending.length - index;
      break;
    }
    const item = pending[index];
    let coords: { latitude: number; longitude: number } | null = null;
    if (item.mapUrl) {
      if (lookups > 0) await delay(1100);
      lookups += 1;
      coords = await resolveMapLink(item.mapUrl);
    }
    if (!coords && item.address) {
      if (overBudget()) {
        capped += pending.length - index;
        break;
      }
      if (lookups > 0) await delay(1100);
      lookups += 1;
      coords = await forwardGeocode(item.address);
    }
    if (!coords) {
      missed += 1;
      continue;
    }
    const spot = { holiday: item.holiday, latitude: coords.latitude, longitude: coords.longitude };
    if (store.pins.some((existing) => sameHouse(existing, spot)) || pins.some((existing) => sameHouse(existing, spot))) {
      already += 1;
      continue;
    }
    pins.push(draft(item.holiday, coords.latitude, coords.longitude, item.note, item.address));
  }

  return { pins, skipped: found.skipped, missed, capped, already };
}

export function emptyLightStore() {
  return emptyStore();
}
