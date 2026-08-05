"use client";

import { usePathname } from "next/navigation";
import { DonateMascot } from "@/components/DonateMascot";

/** Floating cup-of-Joe CTA — hidden on the donate flow itself. */
export function DonateMascotFloat() {
  const pathname = usePathname();
  if (pathname?.startsWith("/donate")) return null;
  return <DonateMascot variant="float" />;
}
