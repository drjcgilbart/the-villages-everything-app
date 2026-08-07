/**
 * Fetch + parse free nightly entertainment from The Villages Entertainment site.
 * Runs on cron (daily) and on-demand refresh. Not affiliated with The Villages®.
 */

import { readJsonFile, writeJsonFile } from "./dataFs";
import {
  CURATED_LINEUP,
  type SquareAct,
  type SquareId,
  type SquareNightLineup,
} from "./squareEntertainment";

const SCHEDULE_FILE = "entertainment-schedule.json";

const SOURCE_URLS = [
  "https://www.thevillagesentertainment.com/nightly-entertainment/",
  "https://www.thevillagesentertainment.com/spanish-springs/",
] as const;

export type EntertainmentScheduleStore = {
  updatedAt: string;
  sourceUrls: string[];
  nights: SquareNightLineup[];
  eventCount: number;
  lastError?: string | null;
};

export function loadEntertainmentStore(): EntertainmentScheduleStore | null {
  return readJsonFile<EntertainmentScheduleStore>(SCHEDULE_FILE);
}

/** Server-only: live auto-refreshed nights, else seed fallback. */
export function loadActiveLineup(): SquareNightLineup[] {
  try {
    const store = loadEntertainmentStore();
    if (store?.nights?.length) return store.nights;
  } catch {
    /* fall through */
  }
  return CURATED_LINEUP;
}

export function getEntertainmentUpdatedAt(): string | null {
  try {
    return loadEntertainmentStore()?.updatedAt || null;
  } catch {
    return null;
  }
}

export function saveEntertainmentStore(
  store: EntertainmentScheduleStore
): EntertainmentScheduleStore {
  writeJsonFile(SCHEDULE_FILE, store);
  return store;
}

function decodeHtml(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8211;/g, "–")
    .replace(/&#8212;/g, "—")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/\s+/g, " ")
    .trim();
}

