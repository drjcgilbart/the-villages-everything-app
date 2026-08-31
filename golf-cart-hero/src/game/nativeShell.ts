/** True when running inside the Play / App Store WebView shell. */
export function isNativeShell(): boolean {
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get("native") === "1") return true;
  } catch {
    /* ignore */
  }
  return /GolfCartHeroNative|VillagesEverythingApp/i.test(
    navigator.userAgent || ""
  );
}
