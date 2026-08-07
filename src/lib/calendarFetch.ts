/**
 * Fetch + parse local public event listings for The Villages area.
 * Sources are public web pages (entertainment calendars). Not affiliated with The Villages®.
 */

import crypto from "crypto";
import {
  ensureDurableHydrated,
  isEphemeralHost,
  readJsonFile,
  writeJsonFile,
  writeJsonFileAsync,
} from "./dataFs";
import { parseEntertainmentHtml } from "./entertainmentFetch";
import type {
  CalendarEvent,
  CalendarEventSource,
  CalendarEventsStore,
} from "./calendarEventsTypes";

const FILE = "calendar-events.json";

const SOURCE_PAGES: {
  url: string;
  source: CalendarEventSource;
  sourceLabel: string;
  category: string;
}[] = [
  {
    url: "https://www.thevillagesentertainment.com/nightly-entertainment/",
    source: "villages-entertainment",
    sourceLabel: "Villages Entertainment",
    category: "Live entertainment",
  },
  {
    url: "https://www.thevillagesentertainment.com/spanish-springs/",
    source: "villages-entertainment",
    sourceLabel: "Spanish Springs",
    category: "Live entertainment",
  },
  {
    url: "https://www.thevillagesentertainment.com/lake-sumter-landing/",
    source: "villages-entertainment",
    sourceLabel: "Lake Sumter Landing",
    category: "Live entertainment",
  },
  {
    url: "https://www.thevillagesentertainment.com/brownwood-paddock-square/",
    source: "villages-entertainment",
    sourceLabel: "Brownwood",
    category: "Live entertainment",
  },
  {
    url: "https://www.thevillagesentertainment.com/eastport/",
    source: "villages-entertainment",
    sourceLabel: "Eastport",
    category: "Live entertainment",
  },
  {
    url: "https://www.thevillagesentertainment.com/sawgrass-grove/",
    source: "villages-entertainment",
    sourceLabel: "Sawgrass Grove",
    category: "Live entertainment",
  },
];

function emptyStore(): CalendarEventsStore {
  return {
    updatedAt: null,
    sources: SOURCE_PAGES.map((s) => s.url),
    events: [],
    eventCount: 0,
    lastError: null,
  };
}

export function loadCalendarStore(): CalendarEventsStore {
  const raw = readJsonFile<CalendarEventsStore>(FILE);
  if (!raw) return emptyStore();
  return {
    updatedAt: raw.updatedAt || null,
    sources: Array.isArray(raw.sources) ? raw.sources : emptyStore().sources,
    events: Array.isArray(raw.events) ? raw.events : [],
    eventCount: Number(raw.eventCount) || 0,
    lastError: raw.lastError ?? null,
    lastRefreshSource: raw.lastRefreshSource || null,
  };
}

export async function loadCalendarStoreAsync(): Promise<CalendarEventsStore> {
  if (isEphemeralHost()) await ensureDurableHydrated();
  return loadCalendarStore();
}

export async function saveCalendarStoreAsync(store: CalendarEventsStore) {
  store.updatedAt = new Date().toISOString();
  store.eventCount = store.events.length;
  await writeJsonFileAsync(FILE, store);
  return store;
}

function floridaTodayKey(d = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(d);
  const y = parts.find((p) => p.type === "year")?.value;
  const m = parts.find((p) => p.type === "month")?.value;
  const day = parts.find((p) => p.type === "day")?.value;
  return `${y}-${m}-${day}`;
}

function dateKeyFromIso(iso: string): string | null {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return null;
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/New_York",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(d);
    const y = parts.find((p) => p.type === "year")?.value;
    const m = parts.find((p) => p.type === "month")?.value;
    const day = parts.find((p) => p.type === "day")?.value;
    return `${y}-${m}-${day}`;
  } catch {
    return null;
  }
}

