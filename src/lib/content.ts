import path from "path";
import crypto from "crypto";
import {
  BUNDLE_DATA_DIR,
  cacheDurableJson,
  durableConfigured,
  ensureDurableHydrated,
  isEphemeralHost,
  pullDurableJson,
  readJsonFile,
  resolveUploadFile,
  saveUploadFile,
  tryWriteJsonFile,
  writeJsonFileAsync,
} from "./dataFs";
import type { Photo, Post, SiteContent, Video } from "./types";
import { SITE_BRAND } from "./siteBrand";
import { getChannelSiteVideos } from "./channelYoutube";

const CONTENT_FILE = "content.json";
const CONTENT_PATH = path.join(BUNDLE_DATA_DIR, CONTENT_FILE);
const UPLOADS_DIR = path.join(BUNDLE_DATA_DIR, "uploads");

/** Site brand + YouTube — single source via siteBrand.ts */
export const SITE = {
  name: SITE_BRAND.name,
  tagline: SITE_BRAND.tagline,
  subtitle: SITE_BRAND.subtitle,
  location: SITE_BRAND.location,
  youtube: { ...SITE_BRAND.youtube },
  stores: SITE_BRAND.stores,
};

const SEED: SiteContent = {
  site: {
    name: SITE.name,
    tagline: SITE.tagline,
    subtitle: SITE.subtitle,
    location: SITE.location,
  },
  posts: [
    {
      id: "seed-blog-1",
      type: "blog",
      title: "I Moved to Paradise and Immediately Got Lost on a Golf Cart",
      slug: "lost-on-a-golf-cart",
      excerpt:
        "Three roundabouts, one wrong gate, and a very patient security guard later… welcome to The Villages.",
      body: `They said retirement would be peaceful.

Nobody mentioned the golf cart traffic at 9 a.m., or that every street name sounds like a country club newsletter, or that you can live here for a month and still need GPS to find your own pool.

This is the reboot: health goals I keep negotiating with, wealth questions I pretend I understand, and everything else in between — neighbors who become friends, pickleball injuries sustained with pride, and the quiet thrill of starting over somewhere sunny.

If you live here, you already know. If you're thinking about moving here, buckle up. It's wonderful. It's weird. It's home.`,
      publishedAt: new Date().toISOString(),
      tags: ["arrival", "golf-carts", "the-villages"],
      featured: true,
    },
    {
      id: "seed-vlog-1",
      type: "vlog",
      title: "Week One: Health, Wealth & Questionable Decisions",
      slug: "week-one-reboot",
      excerpt:
        "A video diary of the first seven days — new doctors, new brokers, same chaotic energy.",
      body: `This week's themes, in no particular order:

1. Walking more (the dog insisted).
2. Reading investment statements like they're mystery novels.
3. Learning which restaurant has the best early-bird energy (yes, that's a real metric).

The Villages isn't just a place you move to. It's a full-system reboot — body, bank account, social calendar, and sense of humor. Stick around; I'm documenting the whole mess.`,
      publishedAt: new Date(Date.now() - 86400000).toISOString(),
      tags: ["vlog", "health", "wealth"],
      featured: true,
    },
  ],
  videos: [],
  photos: [],
  updatedAt: null,
};

function tryWriteJson(_filePath: string, data: unknown) {
  // Always write via dataFs (cwd on local, /tmp on Vercel)
  return tryWriteJsonFile(CONTENT_FILE, data);
}

export function uid(prefix = "id") {
  return `${prefix}-${Date.now().toString(36)}-${crypto.randomBytes(3).toString("hex")}`;
}

export function slugify(text: string) {
  return String(text || "")
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "post";
}

export function extractYouTubeId(input: string): string | null {
  if (!input) return null;
  const raw = input.trim();
  if (/^[\w-]{11}$/.test(raw)) return raw;
  try {
    const u = new URL(raw);
    if (u.hostname.includes("youtu.be")) {
      return u.pathname.slice(1).split("/")[0] || null;
    }
    if (u.hostname.includes("youtube.com")) {
      const v = u.searchParams.get("v");
      if (v) return v;
      const parts = u.pathname.split("/").filter(Boolean);
      const embedIdx = parts.indexOf("embed");
      if (embedIdx >= 0 && parts[embedIdx + 1]) return parts[embedIdx + 1];
      const shortsIdx = parts.indexOf("shorts");
      if (shortsIdx >= 0 && parts[shortsIdx + 1]) return parts[shortsIdx + 1];
    }
  } catch {
    return null;
  }
  return null;
}

