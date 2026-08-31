/**
 * Product freeze for folding My Retirement Reboot into the Everything App.
 *
 * Steps 1–5 of the merge are done: names, glass-door paywall, remaining
 * boards, one Hub login, and the standalone app retired as the consumer
 * product (folder kept; people use this Hub). Do not invent a second
 * membership ladder.
 */

import {
  HUB_TIERS,
  type FeatureKey,
  type HubPlanId,
} from "@/lib/membershipTiers";

/** How the two “Reboot” surfaces are named in the Hub. */
export const PRODUCT_NAMES = {
  /** Public story in the top utility bar → /about, /blog, /photos, /videos */
  storyNav: "My Retirement Reboot",
  storyKicker: "The personal corner of the Hub",
  storyBlurb:
    "Blog, photos, and videos from one resident’s moderately ridiculous life in The Villages. Free to read. The private daily boards live in My Space.",

  /** Member door in the top utility bar → /my-space */
  doorNav: "My Space",
  doorTitle: "My Space",
  doorKicker: "My Space — Your Private Lanai",
  doorBlurb:
    "Your private Villages command center. Neighbors can see that the boards exist. Personalized tools unlock with membership.",

  /** Phrase locked boards use in CTAs */
  unlockVerb: "Unlock with",
} as const;

export type BoardId =
  | "home"
  | "favorites"
  | "shortcuts"
  | "yardSale"
  | "membership"
  | "weather"
  | "investments"
  | "news"
  | "entertainment"
  | "health"
  | "pets"
  | "food"
  | "gym"
  | "maintenance"
  | "calendar"
  | "memories"
  | "golfLog"
  | "pickleballLog"
  | "lounge";

export type BoardPhase = "live" | "next" | "later";

export type BoardDef = {
  id: BoardId;
  /** Tab / card label in My Space */
  label: string;
  icon: string;
  /** Minimum Hub plan rank (Porch 0 · Cart Path 1 · Lanai 2 · Royalty 3) */
  minRank: number;
  /** Live in My Space today vs coming in later merge steps */
  phase: BoardPhase;
  teaser: string;
  /** One-line sample the glass door can show without real personal data */
  previewLine: string;
};

/**
 * Every My Space board. Public Hub pages (Dining, Calendar, Golf, etc.)
 * are not listed here — they stay free on the main banner. The standalone
 * My Retirement Reboot folder is an archive, not the consumer product.
 */
