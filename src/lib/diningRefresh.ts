/**
 * Admin “Refresh restaurants”: pull public maps + dining guides for
 * The Villages area, merge into the live directory, never auto-delete.
 */

import crypto from "crypto";
import {
  loadDiningAsync,
  saveDiningAsync,
  slugify,
} from "./dining";
import {
  normalizeCuisine,
  type Cuisine,
  type PriceRange,
  type Restaurant,
} from "./diningTypes";
import type {
  DiningClosedCandidate,
  DiningRefreshChange,
  DiningRefreshResult,
} from "./diningRefreshTypes";

export type {
  DiningClosedCandidate,
  DiningRefreshChange,
  DiningRefreshResult,
} from "./diningRefreshTypes";

const OVERPASS_ENDPOINTS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
];

const GUIDE_URLS = [
  "https://onlyvillages.com/the-villages-dining-guide/",
  "https://onlyvillages.com/best-restaurants-the-villages/",
];

/** Sumter / Lake / Marion edge around The Villages. */
const BBOX = { south: 28.8, west: -82.12, north: 29.03, east: -81.82 };

const UA =
  "VillagesEverythingApp/1.0 (+https://www.thevillageseverythingapp.com; dining directory refresh)";

type ScrapedSpot = {
  name: string;
  cuisine?: Cuisine;
  area?: string;
  address?: string;
  phone?: string;
  website?: string;
  priceRange?: PriceRange;
  description?: string;
  tags?: string[];
  closed?: boolean;
  closedReason?: string;
  source: string;
};

function uid(prefix = "rest") {
  return `${prefix}-${Date.now().toString(36)}-${crypto.randomBytes(3).toString("hex")}`;
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
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/\s+/g, " ")
    .trim();
}

