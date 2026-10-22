/**
 * Official channel → My Retirement Reboot videos.
 * Public YouTube RSS (no API key). Cron + first visitor after a new upload.
 */

import { fetchChannelRss } from "./realEstateYoutube";
import {
  ensureDurableHydrated,
  hasCachedJson,
  isEphemeralHost,
  readJsonFile,
  settleDurableHydrate,
  writeJsonFileAsync,
} from "./dataFs";
import { isChannelShort, isDailyNewsRoundup } from "./newsVideoMatch";
import { SITE_BRAND } from "./siteBrand";
import type { Video } from "./types";

export { isChannelShort, isDailyNewsRoundup };

export type ChannelYoutubeVideo = {
  videoId: string;
  title: string;
  publishedAt: string;
  /** YouTube Short. Older cache rows omit this and are detected from the title. */
  short?: boolean;
  /** Daily news roundup. Older rows omit this and are detected from the title. */
  roundup?: boolean;
};

export type ChannelYoutubeCache = {
  updatedAt: string | null;
  source: "cron" | "manual" | "soft" | null;
  lastError: string | null;
  channelId: string;
  videos: ChannelYoutubeVideo[];
  /**
   * Daily roundups and Shorts kept after they leave the 15-item RSS window.
   * The reboot Videos page still uses `videos`.
   */
  newsKeep?: ChannelYoutubeVideo[];
};

const CACHE_FILE = "channel-youtube.json";
/** Soft-refresh when someone opens Videos / Reboot (Hobby cron is daily). */
const STALE_HOURS = 1;
/** Keep history after videos fall off the ~15-item RSS window. */
const MAX_KEEP = 200;
/** Roundups stay on Local News after newer uploads push them off the RSS feed. */
const MAX_NEWS_ROUNDUPS = 500;
const MAX_NEWS_SHORTS = 400;

function emptyCache(): ChannelYoutubeCache {
  return {
    updatedAt: null,
    source: null,
    lastError: null,
    channelId: SITE_BRAND.youtube.channelId,
    videos: [],
  };
}

export function loadChannelYoutubeCache(): ChannelYoutubeCache {
  const raw = readJsonFile<ChannelYoutubeCache>(CACHE_FILE);
  if (!raw || typeof raw !== "object") return emptyCache();
  return {
    updatedAt: raw.updatedAt || null,
    source: raw.source || null,
    lastError: raw.lastError ?? null,
    channelId: raw.channelId || SITE_BRAND.youtube.channelId,
    videos: Array.isArray(raw.videos)
      ? raw.videos.filter((v) => v?.videoId && v?.title)
      : [],
    newsKeep: Array.isArray(raw.newsKeep)
      ? raw.newsKeep.filter((v) => v?.videoId && v?.title)
      : [],
  };
}

export function isChannelYoutubeStale(
  cache: ChannelYoutubeCache,
  maxAgeHours = STALE_HOURS
): boolean {
  if (!cache.updatedAt || !cache.videos.length) return true;
  const hasNewsInRecent = cache.videos.some(
    (v) => v.roundup || isDailyNewsRoundup(v.title) || isChannelShort(v)
  );
  if (hasNewsInRecent && !(cache.newsKeep && cache.newsKeep.length)) return true;
  const age = Date.now() - new Date(cache.updatedAt).getTime();
  return Number.isNaN(age) || age > maxAgeHours * 3600_000;
}

function mergeVideos(
  previous: ChannelYoutubeVideo[],
  incoming: ChannelYoutubeVideo[]
): ChannelYoutubeVideo[] {
  const byId = new Map<string, ChannelYoutubeVideo>();
  for (const v of previous) byId.set(v.videoId, v);
  for (const v of incoming) {
    const prev = byId.get(v.videoId);
    byId.set(v.videoId, {
      videoId: v.videoId,
      title: v.title || prev?.title || "Untitled video",
      publishedAt: v.publishedAt || prev?.publishedAt || new Date().toISOString(),
      short: Boolean(v.short || prev?.short),
      roundup: Boolean(v.roundup || prev?.roundup),
    });
  }
  return [...byId.values()]
    .sort((a, b) => String(b.publishedAt).localeCompare(String(a.publishedAt)))
    .slice(0, MAX_KEEP);
}

function byNewest(a: ChannelYoutubeVideo, b: ChannelYoutubeVideo) {
  return String(b.publishedAt).localeCompare(String(a.publishedAt));
}