export function loadContent(): SiteContent {
  const seed = (): SiteContent => ({
    ...SEED,
    posts: SEED.posts.map((p) => ({ ...p })),
    videos: [...SEED.videos],
    photos: [...SEED.photos],
    updatedAt: new Date().toISOString(),
  });

  try {
    const raw = readJsonFile<SiteContent>(CONTENT_FILE);
    if (!raw) {
      const s = seed();
      tryWriteJson(CONTENT_PATH, s);
      return s;
    }
    return {
      site: { ...SITE, ...(raw.site || {}) },
      posts: Array.isArray(raw.posts) ? raw.posts : [],
      videos: Array.isArray(raw.videos) ? raw.videos : [],
      photos: Array.isArray(raw.photos) ? raw.photos : [],
      updatedAt: raw.updatedAt || null,
    };
  } catch {
    return seed();
  }
}

export function saveContent(content: SiteContent) {
  content.updatedAt = new Date().toISOString();
  content.site = { ...SITE, ...(content.site || {}) };
  const ok = tryWriteJson(CONTENT_PATH, content);
  if (!ok) {
    throw new Error(
      "Could not save content (read-only host). Studio writes need local/disk storage or cloud blob later."
    );
  }
  return content;
}

/** Re-read content.json from Redis/Blob so every Vercel instance sees Studio publishes. */
export async function loadContentAsync(): Promise<SiteContent> {
  if (isEphemeralHost() && durableConfigured()) {
    try {
      const text = await pullDurableJson(CONTENT_FILE);
      if (text) cacheDurableJson(CONTENT_FILE, text);
    } catch (err) {
      console.error(
        "[content] durable pull failed; falling back to bulk hydrate",
        err
      );
      await ensureDurableHydrated().catch(() => undefined);
    }
  } else {
    await ensureDurableHydrated().catch(() => undefined);
  }
  return loadContent();
}

/**
 * Await Redis/Blob so a Studio publish is live on the public site,
 * not only on the serverless instance that handled the click.
 */
export async function saveContentAsync(content: SiteContent) {
  content.updatedAt = new Date().toISOString();
  content.site = { ...SITE, ...(content.site || {}) };
  try {
    await writeJsonFileAsync(CONTENT_FILE, content);
  } catch (err) {
    throw new Error(
      err instanceof Error
        ? err.message
        : "Could not save content on this host"
    );
  }
  return content;
}

export function getPosts(type?: "blog" | "vlog") {
  const posts = loadContent().posts.slice().sort((a, b) =>
    String(b.publishedAt).localeCompare(String(a.publishedAt))
  );
  return type ? posts.filter((p) => p.type === type) : posts;
}

export async function getPostsAsync(type?: "blog" | "vlog") {
  const content = await loadContentAsync();
  const posts = content.posts
    .slice()
    .sort((a, b) => String(b.publishedAt).localeCompare(String(a.publishedAt)));
  return type ? posts.filter((p) => p.type === type) : posts;
}

export function getPostBySlug(slug: string) {
  return loadContent().posts.find((p) => p.slug === slug) || null;
}

export async function getPostBySlugAsync(slug: string) {
  const content = await loadContentAsync();
  return content.posts.find((p) => p.slug === slug) || null;
}

function mergeStudioAndChannelVideos(studio: Video[]): Video[] {
  const seen = new Set<string>();
  const out: Video[] = [];
  for (const v of studio) {
    out.push(v);
    if (v.youtubeId) seen.add(v.youtubeId);
    seen.add(v.id);
  }
  for (const v of getChannelSiteVideos()) {
    if (v.youtubeId && seen.has(v.youtubeId)) continue;
    if (seen.has(v.id)) continue;
    out.push(v);
  }
  return out.sort((a, b) =>
    String(b.publishedAt).localeCompare(String(a.publishedAt))
  );
}

export function getVideos() {
  return mergeStudioAndChannelVideos(loadContent().videos);
}

export async function getVideosAsync() {
  const content = await loadContentAsync();
  return mergeStudioAndChannelVideos(content.videos);
}

