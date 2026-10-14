"use client";

import { useEffect, useRef, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { createPortal } from "react-dom";
import { HOLIDAY_LIGHTS_TERMS, HOLIDAY_LIGHTS_TERMS_HREF } from "@/lib/holidayLightsTerms";

function trapTab(event: ReactKeyboardEvent) {
  if (event.key !== "Tab") return;
  const root = event.currentTarget as HTMLElement;
  const items = [...root.querySelectorAll<HTMLElement>("a[href], button:not([disabled])")];
  if (!items.length) {
    event.preventDefault();
    return;
  }
  const first = items[0];
  const last = items[items.length - 1];
  const active = document.activeElement;
  if (event.shiftKey && (active === first || !root.contains(active))) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && active === last) {
    event.preventDefault();
    first.focus();
  }
}

export function HolidayLightsTermsGate({
  mode,
  busy = false,
  error = "",
  onAccept,
  onBack,
}: {
  mode: "checking" | "needed" | "reading";
  busy?: boolean;
  error?: string;
  onAccept?: () => void;
  onBack?: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const onBackRef = useRef(onBack);
  const reading = mode === "reading";
  const checking = mode === "checking";

  useEffect(() => {
    onBackRef.current = onBack;
  }, [onBack]);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focus = window.setTimeout(() => cardRef.current?.focus(), 0);
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      event.stopPropagation();
      if (reading) onBackRef.current?.();
    };
    window.addEventListener("keydown", onKey, true);
    return () => {
      document.body.style.overflow = previous;
      window.clearTimeout(focus);
      window.removeEventListener("keydown", onKey, true);
    };
  }, [reading]);

  if (typeof document === "undefined") return null;

  const dialog = (
    <div
      className="lt-pop-scrim lt-pop-front lt-terms-gate"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lt-terms-title"
      onKeyDown={trapTab}
    >
      <div className="lt-pop" ref={cardRef} tabIndex={-1}>
        {checking ? (
          <>
            <h3 id="lt-terms-title">Holiday Lights Tour</h3>
            <p className="lt-terms-copy" aria-live="polite">
              Checking your acceptance…
            </p>
          </>
        ) : (
          <>
            <h3 id="lt-terms-title">{reading ? "Holiday Lights terms" : "Before this tour"}</h3>
            <p className="lt-terms-copy">{HOLIDAY_LIGHTS_TERMS}</p>
            <p className="lt-terms-footlink">
              <a href={HOLIDAY_LIGHTS_TERMS_HREF}>Terms of Service</a>
            </p>
            {reading ? (
              <button type="button" className="btn btn-primary lt-go" onClick={onBack}>
                Back to the tour
              </button>
            ) : (
              <button type="button" className="btn btn-primary lt-go" disabled={busy} onClick={onAccept}>
                {busy ? "Saving…" : "Accept"}
              </button>
            )}
            {error ? (
              <p className="lt-error" role="alert">
                {error}
              </p>
            ) : null}
          </>
        )}
      </div>
    </div>
  );

  return createPortal(dialog, document.body);
}
