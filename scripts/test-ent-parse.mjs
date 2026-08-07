const urls = [
  "https://www.thevillagesentertainment.com/nightly-entertainment/",
  "https://www.thevillagesentertainment.com/spanish-springs/",
];

function stripTags(html) {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#8217;/g, "'")
    .replace(/&#8211;/g, "–")
    .replace(/\s+/g, " ")
    .trim();
}

function mapVenue(t) {
  t = t.toLowerCase();
  if (t.includes("spanish")) return "spanish-springs";
  if (t.includes("sumter")) return "lake-sumter";
  if (t.includes("brownwood")) return "brownwood";
  if (t.includes("eastport")) return "eastport";
  if (t.includes("sawgrass")) return "sawgrass-grove";
  return null;
}

let total = 0;
let mapped = 0;

for (const url of urls) {
  const html = await (
    await fetch(url, { headers: { "User-Agent": "test" } })
  ).text();
  const re =
    /<h3 class="mec-event-title">([\s\S]*?)<\/h3>([\s\S]*?)(?=<h3 class="mec-event-title">|$)/gi;
  let m;
  let c = 0;
  while ((m = re.exec(html))) {
    c++;
    total++;
    const title = stripTags(m[1]);
    const block = m[2];
    const date = (block.match(
      /class="mec-start-date-label"[^>]*>([\s\S]*?)<\/span>/i
    ) || [])[1];
    const venueM = block.match(
      /class="mec-venue-details"[^>]*>([\s\S]*?)(?:<\/div>\s*<div class="mec-|$)/i
    );
    let venue = "";
    if (venueM) {
      const s = venueM[1].match(/<span>([\s\S]*?)<\/span>/i);
      if (s) venue = stripTags(s[1]);
    }
    const sid = mapVenue(venue);
    if (sid) mapped++;
    if (c <= 4) {
      console.log(
        title,
        "|",
        stripTags(date || ""),
        "|",
        venue,
        "=>",
        sid
      );
    }
  }
  console.log("URL", url, "events", c);
}

console.log("total", total, "mapped", mapped);
