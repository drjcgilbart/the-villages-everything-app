import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SLUG_PAGE_PRODUCTS, getProduct, formatPrice } from "@/lib/shop/catalog";
import { ProductBuy } from "@/components/shop/product-buy";
import { ShopBar } from "@/components/shop/shop-bar";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return SLUG_PAGE_PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getProduct((await params).slug);
  return p
    ? { title: `${p.name} · Shop`, description: p.description, alternates: { canonical: `/shop/${p.slug}` }, openGraph: { images: [p.image] } }
    : { title: "Not found" };
}

export default async function ProductPage({ params }: Props) {
  const p = getProduct((await params).slug);
  if (!p || p.type === "badges") notFound();
  return (
    <section className="section shop-pdp">
      <div className="shell">
        <div className="shop-pdp-top">
          <Link href="/shop" className="shop-back">← All merch</Link>
          <ShopBar />
        </div>
        <div className="shop-pdp-head">
          <span className="kicker">{p.tagline}</span>
          <h1 className="shop-ptitle">{p.name}</h1>
          <p className="shop-price shop-price-lg">{formatPrice(p.priceCents)}</p>
          <p className="shop-lede">{p.description}</p>
        </div>
        <ProductBuy product={p} />
        {p.type === "tees" ? (
          <details className="shop-sizechart">
            <summary>Size chart (inches, approx.)</summary>
            <table>
              <thead><tr><th>Size</th><th>Chest width</th><th>Length</th></tr></thead>
              <tbody>
                {[["S", 18, 28], ["M", 20, 29], ["L", 22, 30], ["XL", 24, 31], ["2XL", 26, 32], ["3XL", 28, 33]].map(([s, w, l]) => (
                  <tr key={s}><td>{s}</td><td>{w}</td><td>{l}</td></tr>
                ))}
              </tbody>
            </table>
            <p className="shop-tag">Unisex fit, measured flat. Made to order, so wrong-size returns are not accepted. <Link href="/shop/returns">Returns policy</Link></p>
          </details>
        ) : null}
        <p className="shop-note">Printed on demand · ships in about 3–7 business days</p>
      </div>
    </section>
  );
}
