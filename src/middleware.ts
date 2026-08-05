import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** Keep in sync with SITE_GATE_COOKIE in src/lib/siteGate.ts */
const SITE_GATE_COOKIE = "tvh_site_gate";

async function hmacHex(secret: string, message: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function isPublicAsset(pathname: string): boolean {
  if (pathname.startsWith("/_next")) return true;
  if (pathname === "/favicon.ico") return true;
  if (pathname === "/robots.txt") return true;
  if (pathname === "/sitemap.xml") return true;
  // Static files under /public
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

export async function middleware(req: NextRequest) {
  const password = (process.env.SITE_PASSWORD || "").trim();
  // Gate off when password not configured
  if (!password) {
    return NextResponse.next();
  }

  const { pathname } = req.nextUrl;

  if (isPublicAsset(pathname)) {
    return NextResponse.next();
  }

  // Unlock UI + API always reachable
  if (pathname.startsWith("/beta-gate") || pathname.startsWith("/api/site-gate")) {
    return NextResponse.next();
  }

  // Vercel Cron must reach refresh without a browser cookie
  if (
    pathname.startsWith("/api/real-estate/refresh") &&
    (req.headers.get("x-vercel-cron") === "1" ||
      req.headers.get("authorization")?.startsWith("Bearer "))
  ) {
    return NextResponse.next();
  }

  const secret =
    process.env.SITE_GATE_SECRET ||
    process.env.ADMIN_SECRET ||
    password;
  const expected = await hmacHex(secret, `site-gate:${password}`);
  const cookie = req.cookies.get(SITE_GATE_COOKIE)?.value;

  if (cookie && cookie.length === expected.length && cookie === expected) {
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
  matcher: [
    /*
     * Run on all paths except Next internals and common static extensions.
     * (Double-checked again inside middleware.)
     */
    "/((?!_next/static|_next/image).*)",
  ],
};
