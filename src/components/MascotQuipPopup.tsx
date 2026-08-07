"use client";

import { useCallback, useEffect, useState } from "react";
import {
  pickVillagerQuip,
  quipKindLabel,
  type VillagerQuip,
} from "@/lib/villagerQuips";

const PREF_KEY = "tvh-mascot-quips-enabled";
const RECENT_KEY = "tvh-mascot-quips-recent";
/** First appearance shortly after landing so visitors discover the feature. */
const FIRST_DELAY_MS = 45_000;
/** Recurring interval while the tab stays open. */
const INTERVAL_MS = 5 * 60 * 1000;
const DISPLAY_MS = 22_000;
const MAX_RECENT = 12;

function readEnabled(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const raw = localStorage.getItem(PREF_KEY);
    if (raw === null) return true; // default on
    return raw === "1" || raw === "true";
  } catch {
    return true;
  }
}

function writeEnabled(on: boolean) {
  try {
    localStorage.setItem(PREF_KEY, on ? "1" : "0");
  } catch {
    /* private mode */
  }
}

function readRecent(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    if (!raw) return [];
    const p = JSON.parse(raw) as unknown;
    return Array.isArray(p) ? p.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function pushRecent(id: string) {
  try {
    const next = [id, ...readRecent().filter((x) => x !== id)].slice(
      0,
      MAX_RECENT
    );
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
}

/**
 * Golf-ball mascot pops up every 5 minutes with a PG Villager quip.
 * Preference stored in localStorage; toggle always available.
 */
export function MascotQuipPopup() {
  const [enabled, setEnabled] = useState(true);
  const [hydrated, setHydrated] = useState(false);
  const [open, setOpen] = useState(false);
  const [quip, setQuip] = useState<VillagerQuip | null>(null);

  useEffect(() => {
    setEnabled(readEnabled());
    setHydrated(true);
  }, []);

  const showQuip = useCallback(() => {
    if (!readEnabled()) return;
    // Don’t interrupt if the tab is hidden
    if (typeof document !== "undefined" && document.hidden) return;
    const next = pickVillagerQuip(readRecent());
    pushRecent(next.id);
    setQuip(next);
    setOpen(true);
  }, []);

  // Timer: first after 45s, then every 5 minutes while enabled
  useEffect(() => {
    if (!hydrated || !enabled) {
      setOpen(false);
      return;
    }

    let intervalId: ReturnType<typeof setInterval> | null = null;
    const firstId = setTimeout(() => {
      showQuip();
      intervalId = setInterval(showQuip, INTERVAL_MS);
    }, FIRST_DELAY_MS);

    return () => {
      clearTimeout(firstId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [hydrated, enabled, showQuip]);

  // Auto-dismiss after a while
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => setOpen(false), DISPLAY_MS);
    return () => clearTimeout(t);
  }, [open, quip?.id]);

  function toggleEnabled() {
    const next = !enabled;
    writeEnabled(next);
    setEnabled(next);
    if (!next) setOpen(false);
  }

  function dismiss() {
    setOpen(false);
  }

  if (!hydrated) return null;

  return (
    <>
      {/* Always-available preference control */}
      <button
        type="button"
        className={`mascot-quip-toggle${enabled ? " is-on" : ""}`}
        onClick={toggleEnabled}
        aria-pressed={enabled}
        title={
          enabled
            ? "Golf ball quips are on — click to turn off"
            : "Golf ball quips are off — click to turn on"
        }
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/graphics/mascot-logo.jpg"
          alt=""
          width={28}
          height={28}
          className="mascot-quip-toggle-img"
        />
        <span className="mascot-quip-toggle-label">
          Quips {enabled ? "On" : "Off"}
        </span>
      </button>

      {open && quip && enabled && (
        <div
          className="mascot-quip-popup"
          role="dialog"
          aria-label="Golf ball mascot tip"
        >
          <div className="mascot-quip-popup-inner">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/graphics/mascot-logo.jpg"
              alt=""
              width={72}
              height={72}
              className="mascot-quip-popup-img"
            />
            <div className="mascot-quip-popup-body">
              <div className="mascot-quip-popup-meta">
                <span className="pill mascot-quip-kind">
                  {quipKindLabel(quip.kind)}
                </span>
                <span className="mascot-quip-from">Golf ball says…</span>
              </div>
              <p className="mascot-quip-text">{quip.text}</p>
              <div className="mascot-quip-actions">
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={dismiss}
                >
                  Ha — dismiss
                </button>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => {
                    writeEnabled(false);
                    setEnabled(false);
                    setOpen(false);
                  }}
                >
                  Turn quips off
                </button>
              </div>
            </div>
            <button
              type="button"
              className="mascot-quip-close"
              onClick={dismiss}
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
}
