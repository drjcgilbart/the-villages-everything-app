"use client";

import { useCallback, useEffect, useState } from "react";
import type { BomEntry } from "@/lib/bestOfMonthTypes";
import { BOM_CATEGORY_META } from "@/lib/bestOfMonthTypes";

export function AdminBestOfMonthPanel() {
  const [entries, setEntries] = useState<BomEntry[]>([]);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [filter, setFilter] = useState<"pending" | "all">("pending");

  const load = useCallback(async () => {
    const res = await fetch("/api/best-of-month/admin", { cache: "no-store" });
    const data = await res.json();
    if (res.ok) setEntries(data.entries || []);
  }, []);

  useEffect(() => {
    load().catch(() => undefined);
  }, [load]);

  async function act(action: string, id?: string) {
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/best-of-month/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setMsg(
        action === "tabulate-previous"
          ? "Tabulation checked / updated"
          : `Entry ${action}d`
      );
      await load();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  const visible =
    filter === "pending"
      ? entries.filter((e) => e.status === "pending")
      : entries;

  return (
    <div>
      <p style={{ color: "var(--muted)", marginTop: 0 }}>
        Approve Best of the Month photo/PDF entries. Voting is one per category
        per visitor each month. Winners tabulate automatically at month end
        (cron + on page load).
      </p>
      {msg && <div className="msg msg-ok">{msg}</div>}

      <div className="hero-actions" style={{ marginBottom: "1rem" }}>
        <button
          type="button"
          className={`btn btn-sm ${filter === "pending" ? "btn-primary" : "btn-ghost"}`}
          onClick={() => setFilter("pending")}
        >
          Pending ({entries.filter((e) => e.status === "pending").length})
        </button>
        <button
          type="button"
          className={`btn btn-sm ${filter === "all" ? "btn-primary" : "btn-ghost"}`}
          onClick={() => setFilter("all")}
        >
          All ({entries.length})
        </button>
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          disabled={busy}
          onClick={() => act("tabulate-previous")}
        >
          Tabulate previous month now
        </button>
      </div>

      {visible.length === 0 ? (
        <div className="empty-state">No entries in this filter.</div>
      ) : (
        <div className="admin-list">
          {visible.map((e) => (
            <article key={e.id} className="about-panel admin-list-item">
              <div className="card-meta">
                <span className="pill">{e.status}</span>
                <span className="pill bom-admin-cat">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={BOM_CATEGORY_META[e.category]?.art}
                    alt=""
                    width={22}
                    height={22}
                    className="bom-admin-cat-art"
                  />
                  {BOM_CATEGORY_META[e.category]?.label || e.category}
                </span>
                <span>{e.monthKey}</span>
                <span>{e.votes} votes</span>
              </div>
              <h3 style={{ margin: "0.4rem 0" }}>{e.title}</h3>
              <p style={{ margin: "0 0 0.5rem", color: "var(--muted)" }}>
                by {e.submitterName}
                {e.description ? ` — ${e.description}` : ""}
              </p>
              <p style={{ margin: "0 0 0.65rem" }}>
                <a href={e.imageUrl} target="_blank" rel="noopener noreferrer">
                  Open {e.fileType === "pdf" ? "PDF" : "image"}
                </a>
              </p>
              {e.fileType === "image" && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={e.imageUrl}
                  alt=""
                  style={{
                    maxWidth: "220px",
                    borderRadius: 12,
                    marginBottom: "0.75rem",
                  }}
                />
              )}
              <div className="hero-actions">
                {e.status !== "approved" && (
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    disabled={busy}
                    onClick={() => act("approve", e.id)}
                  >
                    Approve
                  </button>
                )}
                {e.status !== "rejected" && (
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    disabled={busy}
                    onClick={() => act("reject", e.id)}
                  >
                    Reject
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
