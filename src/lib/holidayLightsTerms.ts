/** Verbatim Holiday Lights liability terms. Do not paraphrase. */
export const HOLIDAY_LIGHTS_TERMS =
  "The Holiday Lights Tour provides suggested routes only, for golf carts and passenger cars. You are solely responsible for obeying all traffic laws — including Florida Statutes section 316.212 for golf carts on public roads — watching the road, and operating your vehicle safely at all times. Golf carts are dangerous instrumentalities under Florida law, and cart owners may be held liable for permissive drivers. The Villages Everything app provides this feature as is, without warranty of accuracy or fitness for any purpose, and is not liable for any accident, injury, death, or damage arising from its use, whether on public roads or private cart paths. By starting this tour, you agree to these terms.";

/** Footer section that repeats those terms. The tour modal links here. */
export const HOLIDAY_LIGHTS_TERMS_HREF = "/#holiday-lights-terms";

/** Bump this when the wording above changes so earlier acceptances are not reused. */
export const HOLIDAY_LIGHTS_TERMS_VERSION = "2026-10-14";

/** Device and app version the site can see. The phone app adds VillagesEverythingApp/x.y to the browser name. */
export function tourDeviceFromUserAgent(ua: string) {
  const native = /VillagesEverythingApp\/([^\s;]+)/i.exec(ua);
  const appVersion = native?.[1] || "web";
  const android = /Android/i.test(ua);
  const appleMobile = /iPhone|iPad|iPod/i.test(ua);
  let deviceType = "desktop-web";
  if (native && android) deviceType = "android-app";
  else if (native) deviceType = "ios-app";
  else if (android) deviceType = "android-web";
  else if (appleMobile) deviceType = "ios-web";
  return { deviceType, appVersion };
}
