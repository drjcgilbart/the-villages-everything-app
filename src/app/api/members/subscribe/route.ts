import { NextResponse } from "next/server";
import { getSessionMember } from "@/lib/memberAuth";
import { getStripe, siteBaseUrl, stripeConfigured } from "@/lib/stripe";
import { getMemberSpace, updateMemberSpace } from "@/lib/memberSpace";

export const dynamic = "force-dynamic";

/**
 * Start Hub Member subscription checkout (Stripe) or return payment link.
 * Env: STRIPE_SECRET_KEY + STRIPE_MEMBER_PRICE_ID
 *   or NEXT_PUBLIC_MEMBER_PAYMENT_LINK for a static Payment Link.
 */
export async function POST() {
  const member = await getSessionMember();
  if (!member) {
    return NextResponse.json({ error: "Please sign in first" }, { status: 401 });
  }
  if (member.status !== "approved") {
    return NextResponse.json(
      { error: "Your account must be approved before subscribing" },
      { status: 403 }
    );
  }

  const staticLink = process.env.NEXT_PUBLIC_MEMBER_PAYMENT_LINK?.trim();
  if (staticLink) {
    return NextResponse.json({ url: staticLink, mode: "payment_link" });
  }

  if (!stripeConfigured()) {
    // Local / demo: allow unlock without Stripe when flagged
    if (process.env.HUB_MEMBER_DEV_UNLOCK === "true") {
      updateMemberSpace(member.id, { plan: "subscriber" });
      return NextResponse.json({
        url: `${siteBaseUrl()}/my-space?welcome=1`,
        mode: "dev_unlock",
      });
    }
    return NextResponse.json(
      {
        error:
          "Subscriptions are not configured yet. Set STRIPE_MEMBER_PRICE_ID or NEXT_PUBLIC_MEMBER_PAYMENT_LINK.",
      },
      { status: 503 }
    );
  }

  const priceId = process.env.STRIPE_MEMBER_PRICE_ID?.trim();
  if (!priceId) {
    return NextResponse.json(
      { error: "STRIPE_MEMBER_PRICE_ID is not set" },
      { status: 503 }
    );
  }

  const stripe = getStripe()!;
  const space = getMemberSpace(member.id);
  const base = siteBaseUrl();

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: member.email,
    client_reference_id: member.id,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${base}/my-space?subscribed=1&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${base}/my-space?canceled=1`,
    metadata: { memberId: member.id },
    subscription_data: {
      metadata: { memberId: member.id },
    },
  });

  if (session.customer && typeof session.customer === "string") {
    updateMemberSpace(member.id, {
      stripeCustomerId: session.customer,
    });
  }

  // Keep space reference so we know checkout was started
  void space;

  return NextResponse.json({ url: session.url, mode: "checkout" });
}
