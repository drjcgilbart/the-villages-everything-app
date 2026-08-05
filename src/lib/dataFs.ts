import fs from "fs";
import path from "path";

/**
 * JSON + upload helpers that work on Vercel/Lambda.
 *
 * Bundled seed files live under process.cwd()/data (read-only on serverless).
 * Runtime writes go to /tmp/tvh-data so membership, forums, etc. can persist
 * for the life of a warm instance (ephemeral across cold starts / instances).
 */

const TMP_ROOT = path.join("/tmp", "tvh-data");

export const BUNDLE_DATA_DIR = path.join(process.cwd(), "data");

export function isEphemeralHost(): boolean {
  return Boolean(
    process.env.VERCEL ||
      process.env.AWS_LAMBDA_FUNCTION_NAME ||
      process.env.NETLIFY
  );
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

/** Prefer runtime overlay if present, else bundled seed under cwd. */
export function resolveJsonPath(filename: string): string | null {
  const base = path.basename(filename);
  if (!base || base.includes("..") || base.includes("/") || base.includes("\\")) {
    return null;
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
  const p = resolveJsonPath(filename);
  if (!p) return null;
  try {
    return JSON.parse(
      fs.readFileSync(/*turbopackIgnore: true*/ p, "utf8")
    ) as T;
  } catch {
    return null;
  }
}

export function writeJsonFile(filename: string, data: unknown): void {
  const base = path.basename(filename);
  if (!base || base.includes("..")) {
    throw new Error("Invalid data filename");
  }
  const dir = ensureWritableDirs();
  const p = path.join(dir, base);
  fs.writeFileSync(
    /*turbopackIgnore: true*/ p,
    JSON.stringify(data, null, 2),
    "utf8"
  );
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
