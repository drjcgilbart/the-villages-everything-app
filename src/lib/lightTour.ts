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

export function importPins(
  pins: Array<Omit<LightPin, "id" | "createdAt" | "updatedAt" | "createdBy"> & { createdBy?: string }>,
  createdBy: string
): Promise<LightPin[]> {
  return enqueue(async () => {
    const store = await readLightTour();
    const now = new Date().toISOString();
    const added = pins.map((pin) => ({
      ...pin,
      id: newPinId(),
      address: clip(pin.address, 180),
      photoUrl: clip(pin.photoUrl, 400),
      note: clip(pin.note, 160),
      createdAt: now,
      updatedAt: now,
      createdBy: clip(createdBy, 120) || "admin",
    }));
    store.pins = [...added, ...store.pins];
    await writeStore(store);
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

/** Paste "lat, lng optional note" lines, a CSV, or a GeoJSON feature collection. */
export function parsePinImport(text: string, fallbackHoliday: TourHoliday): DraftPin[] {
  const raw = text.trim();
  if (!raw) return [];
  if (raw.startsWith("{") || raw.startsWith("[")) {
    try {
      return parseGeoJson(JSON.parse(raw), fallbackHoliday);
    } catch {
      /* fall through to lines */
    }
  }
  const lines = raw.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (!lines.length) return [];
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
      const latitude = num(cells[latCol]);
      const longitude = num(cells[lonCol]);
      if (latitude == null || longitude == null) continue;
      out.push(
        draft(
          asHoliday(cells[holidayCol]) || fallbackHoliday,
          latitude,
          longitude,
          noteCol >= 0 ? cells[noteCol] : "",
          addrCol >= 0 ? cells[addrCol] : ""
        )
      );
    }
    return out;
  }
  const out: DraftPin[] = [];
  for (const line of lines) {
    const match = line.match(/^\s*(-?\d+(?:\.\d+)?)\s*[,;\s]\s*(-?\d+(?:\.\d+)?)(?:\s*[,;]\s*|\s+)?(.*)$/);
    if (!match) continue;
    const latitude = num(match[1]);
    const longitude = num(match[2]);
    if (latitude == null || longitude == null) continue;
    if (Math.abs(latitude) > 90 || Math.abs(longitude) > 180) continue;
    out.push(draft(fallbackHoliday, latitude, longitude, match[3] || ""));
  }
  return out;
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
    const longitude = num(coords[0]);
    const latitude = num(coords[1]);
    if (latitude == null || longitude == null) continue;
    const props = row.properties || {};
    out.push(
      draft(
        asHoliday(props.holiday || props.tag) || fallbackHoliday,
        latitude,
        longitude,
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

export function emptyLightStore() {
  return emptyStore();
}
