import type { Metadata } from "next";
import Link from "next/link";
import { PRODUCTS, getProduct } from "@/lib/shop/catalog";
import { BADGE_SIZES } from "@/lib/shop/badges";
import { ShopBar } from "@/components/shop/shop-bar";
import { BadgeBuilder, ReadyBadges } from "@/components/shop/badge-builder";

const product = getProduct("custom-name-badge")!;

export const metadata: Metadata = {
  title: "Custom Name Badge \u00b7 Shop",
  description: "A 3\" x 1.5\" magnetic name badge with your name (and your village) in one of seven Villages themes. $16 each, 2 for $28.",
  alternates: { canonical: "/shop/custom-name-badge" },
  openGraph: { images: [product.image] },
};

export default function CustomNameBadgePage() {
  const ready = PRODUCTS.filter((p) => p.badge?.kind === "ready");
  return (
    <section className="section shop-pdp badge-page">
      <div className="shell">
        <div className="shop-pdp-top">
          <Link href="/shop" className="shop-back">← All merch</Link>
          <ShopBar />
        </div>
        <div className="shop-pdp-head">
          <span className="kicker">{product.tagline}</span>
          <h1 className="shop-ptitle">{product.name}</h1>
          <p className="shop-lede">{product.description}</p>
        </div>
        <BadgeBuilder />

        <section className="badge-ready" id="ready-made" aria-labelledby="ready-made-h">
          <p className="shop-mono">Ready-made &middot; nothing to type</p>
          <h2 id="ready-made-h">Ready-made name badges</h2>
          <p className="shop-tag">
            Finished Edenfield designs in the larger {BADGE_SIZES.ready.label} size. Same price, and they count toward 2 for $28 with custom badges.
          </p>
          <ReadyBadges products={ready} />
        </section>
        <p className="shop-note">Made to order by hand &middot; ships in about 5&ndash;7 business days plus shipping</p>
      </div>
    </section>
  );
}
