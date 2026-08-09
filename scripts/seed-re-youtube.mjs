import fs from "fs";
import path from "path";

const creators = [
  { id: "ira-miller", channelId: "UCA9UhkWKJAOhiaBETs51XEg" },
  { id: "robyn-cavallaro", channelId: "UCzva_dnyNNgkESClIew-QAA" },
];

function score(title) {
  const t = title.toLowerCase();
  let s = 0;
  if (/\bthe villages\b/.test(t)) s += 50;
  if (/\bvillages\b/.test(t)) s += 30;
  if (/\bvillage of\b/.test(t)) s += 20;
  for (const p of [
    "lady lake",
    "sumter",
    "brownwood",
    "spanish springs",
    "lake sumter",
    "eastport",
    "fenney",
    "middleton",
  ]) {
    if (t.includes(p)) s += 15;
  }
  for (const p of [
    "home tour",
    "house tour",
    "open house",
    "for sale",
    "virtual tour",
    "real estate",
    "realtor",
    "listing",
    "new construction",
    "cost of living",
    "bond",
    "market update",
    "moving to",
  ]) {
    if (t.includes(p)) s += 8;
  }
  if (/#shorts\b/.test(t) || t.includes(" #short")) s -= 12;
  return s;
}

function parse(xml) {
  const entries = [];
  for (const block of xml.split(/<entry[\s>]/i).slice(1)) {
    const end = block.indexOf("</entry>");
    const chunk = end >= 0 ? block.slice(0, end) : block;
    const videoId =
      chunk.match(/<yt:videoId>([^<]+)<\/yt:videoId>/i)?.[1]?.trim() ||
      chunk.match(/<id>yt:video:([^<]+)<\/id>/i)?.[1]?.trim() ||
      "";
    const title = (
      chunk.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1] || "Untitled"
    )
      .replace(/&amp;/g, "&")
      .replace(/&#39;/g, "'")
      .replace(/&quot;/g, '"');
    const publishedAt =
      chunk.match(/<published>([^<]+)<\/published>/i)?.[1] ||
      new Date().toISOString();
    if (videoId) entries.push({ videoId, title, publishedAt });
  }
  return entries;
}

const out = {
  updatedAt: new Date().toISOString(),
  source: "manual",
  lastError: null,
  creators: {},
};

for (const c of creators) {
  const url = `https://www.youtube.com/feeds/videos.xml?channel_id=${c.channelId}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`RSS ${res.status} ${c.id}`);
  const xml = await res.text();
  const entries = parse(xml);
  const matches = entries
    .map((e, i) => ({ e, i, score: score(e.title) }))
    .filter((x) => x.score >= 20)
    .sort((a, b) => b.score - a.score || a.i - b.i);
  const pick = matches[0]?.e || entries[0];
  out.creators[c.id] = {
    video: pick
      ? {
          videoId: pick.videoId,
          title: pick.title,
          publishedAt: pick.publishedAt,
          pickReason: matches[0] ? "villages-match" : "latest",
        }
      : null,
    fetchedAt: new Date().toISOString(),
    candidatesChecked: entries.length,
  };
  console.log(
    c.id,
    "->",
    out.creators[c.id].video?.pickReason,
    out.creators[c.id].video?.title
  );
}

const file = path.join(process.cwd(), "data", "real-estate-youtube.json");
fs.writeFileSync(file, JSON.stringify(out, null, 2));
console.log("wrote", file);
