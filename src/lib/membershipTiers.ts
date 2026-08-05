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
  | "healthLog"
  | "petSchedule"
  | "calendarBoard"
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
      "Free approved-neighbor energy. You’re in the club of people who live here — My Space shell, shortcuts, and yard-sale privileges when approved.",
  },
  {
    id: "cart_path_regular",
    rank: 1,
    label: "Cart Path Regular",
    shortLabel: "Cart Path",
    tagline: "Knows which gate is which (most days).",
    blurb:
      "Your daily dashboard: Villages weather, starred clubs, and the investment board — the cart-path commute of membership.",
    stripeEnvKey: "HUB",
  },
  {
    id: "lanai_legend",
    rank: 2,
    label: "Lanai Legend",
    shortLabel: "Lanai",
    tagline: "Screened-in serenity with a side of spreadsheets.",
    blurb:
      "Everything on the cart path, plus health check-ins, pet schedule, and a personal calendar board — lanai life, optimized.",
    stripeEnvKey: "PLUS",
  },
  {
    id: "square_royalty",
    rank: 3,
    label: "Square Royalty",
    shortLabel: "Royalty",
    tagline: "Front row at the square. Metaphorically. Parking still chaos.",
    blurb:
      "Top of the cart parade: every unlock, early-access lounge, and a badge that says you take this retirement reboot seriously (but not too seriously).",
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
  healthLog: 2,
  petSchedule: 2,
  calendarBoard: 2,
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
    title: "Hub shortcuts",
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
    teaser: "Live local conditions — before you blame the humidity on the cart.",
    anchor: "ms-weather",
  },
  favoriteClubs: {
    title: "Favorite clubs",
    teaser: "Starred clubs from Club Zone, parked on your dashboard.",
    anchor: "ms-clubs",
  },
  portfolio: {
    title: "Investments",
    teaser: "Stock & ETF board with totals — mystery-novel statement energy.",
    anchor: "ms-markets",
  },
  healthLog: {
    title: "Health lanai",
    teaser: "Weight, meds, and “I walked on purpose” check-ins.",
    anchor: "ms-health",
  },
  petSchedule: {
    title: "Pet parade",
    teaser: "Walks, meals, and who really runs the household.",
    anchor: "ms-pets",
  },
  calendarBoard: {
    title: "My calendar board",
    teaser: "Personal notes & events — not the whole district calendar.",
    anchor: "ms-calendar",
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