function formatTimeFromIso(iso?: string): string | undefined {
  if (!iso) return undefined;
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return undefined;
    return d.toLocaleTimeString("en-US", {
      timeZone: "America/New_York",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return undefined;
  }
}

function eventId(parts: string[]) {
  const raw = parts.join("|").toLowerCase();
  return `evt-${crypto.createHash("sha1").update(raw).digest("hex").slice(0, 12)}`;
}

function decodeHtml(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#8217;/g, "'")
    .replace(/&#174;/g, "®")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/\s+/g, " ")
    .trim();
}

/** Extract schema.org Event objects embedded in HTML (brace-matched). */
export function extractSchemaOrgEvents(html: string): Record<string, unknown>[] {
  const out: Record<string, unknown>[] = [];
  const markers = ['"@type": "Event"', '"@type":"Event"'];
  let searchFrom = 0;
  while (searchFrom < html.length) {
    let idx = -1;
    let markerLen = 0;
    for (const m of markers) {
      const i = html.indexOf(m, searchFrom);
      if (i >= 0 && (idx < 0 || i < idx)) {
        idx = i;
        markerLen = m.length;
      }
    }
    if (idx < 0) break;
    const start = html.lastIndexOf("{", idx);
    if (start < 0) {
      searchFrom = idx + markerLen;
      continue;
    }
    let depth = 0;
    let end = -1;
    const limit = Math.min(html.length, start + 8000);
    for (let i = start; i < limit; i++) {
      const ch = html[i];
      if (ch === "{") depth++;
      else if (ch === "}") {
        depth--;
        if (depth === 0) {
          end = i + 1;
          break;
        }
      }
    }
    if (end > start) {
      try {
        const obj = JSON.parse(html.slice(start, end)) as Record<string, unknown>;
        if (obj["@type"] === "Event" && obj.startDate) out.push(obj);
      } catch {
        /* skip */
      }
      searchFrom = end;
    } else {
      searchFrom = idx + markerLen;
    }
  }
  return out;
}

function schemaToEvent(
  obj: Record<string, unknown>,
  meta: { source: CalendarEventSource; sourceLabel: string; category: string; pageUrl: string }
): CalendarEvent | null {
  const startIso = String(obj.startDate || "");
  const endIso = obj.endDate ? String(obj.endDate) : undefined;
  const date = dateKeyFromIso(startIso);
  if (!date) return null;

  const name = decodeHtml(String(obj.name || obj.headline || "").trim());
  if (!name || name.length < 2) return null;

  let venue: string | undefined;
  let location: string | undefined;
  const loc = obj.location as Record<string, unknown> | undefined;
  if (loc && typeof loc === "object") {
    venue = loc.name ? decodeHtml(String(loc.name)) : undefined;
    location = loc.address ? decodeHtml(String(loc.address)) : undefined;
  }

  const description = obj.description
    ? decodeHtml(String(obj.description)).slice(0, 400)
    : undefined;
  const url = obj.url ? String(obj.url) : meta.pageUrl;

  const startT = formatTimeFromIso(startIso);
  const endT = formatTimeFromIso(endIso);
  let timeLabel = startT;
  if (startT && endT) timeLabel = `${startT} – ${endT}`;

  return {
    id: eventId([date, name, venue || "", startIso]),
    title: name,
    date,
    timeLabel,
    startIso,
    endIso,
    venue,
    location,
    description,
    url,
    category: meta.category,
    source: meta.source,
    sourceLabel: meta.sourceLabel,
  };
}

function parseLabelDate(label: string): string | null {
  const cleaned = label.replace(/\s+/g, " ").trim();
  const d = new Date(cleaned);
  if (Number.isNaN(d.getTime())) return null;
  const y = d.getFullYear();
  const mo = d.getMonth() + 1;
  const day = d.getDate();
  if (y < 2020 || y > 2100) return null;
  return `${y}-${String(mo).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function htmlEventsToCalendar(
  html: string,
  meta: { source: CalendarEventSource; sourceLabel: string; category: string; pageUrl: string }
): CalendarEvent[] {
  const raw = parseEntertainmentHtml(html);
  const out: CalendarEvent[] = [];
  for (const ev of raw) {
    const date = parseLabelDate(ev.dateLabel);
    if (!date) continue;
    const title = ev.title.trim();
    if (!title) continue;
    let timeLabel: string | undefined;
    if (ev.start && ev.end) timeLabel = `${ev.start} – ${ev.end}`;
    else if (ev.start) timeLabel = ev.start;
    out.push({
      id: eventId([date, title, ev.venue || "", ev.start || ""]),
      title,
      date,
      timeLabel,
      venue: ev.venue || undefined,
      description: ev.blurb || undefined,
      url: meta.pageUrl,
      category: meta.category,
      source: "entertainment-html",
      sourceLabel: meta.sourceLabel,
    });
  }
  return out;
}

/** Small curated anchors when scrapes are thin (orientation only). */
function curatedRecurring(monthKey: string): CalendarEvent[] {
  const [y, m] = monthKey.split("-").map(Number);
  if (!y || !m) return [];
  const out: CalendarEvent[] = [];
  // First Saturday vibe note for town squares / markets (generic)
  const first = new Date(y, m - 1, 1);
  while (first.getMonth() === m - 1) {
    if (first.getDay() === 6) {
      // Saturday morning farmers-market energy (many villages have weekend markets)
      const day = `${y}-${String(m).padStart(2, "0")}-${String(first.getDate()).padStart(2, "0")}`;
      out.push({
        id: eventId([day, "weekend-square-markets"]),
        title: "Weekend square & market energy",
        date: day,
        timeLabel: "Morning – afternoon",
        venue: "Town squares (varies)",
        description:
          "Many squares host weekend markets, buskers, and open-air shopping — confirm today’s vendors on square boards and entertainment listings.",
        url: "https://www.thevillages.com/calendar/",
        category: "Community",
        source: "curated",
        sourceLabel: "Hub note",
      });
      break;
    }
    first.setDate(first.getDate() + 1);
  }
  return out;
}

function dedupeEvents(events: CalendarEvent[]): CalendarEvent[] {
  const map = new Map<string, CalendarEvent>();
  for (const e of events) {
    const key = `${e.date}|${e.title.toLowerCase()}|${(e.venue || "").toLowerCase()}`;
    const prev = map.get(key);
    if (!prev) {
      map.set(key, e);
      continue;
    }
    // Prefer richer description / schema source
    if ((e.description?.length || 0) > (prev.description?.length || 0)) {
      map.set(key, { ...prev, ...e, id: prev.id });
    } else if (!prev.timeLabel && e.timeLabel) {
      map.set(key, { ...prev, timeLabel: e.timeLabel, startIso: e.startIso, endIso: e.endIso });
    }
  }
  return [...map.values()].sort((a, b) => {
    const c = a.date.localeCompare(b.date);
    if (c !== 0) return c;
    return (a.timeLabel || "").localeCompare(b.timeLabel || "") || a.title.localeCompare(b.title);
  });
}

async function fetchPage(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "VillagesEverythingApp/1.0 (+https://www.thevillageseverythingapp.com; local events calendar)",
      Accept: "text/html,application/xhtml+xml",
    },
    cache: "no-store",
    signal: AbortSignal.timeout(25000),
  });
  if (!res.ok) throw new Error(`Fetch ${url} → ${res.status}`);
  return res.text();
}

export async function refreshCalendarEvents(options?: {
  source?: string;
}): Promise<CalendarEventsStore> {
  const errors: string[] = [];
  const collected: CalendarEvent[] = [];

  for (const page of SOURCE_PAGES) {
    try {
      const html = await fetchPage(page.url);
      const schema = extractSchemaOrgEvents(html);
      for (const obj of schema) {
        const ev = schemaToEvent(obj, {
          source: page.source,
          sourceLabel: page.sourceLabel,
          category: page.category,
          pageUrl: page.url,
        });
        if (ev) collected.push(ev);
      }
      const fromHtml = htmlEventsToCalendar(html, {
        source: page.source,
        sourceLabel: page.sourceLabel,
        category: page.category,
        pageUrl: page.url,
      });
      collected.push(...fromHtml);
    } catch (err) {
      errors.push(
        `${page.sourceLabel}: ${err instanceof Error ? err.message : "fetch failed"}`
      );
    }
  }

  const today = floridaTodayKey();
  const monthKey = today.slice(0, 7);
  collected.push(...curatedRecurring(monthKey));

  // Keep a rolling window: 7 days past through ~60 days ahead
  const windowStart = new Date();
  windowStart.setDate(windowStart.getDate() - 10);
  const windowEnd = new Date();
  windowEnd.setDate(windowEnd.getDate() + 60);
  const startKey = floridaTodayKey(windowStart);
  const endKey = floridaTodayKey(windowEnd);

  let events = dedupeEvents(collected).filter(
    (e) => e.date >= startKey && e.date <= endKey
  );

  // If scrape failed completely, keep previous store events
  const prev = loadCalendarStore();
  if (events.length < 3 && prev.events.length) {
    events = prev.events;
    errors.push("Scrape returned few events — kept previous snapshot");
  }

  const store: CalendarEventsStore = {
    updatedAt: new Date().toISOString(),
    sources: SOURCE_PAGES.map((s) => s.url),
    events,
    eventCount: events.length,
    lastError: errors.length ? errors.join(" · ") : null,
    lastRefreshSource: options?.source || "manual",
  };

  try {
    await saveCalendarStoreAsync(store);
  } catch {
    // Local/dev fallback
    writeJsonFile(FILE, store);
  }
  return store;
}

export async function ensureCalendarFresh(
  maxAgeHours = 20
): Promise<CalendarEventsStore> {
  const store = await loadCalendarStoreAsync();
  if (store.updatedAt) {
    const age = Date.now() - new Date(store.updatedAt).getTime();
    if (age < maxAgeHours * 3600 * 1000 && store.events.length > 0) {
      return store;
    }
  }
  try {
    return await refreshCalendarEvents({ source: "stale-check" });
  } catch {
    return store;
  }
}

export function eventsForMonth(
  store: CalendarEventsStore,
  year: number,
  month: number // 1-12
): CalendarEvent[] {
  const prefix = `${year}-${String(month).padStart(2, "0")}`;
  return store.events.filter((e) => e.date.startsWith(prefix));
}

export function floridaMonthNow(d = new Date()) {
  const key = floridaTodayKey(d);
  const [y, m] = key.split("-").map(Number);
  return { year: y, month: m, todayKey: key };
}
