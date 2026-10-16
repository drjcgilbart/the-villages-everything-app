import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getShopStripe } from "@/lib/shop/stripe";
import { getDedupeStore } from "@/lib/shop/idempotency";
import { handleStripeEvent } from "@/lib/shop/fulfill";
import { logError } from "@/lib/shop/log";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Register in Stripe as its own endpoint: https://www.thevillageseverythingapp.com/api/shop/stripe-webhook
// (event checkout.session.completed). Its signing secret goes in SHOP_STRIPE_WEBHOOK_SECRET.
// The membership webhook at /api/stripe/webhook already ignores payment-mode sessions.
export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  const secret = process.env.SHOP_STRIPE_WEBHOOK_SECRET;
  if (!sig || !secret) return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  const raw = await req.text(); // raw body is required for signature verification
  let event: Stripe.Event;
  let stripe: Stripe;
  try {
    stripe = getShopStripe();
    event = stripe.webhooks.constructEvent(raw, sig, secret);
  } catch (err) {
    logError("shop-stripe-webhook", err, { reason: "bad signature or missing key" });
    return NextResponse.json({ error: "Bad signature" }, { status: 400 });
  }
  try {
    const status = await handleStripeEvent(event, {
      store: getDedupeStore(),
      retrieveSession: (id) => stripe.checkout.sessions.retrieve(id, { expand: ["line_items.data.price.product"] }),
    });
    return NextResponse.json({ received: true, status });
  } catch {
    return NextResponse.json({ error: "Fulfillment failed" }, { status: 500 }); // Stripe will retry
  }
}
