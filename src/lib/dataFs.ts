import fs from "fs";
import path from "path";

/**
 * JSON + upload helpers for local disk and Vercel/Lambda.
 *
 * Bundled seeds: process.cwd()/data (read-only on serverless)
 * Runtime writes: /tmp/tvh-data (ephemeral per instance)
 * Durable writes (when BLOB_READ_WRITE_TOKEN is set): Vercel Blob
 * Process memory cache: keeps latest writes visible on the same instance
 */

const TMP_ROOT = path.join("/tmp", "tvh-data");

export const BUNDLE_DATA_DIR = path.join(process.cwd(), "data");

/** In-process cache so admin grants are visible immediately on this instance. */
const memoryJson = new Map<string, string>();

/** Files that must survive across serverless instances (admin + membership). */
const DURABLE_JSON = new Set([
  "member-space.json",
  "yard-sale.json",
  "dining.json",
  "forum.json",
  "real-estate.json",
  "village-neighbors.json",
  "content.json",
  "entertainment-schedule.json",
  "best-of-month.json",
  "golf-club.json",
  "site-gate-settings.json",
  "club-listings.json",
  "calendar-events.json",
  "local-services.json",
  "real-estate-youtube.json",
]);

export function isEphemeralHost(): boolean {
  return Boolean(
    process.env.VERCEL ||
      process.env.AWS_LAMBDA_FUNCTION_NAME ||
      process.env.NETLIFY
  );
}

export function blobConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim());
}

/** Directory we are allowed to create and write into. */
export function writableDataDir(): string {
  if (isEphemeralHost()) return TMP_ROOT;
  return BUNDLE_DATA_DIR;
}

export function ensureWritableDirs(options?: { uploads?: boolean }): string {
  const dir = writableDataDir();
  fs.mkdirSync(/*turbopackIgnore: true*/ dir, { recursive: true });
  if (options?.uploads) {
    fs.mkdirSync(/*turbopackIgnore: true*/ path.join(dir, "uploads"), {
      recursive: true,
    });
  }
  return dir;
}

function bundleJsonPath(filename: string) {
  return path.join(process.cwd(), "data", filename);
}

function tmpJsonPath(filename: string) {
  return path.join("/tmp", "tvh-data", filename);
}

function bundleUploadPath(filename: string) {
  return path.join(process.cwd(), "data", "uploads", filename);
}

function tmpUploadPath(filename: string) {
  return path.join("/tmp", "tvh-data", "uploads", filename);
}

function blobPathname(filename: string) {
  return `tvh-data/${filename}`;
}

/** Prefer memory → runtime overlay → bundled seed. */
export function resolveJsonPath(filename: string): string | null {
  const base = path.basename(filename);
  if (!base || base.includes("..") || base.includes("/") || base.includes("\\")) {
    return null;
  }

  if (memoryJson.has(base)) {
    return `memory:${base}`;
  }

  const tmp = tmpJsonPath(base);
  try {
    if (
      fs.existsSync(/*turbopackIgnore: true*/ tmp) &&
      fs.statSync(/*turbopackIgnore: true*/ tmp).isFile()
    ) {
      return tmp;
    }
  } catch {
    /* ignore */
  }

  const bundled = bundleJsonPath(base);
  try {
    if (
      fs.existsSync(/*turbopackIgnore: true*/ bundled) &&
      fs.statSync(/*turbopackIgnore: true*/ bundled).isFile()
    ) {
      return bundled;
    }
  } catch {
    /* ignore */
  }

  return null;
}

