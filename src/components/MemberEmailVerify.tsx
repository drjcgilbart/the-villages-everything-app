"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export function MemberEmailVerify() {
  const params = useSearchParams();
  const token = params.get("token") || "";
  const done = params.get("done") === "1";
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");

  async function confirm() {
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`/api/members/verify?token=${encodeURIComponent(token)}`, {
        method: "POST",
        credentials: "include",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = (await res.json().catch(() => null)) as { ok?: boolean; email?: string; error?: string } | null;
      if (!res.ok || !data?.ok) {
        setError(data?.error || "The confirmation did not finish. Press the button again.");
        return;
      }
      setEmail(data.email || "");
      window.history.replaceState({}, "", "/yard-sale/verify?done=1");
    } catch {
      setError("The confirmation did not finish. Try the link again.");
    } finally {
      setBusy(false);
    }
  }

  if (done || email) {
    return (
      <div className="about-panel">
        <h2>Email confirmed</h2>
        <p>
          This inbox is confirmed{email ? ` for ${email}` : ""}. If this was a new
          membership request, it is now with the admin. Holiday Lights still needs
          its own Accept on the tour page.
        </p>
        <div className="hero-actions">
          <Link href="/yard-sale/login?next=/my-space" className="btn btn-primary">
            Sign in
          </Link>
          <Link href="/tour" className="btn btn-ghost">
            Back to Holiday Lights
          </Link>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="about-panel">
        <h2>Confirm your email</h2>
        <p>Open the link from the confirmation email. That page has the button that confirms the inbox. After you sign in, Send the confirmation email can send a new link.</p>
        <Link href="/yard-sale/login?next=/my-space" className="btn btn-primary">
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="about-panel">
      <h2>Confirm your email</h2>
      <p>Press the button to confirm the inbox on your membership. Opening this page is not enough.</p>
      {error ? (
        <p className="lt-error" role="alert">
          {error}
        </p>
      ) : null}
      <button type="button" className="btn btn-primary" disabled={busy} onClick={() => void confirm()}>
        {busy ? "Confirming…" : "Confirm my email"}
      </button>
    </div>
  );
}
