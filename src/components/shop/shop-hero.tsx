import { ShopBar } from "./shop-bar";

export function ShopHero({ kicker, title, lede, mascot = true }: { kicker: string; title: string; lede?: React.ReactNode; mascot?: boolean }) {
  return (
    <div className="page-hero page-hero-graphic shop-hero">
      <div className="shell shop-hero-grid">
        <div>
          <span className="kicker">{kicker}</span>
          <h1>{title}</h1>
          {lede ? <p>{lede}</p> : null}
          <ShopBar />
        </div>
        {mascot ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="shop-hero-mascot" src="/shop/brand/cart-logo-badge.png" alt="The Villages Everything App golf-cart badge" width={220} height={220} />
        ) : null}
      </div>
    </div>
  );
}
