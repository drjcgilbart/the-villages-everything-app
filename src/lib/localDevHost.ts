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

export function isLocalPcBrowser(): boolean {
  if (typeof window === "undefined") return false;
  return isLocalPcHost(window.location.hostname);
}

/** Phone-view button must not appear inside the preview iframe or store apps. */
export function isPhoneViewIframe(): boolean {
  if (typeof window === "undefined") return false;
  return window.self !== window.top;
}
