/** Canonical product brand — import this from client or server code. */
export const SITE_BRAND = {
  name: "The Villages Everything App",
  /** Shorter line for tight UI if needed */
  shortName: "Villages Everything App",
  tagline: "Everything app. Zero stuffiness. Florida edition.",
  subtitle:
    "The moderately ridiculous everything app for The Villages, Florida — find your village, rate a restaurant, chase live music, and still laugh about the plot twist of starting over here.",
  location: "The Villages, Florida",
  domain: "www.thevillageseverythingapp.com",
  url: "https://www.thevillageseverythingapp.com",
  /** Header / compact tag under the logo */
  brandTag: "Everything · cart paths · FL",
  /** Official YouTube channel (same brand as the app) */
  youtube: {
    title: "The Villages Everything App",
    handle: "@TheVillagesEverythingApp",
    url: "https://www.youtube.com/@TheVillagesEverythingApp",
    channelId: "UC_ccna64GSBqC1zQyhcvaUg",
  },
  /**
   * Native store shells (Expo WebView → same live site).
   * Flip `live` to true only after the public store page loads (not 404).
   * Website buttons stay hidden until then so neighbors never hit a dead link.
   */
  stores: {
    android: {
      packageId: "com.thevillageseverythingapp.app",
      url: "https://play.google.com/store/apps/details?id=com.thevillageseverythingapp.app",
      /** Public Play listing available for anyone (not only Internal testing). */
      live: false,
    },
    ios: {
      bundleId: "com.thevillageseverythingapp.app",
      /** Fill App Store numeric id after first App Store Connect publish, e.g. id1234567890 */
      url: "",
      live: false,
    },
  },
} as const;
