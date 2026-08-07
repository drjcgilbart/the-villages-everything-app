"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
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
  { href: "/donate", label: "Support" },
];

/** Second topics row always starts with Golf. */
const GOLF_SPLIT = MAIN_TOPICS.findIndex((t) => t.href === "/golf-zone");
const TOPICS_ROW_1 =
  GOLF_SPLIT >= 0 ? MAIN_TOPICS.slice(0, GOLF_SPLIT) : MAIN_TOPICS;
const TOPICS_ROW_2 = GOLF_SPLIT >= 0 ? MAIN_TOPICS.slice(GOLF_SPLIT) : [];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  function isUtilityActive(item: (typeof UTILITY_NAV)[number]) {
    const prefixes = item.matchPrefixes || [item.href];
    return prefixes.some((p) =>
      p === "/"
        ? pathname === "/"
        : pathname === p || pathname.startsWith(p + "/")
    );
  }

  function topicLink(item: (typeof MAIN_TOPICS)[number]) {
    return (
      <Link
        key={item.href}
        href={item.href}
        className={isMainTopicActive(pathname, item) ? "active" : ""}
      >
        {item.label}
      </Link>
    );
  }

  return (
    <header className="site-header hub-header">
      <div className="utility-bar">
        <div className="shell utility-bar-inner">
          <span className="utility-bar-label">Site</span>
          <nav className="utility-nav" aria-label="Site links">
            {UTILITY_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={isUtilityActive(item) ? "active" : ""}
              >
                {item.label}
              </Link>
            ))}
            <Link href="/studio" className="utility-studio">
              Studio
            </Link>
          </nav>
        </div>
      </div>

      <div className="shell header-inner hub-header-inner">
        <div className="hub-header-top">
          <Link href="/" className="brand" onClick={() => setOpen(false)}>
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
          <div className="hub-topics-row">{TOPICS_ROW_1.map(topicLink)}</div>
          {TOPICS_ROW_2.length > 0 && (
            <div className="hub-topics-row">{TOPICS_ROW_2.map(topicLink)}</div>
          )}
        </nav>

        <nav
          className={`main-nav hub-mobile-nav ${open ? "open" : ""}`}
          aria-label="Main"
        >
          <p className="hub-mobile-intro">Where to first, cart pilot?</p>
          <div className="hub-mobile-links hub-mobile-main-topics">
            {MAIN_TOPICS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={isMainTopicActive(pathname, item) ? "active" : ""}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}
