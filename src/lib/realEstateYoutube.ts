/**
 * Real Estate YouTube creators — latest video cache.
 * Daily refresh pulls public YouTube RSS (no API key) and prefers
 * titles that look Villages / Florida home-related.
 */

import { readJsonFile, writeJsonFile, writeJsonFileAsync } from "./dataFs";

export type RealEstateYoutubeCreator = {
  id: string;
  name: string;
  aka?: string;
  handle: string;
  channelUrl: string;
  /** Stable YouTube channel id (UC…) for RSS + uploads playlist */
  channelId: string;
  blurb: string;
};

export type CachedYoutubeVideo = {
  videoId: string;
  title: string;
  publishedAt: string;
  /** Why this video was chosen (latest vs villages-keyword match) */
  pickReason: "villages-match" | "latest";
};

export type RealEstateYoutubeCache = {
  updatedAt: string | null;
  source: "cron" | "manual" | "soft" | null;
  lastError: string | null;
  creators: Record<
    string,
    {
      video: CachedYoutubeVideo | null;
      fetchedAt: string;
      candidatesChecked: number;
    }
  >;
};

export type RealEstateYoutubeCreatorWithVideo = RealEstateYoutubeCreator & {
  latestVideo: CachedYoutubeVideo | null;
  /** Always-on playlist of channel uploads (YouTube keeps this current) */
  uploadsPlaylistId: string;
};

const CACHE_FILE = "real-estate-youtube.json";
/** Soft-refresh if older than this many hours (local + first visitor) */
const STALE_HOURS = 20;

export const REAL_ESTATE_YOUTUBE_CREATORS: RealEstateYoutubeCreator[] = [
  {
    id: "jerry-and-linda",
    name: "THE VILLAGES FLORIDA NEWCOMERS",
    aka: "Jerry and Linda",
    handle: "@JERRYANDLINDA",
    channelUrl: "https://www.youtube.com/@JERRYANDLINDA",
    channelId: "UCQ6UhOOGU1M8hNezBwkM-yw",
    blurb:
      "Jerry and Linda share retirement life in The Villages — home buying, amenities, health care, golf, and the practical questions newcomers ask before (and after) the move.",
  },
  {
    id: "ira-miller",
    name: "Ira Miller — R/E Broker, Contractor, Home Inspector",
    handle: "@HomesAroundTheVillages",
    channelUrl: "https://www.youtube.com/@HomesAroundTheVillages",
    channelId: "UCA9UhkWKJAOhiaBETs51XEg",
    blurb:
      "Long-time local broker (IM Realty) with contractor and home-inspector credentials — home tours, market walks, and buyer-focused coverage of homes around The Villages.",
  },
  {
    id: "robyn-cavallaro",
    name: "Robyn Cavallaro | The Villages Florida REALTOR®",
    handle: "@Robyncavallaro",
    channelUrl: "https://www.youtube.com/@Robyncavallaro",
    channelId: "UCzva_dnyNNgkESClIew-QAA",
    blurb:
      "Villages REALTOR® content for buyers and sellers — home tours, cost-of-living explainers, bonds/taxes FAQs, and life-in-The-Villages guidance.",
  },
];

/** UC… → UU… uploads playlist (latest uploads feed embed). */
export function uploadsPlaylistId(channelId: string): string {
  if (channelId.startsWith("UC")) return `UU${channelId.slice(2)}`;
  return channelId;
}

type RssEntry = {
  videoId: string;
  title: string;
  publishedAt: string;
};

function emptyCache(): RealEstateYoutubeCache {
  return {
    updatedAt: null,
    source: null,
    lastError: null,
    creators: {},
  };
}

export function loadYoutubeCache(): RealEstateYoutubeCache {
  const raw = readJsonFile<RealEstateYoutubeCache>(CACHE_FILE);
  if (!raw || typeof raw !== "object") return emptyCache();
  return {
    updatedAt: raw.updatedAt || null,
    source: raw.source || null,
    lastError: raw.lastError ?? null,
    creators: raw.creators && typeof raw.creators === "object" ? raw.creators : {},
  };
}

function saveYoutubeCache(cache: RealEstateYoutubeCache) {
  writeJsonFile(CACHE_FILE, cache);
}

async function saveYoutubeCacheAsync(cache: RealEstateYoutubeCache) {
  await writeJsonFileAsync(CACHE_FILE, cache);
}

/**
 * Score how Villages / local-real-estate relevant a title is.
 * Higher = prefer for the card when checking the recent feed.
 */
