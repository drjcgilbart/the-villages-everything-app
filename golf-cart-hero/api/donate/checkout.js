/**
 * Vercel serverless: POST /api/donate/checkout
 */
import {
  createCheckoutSession,
  getStripe,
  parseAmount,
  siteBaseUrl,
} from "../../server/donateApi.mjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const stripe = getStripe(process.env.STRIPE_SECRET_KEY);
  if (!stripe) {
    return res.status(503).json({
      error:
        "Donations aren’t wired up yet. Add STRIPE_SECRET_KEY in the Vercel project env.",
    });
  }

  const amountUsd = parseAmount(req.body?.amountUsd);
  if (amountUsd == null) {
    return res.status(400).json({ error: "Pick $1, $3, or $5." });
  }

  try {
    const base = siteBaseUrl(process.env, {
      headers: {
        host: req.headers.host || "localhost:5173",
        "x-forwarded-proto": req.headers["x-forwarded-proto"] || "https",
      },
    });
    const session = await createCheckoutSession({
      stripe,
      amountUsd,
      baseUrl: base,
    });
    if (!session.url) {
      return res
        .status(500)
        .json({ error: "Could not start checkout. Try again." });
    }
    return res.status(200).json({ url: session.url, amountUsd });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Stripe checkout failed";
    console.error("donate checkout error:", message);
    return res.status(500).json({ error: message });
  }
}
