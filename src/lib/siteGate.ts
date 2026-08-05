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

function signingSecret(): string {
  return (
    process.env.SITE_GATE_SECRET ||
    process.env.ADMIN_SECRET ||
    getSitePassword() ||
    "site-gate-dev"
  );
}

/** HMAC token for a given password (must match middleware Web Crypto). */
export function siteGateTokenForPassword(password: string): string {
  return crypto
    .createHmac("sha256", signingSecret())
    .update(`site-gate:${password}`)
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