export function readJsonFile<T>(filename: string): T | null {
  const base = path.basename(filename);
  if (!base || base.includes("..") || base.includes("/") || base.includes("\\")) {
    return null;
  }

  /**
   * Local/dev: always read from disk so edits to data/*.json (or git pulls)
   * show up after a browser refresh without restarting `next dev`.
   * Serverless: prefer process memory (and Blob hydration) so durable writes
   * stay visible on the same warm instance.
   */
  if (!isEphemeralHost()) {
    const bundled = bundleJsonPath(base);
    try {
      if (
        fs.existsSync(/*turbopackIgnore: true*/ bundled) &&
        fs.statSync(/*turbopackIgnore: true*/ bundled).isFile()
      ) {
        const raw = fs.readFileSync(/*turbopackIgnore: true*/ bundled, "utf8");
        memoryJson.set(base, raw);
        return JSON.parse(raw) as T;
      }
    } catch {
      return null;
    }
    return null;
  }

  if (memoryJson.has(base)) {
    try {
      return JSON.parse(memoryJson.get(base)!) as T;
    } catch {
      /* fall through */
    }
  }

  const p = resolveJsonPath(filename);
  if (!p || p.startsWith("memory:")) return null;
  try {
    const raw = fs.readFileSync(/*turbopackIgnore: true*/ p, "utf8");
    memoryJson.set(base, raw);
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

async function pushJsonToBlob(filename: string, json: string): Promise<void> {
  if (!blobConfigured() || !DURABLE_JSON.has(filename)) return;
  const { put } = await import("@vercel/blob");
  const body = Buffer.from(json, "utf8");
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  const baseOpts = {
    addRandomSuffix: false as const,
    allowOverwrite: true,
    contentType: "application/json",
    token,
  };
  // Private stores reject access:"public" — try public then private.
  try {
    await put(blobPathname(filename), body, {
      ...baseOpts,
      access: "public",
    });
  } catch (publicErr) {
    try {
      await put(blobPathname(filename), body, {
        ...baseOpts,
        access: "private",
      });
    } catch (privateErr) {
      console.error("[dataFs] blob put failed", filename, privateErr);
      throw new Error(
        `Could not save ${filename} to Vercel Blob. Check BLOB_READ_WRITE_TOKEN and that the Blob store is connected to this project.`
      );
    }
  }
}

/** Pull one durable JSON file from Blob (auth header supports private stores). */
export async function pullJsonFromBlob(
  filename: string
): Promise<string | null> {
  if (!blobConfigured() || !DURABLE_JSON.has(filename)) return null;
  try {
    const { list } = await import("@vercel/blob");
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    const pathname = blobPathname(filename);
    const { blobs } = await list({
      prefix: pathname,
      token,
      limit: 5,
    });
    const hit = blobs.find((b) => b.pathname === pathname);
    if (!hit?.url) return null;
    const res = await fetch(hit.url, {
      cache: "no-store",
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    if (!res.ok) return null;
    return await res.text();
  } catch (err) {
    console.error("[dataFs] blob pull failed", filename, err);
    return null;
  }
}

/**
 * Hydrate durable JSON from Vercel Blob into memory + /tmp.
 * Call from root layout / admin API so every instance sees admin grants.
 */
export async function hydrateDurableJsonFromBlob(): Promise<{
  ok: boolean;
  blob: boolean;
  files: string[];
}> {
  if (!blobConfigured()) {
    return { ok: false, blob: false, files: [] };
  }
  const loaded: string[] = [];
  for (const file of DURABLE_JSON) {
    const text = await pullJsonFromBlob(file);
    if (!text) continue;
    try {
      JSON.parse(text); // validate
      memoryJson.set(file, text);
      try {
        const dir = ensureWritableDirs();
        fs.writeFileSync(
          /*turbopackIgnore: true*/ path.join(dir, file),
          text,
          "utf8"
        );
      } catch {
        /* memory still has it */
      }
      loaded.push(file);
    } catch {
      /* skip corrupt */
    }
  }
  return { ok: true, blob: true, files: loaded };
}

let hydrateOnce: Promise<void> | null = null;
/** Last successful hydrate time — re-pull from Blob so other instances see approvals. */
let lastHydrateAt = 0;
const HYDRATE_TTL_MS = 4_000;

/**
 * Coalesce concurrent hydrates, but re-pull from Blob every few seconds on
 * serverless so admin approvals/submits appear on every instance.
 */
export function ensureDurableHydrated(): Promise<void> {
  if (!isEphemeralHost() || !blobConfigured()) {
    return Promise.resolve();
  }
  const now = Date.now();
  if (hydrateOnce && now - lastHydrateAt < HYDRATE_TTL_MS) {
    return hydrateOnce;
  }
  hydrateOnce = hydrateDurableJsonFromBlob()
    .then(() => {
      lastHydrateAt = Date.now();
    })
    .catch(() => {
      hydrateOnce = null;
      lastHydrateAt = 0;
    });
  return hydrateOnce;
}

/** Reset hydrate latch after a successful durable write (optional). */
export function invalidateHydrateLatch() {
  hydrateOnce = null;
  lastHydrateAt = 0;
}

export function writeJsonFile(filename: string, data: unknown): void {
  const base = path.basename(filename);
  if (!base || base.includes("..")) {
    throw new Error("Invalid data filename");
  }
  const json = JSON.stringify(data, null, 2);
  memoryJson.set(base, json);

  const dir = ensureWritableDirs();
  const p = path.join(dir, base);
  fs.writeFileSync(/*turbopackIgnore: true*/ p, json, "utf8");

  // Fire-and-forget durable sync (admin + membership critical files)
  if (DURABLE_JSON.has(base) && blobConfigured()) {
    void pushJsonToBlob(base, json).catch((err) =>
      console.error("[dataFs] fire-and-forget blob put failed", base, err)
    );
  }
}

/** Put durable JSON into process memory (+ /tmp) without re-uploading to Blob. */
export function cacheDurableJson(filename: string, jsonText: string): void {
  const base = path.basename(filename);
  if (!base || base.includes("..")) return;
  memoryJson.set(base, jsonText);
  try {
    const dir = ensureWritableDirs();
    fs.writeFileSync(
      /*turbopackIgnore: true*/ path.join(dir, base),
      jsonText,
      "utf8"
    );
  } catch {
    /* memory still has it */
  }
}

/** Awaitable write for API routes so Blob finishes before response returns. */
export async function writeJsonFileAsync(
  filename: string,
  data: unknown
): Promise<void> {
  const base = path.basename(filename);
  if (!base || base.includes("..")) {
    throw new Error("Invalid data filename");
  }
  const json = JSON.stringify(data, null, 2);
  memoryJson.set(base, json);

  const dir = ensureWritableDirs();
  const p = path.join(dir, base);
  fs.writeFileSync(/*turbopackIgnore: true*/ p, json, "utf8");

  if (DURABLE_JSON.has(base) && blobConfigured()) {
    await pushJsonToBlob(base, json);
    // Let other instances re-pull promptly
    invalidateHydrateLatch();
    // Keep this instance's memory as source of truth until next TTL pull
    memoryJson.set(base, json);
    lastHydrateAt = Date.now();
  }
}

export function tryWriteJsonFile(filename: string, data: unknown): boolean {
  try {
    writeJsonFile(filename, data);
    return true;
  } catch {
    return false;
  }
}

export function writableUploadsDir(): string {
  return path.join(ensureWritableDirs({ uploads: true }), "uploads");
}

function blobUploadPathname(filename: string) {
  return `tvh-data/uploads/${path.basename(filename)}`;
}

function guessUploadContentType(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  const map: Record<string, string> = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".gif": "image/gif",
    ".pdf": "application/pdf",
    ".mp4": "video/mp4",
    ".webm": "video/webm",
    ".mov": "video/quicktime",
  };
  return map[ext] || "application/octet-stream";
}

/**
 * Persist an uploaded file.
 * Always stores the stable app URL `/api/media/{name}` so private Blob stores
 * still work (media route fetches with the token). On Vercel without Blob,
 * uploads cannot survive cold starts — we throw instead of silently breaking.
 */
export async function saveUploadFile(
  buffer: Buffer,
  filename: string,
  contentType?: string
): Promise<{ url: string; name: string; blobUrl?: string }> {
  const safe = path
    .basename(String(filename || "upload.bin"))
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .slice(0, 80);
  const name = `${Date.now().toString(36)}-${safe || "upload.bin"}`;
  const mime = contentType || guessUploadContentType(name);
  const appUrl = `/api/media/${encodeURIComponent(name)}`;

  // Local /tmp write for same-instance + local dev
  try {
    const dir = writableUploadsDir();
    fs.writeFileSync(/*turbopackIgnore: true*/ path.join(dir, name), buffer);
  } catch (err) {
    console.error("[dataFs] local upload write failed", name, err);
  }

  if (blobConfigured()) {
    const { put } = await import("@vercel/blob");
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    const pathname = blobUploadPathname(name);
    const baseOpts = {
      addRandomSuffix: false as const,
      allowOverwrite: true,
      contentType: mime,
      token,
    };
    let blobUrl: string | undefined;
    try {
      const result = await put(pathname, buffer, {
        ...baseOpts,
        access: "public",
      });
      blobUrl = result?.url;
    } catch {
      try {
        const result = await put(pathname, buffer, {
          ...baseOpts,
          access: "private",
        });
        blobUrl = result?.url;
      } catch (err) {
        console.error("[dataFs] upload blob put failed", name, err);
        throw new Error(
          "Photo storage failed (Vercel Blob). Confirm BLOB_READ_WRITE_TOKEN is set for Production and redeploy."
        );
      }
    }
    // App URL always proxies through /api/media (works for private blobs)
    return { url: appUrl, name, blobUrl };
  }

  if (isEphemeralHost()) {
    throw new Error(
      "BLOB_READ_WRITE_TOKEN is not set. Photos cannot be stored on Vercel without Blob — add the token in Project Settings → Environment Variables, then redeploy."
    );
  }

  return { url: appUrl, name };
}

/** Look up Blob URL for a prior upload by basename. */
export async function resolveUploadBlobUrl(
  name: string
): Promise<string | null> {
  if (!blobConfigured()) return null;
  const base = path.basename(String(name || ""));
  if (!base || base === "." || base === "..") return null;
  try {
    const { list } = await import("@vercel/blob");
    const pathname = blobUploadPathname(base);
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    const { blobs } = await list({
      prefix: pathname,
      token,
      limit: 5,
    });
    const hit = blobs.find(
      (b) => b.pathname === pathname || b.pathname.endsWith(`/${base}`)
    );
    return hit?.url || null;
  } catch (err) {
    console.error("[dataFs] upload blob resolve failed", base, err);
    return null;
  }
}

/** Fetch upload bytes from Blob (supports private stores via Bearer token). */
export async function fetchUploadBlobBytes(
  name: string
): Promise<{ data: Buffer; contentType: string } | null> {
  const blobUrl = await resolveUploadBlobUrl(name);
  if (!blobUrl) return null;
  const token = process.env.BLOB_READ_WRITE_TOKEN?.trim();
  try {
    const res = await fetch(blobUrl, {
      cache: "no-store",
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    if (!res.ok) {
      console.error("[dataFs] blob fetch failed", name, res.status);
      return null;
    }
    const data = Buffer.from(await res.arrayBuffer());
    const contentType =
      res.headers.get("content-type") ||
      guessUploadContentType(name) ||
      "application/octet-stream";
    return { data, contentType };
  } catch (err) {
    console.error("[dataFs] blob fetch error", name, err);
    return null;
  }
}

/** Resolve an upload by basename from /tmp overlay, then bundled uploads. */
export function resolveUploadFile(name: string): string | null {
  const base = path.basename(String(name || ""));
  if (!base || base === "." || base === ".." || base.includes("\0")) {
    return null;
  }

  const tmp = tmpUploadPath(base);
  try {
    if (
      fs.existsSync(/*turbopackIgnore: true*/ tmp) &&
      fs.statSync(/*turbopackIgnore: true*/ tmp).isFile()
    ) {
      return tmp;
    }
  } catch {
    /* ignore */
  }

  const bundled = bundleUploadPath(base);
  try {
    if (
      fs.existsSync(/*turbopackIgnore: true*/ bundled) &&
      fs.statSync(/*turbopackIgnore: true*/ bundled).isFile()
    ) {
      return bundled;
    }
  } catch {
    /* ignore */
  }

  return null;
}
