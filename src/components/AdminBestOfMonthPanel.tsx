"use client";

import { useCallback, useEffect, useState } from "react";
import type { BomCategory, BomEntry } from "@/lib/bestOfMonthTypes";
import {
  BOM_CATEGORIES,
  BOM_CATEGORY_META,
} from "@/lib/bestOfMonthTypes";

type EditDraft = {
  title: string;
  description: string;
  submitterName: string;
  category: BomCategory;
  status: BomEntry["status"];
};

export function AdminBestOfMonthPanel() {
  const [entries, setEntries] = useState<BomEntry[]>([]);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [filter, setFilter] = useState<"pending" | "approved" | "all">(
    "pending"
  );
  const [blobOk, setBlobOk] = useState<boolean | null>(null);
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<EditDraft | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/best-of-month/admin", { cache: "no-store" });
    const data = await res.json();
    if (res.ok) {
      setEntries(data.entries || []);
      setBlobOk(Boolean(data.blobConfigured));
    }
  }, []);

  useEffect(() => {
    load().catch(() => undefined);
  }, [load]);

  function startEdit(e: BomEntry) {
    setEditingId(e.id);
    setDraft({
      title: e.title,
      description: e.description || "",
      submitterName: e.submitterName,
      category: e.category,
      status: e.status,
    });
    setMsg(null);
  }

  function cancelEdit() {
    setEditingId(null);
    setDraft(null);
  }

  async function act(action: string, id?: string, extra?: Record<string, unknown>) {
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/best-of-month/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, id, ...extra }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setMsg(
        data.message ||
          (action === "tabulate-previous"
            ? "Tabulation checked / updated"
            : `Entry ${action}d`)
      );
      if (action === "delete" || action === "update") {
        cancelEdit();
      }
      await load();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  async function saveEdit(id: string, andApprove = false) {
    if (!draft) return;
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/best-of-month/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update",
          id,
          title: draft.title,
          description: draft.description,
          submitterName: draft.submitterName,
          category: draft.category,
          status: andApprove ? "approved" : draft.status,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");
      setMsg(
        andApprove
          ? "Saved and approved — live on Best of the Month."
          : data.message || "Entry updated."
      );
      cancelEdit();
      await load();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Update failed");
    } finally {
      setBusy(false);
    }
  }

  const visible =
    filter === "pending"
      ? entries.filter((e) => e.status === "pending")
      : filter === "approved"
        ? entries.filter((e) => e.status === "approved")
        : entries;

  return (
    <div>
      <p style={{ color: "var(--muted)", marginTop: 0 }}>
        Approve Best of the Month entries, edit titles/descriptions any time,
        or delete posts. Voting is one per category per visitor each month.
      </p>
      {blobOk === false && (
        <div className="msg msg-err" style={{ marginBottom: "0.75rem" }}>
          <strong>Storage warning:</strong>{" "}
          <code>BLOB_READ_WRITE_TOKEN</code> is not set on this deployment.
          Photos will not stick across servers. In Vercel: connect your Blob
          store, add the token under Environment Variables (Production), then
          Redeploy.
        </div>
      )}
      {blobOk === true && (
        <p style={{ color: "var(--muted)", fontSize: "0.88rem" }}>
          Blob storage: connected (photos and approvals persist site-wide).
        </p>
      )}
      {msg && <div className="msg msg-ok">{msg}</div>}

      <div className="hero-actions" style={{ marginBottom: "1rem" }}>
        <button
          type="button"
          className={`btn btn-sm ${filter === "pending" ? "btn-primary" : "btn-ghost"}`}
          onClick={() => setFilter("pending")}
        >
          Pending ({entries.filter((e) => e.status === "pending").length})
        </button>
        <button
          type="button"
          className={`btn btn-sm ${filter === "approved" ? "btn-primary" : "btn-ghost"}`}
          onClick={() => setFilter("approved")}
        >
          Approved ({entries.filter((e) => e.status === "approved").length})
        </button>
        <button
          type="button"
          className={`btn btn-sm ${filter === "all" ? "btn-primary" : "btn-ghost"}`}
          onClick={() => setFilter("all")}
        >
          All ({entries.length})
        </button>
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          disabled={busy}
          onClick={() => act("tabulate-previous")}
        >
          Tabulate previous month now
        </button>
      </div>

      {visible.length === 0 ? (
        <div className="empty-state">No entries in this filter.</div>
      ) : (
        <div className="admin-list">
          {visible.map((e) => {
            const isEditing = editingId === e.id && draft;
            return (
              <article key={e.id} className="about-panel admin-list-item">
                <div className="card-meta">
                  <span className="pill">{e.status}</span>
                  <span className="pill bom-admin-cat">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={BOM_CATEGORY_META[e.category]?.art}
                      alt=""
                      width={22}
                      height={22}
                      className="bom-admin-cat-art"
                    />
                    {BOM_CATEGORY_META[e.category]?.label || e.category}
                  </span>
                  <span>{e.monthKey}</span>
                  <span>{e.votes} votes</span>
                </div>

                {isEditing ? (
                  <div className="form-grid" style={{ marginTop: "0.5rem" }}>
                    <div className="form-row">
                      <div className="field">
                        <label htmlFor={`bom-edit-title-${e.id}`}>Title</label>
                        <input
                          id={`bom-edit-title-${e.id}`}
                          value={draft.title}
                          onChange={(ev) =>
                            setDraft({ ...draft, title: ev.target.value })
                          }
                          maxLength={80}
                          required
                        />
                      </div>
                      <div className="field">
                        <label htmlFor={`bom-edit-by-${e.id}`}>
                          Submitted by
                        </label>
                        <input
                          id={`bom-edit-by-${e.id}`}
                          value={draft.submitterName}
                          onChange={(ev) =>
                            setDraft({
                              ...draft,
                              submitterName: ev.target.value,
                            })
                          }
                          maxLength={60}
                          required
                        />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="field">
                        <label htmlFor={`bom-edit-cat-${e.id}`}>Category</label>
                        <select
                          id={`bom-edit-cat-${e.id}`}
                          value={draft.category}
                          onChange={(ev) =>
                            setDraft({
                              ...draft,
                              category: ev.target.value as BomCategory,
                            })
                          }
                        >
                          {BOM_CATEGORIES.map((c) => (
                            <option key={c} value={c}>
                              {BOM_CATEGORY_META[c].label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="field">
                        <label htmlFor={`bom-edit-status-${e.id}`}>
                          Status
                        </label>
                        <select
                          id={`bom-edit-status-${e.id}`}
                          value={draft.status}
                          onChange={(ev) =>
                            setDraft({
                              ...draft,
                              status: ev.target
                                .value as BomEntry["status"],
                            })
                          }
                        >
                          <option value="pending">pending</option>
                          <option value="approved">approved</option>
                          <option value="rejected">rejected</option>
                        </select>
                      </div>
                    </div>
                    <div className="field">
                      <label htmlFor={`bom-edit-desc-${e.id}`}>
                        Description
                      </label>
                      <textarea
                        id={`bom-edit-desc-${e.id}`}
                        rows={3}
                        maxLength={500}
                        value={draft.description}
                        onChange={(ev) =>
                          setDraft({ ...draft, description: ev.target.value })
                        }
                        placeholder="Optional description"
                      />
                    </div>
                    <div className="hero-actions">
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        disabled={busy}
                        onClick={() => saveEdit(e.id, false)}
                      >
                        Save changes
                      </button>
                      {e.status !== "approved" && (
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          disabled={busy}
                          onClick={() => saveEdit(e.id, true)}
                        >
                          Save &amp; approve
                        </button>
                      )}
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        disabled={busy}
                        onClick={cancelEdit}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 style={{ margin: "0.4rem 0" }}>{e.title}</h3>
                    <p
                      style={{
                        margin: "0 0 0.5rem",
                        color: "var(--muted)",
                      }}
                    >
                      by {e.submitterName}
                      {e.description ? ` — ${e.description}` : ""}
                    </p>
                  </>
                )}

                <p style={{ margin: "0 0 0.65rem" }}>
                  <a
                    href={e.imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open {e.fileType === "pdf" ? "PDF" : "image"}
                  </a>
                </p>
                {e.fileType === "image" && !brokenImages[e.id] && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={e.imageUrl}
                    alt=""
                    style={{
                      maxWidth: "220px",
                      borderRadius: 12,
                      marginBottom: "0.75rem",
                      display: "block",
                    }}
                    onError={() =>
                      setBrokenImages((prev) => ({ ...prev, [e.id]: true }))
                    }
                  />
                )}
                {e.fileType === "image" && brokenImages[e.id] && (
                  <p
                    style={{
                      margin: "0 0 0.65rem",
                      color: "#9a3a2e",
                      fontSize: "0.9rem",
                    }}
                  >
                    Image failed to load (URL may be from before Blob was set
                    up). Ask the villager to re-submit a new photo.
                  </p>
                )}

                {!isEditing && (
                  <div className="hero-actions">
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      disabled={busy}
                      onClick={() => startEdit(e)}
                    >
                      Edit text
                    </button>
                    {e.status !== "approved" && (
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        disabled={busy}
                        onClick={() => act("approve", e.id)}
                      >
                        Approve
                      </button>
                    )}
                    {e.status === "approved" && (
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        disabled={busy}
                        onClick={() => act("pending", e.id)}
                      >
                        Unpublish
                      </button>
                    )}
                    {e.status !== "rejected" && (
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        disabled={busy}
                        onClick={() => act("reject", e.id)}
                      >
                        Reject
                      </button>
                    )}
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      disabled={busy}
                      onClick={() => {
                        if (
                          typeof window !== "undefined" &&
                          window.confirm(
                            `Permanently delete “${e.title}”? This removes it from the live site and cannot be undone.`
                          )
                        ) {
                          act("delete", e.id);
                        }
                      }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
