import Link from "next/link";
import Image from "next/image";
import { type Product, formatPrice } from "@/lib/shop/catalog";

export function ProductCard({ p, index }: { p: Product; index: number }) {
  const sizes = p.variants.map((v) => v.size).filter((s, i, a) => s && a.indexOf(s) === i);
  const sizeNote = p.type === "badges" ? `${p.variants.length} themes \u00b7 3" x 1.5" magnetic` : p.type === "tees" ? "S–3XL" : sizes.length > 1 ? `${sizes.length} sizes` : sizes[0] ?? p.variants[0].label;
  return (
    <Link href={`/shop/${p.slug}`} className="shop-card">
      <Image src={p.image} alt={`${p.name} mockup`} width={800} height={800} sizes="(max-width: 760px) 100vw, 33vw" priority={index < 3} />
      <div className="shop-card-body">
        <p className="shop-mono">
          {sizeNote}
          {p.colors && p.colors.length > 1 ? ` · ${p.colors.length} colors` : ""}
        </p>
        <h2>{p.name}</h2>
        <div className="shop-row">
          <span className="shop-tag">{p.tagline}</span>
          <span className="shop-price">{p.priceNote ?? formatPrice(p.priceCents)}</span>
        </div>
      </div>
    </Link>
  );
}
