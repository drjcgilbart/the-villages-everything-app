"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { lineKey, useCart } from "@/components/shop/cart";
import { BadgePreview } from "@/components/shop/badge-preview";
import { findVariant, formatPrice, productHref, variantImage } from "@/lib/shop/catalog";
import { BADGE_SIZE, badgeMaterialOrDefault, themeFromSku } from "@/lib/shop/badges";

export function CartView({ mode, chargeNotice }: { mode: "live" | "mock" | "unavailable"; chargeNotice?: string | null }) {
  const { items, setQty, remove, ready } = useCart();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lines = items.flatMap((i) => {
    const f = findVariant(i.sku);
    // A custom badge line without its text is unusable; drop it rather than send it to checkout.
    if (!f || (f.product.badge?.kind === "custom" && !i.badge?.name)) return [];
    // Name badges are priced by material (one config in badges.ts); the server prices checkout the same way.
    const material = f.product.type === "badges" ? badgeMaterialOrDefault(i.material) : undefined;
    const unitCents = material ? material.priceCents : f.product.priceCents;
    return [{ ...i, ...f, material: material?.id, materialInfo: material, unitCents, key: lineKey(i) }];
  });
  const subtotal = lines.reduce((n, l) => n + l.unitCents * l.qty, 0);

  async function checkout() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/shop/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: lines.map(({ sku, qty, badge, material }) => ({ sku, qty, ...(badge ? { badge } : {}), ...(material ? { material } : {}) })) }),
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
      {lines.map((l) => {
        const theme = themeFromSku(l.sku);
        const title = theme ? `Custom Name Badge (${theme.label})` : l.product.name;
        const mat = l.materialInfo ? ` \u00b7 ${l.materialInfo.label} \u00b7 ${BADGE_SIZE.label}` : "";
        const detail = theme
          ? `\u201c${l.badge?.name}\u201d${theme.usesVillage && l.badge?.village ? ` \u00b7 Village of ${l.badge.village}` : ""}${mat}`
          : l.product.badge?.kind === "ready"
            ? `Ready-made${mat}`
            : l.variant.label;
        return (
          <div className="shop-line" key={l.key}>
            {theme ? (
              <BadgePreview theme={theme} text={{ name: l.badge?.name ?? "", village: l.badge?.village }} />
            ) : (
              <Image src={variantImage(l.product, l.variant)} alt="" width={84} height={84} />
            )}
            <div>
              <Link href={productHref(l.product)} className="shop-line-name">{title}</Link>
              <div className="shop-mono" data-testid="cart-line-detail">{detail} · {formatPrice(l.unitCents)}</div>
            </div>
            <label className="shop-qty-wrap">
              <span className="sr-only">Quantity for {title}</span>
              <input className="shop-qty" type="number" min={1} max={10} value={l.qty} onChange={(e) => setQty(l.key, Number(e.target.value))} />
            </label>
            <button type="button" className="btn btn-ghost btn-sm shop-x" onClick={() => remove(l.key)} aria-label={`Remove ${title} (${detail})`}>
              Remove
            </button>
          </div>
        );
      })}
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
