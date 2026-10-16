import type { Metadata } from "next";
import { CartView } from "./cart-view";
import { checkoutEnabled, mockCheckout } from "@/lib/shop/config";
import { ShopHero } from "@/components/shop/shop-hero";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Cart · Shop", robots: { index: false } };

export default function CartPage() {
  const mode = checkoutEnabled() ? "live" : mockCheckout() ? "mock" : "off";
  return (
    <>
      <ShopHero kicker="Cart" title="Your golf cart" lede="Everything you picked, parked and ready. Shipping is added at checkout." mascot={false} />
      <section className="section">
        <div className="shell">
          <CartView mode={mode} />
        </div>
      </section>
    </>
  );
}
