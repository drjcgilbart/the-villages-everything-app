import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getShopStripe } from "@/lib/shop/stripe";
import { fulfillShopSession } from "@/lib/shop/fulfill";
import { stripeKeyConfigured } from "@/lib/shop/config";
import { logError } from "@/lib/shop/log";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Optional dedicated Stripe endpoint for shop orders (event checkout.session.completed).
// The site's existing /api/stripe/webhook also hands shop sessions to the same fulfillment, so one endpoint is enough.
// With SHOP_STRIPE_WEBHOOK_SECRET set, the signature is verified. Without it (same pattern as /api/stripe/webhook),
// only the session id is read from the body and the session is re-fetched from Stripe, so nothing posted is trusted.
export async function POST(req: Request) {
  if (!stripeKeyConfigured()) return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  const secret = process.env.SHOP_STRIPE_WEBHOOK_SECRET?.trim();
  let sessionId = "";
  try {
    if (secret) {
      const raw = await req.text(); // raw body is required for signature verification
      const event: Stripe.Event = getShopStripe().webhooks.constructEvent(raw, req.headers.get("stripe-signature") || "", secret);
      if (event.type !== "checkout.session.completed") return NextResponse.json({ received: true, ignored: event.type });
      sessionId = String((event.data.object as { id?: string }).id || "");
    } else {
      const body = (await req.json().catch(() => null)) as { type?: string; data?: { object?: { id?: string } } } | null;
      if (body?.type && body.type !== "checkout.session.completed") return NextResponse.json({ received: true, ignored: body.type });
      sessionId = String(body?.data?.object?.id || "");
    }
  } catch (err) {
    logError("shop-stripe-webhook", err, { reason: "bad signature or body" });
    return NextResponse.json({ error: "Invalid webhook" }, { status: 400 });
  }
  if (!sessionId) return NextResponse.json({ error: "Missing session id" }, { status: 400 });
  try {
    const { status } = await fulfillShopSession(sessionId);
    return NextResponse.json({ received: true, status });
  } catch (err) {
    logError("shop-stripe-webhook", err, { session: sessionId });
    return NextResponse.json({ error: "Fulfillment failed" }, { status: 500 }); // Stripe will retry
  }
}
