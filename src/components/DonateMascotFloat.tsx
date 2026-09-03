"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { DonateMascot } from "@/components/DonateMascot";
import { isNativeAppShell } from "@/lib/nativeAppShell";

function supporterFromSpace(space: {
  planRank?: number;
  donationBadges?: string[];
  goldenLoofah?: boolean;
  isSubscriber?: boolean;
} | null): boolean {
  if (!space) return false;
  if (space.isSubscriber) return true;
  if ((space.planRank ?? 0) >= 1) return true;
  if (space.goldenLoofah) return true;
  if (Array.isArray(space.donationBadges) && space.donationBadges.length > 0) {
    return true;
  }
  return false;
}

/**
 * Bottom-left mascot on every screen except Support/donate.
 * Broke art until the signed-in neighbor has a paid plan or a tip.
 * Store apps open Plans (no in-app checkout). Website still opens Support.
 */
export function DonateMascotFloat() {
  const pathname = usePathname();
  const [broke, setBroke] = useState(true);
  const [native, setNative] = useState(false);

  useEffect(() => {
    setNative(isNativeAppShell());
    let cancelled = false;
    fetch("/api/members/me", { cache: "no-store", credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled) return;
        setBroke(!supporterFromSpace(data?.space || null));
      })
      .catch(() => {
        if (!cancelled) setBroke(true);
      });
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  if (pathname?.startsWith("/donate")) return null;

  return (
    <DonateMascot
      variant="float"
      broke={broke}
      href={native ? "/my-space?tab=plans" : "/donate"}
    />
  );
}
