/**
 * Official channel → My Retirement Reboot videos.
 * Public YouTube RSS (no API key). Cron + first visitor after a new upload.
 */

import { fetchChannelRss } from "./realEstateYoutube";
import { readJsonFile, writeJsonFileAsync } from "./dataFs";
import { SITE_BRAND } from "./siteBrand";
import type { Video } from "./types";

export type ChannelYoutubeVideo = {
  videoId: string;
  title: string;
  publishedAt: string;
  /** YouTube Short. Older cache rows omit this and are detected from the title. */
  short?: boolean;
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

/** Daily desk titles. Shorts are detected separately and are not required to match. */
export function isDailyNewsRoundup(title: string): boolean {
  const t = title.trim();
  return (
    /^the villages news\b/i.test(t) ||
    /^the week ahead\b/i.test(t) ||
    /^this weekend in the villages\b/i.test(t)
  );
}

export function isChannelShort(video: { title: string; short?: boolean }): boolean {
  return Boolean(video.short) || /#shorts\b/i.test(video.title);
}

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
    (v) => isDailyNewsRoundup(v.title) || isChannelShort(v)
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
    if (!isDailyNewsRoundup(v.title) && !isChannelShort(v)) continue;
    const prev = byId.get(v.videoId);
    byId.set(v.videoId, {
      videoId: v.videoId,
      title: v.title || prev?.title || "Untitled video",
      publishedAt: v.publishedAt || prev?.publishedAt || new Date().toISOString(),
      short: Boolean(v.short || prev?.short),
    });
  }
  const all = [...byId.values()];
  const roundups = all.filter((v) => isDailyNewsRoundup(v.title)).sort(byNewest).slice(0, MAX_NEWS_ROUNDUPS);
  const shorts = all
    .filter((v) => !isDailyNewsRoundup(v.title) && isChannelShort(v))
    .sort(byNewest)
    .slice(0, MAX_NEWS_SHORTS);
  return [...roundups, ...shorts].sort(byNewest);
}

export async function refreshChannelYoutube(opts?: {
  source?: "cron" | "manual" | "soft";
}): Promise<ChannelYoutubeCache> {
  const source = opts?.source || "manual";
  const prev = loadChannelYoutubeCache();
  const channelId = SITE_BRAND.youtube.channelId;

  try {
    const entries = await fetchChannelRss(channelId);
    const incoming: ChannelYoutubeVideo[] = entries.map((e) => ({
      videoId: e.videoId,
      title: e.title,
      publishedAt: e.publishedAt,
      short: Boolean(e.short),
    }));
    const next: ChannelYoutubeCache = {
      updatedAt: new Date().toISOString(),
      source,
      lastError: incoming.length ? null : "YouTube RSS returned no videos",
      channelId,
      videos: mergeVideos(prev.videos, incoming),
      newsKeep: mergeNewsKeep(prev.newsKeep || [], prev.videos, incoming),
    };
    await writeJsonFileAsync(CACHE_FILE, next);
    return next;
  } catch (err) {
    const next: ChannelYoutubeCache = {
      ...prev,
      updatedAt: prev.updatedAt || new Date().toISOString(),
      source,
      lastError: err instanceof Error ? err.message : String(err),
      channelId,
    };
    await writeJsonFileAsync(CACHE_FILE, next);
    return next;
  }
}

export async function ensureChannelYoutubeFresh(
  maxAgeHours = STALE_HOURS
): Promise<ChannelYoutubeCache> {
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

export function newsRoundups(cache: ChannelYoutubeCache): ChannelYoutubeVideo[] {
  const source = cache.newsKeep?.length ? cache.newsKeep : cache.videos;
  return source.filter((v) => isDailyNewsRoundup(v.title)).sort(byNewest);
}

export function newsShorts(cache: ChannelYoutubeCache): ChannelYoutubeVideo[] {
  const source = cache.newsKeep?.length ? cache.newsKeep : cache.videos;
  return source.filter((v) => !isDailyNewsRoundup(v.title) && isChannelShort(v)).sort(byNewest);
}

export function newsVideoUrl(video: ChannelYoutubeVideo): string {
  if (isChannelShort(video) && !isDailyNewsRoundup(video.title)) {
    return `https://www.youtube.com/shorts/${encodeURIComponent(video.videoId)}`;
  }
  return `https://www.youtube.com/watch?v=${encodeURIComponent(video.videoId)}`;
}
