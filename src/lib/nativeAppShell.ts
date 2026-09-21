/**
 * True when the page is running inside the Expo / store app WebView.
 * The native shell appends "VillagesEverythingApp/1.0" to the user agent.
 */
export function isNativeAppShell(): boolean {
  if (typeof navigator === "undefined") return false;
  return /VillagesEverythingApp/i.test(navigator.userAgent);
}

/** Open YouTube / maps / etc. Android WebView ignores target=_blank. */
export function openExternalUrl(url: string) {
  if (typeof window === "undefined" || !url) return;
  if (isNativeAppShell()) {
    window.location.assign(url);
    return;
  }
  const w = window.open(url, "_blank", "noopener,noreferrer");
  if (!w) window.location.assign(url);
}
