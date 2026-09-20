"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MySpaceGolfLogBoard } from "@/components/MySpaceGolfLogBoard";
import { isNativeAppShell } from "@/lib/nativeAppShell";
import { getBoard, unlockCtaLabel } from "@/lib/mySpaceProduct";
import { HUB_TIERS, type HubPlanId } from "@/lib/membershipTiers";

type SpaceJson = {
  member?: { id?: string; status?: string };
  space?: {
    planLabel?: string;
    planRank?: number;
    features?: { golfLog?: boolean };
  };
};

export function GolfHubMemberTools() {
  const [status, setStatus] = useState<"loading" | "visitor" | "locked" | "open">(
    "loading"
  );
  const [planLabel, setPlanLabel] = useState("Porch Waver");
  const [approved, setApproved] = useState(false);
  const [native, setNative] = useState(false);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  const board = getBoard("golfLog");
  const need = HUB_TIERS.find((t) => t.rank === board.minRank) || HUB_TIERS[2];
  const cta = unlockCtaLabel(board.minRank);

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
        setStatus(json.space?.features?.golfLog ? "open" : "locked");
      })
      .catch(() => {
        if (!cancelled) setStatus("visitor");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (status === "loading") return;
    if (typeof window === "undefined") return;
    if (window.location.hash !== "#my-scorecard") return;
    const id = window.setTimeout(() => {
      document
        .getElementById("my-scorecard")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
    return () => window.clearTimeout(id);
  }, [status]);

  async function startSubscribe(tierId: HubPlanId) {
    setBusy(true);
    setNote(null);
    try {
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
    <section className="section golf-member-tools" id="my-scorecard">
      <div className="shell">
        <div className="section-head">
          <div>
            <h2>Your live scorecard</h2>
            <p>
              Hole-by-hole scores on this phone. Maps, the Leader Board, and
              holes-in-one below stay free for everyone.
            </p>
          </div>
        </div>

        {status === "loading" ? (
          <p className="panel-hint">Checking your membership…</p>
        ) : status === "open" ? (
          <MySpaceGolfLogBoard />
        ) : (
          <div className="about-panel golf-scorecard-invite">
            <span className="pill">Lanai Legend+</span>
            <h3 style={{ margin: "0.4rem 0 0.35rem" }}>
              {board.icon} Keep score here after you unlock
            </h3>
            <p>
              One Golf page for everyone. The trail, maps, and aces stay free.
              The live scorecard, tee times, and round history unlock with{" "}
              <strong>{need.label}</strong> (or Square Royalty).
            </p>
            {status === "locked" ? (
              <p className="panel-hint">
                You’re on <strong>{planLabel}</strong>. {cta} to use the real
                scorecard on this same page — not a second Golf button.
              </p>
            ) : (
              <p className="panel-hint">
                Sign in as a neighbor first. Porch Waver still gets public Golf.
                Paid plans add the scorecard right here.
              </p>
            )}
            {note ? <p className="pf-form-error">{note}</p> : null}
            <div className="hero-actions">
              {status === "visitor" ? (
                <>
                  <Link
                    href="/yard-sale/login?next=/golf-zone%23my-scorecard"
                    className="btn btn-primary btn-sm"
                  >
                    Sign in
                  </Link>
                  <Link href="/yard-sale/join" className="btn btn-ghost btn-sm">
                    Request membership
                  </Link>
                </>
              ) : native ? (
                <p className="panel-hint" style={{ margin: 0 }}>
                  Membership isn’t sold in the store app. Subscribe at{" "}
                  <strong>thevillageseverythingapp.com</strong>, then sign in
                  here.
                </p>
              ) : !approved ? (
                <p className="panel-hint" style={{ margin: 0 }}>
                  Your neighbor account must be approved before upgrading.
                </p>
              ) : (
                <>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm hide-in-native-app"
                    disabled={busy}
                    onClick={() => void startSubscribe(need.id)}
                  >
                    {busy ? "Starting…" : cta}
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
