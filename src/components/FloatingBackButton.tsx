"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

/**
 * Fixed Back + Home controls on every page except home.
 * Back uses browser history when available; otherwise goes home.
 * Home always jumps straight to the site root.
 */
export function FloatingBackButton() {
  const pathname = usePathname();
  const router = useRouter();
  const [canShow, setCanShow] = useState(false);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    // Avoid flash on first paint for home; client-only for history checks
    setCanShow(Boolean(pathname && pathname !== "/"));
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goBack = useCallback(() => {
    if (typeof window === "undefined") return;
    // If there's meaningful in-app history, go back; else land on home
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  }, [router]);

  if (!canShow && !showTop) return null;

  return (
    <div className="floating-nav-stack" role="navigation" aria-label="Page navigation">
      {showTop ? (
        <button
          type="button"
          className="floating-back-btn"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top of page"
          title="Top"
        >
          <span className="floating-back-arrow" aria-hidden>
            ↑
          </span>
          <span className="floating-back-label">Top</span>
        </button>
      ) : null}
      {canShow ? (
        <>
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
      <Link
        href="/"
        className="floating-back-btn floating-home-btn"
        aria-label="Go to home page"
        title="Home"
      >
        <span className="floating-back-arrow" aria-hidden>
          ⌂
        </span>
        <span className="floating-back-label">Home</span>
      </Link>
        </>
      ) : null}
    </div>
  );
}