function stripTags(html: string): string {
  return decodeHtml(html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
}

function normalizeTime(raw: string): string {
  const t = raw.trim().toLowerCase().replace(/\./g, "");
  const m = t.match(/^(\d{1,2}):(\d{2})\s*(am|pm)$/i);
  if (!m) return raw.trim();
  let h = Number(m[1]);
  const min = m[2];
  const ap = m[3].toLowerCase();
  // Display as "6:00 PM"
  const apOut = ap === "am" ? "AM" : "PM";
  return `${h}:${min} ${apOut}`;
}

function parseLabelDate(label: string): string | null {
  const cleaned = label.replace(/\s+/g, " ").trim();
  const d = new Date(cleaned);
  if (Number.isNaN(d.getTime())) return null;
  // Use UTC date parts when label is timezone-free calendar date
  // Prefer local components from parsed date (US English month names)
  const y = d.getFullYear();
  const mo = d.getMonth() + 1;
  const day = d.getDate();
  if (y < 2020 || y > 2100) return null;
  return `${y}-${String(mo).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function mapVenueToSquareId(venueText: string): SquareId | null {
  const t = venueText.toLowerCase();
  if (t.includes("spanish")) return "spanish-springs";
  if (t.includes("lake sumter") || t.includes("sumter landing")) {
    return "lake-sumter";
  }
  if (t.includes("brownwood")) return "brownwood";
  if (t.includes("eastport")) return "eastport";
  if (t.includes("sawgrass")) return "sawgrass-grove";
  return null;
}

function parseActsFromTitle(
  title: string,
  blurb: string,
  start?: string,
  end?: string
): SquareAct[] {
  const parts = title.split("|").map((p) => p.trim()).filter(Boolean);
  if (parts.length <= 1) {
    return [
      {
        name: title.trim(),
        blurb: blurb || undefined,
        start,
        end,
      },
    ];
  }

  return parts.map((part, i) => {
    // e.g. "Greg Warren Trio 12:00 PM – 3:00 PM"
    const m = part.match(
      /^(.*?)\s+(\d{1,2}:\d{2}\s*[AaPp][Mm])\s*[–\-—]\s*(\d{1,2}:\d{2}\s*[AaPp][Mm])\s*$/
    );
    if (m) {
      return {
        name: m[1].trim(),
        blurb: i === 0 ? blurb || undefined : undefined,
        start: normalizeTime(m[2]),
        end: normalizeTime(m[3]),
      };
    }
    return {
      name: part,
      blurb: i === 0 ? blurb || undefined : undefined,
      start,
      end,
    };
  });
}

type RawEvent = {
  title: string;
  blurb: string;
  dateLabel: string;
  start?: string;
  end?: string;
  venue: string;
};

/** Parse MEC list markup from a nightly entertainment HTML page. */
export function parseEntertainmentHtml(html: string): RawEvent[] {
  const events: RawEvent[] = [];
  // Split on event titles
  const re =
    /<h3 class="mec-event-title">([\s\S]*?)<\/h3>([\s\S]*?)(?=<h3 class="mec-event-title">|$)/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    const title = stripTags(m[1]);
    const block = m[2] || "";
    if (!title || title.length < 2) continue;
    if (/^no event found/i.test(title)) continue;

    const blurbMatch = block.match(
      /class="mec-event-description"[^>]*>([\s\S]*?)<\/div>/i
    );
    const blurb = blurbMatch ? stripTags(blurbMatch[1]).slice(0, 280) : "";

    const dateMatch = block.match(
      /class="mec-start-date-label"[^>]*>([\s\S]*?)<\/span>/i
    );
    const dateLabel = dateMatch ? stripTags(dateMatch[1]) : "";

    const startMatch = block.match(
      /class="mec-start-time"[^>]*>([\s\S]*?)<\/span>/i
    );
    const endMatch = block.match(
      /class="mec-end-time"[^>]*>([\s\S]*?)<\/span>/i
    );
    const start = startMatch ? normalizeTime(stripTags(startMatch[1])) : undefined;
    const end = endMatch ? normalizeTime(stripTags(endMatch[1])) : undefined;

    // Venue: first <span>…</span> inside mec-venue-details after the svg
    let venue = "";
    const venueBlock = block.match(
      /class="mec-venue-details"[^>]*>([\s\S]*?)(?:<\/div>\s*<div class="mec-|$)/i
    );
    if (venueBlock) {
      const span = venueBlock[1].match(/<span>([\s\S]*?)<\/span>/i);
      if (span) venue = stripTags(span[1]);
      if (!venue) {
        const addr = venueBlock[1].match(
          /class="mec-event-address"[^>]*>[\s\S]*?<span>([\s\S]*?)<\/span>/i
        );
        if (addr) venue = stripTags(addr[1]);
      }
    }

    if (!dateLabel) continue;
    events.push({ title, blurb, dateLabel, start, end, venue });
  }
  return events;
}

function rawEventsToNights(raw: RawEvent[]): SquareNightLineup[] {
  // key: date|squareId
  const map = new Map<string, SquareNightLineup>();

  for (const ev of raw) {
    const date = parseLabelDate(ev.dateLabel);
    if (!date) continue;
    const squareId = mapVenueToSquareId(ev.venue || ev.title);
    if (!squareId) continue;

    const acts = parseActsFromTitle(ev.title, ev.blurb, ev.start, ev.end);
    const key = `${date}|${squareId}`;
    const existing = map.get(key);
    if (existing) {
      // Merge acts (avoid duplicate names)
      for (const act of acts) {
        if (!existing.acts.some((a) => a.name === act.name && a.start === act.start)) {
          existing.acts.push(act);
        }
      }
    } else {
      map.set(key, { date, squareId, acts });
    }
  }

  return [...map.values()].sort((a, b) => {
    const c = a.date.localeCompare(b.date);
    if (c !== 0) return c;
    return a.squareId.localeCompare(b.squareId);
  });
}

async function fetchHtml(url: string): Promise<string> {
  const res = await fetch(url, {
    cache: "no-store",
    headers: {
      "User-Agent":
        "TheVillagesEverythingApp/1.0 (+https://www.thevillageseverythingapp.com; entertainment schedule bot)",
      Accept: "text/html,application/xhtml+xml",
    },
    // Next.js may still try to cache; force dynamic via route
  });
  if (!res.ok) {
    throw new Error(`Fetch failed ${res.status} for ${url}`);
  }
  return await res.text();
}

/**
 * Pull official pages, parse events, persist schedule.
 * Returns the saved store.
 */
export async function refreshEntertainmentSchedule(options?: {
  source?: "cron" | "manual" | "stale";
}): Promise<EntertainmentScheduleStore> {
  const errors: string[] = [];
  const allRaw: RawEvent[] = [];

  for (const url of SOURCE_URLS) {
    try {
      const html = await fetchHtml(url);
      const parsed = parseEntertainmentHtml(html);
      allRaw.push(...parsed);
    } catch (err) {
      errors.push(
        err instanceof Error ? `${url}: ${err.message}` : String(err)
      );
    }
  }

  const nights = rawEventsToNights(allRaw);

  // If parse completely failed, keep previous store and record error
  if (nights.length === 0) {
    const prev = loadEntertainmentStore();
    const failed: EntertainmentScheduleStore = {
      updatedAt: prev?.updatedAt || new Date().toISOString(),
      sourceUrls: [...SOURCE_URLS],
      nights: prev?.nights || [],
      eventCount: prev?.eventCount || 0,
      lastError:
        errors.join("; ") ||
        "No events parsed from official entertainment pages",
    };
    // Only overwrite error state if we had previous data; still write error note
    if (prev?.nights?.length) {
      saveEntertainmentStore(failed);
      return failed;
    }
    throw new Error(failed.lastError || "Entertainment refresh failed");
  }

  const store: EntertainmentScheduleStore = {
    updatedAt: new Date().toISOString(),
    sourceUrls: [...SOURCE_URLS],
    nights,
    eventCount: allRaw.length,
    lastError: errors.length ? errors.join("; ") : null,
  };
  saveEntertainmentStore(store);
  return store;
}

/** True if store is missing or older than `maxAgeHours`. */
export function isEntertainmentStale(maxAgeHours = 20): boolean {
  const store = loadEntertainmentStore();
  if (!store?.updatedAt || !store.nights?.length) return true;
  const ageMs = Date.now() - new Date(store.updatedAt).getTime();
  return ageMs > maxAgeHours * 3600 * 1000;
}

/**
 * Ensure schedule is reasonably fresh. Safe to call from page renders.
 * Only blocks to refresh when stale.
 */
export async function ensureEntertainmentFresh(
  maxAgeHours = 20
): Promise<EntertainmentScheduleStore | null> {
  if (!isEntertainmentStale(maxAgeHours)) {
    return loadEntertainmentStore();
  }
  try {
    return await refreshEntertainmentSchedule({ source: "stale" });
  } catch (err) {
    console.error("[entertainment] refresh failed", err);
    return loadEntertainmentStore();
  }
}
