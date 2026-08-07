import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

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

/** Short-lived cache so we don't hit the config API on every asset request. */
let gateProbeCache: { at: number; active: boolean } | null = null;
const GATE_PROBE_TTL_MS = 12_000;

/**
 * Admin toggle lives in durable JSON (Node). Edge middleware probes a public
 * status endpoint. Fail open (site live) if the probe fails — safer for go-live.
 */
async function isGateActive(req: NextRequest, password: string): Promise<boolean> {
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
    const url = new URL("/api/site-gate", req.nextUrl.origin);
    url.searchParams.set("probe", "1");
    const res = await fetch(url.toString(), {
      headers: {
        "x-tvh-gate-probe": "1",
        accept: "application/json",
      },
      cache: "no-store",
    });
    if (!res.ok) {
      gateProbeCache = { at: now, active: false };
      return false;
    }
    const data = (await res.json()) as { enabled?: boolean };
    const active = Boolean(data.enabled);
    gateProbeCache = { at: now, active };
    return active;
  } catch {
    // Fail open: public site if we can't read the toggle
    gateProbeCache = { at: now, active: false };
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const password = (process.env.SITE_PASSWORD || "").trim();
  const { pathname } = req.nextUrl;

  if (isPublicAsset(pathname)) {
    return NextResponse.next();
  }

  // Unlock UI + gate status/API always reachable (also used by this middleware probe)
  if (
    pathname.startsWith("/beta-gate") ||
    pathname.startsWith("/api/site-gate")
  ) {
    return NextResponse.next();
  }

  // Vercel Cron must reach refresh without a browser cookie
  if (
    (pathname.startsWith("/api/real-estate/refresh") ||
      pathname.startsWith("/api/entertainment/refresh") ||
      pathname.startsWith("/api/best-of-month/tabulate")) &&
    (req.headers.get("x-vercel-cron") === "1" ||
      req.headers.get("authorization")?.startsWith("Bearer "))
  ) {
    return NextResponse.next();
  }

  // No password configured, or admin toggle / probe says gate is off → full public access
  if (!(await isGateActive(req, password))) {
    return NextResponse.next();
  }

  const expected = await siteGateToken(password);
  const cookie = req.cookies.get(SITE_GATE_COOKIE)?.value;

  if (cookie && cookie === expected) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/")) {
    return NextResponse.json(
      { error: "Beta password required", code: "SITE_GATE" },
      { status: 401 }
    );
  }

  const url = req.nextUrl.clone();
  url.pathname = "/beta-gate";
  if (pathname !== "/" && pathname !== "/beta-gate") {
    url.searchParams.set("from", pathname);
  }
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
