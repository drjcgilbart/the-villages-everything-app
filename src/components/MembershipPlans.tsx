"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { isNativeAppShell } from "@/lib/nativeAppShell";
import {
  HUB_TIERS,
  formatMembershipPrice,
  type HubPlanId,
} from "@/lib/membershipTiers";
import { TIER_SUMMARY } from "@/lib/mySpaceProduct";

type SpaceBrief = {
  plan: HubPlanId;
  planRank: number;
  planLabel: string;
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
        });
      })
      .catch(() => {
        /* visitor catalog still works */
      });
  }, []);

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
      {native ? (
        <p className="panel-hint">
          Membership isn’t sold in the store app. Subscribe at{" "}
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
              {t.rank > 0 && !included && !native && signedIn && approved ? (
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
