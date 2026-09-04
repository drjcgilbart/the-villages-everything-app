"use client";

import { useState } from "react";

export function ChangePasswordPanel() {
  const [open, setOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  function resetForm() {
    setCurrentPassword("");
    setNewPassword("");
    setConfirm("");
    setError(null);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setOk(null);
    try {
      if (newPassword.length < 8) {
        throw new Error("New password must be at least 8 characters");
      }
      if (newPassword !== confirm) {
        throw new Error("New password and confirmation do not match");
      }
      const res = await fetch("/api/members/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not change password");
      resetForm();
      setOpen(false);
      setOk(data.message || "Password updated.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not change password");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="about-panel change-password-panel" id="change-password">
      <h3 style={{ marginTop: 0 }}>Change my password</h3>
      <p className="panel-hint" style={{ marginTop: 0 }}>
        Updates the Hub sign-in for this email (My Space, Admin, and the phone
        apps). Nothing else is deleted.
      </p>
      {ok ? <div className="msg msg-ok">{ok}</div> : null}
      {!open ? (
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={() => {
            setOpen(true);
            setOk(null);
            setError(null);
          }}
        >
          Change my password
        </button>
      ) : (
        <form onSubmit={(e) => void submit(e)}>
          <div className="field">
            <label htmlFor="pw-current">Current password</label>
            <input
              id="pw-current"
              type="password"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="pw-new">New password</label>
            <input
              id="pw-new"
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              minLength={8}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="pw-confirm">Confirm new password</label>
            <input
              id="pw-confirm"
              type="password"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              minLength={8}
              required
            />
          </div>
          {error ? <div className="msg msg-err">{error}</div> : null}
          <div className="admin-actions" style={{ marginTop: "0.75rem" }}>
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              disabled={busy}
            >
              {busy ? "Saving…" : "Save new password"}
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              disabled={busy}
              onClick={() => {
                setOpen(false);
                resetForm();
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
