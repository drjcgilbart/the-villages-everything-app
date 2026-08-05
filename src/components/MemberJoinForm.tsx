"use client";

import Link from "next/link";
import { useState } from "react";

export function MemberJoinForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [village, setVillage] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/members/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, phone, village }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");
      setMsg({
        kind: "ok",
        text:
          data.message ||
          "Request submitted! You’ll get access to post after admin approval.",
      });
      setPassword("");
    } catch (err) {
      setMsg({
        kind: "err",
        text: err instanceof Error ? err.message : "Registration failed",
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="admin-card">
      <h2 style={{ marginTop: 0 }}>Membership request</h2>
      {msg && <div className={`msg msg-${msg.kind}`}>{msg.text}</div>}
      <form className="form-grid" onSubmit={onSubmit}>
        <div className="field">
          <label>Full name</label>
          <input required value={name} onChange={(e) => setName(e.target.value)} />
        </div>
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
          <label>Password (min 6 characters)</label>
          <input
            required
            type="password"
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
        </div>
        <div className="field">
          <label>Phone (optional — buyers may use this)</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div className="field">
          <label>Village / area (optional)</label>
          <input
            value={village}
            onChange={(e) => setVillage(e.target.value)}
            placeholder="e.g. Village of ..."
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={busy}>
          {busy ? "Submitting…" : "Request membership"}
        </button>
      </form>
      <p className="panel-hint" style={{ marginBottom: 0 }}>
        Already a member? <Link href="/yard-sale/login">Sign in</Link>
      </p>
    </div>
  );
}
