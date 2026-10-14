/** Verbatim Holiday Lights liability terms. Do not paraphrase. */
export const HOLIDAY_LIGHTS_TERMS =
  "The Holiday Lights Tour provides suggested routes only, for golf carts and passenger cars. You are solely responsible for obeying all traffic laws — including Florida Statutes section 316.212 for golf carts on public roads — watching the road, and operating your vehicle safely at all times. Golf carts are dangerous instrumentalities under Florida law, and cart owners may be held liable for permissive drivers. The Villages Everything app provides this feature as is, without warranty of accuracy or fitness for any purpose, and is not liable for any accident, injury, death, or damage arising from its use, whether on public roads or private cart paths. By starting this tour, you agree to these terms.";

/** Footer section that repeats those terms. The tour modal links here. */
export const HOLIDAY_LIGHTS_TERMS_HREF = "/#holiday-lights-terms";

const GUEST_ID_RE = /^guest-[a-z0-9-]{12,80}$/i;

export function isGuestTermsUserId(value: string) {
  return GUEST_ID_RE.test(value.trim());
}

/** Stable id for a neighbor who is not signed in. Signed-in members use their account id instead. */
export function guestTermsUserId() {
  const key = "tvea-light-tour-terms-user";
  try {
    const existing = localStorage.getItem(key) || "";
    if (isGuestTermsUserId(existing)) return existing;
    const id =
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? `guest-${crypto.randomUUID()}`
        : `guest-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(key, id);
    return id;
  } catch {
    return `guest-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
  }
}

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