/** Roundups and Shorts survive after they fall off the recent-upload window. */
function mergeNewsKeep(
  previousKeep: ChannelYoutubeVideo[],
  previousVideos: ChannelYoutubeVideo[],
  incoming: ChannelYoutubeVideo[]
): ChannelYoutubeVideo[] {
  const byId = new Map<string, ChannelYoutubeVideo>();
  for (const v of [...previousKeep, ...previousVideos, ...incoming]) {
    if (!v.roundup && !isDailyNewsRoundup(v.title) && !isChannelShort(v)) continue;
    const prev = byId.get(v.videoId);
    byId.set(v.videoId, {
      videoId: v.videoId,
      title: v.title || prev?.title || "Untitled video",
      publishedAt: v.publishedAt || prev?.publishedAt || new Date().toISOString(),
      short: Boolean(v.short || prev?.short),
      roundup: Boolean(v.roundup || prev?.roundup),
    });
  }
  const all = [...byId.values()];
  // `roundup` covers titles that name the story and say "news round-up"
  // only in the description. A title check alone drops those uploads.
  const roundups = all
    .filter((v) => v.roundup || isDailyNewsRoundup(v.title))
    .sort(byNewest)
    .slice(0, MAX_NEWS_ROUNDUPS);
  const roundupIds = new Set(roundups.map((v) => v.videoId));
  const shorts = all
    .filter((v) => !roundupIds.has(v.videoId) && isChannelShort(v))
    .sort(byNewest)
    .slice(0, MAX_NEWS_SHORTS);
  return [...roundups, ...shorts].sort(byNewest);
}

type RssLike = {
  videoId: string;
  title: string;
  publishedAt: string;
  description?: string;
  short?: boolean;
};

/** Last good feed on this server, so a burst of visits does not refetch YouTube. */
let freshMemo: { at: number; cache: ChannelYoutubeCache } | null = null;
const FRESH_MEMO_MS = 2 * 60 * 1000;

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(label)), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (err: unknown) => {
        clearTimeout(timer);
        reject(err);
      }
    );
  });
}

function incomingFromRss(entries: RssLike[]): ChannelYoutubeVideo[] {
  return entries.map((e) => ({
    videoId: e.videoId,
    title: e.title,
    publishedAt: e.publishedAt,
    short: Boolean(e.short),
    roundup: !e.short && isDailyNewsRoundup(e.title, e.description || ""),
  }));
}

function assembleChannelCache(
  prev: ChannelYoutubeCache,
  incoming: ChannelYoutubeVideo[],
  source: "cron" | "manual" | "soft",
  lastError: string | null
): ChannelYoutubeCache {
  return {
    updatedAt: new Date().toISOString(),
    source,
    lastError,
    channelId: SITE_BRAND.youtube.channelId,
    videos: mergeVideos(prev.videos, incoming),
    newsKeep: mergeNewsKeep(prev.newsKeep || [], prev.videos, incoming),
  };
}

/**
 * Save when Redis/Blob is already in memory. A failed save must not throw:
 * the page still needs the fresh list. Skipping the save when hydrate has
 * not finished avoids writing the git seed over the real history.
 */
async function persistChannelCache(next: ChannelYoutubeCache): Promise<void> {
  try {
    await writeJsonFileAsync(CACHE_FILE, next);
  } catch (err) {
    console.error("[channel-youtube] save failed", err);
  }
}

async function waitForDurableCache(maxMs: number): Promise<boolean> {
  await ensureDurableHydrated();
  let settled = false;
  await Promise.race([
    settleDurableHydrate().then(() => {
      settled = true;
    }),
    new Promise<void>((resolve) => setTimeout(resolve, maxMs)),
  ]);
  return settled;
}

export async function refreshChannelYoutube(opts?: {
  source?: "cron" | "manual" | "soft";
  /** When false, return the fresh list and leave the saved copy alone. */
  persist?: boolean;
}): Promise<ChannelYoutubeCache> {
  const source = opts?.source || "manual";
  const persist = opts?.persist !== false;
  if (persist) await waitForDurableCache(5000);
  // A cold start that has not loaded Redis yet must not save the git seed over it.
  const canPersist = persist && (hasCachedJson(CACHE_FILE) || !isEphemeralHost());
  const prev = loadChannelYoutubeCache();
  const channelId = SITE_BRAND.youtube.channelId;

  try {
    const entries = await fetchChannelRss(channelId);
    const incoming = incomingFromRss(entries);
    const next = assembleChannelCache(
      prev,
      incoming,
      source,
      incoming.length ? null : "YouTube RSS returned no videos"
    );
    if (canPersist) await persistChannelCache(next);
    freshMemo = incoming.length ? { at: Date.now(), cache: next } : freshMemo;
    return next;
  } catch (err) {
    const next: ChannelYoutubeCache = {
      ...prev,
      updatedAt: prev.updatedAt || new Date().toISOString(),
      source,
      lastError: err instanceof Error ? err.message : String(err),
      channelId,
    };
    if (canPersist && (prev.videos.length || (prev.newsKeep && prev.newsKeep.length))) {
      await persistChannelCache(next);
    }
    return next;
  }
}