export const MY_SPACE_BOARDS: BoardDef[] = [
  {
    id: "home",
    label: "Home",
    icon: "🏠",
    minRank: 0,
    phase: "live",
    teaser: "Jumping-off board for your private Reboot.",
    previewLine: "Weather, health, pets, and more — pick a board.",
  },
  {
    id: "favorites",
    label: "Favorites",
    icon: "⭐",
    minRank: 0,
    phase: "live",
    teaser: "Villages, squares, rec centers, dining, and clubs you starred.",
    previewLine: "Stars you already set around the Hub land here.",
  },
  {
    id: "shortcuts",
    label: "Shortcuts",
    icon: "🗺️",
    minRank: 0,
    phase: "live",
    teaser: "Quick cart-path links back to public Hub pages.",
    previewLine: "The Villages · Town Squares · Rec Centers · Golf · Forums",
  },
  {
    id: "yardSale",
    label: "Yard sale",
    icon: "🏷️",
    minRank: 0,
    phase: "live",
    teaser: "Post listings once an admin has approved your neighbor account.",
    previewLine: "Approved neighbors can list treasures from My Space.",
  },
  {
    id: "membership",
    label: "Tiers",
    icon: "🎟",
    minRank: 0,
    phase: "live",
    teaser: "Porch Waver → Cart Path Regular → Lanai Legend → Square Royalty.",
    previewLine: "Each paid tier keeps everything below it.",
  },
  {
    id: "weather",
    label: "Weather",
    icon: "🌤",
    minRank: 1,
    phase: "live",
    teaser:
      "Full Villages dashboard: current conditions, hourly, and 7-day forecast.",
    previewLine: "The Villages · 84° · partly cloudy · breeze off the ponds",
  },
  {
    id: "investments",
    label: "Investments",
    icon: "📈",
    minRank: 1,
    phase: "live",
    teaser: "Private stock & ETF board with live quotes and totals.",
    previewLine: "Watchlist + portfolio totals — saved to your membership.",
  },
  {
    id: "news",
    label: "News",
    icon: "📰",
    minRank: 1,
    phase: "live",
    teaser: "Your headline mix and saved desks — not the public Local News page.",
    previewLine: "Pick topics once; the Hub fills the rest.",
  },
  {
    id: "entertainment",
    label: "Entertainment",
    icon: "🎭",
    minRank: 1,
    phase: "live",
    teaser: "Shows, tickets, and watch-later — your nights, not the public squares.",
    previewLine: "Tonight at the square · tickets · watch later",
  },
  {
    id: "health",
    label: "Health",
    icon: "💚",
    minRank: 2,
    phase: "live",
    teaser: "Weight, meds, meals, movement, sleep, journal, daily goals.",
    previewLine: "Meds at 8:00 · water goal · weigh-in streak",
  },
  {
    id: "pets",
    label: "Pets",
    icon: "🐾",
    minRank: 2,
    phase: "live",
    teaser: "Walks, meals, and optional alarms for the house pack.",
    previewLine: "Morning walk · dinner bowl · reminder at 5:30",
  },
  {
    id: "food",
    label: "Food & beverages",
    icon: "🍷",
    minRank: 2,
    phase: "live",
    teaser:
      "Recipes, grocery, cellar, weekly meals. Public Dining stays free on the Hub.",
    previewLine: "This week’s meals · happy hour notes · wine list",
  },
  {
    id: "gym",
    label: "Gym",
    icon: "🏋️",
    minRank: 2,
    phase: "live",
    teaser: "Workouts, fit clubs, supplements — personal training log.",
    previewLine: "Today’s workout · home gym · supplements",
  },
  {
    id: "maintenance",
    label: "Maintenance",
    icon: "🔧",
    minRank: 2,
    phase: "live",
    teaser: "House and golf-cart upkeep reminders that stay on your account.",
    previewLine: "Cart battery · HVAC filter · next service",
  },
  {
    id: "calendar",
    label: "Calendar",
    icon: "📅",
    minRank: 2,
    phase: "live",
    teaser:
      "Your sticky notes and personal dates — not the public Calendar of Events.",
    previewLine: "Tee time Thursday · grandkids Saturday",
  },
  {
    id: "memories",
    label: "Photos",
    icon: "📷",
    minRank: 2,
    phase: "live",
    teaser: "Private album on your account. The public Photo Journal stays free.",
    previewLine: "Lanai sunsets and the dog, stored privately.",
  },
  {
    id: "golfLog",
    label: "Golf log",
    icon: "⛳",
    minRank: 2,
    phase: "live",
    teaser:
      "Personal scorecard, tee times, history. Public Golf on the Hub stays free.",
    previewLine: "Last round · upcoming tee time · find a foursome",
  },
  {
    id: "pickleballLog",
    label: "Pickleball log",
    icon: "🏓",
    minRank: 2,
    phase: "live",
    teaser:
      "Personal DUPR log and matches. Public Pickleball on the Hub stays free.",
    previewLine: "DUPR · last match · find a game",
  },
  {
    id: "lounge",
    label: "Royalty lounge",
    icon: "👑",
    minRank: 3,
    phase: "live",
    teaser: "Early peeks, member-only notes, parade-front bragging rights.",
    previewLine: "Front row at the square — metaphorically. Parking still chaos.",
  },
];

export const TIER_SUMMARY: Record<
  HubPlanId,
  { includes: string; blurb: string }
