import { NextResponse } from "next/server";

const SITE_HOSTS = new Set([
  "thevillageseverythingapp.com",
  "www.thevillageseverythingapp.com",
  "localhost",
  "127.0.0.1",
]);

export function isProductionHost(): boolean {
  return (
    process.env.NODE_ENV === "production" ||
    process.env.VERCEL_ENV === "production"
  );
}

export function cookieSecure(): boolean {
  // Never mark cookies Secure on `next dev` — they would be dropped on http://localhost.
  if (process.env.NODE_ENV === "development") return false;
  return isProductionHost() || process.env.VERCEL === "1";
}

/** Constant-time-ish compare that works on the Edge runtime (no Node crypto). */
export function secretsMatch(a: string, b: string): boolean {
  const left = String(a || "");
  const right = String(b || "");
  const len = Math.max(left.length, right.length, 1);
  let diff = left.length ^ right.length;
  for (let i = 0; i < len; i++) {
    diff |= (left.charCodeAt(i) || 0) ^ (right.charCodeAt(i) || 0);
  }
  return diff === 0 && left.length > 0;
}

export function isNativeAppUserAgent(req: Request): boolean {
  return /VillagesEverythingApp/i.test(req.headers.get("user-agent") || "");
}

export function isInsecureAdminConfig(): boolean {
  const password = (process.env.ADMIN_PASSWORD || "").trim();
  return !password || password === "changeme" || password.length < 8;
}

function normalizeHost(host: string): string {
  return host.replace(/:\d+$/, "").replace(/^www\./, "").toLowerCase();
}

export function originAllowed(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true;

  let originHost = "";
  try {
    originHost = normalizeHost(new URL(origin).hostname);
  } catch {
    return false;
  }

  const reqHost = normalizeHost(
    req.headers.get("host") ||
      (process.env.NEXT_PUBLIC_SITE_URL
        ? new URL(process.env.NEXT_PUBLIC_SITE_URL).hostname
        : "")
  );

  if (originHost && reqHost && originHost === reqHost) return true;
  if (SITE_HOSTS.has(originHost) || SITE_HOSTS.has(`www.${originHost}`)) {
    return true;
  }
  if (originHost.endsWith(".vercel.app") && reqHost.endsWith(".vercel.app")) {
    return true;
  }
  if (!isProductionHost() && (originHost === "localhost" || originHost === "127.0.0.1")) {
    return true;
  }
  return false;
}

export function rejectIfCrossOrigin(req: Request): NextResponse | null {
  const method = req.method.toUpperCase();
  if (!["POST", "PUT", "PATCH", "DELETE"].includes(method)) return null;
  if (originAllowed(req)) return null;
  return NextResponse.json({ error: "Forbidden origin" }, { status: 403 });
}

export function isCronAuthorized(req: Request): boolean {
  if (req.headers.get("x-vercel-cron") === "1") return true;
  const cronSecret = (process.env.CRON_SECRET || "").trim();
  if (!cronSecret) return false;
  const auth = req.headers.get("authorization") || "";
  const headerSecret = req.headers.get("x-cron-secret") || "";
  return secretsMatch(auth, `Bearer ${cronSecret}`) || secretsMatch(headerSecret, cronSecret);
}

export const SECURITY_HEADERS: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "SAMEORIGIN",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-DNS-Prefetch-Control": "off",
  "Permissions-Policy":
    "camera=(self), microphone=(self), geolocation=(), payment=(self), usb=(), browsing-topics=()",
  "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
  "X-Permitted-Cross-Domain-Policies": "none",
};

export function applySecurityHeaders(res: NextResponse): NextResponse {
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    res.headers.set(key, value);
  }
  if (isProductionHost()) {
    res.headers.set(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload"
    );
  }
  res.headers.set("X-Powered-By", "");
  return res;
}
