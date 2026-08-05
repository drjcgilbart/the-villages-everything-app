"use client";

import { useCallback, useEffect, useState } from "react";
import type { PublicMember } from "@/lib/yardSaleTypes";
import { formatDate } from "@/lib/format";
import type { HubPlanId } from "@/lib/membershipTiers";
import { MemberBadgesRow } from "@/components/MemberBadgesRow";
import type { BadgeDef } from "@/lib/memberBadgeTypes";

type AdminMember = PublicMember & {
  plan?: HubPlanId | string;
  planLabel?: string;
  goldenLoofah?: boolean;
  badges?: BadgeDef[];
};

type TierOpt = { id: string; label: string; shortLabel: string; rank: number };

export function AdminMembersPanel() {
  const [members, setMembers] = useState<AdminMember[]>([]);
  const [tiers, setTiers] = useState<TierOpt[]>([]);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(
    null
  );
  const [busy, setBusy] = useState(false);

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

  async function resetMemberPassword(id: string, name: string) {
    const password = window.prompt(
      `New password for ${name} (min 6 characters):`,
      ""
    );
    if (password == null) return;
    if (password.trim().length < 6) {
      flash("err", "Password must be at least 6 characters");
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
  const approvedCount = members.filter((m) => m.status === "approved").length;

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Hub members</h2>
      <p className="panel-hint">
        This is your membership queue — approve sign-ups for My Space, Yard
        Sale, forum badges, and more. Set plan tiers and Golden Loofah here.
      </p>

      <div className="dining-summary-stats" style={{ marginBottom: "1.25rem" }}>
        <div className="stat">
          <strong>{pendingMembers.length}</strong>
          <span>Pending requests</span>
        </div>
        <div className="stat">
          <strong>{approvedCount}</strong>
          <span>Approved</span>
        </div>
        <div className="stat">
          <strong>{members.length}</strong>
          <span>Total accounts</span>
        </div>
      </div>

      {msg && <div className={`msg msg-${msg.kind}`}>{msg.text}</div>}

      {pendingMembers.length > 0 && (
        <>
          <h3>
            Needs your approval{" "}
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
}: {
  m: AdminMember;
  tiers: TierOpt[];
  busy: boolean;
  emphasize?: boolean;
  onStatus: (id: string, status: string) => void;
  onPlan: (id: string, plan: string) => void;
  onLoofah: (id: string, next: boolean) => void;
  onPassword: (id: string, name: string) => void;
}) {
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
          {m.goldenLoofah ? " · Golden Loofah" : ""}
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
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          disabled={busy}
          onClick={() => onLoofah(m.id, !m.goldenLoofah)}
          title="Golden Loofah is normally earned via $25+ cup-of-Joe donation"
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
