import type { Metadata } from "next";
import Link from "next/link";
import { ShopHero } from "@/components/shop/shop-hero";

export const metadata: Metadata = { title: "Checkout canceled · Shop", robots: { index: false } };

export default function CancelPage() {
  return (
    <>
      <ShopHero kicker="Checkout canceled" title="No charge, no worries" lede="Your cart is still parked right where you left it." />
      <section className="section">
        <div className="shell">
          <Link className="btn btn-primary" href="/shop/cart">Return to cart</Link>
        </div>
      </section>
    </>
  );
}