export function getVideoById(id: string) {
  return getVideos().find((v) => v.id === id) || null;
}

export async function getVideoByIdAsync(id: string) {
  const videos = await getVideosAsync();
  return videos.find((v) => v.id === id) || null;
}

export async function upsertPost(input: Partial<Post> & { title: string; body: string; type: Post["type"] }) {
  const content = await loadContentAsync();
  const now = new Date().toISOString();
  if (input.id) {
    const idx = content.posts.findIndex((p) => p.id === input.id);
    if (idx < 0) throw new Error("Post not found");
    const prev = content.posts[idx];
    const next: Post = {
      ...prev,
      ...input,
      title: String(input.title).trim().slice(0, 200),
      slug: input.slug ? slugify(input.slug) : prev.slug,
      excerpt: String(input.excerpt ?? prev.excerpt ?? "").slice(0, 400),
      body: String(input.body),
      tags: Array.isArray(input.tags) ? input.tags : prev.tags,
      type: input.type || prev.type,
    };
    content.posts[idx] = next;
  } else {
    let slug = slugify(input.slug || input.title);
    const existing = new Set(content.posts.map((p) => p.slug));
    if (existing.has(slug)) slug = `${slug}-${Date.now().toString(36)}`;
    const post: Post = {
      id: uid("post"),
      type: input.type,
      title: String(input.title).trim().slice(0, 200),
      slug,
      excerpt: String(input.excerpt || input.body.slice(0, 160)).slice(0, 400),
      body: String(input.body),
      coverImage: input.coverImage,
      publishedAt: input.publishedAt || now,
      tags: Array.isArray(input.tags) ? input.tags : [],
      featured: !!input.featured,
    };
    content.posts.unshift(post);
  }
  return saveContentAsync(content);
}

export async function deletePost(id: string) {
  const content = await loadContentAsync();
  content.posts = content.posts.filter((p) => p.id !== id);
  return saveContentAsync(content);
}

export async function upsertVideo(
  input: Partial<Video> & { title: string; source: Video["source"] }
) {
  const content = await loadContentAsync();
  const now = new Date().toISOString();

  if (input.source === "youtube") {
    const yt = extractYouTubeId(String(input.youtubeId || ""));
    if (!yt) throw new Error("Valid YouTube URL or video ID required");
    input.youtubeId = yt;
  }

  if (input.id) {
    const idx = content.videos.findIndex((v) => v.id === input.id);
    if (idx < 0) throw new Error("Video not found");
    content.videos[idx] = {
      ...content.videos[idx],
      ...input,
      title: String(input.title).trim().slice(0, 200),
      description: String(input.description ?? content.videos[idx].description ?? "").slice(0, 2000),
      tags: Array.isArray(input.tags) ? input.tags : content.videos[idx].tags,
    };
  } else {
    const video: Video = {
      id: uid("vid"),
      title: String(input.title).trim().slice(0, 200),
      description: String(input.description || "").slice(0, 2000),
      source: input.source,
      youtubeId: input.youtubeId,
      videoUrl: input.videoUrl,
      thumbnailUrl: input.thumbnailUrl,
      publishedAt: input.publishedAt || now,
      tags: Array.isArray(input.tags) ? input.tags : [],
      featured: !!input.featured,
    };
    content.videos.unshift(video);
  }
  return saveContentAsync(content);
}

export async function deleteVideo(id: string) {
  const content = await loadContentAsync();
  content.videos = content.videos.filter((v) => v.id !== id);
  return saveContentAsync(content);
}

function normalizePhotoImages(raw: Partial<Photo> | null | undefined): Photo["images"] {
  if (!raw) return [];
  if (Array.isArray(raw.images) && raw.images.length) {
    return raw.images
      .map((img, i) => {
        if (!img) return null;
        if (typeof img === "string") {
          return { id: `img-${i}`, url: img, caption: "" };
        }
        const url = String(img.url || "").trim();
        if (!url) return null;
        return {
          id: img.id || uid("img"),
          url,
          caption: String(img.caption || "").slice(0, 300),
        };
      })
      .filter(Boolean) as Photo["images"];
  }
  // Legacy single-image entries (stable id so client selection doesn't thrash)
  const legacy = String(raw.imageUrl || "").trim();
  if (legacy) {
    return [{ id: `legacy-${raw.id || "photo"}`, url: legacy, caption: "" }];
  }
  return [];
}

