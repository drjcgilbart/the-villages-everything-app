import { NextRequest, NextResponse } from "next/server";
import { getSessionMember } from "@/lib/memberAuth";
import { getStripe, stripeConfigured } from "@/lib/stripe";
import { updateMemberSpace } from "@/lib/memberSpace";

export const dynamic = "force-dynamic";

/** After Stripe Checkout success, verify session and unlock My Space. */
export async function POST(req: NextRequest) {
  const member = await getSessionMember();
  if (!member) {
    return NextResponse.json({ error: "Please sign in" }, { status: 401 });
  }

  if (process.env.HUB_MEMBER_DEV_UNLOCK === "true") {
    updateMemberSpace(member.id, { plan: "subscriber" });
    return NextResponse.json({ ok: true, plan: "subscriber", mode: "dev" });
  }

  if (!stripeConfigured()) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const body = (await req.json()) as { sessionId?: string };
  const sessionId = String(body.sessionId || "").trim();
  if (!sessionId) {
    return NextResponse.json({ error: "sessionId required" }, { status: 400 });
  }

  const stripe = getStripe()!;
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  const metaMember = session.metadata?.memberId || session.client_reference_id;
  if (metaMember !== member.id) {
    return NextResponse.json({ error: "Session does not match member" }, { status: 403 });
  }
  if (session.payment_status !== "paid" && session.status !== "complete") {
    return NextResponse.json({ error: "Payment not complete" }, { status: 400 });
  }

  const subId =
    typeof session.subscription === "string"
      ? session.subscription
      : session.subscription?.id;
  const custId =
    typeof session.customer === "string"
      ? session.customer
      : session.customer?.id;

  updateMemberSpace(member.id, {
    plan: "subscriber",
    stripeSubscriptionId: subId,
    stripeCustomerId: custId,
  });

  return NextResponse.json({ ok: true, plan: "subscriber" });
}
