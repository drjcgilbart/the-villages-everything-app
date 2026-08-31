/**
 * Hub membership ladder + feature unlocks for My Space.
 * Funny Florida / Villages-flavored tier names for residents.
 */

export type HubPlanId =
  | "porch_waver"
  | "cart_path_regular"
  | "lanai_legend"
  | "square_royalty";

/** @deprecated legacy stored values — normalized on read */
export type LegacyHubPlan = "free" | "subscriber";

export type AnyStoredPlan = HubPlanId | LegacyHubPlan | string;

export type FeatureKey =
  | "shell"
  | "shortcuts"
  | "yardSalePost"
  | "weather"
  | "favoriteClubs"
  | "portfolio"
  | "newsPrefs"
  | "entertainmentLog"
  | "healthLog"
  | "petSchedule"
  | "foodLog"
  | "gymLog"
  | "maintenanceLog"
  | "calendarBoard"
  | "memoriesAlbum"
  | "golfLog"
  | "pickleballLog"
  | "exclusiveLounge"
  | "planBadge";

export type TierDef = {
  id: HubPlanId;
  /** Sort rank — higher includes all lower unlocks */
  rank: number;
  label: string;
  shortLabel: string;
  tagline: string;
  blurb: string;
  /** Badge graphic shown on My Space tier cards and next to names (paid tiers) */
  badgeImage: string;
  /** Public list price in USD per month (0 = free). */
  priceUsdPerMonth: number;
  /**
   * Total Hub logins on this plan, including the paying neighbor.
   * Each login keeps its own My Space boards — they are not shared.
   */
  householdSeats: number;
  /** Optional Stripe price env key suffix, e.g. HUB → STRIPE_PRICE_HUB */
  stripeEnvKey?: string;
};

export const HUB_TIERS: TierDef[] = [
  {
    id: "porch_waver",
    rank: 0,
    label: "Porch Waver",
    shortLabel: "Porch",
    tagline: "I wave. You wave. That’s the whole social contract.",
    blurb:
      "Free neighbor account — 1 member login (you). My Space door, favorites, shortcuts, and yard-sale posting when approved. You can see every Reboot board as a preview; personalized tools stay behind the glass until you upgrade.",
    badgeImage: "/graphics/badges/porch-waver.jpg",
    priceUsdPerMonth: 0,
    householdSeats: 1,
  },
  {
    id: "cart_path_regular",
    rank: 1,
    label: "Cart Path Regular",
    shortLabel: "Cart Path",
    tagline: "Knows which gate is which (most days).",
    blurb:
      "2 member logins — you plus one neighbor, each with their own password and My Space data. Daily dashboard energy: full Villages weather, starred clubs, the investment board, news prefs, and entertainment picks.",
    badgeImage: "/graphics/badges/cart-path-regular.jpg",
    priceUsdPerMonth: 1,
    householdSeats: 2,
    stripeEnvKey: "HUB",
  },
  {
    id: "lanai_legend",
    rank: 2,
    label: "Lanai Legend",
    shortLabel: "Lanai",
    tagline: "Screened-in serenity with a side of spreadsheets.",
    blurb:
      "3 member logins — you plus two neighbors, each with their own password and My Space data. The private Reboot: health, pets, food, gym, maintenance, personal calendar, photos & movies, plus golf and pickleball logs.",
    badgeImage: "/graphics/badges/lanai-legend.jpg",
    priceUsdPerMonth: 2,
    householdSeats: 3,
    stripeEnvKey: "PLUS",
  },
  {
    id: "square_royalty",
    rank: 3,
    label: "Square Royalty",
    shortLabel: "Royalty",
    tagline: "Front row at the square. Metaphorically. Parking still chaos.",
    blurb:
      "4 member logins — a cart-full of neighbors, each with their own password and My Space data. Everything on the lanai, plus the Royalty lounge, badge flair, and first look at new My Space boards.",
    badgeImage: "/graphics/badges/square-royalty.jpg",
    priceUsdPerMonth: 3,
    householdSeats: 4,
    stripeEnvKey: "PATRON",
  },
];

