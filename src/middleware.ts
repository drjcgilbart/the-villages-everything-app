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

export async function middleware(req: NextRequest) {
  const password = (process.env.SITE_PASSWORD || "").trim();
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
