"use client";

import { usePathname } from "next/navigation";
import { DonateMascot } from "@/components/DonateMascot";

/** Floating cup-of-Joe CTA — hidden on the donate flow itself and in store apps. */
export function DonateMascotFloat() {
  const pathname = usePathname();
  if (pathname?.startsWith("/donate")) return null;
  return (
    <span className="hide-in-native-app">
      <DonateMascot variant="float" />
    </span>
  );
}
