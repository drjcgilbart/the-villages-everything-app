/**
 * True when the page is running inside the Expo / store app WebView.
 * The native shell appends "VillagesEverythingApp/1.0" to the user agent.
 */
export function isNativeAppShell(): boolean {
  if (typeof navigator === "undefined") return false;
  return /VillagesEverythingApp/i.test(navigator.userAgent);
}
