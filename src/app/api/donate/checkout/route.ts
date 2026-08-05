import { NextResponse } from "next/server";
import {
  awardsGoldenLoofah,
  GOLDEN_LOOFAH_MIN_USD,
  parseDonationAmount,
  usdToCents,
} from "@/lib/donations";
import { getSessionMember } from "@/lib/memberAuth";
import { getStripe, siteBaseUrl } from "@/lib/stripe";

export async function POST(req: Request) {
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

  let body: { amountUsd?: unknown } = {};
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

  const base = siteBaseUrl();
  const amountCents = usdToCents(amountUsd);
  const loofah = awardsGoldenLoofah(amountUsd);
  const sessionMember = await getSessionMember();

  if (loofah && !sessionMember) {
    return NextResponse.json(
      {
        error:
          "Sign in as a Hub member before donating at the Golden Loofah tier ($" +
          GOLDEN_LOOFAH_MIN_USD +
          "+) so we can attach the badge to your account.",
        code: "MEMBER_REQUIRED_FOR_LOOFAH",
      },
      { status: 401 }
    );
  }

  const productName = loofah
    ? "Golden Loofah — Buy me a cup of Joe"
    : "Cup of Joe — Keep the lights on";
  const productDescription = loofah
    ? `Top-tier tip ($${amountUsd.toFixed(2)}) for The Villages Hub — unlocks the highly coveted Golden Loofah badge next to your name.`
    : "A tip for The Villages Hub — hosting, coffee, and golf-cart energy.";

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
                loofah
                  ? `${base}/graphics/badges/golden-loofah.jpg`
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
        awards_golden_loofah: loofah ? "1" : "0",
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
      awardsGoldenLoofah: loofah,
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Stripe checkout failed";
    console.error("donate checkout error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
