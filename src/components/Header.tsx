"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FavoriteSiteButton } from "@/components/FavoriteSiteButton";
import { HideMyDataToggle } from "@/components/HideMyDataToggle";
import { PhoneViewToggle } from "@/components/PhoneViewToggle";
import { MAIN_TOPICS, isMainTopicActive } from "@/lib/topics";
import { SITE_BRAND } from "@/lib/siteBrand";
import { isNativeAppShell } from "@/lib/nativeAppShell";
import { SiteSearch } from "@/components/SiteSearch";

type UtilityItem = {
  href: string;
  label: string;
  matchPrefixes?: string[];
};

/**
 * Utility bar (top thin strip): site-wide + personal/member areas.
 * My Space owns member login, favorites, dashboard, and yard-sale seller tools.
 * Membership is one Pages item: Support on the website (plans + tips + checkout),
 * Plans in the store app (Apple/Google: no in-app purchase on /donate).
 */
const UTILITY_NAV: UtilityItem[] = [
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
];

const WEB_MEMBERSHIP: UtilityItem = { href: "/donate", label: "Support" };
const NATIVE_MEMBERSHIP: UtilityItem = {
  href: "/my-space?tab=plans",
  label: "Plans",
};

/**
 * Three topic rows so every pill stays fully visible (Golf starts row 2).
 * Two nowrap rows clipped Best of the Month on typical desktop widths.
 */
const GOLF_SPLIT = MAIN_TOPICS.findIndex((t) => t.href === "/golf-zone");
const TOPICS_ROW_1 =
  GOLF_SPLIT >= 0 ? MAIN_TOPICS.slice(0, GOLF_SPLIT) : MAIN_TOPICS;
const AFTER_GOLF = GOLF_SPLIT >= 0 ? MAIN_TOPICS.slice(GOLF_SPLIT) : [];
const TOPICS_ROW_2 = AFTER_GOLF.slice(0, 7);
const TOPICS_ROW_3 = AFTER_GOLF.slice(7);

function displayName(full: string | null | undefined) {
  const n = String(full || "").trim();
  if (!n) return "Neighbor";
  const first = n.split(/\s+/)[0];
  return first.length > 18 ? `${first.slice(0, 16)}…` : first;
}

