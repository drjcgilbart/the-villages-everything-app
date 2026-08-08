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

type StorageInfo = {
  redis: boolean;
  blob: boolean;
  durable: boolean;
};

export function AdminBestOfMonthPanel() {
  const [entries, setEntries] = useState<BomEntry[]>([]);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"pending" | "approved" | "all">(
    "pending"
  );
  const [storage, setStorage] = useState<StorageInfo | null>(null);
  const [publicPendingCount, setPublicPendingCount] = useState<number | null>(
    null
  );
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<EditDraft | null>(null);
  const [lastLoadedAt, setLastLoadedAt] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoadError(null);
    try {
      // Primary: admin API
      const res = await fetch("/api/best-of-month/admin", {
        cache: "no-store",
        credentials: "same-origin",
      });
      const data = await res.json().catch(() => ({}));

      // Cross-check: public feed (also returns pendingEntries when admin cookie present)
      const pubRes = await fetch("/api/best-of-month/entries", {
        cache: "no-store",
        credentials: "same-origin",
      });
      const pub = await pubRes.json().catch(() => ({}));
      if (typeof pub.pendingCount === "number") {
        setPublicPendingCount(pub.pendingCount);
      }
      if (pub.storage) {
        setStorage({
          redis: Boolean(pub.storage.redis),
          blob: Boolean(pub.storage.blob),
          durable: Boolean(pub.storage.durable),
        });
      }

      if (res.status === 401) {
        setLoadError(
          "Admin session expired or not authorized. Log out and log back into Admin, then open Best of Month again."
        );
        setEntries([]);
        return;
      }

      if (!res.ok) {
        // Fallback: use pendingEntries from public feed if admin cookie worked there
        const fallback = Array.isArray(pub.pendingEntries)
          ? (pub.pendingEntries as BomEntry[])
          : [];
        if (fallback.length) {
          setEntries(fallback);
          setLoadError(
            `Admin list API failed (${data.error || res.status}). Showing ${fallback.length} pending from backup feed — refresh after redeploy.`
          );
          setLastLoadedAt(new Date().toISOString());
          return;
        }
        setLoadError(data.error || `Failed to load (${res.status})`);
        setEntries([]);
        return;
      }

      let list: BomEntry[] = Array.isArray(data.entries) ? data.entries : [];

      // If admin API returned no pendings but public feed knows about some, merge them in
      const pubPending = Array.isArray(pub.pendingEntries)
        ? (pub.pendingEntries as BomEntry[])
        : [];
      if (pubPending.length) {
        const byId = new Map(list.map((e) => [e.id, e]));
        for (const e of pubPending) {
          if (e?.id && !byId.has(e.id)) byId.set(e.id, e);
        }
        list = Array.from(byId.values());
      }

      setEntries(list);
      if (data.blobConfigured !== undefined || data.redisConfigured !== undefined) {
        setStorage({
          redis: Boolean(data.redisConfigured),
          blob: Boolean(data.blobConfigured),
          durable: Boolean(data.durableConfigured),
        });
      }
      setLastLoadedAt(new Date().toISOString());

      const pendingN = list.filter((e) => e.status === "pending").length;
      if (
        typeof pub.pendingCount === "number" &&
        pub.pendingCount > pendingN
      ) {
        setLoadError(
          `Warning: site reports ${pub.pendingCount} pending submission(s) but this list only has ${pendingN}. Click Refresh. If it stays wrong, Redis/Blob may be out of sync.`
        );
      }
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : "Failed to load");
    }
  }, []);

  useEffect(() => {
    load().catch(() => undefined);
    const t = setInterval(() => {
      load().catch(() => undefined);
    }, 12_000);
    return () => clearInterval(t);
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
        credentials: "same-origin",
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
        credentials: "same-origin",
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

  const pendingN = entries.filter((e) => e.status === "pending").length;
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
        This list auto-refreshes every 12 seconds.
      </p>

      {storage && !storage.durable && (
        <div className="msg msg-err" style={{ marginBottom: "0.75rem" }}>
          <strong>Storage warning:</strong> No durable storage is configured.
          Member submissions will not stick. Add free Upstash Redis (
          <code>UPSTASH_REDIS_REST_URL</code> +{" "}
          <code>UPSTASH_REDIS_REST_TOKEN</code>) in Vercel Production env, then
          Redeploy.
        </div>
      )}
      {storage && storage.durable && !storage.redis && storage.blob && (
        <div className="msg msg-err" style={{ marginBottom: "0.75rem" }}>
          <strong>Storage tip:</strong> Only Vercel Blob is configured. If Blob
          Hobby is over quota, submissions fail until you add free Redis.
        </div>
      )}
      {storage && storage.durable && (
        <p style={{ color: "var(--muted)", fontSize: "0.88rem" }}>
          Durable storage: {storage.redis ? "Redis on" : "Redis off"}
          {" · "}
          {storage.blob ? "Blob on" : "Blob off"}
          {publicPendingCount != null
            ? ` · site pending count: ${publicPendingCount}`
            : ""}
          {lastLoadedAt
            ? ` · last refresh ${new Date(lastLoadedAt).toLocaleTimeString()}`
            : ""}
        </p>
      )}

      {loadError && (
        <div className="msg msg-err" style={{ marginBottom: "0.75rem" }}>
          {loadError}
        </div>
      )}
      {msg && <div className="msg msg-ok">{msg}</div>}

      <div className="hero-actions" style={{ marginBottom: "1rem" }}>
        <button
          type="button"
          className={`btn btn-sm ${filter === "pending" ? "btn-primary" : "btn-ghost"}`}
          onClick={() => setFilter("pending")}
        >
          Pending ({pendingN}
          {publicPendingCount != null && publicPendingCount !== pendingN
            ? ` / site ${publicPendingCount}`
            : ""}
          )
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
          onClick={() => load()}
        >
          Refresh now
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
        <div className="empty-state">
          {filter === "pending"
            ? publicPendingCount && publicPendingCount > 0
              ? `No pending rows in this panel, but the site reports ${publicPendingCount} pending. Click Refresh now. If still empty, log out of Admin and log back in.`
              : "No pending entries waiting for approval."
            : "No entries in this filter."}
        </div>
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
                    Image failed to load (storage may still be blocked for this
                    file). You can still approve/reject the text entry.
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