function stripTags(html: string): string {
  return decodeHtml(html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
}

export function nameKey(raw: string): string {
  return String(raw || "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(
      /\b(the|restaurant|restaurants|grill|grille|bar|cafe|café|bistro|kitchen|tavern|steakhouse|pizzeria|original)\b/g,
      " "
    )
    .replace(/\s+/g, " ")
    .trim();
}

function namesMatch(a: string, b: string): boolean {
  const ka = nameKey(a);
  const kb = nameKey(b);
  if (!ka || !kb) return false;
  if (ka === kb) return true;
  if (ka.length >= 5 && kb.length >= 5 && (ka.includes(kb) || kb.includes(ka))) {
    return true;
  }
  return false;
}

function formatPhone(raw: string): string {
  const d = String(raw || "").replace(/\D/g, "");
  const ten = d.length === 11 && d.startsWith("1") ? d.slice(1) : d;
  if (ten.length === 10) {
    return `(${ten.slice(0, 3)}) ${ten.slice(3, 6)}-${ten.slice(6)}`;
  }
  return String(raw || "").trim().slice(0, 40);
}

function phonesEqual(a?: string, b?: string): boolean {
  const da = String(a || "").replace(/\D/g, "").replace(/^1/, "");
  const db = String(b || "").replace(/\D/g, "").replace(/^1/, "");
  return Boolean(da && db && da === db);
}

function cleanUrl(raw?: string): string | undefined {
  const t = String(raw || "").trim();
  if (!t) return undefined;
  if (/^https?:\/\//i.test(t)) return t.slice(0, 200);
  if (/^www\./i.test(t)) return `https://${t}`.slice(0, 200);
  return undefined;
}

function inferArea(address: string, fallback = "The Villages"): string {
  const t = `${address} ${fallback}`.toLowerCase();
  if (t.includes("spanish spring")) return "Spanish Springs";
  if (
    t.includes("lake sumter") ||
    t.includes("sumter landing") ||
    t.includes("old camp") ||
    t.includes("canal st")
  ) {
    return "Lake Sumter Landing";
  }
  if (t.includes("brownwood")) return "Brownwood";
  if (t.includes("sawgrass")) return "Sawgrass Grove";
  if (t.includes("eastport")) return "Eastport";
  if (t.includes("middleton")) return "Middleton";
  if (t.includes("lady lake")) return "Lady Lake";
  if (t.includes("wildwood")) return "Wildwood";
  if (t.includes("fruitland")) return "Fruitland Park";
  if (t.includes("leesburg")) return "Leesburg";
  if (t.includes("oxford")) return "Oxford";
  if (t.includes("the villages")) return "The Villages";
  return fallback || "The Villages";
}

function mapCuisine(raw: string, amenity?: string): Cuisine {
  const t = `${raw} ${amenity || ""}`.toLowerCase();
  if (/\bbbq\b|barbecue|barbeque/.test(t)) return "Barbecue";
  if (/\bpizza\b/.test(t)) return "Pizza";
  if (/\bburger/.test(t)) return "Burgers";
  if (/\bsteak/.test(t)) return "Steakhouse";
  if (/\bseafood|fish|oyster|lobster/.test(t)) return "Seafood";
  if (/\bmexican|taco|tex-mex/.test(t)) return "Mexican";
  if (/\bcuban/.test(t)) return "Cuban";
  if (/\birish/.test(t)) return "Irish";
  if (/\bgreek/.test(t)) return "Greek";
  if (/\bindian/.test(t)) return "Indian";
  if (/\bitalian|pasta/.test(t)) return "Italian";
  if (/\bcaribbean|jamaican|cuban/.test(t)) return "Caribbean";
  if (/\blatin|brazilian|peruvian|argentin/.test(t)) return "Latin American";
  if (/\bmediterranean|lebanese|turkish|falafel/.test(t)) return "Mediterranean";
  if (/\bsushi|japanese|chinese|thai|korean|vietnamese|asian|hibachi/.test(t)) {
    return "Asian";
  }
  if (/\bbakery|pastry|donut|dessert/.test(t)) return "Bakery";
  if (/\bbreakfast|brunch|pancake|omelet/.test(t)) return "Breakfast";
  if (/\bsouthern|soul_food|soul food/.test(t)) return "Southern";
  if (amenity === "fast_food" || /\bfast.?food/.test(t)) return "Fast food";
  if (amenity === "cafe" || /\bcafe|coffee/.test(t)) return "Breakfast";
  return normalizeCuisine(raw);
}

function osmAddress(tags: Record<string, string>): string | undefined {
  const line = [
    tags["addr:housenumber"],
    tags["addr:street"],
  ]
    .filter(Boolean)
    .join(" ")
    .trim();
  const city = tags["addr:city"] || tags["addr:town"] || "";
  const state = tags["addr:state"] || "FL";
  const zip = tags["addr:postcode"] || "";
  const parts = [line, [city, state, zip].filter(Boolean).join(" ")]
    .map((p) => p.trim())
    .filter(Boolean);
  return parts.length ? parts.join(", ") : tags["addr:full"] || undefined;
}

async function fetchText(
  url: string,
  opts?: { accept?: string; timeoutMs?: number }
): Promise<string> {
  const res = await fetch(url, {
    headers: {
      "User-Agent": UA,
      Accept: opts?.accept || "text/html,application/xhtml+xml",
    },
    cache: "no-store",
    signal: AbortSignal.timeout(opts?.timeoutMs || 25000),
  });
  if (!res.ok) throw new Error(`${url} → ${res.status}`);
  return res.text();
}

async function fetchOverpass(): Promise<ScrapedSpot[]> {
  const query = `
[out:json][timeout:35];
(
  nwr["amenity"~"^(restaurant|cafe|fast_food|pub)$"](${BBOX.south},${BBOX.west},${BBOX.north},${BBOX.east});
  nwr["shop"="bakery"](${BBOX.south},${BBOX.west},${BBOX.north},${BBOX.east});
  nwr["disused:amenity"~"^(restaurant|cafe|fast_food|pub)$"](${BBOX.south},${BBOX.west},${BBOX.north},${BBOX.east});
  nwr["abandoned:amenity"~"^(restaurant|cafe|fast_food|pub)$"](${BBOX.south},${BBOX.west},${BBOX.north},${BBOX.east});
);
out center tags;
`.trim();

  let lastErr = "Overpass failed";
  for (const endpoint of OVERPASS_ENDPOINTS) {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "User-Agent": UA,
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `data=${encodeURIComponent(query)}`,
        cache: "no-store",
        signal: AbortSignal.timeout(35000),
      });
      if (!res.ok) {
        lastErr = `Overpass ${res.status}`;
        continue;
      }
      const json = (await res.json()) as {
        elements?: Array<{ tags?: Record<string, string> }>;
      };
      const spots: ScrapedSpot[] = [];
      for (const el of json.elements || []) {
        const tags = el.tags || {};
        const name = (tags.name || "").trim();
        if (name.length < 2) continue;
        const disused = Boolean(
          tags["disused:amenity"] || tags["abandoned:amenity"]
        );
        const hours = String(tags.opening_hours || "").toLowerCase();
        const closed =
          disused ||
          hours === "closed" ||
          hours.includes("permanently closed");
        const amenity =
          tags.amenity ||
          tags["disused:amenity"] ||
          tags["abandoned:amenity"] ||
          (tags.shop === "bakery" ? "bakery" : "");
        const address = osmAddress(tags);
        spots.push({
          name,
          cuisine: mapCuisine(tags.cuisine || tags.shop || "", amenity),
          area: inferArea(address || "", tags["addr:city"] || "The Villages"),
          address,
          phone: tags.phone || tags["contact:phone"]
            ? formatPhone(tags.phone || tags["contact:phone"])
            : undefined,
          website: cleanUrl(tags.website || tags["contact:website"]),
          description: tags.description
            ? String(tags.description).slice(0, 2000)
            : undefined,
          tags: amenity ? [amenity] : [],
          closed,
          closedReason: closed
            ? disused
              ? "OpenStreetMap marks this amenity as disused or abandoned."
              : "OpenStreetMap lists opening hours as permanently closed."
            : undefined,
          source: "OpenStreetMap",
        });
      }
      return spots;
    } catch (err) {
      lastErr = err instanceof Error ? err.message : String(err);
    }
  }
  throw new Error(lastErr);
}