/** Minimum tier rank required for each My Space feature */
export const FEATURE_MIN_RANK: Record<FeatureKey, number> = {
  shell: 0,
  shortcuts: 0,
  yardSalePost: 0, // still requires member.status === approved separately
  weather: 1,
  favoriteClubs: 1,
  portfolio: 1,
  newsPrefs: 1,
  entertainmentLog: 1,
  healthLog: 2,
  petSchedule: 2,
  foodLog: 2,
  gymLog: 2,
  maintenanceLog: 2,
  calendarBoard: 2,
  memoriesAlbum: 2,
  golfLog: 2,
  pickleballLog: 2,
  exclusiveLounge: 3,
  planBadge: 3,
};

export const FEATURE_META: Record<
  FeatureKey,
  { title: string; teaser: string; anchor: string }
> = {
  shell: {
    title: "My Space",
    teaser: "Your private corner of the Hub.",
    anchor: "ms-top",
  },
  shortcuts: {
    title: "Site shortcuts",
    teaser: "Quick cart-path links around the site.",
    anchor: "ms-links",
  },
  yardSalePost: {
    title: "Yard sale posting",
    teaser: "List treasures when an admin has approved your account.",
    anchor: "ms-top",
  },
  weather: {
    title: "Villages weather",
    teaser:
      "Full dashboard: current conditions, metrics, 24-hour and 7-day forecast.",
    anchor: "ms-weather",
  },
  favoriteClubs: {
    title: "Favorite clubs",
    teaser: "Starred clubs from Club Zone — included in My favorites on My Space.",
    anchor: "ms-favorites",
  },
  portfolio: {
    title: "Investments",
    teaser: "Stock & ETF board with live quotes and portfolio totals.",
    anchor: "ms-markets",
  },
  newsPrefs: {
    title: "News",
    teaser: "Your topic mix and saved stories — not the public Local News page.",
    anchor: "ms-news",
  },
  entertainmentLog: {
    title: "Entertainment",
    teaser: "Tonight at the square, tickets, and watch-later.",
    anchor: "ms-entertainment",
  },
  healthLog: {
    title: "Health lanai",
    teaser:
      "Weight log, meds with dose times & alarms, meals, workouts, journal, and daily goals.",
    anchor: "ms-health",
  },
  petSchedule: {
    title: "Pet parade",
    teaser:
      "Walk & meal schedules, daily checkboxes, and optional browser alarms (Angelcake-style).",
    anchor: "ms-pets",
  },
  foodLog: {
    title: "Food & beverages",
    teaser: "Grocery, recipes, cellar, and this week’s meals.",
    anchor: "ms-food",
  },
  gymLog: {
    title: "Gym",
    teaser: "Workouts and supplements — your personal training log.",
    anchor: "ms-gym",
  },
  maintenanceLog: {
    title: "Maintenance",
    teaser: "House and golf-cart upkeep reminders on your account.",
    anchor: "ms-maintenance",
  },
  calendarBoard: {
    title: "My calendar board",
    teaser: "Personal sticky notes & events — not the whole district calendar.",
    anchor: "ms-calendar",
  },
  memoriesAlbum: {
    title: "Photos",
    teaser: "Private photos and short movies on your account — PC, iPhone, or Android.",
    anchor: "ms-memories",
  },
  golfLog: {
    title: "Golf log",
    teaser: "Personal scorecard and tee notes. Public Golf stays free.",
    anchor: "ms-golf-log",
  },
  pickleballLog: {
    title: "Pickleball log",
    teaser: "Personal match notes. Public Pickleball stays free.",
    anchor: "ms-pb-log",
  },
  exclusiveLounge: {
    title: "Royalty lounge",
    teaser: "Early peeks, member-only notes, and parade-front bragging rights.",
    anchor: "ms-lounge",
  },
  planBadge: {
    title: "Square Royalty badge",
    teaser: "Flair that shows up on your My Space header.",
    anchor: "ms-top",
  },
};

const TIER_BY_ID = Object.fromEntries(HUB_TIERS.map((t) => [t.id, t])) as Record<
  HubPlanId,
  TierDef
