import crypto from "crypto";

/** HTTP-only cookie set after a successful beta unlock */
export const SITE_GATE_COOKIE = "tvh_site_gate";

/**
 * Gate is active only when SITE_PASSWORD is a non-empty string.
 * Remove or empty the env var to open the site fully.
 */
export function isSiteGateEnabled(): boolean {
  return Boolean(getSitePassword());
}

export function getSitePassword(): string {
  return (process.env.SITE_PASSWORD || "").trim();
}

/**
 * Unlock token derived only from SITE_PASSWORD (no secondary secret).
 * Must match the Edge middleware implementation in src/middleware.ts.
 *
 * Using plain SHA-256 of a fixed prefix + password avoids Node HMAC vs
 * Web Crypto key-import mismatches and env fallback differences.
 */
export function siteGateTokenForPassword(password: string): string {
  return crypto
    .createHash("sha256")
    .update(`tvh-site-gate-v1:${password}`, "utf8")
    .digest("hex");
}

export function expectedSiteGateToken(): string {
  return siteGateTokenForPassword(getSitePassword());
}

export function siteGateCookieOptions(maxAgeSec = 60 * 60 * 24 * 30) {
  return {
    name: SITE_GATE_COOKIE,
    value: expectedSiteGateToken(),
    httpOnly: true,
    sameSite: "lax" as const,
    // Always set Secure in production builds (site is HTTPS on Vercel)
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: maxAgeSec,
  };
}

export function clearSiteGateCookieOptions() {
  return {
    name: SITE_GATE_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  };
}
