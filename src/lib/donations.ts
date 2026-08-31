import type { BadgeDef } from "./memberBadgeTypes";

/** Donation tip badges earned via “Buy me a cup of Joe”. */
export type DonationBadgeId =
  | "cup_of_joe"
  | "fancy_latte"
  | "early_bird_brunch"
  | "golden_loofah"
  | "custom_star_loofah";

export type DonationPreset = {
  id: string;
  label: string;
  amountUsd: number;
  blurb: string;
  badgeId: DonationBadgeId;
  badgeImage: string;
  badgeTitle: string;
};

export const DONATION_PRESETS: DonationPreset[] = [
  {
    id: "joe",
    label: "Cup of Joe",
    amountUsd: 3,
    blurb: "Classic fuel · badge",
    badgeId: "cup_of_joe",
    badgeImage: "/graphics/badges/donate-cup-of-joe.jpg",
    badgeTitle:
      "Cup of Joe — tip jar classic. Earned with a $3+ Buy me a cup of Joe tip.",
  },
  {
    id: "latte",
    label: "Fancy latte",
    amountUsd: 5,
    blurb: "Extra foam · badge",
    badgeId: "fancy_latte",
    badgeImage: "/graphics/badges/donate-fancy-latte.jpg",
    badgeTitle:
      "Fancy Latte — foam-art energy. Earned with a $5+ Buy me a cup of Joe tip.",
  },
  {
    id: "brunch",
    label: "Early-bird brunch",
    amountUsd: 10,
    blurb: "Solid tip · badge",
    badgeId: "early_bird_brunch",
    badgeImage: "/graphics/badges/donate-early-bird-brunch.jpg",
    badgeTitle:
      "Early-Bird Brunch — eggs before the cart parade. Earned with a $10+ Buy me a cup of Joe tip.",
  },
  {
    id: "loofah",
    label: "Golden Loofah",
    amountUsd: 20,
    blurb: "Highest preset · badge",
    badgeId: "golden_loofah",
    badgeImage: "/graphics/badges/golden-loofah.jpg",
    badgeTitle:
      "Golden Loofah — highly coveted sparkly shower pouf. Earned with the $20 Golden Loofah preset.",
  },
];

/** Ultra Custom tip badge — more sparkles than Golden Loofah. */
export const CUSTOM_STAR_LOOFAH: DonationPreset = {
  id: "custom",
  label: "Custom Star Loofah",
  amountUsd: 25,
  blurb: "Custom amount · max sparkle",
  badgeId: "custom_star_loofah",
  badgeImage: "/graphics/badges/donate-custom-star-loofah.jpg",
  badgeTitle:
    "Custom Star Loofah — even more impressive than Golden Loofah. Earned with a custom $25+ cup-of-Joe tip (stars and sparkles included).",
};

export const GOLDEN_LOOFAH_MIN_USD = 20;
export const CUSTOM_STAR_LOOFAH_MIN_USD = 25;
export const DONATION_MIN_USD = 1;
export const DONATION_MAX_USD = 500;

/** Badges that nominate the donor for Square Royalty (1 year) pending admin approval. */
export const TOP_TIER_DONATION_BADGES: DonationBadgeId[] = [
  "golden_loofah",
  "custom_star_loofah",
];

const TIERS_DESC = [...DONATION_PRESETS].sort(
  (a, b) => b.amountUsd - a.amountUsd
);

export function usdToCents(usd: number) {
  return Math.round(usd * 100);
}

export function parseDonationAmount(raw: unknown): number | null {
  const n =
    typeof raw === "number"
      ? raw
      : Number(String(raw ?? "").replace(/[^0-9.]/g, ""));
  if (!Number.isFinite(n)) return null;
  const rounded = Math.round(n * 100) / 100;
  if (rounded < DONATION_MIN_USD || rounded > DONATION_MAX_USD) return null;
  return rounded;
}

/**
 * Resolve which badge a donation earns.
 * Custom path + $25+ → Custom Star Loofah (ultra).
 * Presets / non-custom → highest preset tier for the amount.
 */
export function donationBadgeForCheckout(opts: {
  amountUsd: number;
  isCustom: boolean;
}): { badgeId: DonationBadgeId; def: DonationPreset } | null {
  const { amountUsd, isCustom } = opts;
  if (!Number.isFinite(amountUsd)) return null;

  if (isCustom && amountUsd >= CUSTOM_STAR_LOOFAH_MIN_USD) {
    return { badgeId: "custom_star_loofah", def: CUSTOM_STAR_LOOFAH };
  }

  for (const t of TIERS_DESC) {
    if (amountUsd >= t.amountUsd) {
      return { badgeId: t.badgeId, def: t };
    }
  }
  return null;
}

/** @deprecated use donationBadgeForCheckout */
export function donationTierForAmount(
  amountUsd: number
): DonationPreset | null {
  const r = donationBadgeForCheckout({ amountUsd, isCustom: false });
  return r?.def || null;
}

export function awardsGoldenLoofah(amountUsd: number): boolean {
  return amountUsd >= GOLDEN_LOOFAH_MIN_USD;
}

export function donationBadgeDef(
  preset: Pick<
    DonationPreset,
    "badgeId" | "label" | "badgeTitle" | "badgeImage"
  >
): BadgeDef {
  return {
    id: preset.badgeId,
    label: preset.label,
    title: preset.badgeTitle,
    image: preset.badgeImage,
  };
}

export function donationBadgeById(id: string): BadgeDef | null {
  if (id === "custom_star_loofah") {
    return donationBadgeDef(CUSTOM_STAR_LOOFAH);
  }
  const p = DONATION_PRESETS.find((x) => x.badgeId === id);
  return p ? donationBadgeDef(p) : null;
}

export function isTopTierDonationBadge(badgeId: string): boolean {
  return TOP_TIER_DONATION_BADGES.includes(badgeId as DonationBadgeId);
}

/** Order for display next to names (humble → flashy). */
export const DONATION_BADGE_ORDER: DonationBadgeId[] = [
  "cup_of_joe",
  "fancy_latte",
  "early_bird_brunch",
  "golden_loofah",
  "custom_star_loofah",
];
