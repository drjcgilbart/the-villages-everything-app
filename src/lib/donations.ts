/** Preset tip amounts in USD (display + Stripe unit_amount conversion). */
export const DONATION_PRESETS = [
  { id: "joe", label: "Cup of Joe", amountUsd: 3, blurb: "Classic fuel" },
  { id: "latte", label: "Fancy latte", amountUsd: 5, blurb: "Extra foam" },
  {
    id: "brunch",
    label: "Early-bird brunch",
    amountUsd: 10,
    blurb: "Solid tip",
  },
  {
    id: "loofah",
    label: "Golden Loofah",
    amountUsd: 25,
    blurb: "Highest tier · badge unlocked",
    awardsGoldenLoofah: true as const,
  },
] as const;

/** Minimum USD that awards the Golden Loofah badge (highest cup-of-Joe tier). */
export const GOLDEN_LOOFAH_MIN_USD = 25;

export const DONATION_MIN_USD = 1;
export const DONATION_MAX_USD = 500;

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

export function awardsGoldenLoofah(amountUsd: number): boolean {
  return Number.isFinite(amountUsd) && amountUsd >= GOLDEN_LOOFAH_MIN_USD;
}
