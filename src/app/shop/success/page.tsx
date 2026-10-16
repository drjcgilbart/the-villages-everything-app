import type { Metadata } from "next";
import Link from "next/link";
import { ClearCart } from "./clear-cart";
import { ShopHero } from "@/components/shop/shop-hero";

export const metadata: Metadata = { title: "Order received · Shop", robots: { index: false } };

type Props = { searchParams: Promise<{ mock?: string }> };

export default async function SuccessPage({ searchParams }: Props) {
  const mock = (await searchParams).mock === "1";
  return (
    <>
      <ClearCart />
      <ShopHero
        kicker={mock ? "Test order · no charge" : "Order received"}
        title={mock ? "Test checkout complete" : "Thanks, neighbor!"}
        lede={
          mock
            ? "This was a test run. No payment was taken and nothing was sent to the printer. Your cart has been cleared."
            : "Payment confirmed. Your receipt is on its way by email, and your order goes to the print shop shortly. Tracking follows when it ships."
        }
      />
      <section className="section">
        <div className="shell">
          <Link className="btn btn-primary" href="/shop">Back to the shop</Link>
        </div>
      </section>
    </>
  );
}