function currentAreaFromHeading(text: string): string | null {
  const t = text.toLowerCase();
  if (t.includes("coming soon")) return "__coming_soon__";
  if (t.includes("spanish spring")) return "Spanish Springs";
  if (t.includes("lake sumter") || t.includes("sumter landing")) {
    return "Lake Sumter Landing";
  }
  if (t.includes("brownwood")) return "Brownwood";
  if (t.includes("sawgrass")) return "Sawgrass Grove";
  if (t.includes("eastport")) return "Eastport";
  if (t.includes("middleton")) return "Middleton";
  if (t.includes("golf-cart") || t.includes("other")) return "The Villages";
  return null;
}

function parseGuideHtml(html: string, sourceUrl: string): ScrapedSpot[] {
  const spots: ScrapedSpot[] = [];
  let area = "The Villages";
  const comingSoon = new Set<string>();

  const headingRe = /<h[1-4][^>]*>([\s\S]*?)<\/h[1-4]>/gi;
  const headings: { index: number; area: string }[] = [];
  let hm: RegExpExecArray | null;
  while ((hm = headingRe.exec(html))) {
    const mapped = currentAreaFromHeading(stripTags(hm[1]));
    if (mapped) headings.push({ index: hm.index, area: mapped });
  }

  function areaAt(idx: number): string {
    let found = "The Villages";
    for (const h of headings) {
      if (h.index <= idx) found = h.area;
    }
    return found;
  }

  const linkRe =
    /<a[^>]+href=["']([^"']*\/places\/[^"']+)["'][^>]*>([\s\S]*?)<\/a>([\s\S]{0,400})/gi;
  let m: RegExpExecArray | null;
  while ((m = linkRe.exec(html))) {
    const name = stripTags(m[2]).replace(/\s+/g, " ").trim();
    if (name.length < 2 || name.length > 80) continue;
    if (/^best restaurants/i.test(name)) continue;
    area = areaAt(m.index);
    const after = stripTags(m[3]).replace(/^[\s—–\-:*]+/, "").slice(0, 500);
    const description = after
      .replace(/\s*Looking for the top picks.*$/i, "")
      .trim();
    if (area === "__coming_soon__") {
      comingSoon.add(name);
      continue;
    }
    spots.push({
      name,
      cuisine: mapCuisine(`${name} ${description}`),
      area,
      description: description || undefined,
      website: m[1].startsWith("http")
        ? m[1]
        : `https://onlyvillages.com${m[1]}`,
      source: sourceUrl,
    });
  }

  // Stash coming-soon names as closed=false skip via tags
  for (const name of comingSoon) {
    spots.push({
      name,
      area: "The Villages",
      tags: ["coming-soon"],
      source: sourceUrl,
    });
  }
  return spots;
}

