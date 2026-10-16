"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/shop/catalog";
import { useCart } from "./cart";

/** Mockup + colour/size pickers + Add to cart. The mockup follows the chosen colour. */
export function ProductBuy({ product }: { product: Product }) {
  const colors = product.colors ?? [];
  const [color, setColor] = useState<string | null>(colors[0]?.id ?? null);
  const sizes = useMemo(
    () => product.variants.filter((v) => !colors.length || v.color === color),
    [product.variants, colors.length, color]
  );
  const single = sizes.length === 1;
  const [size, setSize] = useState<string | null>(null);
  const chosen = single ? sizes[0] : sizes.find((v) => v.size === size) ?? null;
  const [added, setAdded] = useState<string | null>(null);
  const { add } = useCart();
  const [view, setView] = useState<"front" | "back">("front");
  const current = colors.find((c) => c.id === color);
  const image = (view === "back" && current?.backImage) || current?.image || product.image;
  const colorLabel = colors.find((c) => c.id === color)?.label;

  return (
    <div className="shop-product">
      <div className="shop-pimg-wrap">
        <Image className="shop-pimg" src={image} alt={`${product.name}${colorLabel ? ` in ${colorLabel}` : ""} mockup${view === "back" ? ", back view" : ""}`} width={1000} height={1000} sizes="(max-width: 760px) 100vw, 50vw" priority />
        {current?.backImage ? (
          <div className="shop-views" role="group" aria-label="View">
            {(["front", "back"] as const).map((v) => (
              <button key={v} type="button" className="shop-view" aria-pressed={view === v} onClick={() => setView(v)}>
                <Image src={v === "back" ? current.backImage! : current.image} alt="" width={120} height={120} />
                <span>{v === "front" ? "Front" : "Back"}</span>
              </button>
            ))}
          </div>
        ) : null}
      </div>
      <div className="shop-buy">
        {colors.length > 1 ? (
          <>
            <p className="shop-mono">Color: {colorLabel}</p>
            <div className="shop-swatches" role="group" aria-label="Color">
              {colors.map((c) => (
                <button key={c.id} type="button" className="shop-swatch" aria-pressed={color === c.id} aria-label={c.label} title={c.label} style={{ background: c.hex }} onClick={() => { setColor(c.id); setAdded(null); }} />
              ))}
            </div>
          </>
        ) : null}
        {single ? (
          <p className="shop-mono">{sizes[0].size ?? sizes[0].label}</p>
        ) : (
          <>
            <p className="shop-mono">Size</p>
            <div className="shop-sizes" role="group" aria-label="Size">
              {sizes.map((v) => (
                <button key={v.sku} type="button" className="shop-size" aria-pressed={size === v.size} onClick={() => { setSize(v.size ?? v.label); setAdded(null); }}>
                  {v.size ?? v.label}
                </button>
              ))}
            </div>
          </>
        )}
        <div className="shop-actions">
          <button type="button" className="btn btn-primary" disabled={!chosen} onClick={() => { if (chosen) { add(chosen.sku); setAdded(chosen.label); } }}>
            {chosen ? "Add to cart" : "Pick a size"}
          </button>
          {added ? <Link className="btn btn-ghost" href="/shop/cart">View cart</Link> : null}
        </div>
        {added ? <p className="shop-ok" role="status">Added {added}. It&rsquo;s in the cart, riding shotgun.</p> : null}
      </div>
    </div>
  );
}