export function Header({
  isAdmin = false,
  signedIn = false,
  signedInName = null,
}: {
  isAdmin?: boolean;
  signedIn?: boolean;
  signedInName?: string | null;
}) {
  const pathname = usePathname();
  const isGamePage = pathname === "/golf-cart-hero";
  const [native, setNative] = useState(false);
  const [open, setOpen] = useState(false);
  const [scrolledAway, setScrolledAway] = useState(isGamePage);
  const [pagesOverride, setPagesOverride] = useState<"open" | "closed" | null>(
    null
  );
  const [hovering, setHovering] = useState(false);
  const scrolledAwayRef = useRef(isGamePage);

  const autoVisible = isGamePage ? hovering : !scrolledAway;
  const pillsVisible =
    pagesOverride === "open" || (pagesOverride !== "closed" && autoVisible);

  function togglePages() {
    setPagesOverride(pillsVisible ? "closed" : "open");
  }

  function toggleMobileMenu() {
    setOpen((v) => !v);
  }

  useEffect(() => {
    setNative(isNativeAppShell());
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    setPagesOverride(null);
    scrolledAwayRef.current = isGamePage;
    setScrolledAway(isGamePage);
  }, [pathname, isGamePage]);

  useEffect(() => {
    if (isGamePage) return;

    // Hide only after scrolling clearly away; show only when truly at the top.
    // One threshold caused a loop: showing the pills grows the header, which
    // changes scrollY, which hid them again, forever.
    const SHOW_BELOW = 8;
    const HIDE_AFTER = 160;
    const SETTLE_MS = 520;
    let frame = 0;
    let lockUntil = 0;

    const y = () => window.scrollY || document.documentElement.scrollTop || 0;

    const apply = (away: boolean) => {
      if (away === scrolledAwayRef.current) return;
      scrolledAwayRef.current = away;
      lockUntil = Date.now() + SETTLE_MS;
      setScrolledAway(away);
      // Leaving the top always auto-hides. Pages can open it again after that.
      if (away) setPagesOverride(null);
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        if (Date.now() < lockUntil) return;
        const top = y();
        if (top <= SHOW_BELOW) apply(false);
        else if (top >= HIDE_AFTER) apply(true);
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [isGamePage]);

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

  function isUtilityActive(item: UtilityItem) {
    const pathOnly = item.href.split("?")[0];
    const prefixes = item.matchPrefixes || [pathOnly];
    return prefixes.some((p) =>
      p === "/"
        ? pathname === "/"
        : pathname === p || pathname.startsWith(p + "/")
    );
  }

  const utilityItems = [
    ...UTILITY_NAV,
    native ? NATIVE_MEMBERSHIP : WEB_MEMBERSHIP,
  ];
  const showMenuHint = native && pathname === "/" && !open;

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
    <header
      className={`site-header hub-header${pillsVisible ? "" : " pills-collapsed"}${
        isGamePage && pillsVisible ? " pills-overlay" : ""
      }${open ? " hub-menu-open" : ""}`}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
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
            {utilityItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={isUtilityActive(item) ? "active" : ""}
              >
                {item.label}
              </Link>
            ))}
            {isAdmin || signedIn ? (
              <AccountMenu
                isAdmin={isAdmin}
                label={isAdmin ? "Admin" : displayName(signedInName)}
                adminActive={pathname === "/admin" || pathname.startsWith("/admin/")}
              />
            ) : (
              <Link
                href="/yard-sale/login"
                className={pathname === "/yard-sale/login" ? "active" : ""}
              >
                Sign in
              </Link>
            )}
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

          <SiteSearch />

          <button
            type="button"
            className="hub-pages-toggle"
            aria-expanded={pillsVisible}
            aria-controls="hub-topic-nav"
            onClick={togglePages}
          >
            Pages {pillsVisible ? "▴" : "▾"}
          </button>
          <div
            className={`nav-toggle-wrap${showMenuHint || open ? " is-hinting" : ""}`}
          >
            <button
              type="button"
              className={`nav-toggle${open ? " is-open" : ""}`}
              aria-expanded={open}
              aria-controls="hub-mobile-nav"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={toggleMobileMenu}
            >
              <span />
              <span />
              <span />
            </button>
            {showMenuHint ? (
              <p className="nav-first-hint">
                <span className="nav-first-hint-arrow" aria-hidden="true">
                  ←
                </span>
                <span className="nav-first-hint-text">CLICK HERE FIRST!</span>
              </p>
            ) : open ? (
              <p className="nav-first-hint nav-close-hint">
                <span className="nav-first-hint-arrow" aria-hidden="true">
                  ←
                </span>
                <span className="nav-first-hint-text">
                  Press Here to Close Hamburger Menu
                </span>
              </p>
            ) : null}
          </div>
        </div>

        {/* Desktop: three wrapping rows so pills never clip */}
        <nav
          id="hub-topic-nav"
          className="hub-header-pages"
          aria-label="Villages pages"
        >
          <div className="hub-topics-row">
            {TOPICS_ROW_1.map((item) => topicLink(item))}
          </div>
          {TOPICS_ROW_2.length > 0 && (
            <div className="hub-topics-row">
              {TOPICS_ROW_2.map((item) => topicLink(item))}
            </div>
          )}
          {TOPICS_ROW_3.length > 0 && (
            <div className="hub-topics-row">
              {TOPICS_ROW_3.map((item) => topicLink(item))}
            </div>
          )}
        </nav>

        {open ? (
          <button
            type="button"
            className="hub-mobile-nav-backdrop"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
        ) : null}

        <nav
          id="hub-mobile-nav"
          className={`main-nav hub-mobile-nav ${open ? "open" : ""}`}
          aria-label="Main"
        >
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

function AccountMenu({
  isAdmin,
  label,
  adminActive,
}: {
  isAdmin: boolean;
  label: string;
  adminActive: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, right: 0 });
  const box = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  function place() {
    const r = btn.current?.getBoundingClientRect();
    if (!r) return;
    setPos({
      top: Math.round(r.bottom + 6),
      right: Math.round(Math.max(8, window.innerWidth - r.right)),
    });
  }

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node;
      if (box.current?.contains(t) || panel.current?.contains(t)) return;
      setOpen(false);
    };
    const onReposition = () => {
      if (open) place();
    };
    document.addEventListener("mousedown", onDoc);
    window.addEventListener("resize", onReposition);
    window.addEventListener("scroll", onReposition, true);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      window.removeEventListener("resize", onReposition);
      window.removeEventListener("scroll", onReposition, true);
    };
  }, [open]);

  async function logout() {
    await fetch("/api/members/logout", { method: "POST" });
    if (isAdmin) await fetch("/api/auth", { method: "DELETE" });
    window.location.href = "/";
  }

  return (
    <div className="account-menu" ref={box}>
      <button
        ref={btn}
        type="button"
        className={`utility-studio account-menu-btn${adminActive ? " active" : ""}`}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => {
          place();
          setOpen((v) => !v);
        }}
      >
        {label} ▾
      </button>
      {open
        ? createPortal(
            <div
              ref={panel}
              className="account-menu-panel"
              role="menu"
              style={{ top: pos.top, right: pos.right }}
            >
              {isAdmin ? (
                <Link href="/admin" role="menuitem" onClick={() => setOpen(false)}>
                  Admin portal
                </Link>
              ) : null}
              <Link href="/my-space" role="menuitem" onClick={() => setOpen(false)}>
                My Space
              </Link>
              <button type="button" role="menuitem" onClick={() => void logout()}>
                Log out
              </button>
            </div>,
            document.body
          )
        : null}
    </div>
  );
}
