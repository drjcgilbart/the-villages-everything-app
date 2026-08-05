import { NextResponse } from "next/server";
import { parseDonationAmount, usdToCents } from "@/lib/donations";
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

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      submit_type: "donate",
      // Tip jar doesn't need Managed Payments; account default requires tax codes otherwise.
      managed_payments: { enabled: false },
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: amountCents,
            product_data: {
              name: "Cup of Joe — Keep the lights on",
              description:
                "A tip for The Villages Hub — hosting, coffee, and golf-cart energy.",
              images: [`${base}/graphics/mascot-logo.jpg`],
              // General - Electronically Supplied Services (tips/support for the site)
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
      },
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Could not start checkout. Try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Stripe checkout failed";
    console.error("donate checkout error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
