"use client";

import { useCallback, useEffect, useState } from "react";
import type {
  AgentTier,
  ListingStatus,
  PropertyType,
  RealEstateAgent,
  RealEstateLead,
  RealEstateListing,
} from "@/lib/realEstateTypes";

type ListForm = {
  id: string;
  title: string;
  village: string;
  address: string;
  price: string;
  beds: string;
  baths: string;
  sqft: string;
  propertyType: PropertyType;
  status: ListingStatus;
  summary: string;
  listingUrl: string;
  agentId: string;
  featured: boolean;
};

type AgentForm = {
  id: string;
  name: string;
  brokerage: string;
  phone: string;
  email: string;
  website: string;
  bio: string;
  specialties: string;
  tier: AgentTier;
  acceptsLeads: boolean;
  active: boolean;
};

const emptyList: ListForm = {
  id: "",
  title: "",
  village: "",
  address: "",
  price: "",
  beds: "2",
  baths: "2",
  sqft: "",
  propertyType: "villa",
  status: "active",
  summary: "",
  listingUrl: "",
  agentId: "",
  featured: true,
};

const emptyAgent: AgentForm = {
  id: "",
  name: "",
  brokerage: "",
  phone: "",
  email: "",
  website: "",
  bio: "",
  specialties: "",
  tier: "listed",
  acceptsLeads: true,
  active: true,
};

