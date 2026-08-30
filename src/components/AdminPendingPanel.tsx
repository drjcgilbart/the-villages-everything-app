"use client";

import { useCallback, useEffect, useState } from "react";
import { formatDate } from "@/lib/format";
import type { PendingItem, PendingTab } from "@/lib/pendingApprovals";

type Payload = {
  items: PendingItem[];
  counts: Record<PendingTab, number>;
  total: number;
  emailConfigured?: boolean;
  notifyEmail?: string;
  error?: string;
};

const TAB_LABEL: Record<PendingTab, string> = {
  members: "Members",
  yard: "Yard Sale",
  dining: "Dining",
  bestof: "Best of Month",
  golf: "Golf",
  pickleball: "Pickleball",
  clubs: "Clubs",
  localsvc: "Local services",
};

export function AdminPendingPanel({
  onOpenTab,
}: {
  onOpenTab: (tab: PendingTab) => void;
}) {
  const [data, setData] = useState<Payload | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(
    null
  );

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/pending", {
      cache: "no-store",
      credentials: "same-origin",
    });
    const json = (await res.json()) as Payload;
    if (!res.ok) throw new Error(json.error || "Could not load pending list");
    setData(json);
  }, []);

  useEffect(() => {
    load().catch((err) =>
      setMsg({ kind: "err", text: err instanceof Error ? err.message : "Load failed" })
    );
  }, [load]);

  async function decide(item: PendingItem, action: "approve" | "reject") {
    setBusyId(`${item.kind}:${item.id}`);
    setMsg(null);
    try {
      const res = await postDecision(item, action);
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Update failed");
      setMsg({
        kind: "ok",
        text:
          action === "approve"
            ? `Approved: ${item.title}`
            : `Rejected: ${item.title}`,
      });
      await load();
    } catch (err) {
      setMsg({
        kind: "err",
        text: err instanceof Error ? err.message : "Update failed",
      });
    } finally {
      setBusyId(null);
    }
  }

  if (!data) {
    return <p className="panel-hint">Loading every pending approval…</p>;
  }

  const items = data.items || [];

  return (
    <div className="admin-pending-panel">
      <div className="admin-pending-intro">
        <h2 style={{ margin: "0 0 0.35rem" }}>
          All pending approvals
          {data.total ? ` (${data.total})` : ""}
        </h2>
        <p style={{ margin: 0, color: "var(--muted)" }}>
          Every waiting membership, listing, suggestion, score, and DUPR
          snapshot in one list — newest first. Approve or reject here, or jump
          to that topic’s tab for extra editing.
        </p>
        {data.emailConfigured ? (
          <p className="panel-hint" style={{ marginBottom: 0 }}>
            New submissions also email <strong>{data.notifyEmail}</strong>.
          </p>
        ) : (
          <p className="msg msg-err" style={{ marginBottom: 0 }}>
            Email alerts are not set up yet. Add a <code>RESEND_API_KEY</code>{" "}
            (or <code>SENDGRID_API_KEY</code>) in Vercel so{" "}
            {data.notifyEmail || "admin@thevillageseverythingapp.com"} gets a
            copy of each submission.
          </p>
        )}
      </div>

      {msg ? <div className={`msg msg-${msg.kind}`}>{msg.text}</div> : null}

      {items.length === 0 ? (
        <p className="empty-state" style={{ marginTop: "1rem" }}>
          Nothing is waiting. You’re caught up.
        </p>
      ) : (
        <ul className="admin-pending-list">
          {items.map((item) => {
            const key = `${item.kind}:${item.id}`;
            const busy = busyId === key;
            return (
              <li key={key} className="about-panel admin-pending-card">
                <div className="admin-pending-card-head">
                  <span className="kicker">{item.topic}</span>
                  <span className="admin-pending-when">
                    {formatDate(item.createdAt)}
                  </span>
                </div>
                <h3>{item.title}</h3>
                <p className="admin-pending-summary">
                  {item.submittedBy ? `${item.submittedBy} · ` : ""}
                  {item.summary}
                </p>
                {item.details.length ? (
                  <dl className="admin-pending-details">
                    {item.details.map((row) => (
                      <div key={row.label}>
                        <dt>{row.label}</dt>
                        <dd>{row.value}</dd>
                      </div>
                    ))}
                  </dl>
                ) : null}
                <div className="admin-actions">
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    disabled={busy}
                    onClick={() => decide(item, "approve")}
                  >
                    {busy ? "Saving…" : "Approve"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    disabled={busy}
                    onClick={() => decide(item, "reject")}
                  >
                    Reject
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => onOpenTab(item.tab)}
                  >
                    Open {TAB_LABEL[item.tab]} tab
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

async function postDecision(item: PendingItem, action: "approve" | "reject") {
  const headers = { "Content-Type": "application/json" };
  const status = action === "approve" ? "approved" : "rejected";

  switch (item.kind) {
    case "member":
      return fetch("/api/members/admin", {
        method: "POST",
        headers,
        credentials: "same-origin",
        body: JSON.stringify({ id: item.id, status }),
      });
    case "member-royalty":
      return fetch("/api/members/admin", {
        method: "POST",
        headers,
        credentials: "same-origin",
        body: JSON.stringify({
          id: item.id,
          action: action === "approve" ? "approveTopTier" : "rejectTopTier",
        }),
      });
    case "yard-sale":
      return fetch("/api/yard-sale/listings", {
        method: "PUT",
        headers,
        credentials: "same-origin",
        body: JSON.stringify({
          id: item.id,
          adminStatus: status,
        }),
      });
    case "dining":
      return fetch("/api/dining/suggestions", {
        method: "POST",
        headers,
        credentials: "same-origin",
        body: JSON.stringify({ action, id: item.id }),
      });
    case "best-of-month":
      return fetch("/api/best-of-month/admin", {
        method: "POST",
        headers,
        credentials: "same-origin",
        body: JSON.stringify({ action, id: item.id }),
      });
    case "golf-round":
      return fetch("/api/golf/admin", {
        method: "POST",
        headers,
        credentials: "same-origin",
        body: JSON.stringify({ kind: "round", action, id: item.id }),
      });
    case "golf-ace":
      return fetch("/api/golf/admin", {
        method: "POST",
        headers,
        credentials: "same-origin",
        body: JSON.stringify({ kind: "ace", action, id: item.id }),
      });
    case "pickleball-rating":
      return fetch("/api/pickleball/admin", {
        method: "POST",
        headers,
        credentials: "same-origin",
        body: JSON.stringify({ kind: "rating", action, id: item.id }),
      });
    case "club":
      return fetch("/api/clubs/admin", {
        method: "POST",
        headers,
        credentials: "same-origin",
        body: JSON.stringify({ action, id: item.id }),
      });
    case "local-pros":
    case "support-local":
      return fetch("/api/local-services/admin", {
        method: "POST",
        headers,
        credentials: "same-origin",
        body: JSON.stringify({ action, id: item.id }),
      });
    default:
      throw new Error("Unknown item type");
  }
}