export function villagesRelevanceScore(title: string): number {
  const t = title.toLowerCase();
  let score = 0;

  if (/\bthe villages\b/.test(t)) score += 50;
  if (/\bvillages\b/.test(t)) score += 30;
  if (/\bvillage of\b/.test(t)) score += 20;

  const places = [
    "lady lake",
    "sumter",
    "brownwood",
    "spanish springs",
    "lake sumter",
    "eastport",
    "fenney",
    "middleton",
    "wildwood",
    "fruitland park",
  ];
  for (const p of places) {
    if (t.includes(p)) score += 15;
  }

  const reTerms = [
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
  ];
  for (const p of reTerms) {
    if (t.includes(p)) score += 8;
  }

  // Prefer full videos over pure promo shorts when scores tie later
  if (/#shorts\b/.test(t) || t.includes(" #short")) score -= 12;

  return score;
}

function parseAtomEntries(xml: string): RssEntry[] {
  const entries: RssEntry[] = [];
  // Split on <entry> … </entry>
  const blocks = xml.split(/<entry[\s>]/i).slice(1);
  for (const block of blocks) {
    const end = block.indexOf("</entry>");
    const chunk = end >= 0 ? block.slice(0, end) : block;

    const videoId =
      chunk.match(/<yt:videoId>([^<]+)<\/yt:videoId>/i)?.[1]?.trim() ||
      chunk.match(/<id>yt:video:([^<]+)<\/id>/i)?.[1]?.trim() ||
      "";
    const title =
      chunk.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]?.trim() ||
      "Untitled video";
    const publishedAt =
      chunk.match(/<published>([^<]+)<\/published>/i)?.[1]?.trim() ||
      chunk.match(/<updated>([^<]+)<\/updated>/i)?.[1]?.trim() ||
      new Date().toISOString();

    if (videoId) {
      entries.push({
        videoId,
        title: decodeXmlEntities(title),
        publishedAt,
      });
    }
  }
  return entries;
}

function decodeXmlEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

export async function fetchChannelRss(
  channelId: string
): Promise<RssEntry[]> {
  const url = `https://www.youtube.com/feeds/videos.xml?channel_id=${encodeURIComponent(channelId)}`;
  const res = await fetch(url, {
    cache: "no-store",
    headers: {
      Accept: "application/atom+xml, application/xml, text/xml",
      "User-Agent": "TheVillagesEverythingApp/1.0 (real-estate youtube refresh)",
    },
  });
  if (!res.ok) {
    throw new Error(`YouTube RSS ${res.status} for ${channelId}`);
  }
  const xml = await res.text();
  return parseAtomEntries(xml);
}

/**
 * Prefer the newest video whose title looks Villages-related;
 * otherwise fall back to the absolute latest upload.
 */
export function pickBestVideo(entries: RssEntry[]): CachedYoutubeVideo | null {
  if (!entries.length) return null;

  const scored = entries.map((e, index) => ({
    e,
    index,
    score: villagesRelevanceScore(e.title),
  }));

  const matches = scored
    .filter((s) => s.score >= 20)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.index - b.index; // prefer more recent when scores equal
    });

  if (matches.length > 0) {
    const best = matches[0].e;
    return {
      videoId: best.videoId,
      title: best.title,
      publishedAt: best.publishedAt,
      pickReason: "villages-match",
    };
  }

  const latest = entries[0];
  return {
    videoId: latest.videoId,
    title: latest.title,
    publishedAt: latest.publishedAt,
    pickReason: "latest",
  };
}

export async function refreshRealEstateYoutube(opts?: {
  source?: "cron" | "manual" | "soft";
}): Promise<RealEstateYoutubeCache> {
  const source = opts?.source || "manual";
  const next: RealEstateYoutubeCache = {
    updatedAt: new Date().toISOString(),
    source,
    lastError: null,
    creators: {},
  };
  const errors: string[] = [];

  for (const creator of REAL_ESTATE_YOUTUBE_CREATORS) {
    try {
      const entries = await fetchChannelRss(creator.channelId);
      const video = pickBestVideo(entries);
      next.creators[creator.id] = {
        video,
        fetchedAt: new Date().toISOString(),
        candidatesChecked: entries.length,
      };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      errors.push(`${creator.id}: ${msg}`);
      // Keep previous video if we have one
      const prev = loadYoutubeCache().creators[creator.id];
      next.creators[creator.id] = prev || {
        video: null,
        fetchedAt: new Date().toISOString(),
        candidatesChecked: 0,
      };
    }
  }

  if (errors.length) {
    next.lastError = errors.join(" · ");
  }

  await saveYoutubeCacheAsync(next);
  return next;
}

export function isYoutubeCacheStale(
  cache: RealEstateYoutubeCache,
  maxAgeHours = STALE_HOURS
): boolean {
  if (!cache.updatedAt) return true;
  const age = Date.now() - new Date(cache.updatedAt).getTime();
  return age > maxAgeHours * 3600_000;
}

/** Soft-refresh when stale (safe for page load / public). */
export async function ensureYoutubeCacheFresh(
  maxAgeHours = STALE_HOURS
): Promise<RealEstateYoutubeCache> {
  const cache = loadYoutubeCache();
  if (!isYoutubeCacheStale(cache, maxAgeHours)) return cache;
  try {
    return await refreshRealEstateYoutube({ source: "soft" });
  } catch {
    return cache;
  }
}

export function getCreatorsWithLatestVideos(
  cache?: RealEstateYoutubeCache
): RealEstateYoutubeCreatorWithVideo[] {
  const c = cache || loadYoutubeCache();
  return REAL_ESTATE_YOUTUBE_CREATORS.map((creator) => ({
    ...creator,
    uploadsPlaylistId: uploadsPlaylistId(creator.channelId),
    latestVideo: c.creators[creator.id]?.video || null,
  }));
}
