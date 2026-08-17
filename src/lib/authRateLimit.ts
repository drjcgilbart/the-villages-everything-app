/**
 * In-memory login throttle. Best-effort on serverless (each instance
 * has its own map) — still stops casual password spraying from one IP.
 */
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 8;

const attempts = new Map<string, { count: number; resetAt: number }>();

function clientKey(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return req.headers.get("x-real-ip") || "unknown";
}

export function authAttemptAllowed(req: Request): {
  ok: boolean;
  retryAfterSec: number;
} {
  const key = clientKey(req);
  const now = Date.now();
  const rec = attempts.get(key);
  if (!rec || now >= rec.resetAt) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true, retryAfterSec: 0 };
  }
  rec.count += 1;
  if (rec.count > MAX_ATTEMPTS) {
    return {
      ok: false,
      retryAfterSec: Math.max(1, Math.ceil((rec.resetAt - now) / 1000)),
    };
  }
  return { ok: true, retryAfterSec: 0 };
}

export function clearAuthAttempts(req: Request) {
  attempts.delete(clientKey(req));
}
