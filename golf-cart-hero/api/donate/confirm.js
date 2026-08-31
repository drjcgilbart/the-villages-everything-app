/**
 * Vercel serverless: POST /api/donate/confirm
 */
import { confirmCheckoutSession, getStripe } from "../../server/donateApi.mjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const stripe = getStripe(process.env.STRIPE_SECRET_KEY);
  if (!stripe) {
    return res.status(503).json({ error: "Stripe not configured" });
  }

  const sessionId = String(req.body?.sessionId || "").trim();
  if (!sessionId) {
    return res.status(400).json({ error: "sessionId required" });
  }

  try {
    const result = await confirmCheckoutSession({ stripe, sessionId });
    if (result.error) {
      return res.status(result.status || 400).json({ error: result.error });
    }
    return res.status(200).json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Confirm failed";
    console.error("donate confirm error:", message);
    return res.status(500).json({ error: message });
  }
}
