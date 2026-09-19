"use client";

import { useCallback, useEffect, useState } from "react";
import {
  WEALTH_ACCENTS,
  WEALTH_RESOURCE_KINDS,
  type WealthAccent,
  type WealthResource,
  type WealthResourceKind,
} from "@/lib/wealthResources";

type Draft = {
  id: string;
  name: string;
  kind: WealthResourceKind;
  emoji: string;
  blurb: string;
  address: string;
  city: string;
  phone: string;
  hours: string;
  href: string;
  mapsQuery: string;
  accent: WealthAccent;
};

function emptyDraft(): Draft {
  return {
    id: "",
    name: "",
    kind: "bank",
    emoji: "🏦",
    blurb: "",
    address: "",
    city: "",
    phone: "",
    hours: "",
    href: "",
    mapsQuery: "",
    accent: "palm",
  };
}

function fromPlace(p: WealthResource): Draft {
  return {
    id: p.id,
    name: p.name,
    kind: p.kind,
    emoji: p.emoji || "🏦",
    blurb: p.blurb || "",
    address: p.address || "",
    city: p.city || "",
    phone: p.phone || "",
    hours: p.hours || "",
    href: p.href || "",
    mapsQuery: p.mapsQuery || "",
    accent: p.accent,
  };
}

export function AdminWealthPanel() {
  const [places, setPlaces] = useState<WealthResource[]>([]);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(
    null
  );
  const [draft, setDraft] = useState<Draft>(emptyDraft());
  const [editing, setEditing] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch("/api/wealth/admin", { cache: "no-store" });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Could not load places");
    setPlaces(json.places || []);
  }, []);

  useEffect(() => {
    load().catch((e) =>
      setMsg({ kind: "err", text: e instanceof Error ? e.message : "Load failed" })
    );
  }, [load]);

  function flash(kind: "ok" | "err", text: string) {
    setMsg({ kind, text });
    setTimeout(() => setMsg(null), 4000);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await fetch("/api/wealth/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "save", ...draft }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Save failed");
      flash("ok", json.message || "Saved");
      setDraft(emptyDraft());
      setEditing(false);
      await load();
    } catch (err) {
      flash("err", err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string, name: string) {
    if (!window.confirm(`Delete “${name}” from the Wealth bank list?`)) return;
    setBusy(true);
    try {
      const res = await fetch("/api/wealth/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", id }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Delete failed");
      flash("ok", json.message || "Deleted");
      if (draft.id === id) {
        setDraft(emptyDraft());
        setEditing(false);
      }
      await load();
    } catch (err) {
      flash("err", err instanceof Error ? err.message : "Delete failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="admin-wealth">
      <div className="section-head">
        <div>
          <h2>Local banks &amp; money places</h2>
          <p>
            These cards show on the public Wealth page. Add a phone, fix a
            blurb, or drop a listing that no longer belongs.
          </p>
        </div>
      </div>

      {msg ? <div className={`msg msg-${msg.kind}`}>{msg.text}</div> : null}

      <form className="about-panel admin-wealth-form" onSubmit={save}>
        <h3 style={{ marginTop: 0 }}>
          {editing ? `Edit ${draft.name || "place"}` : "Add a money place"}
        </h3>
        <div className="admin-wealth-grid">
          <label>
            Name
            <input
              required
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            />
          </label>
          <label>
            Kind
            <select
              value={draft.kind}
              onChange={(e) =>
                setDraft({ ...draft, kind: e.target.value as WealthResourceKind })
              }
            >
              {WEALTH_RESOURCE_KINDS.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Emoji
            <input
              value={draft.emoji}
              onChange={(e) => setDraft({ ...draft, emoji: e.target.value })}
            />
          </label>
          <label>
            Accent
            <select
              value={draft.accent}
              onChange={(e) =>
                setDraft({ ...draft, accent: e.target.value as WealthAccent })
              }
            >
              {WEALTH_ACCENTS.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </label>
          <label>
            Phone
            <input
              value={draft.phone}
              onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
              placeholder="(352) 555-0100"
            />
          </label>
          <label>
            City / area
            <input
              value={draft.city}
              onChange={(e) => setDraft({ ...draft, city: e.target.value })}
            />
          </label>
          <label className="admin-wealth-span">
            Address
            <input
              value={draft.address}
              onChange={(e) => setDraft({ ...draft, address: e.target.value })}
            />
          </label>
          <label>
            Hours
            <input
              value={draft.hours}
              onChange={(e) => setDraft({ ...draft, hours: e.target.value })}
            />
          </label>
          <label>
            Website
            <input
              value={draft.href}
              onChange={(e) => setDraft({ ...draft, href: e.target.value })}
              placeholder="https://"
            />
          </label>
          <label className="admin-wealth-span">
            Maps search
            <input
              value={draft.mapsQuery}
              onChange={(e) => setDraft({ ...draft, mapsQuery: e.target.value })}
              placeholder="Wells Fargo The Villages FL"
            />
          </label>
          <label className="admin-wealth-span">
            Blurb
            <textarea
              rows={3}
              value={draft.blurb}
              onChange={(e) => setDraft({ ...draft, blurb: e.target.value })}
            />
          </label>
        </div>
        <div className="hero-actions" style={{ marginTop: "0.75rem" }}>
          <button type="submit" className="btn btn-primary btn-sm" disabled={busy}>
            {editing ? "Save changes" : "Add place"}
          </button>
          {editing ? (
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => {
                setDraft(emptyDraft());
                setEditing(false);
              }}
            >
              Cancel
            </button>
          ) : null}
        </div>
      </form>

      <ul className="admin-list">
        {places.map((p) => (
          <li key={p.id} className="admin-item">
            <div>
              <strong>
                {p.emoji} {p.name}
              </strong>
              <span>
                {p.kind}
                {p.phone ? ` · ${p.phone}` : " · no phone"}
                {p.city ? ` · ${p.city}` : ""}
              </span>
              {p.blurb ? <p className="panel-hint">{p.blurb}</p> : null}
            </div>
            <div className="admin-actions">
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                disabled={busy}
                onClick={() => {
                  setDraft(fromPlace(p));
                  setEditing(true);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                Edit
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                disabled={busy}
                onClick={() => remove(p.id, p.name)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
