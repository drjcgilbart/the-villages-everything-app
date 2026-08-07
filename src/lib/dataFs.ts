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
  try {
    const { put } = await import("@vercel/blob");
    await put(blobPathname(filename), json, {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
  } catch (err) {
    console.error("[dataFs] blob put failed", filename, err);
  }
}

async function pullJsonFromBlob(filename: string): Promise<string | null> {
  if (!blobConfigured() || !DURABLE_JSON.has(filename)) return null;
  try {
    const { list } = await import("@vercel/blob");
    const { blobs } = await list({
      prefix: blobPathname(filename),
      token: process.env.BLOB_READ_WRITE_TOKEN,
      limit: 5,
    });
    const hit = blobs.find((b) => b.pathname === blobPathname(filename));
    if (!hit?.url) return null;
    const res = await fetch(hit.url, { cache: "no-store" });
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
    void pushJsonToBlob(base, json);
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
 * Persist an uploaded file. On Vercel with Blob configured, stores to public
 * Blob and returns that absolute URL (works on every serverless instance).
 * Locally (or without Blob), writes disk and returns `/api/media/...`.
 */
export async function saveUploadFile(
  buffer: Buffer,
  filename: string,
  contentType?: string
): Promise<{ url: string; name: string }> {
  const safe = path
    .basename(String(filename || "upload.bin"))
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .slice(0, 80);
  const name = `${Date.now().toString(36)}-${safe || "upload.bin"}`;
  const mime = contentType || guessUploadContentType(name);

  // Local /tmp write for same-instance + local dev
  try {
    const dir = writableUploadsDir();
    fs.writeFileSync(/*turbopackIgnore: true*/ path.join(dir, name), buffer);
  } catch (err) {
    console.error("[dataFs] local upload write failed", name, err);
  }

  if (blobConfigured()) {
    try {
      const { put } = await import("@vercel/blob");
      const result = await put(blobUploadPathname(name), buffer, {
        access: "public",
        addRandomSuffix: false,
        allowOverwrite: true,
        contentType: mime,
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });
      if (result?.url) {
        return { url: result.url, name };
      }
    } catch (err) {
      console.error("[dataFs] upload blob put failed", name, err);
    }
  }

  return { url: `/api/media/${name}`, name };
}

/** Look up a public Blob URL for a prior upload by basename. */
export async function resolveUploadBlobUrl(
  name: string
): Promise<string | null> {
  if (!blobConfigured()) return null;
  const base = path.basename(String(name || ""));
  if (!base || base === "." || base === "..") return null;
  try {
    const { list } = await import("@vercel/blob");
    const pathname = blobUploadPathname(base);
    const { blobs } = await list({
      prefix: pathname,
      token: process.env.BLOB_READ_WRITE_TOKEN,
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
