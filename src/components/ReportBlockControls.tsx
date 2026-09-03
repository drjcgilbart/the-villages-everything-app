"use client";

import { useEffect, useState } from "react";
import {
  SAFETY_REPORT_REASONS,
  type ReportTargetType,
} from "@/lib/safetyTypes";

type Props = {
  targetType: ReportTargetType;
  targetId: string;
  targetMemberId?: string | null;
  targetLabel?: string;
};

export function ReportBlockControls({
  targetType,
  targetId,
  targetMemberId,
  targetLabel,
}: Props) {
  const [memberId, setMemberId] = useState<string | null>(null);
  const [blockedIds, setBlockedIds] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<string>(SAFETY_REPORT_REASONS[0]);
  const [details, setDetails] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(
    null
  );

  useEffect(() => {
    let cancelled = false;
    fetch("/api/safety/block", { cache: "no-store", credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled || !data) return;
        setMemberId(data.member?.id || null);
        setBlockedIds(Array.isArray(data.blockedIds) ? data.blockedIds : []);
      })
      .catch(() => {
        if (!cancelled) setMemberId(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const canBlock =
    !!memberId &&
    !!targetMemberId &&
    memberId !== targetMemberId;
  const alreadyBlocked =
    !!targetMemberId && blockedIds.includes(targetMemberId);

  async function sendReport() {
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/safety/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          targetType,
          targetId,
          targetMemberId: targetMemberId || undefined,
          targetLabel,
          reason,
          details,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not send report");
      setMsg({ kind: "ok", text: data.message || "Report sent." });
      setOpen(false);
      setDetails("");
    } catch (err) {
      setMsg({
        kind: "err",
        text: err instanceof Error ? err.message : "Could not send report",
      });
    } finally {
      setBusy(false);
    }
  }

  async function toggleBlock() {
    if (!targetMemberId) return;
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/safety/block", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          memberId: targetMemberId,
          unblock: alreadyBlocked,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not update block list");
      setBlockedIds(Array.isArray(data.blockedIds) ? data.blockedIds : []);
      setMsg({
        kind: "ok",
        text: alreadyBlocked
          ? "Unblocked. You’ll see this neighbor again."
          : data.message || "Blocked.",
      });
    } catch (err) {
      setMsg({
        kind: "err",
        text: err instanceof Error ? err.message : "Could not update block list",
      });
    } finally {
      setBusy(false);
    }
  }

  if (alreadyBlocked) {
    return (
      <div className="safety-controls">
        <p className="panel-hint" style={{ margin: 0 }}>
          You blocked this neighbor. Their posts stay hidden while you’re signed in.
        </p>
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          disabled={busy}
          onClick={() => void toggleBlock()}
        >
          Unblock
        </button>
      </div>
    );
  }

  return (
    <div className="safety-controls">
      <div className="forum-post-actions">
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={() => {
            setOpen((v) => !v);
            setMsg(null);
          }}
        >
          Report
        </button>
        {canBlock ? (
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            disabled={busy}
            onClick={() => void toggleBlock()}
          >
            Block
          </button>
        ) : null}
      </div>
      {open ? (
        <div className="safety-report-form">
          <label className="field">
            <span>Why are you reporting this?</span>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            >
              {SAFETY_REPORT_REASONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Optional details</span>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={3}
              maxLength={500}
              placeholder="Anything the moderator should know"
            />
          </label>
          <div className="admin-actions">
            <button
              type="button"
              className="btn btn-primary btn-sm"
              disabled={busy}
              onClick={() => void sendReport()}
            >
              {busy ? "Sending…" : "Send report"}
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              disabled={busy}
              onClick={() => setOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : null}
      {msg ? <div className={`msg msg-${msg.kind}`}>{msg.text}</div> : null}
    </div>
  );
}