> = {
  porch_waver: {
    includes: "My Space door, favorites, shortcuts, yard-sale posting (when approved)",
    blurb:
      "Free neighbor account. You can see every Reboot board as a preview. Personalized tools stay behind the glass until you upgrade.",
  },
  cart_path_regular: {
    includes: "Full weather, investments, news prefs, entertainment picks",
    blurb:
      "Daily dashboard energy — weather, money, headlines, and your night-out list.",
  },
  lanai_legend: {
    includes:
      "Health, pets, food, gym, maintenance, personal calendar, private photos, golf/pickleball logs",
    blurb:
      "The private Reboot: health, pets, kitchen, gym, and the rest of the personal boards.",
  },
  square_royalty: {
    includes: "Royalty lounge, badge flair, early access to new boards",
    blurb:
      "Everything on the lanai, plus the lounge and first look at new My Space boards.",
  },
};

/** Pages that stay free on the public Hub forever (not My Space paywall). */
export const ALWAYS_PUBLIC = [
  "Home, Town Squares, Rec Centers, The Villages directory",
  "Dining, Local News, Calendar of Events, Forums, Yard Sale browse",
  "Golf, Pickleball, Clubs, Art, Local Pros, Real Estate, Official Map",
  "Golf Cart Hero",
  "My Retirement Reboot story: About, Blog, Photos, Videos",
] as const;

export const LOCKED_PREVIEW = {
  /** Signed-out visitors still see the board grid, blurred/sample, with join CTAs. */
  visitorSeesGrid: true,
  /** Favorites continue to work without an account. */
  visitorKeepsFavorites: true,
  /** Locked boards show layout + previewLine, never another member’s real data. */
  showSampleChrome: true,
  /** Primary button label pattern: “Unlock with Lanai Legend” */
  ctaPattern: "Unlock with {tier}",
  nativeBilling:
    "Do not sell memberships inside the iPhone/Android store app. If they already subscribed on the website, the same login unlocks My Space. Otherwise: “Subscribe at thevillageseverythingapp.com, then sign in here.”",
  dataRule:
    "Personal boards belong on the member account (synced PC / iPhone / Android), not only in this browser. Health, pets, meals, and photos are never shown on public Hub pages.",
} as const;

/** Live My Space boards a visitor can actually use without an account. */
export const VISITOR_OPEN_BOARDS: ReadonlySet<BoardId> = new Set([
  "home",
  "favorites",
  "shortcuts",
  "membership",
]);

/** Map existing My Space feature flags onto product boards. */
export const FEATURE_TO_BOARD: Partial<Record<FeatureKey | string, BoardId>> = {
  weather: "weather",
  portfolio: "investments",
  newsPrefs: "news",
  entertainmentLog: "entertainment",
  healthLog: "health",
  petSchedule: "pets",
  foodLog: "food",
  gymLog: "gym",
  maintenanceLog: "maintenance",
  calendarBoard: "calendar",
  memoriesAlbum: "memories",
  golfLog: "golfLog",
  pickleballLog: "pickleballLog",
  exclusiveLounge: "lounge",
};

export function getBoard(id: BoardId): BoardDef {
  const board = MY_SPACE_BOARDS.find((b) => b.id === id);
  if (!board) throw new Error(`Unknown My Space board: ${id}`);
  return board;
}

export function boardIsLocked(
  id: BoardId,
  opts: { visitor: boolean; planRank: number }
): boolean {
  if (opts.visitor) return !VISITOR_OPEN_BOARDS.has(id);
  return opts.planRank < getBoard(id).minRank;
}

export function boardsForRank(rank: number): BoardDef[] {
  return MY_SPACE_BOARDS.filter((b) => b.minRank <= rank);
}

export function lockedBoardsForRank(rank: number): BoardDef[] {
  return MY_SPACE_BOARDS.filter((b) => b.minRank > rank);
}

export function unlockCtaLabel(minRank: number): string {
  const tier = HUB_TIERS.find((t) => t.rank === minRank) || HUB_TIERS[0];
  return `${PRODUCT_NAMES.unlockVerb} ${tier.label}`;
}
