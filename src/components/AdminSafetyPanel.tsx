"use client";

import { useEffect, useState } from "react";
import { formatDate } from "@/lib/format";
import type { SafetyReport } from "@/lib/safetyTypes";

export function AdminSafetyPanel() {
  const [reports, setReports] = useState<SafetyReport[]>([]);
  const [openCount, setOpenCount] = useState(0);
  const [blockCount, setBlockCount] = useState(0);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/safety/admin", { cache: "no-store" })
      .then((res) => res.json().then((data) => ({ res, data })))
      .then(({ res, data }) => {
        if (cancelled) return;
        if (!res.ok) throw new Error(data.error || "Could not load reports");
        setReports(data.reports || []);
        setOpenCount(data.openCount || 0);
        setBlockCount(data.blockCount || 0);
      })
      .catch((err) => {
        if (!cancelled) {
          setMsg(err instanceof Error ? err.message : "Load failed");
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function mark(id: string, status: "open" | "reviewed") {
    setBusy(true);
    try {
      const res = await fetch("/api/safety/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");
      setReports(data.reports || []);
      setOpenCount((data.reports || []).filter((r: SafetyReport) => r.status === "open").length);
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Update failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <p className="panel-hint">
        Neighbor reports from Report buttons on forums, yard sale, and dining
        reviews. Aim to hide or remove bad content within 24 hours. Open reports:{" "}
        <strong>{openCount}</strong>. Neighbor block pairs: {blockCount}.
      </p>
      {msg ? <div className="msg msg-err">{msg}</div> : null}
      {reports.length === 0 ? (
        <p className="empty-state">No reports yet.</p>
      ) : (
        <ul className="admin-list">
          {reports.map((r) => (
            <li key={r.id} className="about-panel" style={{ marginBottom: "0.75rem" }}>
              <div className="card-meta">
                <span className={`pill ${r.status === "open" ? "pill-yard" : ""}`}>
                  {r.status}
                </span>
                <span>{r.targetType}</span>
                <time dateTime={r.createdAt}>{formatDate(r.createdAt)}</time>
              </div>
              <p style={{ marginBottom: 0 }}>
                <strong>{r.reason}</strong>
                {r.targetLabel ? ` · ${r.targetLabel}` : ""}
              </p>
              <p className="panel-hint" style={{ marginBottom: 0 }}>
                Target id: {r.targetId}
                {r.reporterName ? ` · from ${r.reporterName}` : " · visitor"}
                {r.details ? ` · ${r.details}` : ""}
              </p>
              <div className="admin-actions" style={{ marginTop: "0.6rem" }}>
                {r.status === "open" ? (
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    disabled={busy}
                    onClick={() => void mark(r.id, "reviewed")}
                  >
                    Mark reviewed
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    disabled={busy}
                    onClick={() => void mark(r.id, "open")}
                  >
                    Reopen
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
