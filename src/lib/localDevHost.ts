/**
 * True only on this PC's local Next.js server (start.bat / localhost).
 * Production, Vercel previews, and the store WebViews all fail this check.
 */
export function isLocalPcHost(host?: string | null): boolean {
  const h = String(host || "")
    .split(":")[0]
    .toLowerCase()
    .replace(/^\[|\]$/g, "");
  return h === "localhost" || h === "127.0.0.1" || h === "::1";
}

const PUBLIC_HOST_SUFFIXES = [
  "thevillageseverythingapp.com",
  "vercel.app",
  "now.sh",
];

/** Live site, Vercel deploys, and any public preview host. */
export function isDeployedPublicHost(host?: string | null): boolean {
  const h = String(host || "")
    .split(":")[0]
    .toLowerCase()
    .replace(/^\[|\]$/g, "");
  if (!h) return false;
  return PUBLIC_HOST_SUFFIXES.some((suffix) => h === suffix || h.endsWith(`.${suffix}`));
}

export function isLocalPcBrowser(): boolean {
  if (typeof window === "undefined") return false;
  return isLocalPcHost(window.location.hostname);
}

/** Phone-view button must not appear inside the preview iframe or store apps. */
export function isPhoneViewIframe(): boolean {
  if (typeof window === "undefined") return false;
  return window.self !== window.top;
}

/**
 * Admin + Phone view shortcuts. Local PC browser only.
 * Never on the live domain, Vercel, store WebViews, or the phone-preview iframe.
 */
export function shouldShowLocalDevTools(): boolean {
  if (typeof window === "undefined") return false;
  if (isPhoneViewIframe()) return false;
  if (isDeployedPublicHost(window.location.hostname)) return false;
  return isLocalPcHost(window.location.hostname);
}
