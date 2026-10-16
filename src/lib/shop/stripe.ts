import Stripe from "stripe";

let client: Stripe | null = null;

/** Shop Stripe client. Uses the site's existing STRIPE_SECRET_KEY (same account as memberships and tips). */
export function getShopStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || key.includes("REPLACE_ME")) throw new Error("STRIPE_SECRET_KEY is not configured");
  if (!client) client = new Stripe(key);
  return client;
}
