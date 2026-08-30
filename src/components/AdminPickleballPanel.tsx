"use client";

import { useCallback, useEffect, useState } from "react";
import type {
  PickleballLookingPost,
  PickleballRating,
} from "@/lib/pickleballTypes";

type AdminPayload = {
  ratings: PickleballRating[];
  looking: PickleballLookingPost[];
};

function fmtDupr(n: number | "") {
  if (n === "" || n == null) return "—";
  return Number(n).toFixed(3);
}

export function AdminPickleballPanel() {
  const [data, setData] = useState<AdminPayload | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [tab, setTab] = useState<"ratings" | "looking">("ratings");

  const load = useCallback(async () => {
    const res = await fetch("/api/pickleball/admin", { cache: "no-store" });
    const json = await res.json();
    if (res.ok) {
      setData({
        ratings: json.ratings || [],
        looking: json.looking || [],
      });
    }
  }, []);

  useEffect(() => {
    load().catch(() => undefined);
  }, [load]);

  async function act(kind: string, action: string, id: string) {
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/pickleball/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, action, id }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed");
      setMsg(`${kind} ${action}d`);
      await load();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  if (!data) return <p className="golf-muted">Loading pickleball…</p>;

  const pending = data.ratings.filter((r) => r.status === "pending");

  return (
    <div>
      {msg ? <p className="golf-note about-panel">{msg}</p> : null}
      <div className="admin-tabs" style={{ marginBottom: "1rem" }}>
        <button
          type="button"
          className={tab === "ratings" ? "active" : ""}
          onClick={() => setTab("ratings")}
        >
          DUPR ratings
          {pending.length ? (
            <span className="admin-tab-badge">{pending.length}</span>
          ) : null}
        </button>
        <button
          type="button"
          className={tab === "looking" ? "active" : ""}
          onClick={() => setTab("looking")}
        >
          Looking posts
        </button>
      </div>

      {tab === "ratings" ? (
        <div className="golf-table-wrap">
          <table className="golf-table">
            <thead>
              <tr>
                <th>Player</th>
                <th>Doubles</th>
                <th>Singles</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.ratings.length === 0 ? (
                <tr>
                  <td colSpan={5}>No submissions yet.</td>
                </tr>
              ) : (
                data.ratings.map((r) => (
                  <tr key={r.id}>
                    <td>
                      {r.playerName}
                      {r.pcvg ? ` · ${r.pcvg}` : ""}
                    </td>
                    <td>{fmtDupr(r.duprDoubles)}</td>
                    <td>{fmtDupr(r.duprSingles)}</td>
                    <td>{r.status}</td>
                    <td>
                      {r.status !== "approved" ? (
                        <button
                          type="button"
                          className="btn btn-sm btn-primary"
                          disabled={busy}
                          onClick={() => act("rating", "approve", r.id)}
                        >
                          Approve
                        </button>
                      ) : null}{" "}
                      {r.status !== "rejected" ? (
                        <button
                          type="button"
                          className="btn btn-sm btn-ghost"
                          disabled={busy}
                          onClick={() => act("rating", "reject", r.id)}
                        >
                          Reject
                        </button>
                      ) : null}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <ul className="golf-foursome-grid">
          {data.looking.length === 0 ? (
            <li className="golf-muted">No looking posts.</li>
          ) : (
            data.looking.map((p) => (
              <li key={p.id} className="about-panel">
                <strong>
                  {p.organizerName} · {p.format} · need {p.playersNeeded}
                </strong>
                <p>
                  {p.whenNote}
                  {p.courtName ? ` · ${p.courtName}` : ""} · {p.status}
                </p>
                <p>{p.message}</p>
                <p className="golf-muted">{p.contact}</p>
                {p.status === "open" ? (
                  <p>
                    <button
                      type="button"
                      className="btn btn-sm btn-ghost"
                      disabled={busy}
                      onClick={() => act("looking", "filled", p.id)}
                    >
                      Mark filled
                    </button>{" "}
                    <button
                      type="button"
                      className="btn btn-sm btn-ghost"
                      disabled={busy}
                      onClick={() => act("looking", "hidden", p.id)}
                    >
                      Hide
                    </button>
                  </p>
                ) : (
                  <button
                    type="button"
                    className="btn btn-sm btn-ghost"
                    disabled={busy}
                    onClick={() => act("looking", "open", p.id)}
                  >
                    Reopen
                  </button>
                )}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
