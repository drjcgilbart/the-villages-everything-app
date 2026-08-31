import { getStripe, siteBaseUrl } from "@/lib/stripe";

export function parseGolfCartHeroAmount(raw: unknown): 1 | 3 | 5 | null {
  const n = typeof raw === "number" ? raw : Number(raw);
  if (n === 1 || n === 3 || n === 5) return n;
  return null;
}

export function golfCartHeroFlagMeta(amountUsd: 1 | 3 | 5) {
  if (amountUsd === 5) return { color: "Gold", name: "Lanai legend tip" };
  if (amountUsd === 3) return { color: "Blue", name: "Happy-hour tip" };
  return { color: "Red", name: "Cart-path tip" };
}

export async function createGolfCartHeroCheckout(amountUsd: 1 | 3 | 5) {
  const stripe = getStripe();
  if (!stripe) return { error: "Stripe not configured", status: 503 as const };

  const base = siteBaseUrl();
  const meta = golfCartHeroFlagMeta(amountUsd);
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    submit_type: "donate",
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: amountUsd * 100,
          product_data: {
            name: `Golf Cart Hero — ${meta.name} ($${amountUsd})`,
            description: `Tip for The Villages Golf Cart Hero. Unlocks a ${meta.color} supporter flag with the golf-ball mascot on your cart.`,
            images: [`${base}/golf-cart-hero/assets/mascot-logo.jpg`],
            tax_code: "txcd_10000000",
          },
        },
      },
    ],
    success_url: `${base}/golf-cart-hero?donate=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${base}/golf-cart-hero?donate=canceled`,
    metadata: {
      purpose: "golf-cart-hero-donation",
      amount_usd: String(amountUsd),
      flag_color: meta.color,
    },
  });

  return { session };
}

export async function confirmGolfCartHeroSession(sessionId: string) {
  const stripe = getStripe();
  if (!stripe) return { error: "Stripe not configured", status: 503 as const };

  const session = await stripe.checkout.sessions.retrieve(sessionId);
  if (session.metadata?.purpose !== "golf-cart-hero-donation") {
    return { error: "Not a Golf Cart Hero donation session", status: 400 as const };
  }
  if (session.payment_status !== "paid" && session.status !== "complete") {
    return { error: "Payment not complete", status: 400 as const };
  }

  const amountUsd =
    parseGolfCartHeroAmount(session.metadata?.amount_usd) ??
    (typeof session.amount_total === "number"
      ? parseGolfCartHeroAmount(session.amount_total / 100)
      : null);

  if (amountUsd == null) {
    return {
      ok: true as const,
      amountUsd: null,
      message: "Thanks for the tip!",
    };
  }

  const meta = golfCartHeroFlagMeta(amountUsd);
  return {
    ok: true as const,
    amountUsd,
    flagColor: meta.color,
    message: `Thanks! Your cart now flies a ${meta.color} supporter flag whenever you race.`,
  };
}