>;

export function normalizePlan(raw: AnyStoredPlan | null | undefined): HubPlanId {
  const p = String(raw || "").trim().toLowerCase();
  if (p === "free" || p === "porch" || p === "neighbor") return "porch_waver";
  if (p === "subscriber" || p === "hub" || p === "cart") return "cart_path_regular";
  if (p === "plus" || p === "lanai") return "lanai_legend";
  if (p === "patron" || p === "royalty" || p === "square") return "square_royalty";
  if (p in TIER_BY_ID) return p as HubPlanId;
  return "porch_waver";
}

export function getTier(plan: AnyStoredPlan | null | undefined): TierDef {
  return TIER_BY_ID[normalizePlan(plan)];
}

export function planRank(plan: AnyStoredPlan | null | undefined): number {
  return getTier(plan).rank;
}

export function canAccess(
  plan: AnyStoredPlan | null | undefined,
  feature: FeatureKey
): boolean {
  return planRank(plan) >= FEATURE_MIN_RANK[feature];
}

export function featuresForPlan(
  plan: AnyStoredPlan | null | undefined
): Record<FeatureKey, boolean> {
  const out = {} as Record<FeatureKey, boolean>;
  for (const key of Object.keys(FEATURE_MIN_RANK) as FeatureKey[]) {
    out[key] = canAccess(plan, key);
  }
  return out;
}

export function formatMembershipPrice(tier: TierDef): string {
  if (!tier.priceUsdPerMonth) return "Free";
  return `$${tier.priceUsdPerMonth}/month`;
}

/** Total Hub logins included with a plan (owner + extra household seats). */
export function householdSeatsForPlan(
  plan: AnyStoredPlan | null | undefined
): number {
  return getTier(plan).householdSeats;
}

export function formatHouseholdSeats(seats: number): string {
  return seats === 1 ? "1 member login" : `${seats} member logins`;
}

export function householdSeatBlurb(seats: number): string {
  if (seats <= 1) {
    return "1 member login — your own boards, nobody else’s.";
  }
  return `${seats} member logins — each neighbor gets their own password and their own My Space data.`;
}

/** Paid tiers members can upgrade into (not free Porch Waver). */
export function paidTiers(): TierDef[] {
  return HUB_TIERS.filter((t) => t.rank > 0);
}

/** Tier required to unlock a feature (for upgrade CTAs). */
export function tierRequiredFor(feature: FeatureKey): TierDef {
  const min = FEATURE_MIN_RANK[feature];
  return HUB_TIERS.find((t) => t.rank === min) || HUB_TIERS[0];
}

export function isPaidPlan(plan: AnyStoredPlan | null | undefined): boolean {
  return planRank(plan) >= 1;
}

/**
 * Effective plan for access checks.
 * HUB_MEMBER_OPEN_ACCESS=true elevates everyone to Square Royalty (demo).
 */
export function effectivePlan(
  plan: AnyStoredPlan | null | undefined
): HubPlanId {
  if (process.env.HUB_MEMBER_OPEN_ACCESS === "true") {
    return "square_royalty";
  }
  return normalizePlan(plan);
}

/** Stripe price id for a paid tier from env. */
export function stripePriceForTier(tierId: HubPlanId): string | null {
  const tier = TIER_BY_ID[tierId];
  if (!tier?.stripeEnvKey) return null;
  const key = `STRIPE_PRICE_${tier.stripeEnvKey}`;
  const v = process.env[key]?.trim();
  if (v) return v;
  // Back-compat: single price unlocks Cart Path Regular
  if (tierId === "cart_path_regular") {
    return process.env.STRIPE_MEMBER_PRICE_ID?.trim() || null;
  }
  return null;
}

export function planFromStripePriceId(priceId: string | null | undefined): HubPlanId {
  const id = String(priceId || "").trim();
  if (!id) return "cart_path_regular";
  for (const tier of paidTiers()) {
    const p = stripePriceForTier(tier.id);
    if (p && p === id) return tier.id;
  }
  return "cart_path_regular";
}
