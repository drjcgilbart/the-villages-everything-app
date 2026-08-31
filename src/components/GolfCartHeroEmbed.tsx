"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * Full remaining-viewport embed of The Villages Golf Cart Hero (static Vite build).
 * Donate return query strings are forwarded once, then stripped from the hub URL.
 */
export function GolfCartHeroEmbed() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const srcRef = useRef<string | null>(null);

  if (srcRef.current == null) {
    const qs = searchParams.toString();
    srcRef.current = `/golf-cart-hero/index.html${qs ? `?${qs}` : ""}`;
  }

  useEffect(() => {
    document.documentElement.dataset.gchEmbed = "1";
    return () => {
      delete document.documentElement.dataset.gchEmbed;
    };
  }, []);

  useEffect(() => {
    if (searchParams.toString()) {
      window.history.replaceState({}, "", pathname || "/golf-cart-hero");
    }
  }, [pathname, searchParams]);

  return (
    <div className="gch-embed">
      <iframe
        ref={iframeRef}
        src={srcRef.current}
        title="The Villages Golf Cart Hero"
        allow="fullscreen; gamepad; accelerometer; gyroscope; payment; autoplay; xr-spatial-tracking"
        allowFullScreen
        onLoad={(e) => {
          e.currentTarget.contentWindow?.focus();
        }}
      />
    </div>
  );
}
