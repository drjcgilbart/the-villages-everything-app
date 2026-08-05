import type { BadgeDef } from "./memberBadgeTypes";

/** Donation tip tiers — each earns a permanent name badge when signed in. */
export type DonationBadgeId =
  | "cup_of_joe"
  | "fancy_latte"
  | "early_bird_brunch"
  | "golden_loofah";

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
    amountUsd: 25,
    blurb: "Highest tier · badge",
    badgeId: "golden_loofah",
    badgeImage: "/graphics/badges/golden-loofah.jpg",
    badgeTitle:
      "Golden Loofah — highly coveted sparkly shower pouf. Earned with a $25+ Buy me a cup of Joe tip.",
  },
];

/** @deprecated use highest donation tier amount */
export const GOLDEN_LOOFAH_MIN_USD = 25;

export const DONATION_MIN_USD = 1;
export const DONATION_MAX_USD = 500;

/** Presets sorted high → low for threshold matching */
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

/** Highest donation tier the amount qualifies for (null if under $3). */
export function donationTierForAmount(
  amountUsd: number
): DonationPreset | null {
  if (!Number.isFinite(amountUsd)) return null;
  for (const t of TIERS_DESC) {
    if (amountUsd >= t.amountUsd) return t;
  }
  return null;
}

export function awardsGoldenLoofah(amountUsd: number): boolean {
  return donationTierForAmount(amountUsd)?.badgeId === "golden_loofah";
}

export function donationBadgeDef(preset: DonationPreset): BadgeDef {
  return {
    id: preset.badgeId,
    label: preset.label,
    title: preset.badgeTitle,
    image: preset.badgeImage,
  };
}

export function donationBadgeById(id: string): BadgeDef | null {
  const p = DONATION_PRESETS.find((x) => x.badgeId === id);
  return p ? donationBadgeDef(p) : null;
}

/** Order for display next to names (humble → flashy). */
export const DONATION_BADGE_ORDER: DonationBadgeId[] = [
  "cup_of_joe",
  "fancy_latte",
  "early_bird_brunch",
  "golden_loofah",
];
