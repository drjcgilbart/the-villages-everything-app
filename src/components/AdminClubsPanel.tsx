"use client";

import { useCallback, useEffect, useState } from "react";
import {
  membershipLabel,
  type ClubListing,
} from "@/lib/clubListingsTypes";

type Payload = {
  listings: ClubListing[];
  pending: ClubListing[];
  approved: ClubListing[];
};

export function AdminClubsPanel() {
  const [data, setData] = useState<Payload | null>(null);
  const [tab, setTab] = useState<"pending" | "approved" | "all">("pending");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/clubs/admin", { cache: "no-store" });
    const json = await res.json();
    if (res.ok) {
      setData({
        listings: json.listings || [],
        pending: json.pending || [],
        approved: json.approved || [],
      });
    }
  }, []);

  useEffect(() => {
    load().catch(() => undefined);
  }, [load]);

  async function act(action: string, id: string) {
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/clubs/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, id }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed");
      setMsg(json.message || "OK");
      await load();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  if (!data) {
    return <div className="empty-state">Loading club listings…</div>;
  }

  const visible =
    tab === "pending"
      ? data.pending
      : tab === "approved"
        ? data.approved
        : data.listings;

  return (
    <div>
      <p style={{ color: "var(--muted)", marginTop: 0 }}>
        Approve club leader submissions for the public Clubs directory. Updates
        replace the previous live listing when approved.
      </p>
      {msg ? <div className="msg msg-ok">{msg}</div> : null}

      <div className="hero-actions" style={{ marginBottom: "1rem" }}>
        <button
          type="button"
          className={`btn btn-sm ${tab === "pending" ? "btn-primary" : "btn-ghost"}`}
          onClick={() => setTab("pending")}
        >
          Pending ({data.pending.length})
        </button>
        <button
          type="button"
          className={`btn btn-sm ${tab === "approved" ? "btn-primary" : "btn-ghost"}`}
          onClick={() => setTab("approved")}
        >
          Live ({data.approved.length})
        </button>
        <button
          type="button"
          className={`btn btn-sm ${tab === "all" ? "btn-primary" : "btn-ghost"}`}
          onClick={() => setTab("all")}
        >
          All ({data.listings.length})
        </button>
      </div>

      {visible.length === 0 ? (
        <div className="empty-state">No listings in this filter.</div>
      ) : (
        <div className="admin-list">
          {visible.map((l) => (
            <article key={l.id} className="about-panel admin-list-item">
              <div className="card-meta">
                <span className="pill">{l.status}</span>
                <span className="pill">{l.category}</span>
                <span className={`pill club-mem-${l.membershipStatus}`}>
                  {membershipLabel(l.membershipStatus)}
                </span>
                {l.replacesId ? (
                  <span className="pill">Update of existing</span>
                ) : null}
              </div>
              <h3 style={{ margin: "0.4rem 0" }}>{l.name}</h3>
              <p style={{ margin: "0 0 0.35rem", color: "var(--muted)" }}>
                Leader: {l.leaderName} · {l.location}
                <br />
                Submitted by {l.submittedByName}
                {l.email ? ` · ${l.email}` : ""}
                {l.phone ? ` · ${l.phone}` : ""}
              </p>
              <p style={{ margin: "0 0 0.5rem" }}>{l.description}</p>
              {l.website ? (
                <p style={{ margin: "0 0 0.65rem" }}>
                  <a href={l.website} target="_blank" rel="noopener noreferrer">
                    {l.website}
                  </a>
                </p>
              ) : null}
              <div className="hero-actions">
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  disabled={busy || l.status === "approved"}
                  onClick={() => act("approve", l.id)}
                >
                  Approve
                </button>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  disabled={busy || l.status === "rejected"}
                  onClick={() => act("reject", l.id)}
                >
                  Reject
                </button>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  disabled={busy}
                  onClick={() => {
                    if (
                      typeof window !== "undefined" &&
                      window.confirm(`Delete “${l.name}” permanently?`)
                    ) {
                      act("delete", l.id);
                    }
                  }}
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
