"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import { shouldShowLocalDevTools } from "@/lib/localDevHost";
import { safeNextPath } from "@/lib/safeNextPath";

function subscribe() {
  return () => {};
}

export function MemberLoginForm() {
  const searchParams = useSearchParams();
  const nextPath = safeNextPath(searchParams.get("next"));
  const localPc = useSyncExternalStore(
    subscribe,
    shouldShowLocalDevTools,
    () => false
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/members/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      // Full navigation so the httpOnly session cookie is on the next document.
      window.location.assign(nextPath);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      setBusy(false);
    }
  }

  return (
    <div className="admin-card">
      <h2 style={{ marginTop: 0 }}>Sign in</h2>
      {error && <div className="msg msg-err">{error}</div>}
      <form className="form-grid" onSubmit={onSubmit}>
        <div className="field">
          <label>Email</label>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>
        <div className="field">
          <label>Password</label>
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={busy}>
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
      {localPc ? (
        <p className="panel-hint">
          This PC has its own member list, separate from the live website. If
          the live-site password fails here, sign in with your{" "}
          <strong>Admin</strong> password, or open{" "}
          <Link href="/admin">Admin</Link> → Members → Set password.
        </p>
      ) : null}
      <p className="panel-hint" style={{ marginBottom: 0 }}>
        Need an account? <Link href="/yard-sale/join">Request membership</Link>
        . Forgot your password while still pending? Submit the membership form
        again with the same email and a new password.
      </p>
    </div>
  );
}
