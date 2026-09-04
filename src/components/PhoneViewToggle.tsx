"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * Top-bar phone preview. Render only for an authenticated admin (Header
 * already gates this). Hidden in store apps via .hide-in-native-app.
 */
export function PhoneViewToggle({ isAdmin = false }: { isAdmin?: boolean }) {
  const pathname = usePathname();
  const search = useSearchParams();

  if (!isAdmin) return null;
  if (pathname === "/phone-view") return null;

  const from = `${pathname}${search.toString() ? `?${search.toString()}` : ""}`;

  return (
    <Link
      href={`/phone-view?from=${encodeURIComponent(from)}`}
      className="local-dev-btn local-dev-phone hide-in-native-app"
      title="Preview this page at iPhone and Android sizes (admin only)"
    >
      Phone view
    </Link>
  );
}
