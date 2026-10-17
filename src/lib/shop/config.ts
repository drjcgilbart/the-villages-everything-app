export function shipCountries(): string[] {
  // US only for now. SHIP_COUNTRIES can add more later, but US is always included.
  const list = (process.env.SHIP_COUNTRIES || "US").split(",").map((s) => s.trim().toUpperCase()).filter((s) => /^[A-Z]{2}$/.test(s));
  return Array.from(new Set(["US", ...list]));
}
export function shippingRateCents() {
  const n = Number(process.env.SHIPPING_RATE_CENTS ?? 599);
  return Number.isFinite(n) && n >= 0 ? Math.round(n) : 599;
}
export function siteUrl() {
  // Preview deployments: use this deployment's own URL so success/cancel links come back to the preview.
  const preview = process.env.VERCEL_ENV === "preview" && process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "";
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL;
  const production = process.env.VERCEL_ENV === "production" ? "https://www.thevillageseverythingapp.com" : "";
  return (preview || fromEnv || production || "http://localhost:3000").replace(/\/$/, "");
}
export function autoConfirm() {
  return process.env.PRINTFUL_AUTO_CONFIRM === "true";
}

/** True when the site's STRIPE_SECRET_KEY is present (the same key memberships and tips use). */
export function stripeKeyConfigured() {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  return Boolean(key && !key.includes("REPLACE_ME") && /^(sk|rk)_/.test(key));
}

/** "live" | "test" | null, from the key prefix only. Never exposes the key. */
export function stripeKeyMode(): "live" | "test" | null {
  const key = process.env.STRIPE_SECRET_KEY?.trim() || "";
  if (!stripeKeyConfigured()) return null;
  return /^(sk|rk)_live_/.test(key) ? "live" : "test";
}

/**
 * Checkout is on whenever STRIPE_SECRET_KEY exists. SHOP_CHECKOUT_ENABLED=false is an optional kill switch
 * (browse-only shop) that needs no other change.
 */
export function checkoutEnabled() {
  if (process.env.SHOP_CHECKOUT_ENABLED === "false") return false;
  return stripeKeyConfigured();
}

/**
 * Local test mode: SHOP_CHECKOUT_MOCK=true makes Checkout validate the cart with server prices and jump
 * straight to /shop/success?mock=1. No Stripe call, no charge, no Printful order. Never active on Vercel production.
 */
export function mockCheckout() {
  return process.env.SHOP_CHECKOUT_MOCK === "true" && process.env.VERCEL_ENV !== "production";
}

export type CheckoutMode = "live" | "mock" | "unavailable";
export function checkoutMode(): CheckoutMode {
  if (mockCheckout()) return "mock";
  return checkoutEnabled() ? "live" : "unavailable";
}

/** Printful private token. PRINTFUL_API_KEY is the documented name; PRINTFUL_API_TOKEN is accepted too. */
export function printfulApiKey(): string | null {
  const key = (process.env.PRINTFUL_API_KEY || process.env.PRINTFUL_API_TOKEN || "").trim();
  return key && !key.includes("REPLACE_ME") ? key : null;
}

/** Stripe Tax. Off unless STRIPE_AUTOMATIC_TAX=true (needs Stripe Tax set up with a registration first). */
export function automaticTax() {
  return process.env.STRIPE_AUTOMATIC_TAX === "true";
}
/** Stripe tax code for shipping charges. */
export const SHIPPING_TAX_CODE = "txcd_92010001";
/** Tag on every shop Checkout Session so the shop webhook ignores memberships and tips. */
export const SHOP_SESSION_SOURCE = "villages-shop";
