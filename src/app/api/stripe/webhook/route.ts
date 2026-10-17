import { NextRequest, NextResponse } from "next/server";
import { fulfillPaidMembershipSession } from "@/lib/memberStripe";
import { getStripe, stripeConfigured } from "@/lib/stripe";
import { fulfillShopSession } from "@/lib/shop/fulfill";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Stripe → this URL after a paid Checkout session.
 * Verifies the event when STRIPE_WEBHOOK_SECRET is set; otherwise retrieves
 * the session from Stripe (never trusts the posted plan/amount).
 */
export async function POST(req: NextRequest) {
  if (!stripeConfigured()) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const stripe = getStripe()!;
  const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  let sessionId = "";

  try {
    if (secret) {
      const raw = await req.text();
      const sig = req.headers.get("stripe-signature") || "";
      const event = stripe.webhooks.constructEvent(raw, sig, secret);
      if (event.type !== "checkout.session.completed") {
        return NextResponse.json({ received: true, ignored: event.type });
      }
      const obj = event.data.object as { id?: string; mode?: string };
      sessionId = String(obj.id || "");
      if (obj.mode && obj.mode !== "subscription") {
        if (obj.mode === "payment") return shopOrIgnore(sessionId);
        return NextResponse.json({ received: true, ignored: "not membership" });
      }
    } else {
      const body = (await req.json().catch(() => null)) as {
        type?: string;
        data?: { object?: { id?: string; mode?: string } };
      } | null;
      if (body?.type && body.type !== "checkout.session.completed") {
        return NextResponse.json({ received: true, ignored: body.type });
      }
      sessionId = String(body?.data?.object?.id || "");
    }
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Invalid webhook" },
      { status: 400 }
    );
  }

  if (!sessionId) {
    return NextResponse.json({ error: "Missing session id" }, { status: 400 });
  }

  try {
    const result = await fulfillPaidMembershipSession(sessionId);
    return NextResponse.json({
      received: true,
      ok: true,
      plan: result.plan,
      memberId: result.memberId,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Fulfill failed";
    if (message === "Not a membership checkout") {
      return shopOrIgnore(sessionId);
    }
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

/**
 * Merch shop orders share this Stripe account. A paid shop session (metadata.source = villages-shop) goes to
 * the shop fulfillment (Printful, or a recorded order plus an admin email). Tips and anything else stay ignored.
 */
async function shopOrIgnore(sessionId: string) {
  try {
    const { status } = await fulfillShopSession(sessionId);
    if (status === "not-shop" || status === "ignored") {
      return NextResponse.json({ received: true, ignored: "not membership" });
    }
    return NextResponse.json({ received: true, shop: status });
  } catch (err) {
    console.error("[stripe-webhook] shop fulfillment failed", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Shop fulfillment failed" }, { status: 500 });
  }
}
