"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "./cart";

/** Small in-page bar for the shop section: All merch + Cart with a live count. */
export function ShopBar() {
  const { count, ready } = useCart();
  const path = usePathname();
  return (
    <nav className="shop-bar" aria-label="Shop">
      <Link href="/shop" className="shop-bar-link" aria-current={path === "/shop" ? "page" : undefined}>All merch</Link>
      <Link href="/shop/cart" className="shop-bar-link" aria-current={path === "/shop/cart" ? "page" : undefined}>
        Cart{ready && count > 0 ? <span className="shop-badge" aria-label={`${count} items`}>{count}</span> : null}
      </Link>
    </nav>
  );
}
