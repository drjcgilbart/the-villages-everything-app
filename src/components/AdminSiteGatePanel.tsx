"use client";

import { useCallback, useEffect, useState } from "react";

type GateStatus = {
  enabled: boolean;
  toggleOn: boolean;
  passwordConfigured: boolean;
  updatedAt: string | null;
};

export function AdminSiteGatePanel() {
  const [status, setStatus] = useState<GateStatus | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/site-gate", { cache: "no-store" });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Could not load gate status");
    setStatus({
      enabled: Boolean(data.enabled),
      toggleOn: Boolean(data.toggleOn ?? data.enabled),
      passwordConfigured: Boolean(data.passwordConfigured),
      updatedAt: data.updatedAt || null,
    });
  }, []);

  useEffect(() => {
    load().catch((e) =>
      setErr(e instanceof Error ? e.message : "Could not load")
    );
  }, [load]);

  async function setEnabled(enabled: boolean) {
    setBusy(true);
    setMsg(null);
    setErr(null);
    try {
      const res = await fetch("/api/site-gate", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");
      setMsg(data.message || (enabled ? "Gate ON" : "Gate OFF"));
      await load();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Update failed");
    } finally {
      setBusy(false);
    }
  }

  if (err && !status) {
    return <div className="empty-state">{err}</div>;
  }
  if (!status) {
    return <div className="empty-state">Loading site access settings…</div>;
  }

  const wallLive = status.enabled;
  const toggleOn = status.toggleOn;

  return (
    <div className="site-gate-admin">
      <p style={{ color: "var(--muted)", marginTop: 0 }}>
        Control the private beta password wall. When the wall is{" "}
        <strong>off</strong>, the whole site is public. When it is{" "}
        <strong>on</strong>, visitors must enter{" "}
        <code>SITE_PASSWORD</code> on the beta gate page (same shared tester
        password as before).
      </p>

      {msg && <div className="msg msg-ok">{msg}</div>}
      {err && <div className="msg msg-err">{err}</div>}

      <div className="about-panel site-gate-status-card">
        <div className="site-gate-status-row">
          <div>
            <span className="kicker">Current status</span>
            <h3 style={{ margin: "0.25rem 0" }}>
              {wallLive
                ? "Password wall is LIVE"
                : toggleOn
                  ? "Toggle ON (wall inactive)"
                  : "Site is PUBLIC"}
            </h3>
            <p className="site-gate-status-detail">
              {wallLive
                ? "Visitors who don’t have the beta cookie are redirected to /beta-gate."
                : toggleOn && !status.passwordConfigured
                  ? "You turned the wall on, but SITE_PASSWORD is empty in the environment — set it on Vercel, then the wall will engage."
                  : "Anyone can browse without a password. Use the button below when you want private beta testing again."}
            </p>
          </div>
          <span
            className={`pill ${wallLive ? "site-gate-pill-on" : "site-gate-pill-off"}`}
          >
            {wallLive ? "WALLED" : "OPEN"}
          </span>
        </div>

        <ul className="site-gate-checklist">
          <li>
            <strong>Admin toggle:</strong>{" "}
            {toggleOn ? "On (want wall)" : "Off (public)"}
          </li>
          <li>
            <strong>SITE_PASSWORD in env:</strong>{" "}
            {status.passwordConfigured ? "Configured" : "Not set"}
          </li>
          <li>
            <strong>Effective wall:</strong> {wallLive ? "Active" : "Inactive"}
          </li>
          {status.updatedAt ? (
            <li>
              <strong>Last change:</strong>{" "}
              {new Date(status.updatedAt).toLocaleString()}
            </li>
          ) : null}
        </ul>

        <div className="hero-actions" style={{ marginTop: "1rem" }}>
          {toggleOn ? (
            <button
              type="button"
              className="btn btn-primary"
              disabled={busy}
              onClick={() => setEnabled(false)}
            >
              {busy ? "Updating…" : "Turn password wall OFF (go public)"}
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-primary"
              disabled={busy}
              onClick={() => setEnabled(true)}
            >
              {busy ? "Updating…" : "Turn password wall ON (private beta)"}
            </button>
          )}
        </div>
      </div>

      <div className="about-panel" style={{ marginTop: "1rem" }}>
        <h3 style={{ marginTop: 0 }}>How it works</h3>
        <ul className="ts-tips-list">
          <li>
            Keep <code>SITE_PASSWORD</code> set in Vercel even when the wall is
            off — that way you can re-enable beta access without a redeploy of
            secrets.
          </li>
          <li>
            This toggle is stored in durable app settings (
            <code>site-gate-settings.json</code>) and does not require a new
            deploy.
          </li>
          <li>
            Middleware may take up to ~12 seconds to pick up a change on every
            edge region (short cache). Hard-refresh if a tester still sees the
            gate.
          </li>
          <li>
            Optional emergency env:{" "}
            <code>SITE_GATE_ENABLED=off</code> forces the wall off;{" "}
            <code>=on</code> forces it on (overrides the admin toggle).
          </li>
        </ul>
      </div>
    </div>
  );
}
