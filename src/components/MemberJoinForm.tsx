"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { InvitePeek } from "@/lib/householdTypes";

export function MemberJoinForm(props: { householdToken?: string }) {
  const householdToken = String(props.householdToken || "").trim();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [village, setVillage] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [invite, setInvite] = useState<InvitePeek | null>(null);

  useEffect(() => {
    if (!householdToken) return;
    fetch(`/api/members/household?token=${encodeURIComponent(householdToken)}`, {
      cache: "no-store",
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (!json?.invite) return;
        const peek = json.invite as InvitePeek;
        setInvite(peek);
        if (peek.email) setEmail(peek.email);
      })
      .catch(() => {
        /* join form still works without the peek */
      });
  }, [householdToken]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/members/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          phone,
          village,
          householdToken: householdToken || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");
      setMsg({
        kind: "ok",
        text:
          data.message ||
          "Request submitted! You can sign in with this password. Posting listings still needs admin approval.",
      });
      setPassword("");
      if (data.householdJoined) {
        window.location.href = "/my-space?joined=household";
        return;
      }
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
      <h2 style={{ marginTop: 0 }}>
        {invite ? "Your own household login" : "Membership request"}
      </h2>
      {invite ? (
        <p className="panel-hint">
          {invite.expired
            ? "This invite expired. Ask them to send a new one, or request a regular neighbor account below."
            : `${invite.ownerName} invited you onto ${invite.planLabel} (${invite.seats} member login${invite.seats === 1 ? "" : "s"}). Use the email they invited. Your boards will not mix with theirs.`}
        </p>
      ) : null}
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
          <label>Password (min 8 characters)</label>
          <input
            required
            type="password"
            minLength={8}
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
          {busy
            ? "Submitting…"
            : invite && !invite.expired
              ? "Create my login"
              : "Request membership"}
        </button>
      </form>
      <p className="panel-hint" style={{ marginBottom: 0 }}>
        Already have an account?{" "}
        <Link
          href={
            householdToken
              ? `/yard-sale/login?next=${encodeURIComponent(`/my-space?household=${householdToken}`)}`
              : "/yard-sale/login?next=/my-space"
          }
        >
          Sign in
        </Link>
        {invite
          ? " with the invited email to join this household."
          : " — you can re-submit while still pending to set a new password. After you’re approved, you can try Square Royalty free for one month."}
      </p>
    </div>
  );
}
