"use client";

import Link from "next/link";
import { useState } from "react";
import type { HouseholdClient } from "@/lib/householdTypes";

export function MySpaceHouseholdPanel(props: {
  household: HouseholdClient;
  visitor?: boolean;
  onChanged: () => Promise<void> | void;
  onNote?: (text: string) => void;
}) {
  const h = props.household;
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  async function run(action: string, extra: Record<string, string> = {}) {
    setBusy(true);
    try {
      const res = await fetch("/api/members/household", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...extra }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Household update failed");
      if (data.joinPath) {
        const url =
          typeof window !== "undefined"
            ? `${window.location.origin}${data.joinPath}`
            : data.joinPath;
        props.onNote?.(
          `Invite sent for ${data.email}. Share this link: ${url}`
        );
        try {
          await navigator.clipboard.writeText(url);
          setCopied(data.email);
        } catch {
          /* clipboard optional */
        }
      } else if (action === "accept") {
        props.onNote?.("You’re on the household. Your boards stay yours.");
      } else if (action === "leave") {
        props.onNote?.("You left the household. Your boards are still on this login.");
      }
      setEmail("");
      setName("");
      await props.onChanged();
    } catch (e) {
      props.onNote?.(e instanceof Error ? e.message : "Household update failed");
    } finally {
      setBusy(false);
    }
  }

  if (props.visitor) return null;

  return (
    <section className="about-panel ms-household" id="ms-household">
      <span className="pill">Household</span>
      <h3 style={{ marginTop: "0.35rem" }}>
        {h.seatLine} · {h.planLabel}
      </h3>
      <p className="panel-hint" style={{ marginTop: 0 }}>
        {h.note}
      </p>

      {h.incoming ? (
        <div className="ms-household-incoming">
          <p>
            <strong>{h.incoming.ownerName}</strong> invited you onto their{" "}
            {h.incoming.planLabel} ({h.incoming.seats} member
            {h.incoming.seats === 1 ? "" : "s"}). Your login and data stay
            separate.
          </p>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            disabled={busy}
            onClick={() => void run("accept")}
          >
            {busy ? "Joining…" : "Accept household invite"}
          </button>
        </div>
      ) : null}

      {h.role === "member" ? (
        <div className="ms-household-actions">
          <p style={{ marginBottom: "0.65rem" }}>
            Paying neighbor: <strong>{h.ownerName}</strong>
            {h.ownerEmail ? ` · ${h.ownerEmail}` : ""}
          </p>
          <ul className="ms-household-list">
            {h.members.map((m) => (
              <li key={m.id}>
                <strong>{m.name}</strong>
                {m.email ? ` · ${m.email}` : ""}
                {m.overflow ? " · seat wait" : ""}
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            disabled={busy}
            onClick={() => void run("leave")}
          >
            Leave this household
          </button>
        </div>
      ) : (
        <>
          <ul className="ms-household-list">
            {h.members.map((m, i) => (
              <li key={m.id}>
                <span>
                  <strong>{m.name}</strong>
                  {m.email ? ` · ${m.email}` : ""}
                  {i === 0 ? " · you" : ""}
                  {m.overflow ? " · over the seat cap" : ""}
                </span>
                {i > 0 ? (
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    disabled={busy}
                    onClick={() => void run("remove", { memberId: m.id })}
                  >
                    Remove
                  </button>
                ) : null}
              </li>
            ))}
            {h.invites.map((inv) => (
              <li key={inv.id}>
                <span>
                  <strong>{inv.name || inv.email}</strong>
                  {inv.name ? ` · ${inv.email}` : ""} · invite pending
                </span>
                <span className="ms-household-invite-actions">
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={async () => {
                      const url =
                        typeof window !== "undefined"
                          ? `${window.location.origin}${inv.joinPath}`
                          : inv.joinPath;
                      try {
                        await navigator.clipboard.writeText(url);
                        setCopied(inv.email);
                        props.onNote?.(`Copied join link for ${inv.email}`);
                      } catch {
                        props.onNote?.(url);
                      }
                    }}
                  >
                    {copied === inv.email ? "Copied" : "Copy link"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    disabled={busy}
                    onClick={() => void run("revoke", { inviteId: inv.id })}
                  >
                    Revoke
                  </button>
                </span>
              </li>
            ))}
          </ul>
          <p className="panel-hint">
            {h.used} of {h.seats} seats used
            {h.openSeats ? ` · ${h.openSeats} open` : ""}.
          </p>
          {h.canInvite ? (
            <form
              className="ms-household-invite"
              onSubmit={(e) => {
                e.preventDefault();
                void run("invite", { email, name });
              }}
            >
              <div className="field">
                <label htmlFor="ms-hh-email">Invite a neighbor</label>
                <input
                  id="ms-hh-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="their@email"
                  autoComplete="email"
                />
              </div>
              <div className="field">
                <label htmlFor="ms-hh-name">Name (optional)</label>
                <input
                  id="ms-hh-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Spouse, golf buddy…"
                />
              </div>
              <button type="submit" className="btn btn-primary btn-sm" disabled={busy}>
                {busy ? "Sending…" : "Create invite link"}
              </button>
            </form>
          ) : h.extraSeats === 0 ? (
            <p className="panel-hint" style={{ marginBottom: 0 }}>
              Upgrade to <Link href="/donate">Cart Path Regular</Link> for 2
              logins, <Link href="/donate">Lanai Legend</Link> for 3, or{" "}
              <Link href="/donate">Square Royalty</Link> for 4. Each person keeps
              their own My Space.
            </p>
          ) : (
            <p className="panel-hint" style={{ marginBottom: 0 }}>
              No open seats left on this plan.
            </p>
          )}
        </>
      )}
    </section>
  );
}
