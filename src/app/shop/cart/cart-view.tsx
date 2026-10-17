"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/components/shop/cart";
import { findVariant, formatPrice, variantImage } from "@/lib/shop/catalog";

export function CartView({ mode, chargeNotice }: { mode: "live" | "mock" | "unavailable"; chargeNotice?: string | null }) {
  const { items, setQty, remove, ready } = useCart();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lines = items.flatMap((i) => {
    const f = findVariant(i.sku);
    return f ? [{ ...i, ...f }] : [];
  });
  const subtotal = lines.reduce((n, l) => n + l.product.priceCents * l.qty, 0);

  async function checkout() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/shop/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: lines.map(({ sku, qty }) => ({ sku, qty })) }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) throw new Error(data.error || "Checkout failed");
      window.location.assign(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Checkout failed");
      setBusy(false);
    }
  }

  if (!ready) return null;
  if (lines.length === 0)
    return (
      <div className="shop-panel shop-empty">
        <p>Your cart is empty, like the cart path at 6 a.m.</p>
        <Link className="btn btn-primary" href="/shop">Browse the merch</Link>
      </div>
    );

  return (
    <div className="shop-panel">
      {lines.map((l) => (
        <div className="shop-line" key={l.sku}>
          <Image src={variantImage(l.product, l.variant)} alt="" width={84} height={84} />
          <div>
            <Link href={`/shop/${l.product.slug}`} className="shop-line-name">{l.product.name}</Link>
            <div className="shop-mono">{l.variant.label} · {formatPrice(l.product.priceCents)}</div>
          </div>
          <label className="shop-qty-wrap">
            <span className="sr-only">Quantity for {l.product.name}</span>
            <input className="shop-qty" type="number" min={1} max={10} value={l.qty} onChange={(e) => setQty(l.sku, Number(e.target.value))} />
          </label>
          <button type="button" className="btn btn-ghost btn-sm shop-x" onClick={() => remove(l.sku)} aria-label={`Remove ${l.product.name} (${l.variant.label})`}>
            Remove
          </button>
        </div>
      ))}
      <div className="shop-row shop-total">
        <div>
          <p className="shop-mono">Subtotal</p>
          <p className="shop-price shop-price-lg" data-testid="subtotal">{formatPrice(subtotal)}</p>
          <p className="shop-tag">Shipping is added at checkout. Sales tax is not collected yet.</p>
        </div>
        {mode === "unavailable" ? (
          <p className="shop-soon" role="status" data-testid="checkout-unavailable">
            <strong>Checkout is temporarily unavailable.</strong> Your cart is saved on this device, so please check back soon.
          </p>
        ) : (
          <button type="button" className="btn btn-primary shop-checkout" onClick={checkout} disabled={busy}>
            {busy ? "Warming up the cart\u2026" : mode === "mock" ? "Test checkout (no charge)" : "Checkout"}
          </button>
        )}
      </div>
      {mode === "mock" ? <p className="shop-tag">Test mode: no payment is taken and no order is sent to the printer.</p> : null}
      {mode === "live" ? <p className="shop-tag">Secure checkout by Stripe. US shipping addresses only.</p> : null}
      {mode === "live" && chargeNotice ? <p className="shop-tag shop-warn" role="note">{chargeNotice}</p> : null}
      {error ? <p className="msg msg-err" role="alert">{error}</p> : null}
    </div>
  );
}
