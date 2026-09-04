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

/**
 * Live wall is env-only. Routing Middleware must not fetch this deployment
 * or Redis/Blob: any pending network call can hang the isolate and Vercel
 * returns 504 MIDDLEWARE_INVOCATION_TIMEOUT.
 *
 * On:  SITE_GATE_ENABLED=on|true|1  (and SITE_PASSWORD set)
 * Off: unset, or off|false|0  → public site
 */
function isGateActive(password: string): boolean {
  if (!password) return false;
  const envFlag = (process.env.SITE_GATE_ENABLED || "").trim().toLowerCase();
  return envFlag === "1" || envFlag === "true" || envFlag === "on";
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

  // No password configured, or SITE_GATE_ENABLED is not on → full public access
  if (!isGateActive(password)) {
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
