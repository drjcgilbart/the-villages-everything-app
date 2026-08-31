/**
 * Tip-jar donations for Golf Cart Hero.
 * Tiers map to a colored donor flag on the player cart:
 *   $1 → red · $3 → blue · $5 → gold
 * Highest lifetime tip (this browser) wins.
 */

export type DonationTierUsd = 1 | 3 | 5;

export type DonationPreset = {
  amountUsd: DonationTierUsd;
  label: string;
  blurb: string;
  flagColor: string;
  flagName: string;
};

export const DONATION_PRESETS: DonationPreset[] = [
  {
    amountUsd: 1,
    label: "Cart-path tip",
    blurb: "Red supporter flag",
    flagColor: "#c62828",
    flagName: "Red",
  },
  {
    amountUsd: 3,
    label: "Happy-hour tip",
    blurb: "Blue supporter flag",
    flagColor: "#1e88e5",
    flagName: "Blue",
  },
  {
    amountUsd: 5,
    label: "Lanai legend tip",
    blurb: "Gold supporter flag",
    flagColor: "#d4af37",
    flagName: "Gold",
  },
];

const STORAGE_KEY = "vgch-donation-highest-usd";
const STORAGE_SESSIONS = "vgch-donation-sessions";

export function flagColorForTier(tier: DonationTierUsd): string {
  return DONATION_PRESETS.find((p) => p.amountUsd === tier)?.flagColor ?? "#c62828";
}

export function flagNameForTier(tier: DonationTierUsd): string {
  return DONATION_PRESETS.find((p) => p.amountUsd === tier)?.flagName ?? "Red";
}

export function isDonationTier(n: unknown): n is DonationTierUsd {
  return n === 1 || n === 3 || n === 5;
}

export function getHighestDonationTier(): DonationTierUsd | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const n = Number(raw);
    return isDonationTier(n) ? n : null;
  } catch {
    return null;
  }
}

/** Record a confirmed tip; keeps only the highest amount. Returns the new high. */
export function recordDonation(amountUsd: number): DonationTierUsd | null {
  if (!isDonationTier(amountUsd)) return getHighestDonationTier();
  const prev = getHighestDonationTier();
  const next = prev == null ? amountUsd : (Math.max(prev, amountUsd) as DonationTierUsd);
  try {
    localStorage.setItem(STORAGE_KEY, String(next));
  } catch {
    /* ignore quota */
  }
  return next;
}

export function rememberSession(sessionId: string): boolean {
  if (!sessionId) return false;
  try {
    const list = JSON.parse(localStorage.getItem(STORAGE_SESSIONS) || "[]") as string[];
    if (list.includes(sessionId)) return false;
    list.push(sessionId);
    // Cap history
    while (list.length > 40) list.shift();
    localStorage.setItem(STORAGE_SESSIONS, JSON.stringify(list));
    return true;
  } catch {
    return true;
  }
}

export function presetForAmount(amountUsd: number): DonationPreset | null {
  return DONATION_PRESETS.find((p) => p.amountUsd === amountUsd) ?? null;
}

/** Hub embed is built with base `/golf-cart-hero/`; standalone Vite keeps `/api/donate`. */
function donateEndpoint(name: "checkout" | "confirm" | "status"): string {
  const base = import.meta.env.BASE_URL || "/";
  if (base.includes("golf-cart-hero")) {
    return `/api/golf-cart-hero/donate/${name}`;
  }
  return `/api/donate/${name}`;
}

export async function startDonationCheckout(amountUsd: DonationTierUsd): Promise<{
  url?: string;
  error?: string;
}> {
  try {
    const res = await fetch(donateEndpoint("checkout"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amountUsd }),
    });
    const data = (await res.json()) as { url?: string; error?: string };
    if (!res.ok || !data.url) {
      return { error: data.error || "Could not start checkout" };
    }
    return { url: data.url };
  } catch {
    return {
      error:
        "Could not reach the tip server. Run the game with `npm run dev` and set STRIPE_SECRET_KEY in .env.local.",
    };
  }
}

export async function confirmDonationSession(sessionId: string): Promise<{
  ok: boolean;
  amountUsd?: number;
  tier?: DonationTierUsd | null;
  message?: string;
  error?: string;
}> {
  try {
    const res = await fetch(donateEndpoint("confirm"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    });
    const data = (await res.json()) as {
      ok?: boolean;
      amountUsd?: number;
      error?: string;
      message?: string;
    };
    if (!res.ok) {
      return { ok: false, error: data.error || "Could not verify tip" };
    }
    const amount = data.amountUsd;
    let tier: DonationTierUsd | null = null;
    if (typeof amount === "number" && isDonationTier(amount)) {
      if (rememberSession(sessionId)) {
        tier = recordDonation(amount);
      } else {
        tier = getHighestDonationTier();
      }
    }
    return {
      ok: true,
      amountUsd: amount,
      tier,
      message: data.message || "Thanks for the tip!",
    };
  } catch {
    return { ok: false, error: "Could not verify tip with the server." };
  }
}

export async function donationApiReady(): Promise<boolean> {
  try {
    const res = await fetch(donateEndpoint("status"));
    if (!res.ok) return false;
    const data = (await res.json()) as { ready?: boolean };
    return Boolean(data.ready);
  } catch {
    return false;
  }
}
