import type { Metadata } from "next";
import { CartView } from "./cart-view";
import { checkoutMode, stripeKeyMode } from "@/lib/shop/config";
import { ShopHero } from "@/components/shop/shop-hero";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Cart \u00b7 Shop", robots: { index: false } };

function chargeNotice(): string | null {
  const keyMode = stripeKeyMode();
  if (keyMode === "test") return "Stripe test mode: no real charge. Use card 4242 4242 4242 4242, any future date, any CVC.";
  if (keyMode === "live" && process.env.VERCEL_ENV !== "production") {
    return "Heads up: this review copy uses live Stripe payments. Completing checkout charges a real card.";
  }
  return null;
}

export default function CartPage() {
  return (
    <>
      <ShopHero kicker="Cart" title="Your golf cart" lede="Everything you picked, parked and ready. Shipping is added at checkout." mascot={false} />
      <section className="section">
        <div className="shell">
          <CartView mode={checkoutMode()} chargeNotice={chargeNotice()} />
        </div>
      </section>
    </>
  );
}
