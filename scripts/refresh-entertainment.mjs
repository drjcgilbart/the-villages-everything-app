/**
 * One-shot local refresh of town-square entertainment schedule.
 * Usage: node scripts/refresh-entertainment.mjs
 *
 * Production uses Vercel Cron → GET /api/entertainment/refresh daily.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "..", "data", "entertainment-schedule.json");

const SOURCE_URLS = [
  "https://www.thevillagesentertainment.com/nightly-entertainment/",
  "https://www.thevillagesentertainment.com/spanish-springs/",
];

function decodeHtml(s) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&#8217;/g, "'")
    .replace(/&#8211;/g, "–")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/\s+/g, " ")
    .trim();
}

function stripTags(html) {
  return decodeHtml(html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
}

function normalizeTime(raw) {
  const t = raw.trim().toLowerCase().replace(/\./g, "");
  const m = t.match(/^(\d{1,2}):(\d{2})\s*(am|pm)$/i);
  if (!m) return raw.trim();
  return `${Number(m[1])}:${m[2]} ${m[3].toUpperCase()}`;
}

function parseLabelDate(label) {
  const d = new Date(label.replace(/\s+/g, " ").trim());
  if (Number.isNaN(d.getTime())) return null;
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function mapVenue(text) {
  const t = text.toLowerCase();
  if (t.includes("spanish")) return "spanish-springs";
  if (t.includes("lake sumter") || t.includes("sumter landing")) return "lake-sumter";
  if (t.includes("brownwood")) return "brownwood";
  if (t.includes("eastport")) return "eastport";
  if (t.includes("sawgrass")) return "sawgrass-grove";
  return null;
}

function parseActs(title, blurb, start, end) {
  const parts = title.split("|").map((p) => p.trim()).filter(Boolean);
  if (parts.length <= 1) {
    return [{ name: title.trim(), blurb: blurb || undefined, start, end }];
  }
  return parts.map((part, i) => {
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

function parseHtml(html) {
  const events = [];
  const re =
    /<h3 class="mec-event-title">([\s\S]*?)<\/h3>([\s\S]*?)(?=<h3 class="mec-event-title">|$)/gi;
  let m;
  while ((m = re.exec(html))) {
    const title = stripTags(m[1]);
    const block = m[2] || "";
    if (!title || /^no event found/i.test(title)) continue;
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
    const start = startMatch
      ? normalizeTime(stripTags(startMatch[1]))
      : undefined;
    const end = endMatch ? normalizeTime(stripTags(endMatch[1])) : undefined;
    let venue = "";
    const venueBlock = block.match(
      /class="mec-venue-details"[^>]*>([\s\S]*?)(?:<\/div>\s*<div class="mec-|$)/i
    );
    if (venueBlock) {
      const span = venueBlock[1].match(/<span>([\s\S]*?)<\/span>/i);
      if (span) venue = stripTags(span[1]);
    }
    if (!dateLabel) continue;
    events.push({ title, blurb, dateLabel, start, end, venue });
  }
  return events;
}

const allRaw = [];
for (const url of SOURCE_URLS) {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "TheVillagesEverythingApp/1.0 entertainment refresh",
    },
  });
  if (!res.ok) throw new Error(`Fetch failed ${res.status} ${url}`);
  const html = await res.text();
  const parsed = parseHtml(html);
  console.log(url, "→", parsed.length, "events");
  allRaw.push(...parsed);
}

const map = new Map();
for (const ev of allRaw) {
  const date = parseLabelDate(ev.dateLabel);
  const squareId = mapVenue(ev.venue || "");
  if (!date || !squareId) continue;
  const acts = parseActs(ev.title, ev.blurb, ev.start, ev.end);
  const key = `${date}|${squareId}`;
  const existing = map.get(key);
  if (existing) {
    for (const act of acts) {
      if (
        !existing.acts.some((a) => a.name === act.name && a.start === act.start)
      ) {
        existing.acts.push(act);
      }
    }
  } else {
    map.set(key, { date, squareId, acts });
  }
}

const nights = [...map.values()].sort(
  (a, b) => a.date.localeCompare(b.date) || a.squareId.localeCompare(b.squareId)
);

const store = {
  updatedAt: new Date().toISOString(),
  sourceUrls: SOURCE_URLS,
  nights,
  eventCount: allRaw.length,
  lastError: null,
};

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(store, null, 2), "utf8");
console.log("Wrote", OUT);
console.log("nights", nights.length, "raw events", allRaw.length);
