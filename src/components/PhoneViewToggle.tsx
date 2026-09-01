"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { shouldShowLocalDevTools } from "@/lib/localDevHost";
import { isNativeAppShell } from "@/lib/nativeAppShell";

function subscribe() {
  return () => {};
}

function localDevSnapshot() {
  return shouldShowLocalDevTools() && !isNativeAppShell();
}

function serverSnapshot() {
  return false;
}

/**
 * Local PC only: Admin + Phone view in the top bar.
 * Hidden on the live website and inside the iOS / Android store apps.
 */
export function PhoneViewToggle() {
  const pathname = usePathname();
  const search = useSearchParams();
  const show = useSyncExternalStore(subscribe, localDevSnapshot, serverSnapshot);

  if (!show) return null;

  const from = `${pathname}${search.toString() ? `?${search.toString()}` : ""}`;
  const adminActive = pathname === "/admin" || pathname.startsWith("/admin/");
  const onPhoneStudio = pathname === "/phone-view";

  return (
    <div className="local-dev-tools hide-in-native-app" role="navigation" aria-label="Local PC tools">
      <Link
        href="/admin"
        className={`local-dev-btn local-dev-admin${adminActive ? " active" : ""}`}
        title="Local only — not on the live site or store apps"
      >
        Admin
      </Link>
      {onPhoneStudio ? null : (
        <Link
          href={`/phone-view?from=${encodeURIComponent(from)}`}
          className="local-dev-btn local-dev-phone"
          title="Local only — preview iPhone and Android sizes"
        >
          Phone view
        </Link>
      )}
    </div>
  );
}
