"use client";

import Link from "next/link";
import { isNativeAppShell } from "@/lib/nativeAppShell";

export type TrialOfferState = {
  signedIn: boolean;
  approved: boolean;
  trialAvailable: boolean;
  trialActive: boolean;
  trialExpiresAt: string | null;
  standingPlanLabel: string;
  native?: boolean;
  busy?: boolean;
  error?: string | null;
  onStart?: () => void;
};

function fmtWhen(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * One-month Square Royalty trial — request on the Hub (website or signed-in app).
 * After the month, access falls back to the standing paid plan or Porch Waver.
 */
export function RoyaltyTrialOffer(props: TrialOfferState) {
  const native = props.native ?? (typeof navigator !== "undefined" && isNativeAppShell());

  if (props.trialActive) {
    return (
      <div className="about-panel ms-trial-card is-on">
        <span className="pill">Free month · Square Royalty</span>
        <h3>You’re on the full lanai through {fmtWhen(props.trialExpiresAt)}</h3>
        <p>
          Every My Space board is unlocked — weather, money, health, pets, photos,
          the Royalty lounge, the works. This is the top tier, on the house.
        </p>
        <p className="panel-hint" style={{ marginBottom: 0 }}>
          On {fmtWhen(props.trialExpiresAt)} you roll back to{" "}
          <strong>{props.standingPlanLabel}</strong> unless you’ve subscribed.
          Subscribe any time this month and that plan is what you keep.
        </p>
      </div>
    );
  }

  if (props.signedIn && !props.trialAvailable && !props.trialActive) {
    return null;
  }

  return (
    <div className="about-panel ms-trial-card">
      <span className="pill">Try the whole buffet</span>
      <h3>One month of Square Royalty — free</h3>
      <p>
        See every private board before you spend a dollar. Request it once, poke
        around for 30 days, then keep a paid plan ($1 / $2 / $3) or go back to
        Porch Waver. No card required to start.
      </p>
      {props.error ? <p className="pf-form-error">{props.error}</p> : null}
      {!props.signedIn ? (
        <div className="hero-actions">
          <Link href="/yard-sale/login?next=/my-space" className="btn btn-primary">
            Sign in to start the free month
          </Link>
          <Link href="/yard-sale/join" className="btn btn-ghost">
            Request a neighbor account
          </Link>
        </div>
      ) : !props.approved ? (
        <p className="panel-hint" style={{ marginBottom: 0 }}>
          Once an admin approves your neighbor account, tap here for the free
          month.
        </p>
      ) : (
        <div className="hero-actions">
          <button
            type="button"
            className="btn btn-primary"
            disabled={props.busy}
            onClick={() => props.onStart?.()}
          >
            {props.busy ? "Starting…" : "Start my free Square Royalty month"}
          </button>
        </div>
      )}
      {native ? (
        <p className="panel-hint">
          The free month works in the app. If you later want to keep it, subscribe
          at <strong>thevillageseverythingapp.com</strong> (not in the store), then
          sign in here.
        </p>
      ) : null}
    </div>
  );
}
