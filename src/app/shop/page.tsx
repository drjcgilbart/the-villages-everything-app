import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PRODUCTS, PRODUCT_TYPES, type ProductType } from "@/lib/shop/catalog";
import { ProductCard } from "@/components/shop/product-card";
import { ShopHero } from "@/components/shop/shop-hero";

export const metadata: Metadata = {
  title: "Shop",
  description: "Golf carts, pickleball, happy hour and nap-time merch from The Villages Everything App. Printed on demand.",
  alternates: { canonical: "/shop" },
};

type Props = { searchParams: Promise<{ type?: string | string[] }> };

export default async function ShopPage({ searchParams }: Props) {
  const raw = (await searchParams).type;
  const wanted = Array.isArray(raw) ? raw[0] : raw;
  const active = PRODUCT_TYPES.find((t) => t.id === wanted)?.id as ProductType | undefined;
  const order = (t: ProductType) => PRODUCT_TYPES.findIndex((x) => x.id === t);
  const sorted = PRODUCTS.map((p, i) => ({ p, i }))
    .sort((a, b) => order(a.p.type) - order(b.p.type) || a.i - b.i)
    .map((x) => x.p);
  const shown = active ? sorted.filter((p) => p.type === active) : sorted;
  const examples = PRODUCT_TYPES.map((t) => ({ ...t, product: PRODUCTS.find((p) => p.type === t.id) })).filter((t) => t.product);
  const activeLabel = PRODUCT_TYPES.find((t) => t.id === active)?.label;

  return (
    <>
      <ShopHero
        kicker="Merch · printed on demand"
        title="The Everything Shop"
        lede="Tees, hats, mugs and golf towels for neighbors who dink responsibly, honor the 2:00 nap and never miss happy hour on the square."
      />
      <section className="section">
        <div className="shell">
          <section className="shop-types" aria-labelledby="shop-types-h">
            <h2 id="shop-types-h" className="shop-mono shop-types-h">Shop by type</h2>
            <div className="shop-types-row">
              {examples.map((t) => (
                <Link key={t.id} href={`/shop?type=${t.id}`} className="shop-type-tile" aria-current={active === t.id ? "page" : undefined}>
                  <Image src={t.product!.image} alt="" width={240} height={240} sizes="140px" />
                  <span>{t.label}</span>
                </Link>
              ))}
            </div>
          </section>

          <nav className="shop-filters" aria-label="Filter by type">
            <Link href="/shop" className="shop-chip" aria-current={!active ? "page" : undefined} scroll={false}>All</Link>
            {PRODUCT_TYPES.map((t) => (
              <Link key={t.id} href={`/shop?type=${t.id}`} className="shop-chip" aria-current={active === t.id ? "page" : undefined} scroll={false}>
                {t.label}
              </Link>
            ))}
          </nav>
          <p className="shop-mono shop-count" aria-live="polite">
            {activeLabel ? `${activeLabel}: ${shown.length} item${shown.length === 1 ? "" : "s"}` : `All: ${shown.length} items`}
          </p>

          <div className="shop-grid" data-type={active ?? "all"}>
            {shown.map((p, i) => (
              <ProductCard key={p.slug} p={p} index={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
