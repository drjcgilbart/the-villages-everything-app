import { NextResponse } from "next/server";
import {
  donationBadgeForCheckout,
  parseDonationAmount,
  usdToCents,
} from "@/lib/donations";
import { getSessionMember } from "@/lib/memberAuth";
import { getStripe, siteBaseUrl } from "@/lib/stripe";

export async function POST(req: Request) {
  const { rateLimitResponse } = await import("@/lib/authRateLimit");
  const limited = rateLimitResponse(req, "donate-checkout", 10, 15 * 60 * 1000);
  if (limited) return limited;

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json(
      {
        error:
          "Donations are not configured yet. Add STRIPE_SECRET_KEY to .env.local.",
      },
      { status: 503 }
    );
  }

  let body: { amountUsd?: unknown; isCustom?: unknown } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const amountUsd = parseDonationAmount(body.amountUsd);
  if (amountUsd == null) {
    return NextResponse.json(
      { error: "Enter an amount between $1 and $500." },
      { status: 400 }
    );
  }

  const isCustom = body.isCustom === true || body.isCustom === "true";
  const base = siteBaseUrl();
  const amountCents = usdToCents(amountUsd);
  const earned = donationBadgeForCheckout({ amountUsd, isCustom });
  const sessionMember = await getSessionMember();

  if (earned && !sessionMember) {
    return NextResponse.json(
      {
        error: `Sign in as a Hub member before donating at the ${earned.def.label} tier so we can put the badge next to your name.`,
        code: "MEMBER_REQUIRED_FOR_BADGE",
        badgeId: earned.badgeId,
      },
      { status: 401 }
    );
  }

  const productName = earned
    ? `${earned.def.label} — Buy me a cup of Joe`
    : "Cup of Joe — Keep the lights on";
  const productDescription = earned
    ? `Tip ($${amountUsd.toFixed(2)}) for The Villages Everything App — unlocks the “${earned.def.label}” badge${
        earned.badgeId === "golden_loofah" ||
        earned.badgeId === "custom_star_loofah"
          ? " and queues you for Square Royalty (1 year) pending admin approval"
          : ""
      }.`
    : "A tip for The Villages Everything App — hosting, coffee, and golf-cart energy.";

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      submit_type: "donate",
      managed_payments: { enabled: false },
      customer_email: sessionMember?.email || undefined,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: amountCents,
            product_data: {
              name: productName,
              description: productDescription,
              images: [
                earned
                  ? `${base}${earned.def.badgeImage}`
                  : `${base}/graphics/mascot-logo.jpg`,
              ],
              tax_code: "txcd_10000000",
            },
          },
        },
      ],
      success_url: `${base}/donate/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/donate?canceled=1`,
      metadata: {
        purpose: "site-donation",
        amount_usd: String(amountUsd),
        is_custom: isCustom ? "1" : "0",
        badge_id: earned?.badgeId || "",
        awards_golden_loofah:
          earned?.badgeId === "golden_loofah" ||
          earned?.badgeId === "custom_star_loofah"
            ? "1"
            : "0",
        memberId: sessionMember?.id || "",
      },
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Could not start checkout. Try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      url: session.url,
      badgeId: earned?.badgeId || null,
      badgeLabel: earned?.def.label || null,
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Stripe checkout failed";
    console.error("donate checkout error:", message);
    return NextResponse.json(
      { error: "Could not start checkout. Please try again." },
      { status: 500 }
    );
  }
}
