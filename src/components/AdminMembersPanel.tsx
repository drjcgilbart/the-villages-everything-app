"use client";

import { useCallback, useEffect, useState } from "react";
import type { PublicMember } from "@/lib/yardSaleTypes";
import { formatDate } from "@/lib/format";
import type { HubPlanId } from "@/lib/membershipTiers";
import { MemberBadgesRow } from "@/components/MemberBadgesRow";
import type { BadgeDef } from "@/lib/memberBadgeTypes";

type TopTierNom = {
  status: "pending" | "approved" | "rejected";
  source: string;
  requestedAt: string;
  proposedExpiresAt: string;
  decidedAt?: string | null;
};

type AdminMember = PublicMember & {
  plan?: HubPlanId | string;
  planLabel?: string;
  planExpiresAt?: string | null;
  goldenLoofah?: boolean;
  badges?: BadgeDef[];
  topTierNomination?: TopTierNom | null;
};

type TierOpt = { id: string; label: string; shortLabel: string; rank: number };

export function AdminMembersPanel() {
  const [members, setMembers] = useState<AdminMember[]>([]);
  const [tiers, setTiers] = useState<TierOpt[]>([]);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(
    null
  );
  const [busy, setBusy] = useState(false);
  const [durableHint, setDurableHint] = useState<string | null>(null);

  const flash = (kind: "ok" | "err", text: string) => {
    setMsg({ kind, text });
    setTimeout(() => setMsg(null), 4000);
  };

  const load = useCallback(async () => {
    const res = await fetch("/api/members/admin", { cache: "no-store" });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Could not load members");
    setMembers(data.members || []);
    setTiers(data.tiers || []);
    setDurableHint(
      typeof data.durableHint === "string" ? data.durableHint : null
    );
  }, []);

  useEffect(() => {
    load().catch((err) => flash("err", err.message || "Load failed"));
  }, [load]);

  async function setMemberStatus(id: string, status: string) {
    setBusy(true);
    try {
      const res = await fetch("/api/members/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");
      setMembers(data.members || []);
      flash("ok", `Member ${status}`);
    } catch (err) {
      flash("err", err instanceof Error ? err.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  async function setMemberPlan(id: string, plan: string) {
    setBusy(true);
    try {
      const res = await fetch("/api/members/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "setPlan", id, plan }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Plan update failed");
      if (Array.isArray(data.members)) setMembers(data.members);
      else await load();
      flash("ok", `Plan set to ${data.planLabel || plan}`);
    } catch (err) {
      flash("err", err instanceof Error ? err.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  async function toggleGoldenLoofah(id: string, next: boolean) {
    setBusy(true);
    try {
      const res = await fetch("/api/members/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "setGoldenLoofah",
          id,
          goldenLoofah: next,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not update Golden Loofah");
      if (Array.isArray(data.members)) setMembers(data.members);
      else await load();
      flash("ok", next ? "Golden Loofah granted" : "Golden Loofah removed");
    } catch (err) {
      flash("err", err instanceof Error ? err.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  async function topTierAction(id: string, action: "approveTopTier" | "rejectTopTier") {
    setBusy(true);
    try {
      const res = await fetch("/api/members/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");
      if (Array.isArray(data.members)) setMembers(data.members);
      else await load();
      flash(
        "ok",
        action === "approveTopTier"
          ? "Square Royalty approved for 1 year"
          : "Top-tier nomination rejected"
      );
    } catch (err) {
      flash("err", err instanceof Error ? err.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  async function resetMemberPassword(id: string, name: string) {
    const password = window.prompt(
      `New password for ${name} (min 8 characters):`,
      ""
    );
    if (password == null) return;
    if (password.trim().length < 8) {
      flash("err", "Password must be at least 8 characters");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/members/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "setPassword",
          id,
          password: password.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Password reset failed");
      if (Array.isArray(data.members)) setMembers(data.members);
      flash("ok", `Password updated for ${name}`);
    } catch (err) {
      flash("err", err instanceof Error ? err.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  const pendingMembers = members.filter((m) => m.status === "pending");
  const topTierPending = members.filter(
    (m) => m.topTierNomination?.status === "pending"
  );
  const approvedCount = members.filter((m) => m.status === "approved").length;

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Hub members</h2>
      <p className="panel-hint">
        Membership sign-ups, tip badges, and Square Royalty nominations from
        Golden Loofah / Custom Star Loofah donations.
      </p>

      <div className="dining-summary-stats" style={{ marginBottom: "1.25rem" }}>
        <div className="stat">
          <strong>{pendingMembers.length}</strong>
          <span>Pending sign-ups</span>
        </div>
        <div className="stat">
          <strong>{topTierPending.length}</strong>
          <span>Top-tier nominations</span>
        </div>
        <div className="stat">
          <strong>{approvedCount}</strong>
          <span>Approved members</span>
        </div>
        <div className="stat">
          <strong>{members.length}</strong>
          <span>Total accounts</span>
        </div>
      </div>

      {msg && <div className={`msg msg-${msg.kind}`}>{msg.text}</div>}

      {durableHint && (
        <div className="msg msg-err" style={{ marginBottom: "1rem" }}>
          <strong>Storage warning:</strong> {durableHint}
        </div>
      )}

      {topTierPending.length > 0 && (
        <>
          <h3>
            Square Royalty nominations (1 year){" "}
            <span className="pill pill-yard">
              {topTierPending.length} pending
            </span>
          </h3>
          <p className="panel-hint">
            Triggered by Golden Loofah or Custom Star Loofah donations. Approve
            to grant <strong>Square Royalty</strong> until the proposed date.
          </p>
          <div className="admin-list" style={{ marginBottom: "1.5rem" }}>
            {topTierPending.map((m) => (
              <div key={`top-${m.id}`} className="admin-item admin-item-pending">
                <div>
                  <strong className="member-name">
                    <span className="member-name-text">{m.name}</span>
                    <MemberBadgesRow badges={m.badges || []} />
                  </strong>
                  <span>
                    {m.email}
                    {m.village ? ` · ${m.village}` : ""}
                    {" · Source: "}
                    <strong>{m.topTierNomination?.source}</strong>
                    {" · Until "}
                    {m.topTierNomination?.proposedExpiresAt
                      ? formatDate(m.topTierNomination.proposedExpiresAt)
                      : "—"}
                  </span>
                </div>
                <div className="admin-actions">
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    disabled={busy}
                    onClick={() => topTierAction(m.id, "approveTopTier")}
                  >
                    Approve Square Royalty (1 yr)
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    disabled={busy}
                    onClick={() => topTierAction(m.id, "rejectTopTier")}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {pendingMembers.length > 0 && (
        <>
          <h3>
            Sign-up requests{" "}
            <span className="pill pill-yard">{pendingMembers.length} pending</span>
          </h3>
          <div className="admin-list" style={{ marginBottom: "1.5rem" }}>
            {pendingMembers.map((m) => (
              <MemberAdminRow
                key={m.id}
                m={m}
                tiers={tiers}
                busy={busy}
                emphasize
                onStatus={setMemberStatus}
                onPlan={setMemberPlan}
                onLoofah={toggleGoldenLoofah}
                onPassword={resetMemberPassword}
                onTopTier={topTierAction}
              />
            ))}
          </div>
        </>
      )}

      <h3>
        All members{" "}
        {members.length > 0 && (
          <span className="pill">{members.length}</span>
        )}
      </h3>
      <div className="admin-list">
        {members.length === 0 && (
          <p className="panel-hint">
            No membership requests yet. When someone joins via Yard Sale / Hub
            membership, they&apos;ll appear here for approval.
          </p>
        )}
        {members.map((m) => (
          <MemberAdminRow
            key={m.id}
            m={m}
            tiers={tiers}
            busy={busy}
            onStatus={setMemberStatus}
            onPlan={setMemberPlan}
            onLoofah={toggleGoldenLoofah}
            onPassword={resetMemberPassword}
            onTopTier={topTierAction}
          />
        ))}
      </div>
    </div>
  );
}

function MemberAdminRow({
  m,
  tiers,
  busy,
  emphasize,
  onStatus,
  onPlan,
  onLoofah,
  onPassword,
  onTopTier,
}: {
  m: AdminMember;
  tiers: TierOpt[];
  busy: boolean;
  emphasize?: boolean;
  onStatus: (id: string, status: string) => void;
  onPlan: (id: string, plan: string) => void;
  onLoofah: (id: string, next: boolean) => void;
  onPassword: (id: string, name: string) => void;
  onTopTier: (id: string, action: "approveTopTier" | "rejectTopTier") => void;
}) {
  const nom = m.topTierNomination;
  return (
    <div
      className={`admin-item ${emphasize ? "admin-item-pending" : ""}`}
    >
      <div>
        <strong className="member-name">
          <span className="member-name-text">
            {m.name}{" "}
            <span className={`status-tag status-${m.status}`}>{m.status}</span>
          </span>
          <MemberBadgesRow badges={m.badges || []} />
        </strong>
        <span>
          {m.email}
          {m.phone ? ` · ${m.phone}` : ""}
          {m.village ? ` · ${m.village}` : ""}
          {" · "}
          {formatDate(m.createdAt)}
          {m.planLabel ? (
            <>
              {" · "}
              <strong>{m.planLabel}</strong>
            </>
          ) : null}
          {m.planExpiresAt ? ` · plan until ${formatDate(m.planExpiresAt)}` : ""}
          {nom?.status === "pending" ? " · Royalty nomination pending" : ""}
          {nom?.status === "approved" ? " · Royalty nomination approved" : ""}
        </span>
      </div>
      <div className="admin-actions">
        {tiers.length > 0 && (
          <label className="admin-plan-select">
            <span className="sr-only">My Space plan</span>
            <select
              value={m.plan || "porch_waver"}
              disabled={busy}
              onChange={(e) => onPlan(m.id, e.target.value)}
              title="My Space membership tier"
            >
              {tiers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </label>
        )}
        {nom?.status === "pending" && (
          <button
            type="button"
            className="btn btn-primary btn-sm"
            disabled={busy}
            onClick={() => onTopTier(m.id, "approveTopTier")}
          >
            Approve Royalty (1 yr)
          </button>
        )}
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          disabled={busy}
          onClick={() => onLoofah(m.id, !m.goldenLoofah)}
          title="Grant Golden Loofah badge (also nominates for Square Royalty)"
        >
          {m.goldenLoofah ? "Remove Loofah" : "Grant Loofah"}
        </button>
        {m.status !== "approved" && (
          <button
            type="button"
            className="btn btn-primary btn-sm"
            disabled={busy}
            onClick={() => onStatus(m.id, "approved")}
          >
            Approve
          </button>
        )}
        {m.status !== "rejected" && m.status !== "pending" && (
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            disabled={busy}
            onClick={() => onStatus(m.id, "rejected")}
          >
            Reject
          </button>
        )}
        {m.status === "pending" && (
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            disabled={busy}
            onClick={() => onStatus(m.id, "rejected")}
          >
            Reject
          </button>
        )}
        {m.status === "approved" && (
          <button
            type="button"
            className="btn btn-danger btn-sm"
            disabled={busy}
            onClick={() => onStatus(m.id, "suspended")}
          >
            Suspend
          </button>
        )}
        {m.status === "suspended" && (
          <button
            type="button"
            className="btn btn-primary btn-sm"
            disabled={busy}
            onClick={() => onStatus(m.id, "approved")}
          >
            Reinstate
          </button>
        )}
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          disabled={busy}
          onClick={() => onPassword(m.id, m.name)}
        >
          Set password
        </button>
      </div>
    </div>
  );
}
