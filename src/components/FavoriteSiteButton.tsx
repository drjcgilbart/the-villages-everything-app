"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { isNativeAppShell } from "@/lib/nativeAppShell";
import {
  getDeferredInstall,
  isStandaloneApp,
  subscribeInstallPrompt,
  type BeforeInstallPromptEvent,
} from "@/lib/pwaInstall";
import { SITE_BRAND } from "@/lib/siteBrand";

type BrowserKind = "chrome" | "edge" | "safari" | "firefox" | "samsung" | "other";

type ClientEnv = {
  kind: BrowserKind;
  browserName: string;
  bookmarkWord: "bookmark" | "favorite";
  barName: string;
  keyCombo: string;
  isMobile: boolean;
  isIOS: boolean;
};

function liveSiteUrl(): string {
  return SITE_BRAND.url.replace(/\/$/, "");
}

function detectEnv(): ClientEnv {
  const ua = navigator.userAgent;
  const platform = navigator.platform || "";
  const isIOS =
    /iPhone|iPad|iPod/.test(ua) ||
    (platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const isAndroid = /Android/.test(ua);
  const isMobile =
    isIOS || isAndroid || window.matchMedia("(pointer: coarse)").matches;
  const isMac = /Mac/.test(platform) && !isIOS;
  const isEdge = /Edg\//.test(ua);
  const isSamsung = /SamsungBrowser/.test(ua);
  const isFirefox = /Firefox\//.test(ua);
  const isChrome =
    /Chrome\//.test(ua) && !isEdge && !isSamsung && !/OPR\//.test(ua);
  const isSafari = /Safari\//.test(ua) && !isChrome && !isEdge && !isFirefox;

  let kind: BrowserKind = "other";
  if (isEdge) kind = "edge";
  else if (isSamsung) kind = "samsung";
  else if (isFirefox) kind = "firefox";
  else if (isChrome) kind = "chrome";
  else if (isSafari) kind = "safari";

  const names: Record<BrowserKind, string> = {
    chrome: "Google Chrome",
    edge: "Microsoft Edge",
    safari: "Safari",
    firefox: "Firefox",
    samsung: "Samsung Internet",
    other: "this browser",
  };

  const usesFavorite = kind === "edge" || kind === "safari";

  return {
    kind,
    browserName: names[kind],
    bookmarkWord: usesFavorite ? "favorite" : "bookmark",
    barName:
      kind === "edge"
        ? "Favorites bar"
        : kind === "safari"
          ? "Favorites bar"
          : kind === "firefox"
            ? "Bookmarks toolbar"
            : "Bookmarks bar",
    keyCombo: isMac || isIOS ? "⌘ Command + D" : "Ctrl + D",
    isMobile,
    isIOS,
  };
}

function favoriteSteps(env: ClientEnv): string[] {
  if (env.isIOS) {
    return [
      "Tap the Share button (square with an arrow pointing up).",
      "Tap Add Bookmark, then tap Save.",
    ];
  }
  if (env.isMobile) {
    return [
      "Tap the star on the right side of the address bar.",
      "Tap Done.",
    ];
  }
  if (env.kind === "safari") {
    return [
      "Click Bookmarks at the top of the screen, then Add Bookmark.",
      "Click Add.",
    ];
  }
  return [
    `Look at the top-right of this window and click the star.`,
    `Click Done. This site is now on your ${env.barName}.`,
  ];
}

function desktopSteps(env: ClientEnv): string[] {
  if (env.kind === "edge") {
    return [
      "Click the three dots ⋯ at the top right of this window.",
      "Click Apps, then click Install this site as an app.",
      "Click Install.",
      "Look on your Desktop for The Villages Everything App and double-click it.",
    ];
  }
  return [
    "Click the three dots ⋮ at the top right of this window.",
    "Click Cast, save, and share.",
    "Click Create shortcut…",
    "Click Create.",
    "Look on your Desktop for The Villages Everything App and double-click it.",
  ];
}

export function FavoriteSiteButton() {
  const titleId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [env, setEnv] = useState<ClientEnv | null>(null);
  const [busy, setBusy] = useState(false);
  const [hideInApp, setHideInApp] = useState(false);
  const [installEvent, setInstallEvent] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [alreadyApp, setAlreadyApp] = useState(false);
  const [installNote, setInstallNote] = useState("");

  useEffect(() => {
    setHideInApp(isNativeAppShell());
    setEnv(detectEnv());
    setAlreadyApp(isStandaloneApp());
    setInstallEvent(getDeferredInstall());
    return subscribeInstallPrompt(setInstallEvent);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    setBusy(false);
    setInstallNote("");
    window.setTimeout(() => triggerRef.current?.focus(), 0);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  function openDialog() {
    setEnv(detectEnv());
    setAlreadyApp(isStandaloneApp());
    setInstallNote("");
    setOpen(true);
  }

  async function onInstallApp() {
    if (!installEvent) return;
    setBusy(true);
    try {
      await installEvent.prompt();
      const choice = await installEvent.userChoice;
      setInstallNote(
        choice.outcome === "accepted"
          ? "Done. Look on your Desktop for the golf-ball icon."
          : "No problem — you can use the star steps above instead."
      );
    } catch {
      setInstallNote("Use the Create shortcut steps below.");
    }
    setBusy(false);
  }

  if (hideInApp) return null;

  const showDesktopHelp = Boolean(env && !env.isMobile);

  const dialog =
    open && env
      ? createPortal(
          <div
            className="fav-site-overlay"
            role="presentation"
            onClick={(e) => {
              if (e.target === e.currentTarget) close();
            }}
          >
            <div
              className="fav-site-dialog"
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
            >
              <div className="fav-site-dialog-head">
                <div>
                  <p className="fav-site-kicker">★ Easy next time</p>
                  <h2 id={titleId}>Favorite this site</h2>
                </div>
                <button
                  ref={closeRef}
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={close}
                >
                  Close
                </button>
              </div>

              {alreadyApp ? (
                <p className="fav-site-lead">
                  This is already an app on this computer. At the top right,
                  click <strong>Open in app</strong> — or look on your Desktop
                  for the golf-ball icon.
                </p>
              ) : (
                <>
                  <p className="fav-site-lead">
                    Easiest way in {env.browserName}:
                  </p>
                  <ol className="fav-site-steps">
                    {favoriteSteps(env).map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>

                  {!env.isMobile && (
                    <>
                      <p className="fav-site-note">
                        Faster: press <strong>{env.keyCombo}</strong>, then
                        click Done.
                      </p>
                      <a
                        className="fav-site-drag"
                        href={liveSiteUrl()}
                        title={SITE_BRAND.name}
                      >
                        ★ {SITE_BRAND.name}
                      </a>
                      <p className="fav-site-note">
                        If you already see the {env.barName}, you can also drag
                        this gold box up onto that bar.
                      </p>
                    </>
                  )}
                </>
              )}

              {showDesktopHelp && !alreadyApp && (
                <>
                  <p className="fav-site-or">Want it on your Desktop too?</p>
                  {installEvent ? (
                    <button
                      type="button"
                      className="btn btn-primary fav-site-action"
                      onClick={onInstallApp}
                      disabled={busy}
                    >
                      {busy ? "Working…" : "★ Add it to my Desktop"}
                    </button>
                  ) : null}
                  <ol className="fav-site-steps">
                    {desktopSteps(env).map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                  {installNote ? (
                    <p className="fav-site-note">{installNote}</p>
                  ) : null}
                </>
              )}
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="fav-site-btn"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={openDialog}
      >
        <span className="fav-site-btn-star" aria-hidden>
          ★
        </span>
        <span className="fav-site-btn-label">Favorite this site!</span>
      </button>
      {dialog}
    </>
  );
}