/** Resolve featured image for display (featured id → first image) */
export function getFeaturedImage(photo: Photo) {
  const images = normalizePhotoImages(photo);
  if (!images.length) return null;
  if (photo.featuredImageId) {
    const hit = images.find((i) => i.id === photo.featuredImageId);
    if (hit) return hit;
  }
  return images[0];
}

export function normalizePhoto(raw: Photo): Photo {
  const images = normalizePhotoImages(raw);
  const featuredImageId =
    raw.featuredImageId && images.some((i) => i.id === raw.featuredImageId)
      ? raw.featuredImageId
      : images[0]?.id;
  return {
    ...raw,
    title: String(raw.title || "Untitled").slice(0, 200),
    caption: String(raw.caption || "").slice(0, 600),
    images,
    featuredImageId,
    imageUrl: images[0]?.url,
    tags: Array.isArray(raw.tags) ? raw.tags : [],
    featured: !!raw.featured,
  };
}

export function getPhotos() {
  return loadContent()
    .photos.map(normalizePhoto)
    .filter((p) => p.images.length > 0)
    .sort((a, b) => String(b.publishedAt).localeCompare(String(a.publishedAt)));
}

export async function getPhotosAsync() {
  const content = await loadContentAsync();
  return content.photos
    .map(normalizePhoto)
    .filter((p) => p.images.length > 0)
    .sort((a, b) => String(b.publishedAt).localeCompare(String(a.publishedAt)));
}

export function getPhotoById(id: string) {
  const found = loadContent().photos.find((p) => p.id === id);
  return found ? normalizePhoto(found) : null;
}

export async function upsertPhoto(
  input: Partial<Photo> & { title: string; images?: Photo["images"]; imageUrl?: string }
) {
  const content = await loadContentAsync();
  if (!Array.isArray(content.photos)) content.photos = [];
  const now = new Date().toISOString();

  let images = normalizePhotoImages(input as Photo);
  // Allow legacy imageUrl when creating/updating
  if (!images.length && input.imageUrl) {
    images = [{ id: uid("img"), url: String(input.imageUrl).trim(), caption: "" }];
  }
  if (!images.length) throw new Error("Add at least one photo");

  let featuredImageId = input.featuredImageId;
  if (!featuredImageId || !images.some((i) => i.id === featuredImageId)) {
    featuredImageId = images[0].id;
  }

  if (input.id) {
    const idx = content.photos.findIndex((p) => p.id === input.id);
    if (idx < 0) throw new Error("Photo not found");
    const prev = normalizePhoto(content.photos[idx]);
    content.photos[idx] = {
      ...prev,
      title: String(input.title).trim().slice(0, 200),
      caption: String(input.caption ?? prev.caption ?? "").slice(0, 600),
      images,
      featuredImageId,
      imageUrl: images.find((i) => i.id === featuredImageId)?.url || images[0].url,
      tags: Array.isArray(input.tags) ? input.tags : prev.tags,
      featured: input.featured !== undefined ? !!input.featured : !!prev.featured,
      publishedAt: input.publishedAt || prev.publishedAt,
    };
  } else {
    const photo: Photo = {
      id: uid("photo"),
      title: String(input.title).trim().slice(0, 200),
      caption: String(input.caption || "").slice(0, 600),
      images,
      featuredImageId,
      imageUrl: images.find((i) => i.id === featuredImageId)?.url || images[0].url,
      publishedAt: input.publishedAt || now,
      tags: Array.isArray(input.tags) ? input.tags : [],
      featured: !!input.featured,
    };
    content.photos.unshift(photo);
  }
  return saveContentAsync(content);
}

export async function deletePhoto(id: string) {
  const content = await loadContentAsync();
  if (!Array.isArray(content.photos)) content.photos = [];
  content.photos = content.photos.filter((p) => p.id !== id);
  return saveContentAsync(content);
}

export async function saveUpload(buffer: Buffer, filename: string, contentType?: string) {
  const saved = await saveUploadFile(buffer, filename, contentType);
  return saved.url;
}

export function resolveUpload(name: string) {
  return resolveUploadFile(path.basename(String(name || "")));
}

export { UPLOADS_DIR, CONTENT_PATH };
