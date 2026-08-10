"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { formatDate } from "@/lib/format";
import type { PublicForumReply, PublicForumThread } from "@/lib/forumTypes";

type Category = {
  id: string;
  slug: string;
  title: string;
  emoji: string;
};

/**
 * Moderate Community Forums — edit/hide/delete any conversation or message.
 */
export function AdminForumPanel() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [threads, setThreads] = useState<PublicForumThread[]>([]);
  const [replies, setReplies] = useState<PublicForumReply[]>([]);
  const [filter, setFilter] = useState("");
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(
    null
  );
  const [busy, setBusy] = useState(false);
  const [editThread, setEditThread] = useState<PublicForumThread | null>(null);
  const [editReply, setEditReply] = useState<PublicForumReply | null>(null);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftBody, setDraftBody] = useState("");
  const [draftAuthor, setDraftAuthor] = useState("");
  const [draftCategoryId, setDraftCategoryId] = useState("");

  const flash = (kind: "ok" | "err", text: string) => {
    setMsg({ kind, text });
    setTimeout(() => setMsg(null), 4000);
  };

  const loadAll = useCallback(async () => {
    const [tRes, rRes] = await Promise.all([
      fetch("/api/forum/threads?all=1", {
        cache: "no-store",
        credentials: "same-origin",
      }),
      fetch("/api/forum/replies?all=1", {
        cache: "no-store",
        credentials: "same-origin",
      }),
    ]);
    const tData = await tRes.json();
    if (!tRes.ok) throw new Error(tData.error || "Could not load conversations");
    setThreads(tData.threads || []);
    if (Array.isArray(tData.categories)) setCategories(tData.categories);

    const rData = await rRes.json();
    if (!rRes.ok) throw new Error(rData.error || "Could not load messages");
    setReplies(rData.replies || []);
  }, []);

  useEffect(() => {
    loadAll().catch((err) => flash("err", err.message || "Load failed"));
  }, [loadAll]);

  const categoryById = useMemo(() => {
    return new Map(categories.map((c) => [c.id, c]));
  }, [categories]);

  const replyCountByThread = useMemo(() => {
    const m = new Map<string, number>();
    for (const r of replies) {
      m.set(r.threadId, (m.get(r.threadId) || 0) + 1);
    }
    return m;
  }, [replies]);

  const q = filter.trim().toLowerCase();
  const filteredThreads = useMemo(() => {
    if (!q) return threads;
    return threads.filter((t) => {
      const cat = categoryById.get(t.categoryId)?.title || "";
      return (
        t.title.toLowerCase().includes(q) ||
        t.body.toLowerCase().includes(q) ||
        t.authorName.toLowerCase().includes(q) ||
        cat.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q)
      );
    });
  }, [threads, q, categoryById]);

  const filteredReplies = useMemo(() => {
    if (!q) return replies;
    return replies.filter(
      (r) =>
        r.body.toLowerCase().includes(q) ||
        r.authorName.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q) ||
        r.threadId.toLowerCase().includes(q)
    );
  }, [replies, q]);

  function openEditThread(t: PublicForumThread) {
    setEditReply(null);
    setEditThread(t);
    setDraftTitle(t.title);
    setDraftBody(t.body);
    setDraftAuthor(t.authorName);
    setDraftCategoryId(t.categoryId);
  }

  function openEditReply(r: PublicForumReply) {
    setEditThread(null);
    setEditReply(r);
    setDraftBody(r.body);
    setDraftAuthor(r.authorName);
  }

  async function saveThread() {
    if (!editThread) return;
    setBusy(true);
    try {
      const res = await fetch("/api/forum/threads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          id: editThread.id,
          title: draftTitle,
          body: draftBody,
          authorName: draftAuthor,
          categoryId: draftCategoryId || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");
      setEditThread(null);
      await loadAll();
      flash("ok", "Conversation updated");
    } catch (err) {
      flash("err", err instanceof Error ? err.message : "Update failed");
    } finally {
      setBusy(false);
    }
  }

  async function saveReply() {
    if (!editReply) return;
    setBusy(true);
    try {
      const res = await fetch("/api/forum/replies", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          id: editReply.id,
          body: draftBody,
          authorName: draftAuthor,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");
      setEditReply(null);
      await loadAll();
      flash("ok", "Message updated");
    } catch (err) {
      flash("err", err instanceof Error ? err.message : "Update failed");
    } finally {
      setBusy(false);
    }
  }

  async function patchThread(
    id: string,
    patch: Record<string, unknown>,
    label: string
  ) {
    setBusy(true);
    try {
      const res = await fetch("/api/forum/threads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ id, ...patch }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");
      await loadAll();
      flash("ok", label);
    } catch (err) {
      flash("err", err instanceof Error ? err.message : "Update failed");
    } finally {
      setBusy(false);
    }
  }

  async function patchReply(
    id: string,
    patch: Record<string, unknown>,
    label: string
  ) {
    setBusy(true);
    try {
      const res = await fetch("/api/forum/replies", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ id, ...patch }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");
      await loadAll();
      flash("ok", label);
    } catch (err) {
      flash("err", err instanceof Error ? err.message : "Update failed");
    } finally {
      setBusy(false);
    }
  }

  async function removeThread(id: string) {
    if (
      !confirm(
        "Permanently delete this conversation and all of its replies? This cannot be undone."
      )
    ) {
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(
        `/api/forum/threads?id=${encodeURIComponent(id)}`,
        { method: "DELETE", credentials: "same-origin" }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");
      await loadAll();
      flash("ok", "Conversation deleted");
    } catch (err) {
      flash("err", err instanceof Error ? err.message : "Delete failed");
    } finally {
      setBusy(false);
    }
  }

  async function removeReply(id: string) {
    if (!confirm("Permanently delete this message?")) return;
    setBusy(true);
    try {
      const res = await fetch(
        `/api/forum/replies?id=${encodeURIComponent(id)}`,
        { method: "DELETE", credentials: "same-origin" }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");
      await loadAll();
      flash("ok", "Message deleted");
    } catch (err) {
      flash("err", err instanceof Error ? err.message : "Delete failed");
    } finally {
      setBusy(false);
    }
  }

  function catLabel(categoryId: string) {
    const c = categoryById.get(categoryId);
    return c ? `${c.emoji} ${c.title}` : categoryId;
  }

  function threadTitle(threadId: string) {
    return threads.find((t) => t.id === threadId)?.title || threadId;
  }

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Community Forums</h2>
      <p className="panel-hint">
        Edit or remove any conversation or reply. Hide soft-removes from the
        public site; Delete permanently removes the record.
      </p>
      {msg && <div className={`msg msg-${msg.kind}`}>{msg.text}</div>}

      <div className="field" style={{ maxWidth: 420, marginBottom: "1rem" }}>
        <label htmlFor="forum-admin-filter">Search</label>
        <input
          id="forum-admin-filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Title, author, message text…"
        />
      </div>

      {(editThread || editReply) && (
        <div className="about-panel" style={{ marginBottom: "1.25rem" }}>
          <h3 style={{ marginTop: 0 }}>
            {editThread ? "Edit conversation" : "Edit message"}
          </h3>
          {editThread && (
            <>
              <div className="field">
                <label htmlFor="af-title">Title</label>
                <input
                  id="af-title"
                  value={draftTitle}
                  onChange={(e) => setDraftTitle(e.target.value)}
                  maxLength={140}
                />
              </div>
              {categories.length > 0 && (
                <div className="field">
                  <label htmlFor="af-cat">Topic</label>
                  <select
                    id="af-cat"
                    value={draftCategoryId}
                    onChange={(e) => setDraftCategoryId(e.target.value)}
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.emoji} {c.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </>
          )}
          <div className="field">
            <label htmlFor="af-author">Display name</label>
            <input
              id="af-author"
              value={draftAuthor}
              onChange={(e) => setDraftAuthor(e.target.value)}
              maxLength={40}
            />
          </div>
          <div className="field">
            <label htmlFor="af-body">Message</label>
            <textarea
              id="af-body"
              value={draftBody}
              onChange={(e) => setDraftBody(e.target.value)}
              rows={5}
              maxLength={5000}
            />
          </div>
          <div className="admin-actions">
            <button
              type="button"
              className="btn btn-primary btn-sm"
              disabled={busy}
              onClick={() => (editThread ? saveThread() : saveReply())}
            >
              {busy ? "Saving…" : "Save"}
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              disabled={busy}
              onClick={() => {
                setEditThread(null);
                setEditReply(null);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <h3>
        Conversations <span className="pill">{filteredThreads.length}</span>
      </h3>
      <div className="admin-list">
        {filteredThreads.length === 0 && (
          <p className="panel-hint">No conversations match.</p>
        )}
        {filteredThreads.map((t) => (
          <div key={t.id} className="admin-item">
            <div>
              <strong>
                {t.title}{" "}
                {t.hidden ? (
                  <span className="status-tag status-pending">hidden</span>
                ) : null}{" "}
                {t.locked ? (
                  <span className="status-tag status-sold">locked</span>
                ) : null}{" "}
                {t.pinned ? (
                  <span className="status-tag status-approved">pinned</span>
                ) : null}
              </strong>
              <span>
                {catLabel(t.categoryId)} · {t.authorName} ·{" "}
                {replyCountByThread.get(t.id) || 0} replies · updated{" "}
                {formatDate(t.updatedAt)}
              </span>
              <span style={{ display: "block", color: "var(--muted)" }}>
                {t.body.slice(0, 160)}
                {t.body.length > 160 ? "…" : ""}
              </span>
            </div>
            <div className="admin-actions">
              <a
                className="btn btn-ghost btn-sm"
                href={`/forums/${categoryById.get(t.categoryId)?.slug || "new-to-the-villages"}/${t.id}`}
                target="_blank"
                rel="noreferrer"
              >
                Open
              </a>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                disabled={busy}
                onClick={() => openEditThread(t)}
              >
                Edit
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                disabled={busy}
                onClick={() =>
                  patchThread(
                    t.id,
                    { hidden: !t.hidden },
                    t.hidden ? "Unhidden" : "Hidden"
                  )
                }
              >
                {t.hidden ? "Unhide" : "Hide"}
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                disabled={busy}
                onClick={() =>
                  patchThread(
                    t.id,
                    { locked: !t.locked },
                    t.locked ? "Unlocked" : "Locked"
                  )
                }
              >
                {t.locked ? "Unlock" : "Lock"}
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                disabled={busy}
                onClick={() =>
                  patchThread(
                    t.id,
                    { pinned: !t.pinned },
                    t.pinned ? "Unpinned" : "Pinned"
                  )
                }
              >
                {t.pinned ? "Unpin" : "Pin"}
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                disabled={busy}
                onClick={() => removeThread(t.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <h3 style={{ marginTop: "1.75rem" }}>
        Messages (replies){" "}
        <span className="pill">{filteredReplies.length}</span>
      </h3>
      <div className="admin-list">
        {filteredReplies.length === 0 && (
          <p className="panel-hint">No replies match.</p>
        )}
        {filteredReplies.map((r) => (
          <div key={r.id} className="admin-item">
            <div>
              <strong>
                {r.authorName}{" "}
                {r.hidden ? (
                  <span className="status-tag status-pending">hidden</span>
                ) : null}
              </strong>
              <span>
                in “{threadTitle(r.threadId)}” · {formatDate(r.createdAt)}
                {r.editedAt ? " · edited" : ""}
              </span>
              <span style={{ display: "block", color: "var(--muted)" }}>
                {r.body.slice(0, 200)}
                {r.body.length > 200 ? "…" : ""}
              </span>
            </div>
            <div className="admin-actions">
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                disabled={busy}
                onClick={() => openEditReply(r)}
              >
                Edit
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                disabled={busy}
                onClick={() =>
                  patchReply(
                    r.id,
                    { hidden: !r.hidden },
                    r.hidden ? "Unhidden" : "Hidden"
                  )
                }
              >
                {r.hidden ? "Unhide" : "Hide"}
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                disabled={busy}
                onClick={() => removeReply(r.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
