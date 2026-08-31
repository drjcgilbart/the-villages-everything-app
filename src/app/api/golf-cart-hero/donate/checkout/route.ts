import { NextResponse } from "next/server";
import {
  createGolfCartHeroCheckout,
  parseGolfCartHeroAmount,
} from "@/lib/golfCartHeroDonate";
import { getStripe } from "@/lib/stripe";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const { rateLimitResponse } = await import("@/lib/authRateLimit");
  const limited = rateLimitResponse(req, "gch-donate-checkout", 10, 15 * 60 * 1000);
  if (limited) return limited;

  if (!getStripe()) {
    return NextResponse.json(
      {
        error:
          "Donations aren’t wired up yet. Add STRIPE_SECRET_KEY to the site env.",
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

  const amountUsd = parseGolfCartHeroAmount(body.amountUsd);
  if (amountUsd == null) {
    return NextResponse.json({ error: "Pick $1, $3, or $5." }, { status: 400 });
  }

  try {
    const result = await createGolfCartHeroCheckout(amountUsd);
    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }
    if (!result.session.url) {
      return NextResponse.json(
        { error: "Could not start checkout. Try again." },
        { status: 500 }
      );
    }
    return NextResponse.json({ url: result.session.url, amountUsd });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Stripe checkout failed";
    console.error("golf-cart-hero donate checkout error:", message);
    return NextResponse.json(
      { error: "Could not start checkout. Please try again." },
      { status: 500 }
    );
  }
}
