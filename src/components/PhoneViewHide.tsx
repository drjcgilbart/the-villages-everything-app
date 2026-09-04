"use client";

import { usePathname } from "next/navigation";

/** Hides desktop chrome on the Phone view page. Does not import server modules. */
export function PhoneViewHide({
  children,
  extra = [],
}: {
  children: React.ReactNode;
  extra?: string[];
}) {
  const pathname = usePathname();
  if (pathname === "/phone-view") return null;
  if (extra.includes(pathname)) return null;
  return <>{children}</>;
}
