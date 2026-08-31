"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { isNativeAppShell } from "@/lib/nativeAppShell";
import {
  HUB_TIERS,
  formatHouseholdSeats,
  formatMembershipPrice,
  type HubPlanId,
} from "@/lib/membershipTiers";
import { TIER_SUMMARY } from "@/lib/mySpaceProduct";
import { RoyaltyTrialOffer } from "@/components/RoyaltyTrialOffer";

type SpaceBrief = {
  plan: HubPlanId;
  planRank: number;
  planLabel: string;
  trialAvailable?: boolean;
  trialActive?: boolean;
  trialExpiresAt?: string | null;
  standingPlanLabel?: string;
  householdRole?: "owner" | "member" | "none";
};

/**
 * Public membership catalog — Support page highlight.
 * Same $1 / $2 / $3 ladder as My Space unlocks.
 */
export function MembershipPlans() {
  const [space, setSpace] = useState<SpaceBrief | null>(null);
  const [approved, setApproved] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [busy, setBusy] = useState<HubPlanId | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [native, setNative] = useState(false);

  useEffect(() => {
    setNative(isNativeAppShell());
    fetch("/api/members/space", { cache: "no-store", credentials: "include" })
      .then((res) => {
        if (res.status === 401) {
          setSignedIn(false);
          return null;
        }
        return res.ok ? res.json() : null;
      })
      .then((json) => {
        if (!json?.space) return;
        setSignedIn(true);
        setApproved(json.member?.status === "approved");
        setSpace({
          plan: json.space.plan,
          planRank: json.space.planRank,
          planLabel: json.space.planLabel,
          trialAvailable: !!json.space.trialAvailable,
          trialActive: !!json.space.trialActive,
          trialExpiresAt: json.space.trialExpiresAt || null,
          standingPlanLabel: json.space.standingPlanLabel || json.space.planLabel,
          householdRole: json.space.household?.role || "owner",
        });
      })
      .catch(() => {
        /* visitor catalog still works */
      });
  }, []);

  async function startTrial() {
    setError(null);
    setBusy("square_royalty");
    try {
      const res = await fetch("/api/members/trial", {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not start the free month");
      window.location.href = "/my-space?trial=1";
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not start the free month");
    } finally {
      setBusy(null);
    }
  }

  async function startSubscribe(tierId: HubPlanId) {
    setError(null);
    setBusy(tierId);
    try {
      const res = await fetch("/api/members/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ tier: tierId }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || "Checkout failed");
      window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Checkout failed");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div>
      {error ? (
        <p className="pf-form-error" style={{ marginTop: 0 }}>
          {error}
        </p>
      ) : null}
      <RoyaltyTrialOffer
        signedIn={signedIn}
        approved={approved}
        trialAvailable={!!space?.trialAvailable}
        trialActive={!!space?.trialActive}
        trialExpiresAt={space?.trialExpiresAt || null}
        standingPlanLabel={space?.standingPlanLabel || "Porch Waver"}
        native={native}
        busy={busy === "square_royalty"}
        error={error}
        onStart={() => void startTrial()}
      />
      {native ? (
        <p className="panel-hint">
          Paid membership isn’t sold in the store app. Subscribe at{" "}
          <strong>thevillageseverythingapp.com</strong>, then sign in here.
        </p>
      ) : null}
      <div className="ms-tier-grid support-plan-grid">
        {HUB_TIERS.map((t) => {
          const current = signedIn && space?.plan === t.id;
          const included = signedIn && (space?.planRank ?? -1) >= t.rank;
          return (
            <article
              key={t.id}
              className={`about-panel ms-tier-card ${current ? "is-current" : ""} ${included ? "is-unlocked" : ""}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={t.badgeImage}
                alt={`${t.label} badge`}
                width={112}
                height={112}
                className="ms-tier-badge-img"
              />
              <span className="pill">
                {current ? "Your plan" : included ? "Included" : t.shortLabel}
              </span>
              <h3>{t.label}</h3>
              <p className="ms-tier-price">{formatMembershipPrice(t)}</p>
              <p className="ms-tier-seats">{formatHouseholdSeats(t.householdSeats)}</p>
              <p className="ms-tier-tagline">{t.tagline}</p>
              <p className="ms-tier-blurb">{TIER_SUMMARY[t.id].blurb}</p>
              <p className="panel-hint">{TIER_SUMMARY[t.id].includes}</p>
              {t.rank === 0 && !signedIn ? (
                <Link href="/yard-sale/join" className="btn btn-primary btn-sm">
                  Request free membership
                </Link>
              ) : null}
              {t.rank === 0 && signedIn ? (
                <p className="panel-hint" style={{ marginBottom: 0 }}>
                  You’re in as a neighbor. Upgrade below for the private lanai
                  boards.
                </p>
              ) : null}
              {t.rank > 0 &&
              !included &&
              !native &&
              signedIn &&
              approved &&
              space?.householdRole !== "member" ? (
                <button
                  type="button"
                  className="btn btn-primary btn-sm hide-in-native-app"
                  disabled={busy != null}
                  onClick={() => startSubscribe(t.id)}
                >
                  {busy === t.id
                    ? "Starting…"
                    : `Become ${t.label} · ${formatMembershipPrice(t)}`}
                </button>
              ) : null}
              {t.rank > 0 &&
              !included &&
              signedIn &&
              space?.householdRole === "member" ? (
                <p className="panel-hint" style={{ marginBottom: 0 }}>
                  Household members don’t buy a second plan. Leave the household
                  in My Space → Tiers first, or ask the paying neighbor to
                  upgrade.
                </p>
              ) : null}
              {t.rank > 0 && !included && signedIn && !approved ? (
                <p className="pf-form-error" style={{ marginBottom: 0 }}>
                  Your neighbor account must be approved before upgrading.
                </p>
              ) : null}
              {t.rank > 0 && !included && !signedIn ? (
                <Link
                  href="/yard-sale/login?next=/donate"
                  className="btn btn-ghost btn-sm"
                >
                  Sign in to subscribe
                </Link>
              ) : null}
            </article>
          );
        })}
      </div>
    </div>
  );
}