async function fetchGuides(): Promise<ScrapedSpot[]> {
  const pages = await Promise.allSettled(
    GUIDE_URLS.map((url) => fetchText(url, { timeoutMs: 20000 }))
  );
  const all: ScrapedSpot[] = [];
  pages.forEach((result, i) => {
    if (result.status === "fulfilled") {
      all.push(...parseGuideHtml(result.value, GUIDE_URLS[i]));
    }
  });
  if (!all.length) throw new Error("Dining guides returned no restaurants");
  return all;
}

function mergeScraped(spots: ScrapedSpot[]): ScrapedSpot[] {
  const byKey = new Map<string, ScrapedSpot>();
  for (const spot of spots) {
    const key = nameKey(spot.name);
    if (!key) continue;
    const prev = byKey.get(key);
    if (!prev) {
      byKey.set(key, { ...spot });
      continue;
    }
    byKey.set(key, {
      ...prev,
      name: prev.name.length >= spot.name.length ? prev.name : spot.name,
      cuisine: prev.cuisine && prev.cuisine !== "American" ? prev.cuisine : spot.cuisine,
      area:
        prev.area && prev.area !== "The Villages" ? prev.area : spot.area,
      address: prev.address || spot.address,
      phone: prev.phone || spot.phone,
      website: prev.website?.includes("onlyvillages.com")
        ? spot.website || prev.website
        : prev.website || spot.website,
      description:
        (prev.description?.length || 0) >= (spot.description?.length || 0)
          ? prev.description
          : spot.description,
      tags: [...new Set([...(prev.tags || []), ...(spot.tags || [])])],
      closed: Boolean(prev.closed || spot.closed),
      closedReason: prev.closedReason || spot.closedReason,
      source: prev.source === spot.source ? prev.source : `${prev.source}; ${spot.source}`,
    });
  }
  return [...byKey.values()];
}

function findExisting(list: Restaurant[], name: string): Restaurant | undefined {
  return list.find((r) => namesMatch(r.name, name));
}

function websiteLooksDead(status: number): boolean {
  return status === 404 || status === 410 || status === 0;
}

async function probeWebsite(url?: string): Promise<number | null> {
  const href = cleanUrl(url);
  if (!href) return null;
  try {
    const res = await fetch(href, {
      method: "HEAD",
      redirect: "follow",
      headers: { "User-Agent": UA },
      cache: "no-store",
      signal: AbortSignal.timeout(6000),
    });
    return res.status;
  } catch {
    try {
      const res = await fetch(href, {
        method: "GET",
        redirect: "follow",
        headers: { "User-Agent": UA, Accept: "text/html" },
        cache: "no-store",
        signal: AbortSignal.timeout(6000),
      });
      return res.status;
    } catch {
      return 0;
    }
  }
}

function defaultDescription(spot: ScrapedSpot): string {
  const cuisine = (spot.cuisine || "American").toLowerCase();
  const area = spot.area || "The Villages";
  return `${spot.name} is a ${cuisine} restaurant in ${area}.`;
}

