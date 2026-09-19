import { NextRequest, NextResponse } from "next/server";
import { fulfillPaidMembershipSession } from "@/lib/memberStripe";
import { getStripe, stripeConfigured } from "@/lib/stripe";

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
      return NextResponse.json({ received: true, ignored: "not membership" });
    }
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
