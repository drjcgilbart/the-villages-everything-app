import { NextRequest, NextResponse } from "next/server";
import { getSessionMember } from "@/lib/memberAuth";
import { getStripe, siteBaseUrl, stripeConfigured } from "@/lib/stripe";
import { getMemberSpace, updateMemberSpace } from "@/lib/memberSpace";
import {
  getTier,
  normalizePlan,
  stripePriceForTier,
  type HubPlanId,
  type TierDef,
} from "@/lib/membershipTiers";

function subscriptionLineItem(tier: TierDef) {
  const priceId = stripePriceForTier(tier.id);
  if (priceId) return { price: priceId, quantity: 1 as const };
  const usd = tier.priceUsdPerMonth;
  return {
    quantity: 1 as const,
    price_data: {
      currency: "usd",
      unit_amount: Math.round(usd * 100),
      recurring: { interval: "month" as const },
      product_data: {
        name: `The Villages Everything App — ${tier.label}`,
        description: `${tier.tagline} $${usd}/month. ${tier.householdSeats === 1 ? "1 member login" : `${tier.householdSeats} member logins`} — each with their own My Space. Unlocks boards for this plan (and everything below it).`,
      },
    },
  };
}

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
  const existingSpace = getMemberSpace(member.id);
  if (existingSpace.householdOwnerId) {
    return NextResponse.json(
      {
        error:
          "You’re on a household plan. Leave it in My Space → Tiers if you want to buy your own membership.",
      },
      { status: 400 }
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
          "Subscriptions aren’t wired up yet. Add STRIPE_SECRET_KEY to enable $1 / $2 / $3 monthly checkout.",
      },
      { status: 503 }
    );
  }

  if (!tier.priceUsdPerMonth) {
    return NextResponse.json(
      { error: "That plan is free — request membership instead." },
      { status: 400 }
    );
  }

  const stripe = getStripe()!;
  const base = siteBaseUrl();

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: member.email,
    client_reference_id: member.id,
    line_items: [subscriptionLineItem(tier)],
    success_url: `${base}/my-space?subscribed=1&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${base}/donate?canceled=1`,
    metadata: {
      memberId: member.id,
      plan: requested,
      amount_usd_month: String(tier.priceUsdPerMonth),
    },
    subscription_data: {
      metadata: { memberId: member.id, plan: requested },
    },
  });

  if (session.customer && typeof session.customer === "string") {
    updateMemberSpace(member.id, {
      stripeCustomerId: session.customer,
    });
  }

  return NextResponse.json({
    url: session.url,
    mode: "checkout",
    plan: requested,
    planLabel: tier.label,
  });
}
