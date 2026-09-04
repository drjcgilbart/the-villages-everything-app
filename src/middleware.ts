import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  applySecurityHeaders,
  isNativeAppUserAgent,
  originAllowed,
} from "@/lib/security";

/** Keep in sync with SITE_GATE_COOKIE in src/lib/siteGate.ts */
const SITE_GATE_COOKIE = "tvh_site_gate";

/** Keep in sync with siteGateTokenForPassword in src/lib/siteGate.ts */
async function siteGateToken(password: string): Promise<string> {
  const data = new TextEncoder().encode(`tvh-site-gate-v1:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function isPublicAsset(pathname: string): boolean {
  if (pathname.startsWith("/_next")) return true;
  if (pathname === "/favicon.ico") return true;
  if (pathname === "/robots.txt") return true;
  if (pathname === "/sitemap.xml") return true;
  if (
    pathname.startsWith("/graphics/") ||
    pathname.startsWith("/golf-cart-hero/") ||
    pathname.startsWith("/music/") ||
    pathname.startsWith("/file.") ||
    pathname.startsWith("/globe.") ||
    pathname.startsWith("/next.") ||
    pathname.startsWith("/vercel.") ||
    pathname.startsWith("/window.")
  ) {
    return true;
  }
  return /\.(?:svg|png|jpg|jpeg|gif|webp|ico|mp3|css|js|map|txt|xml)$/i.test(
    pathname
  );
}

/** Short-lived cache so we don't hit Redis on every request. */
let gateProbeCache: { at: number; active: boolean } | null = null;
const GATE_PROBE_TTL_MS = 12_000;

/** Keep in sync with redisKey() in src/lib/dataFs.ts */
const SITE_GATE_REDIS_KEY = "tvh-data:site-gate-settings.json";

/**
 * Admin toggle lives in Redis JSON. Routing Middleware must never fetch this
 * same deployment (e.g. /api/site-gate): that self-fetch deadlocks on Vercel
 * and surfaces as MIDDLEWARE_INVOCATION_TIMEOUT / 504.
 *
 * Read the Redis key directly (different origin) with a short timeout.
 * Fail open (public site) if Redis is missing or slow.
 */
async function readGateEnabledFromRedis(): Promise<boolean> {
  const url = (
    process.env.UPSTASH_REDIS_REST_URL ||
    process.env.KV_REST_API_URL ||
    ""
  ).trim();
  const token = (
    process.env.UPSTASH_REDIS_REST_TOKEN ||
    process.env.KV_REST_API_TOKEN ||
    ""
  ).trim();
  if (!url || !token) return false;

  const res = await fetch(url.replace(/\/$/, ""), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(["GET", SITE_GATE_REDIS_KEY]),
    cache: "no-store",
    signal: AbortSignal.timeout(1500),
  });
  if (!res.ok) return false;

  const data = (await res.json()) as { result?: unknown };
  if (typeof data.result !== "string" || !data.result) return false;

  const parsed = JSON.parse(data.result) as { enabled?: unknown };
  return parsed?.enabled === true;
}

async function isGateActive(password: string): Promise<boolean> {
  if (!password) return false;

  // Optional hard env overrides (emergency / local)
  const envFlag = (process.env.SITE_GATE_ENABLED || "").trim().toLowerCase();
  if (envFlag === "0" || envFlag === "false" || envFlag === "off") {
    return false;
  }
  if (envFlag === "1" || envFlag === "true" || envFlag === "on") {
    return true;
  }

  const now = Date.now();
  if (gateProbeCache && now - gateProbeCache.at < GATE_PROBE_TTL_MS) {
    return gateProbeCache.active;
  }

  try {
    const active = await readGateEnabledFromRedis();
    gateProbeCache = { at: now, active };
    return active;
  } catch {
    // Fail open: public site if we can't read the toggle
    gateProbeCache = { at: now, active: false };
    return false;
  }
}

function withSecurity(res: NextResponse): NextResponse {
  return applySecurityHeaders(res);
}

export async function middleware(req: NextRequest) {
  const password = (process.env.SITE_PASSWORD || "").trim();
  const { pathname } = req.nextUrl;
  const method = req.method.toUpperCase();

  if (isPublicAsset(pathname)) {
    return withSecurity(NextResponse.next());
  }

  if (
    ["POST", "PUT", "PATCH", "DELETE"].includes(method) &&
    pathname.startsWith("/api/") &&
    !originAllowed(req)
  ) {
    return withSecurity(
      NextResponse.json({ error: "Forbidden origin" }, { status: 403 })
    );
  }

  if (
    method === "POST" &&
    isNativeAppUserAgent(req) &&
    (pathname === "/api/donate/checkout" ||
      pathname === "/api/golf-cart-hero/donate/checkout" ||
      pathname === "/api/members/subscribe")
  ) {
    return withSecurity(
      NextResponse.json(
        { error: "Purchases aren’t available in the store app." },
        { status: 403 }
      )
    );
  }

  // Unlock UI + gate status/API always reachable
  if (
    pathname.startsWith("/beta-gate") ||
    pathname.startsWith("/api/site-gate")
  ) {
    return withSecurity(NextResponse.next());
  }

  // Vercel Cron must reach refresh without a browser cookie
  if (
    (pathname.startsWith("/api/real-estate/refresh") ||
      pathname.startsWith("/api/real-estate/youtube-refresh") ||
      pathname.startsWith("/api/videos/youtube-refresh") ||
      pathname.startsWith("/api/entertainment/refresh") ||
      pathname.startsWith("/api/calendar/refresh") ||
      pathname.startsWith("/api/best-of-month/tabulate")) &&
    (req.headers.get("x-vercel-cron") === "1" ||
      req.headers.get("authorization")?.startsWith("Bearer "))
  ) {
    return withSecurity(NextResponse.next());
  }

  // No password configured, or admin toggle says gate is off → full public access
  if (!(await isGateActive(password))) {
    return withSecurity(NextResponse.next());
  }

  const expected = await siteGateToken(password);
  const cookie = req.cookies.get(SITE_GATE_COOKIE)?.value;

  if (cookie && cookie === expected) {
    return withSecurity(NextResponse.next());
  }

  if (pathname.startsWith("/api/")) {
    return withSecurity(
      NextResponse.json(
        { error: "Beta password required", code: "SITE_GATE" },
        { status: 401 }
      )
    );
  }

  const url = req.nextUrl.clone();
  url.pathname = "/beta-gate";
  if (pathname !== "/" && pathname !== "/beta-gate") {
    url.searchParams.set("from", pathname);
  }
  return withSecurity(NextResponse.redirect(url));
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
