"use client";

import { useState } from "react";

export function DeleteAccountPanel() {
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/members/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ confirm }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not delete account");
      window.location.assign(
        new URL("/my-space?deleted=1", window.location.origin).toString()
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete account");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="about-panel delete-account-panel" id="delete-account">
      <h3 style={{ marginTop: 0 }}>Delete my account</h3>
      <p className="panel-hint" style={{ marginTop: 0 }}>
        This removes your membership, My Space boards, and sign-in. Public posts
        you already made stay in place as “Deleted neighbor.” Yard-sale listings
        come down. This cannot be undone.
      </p>
      {!open ? (
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={() => setOpen(true)}
        >
          Delete my account
        </button>
      ) : (
        <div className="field">
          <label htmlFor="delete-confirm">
            Type <strong>DELETE</strong> to confirm
          </label>
          <input
            id="delete-confirm"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            autoComplete="off"
            spellCheck={false}
          />
          {error ? <div className="msg msg-err">{error}</div> : null}
          <div className="admin-actions" style={{ marginTop: "0.75rem" }}>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              disabled={busy || confirm.trim().toUpperCase() !== "DELETE"}
              onClick={() => void submit()}
            >
              {busy ? "Deleting…" : "Permanently delete account"}
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              disabled={busy}
              onClick={() => {
                setOpen(false);
                setConfirm("");
                setError(null);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
