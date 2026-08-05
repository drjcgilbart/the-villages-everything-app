import { NextRequest, NextResponse } from "next/server";
import { getSessionMember } from "@/lib/memberAuth";
import { getStripe, siteBaseUrl, stripeConfigured } from "@/lib/stripe";
import { getMemberSpace, updateMemberSpace } from "@/lib/memberSpace";
import {
  getTier,
  normalizePlan,
  stripePriceForTier,
  type HubPlanId,
} from "@/lib/membershipTiers";

export const dynamic = "force-dynamic";

/**
 * Start Hub Member subscription checkout (Stripe) for a tier.
 * Body: { tier?: HubPlanId } — default cart_path_regular
 *
 * Env (any of):
 *   STRIPE_MEMBER_PRICE_ID — Cart Path Regular (back-compat)
 *   STRIPE_PRICE_HUB / STRIPE_PRICE_PLUS / STRIPE_PRICE_PATRON
 *   or NEXT_PUBLIC_MEMBER_PAYMENT_LINK for a static Payment Link (any paid tier)
 */
export async function POST(req: NextRequest) {
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

  let requested: HubPlanId = "cart_path_regular";
  try {
    const body = (await req.json().catch(() => ({}))) as { tier?: string };
    if (body.tier) requested = normalizePlan(body.tier);
  } catch {
    /* empty body */
  }
  if (requested === "porch_waver") {
    requested = "cart_path_regular";
  }

  const tier = getTier(requested);

  const staticLink = process.env.NEXT_PUBLIC_MEMBER_PAYMENT_LINK?.trim();
  if (staticLink) {
    return NextResponse.json({
      url: staticLink,
      mode: "payment_link",
      plan: requested,
      planLabel: tier.label,
    });
  }

  if (!stripeConfigured()) {
    if (process.env.HUB_MEMBER_DEV_UNLOCK === "true") {
      updateMemberSpace(member.id, { plan: requested });
      return NextResponse.json({
        url: `${siteBaseUrl()}/my-space?welcome=1`,
        mode: "dev_unlock",
        plan: requested,
        planLabel: tier.label,
      });
    }
    return NextResponse.json(
      {
        error:
          "Subscriptions are not configured yet. Set STRIPE_PRICE_HUB (or STRIPE_MEMBER_PRICE_ID), STRIPE_PRICE_PLUS, STRIPE_PRICE_PATRON — or enable HUB_MEMBER_DEV_UNLOCK for testing.",
      },
      { status: 503 }
    );
  }

  const priceId = stripePriceForTier(requested);
  if (!priceId) {
    return NextResponse.json(
      {
        error: `No Stripe price configured for ${tier.label}. Set STRIPE_PRICE_${tier.stripeEnvKey || "HUB"} or STRIPE_MEMBER_PRICE_ID.`,
      },
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
    metadata: { memberId: member.id, plan: requested },
    subscription_data: {
      metadata: { memberId: member.id, plan: requested },
    },
  });

  if (session.customer && typeof session.customer === "string") {
    updateMemberSpace(member.id, {
      stripeCustomerId: session.customer,
    });
  }

  void space;

  return NextResponse.json({
    url: session.url,
    mode: "checkout",
    plan: requested,
    planLabel: tier.label,
  });
}
