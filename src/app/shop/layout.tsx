import Link from "next/link";
import "./shop.css";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="shop">
      {children}
      <div className="shell shop-foot">
        <p className="shop-fine shop-policy-links">
          <Link href="/shop/returns">Returns and refunds</Link> · <Link href="/privacy">Privacy</Link> ·{" "}
          <a href="mailto:admin@thevillageseverythingapp.com">admin@thevillageseverythingapp.com</a>
        </p>
        <p className="shop-fine">
          Neighbor-made merch from The Villages Everything App. Not affiliated with, endorsed by, or sponsored by The
          Villages or its developers. Printed on demand and shipped by our print partner.
        </p>
      </div>
    </div>
  );
}
