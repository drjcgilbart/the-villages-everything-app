"use client";

import { useEffect, useRef, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
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
  notice = "",
  accountName = "",
  accountEmail = "",
  onAccept,
  onSendEmail,
  onBack,
  inline = false,
}: {
  mode: "checking" | "signin" | "blocked" | "confirm" | "needed" | "reading";
  busy?: boolean;
  error?: string;
  notice?: string;
  accountName?: string;
  accountEmail?: string;
  onAccept?: () => void;
  onSendEmail?: () => void;
  onBack?: () => void;
  /** On the tour page, so adding a house stays usable underneath. */
  inline?: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const onBackRef = useRef(onBack);
  const reading = mode === "reading";
  const checking = mode === "checking";

  useEffect(() => {
    onBackRef.current = onBack;
  }, [onBack]);

  useEffect(() => {
    if (inline) return;
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
  }, [reading, inline]);

  const copy = checking ? (
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
      ) : mode === "signin" ? (
        <>
          <p className="lt-terms-account">
            Sign in with a membership. The free plan is enough. The acceptance is saved under that account’s name and email, and that unlocks the route and the printout.
          </p>
          <Link className="btn btn-primary lt-go" href="/yard-sale/login?next=/tour">
            Sign in to build a route
          </Link>
        </>
      ) : mode === "blocked" ? (
        <>
          <p className="lt-terms-account">This membership is not active, so the route and the printout stay closed.</p>
          <Link className="btn btn-primary lt-go" href="/yard-sale/login?next=/tour">
            Use a different sign-in
          </Link>
        </>
      ) : mode === "confirm" ? (
        <>
          <p className="lt-terms-account">
            Confirm {accountEmail || "the email on your membership"}. Open the link and press Confirm my email. Then
            come back here and tap Accept. The warning is saved only after that inbox is confirmed.
          </p>
          <button type="button" className="btn btn-primary lt-go" disabled={busy} onClick={onSendEmail}>
            {busy ? "Sending…" : "Send the confirmation email"}
          </button>
          {notice ? <p className="panel-hint">{notice}</p> : null}
        </>
      ) : (
        <>
          <p className="lt-terms-account">
            Saved under the name and email on your membership. You do not type a separate name.
          </p>
          {accountName ? <p className="lt-terms-who">{accountName}</p> : null}
          {accountEmail ? <p className="lt-terms-who">{accountEmail}</p> : null}
          <button type="button" className="btn btn-primary lt-go" disabled={busy} onClick={onAccept}>
            {busy ? "Saving…" : "Accept"}
          </button>
        </>
      )}
      {error ? (
        <p className="lt-error" role="alert">
          {error}
        </p>
      ) : null}
    </>
  );

  if (inline) return <div className="about-panel lt-card lt-terms-inline">{copy}</div>;
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
        {copy}
      </div>
    </div>
  );

  return createPortal(dialog, document.body);
}
