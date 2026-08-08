"use client";

import { useCallback, useEffect, useState } from "react";
import {
  LOCAL_SERVICE_CATEGORIES,
  listingPhotos,
  type LocalServiceListing,
} from "@/lib/localServicesTypes";

type Payload = {
  listings: LocalServiceListing[];
  pending: LocalServiceListing[];
  approved: LocalServiceListing[];
};

type EditFields = {
  businessName: string;
  contactName: string;
  category: LocalServiceListing["category"];
  description: string;
  village: string;
  phone: string;
  email: string;
  website: string;
  photos: string[];
  adminNote: string;
};

export function AdminLocalServicesPanel() {
  const [data, setData] = useState<Payload | null>(null);
  const [tab, setTab] = useState<"pending" | "approved" | "all">("pending");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [edit, setEdit] = useState<EditFields | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/local-services/admin", { cache: "no-store" });
    const json = await res.json();
    if (res.ok) {
      setData({
        listings: json.listings || [],
        pending: json.pending || [],
        approved: json.approved || [],
      });
    }
  }, []);

  useEffect(() => {
    load().catch(() => undefined);
  }, [load]);

  async function act(
    action: string,
    id: string,
    extra?: Record<string, unknown>
  ) {
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/local-services/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, id, ...extra }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed");
      setMsg(json.message || "OK");
      setEditingId(null);
      setEdit(null);
      await load();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  function startEdit(l: LocalServiceListing) {
    setEditingId(l.id);
    setEdit({
      businessName: l.businessName,
      contactName: l.contactName,
      category: l.category,
      description: l.description,
      village: l.village || "",
      phone: l.phone || "",
      email: l.email || "",
      website: l.website || "",
      photos: listingPhotos(l),
      adminNote: l.adminNote || "",
    });
  }

  async function saveEdit(id: string) {
    if (!edit) return;
    await act("update", id, {
      businessName: edit.businessName,
      contactName: edit.contactName,
      category: edit.category,
      description: edit.description,
      village: edit.village || "",
      phone: edit.phone || "",
      email: edit.email || "",
      website: edit.website || "",
      photos: edit.photos,
      adminNote: edit.adminNote || "",
    });
  }

  if (!data) {
    return <div className="empty-state">Loading local service listings…</div>;
  }

  const visible =
    tab === "pending"
      ? data.pending
      : tab === "approved"
        ? data.approved
        : data.listings;

  return (
    <div>
      <p style={{ color: "var(--muted)", marginTop: 0 }}>
        Approve neighbor service listings for{" "}
        <strong>Support Local Villagers</strong>. Edit anytime; updates from the
        public form replace the live listing when you approve them. Each listing
        supports 1 main photo + up to 2 extras.
      </p>
      {msg ? <div className="msg msg-ok">{msg}</div> : null}

      <div className="hero-actions" style={{ marginBottom: "1rem" }}>
        <button
          type="button"
          className={`btn btn-sm ${tab === "pending" ? "btn-primary" : "btn-ghost"}`}
          onClick={() => setTab("pending")}
        >
          Pending ({data.pending.length})
        </button>
        <button
          type="button"
          className={`btn btn-sm ${tab === "approved" ? "btn-primary" : "btn-ghost"}`}
          onClick={() => setTab("approved")}
        >
          Live ({data.approved.length})
        </button>
        <button
          type="button"
          className={`btn btn-sm ${tab === "all" ? "btn-primary" : "btn-ghost"}`}
          onClick={() => setTab("all")}
        >
          All ({data.listings.length})
        </button>
      </div>

      {visible.length === 0 ? (
        <div className="empty-state">No listings in this filter.</div>
      ) : (
        <div className="admin-list">
          {visible.map((l) => {
            const gallery = listingPhotos(l);
            return (
              <article key={l.id} className="about-panel admin-list-item">
                <div className="card-meta">
                  <span className="pill">{l.status}</span>
                  <span className="pill">{l.category}</span>
                  {gallery.length > 0 ? (
                    <span className="pill">
                      {gallery.length} photo{gallery.length === 1 ? "" : "s"}
                    </span>
                  ) : null}
                  {l.replacesId ? (
                    <span className="pill">Update of existing</span>
                  ) : null}
                </div>

                {gallery.length > 0 ? (
                  <div className="local-svc-admin-thumbs">
                    {gallery.map((url, i) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={`${url}-${i}`}
                        src={url}
                        alt=""
                        className="local-svc-admin-thumb"
                        title={i === 0 ? "Main" : `Extra ${i}`}
                      />
                    ))}
                  </div>
                ) : null}

                {editingId === l.id && edit ? (
                  <div className="form-grid" style={{ marginTop: "0.75rem" }}>
                    <div className="field">
                      <label>Business name</label>
                      <input
                        value={edit.businessName}
                        onChange={(e) =>
                          setEdit((p) =>
                            p
                              ? { ...p, businessName: e.target.value }
                              : p
                          )
                        }
                      />
                    </div>
                    <div className="field">
                      <label>Contact name</label>
                      <input
                        value={edit.contactName}
                        onChange={(e) =>
                          setEdit((p) =>
                            p ? { ...p, contactName: e.target.value } : p
                          )
                        }
                      />
                    </div>
                    <div className="field">
                      <label>Category</label>
                      <select
                        value={edit.category || "Other"}
                        onChange={(e) =>
                          setEdit((p) =>
                            p
                              ? {
                                  ...p,
                                  category: e.target
                                    .value as LocalServiceListing["category"],
                                }
                              : p
                          )
                        }
                      >
                        {LOCAL_SERVICE_CATEGORIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="field">
                      <label>Village</label>
                      <input
                        value={edit.village}
                        onChange={(e) =>
                          setEdit((p) =>
                            p ? { ...p, village: e.target.value } : p
                          )
                        }
                      />
                    </div>
                    <div className="field field-full">
                      <label>Description</label>
                      <textarea
                        rows={3}
                        value={edit.description}
                        onChange={(e) =>
                          setEdit((p) =>
                            p ? { ...p, description: e.target.value } : p
                          )
                        }
                      />
                    </div>
                    <div className="field">
                      <label>Phone</label>
                      <input
                        value={edit.phone}
                        onChange={(e) =>
                          setEdit((p) =>
                            p ? { ...p, phone: e.target.value } : p
                          )
                        }
                      />
                    </div>
                    <div className="field">
                      <label>Email</label>
                      <input
                        value={edit.email}
                        onChange={(e) =>
                          setEdit((p) =>
                            p ? { ...p, email: e.target.value } : p
                          )
                        }
                      />
                    </div>
                    <div className="field">
                      <label>Website</label>
                      <input
                        value={edit.website}
                        onChange={(e) =>
                          setEdit((p) =>
                            p ? { ...p, website: e.target.value } : p
                          )
                        }
                      />
                    </div>
                    <div className="field field-full">
                      <label>
                        Photo URLs (one per line — first = main, max 3)
                      </label>
                      <textarea
                        rows={3}
                        value={edit.photos.join("\n")}
                        onChange={(e) =>
                          setEdit((p) =>
                            p
                              ? {
                                  ...p,
                                  photos: e.target.value
                                    .split("\n")
                                    .map((s) => s.trim())
                                    .filter(Boolean)
                                    .slice(0, 3),
                                }
                              : p
                          )
                        }
                        placeholder="/api/media/…"
                      />
                    </div>
                    <div className="field field-full">
                      <label>Admin note (internal)</label>
                      <input
                        value={edit.adminNote}
                        onChange={(e) =>
                          setEdit((p) =>
                            p ? { ...p, adminNote: e.target.value } : p
                          )
                        }
                      />
                    </div>
                    <div className="hero-actions field-full">
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        disabled={busy}
                        onClick={() => saveEdit(l.id)}
                      >
                        Save changes
                      </button>
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        disabled={busy}
                        onClick={() => {
                          setEditingId(null);
                          setEdit(null);
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 style={{ margin: "0.4rem 0" }}>{l.businessName}</h3>
                    <p style={{ margin: "0 0 0.35rem", color: "var(--muted)" }}>
                      Contact: {l.contactName}
                      {l.village ? ` · ${l.village}` : ""}
                      <br />
                      Submitted by {l.submittedByName}
                      {l.email ? ` · ${l.email}` : ""}
                      {l.phone ? ` · ${l.phone}` : ""}
                    </p>
                    <p style={{ margin: "0 0 0.5rem" }}>{l.description}</p>
                    {l.website ? (
                      <p style={{ margin: "0 0 0.65rem" }}>
                        <a
                          href={l.website}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {l.website}
                        </a>
                      </p>
                    ) : null}
                    {l.adminNote ? (
                      <p
                        style={{
                          margin: "0 0 0.5rem",
                          fontSize: "0.88rem",
                          color: "var(--muted)",
                        }}
                      >
                        <strong>Admin note:</strong> {l.adminNote}
                      </p>
                    ) : null}
                    <div className="hero-actions">
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        disabled={busy || l.status === "approved"}
                        onClick={() => act("approve", l.id)}
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        disabled={busy || l.status === "rejected"}
                        onClick={() => act("reject", l.id)}
                      >
                        Reject
                      </button>
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        disabled={busy}
                        onClick={() => startEdit(l)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        disabled={busy}
                        onClick={() => {
                          if (
                            typeof window !== "undefined" &&
                            window.confirm(
                              `Delete “${l.businessName}” permanently?`
                            )
                          ) {
                            act("delete", l.id);
                          }
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
