import { MAIN_TOPICS, TOPICS } from "./topics";
import { VILLAGES, VILLAGE_REGIONS } from "./villages";
import { TOWN_SQUARES } from "./townSquares";
import { REC_CENTERS } from "./recCenters";
import { POPULAR_CLUBS } from "./clubs";
import { GOLF_COURSES } from "./golfClubTypes";
import { PICKLEBALL_COURTS } from "./pickleballTypes";
import { loadDining } from "./dining";
import { listApprovedServices } from "./localServices";
import { getVisibleThreads, getCategoryById } from "./forum";
import { getApprovedListings } from "./yardSale";
import { getPosts } from "./content";

export type SiteHit = {
  title: string;
  href: string;
  snippet: string;
  section: string;
  score: number;
};

function tokens(q: string) {
  return String(q || "")
    .toLowerCase()
    .replace(/[^a-z0-9+#\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1)
    .slice(0, 8);
}

function clip(s: string, n: number) {
  const t = String(s || "").replace(/\s+/g, " ").trim();
  return t.length <= n ? t : `${t.slice(0, n - 1)}…`;
}

function scoreText(hay: string, toks: string[], weight = 1) {
  const h = hay.toLowerCase();
  let s = 0;
  for (const t of toks) {
    if (!t) continue;
    if (h.includes(t)) s += 2 * weight;
    if (h.split(/\s+/).includes(t)) s += 1 * weight;
  }
  return s;
}

type Raw = { title: string; href: string; snippet: string; section: string; extra?: string };

let cached: { at: number; rows: Raw[] } | null = null;

function collect(): Raw[] {
  if (cached && Date.now() - cached.at < 60_000) return cached.rows;
  const out: Raw[] = [];
  const add = (row: Raw) => {
    if (row.title && row.href) out.push(row);
  };

  add({
    title: "Home",
    href: "/",
    snippet: "The Villages Everything App — dining, golf, rec centers, calendar, neighbors.",
    section: "Pages",
  });
  add({
    title: "My Retirement Reboot",
    href: "/about",
    snippet: "The story, photos, videos, and jokes behind this neighbor-built app.",
    section: "Pages",
  });
  add({
    title: "My Space",
    href: "/my-space",
    snippet: "Private member notebook: health, gym, journal, yard sale, photos.",
    section: "Pages",
  });
  add({
    title: "Support / membership",
    href: "/donate",
    snippet: "Plans, tips, and how to keep the lights on.",
    section: "Pages",
  });
  add({
    title: "Golf Cart Hero",
    href: "/golf-cart-hero",
    snippet: "The cart chase game. Sprinklers, vans, and Florida chaos.",
    section: "Pages",
  });
  add({
    title: "Forums",
    href: "/forums",
    snippet: "Neighbor talk by topic.",
    section: "Pages",
  });
  add({
    title: "News",
    href: "/news",
    snippet: "Local headlines with a Villages filter.",
    section: "Pages",
  });
  add({
    title: "Safety",
    href: "/safety",
    snippet: "Scams, alerts, and how to report trouble.",
    section: "Pages",
  });
  add({
    title: "Official map",
    href: "/official-map",
    snippet: "District map of The Villages.",
    section: "Pages",
  });

  for (const t of MAIN_TOPICS) {
    add({
      title: t.label,
      href: t.href,
      snippet: t.blurb,
      section: "Pages",
    });
  }
  for (const t of TOPICS) {
    add({
      title: t.title,
      href: t.href,
      snippet: `${t.description} ${t.highlights.map((h) => h.title).join(" ")}`,
      section: "Pages",
      extra: t.tags.join(" "),
    });
  }

  for (const r of VILLAGE_REGIONS) {
    add({
      title: r.label,
      href: "/my-village",
      snippet: r.description,
      section: "Villages",
      extra: r.nearestSquare,
    });
  }
  for (const v of VILLAGES) {
    add({
      title: v.name,
      href: `/my-village/${v.slug}`,
      snippet: v.blurb,
      section: "Villages",
      extra: `${v.region} ${v.county} ${(v.highlights || []).join(" ")}`,
    });
  }

  for (const s of TOWN_SQUARES) {
    add({
      title: s.name,
      href: `/town-squares/${s.id}`,
      snippet: s.blurb,
      section: "Town Squares",
      extra: `${s.area} ${s.theme} ${s.address}`,
    });
  }

  for (const c of REC_CENTERS) {
    add({
      title: c.name,
      href: `/rec-centers/${c.id}`,
      snippet: c.blurb,
      section: "Rec Centers",
      extra: `${c.shortName} ${c.address} ${(c.amenities || []).join(" ")}`,
    });
  }

  for (const c of POPULAR_CLUBS) {
    add({
      title: c.name,
      href: c.href || "/club-zone",
      snippet: c.blurb,
      section: "Clubs",
      extra: `${c.category} ${c.areaHint}`,
    });
  }

  for (const name of GOLF_COURSES) {
    if (!name || name.toLowerCase().includes("other")) continue;
    add({
      title: name,
      href: "/golf-zone",
      snippet: "Golf course in The Villages — see Golf Zone for tee times and neighbor notes.",
      section: "Golf",
    });
  }

  for (const c of PICKLEBALL_COURTS) {
    add({
      title: c.name,
      href: "/pickleball",
      snippet: c.note || "Pickleball courts in The Villages.",
      section: "Pickleball",
      extra: c.address || "",
    });
  }

  try {
    for (const r of loadDining().restaurants || []) {
      add({
        title: r.name,
        href: `/dining/${r.slug}`,
        snippet: `${r.cuisine || "Dining"} · ${r.area || ""}`.trim(),
        section: "Dining",
        extra: `${(r.tags || []).join(" ")} ${r.address || ""}`,
      });
    }
  } catch {
    /* dining file optional */
  }

  try {
    for (const l of listApprovedServices()) {
      add({
        title: l.businessName,
        href: "/local-pros",
        snippet: `${l.category} · ${l.village || l.serviceArea || "The Villages"}`,
        section: "Local Pros",
        extra: l.description || "",
      });
    }
  } catch {
    /* services optional */
  }

  try {
    for (const t of getVisibleThreads()) {
      const cat = getCategoryById(t.categoryId);
      add({
        title: t.title,
        href: `/forums/${cat?.slug || "talk"}/${t.id}`,
        snippet: clip(t.body || "", 140),
        section: "Forums",
        extra: cat?.title || "",
      });
    }
  } catch {
    /* forum optional */
  }

  try {
    for (const l of getApprovedListings()) {
      add({
        title: l.title,
        href: `/yard-sale/${l.id}`,
        snippet: clip(l.description || "Yard sale listing", 140),
        section: "Yard Sale",
      });
    }
  } catch {
    /* yard sale optional */
  }

  try {
    for (const p of getPosts()) {
      add({
        title: p.title,
        href: `/blog/${p.slug}`,
        snippet: p.excerpt || clip(p.body || "", 140),
        section: p.type === "vlog" ? "Videos" : "Blog",
        extra: (p.tags || []).join(" "),
      });
    }
  } catch {
    /* content optional */
  }

  cached = { at: Date.now(), rows: out };
  return out;
}

export function searchSite(query: string, limit = 20): SiteHit[] {
  const toks = tokens(query);
  if (!toks.length) return [];
  const hits: SiteHit[] = [];
  for (const row of collect()) {
    const titleScore = scoreText(row.title, toks, 4);
    const bodyScore = scoreText(`${row.snippet} ${row.extra || ""} ${row.section}`, toks, 1);
    const score = titleScore + bodyScore;
    if (score < 2) continue;
    hits.push({
      title: row.title,
      href: row.href,
      snippet: clip(row.snippet, 160),
      section: row.section,
      score,
    });
  }
  hits.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));
  const seen = new Set<string>();
  const unique: SiteHit[] = [];
  for (const h of hits) {
    const key = `${h.href}|${h.title}`;
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(h);
    if (unique.length >= limit) break;
  }
  return unique;
}
