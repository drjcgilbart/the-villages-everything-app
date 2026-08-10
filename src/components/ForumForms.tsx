"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const NAME_KEY = "tvi-forum-display-name";

function useDisplayName() {
  const [authorName, setAuthorName] = useState("");
  useEffect(() => {
    try {
      const saved = localStorage.getItem(NAME_KEY);
      if (saved) setAuthorName(saved);
    } catch {
      /* ignore */
    }
  }, []);
  function persist(name: string) {
    setAuthorName(name);
    try {
      localStorage.setItem(NAME_KEY, name.trim().slice(0, 40));
    } catch {
      /* ignore */
    }
  }
  return { authorName, setAuthorName: persist, setAuthorNameLocal: setAuthorName };
}

export function NewThreadForm({
  categoryId,
  categorySlug,
}: {
  categoryId: string;
  categorySlug: string;
}) {
  const router = useRouter();
  const { authorName, setAuthorName, setAuthorNameLocal } = useDisplayName();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/forum/threads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categoryId,
          title,
          authorName,
          body,
          website: honeypot,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not start conversation");
      const threadId = data?.thread?.id;
      if (!threadId) {
        // Honeypot silent-success or incomplete save — stay put with a clear error
        throw new Error(
          data.error ||
            "Conversation was not created. Please try again in a moment."
        );
      }
      setAuthorName(authorName);
      setTitle("");
      setBody("");
      setOpen(false);
      router.push(`/forums/${categorySlug}/${threadId}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start conversation");
    } finally {
      setBusy(false);
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => setOpen(true)}
      >
        Start a conversation
      </button>
    );
  }

  return (
    <form className="form-grid about-panel forum-form" onSubmit={submit}>
      <h3 style={{ margin: 0 }}>Start a conversation</h3>
      <p className="review-form-lead">
        Create a sub-topic in this forum. Be kind — this is your neighbors.
      </p>
      <div className="form-row">
        <div className="field">
          <label htmlFor="thread-name">Display name</label>
          <input
            id="thread-name"
            value={authorName}
            onChange={(e) => setAuthorNameLocal(e.target.value)}
            required
            maxLength={40}
            placeholder="CartNewbie"
          />
        </div>
        <div className="field">
          <label htmlFor="thread-title">Conversation title</label>
          <input
            id="thread-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={140}
            placeholder="Best early-bird that still feels special?"
          />
        </div>
      </div>
      <div className="field">
        <label htmlFor="thread-body">Opening message</label>
        <textarea
          id="thread-body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
          rows={4}
          maxLength={5000}
          placeholder="What’s on your mind?"
        />
      </div>
      {/* Honeypot — random name so password managers don't autofill it */}
      <input
        type="text"
        name="tvi_forum_hp"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        className="forum-honeypot"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />
      {error && <div className="msg msg-err">{error}</div>}
      <div className="admin-actions">
        <button type="submit" className="btn btn-primary" disabled={busy}>
          {busy ? "Posting…" : "Post conversation"}
        </button>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => setOpen(false)}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export function ReplyForm({ threadId }: { threadId: string }) {
  const router = useRouter();
  const { authorName, setAuthorName, setAuthorNameLocal } = useDisplayName();
  const [body, setBody] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/forum/replies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          threadId,
          authorName,
          body,
          website: honeypot,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not post");
      if (!data?.reply?.id) {
        throw new Error(
          data.error || "Reply was not saved. Please try again in a moment."
        );
      }
      setAuthorName(authorName);
      setBody("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not post");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="form-grid about-panel forum-form" onSubmit={submit}>
      <h3 style={{ margin: 0 }}>Join the chat</h3>
      <div className="field">
        <label htmlFor="reply-name">Display name</label>
        <input
          id="reply-name"
          value={authorName}
          onChange={(e) => setAuthorNameLocal(e.target.value)}
          required
          maxLength={40}
          placeholder="Your name or nickname"
        />
      </div>
      <div className="field">
        <label htmlFor="reply-body">Message</label>
        <textarea
          id="reply-body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
          rows={3}
          maxLength={5000}
          placeholder="Keep it neighborly…"
        />
      </div>
      <input
        type="text"
        name="tvi_forum_hp"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        className="forum-honeypot"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />
      {error && <div className="msg msg-err">{error}</div>}
      <button type="submit" className="btn btn-primary" disabled={busy}>
        {busy ? "Sending…" : "Post reply"}
      </button>
    </form>
  );
}
