import fs from "fs";
import path from "path";

/**
 * JSON + upload helpers for local disk and Vercel/Lambda.
 *
 * Bundled seeds: process.cwd()/data (read-only on serverless)
 * Runtime writes: /tmp/tvh-data (ephemeral per instance)
 * Durable JSON (any of these):
 *   - Upstash Redis REST (UPSTASH_REDIS_REST_URL + TOKEN) — free tier; use when
 *     Vercel Blob Hobby is over quota
 *   - Vercel Blob (BLOB_READ_WRITE_TOKEN / BLOB_STORE_ID)
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

/**
 * True on real serverless hosts (Vercel production/preview, Lambda, etc.).
 * False for local `next dev`, `next start` on your PC, and `vercel dev`
 * (VERCEL_ENV=development) — those should use the project `data/` folder.
 */
export function isEphemeralHost(): boolean {
  // Local tooling: never treat as serverless read-only disk
  if (
    process.env.VERCEL_ENV === "development" ||
    process.env.NODE_ENV === "development"
  ) {
    return false;
  }
  return Boolean(
    process.env.VERCEL ||
      process.env.AWS_LAMBDA_FUNCTION_NAME ||
      process.env.NETLIFY
  );
}

/**
 * True when Vercel Blob can authenticate:
 * - static `BLOB_READ_WRITE_TOKEN`, and/or
 * - OIDC on Vercel via `BLOB_STORE_ID` (+ platform `VERCEL_OIDC_TOKEN`)
 */
export function blobConfigured(): boolean {
  return Boolean(
    process.env.BLOB_READ_WRITE_TOKEN?.trim() ||
      process.env.BLOB_STORE_ID?.trim()
  );
}

/**
 * Free-tier durable JSON via Redis REST (no npm package required).
 * Accepts Upstash names OR Vercel Marketplace KV names:
 *   UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN
 *   KV_REST_API_URL / KV_REST_API_TOKEN  (Vercel KV / Upstash integration)
 */
function redisRestUrl(): string {
  return (
    process.env.UPSTASH_REDIS_REST_URL?.trim() ||
    process.env.KV_REST_API_URL?.trim() ||
    ""
  );
}

function redisRestToken(): string {
  return (
    process.env.UPSTASH_REDIS_REST_TOKEN?.trim() ||
    process.env.KV_REST_API_TOKEN?.trim() ||
    ""
  );
}

export function redisConfigured(): boolean {
  return Boolean(redisRestUrl() && redisRestToken());
}

/** Any durable backend for admin/member JSON on serverless. */
export function durableConfigured(): boolean {
  return blobConfigured() || redisConfigured();
}

/**
 * Durable sync is required on serverless when a backend is configured.
 * Locally, disk is the source of truth; remote sync is optional.
 */
export function blobRequired(): boolean {
  return isEphemeralHost() && durableConfigured();
}

export function durableRequired(): boolean {
  return isEphemeralHost() && durableConfigured();
}

function redisKey(filename: string) {
  return `tvh-data:${path.basename(filename)}`;
}

