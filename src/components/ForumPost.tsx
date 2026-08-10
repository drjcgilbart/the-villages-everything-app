"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MemberBadgesRow } from "@/components/MemberBadgesRow";
import { getForumEditToken } from "@/lib/forumClient";
import { formatDate } from "@/lib/format";
import type { BadgeDef } from "@/lib/memberBadgeTypes";

type Kind = "thread" | "reply";

type Props = {
  kind: Kind;
  id: string;
  authorName: string;
  authorMemberId?: string | null;
  /** Precomputed on the server — avoid pulling fs-backed badge lookup into the client bundle */
  badges?: BadgeDef[];
  body: string;
  title?: string;
  createdAt: string;
  editedAt?: string | null;
  locked?: boolean;
  className?: string;
};

export function ForumPost({
  kind,
  id,
  authorName,
  authorMemberId,
  badges = [],
  body,
  title,
  createdAt,
  editedAt,
  locked,
  className = "",
}: Props) {
  const router = useRouter();
  const [memberId, setMemberId] = useState<string | null>(null);
  const [hasToken, setHasToken] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(title || "");
  const [draftBody, setDraftBody] = useState(body);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setHasToken(!!getForumEditToken(id));
    setDraftTitle(title || "");
    setDraftBody(body);
  }, [id, title, body]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/members/me", { cache: "no-store", credentials: "same-origin" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled) return;
        const mid = data?.member?.id || data?.id || null;
        setMemberId(typeof mid === "string" ? mid : null);
      })
      .catch(() => {
        if (!cancelled) setMemberId(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const isOwner =
    hasToken ||
    (!!memberId && !!authorMemberId && memberId === authorMemberId);

  async function save() {
    setBusy(true);
    setError(null);
    try {
      const editToken = getForumEditToken(id);
      const endpoint =
        kind === "thread" ? "/api/forum/threads" : "/api/forum/replies";
      const payload: Record<string, unknown> = {
        id,
        body: draftBody,
        editToken: editToken || undefined,
      };
      if (kind === "thread") payload.title = draftTitle;

      const res = await fetch(endpoint, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not save changes");
      setEditing(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save changes");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={`forum-post about-panel ${className}`.trim()}>
      <div className="forum-post-head">
        <strong className="member-name">
          <span className="member-name-text">{authorName}</span>
          <MemberBadgesRow badges={badges} />
        </strong>
        <div className="forum-post-head-meta">
          <time dateTime={createdAt}>{formatDate(createdAt)}</time>
          {editedAt ? (
            <span className="forum-edited-label" title={formatDate(editedAt)}>
              · edited
            </span>
          ) : null}
        </div>
      </div>

      {editing ? (
        <div className="forum-edit-form">
          {kind === "thread" && (
            <div className="field">
              <label htmlFor={`edit-title-${id}`}>Title</label>
              <input
                id={`edit-title-${id}`}
                value={draftTitle}
                onChange={(e) => setDraftTitle(e.target.value)}
                maxLength={140}
                required
              />
            </div>
          )}
          <div className="field">
            <label htmlFor={`edit-body-${id}`}>Message</label>
            <textarea
              id={`edit-body-${id}`}
              value={draftBody}
              onChange={(e) => setDraftBody(e.target.value)}
              rows={kind === "thread" ? 5 : 4}
              maxLength={5000}
              required
            />
          </div>
          {error && <div className="msg msg-err">{error}</div>}
          <div className="admin-actions">
            <button
              type="button"
              className="btn btn-primary btn-sm"
              disabled={busy}
              onClick={save}
            >
              {busy ? "Saving…" : "Save changes"}
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              disabled={busy}
              onClick={() => {
                setEditing(false);
                setDraftTitle(title || "");
                setDraftBody(body);
                setError(null);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="forum-post-body">
            {body.split(/\n+/).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          {isOwner && !locked ? (
            <div className="forum-post-actions">
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => setEditing(true)}
              >
                Edit
              </button>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