export async function refreshDiningDirectory(): Promise<DiningRefreshResult> {
  const errors: string[] = [];
  const sources: string[] = [
    "OpenStreetMap Overpass",
    ...GUIDE_URLS,
  ];
  const scraped: ScrapedSpot[] = [];

  const [osmResult, guideResult] = await Promise.allSettled([
    fetchOverpass(),
    fetchGuides(),
  ]);
  if (osmResult.status === "fulfilled") {
    scraped.push(...osmResult.value);
  } else {
    errors.push(
      `Maps: ${
        osmResult.reason instanceof Error
          ? osmResult.reason.message
          : "could not load OpenStreetMap"
      }`
    );
  }
  if (guideResult.status === "fulfilled") {
    scraped.push(...guideResult.value);
  } else {
    errors.push(
      `Guides: ${
        guideResult.reason instanceof Error
          ? guideResult.reason.message
          : "could not load dining guides"
      }`
    );
  }

  if (!scraped.length) {
    throw new Error(
      errors.join(" · ") || "Could not reach any restaurant data sources"
    );
  }

  const merged = mergeScraped(scraped);
  const comingSoon = new Set(
    merged.filter((s) => s.tags?.includes("coming-soon")).map((s) => s.name)
  );
  const live = merged.filter((s) => !s.tags?.includes("coming-soon"));

  const data = await loadDiningAsync();
  const now = new Date().toISOString();
  const added: DiningRefreshResult["added"] = [];
  const updated: DiningRefreshChange[] = [];
  const closedFromMaps: DiningClosedCandidate[] = [];

  for (const spot of live) {
    if (comingSoon.has(spot.name)) continue;
    const existing = findExisting(data.restaurants, spot.name);

    if (spot.closed && existing) {
      closedFromMaps.push({
        id: existing.id,
        name: existing.name,
        area: existing.area,
        reason:
          spot.closedReason ||
          "Public map data says this restaurant is no longer operating.",
        evidence: `Source: ${spot.source}`,
      });
      continue;
    }

    if (!existing) {
      if (spot.closed) continue;
      const cuisine = spot.cuisine || "American";
      const area = spot.area || "The Villages";
      let slug = slugify(spot.name);
      if (data.restaurants.some((r) => r.slug === slug)) {
        slug = `${slug}-${Date.now().toString(36)}`;
      }
      data.restaurants.unshift({
        id: uid("rest"),
        name: spot.name.slice(0, 120),
        slug,
        cuisine,
        tags: (spot.tags || []).filter((t) => t !== "coming-soon").slice(0, 12),
        area: area.slice(0, 80),
        address: spot.address?.slice(0, 160),
        phone: spot.phone?.slice(0, 40),
        website: spot.website?.slice(0, 200),
        priceRange: spot.priceRange || "$$",
        description: (spot.description || defaultDescription(spot)).slice(0, 2000),
        specialties: [],
        featured: false,
        createdAt: now,
        updatedAt: now,
      });
      added.push({ name: spot.name, area, cuisine });
      continue;
    }

    const fields: string[] = [];
    const next: Restaurant = { ...existing };
    if (spot.address && spot.address !== existing.address) {
      next.address = spot.address.slice(0, 160);
      fields.push("address");
    }
    if (spot.phone && !phonesEqual(spot.phone, existing.phone)) {
      next.phone = spot.phone.slice(0, 40);
      fields.push("phone");
    }
    if (
      spot.website &&
      !spot.website.includes("onlyvillages.com") &&
      spot.website !== existing.website
    ) {
      next.website = spot.website.slice(0, 200);
      fields.push("website");
    }
    if (
      spot.cuisine &&
      spot.cuisine !== existing.cuisine &&
      (existing.cuisine === "American" || !existing.cuisine)
    ) {
      next.cuisine = spot.cuisine;
      fields.push("cuisine");
    }
    if (spot.area && spot.area !== "The Villages" && spot.area !== existing.area) {
      next.area = spot.area.slice(0, 80);
      fields.push("area");
    }
    if (
      spot.description &&
      spot.description.length > 40 &&
      (!existing.description || existing.description.length < 40)
    ) {
      next.description = spot.description.slice(0, 2000);
      fields.push("description");
    }
    if (fields.length) {
      next.updatedAt = now;
      const idx = data.restaurants.findIndex((r) => r.id === existing.id);
      if (idx >= 0) data.restaurants[idx] = next;
      updated.push({ name: existing.name, fields });
    }
  }

  const unmatched = data.restaurants.filter(
    (r) => !live.some((s) => namesMatch(s.name, r.name))
  );

  const closedCandidates = [...closedFromMaps];
  const seenIds = new Set(closedCandidates.map((c) => c.id));

  for (const rest of unmatched.slice(0, 8)) {
    if (seenIds.has(rest.id)) continue;
    const status = await probeWebsite(rest.website);
    if (status == null) continue;
    if (!websiteLooksDead(status)) continue;
    closedCandidates.push({
      id: rest.id,
      name: rest.name,
      area: rest.area,
      reason:
        "This listing was not found in current maps or dining guides, and its website did not load.",
      evidence:
        status === 0
          ? `${rest.website || "No website"} did not respond.`
          : `${rest.website} returned HTTP ${status}.`,
    });
    seenIds.add(rest.id);
  }

  await saveDiningAsync(data);

  return {
    ok: true,
    added,
    updated,
    skippedComingSoon: [...comingSoon],
    closedCandidates,
    sources,
    errors,
    restaurantCount: data.restaurants.length,
  };
}