async function redisCommand(command: string[]): Promise<unknown> {
  const url = redisRestUrl();
  const token = redisRestToken();
  if (!url || !token) {
    throw new Error("Redis is not configured");
  }
  const res = await fetch(`${url.replace(/\/$/, "")}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `Redis HTTP ${res.status}${text ? `: ${text.slice(0, 200)}` : ""}`
    );
  }
  const data = (await res.json()) as { result?: unknown; error?: string };
  if (data.error) throw new Error(`Redis: ${data.error}`);
  return data.result;
}

/** Clear steps when Blob is dead and Redis is missing (Hobby quota case). */
export function missingDurableStorageHelp(): string {
  return (
    "Vercel Blob Hobby is over quota (or failing), so member saves need free Redis. " +
    "In Vercel → Storage (or upstash.com): create Redis/KV, then set Production env " +
    "UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN (or KV_REST_API_URL + KV_REST_API_TOKEN), " +
    "then Redeploy. Blob alone cannot save until the Hobby limit resets (e.g. 9/6/26) or you upgrade to Pro."
  );
}

async function pushJsonToRedis(filename: string, json: string): Promise<void> {
  if (!redisConfigured() || !DURABLE_JSON.has(filename)) return;
  await redisCommand(["SET", redisKey(filename), json]);
}

async function pullJsonFromRedis(filename: string): Promise<string | null> {
  if (!redisConfigured() || !DURABLE_JSON.has(filename)) return null;
  try {
    const result = await redisCommand(["GET", redisKey(filename)]);
    if (result == null) return null;
    const text = String(result);
    return text || null;
  } catch (err) {
    console.error("[dataFs] redis pull failed", filename, err);
    return null;
  }
}

/**
 * Do NOT pass an explicit `token` into @vercel/blob when possible.
 * An explicit token always wins over OIDC — a stale BLOB_READ_WRITE_TOKEN
 * on Production will break saves even when the store is correctly connected.
 * Let the SDK resolve: OIDC + BLOB_STORE_ID → else env BLOB_READ_WRITE_TOKEN.
 */
function blobAuthOptions(): { token?: string } {
  // Only force the static token off-Vercel (local / non-OIDC hosts).
  if (!process.env.VERCEL && process.env.BLOB_READ_WRITE_TOKEN?.trim()) {
    return { token: process.env.BLOB_READ_WRITE_TOKEN.trim() };
  }
  return {};
}

type BlobAccess = "public" | "private";

function isBlobQuotaError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return /usage limits?|hobby plan|access resumes|quota|rate limit|402|403/i.test(
    msg
  );
}

function formatBlobError(err: unknown): string {
  if (!(err instanceof Error)) return String(err);
  const name = err.name || "Error";
  if (
    isBlobQuotaError(err) ||
    /usage limits?|hobby plan|access resumes/i.test(err.message)
  ) {
    return (
      "Vercel Blob Hobby plan is over its monthly limit (access resumes on the date shown in Vercel Storage). " +
      "Until then, add free Upstash Redis env vars UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN (see DEPLOY-SIMPLE.md), or upgrade Blob to Pro."
    );
  }
  // Helpful common cases from @vercel/blob
  if (name.includes("StoreNotFound") || /store not found/i.test(err.message)) {
    return "Blob store not found — connect a Blob store to this Vercel project (Storage → Blob) and redeploy.";
  }
  if (name.includes("Access") || /access/i.test(err.message)) {
    return `Blob access denied (${err.message}). Store may be private while code used public, or token is wrong.`;
  }
  if (/no token|token not found|BLOB_READ_WRITE/i.test(err.message)) {
    return "No Blob credentials. Set BLOB_READ_WRITE_TOKEN or connect the store (BLOB_STORE_ID) for Production, then redeploy.";
  }
  return err.message;
}

/** put JSON/bytes trying store access modes private then public. */
async function putBlobWithAccess(
  pathname: string,
  body: Buffer | string,
  contentType: string
): Promise<{ url?: string }> {
  const { put } = await import("@vercel/blob");
  const auth = blobAuthOptions();
  const baseOpts = {
    addRandomSuffix: false as const,
    allowOverwrite: true,
    contentType,
    ...auth,
  };
  // Prefer private (admin/member data); fall back to public stores.
  const modes: BlobAccess[] = ["private", "public"];
  let lastErr: unknown;
  for (const access of modes) {
    try {
      const result = await put(pathname, body, { ...baseOpts, access });
      return { url: result?.url };
    } catch (err) {
      lastErr = err;
    }
  }
  throw lastErr instanceof Error
    ? lastErr
    : new Error(formatBlobError(lastErr));
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
  try {
    await putBlobWithAccess(
      blobPathname(filename),
      Buffer.from(json, "utf8"),
      "application/json"
    );
  } catch (err) {
    console.error("[dataFs] blob put failed", filename, err);
    throw new Error(
      `Could not save ${filename} to Vercel Blob. ${formatBlobError(err)}`
    );
  }
}

/**
 * Sync durable JSON to Redis and/or Blob.
 * Success if **any** backend works (so Hobby Blob quota does not block Redis).
 * Local disk hosts: never fail the request.
 */
async function syncDurableJson(filename: string, json: string): Promise<void> {
  if (!DURABLE_JSON.has(filename)) return;

  // No remote backend at all
  if (!durableConfigured()) {
    if (!isEphemeralHost()) return;
    throw new Error(
      `Could not save ${filename}. ${missingDurableStorageHelp()}`
    );
  }

  const errors: string[] = [];
  let ok = false;
  let blobQuota = false;

  // Prefer Redis first when configured (works while Blob Hobby is locked).
  if (redisConfigured()) {
    try {
      await pushJsonToRedis(filename, json);
      ok = true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      errors.push(`Redis: ${msg}`);
      console.error("[dataFs] redis put failed", filename, err);
    }
  }

  // Skip Blob when Redis already succeeded (saves quota / avoids noise).
  // If Redis missing or failed, still try Blob.
  if (!ok && blobConfigured()) {
    try {
      await pushJsonToBlob(filename, json);
      ok = true;
    } catch (err) {
      if (isBlobQuotaError(err)) blobQuota = true;
      errors.push(`Blob: ${formatBlobError(err)}`);
      console.error("[dataFs] blob put failed", filename, err);
    }
  }

  if (ok) {
    invalidateHydrateLatch();
    memoryJson.set(filename, json);
    lastHydrateAt = Date.now();
    return;
  }

  // Nothing remote worked
  if (!isEphemeralHost()) {
    console.warn(
      "[dataFs] Durable sync skipped (local disk is source of truth):",
      filename,
      errors.join(" | ")
    );
    return;
  }

  // Always surface Redis setup when Blob is the only (failing) option
  if (!redisConfigured() || blobQuota) {
    throw new Error(
      `Could not save ${filename}. ${missingDurableStorageHelp()} ` +
        `(details: ${errors.join(" · ") || "blob failed"}) [storage-v2]`
    );
  }

  throw new Error(
    `Could not save ${filename} to durable storage. ${errors.join(" · ") || "No backend configured."} [storage-v2]`
  );
}

/** Pull one durable JSON file from Blob (works for private stores via SDK get). */
export async function pullJsonFromBlob(
  filename: string
): Promise<string | null> {
  if (!blobConfigured() || !DURABLE_JSON.has(filename)) return null;
  const pathname = blobPathname(filename);
  try {
    const { get } = await import("@vercel/blob");
    const auth = blobAuthOptions();
    for (const access of ["private", "public"] as BlobAccess[]) {
      try {
        const result = await get(pathname, {
          access,
          useCache: false,
          ...auth,
        });
        if (!result?.stream) continue;
        const chunks: Buffer[] = [];
        const reader = result.stream.getReader();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          if (value) chunks.push(Buffer.from(value));
        }
        const text = Buffer.concat(chunks).toString("utf8");
        if (text) return text;
      } catch {
        /* try other access mode */
      }
    }
    // Fallback: list + get by URL (older blobs)
    const { list } = await import("@vercel/blob");
    const { blobs } = await list({ prefix: pathname, limit: 5, ...auth });
    const hit = blobs.find((b) => b.pathname === pathname);
    if (!hit?.url) return null;
    for (const access of ["private", "public"] as BlobAccess[]) {
      try {
        const result = await get(hit.url, {
          access,
          useCache: false,
          ...auth,
        });
        if (!result?.stream) continue;
        const chunks: Buffer[] = [];
        const reader = result.stream.getReader();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          if (value) chunks.push(Buffer.from(value));
        }
        return Buffer.concat(chunks).toString("utf8");
      } catch {
        /* next */
      }
    }
    return null;
  } catch (err) {
    console.error("[dataFs] blob pull failed", filename, err);
    return null;
  }
}

/**
 * Hydrate durable JSON from Redis + Blob into memory + /tmp.
 * Redis wins over Blob when both have a file (Redis is preferred while Blob is capped).
 * Call from root layout / admin API so every instance sees admin grants.
 */
export async function hydrateDurableJsonFromBlob(): Promise<{
  ok: boolean;
  blob: boolean;
  redis: boolean;
  files: string[];
}> {
  if (!durableConfigured()) {
    return { ok: false, blob: false, redis: false, files: [] };
  }
  const loaded: string[] = [];
  for (const file of DURABLE_JSON) {
    // Prefer Redis (active during Blob Hobby lockout), then Blob
    let text = await pullJsonFromRedis(file);
    if (!text) text = await pullJsonFromBlob(file);
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
  return {
    ok: true,
    blob: blobConfigured(),
    redis: redisConfigured(),
    files: loaded,
  };
}

let hydrateOnce: Promise<void> | null = null;
/** Last successful hydrate time — re-pull so other instances see approvals. */
let lastHydrateAt = 0;
const HYDRATE_TTL_MS = 4_000;

/**
 * Coalesce concurrent hydrates, but re-pull every few seconds on
 * serverless so admin approvals/submits appear on every instance.
 */
export function ensureDurableHydrated(): Promise<void> {
  if (!isEphemeralHost() || !durableConfigured()) {
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
  if (DURABLE_JSON.has(base) && durableConfigured()) {
    void syncDurableJson(base, json).catch((err) =>
      console.error("[dataFs] fire-and-forget durable put failed", base, err)
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

  // Local: disk write is enough (remote optional). Serverless: await Redis/Blob.
  if (DURABLE_JSON.has(base)) {
    if (isEphemeralHost() || durableConfigured()) {
      await syncDurableJson(base, json);
    }
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
    const pathname = blobUploadPathname(name);
    try {
      const result = await putBlobWithAccess(pathname, buffer, mime);
      // App URL always proxies through /api/media (works for private blobs)
      return { url: appUrl, name, blobUrl: result.url };
    } catch (err) {
      console.error("[dataFs] upload blob put failed", name, err);
      // Local: file is already on disk under data/uploads — keep going.
      if (blobRequired()) {
        throw new Error(
          `Photo storage failed (Vercel Blob). ${formatBlobError(err)}`
        );
      }
      console.warn(
        "[dataFs] Blob upload skipped; using local disk file:",
        name
      );
      return { url: appUrl, name };
    }
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
    const auth = blobAuthOptions();
    const { blobs } = await list({
      prefix: pathname,
      limit: 5,
      ...auth,
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

async function streamToBuffer(
  stream: ReadableStream<Uint8Array>
): Promise<Buffer> {
  const chunks: Buffer[] = [];
  const reader = stream.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) chunks.push(Buffer.from(value));
  }
  return Buffer.concat(chunks);
}

/** Fetch upload bytes from Blob (private stores via SDK get + OIDC/token). */
export async function fetchUploadBlobBytes(
  name: string
): Promise<{ data: Buffer; contentType: string } | null> {
  if (!blobConfigured()) return null;
  const base = path.basename(String(name || ""));
  if (!base || base === "." || base === "..") return null;
  const pathname = blobUploadPathname(base);
  const auth = blobAuthOptions();
  try {
    const { get } = await import("@vercel/blob");
    for (const access of ["private", "public"] as BlobAccess[]) {
      try {
        const result = await get(pathname, {
          access,
          useCache: false,
          ...auth,
        });
        if (!result?.stream) continue;
        const data = await streamToBuffer(result.stream);
        const contentType =
          result.blob?.contentType ||
          guessUploadContentType(base) ||
          "application/octet-stream";
        return { data, contentType };
      } catch {
        /* try other mode / URL */
      }
    }
    const blobUrl = await resolveUploadBlobUrl(base);
    if (!blobUrl) return null;
    for (const access of ["private", "public"] as BlobAccess[]) {
      try {
        const result = await get(blobUrl, {
          access,
          useCache: false,
          ...auth,
        });
        if (!result?.stream) continue;
        const data = await streamToBuffer(result.stream);
        const contentType =
          result.blob?.contentType ||
          guessUploadContentType(base) ||
          "application/octet-stream";
        return { data, contentType };
      } catch {
        /* next */
      }
    }
    return null;
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