export function AdminRealEstatePanel() {
  const [listings, setListings] = useState<RealEstateListing[]>([]);
  const [agents, setAgents] = useState<RealEstateAgent[]>([]);
  const [leads, setLeads] = useState<RealEstateLead[]>([]);
  const [listForm, setListForm] = useState<ListForm>(emptyList);
  const [agentForm, setAgentForm] = useState<AgentForm>(emptyAgent);
  const [sub, setSub] = useState<"listings" | "agents" | "leads">("listings");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  const flash = (kind: "ok" | "err", text: string) => {
    setMsg({ kind, text });
    setTimeout(() => setMsg(null), 4000);
  };

  const load = useCallback(async () => {
    const [lRes, aRes, leadRes] = await Promise.all([
      fetch("/api/real-estate/listings"),
      fetch("/api/real-estate/agents"),
      fetch("/api/real-estate/leads"),
    ]);
    const lData = await lRes.json();
    const aData = await aRes.json();
    const leadData = await leadRes.json();
    setListings(lData.listings || []);
    setAgents(aData.agents || []);
    setLeads(leadData.leads || []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function saveListing(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await fetch("/api/real-estate/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...listForm,
          price: Number(listForm.price),
          beds: Number(listForm.beds),
          baths: Number(listForm.baths),
          sqft: listForm.sqft ? Number(listForm.sqft) : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      flash("ok", listForm.id ? "Listing updated" : "Listing added");
      setListForm(emptyList);
      await load();
    } catch (err) {
      flash("err", err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  async function saveAgent(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await fetch("/api/real-estate/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(agentForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      flash("ok", agentForm.id ? "Agent updated" : "Agent added");
      setAgentForm(emptyAgent);
      await load();
    } catch (err) {
      flash("err", err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  async function removeListing(id: string) {
    if (!confirm("Delete this listing?")) return;
    await fetch(`/api/real-estate/listings?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    flash("ok", "Listing deleted");
    if (listForm.id === id) setListForm(emptyList);
    await load();
  }

  async function removeAgent(id: string) {
    if (!confirm("Delete this agent?")) return;
    await fetch(`/api/real-estate/agents?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    flash("ok", "Agent deleted");
    if (agentForm.id === id) setAgentForm(emptyAgent);
    await load();
  }

  async function markLead(id: string, status: RealEstateLead["status"]) {
    await fetch("/api/real-estate/leads", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    flash("ok", `Lead marked ${status}`);
    await load();
  }

  async function removeLead(id: string) {
    if (!confirm("Delete this lead?")) return;
    await fetch(`/api/real-estate/leads?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    flash("ok", "Lead deleted");
    await load();
  }

  function editListing(l: RealEstateListing) {
    setListForm({
      id: l.id,
      title: l.title,
      village: l.village || "",
      address: l.address || "",
      price: String(l.price || ""),
      beds: String(l.beds || ""),
      baths: String(l.baths || ""),
      sqft: l.sqft ? String(l.sqft) : "",
      propertyType: l.propertyType,
      status: l.status,
      summary: l.summary || "",
      listingUrl: l.listingUrl || "",
      agentId: l.agentId || "",
      featured: !!l.featured,
    });
    setSub("listings");
  }

  function editAgent(a: RealEstateAgent) {
    setAgentForm({
      id: a.id,
      name: a.name,
      brokerage: a.brokerage,
      phone: a.phone || "",
      email: a.email || "",
      website: a.website || "",
      bio: a.bio || "",
      specialties: (a.specialties || []).join(", "),
      tier: a.tier,
      acceptsLeads: a.acceptsLeads,
      active: a.active,
    });
    setSub("agents");
  }

  const agentName = (id?: string) =>
    agents.find((a) => a.id === id)?.name || id || "—";

  return (
    <div>
      <p style={{ color: "var(--muted)", marginTop: 0 }}>
        Featured homes, partner agents (listed / featured / preferred), and
        buyer–seller leads. Live MLS searches stay on the public page; this is
        your curated + monetization layer.
      </p>
      {msg && <div className={`msg msg-${msg.kind}`}>{msg.text}</div>}

      <div className="admin-tabs" style={{ marginBottom: "1rem" }}>
        <button
          type="button"
          className={sub === "listings" ? "active" : ""}
          onClick={() => setSub("listings")}
        >
          Listings
        </button>
        <button
          type="button"
          className={sub === "agents" ? "active" : ""}
          onClick={() => setSub("agents")}
        >
          Agents
        </button>
        <button
          type="button"
          className={sub === "leads" ? "active" : ""}
          onClick={() => setSub("leads")}
        >
          Leads ({leads.filter((l) => l.status === "new").length} new)
        </button>
      </div>

      {sub === "listings" && (
        <>
          <h2>{listForm.id ? "Edit listing" : "Add featured listing"}</h2>
          <form className="form-grid" onSubmit={saveListing}>
            <div className="field">
              <label>Title</label>
              <input
                value={listForm.title}
                onChange={(e) => setListForm((f) => ({ ...f, title: e.target.value }))}
                required
              />
            </div>
            <div className="form-row">
              <div className="field">
                <label>Village</label>
                <input
                  value={listForm.village}
                  onChange={(e) => setListForm((f) => ({ ...f, village: e.target.value }))}
                  placeholder="Edenfield"
                />
              </div>
              <div className="field">
                <label>Price</label>
                <input
                  type="number"
                  value={listForm.price}
                  onChange={(e) => setListForm((f) => ({ ...f, price: e.target.value }))}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="field">
                <label>Beds</label>
                <input
                  type="number"
                  value={listForm.beds}
                  onChange={(e) => setListForm((f) => ({ ...f, beds: e.target.value }))}
                />
              </div>
              <div className="field">
                <label>Baths</label>
                <input
                  type="number"
                  step="0.5"
                  value={listForm.baths}
                  onChange={(e) => setListForm((f) => ({ ...f, baths: e.target.value }))}
                />
              </div>
              <div className="field">
                <label>Sqft</label>
                <input
                  type="number"
                  value={listForm.sqft}
                  onChange={(e) => setListForm((f) => ({ ...f, sqft: e.target.value }))}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="field">
                <label>Type</label>
                <select
                  value={listForm.propertyType}
                  onChange={(e) =>
                    setListForm((f) => ({
                      ...f,
                      propertyType: e.target.value as PropertyType,
                    }))
                  }
                >
                  {["villa", "courtyard", "ranch", "premier", "designer", "condo", "other"].map(
                    (t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    )
                  )}
                </select>
              </div>
              <div className="field">
                <label>Status</label>
                <select
                  value={listForm.status}
                  onChange={(e) =>
                    setListForm((f) => ({
                      ...f,
                      status: e.target.value as ListingStatus,
                    }))
                  }
                >
                  {["active", "pending", "sold", "hidden"].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label>Agent</label>
                <select
                  value={listForm.agentId}
                  onChange={(e) =>
                    setListForm((f) => ({ ...f, agentId: e.target.value }))
                  }
                >
                  <option value="">None</option>
                  {agents.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="field">
              <label>MLS / listing URL (live link)</label>
              <input
                value={listForm.listingUrl}
                onChange={(e) =>
                  setListForm((f) => ({ ...f, listingUrl: e.target.value }))
                }
                placeholder="https://..."
              />
            </div>
            <div className="field">
              <label>Summary</label>
              <textarea
                value={listForm.summary}
                onChange={(e) =>
                  setListForm((f) => ({ ...f, summary: e.target.value }))
                }
                required
              />
            </div>
            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={listForm.featured}
                onChange={(e) =>
                  setListForm((f) => ({ ...f, featured: e.target.checked }))
                }
              />
              Featured on hub
            </label>
            <div className="admin-actions">
              <button type="submit" className="btn btn-primary" disabled={busy}>
                {busy ? "Saving…" : listForm.id ? "Update listing" : "Add listing"}
              </button>
              {listForm.id && (
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setListForm(emptyList)}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          <h2 style={{ marginTop: "1.75rem" }}>All listings</h2>
          <div className="admin-list">
            {listings.map((l) => (
              <div key={l.id} className="admin-item">
                <div>
                  <strong>
                    ${l.price.toLocaleString()} · {l.title}
                  </strong>
                  <span>
                    {l.status} · {l.village || "—"} · {agentName(l.agentId)}
                  </span>
                </div>
                <div className="admin-actions">
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => editListing(l)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => removeListing(l.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {sub === "agents" && (
        <>
          <h2>{agentForm.id ? "Edit agent" : "Add partner agent"}</h2>
          <p style={{ color: "var(--muted)" }}>
            Tiers: <strong>listed</strong> (directory) · <strong>featured</strong>{" "}
            (highlighted) · <strong>preferred</strong> (top placement — your
            paid partner tier).
          </p>
          <form className="form-grid" onSubmit={saveAgent}>
            <div className="form-row">
              <div className="field">
                <label>Name</label>
                <input
                  value={agentForm.name}
                  onChange={(e) =>
                    setAgentForm((f) => ({ ...f, name: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="field">
                <label>Brokerage</label>
                <input
                  value={agentForm.brokerage}
                  onChange={(e) =>
                    setAgentForm((f) => ({ ...f, brokerage: e.target.value }))
                  }
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="field">
                <label>Phone</label>
                <input
                  value={agentForm.phone}
                  onChange={(e) =>
                    setAgentForm((f) => ({ ...f, phone: e.target.value }))
                  }
                />
              </div>
              <div className="field">
                <label>Email</label>
                <input
                  value={agentForm.email}
                  onChange={(e) =>
                    setAgentForm((f) => ({ ...f, email: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="form-row">
              <div className="field">
                <label>Website</label>
                <input
                  value={agentForm.website}
                  onChange={(e) =>
                    setAgentForm((f) => ({ ...f, website: e.target.value }))
                  }
                />
              </div>
              <div className="field">
                <label>Tier</label>
                <select
                  value={agentForm.tier}
                  onChange={(e) =>
                    setAgentForm((f) => ({
                      ...f,
                      tier: e.target.value as AgentTier,
                    }))
                  }
                >
                  <option value="listed">Listed</option>
                  <option value="featured">Featured</option>
                  <option value="preferred">Preferred (paid)</option>
                </select>
              </div>
            </div>
            <div className="field">
              <label>Specialties (comma-separated)</label>
              <input
                value={agentForm.specialties}
                onChange={(e) =>
                  setAgentForm((f) => ({ ...f, specialties: e.target.value }))
                }
              />
            </div>
            <div className="field">
              <label>Bio</label>
              <textarea
                value={agentForm.bio}
                onChange={(e) =>
                  setAgentForm((f) => ({ ...f, bio: e.target.value }))
                }
                required
              />
            </div>
            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={agentForm.acceptsLeads}
                onChange={(e) =>
                  setAgentForm((f) => ({
                    ...f,
                    acceptsLeads: e.target.checked,
                  }))
                }
              />
              Accepts lead form introductions
            </label>
            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={agentForm.active}
                onChange={(e) =>
                  setAgentForm((f) => ({ ...f, active: e.target.checked }))
                }
              />
              Active on public page
            </label>
            <div className="admin-actions">
              <button type="submit" className="btn btn-primary" disabled={busy}>
                {busy ? "Saving…" : agentForm.id ? "Update agent" : "Add agent"}
              </button>
              {agentForm.id && (
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setAgentForm(emptyAgent)}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          <h2 style={{ marginTop: "1.75rem" }}>Agents</h2>
          <div className="admin-list">
            {agents.map((a) => (
              <div key={a.id} className="admin-item">
                <div>
                  <strong>
                    {a.name} · {a.tier}
                  </strong>
                  <span>
                    {a.brokerage}
                    {!a.active ? " · INACTIVE" : ""}
                  </span>
                </div>
                <div className="admin-actions">
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => editAgent(a)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => removeAgent(a.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {sub === "leads" && (
        <>
          <h2>Buyer &amp; seller inquiries</h2>
          <p style={{ color: "var(--muted)" }}>
            Forward new leads to the preferred agent (or the visitor&apos;s pick).
            Mark contacted when you&apos;ve made the intro.
          </p>
          <div className="admin-list">
            {leads.length === 0 && (
              <p style={{ color: "var(--muted)" }}>No leads yet.</p>
            )}
            {leads.map((l) => (
              <div key={l.id} className="admin-item" style={{ alignItems: "flex-start" }}>
                <div>
                  <strong>
                    {l.type.toUpperCase()} · {l.name} · {l.status}
                  </strong>
                  <span>
                    {l.email}
                    {l.phone ? ` · ${l.phone}` : ""}
                    {l.village ? ` · ${l.village}` : ""}
                    {l.agentId ? ` · wants ${agentName(l.agentId)}` : " · auto-match"}
                  </span>
                  <p style={{ margin: "0.35rem 0 0", fontSize: "0.9rem" }}>
                    {l.message}
                  </p>
                </div>
                <div className="admin-actions">
                  {l.status === "new" && (
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => markLead(l.id, "contacted")}
                    >
                      Mark contacted
                    </button>
                  )}
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => markLead(l.id, "closed")}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => removeLead(l.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
