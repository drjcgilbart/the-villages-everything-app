import type { Metadata } from "next";
import Link from "next/link";
import { ClearCart } from "./clear-cart";
import { ShopHero } from "@/components/shop/shop-hero";
import { fulfillShopSession } from "@/lib/shop/fulfill";
import { stripeKeyConfigured } from "@/lib/shop/config";
import { formatPrice } from "@/lib/shop/catalog";
import { logError } from "@/lib/shop/log";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Order received \u00b7 Shop", robots: { index: false } };

type Props = { searchParams: Promise<{ mock?: string; session_id?: string }> };

type View = { kicker: string; title: string; lede: string; paid: boolean; email?: string | null; total?: number | null; lines?: string[] };

async function confirm(sessionId: string): Promise<View> {
  const pending: View = {
    kicker: "Almost there",
    title: "We are confirming your payment",
    lede: "Stripe has not confirmed this order yet. If you finished paying, your receipt email will arrive shortly. Questions? Write admin@thevillageseverythingapp.com.",
    paid: false,
  };
  if (!stripeKeyConfigured()) return pending;
  try {
    // Idempotent: the Stripe webhook may already have handled this session.
    const { status, session } = await fulfillShopSession(sessionId);
    if (!session || status === "not-shop" || status === "ignored") return pending;
    if (status === "unpaid") return pending;
    const lines = (session.line_items?.data ?? []).map((li) => {
      const product = li.price?.product;
      const badge = typeof product === "object" && product && "metadata" in product && product.metadata?.badge_kind ? product.description : null;
      return `${li.quantity ?? 1} \u00d7 ${li.description ?? "Item"}${badge ? `: ${badge}` : ""}`;
    });
    return {
      kicker: "Order received",
      title: "Thanks, neighbor!",
      lede: "Payment confirmed. Your receipt is on its way by email, and your order goes to the print shop shortly. Tracking follows when it ships.",
      paid: true,
      email: session.customer_details?.email,
      total: session.amount_total,
      lines,
    };
  } catch (err) {
    logError("shop-success", err, { session: sessionId.slice(0, 24) });
    return pending;
  }
}

export default async function SuccessPage({ searchParams }: Props) {
  const sp = await searchParams;
  const mock = sp.mock === "1";
  const sessionId = typeof sp.session_id === "string" ? sp.session_id : "";
  const view: View = mock
    ? {
        kicker: "Test order \u00b7 no charge",
        title: "Test checkout complete",
        lede: "This was a test run. No payment was taken and nothing was sent to the printer. Your cart has been cleared.",
        paid: true,
      }
    : sessionId
      ? await confirm(sessionId)
      : {
          kicker: "Shop",
          title: "No order to show",
          lede: "This page confirms an order after checkout. Head back to the shop to keep browsing.",
          paid: false,
        };
  return (
    <>
      {view.paid ? <ClearCart /> : null}
      <ShopHero kicker={view.kicker} title={view.title} lede={view.lede} />
      <section className="section">
        <div className="shell">
          {view.lines?.length ? (
            <div className="shop-panel shop-receipt">
              <p className="shop-mono">Your order</p>
              <ul>
                {view.lines.map((l, i) => (
                  <li key={i}>{l}</li>
                ))}
              </ul>
              {typeof view.total === "number" ? <p className="shop-price">Total {formatPrice(view.total)}</p> : null}
              {view.email ? <p className="shop-tag">Receipt sent to {view.email}</p> : null}
            </div>
          ) : null}
          <p>
            <Link className="btn btn-primary" href="/shop">Back to the shop</Link>
          </p>
        </div>
      </section>
    </>
  );
}
