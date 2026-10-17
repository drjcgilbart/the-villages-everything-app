import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { buildLineItems, PricingError } from "@/lib/shop/pricing";
import { getShopStripe } from "@/lib/shop/stripe";
import {
  automaticTax,
  checkoutMode,
  shipCountries,
  shippingRateCents,
  siteUrl,
  SHIPPING_TAX_CODE,
  SHOP_SESSION_SOURCE,
} from "@/lib/shop/config";
import { logError, logInfo } from "@/lib/shop/log";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UNAVAILABLE = "Checkout is temporarily unavailable. Your cart is saved on this device, so please try again soon.";

export async function POST(req: Request) {
  const mode = checkoutMode();
  if (mode === "unavailable") return NextResponse.json({ error: UNAVAILABLE, unavailable: true }, { status: 503 });
  let body: { items?: unknown };
  try {
    body = (await req.json()) as { items?: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  try {
    const tax = automaticTax();
    // Server-side catalog prices only. The client sends SKUs and quantities, never prices.
    const { lineItems, subtotal } = buildLineItems(body?.items, { taxBehavior: tax ? "exclusive" : undefined });
    if (mode === "mock") {
      logInfo("shop-checkout", "mock checkout", { lines: lineItems.length, subtotal });
      return NextResponse.json({ url: "/shop/success?mock=1", mock: true, subtotal }); // relative: stays on this host
    }
    const stripe = getShopStripe();
    // On Vercel use the deployment URL (preview) or the canonical site; on this PC come back to the same host.
    const base = process.env.VERCEL ? siteUrl() : new URL(req.url).origin;
    const skus = lineItems.map((l) => `${l.price_data.product_data.metadata.sku}x${l.quantity}`).join(",");
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      ...(tax ? { automatic_tax: { enabled: true } } : {}),
      shipping_address_collection: {
        allowed_countries: shipCountries() as Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry[],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            display_name: "Standard (printed on demand)",
            type: "fixed_amount",
            fixed_amount: { amount: shippingRateCents(), currency: "usd" },
            tax_code: SHIPPING_TAX_CODE,
            ...(tax ? { tax_behavior: "exclusive" as const } : {}),
            delivery_estimate: {
              minimum: { unit: "business_day", value: 5 },
              maximum: { unit: "business_day", value: 12 },
            },
          },
        },
      ],
      phone_number_collection: { enabled: true },
      success_url: `${base}/shop/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/shop/cancel`,
      metadata: { source: SHOP_SESSION_SOURCE, skus: skus.slice(0, 480) },
      payment_intent_data: { metadata: { source: SHOP_SESSION_SOURCE } },
    });
    if (!session.url) throw new Error("Stripe returned no Checkout URL");
    return NextResponse.json({ url: session.url });
  } catch (err) {
    if (err instanceof PricingError) return NextResponse.json({ error: err.message }, { status: 400 });
    logError("shop-checkout", err);
    return NextResponse.json({ error: UNAVAILABLE }, { status: 503 });
  }
}
