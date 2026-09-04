"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { FavoriteSiteButton } from "@/components/FavoriteSiteButton";
import { HideMyDataToggle } from "@/components/HideMyDataToggle";
import { PhoneViewToggle } from "@/components/PhoneViewToggle";
import { MAIN_TOPICS, isMainTopicActive } from "@/lib/topics";
import { SITE_BRAND } from "@/lib/siteBrand";

/**
 * Utility bar (top thin strip): site-wide + personal/member areas.
 * My Space owns member login, favorites, dashboard, and yard-sale seller tools.
 */
const UTILITY_NAV = [
  { href: "/", label: "Home" },
  {
    href: "/about",
    label: "My Retirement Reboot",
    matchPrefixes: ["/about", "/blog", "/photos", "/videos"],
  },
  {
    href: "/my-space",
    label: "My Space",
    matchPrefixes: [
      "/my-space",
      "/yard-sale/login",
      "/yard-sale/join",
      "/yard-sale/dashboard",
    ],
  },
  { href: "/my-space?tab=plans", label: "Plans" },
  { href: "/donate", label: "Support" },
];

/** Second topics row always starts with Golf. */
const GOLF_SPLIT = MAIN_TOPICS.findIndex((t) => t.href === "/golf-zone");
const TOPICS_ROW_1 =
  GOLF_SPLIT >= 0 ? MAIN_TOPICS.slice(0, GOLF_SPLIT) : MAIN_TOPICS;
const TOPICS_ROW_2 = GOLF_SPLIT >= 0 ? MAIN_TOPICS.slice(GOLF_SPLIT) : [];

export function Header({
  isAdmin = false,
  signedIn = false,
}: {
  isAdmin?: boolean;
  signedIn?: boolean;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash) return;
    const toTop = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };
    toTop();
    const frame = window.requestAnimationFrame(() => {
      toTop();
      window.requestAnimationFrame(toTop);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);

  function isUtilityActive(item: (typeof UTILITY_NAV)[number]) {
    const prefixes = item.matchPrefixes || [item.href];
    return prefixes.some((p) =>
      p === "/"
        ? pathname === "/"
        : pathname === p || pathname.startsWith(p + "/")
    );
  }

  function topicLink(item: (typeof MAIN_TOPICS)[number], opts?: { onClick?: () => void }) {
    return (
      <Link
        key={item.href}
        href={item.href}
        className={`hub-topic-btn${isMainTopicActive(pathname, item) ? " active" : ""}`}
        onClick={opts?.onClick}
      >
        <span className="hub-topic-icon" aria-hidden="true">
          {item.icon}
        </span>
        <span className="hub-topic-label">{item.label}</span>
      </Link>
    );
  }

  return (
    <header className="site-header hub-header">
      <div className="utility-bar">
        <div className="shell utility-bar-inner">
          {isAdmin ? (
            <Suspense fallback={null}>
              <div
                className="local-dev-tools"
                role="navigation"
                aria-label="Admin tools"
              >
                <PhoneViewToggle isAdmin={isAdmin} />
                <HideMyDataToggle isAdmin={isAdmin} />
              </div>
            </Suspense>
          ) : null}
          <FavoriteSiteButton />
          <nav className="utility-nav" aria-label="Site links">
            {UTILITY_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${isUtilityActive(item) ? "active" : ""}${
                  item.href === "/donate" ? " hide-in-native-app" : ""
                }`.trim()}
              >
                {item.label}
              </Link>
            ))}
            {isAdmin ? (
              <Link
                href="/admin"
                className={`utility-studio${pathname === "/admin" || pathname.startsWith("/admin/") ? " active" : ""}`}
              >
                Admin
              </Link>
            ) : null}
            {!signedIn ? (
              <Link
                href="/yard-sale/login"
                className={pathname === "/yard-sale/login" ? "active" : ""}
              >
                Sign in
              </Link>
            ) : null}
          </nav>
        </div>
      </div>

      <div className="shell header-inner hub-header-inner">
        <div className="hub-header-top">
          <Link href="/" scroll className="brand" onClick={() => setOpen(false)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/graphics/mascot-logo.jpg"
              alt=""
              className="brand-mark-img"
              width={46}
              height={46}
            />
            <span className="brand-text">
              <span className="brand-name">{SITE_BRAND.name}</span>
              <span className="brand-tag">{SITE_BRAND.brandTag}</span>
            </span>
          </Link>

          <button
            type="button"
            className="nav-toggle"
            aria-expanded={open}
            aria-label="Open menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        {/* Desktop only: exactly two lines; line 2 starts with Golf */}
        <nav className="hub-header-pages" aria-label="Villages pages">
          <div className="hub-topics-row">
            {TOPICS_ROW_1.map((item) => topicLink(item))}
          </div>
          {TOPICS_ROW_2.length > 0 && (
            <div className="hub-topics-row">
              {TOPICS_ROW_2.map((item) => topicLink(item))}
            </div>
          )}
        </nav>

        <nav
          className={`main-nav hub-mobile-nav ${open ? "open" : ""}`}
          aria-label="Main"
        >
          <p className="hub-mobile-intro">Where to first, cart pilot?</p>
          <div className="hub-mobile-links hub-mobile-main-topics">
            {MAIN_TOPICS.map((item) =>
              topicLink(item, { onClick: () => setOpen(false) })
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
