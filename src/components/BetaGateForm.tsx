"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

export function BetaGateForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/";

  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/site-gate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Incorrect password");
        setBusy(false);
        return;
      }
      // Full navigation so middleware sees the new cookie
      const target = from.startsWith("/") && !from.startsWith("//") ? from : "/";
      router.replace(target);
      router.refresh();
    } catch {
      setError("Could not reach the server. Try again.");
      setBusy(false);
    }
  }

  return (
    <form className="beta-gate-form" onSubmit={onSubmit}>
      <label className="rc-field">
        <span>Beta password</span>
        <input
          className="rc-search"
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          autoFocus
          required
          placeholder="Password from the host"
        />
      </label>
      {error && <p className="beta-gate-error">{error}</p>}
      <button type="submit" className="btn btn-primary" disabled={busy || !password}>
        {busy ? "Checking…" : "Enter the Hub"}
      </button>
    </form>
  );
}
