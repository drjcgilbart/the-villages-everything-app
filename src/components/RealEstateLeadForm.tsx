"use client";

import { useState } from "react";
import type { RealEstateAgent } from "@/lib/realEstateTypes";

export function RealEstateLeadForm({
  agents,
  defaultAgentId = "",
  defaultListingId = "",
}: {
  agents: RealEstateAgent[];
  defaultAgentId?: string;
  defaultListingId?: string;
}) {
  const [type, setType] = useState<"buyer" | "seller" | "general">("buyer");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [village, setVillage] = useState("");
  const [budget, setBudget] = useState("");
  const [agentId, setAgentId] = useState(defaultAgentId);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  const leadAgents = agents.filter((a) => a.acceptsLeads && a.active);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setOk(false);
    try {
      const res = await fetch("/api/real-estate/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          name,
          email,
          phone,
          village,
          budget,
          agentId: agentId || undefined,
          listingId: defaultListingId || undefined,
          message,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not send inquiry");
      setOk(true);
      setMessage("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send inquiry");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="form-grid" onSubmit={submit} id="connect-agent">
      <h3 style={{ margin: 0 }}>Connect with a local agent</h3>
      <p className="review-form-lead">
        Buying or selling in The Villages? Send a short note — we&apos;ll match
        you with a partner agent (or the one you pick). No spam, no hard sell
        from this site.
      </p>

      <div className="form-row">
        <div className="field">
          <label>I am a…</label>
          <select value={type} onChange={(e) => setType(e.target.value as typeof type)}>
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
            <option value="general">Just exploring</option>
          </select>
        </div>
        <div className="field">
          <label>Preferred agent (optional)</label>
          <select value={agentId} onChange={(e) => setAgentId(e.target.value)}>
            <option value="">Match me with someone</option>
            {leadAgents.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name} · {a.brokerage}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="field">
          <label htmlFor="re-name">Name</label>
          <input
            id="re-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength={80}
          />
        </div>
        <div className="field">
          <label htmlFor="re-email">Email</label>
          <input
            id="re-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            maxLength={120}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="field">
          <label htmlFor="re-phone">Phone (optional)</label>
          <input
            id="re-phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            maxLength={40}
          />
        </div>
        <div className="field">
          <label htmlFor="re-village">Village / area of interest</label>
          <input
            id="re-village"
            value={village}
            onChange={(e) => setVillage(e.target.value)}
            placeholder="e.g. Edenfield, Fenney, anywhere"
            maxLength={80}
          />
        </div>
      </div>

      {type === "buyer" && (
        <div className="field">
          <label htmlFor="re-budget">Budget range (optional)</label>
          <input
            id="re-budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="e.g. $350k–$450k"
            maxLength={80}
          />
        </div>
      )}

      <div className="field">
        <label htmlFor="re-msg">How can we help?</label>
        <textarea
          id="re-msg"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={4}
          maxLength={2000}
          placeholder="Timeline, must-haves, selling a home first…"
        />
      </div>

      {error && <div className="msg msg-err">{error}</div>}
      {ok && (
        <div className="msg msg-ok">
          Got it — thanks! A partner agent will follow up soon.
        </div>
      )}

      <button type="submit" className="btn btn-primary" disabled={busy}>
        {busy ? "Sending…" : "Request an introduction"}
      </button>
    </form>
  );
}
