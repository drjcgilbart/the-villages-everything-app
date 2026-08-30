"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { isLocalPcBrowser, isPhoneViewIframe } from "@/lib/localDevHost";
import { isNativeAppShell } from "@/lib/nativeAppShell";

/** Local PC only: open the phone-sized layout simulator. */
export function PhoneViewToggle() {
  const pathname = usePathname();
  const search = useSearchParams();
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(
      isLocalPcBrowser() && !isPhoneViewIframe() && !isNativeAppShell()
    );
  }, []);

  if (!show || pathname === "/phone-view") return null;

  const from = `${pathname}${search.toString() ? `?${search.toString()}` : ""}`;

  return (
    <a
      href={`/phone-view?from=${encodeURIComponent(from)}`}
      className="phone-view-toggle"
    >
      Phone view
    </a>
  );
}