export async function ensureChannelYoutubeFresh(
  maxAgeHours = STALE_HOURS
): Promise<ChannelYoutubeCache> {
  // Local News asks for age 0. Start YouTube immediately. The saved list can
  // still be waking up, and the first paint has to include this visit's feed.
  if (maxAgeHours <= 0) {
    if (freshMemo && Date.now() - freshMemo.at < FRESH_MEMO_MS && newsRoundups(freshMemo.cache).length) {
      return freshMemo.cache;
    }
    const rssPromise = withTimeout(
      fetchChannelRss(SITE_BRAND.youtube.channelId),
      7000,
      "YouTube RSS timed out"
    ).then(
      (entries) => ({ entries, error: null as string | null }),
      (err: unknown) => ({
        entries: [] as RssLike[],
        error: err instanceof Error ? err.message : String(err),
      })
    );
    const hydrated = await waitForDurableCache(2000);
    const canPersist = hydrated && (hasCachedJson(CACHE_FILE) || !isEphemeralHost());
    const prev = loadChannelYoutubeCache();
    const rss = await rssPromise;
    if (rss.error || !rss.entries.length) {
      return {
        ...prev,
        lastError: rss.error || prev.lastError || "YouTube RSS returned no videos",
      };
    }
    const next = assembleChannelCache(prev, incomingFromRss(rss.entries), "soft", null);
    if (canPersist) await persistChannelCache(next);
    freshMemo = { at: Date.now(), cache: next };
    return next;
  }

  await waitForDurableCache(4000);
  const cache = loadChannelYoutubeCache();
  if (!isChannelYoutubeStale(cache, maxAgeHours)) return cache;
  try {
    return await refreshChannelYoutube({ source: "soft" });
  } catch {
    return cache;
  }
}

export function channelVideoToSiteVideo(row: ChannelYoutubeVideo): Video {
  return {
    id: `yt-${row.videoId}`,
    title: row.title,
    description: "",
    source: "youtube",
    youtubeId: row.videoId,
    thumbnailUrl: `https://i.ytimg.com/vi/${row.videoId}/hqdefault.jpg`,
    publishedAt: row.publishedAt,
    tags: ["youtube", "reboot"],
    featured: false,
  };
}

export function getChannelSiteVideos(
  cache?: ChannelYoutubeCache
): Video[] {
  const c = cache || loadChannelYoutubeCache();
  return c.videos.map(channelVideoToSiteVideo);
}

function shelfRows(cache: ChannelYoutubeCache): ChannelYoutubeVideo[] {
  const byId = new Map<string, ChannelYoutubeVideo>();
  for (const v of [...(cache.newsKeep || []), ...cache.videos]) {
    const prev = byId.get(v.videoId);
    byId.set(v.videoId, {
      videoId: v.videoId,
      title: v.title || prev?.title || "Untitled video",
      publishedAt: v.publishedAt || prev?.publishedAt || "",
      short: Boolean(v.short || prev?.short),
      roundup: Boolean(v.roundup || prev?.roundup),
    });
  }
  return [...byId.values()];
}

export function newsRoundups(cache: ChannelYoutubeCache): ChannelYoutubeVideo[] {
  return shelfRows(cache)
    .filter((v) => v.roundup || isDailyNewsRoundup(v.title))
    .sort(byNewest);
}

export function newsShorts(cache: ChannelYoutubeCache): ChannelYoutubeVideo[] {
  return shelfRows(cache)
    .filter((v) => !v.roundup && !isDailyNewsRoundup(v.title) && isChannelShort(v))
    .sort(byNewest);
}

export function newsVideoUrl(video: ChannelYoutubeVideo): string {
  if (isChannelShort(video) && !isDailyNewsRoundup(video.title)) {
    return `https://www.youtube.com/shorts/${encodeURIComponent(video.videoId)}`;
  }
  return `https://www.youtube.com/watch?v=${encodeURIComponent(video.videoId)}`;
}
