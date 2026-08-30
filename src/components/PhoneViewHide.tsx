"use client";

import { usePathname } from "next/navigation";

/** Hides desktop chrome on the local Phone view page. Does not import server modules. */
export function PhoneViewHide({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/phone-view") return null;
  return <>{children}</>;
}
