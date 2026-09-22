"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { MySpacePrivacySection } from "@/components/MySpacePrivacySection";
import { isIosNativeApp, requestAppleSubscription } from "@/lib/appleIapClient";
import { isNativeAppShell } from "@/lib/nativeAppShell";
import { getBoard, unlockCtaLabel } from "@/lib/mySpaceProduct";
import { HUB_TIERS, type FeatureKey, type HubPlanId } from "@/lib/membershipTiers";
import type { HubMemberSlot } from "@/lib/hubMemberBridges";

type SpaceJson = {
  member?: { id?: string; status?: string };
  space?: {
    planLabel?: string;
    features?: Partial<Record<FeatureKey, boolean>>;
  };
};

export function HubMemberTools({
  slot,
  children,
}: {
  slot: HubMemberSlot;
  children: ReactNode;
}) {
  const [status, setStatus] = useState<"loading" | "visitor" | "locked" | "open">(
    "loading"
  );
  const [planLabel, setPlanLabel] = useState("Porch Waver");
  const [approved, setApproved] = useState(false);
  const [memberId, setMemberId] = useState<string | null>(null);
  const [native, setNative] = useState(false);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  const board = getBoard(slot.boardId);
  const need = HUB_TIERS.find((t) => t.rank === board.minRank) || HUB_TIERS[1];
  const cta = unlockCtaLabel(board.minRank);
  const hash = `#${slot.sectionId}`;
  const loginHref = `/yard-sale/login?next=${encodeURIComponent(slot.loginPath)}`;

  useEffect(() => {
    setNative(isNativeAppShell());
    let cancelled = false;
    fetch("/api/members/space", { cache: "no-store", credentials: "include" })
      .then(async (res) => {
        if (res.status === 401) {
          if (!cancelled) setStatus("visitor");
          return;
        }
        const json = (await res.json()) as SpaceJson;
        if (!res.ok || cancelled) return;
        setPlanLabel(json.space?.planLabel || "Porch Waver");
        setApproved(json.member?.status === "approved");
        setMemberId(json.member?.id ? String(json.member.id) : null);
        setStatus(json.space?.features?.[slot.feature] ? "open" : "locked");
      })
      .catch(() => {
        if (!cancelled) setStatus("visitor");
      });
    return () => {
      cancelled = true;
    };
  }, [slot.feature]);

  useEffect(() => {
    if (status === "loading") return;
    if (typeof window === "undefined") return;
    if (window.location.hash !== hash) return;
    const id = window.setTimeout(() => {
      document
        .getElementById(slot.sectionId)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
    return () => window.clearTimeout(id);
  }, [status, hash, slot.sectionId]);

  async function startSubscribe(tierId: HubPlanId) {
    setBusy(true);
    setNote(null);
    try {
      if (isIosNativeApp()) {
        await requestAppleSubscription(tierId);
        window.location.href = "/my-space?subscribed=1";
        return;
      }
      if (isNativeAppShell()) {
        throw new Error("Paid plans in the Android app are not on sale yet. The free tools on this phone still work.");
      }
      const res = await fetch("/api/members/subscribe", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier: tierId }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "Checkout failed");
      if (j.url) window.location.href = j.url;
    } catch (e) {
      setNote(e instanceof Error ? e.message : "Checkout failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="section hub-member-tools" id={slot.sectionId}>
      <div className="shell">
        <div className="section-head">
          <div>
            <h2>{slot.heading}</h2>
            <p>{slot.blurb}</p>
          </div>
        </div>

        {status === "loading" ? (
          <p className="panel-hint">Checking your membership…</p>
        ) : status === "open" ? (
          <MySpacePrivacySection
            board={slot.privacyBoard}
            extraBoards={slot.extraBoards}
            title={slot.heading}
            memberId={memberId}
          >
            {children}
          </MySpacePrivacySection>
        ) : (
          <div className="about-panel golf-scorecard-invite">
            <span className="pill">{need.shortLabel}+</span>
            <h3 style={{ margin: "0.4rem 0 0.35rem" }}>
              {board.icon} {slot.inviteLead}
            </h3>
            <p>
              {slot.publicStay} <strong>{need.label}</strong>
              {need.rank < 3 ? " (or higher)." : "."}
            </p>
            {status === "locked" ? (
              <p className="panel-hint">
                You’re on <strong>{planLabel}</strong>. {cta} to use the real
                tools on this same page — not a second button.
              </p>
            ) : (
              <p className="panel-hint">
                Sign in as a neighbor first. Porch Waver still gets the public
                page. Paid plans add the extra tools right here.
              </p>
            )}
            {note ? <p className="pf-form-error">{note}</p> : null}
            <div className="hero-actions">
              {status === "visitor" ? (
                <>
                  <Link href={loginHref} className="btn btn-primary btn-sm">
                    Sign in
                  </Link>
                  <Link href="/yard-sale/join" className="btn btn-ghost btn-sm">
                    Request membership
                  </Link>
                </>
              ) : native && !isIosNativeApp() ? (
                <p className="panel-hint" style={{ margin: 0 }}>
                  Paid plans in the Android app are not on sale yet. The free
                  tools on this phone still work.
                </p>
              ) : !approved ? (
                <p className="panel-hint" style={{ margin: 0 }}>
                  Your neighbor account must be approved before upgrading.
                </p>
              ) : (
                <>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    disabled={busy}
                    onClick={() => void startSubscribe(need.id)}
                  >
                    {busy ? "Starting…" : isIosNativeApp() ? `${cta} with Apple` : cta}
                  </button>
                  <Link href="/my-space?tab=plans" className="btn btn-ghost btn-sm">
                    See plans
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
