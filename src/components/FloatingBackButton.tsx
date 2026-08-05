"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

/**
 * Fixed back control on every page except home.
 * Uses browser history when available; otherwise returns to the hub home.
 */
export function FloatingBackButton() {
  const pathname = usePathname();
  const router = useRouter();
  const [canShow, setCanShow] = useState(false);

  useEffect(() => {
    // Avoid flash on first paint for home; client-only for history checks
    setCanShow(Boolean(pathname && pathname !== "/"));
  }, [pathname]);

  const goBack = useCallback(() => {
    if (typeof window === "undefined") return;
    // If there's meaningful in-app history, go back; else land on home
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  }, [router]);

  if (!canShow) return null;

  return (
    <button
      type="button"
      className="floating-back-btn"
      onClick={goBack}
      aria-label="Go back to previous page"
      title="Back"
    >
      <span className="floating-back-arrow" aria-hidden>
        ←
      </span>
      <span className="floating-back-label">Back</span>
    </button>
  );
}
