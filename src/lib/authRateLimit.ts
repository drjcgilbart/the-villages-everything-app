import { NextResponse } from "next/server";

/**
 * In-memory throttle. Best-effort on serverless (each instance has its
 * own map) — still stops casual spraying from one IP on that instance.
 */
const AUTH_WINDOW_MS = 15 * 60 * 1000;
const AUTH_MAX_ATTEMPTS = 8;

type Rec = { count: number; resetAt: number };
const buckets = new Map<string, Rec>();

function clientKey(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return req.headers.get("x-real-ip") || "unknown";
}

export function rateLimit(
  req: Request,
  name: string,
  max: number,
  windowMs: number
): { ok: boolean; retryAfterSec: number } {
  const key = `${name}:${clientKey(req)}`;
  const now = Date.now();
  const rec = buckets.get(key);
  if (!rec || now >= rec.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfterSec: 0 };
  }
  rec.count += 1;
  if (rec.count > max) {
    return {
      ok: false,
      retryAfterSec: Math.max(1, Math.ceil((rec.resetAt - now) / 1000)),
    };
  }
  return { ok: true, retryAfterSec: 0 };
}

export function rateLimitResponse(
  req: Request,
  name: string,
  max: number,
  windowMs = AUTH_WINDOW_MS
): NextResponse | null {
  const gate = rateLimit(req, name, max, windowMs);
  if (gate.ok) return null;
  return NextResponse.json(
    { error: "Too many attempts. Try again later." },
    {
      status: 429,
      headers: { "Retry-After": String(gate.retryAfterSec) },
    }
  );
}

export function authAttemptAllowed(req: Request): {
  ok: boolean;
  retryAfterSec: number;
} {
  return rateLimit(req, "auth", AUTH_MAX_ATTEMPTS, AUTH_WINDOW_MS);
}

export function clearAuthAttempts(req: Request) {
  buckets.delete(`auth:${clientKey(req)}`);
  buckets.delete(`member-login:${clientKey(req)}`);
}
