"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { VillageLocalBundle, VillageLocalKind } from "@/lib/villageLocalTypes";
import {
  TEAMREACH_ANDROID,
  TEAMREACH_IOS,
  TEAMREACH_SITE,
  facebookGroupSearchUrl,
} from "@/lib/villageAmenities";

function CopyCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard may be blocked */
    }
  }

  return (
    <button
      type="button"
      className="village-code"
      onClick={copy}
      aria-label={`Copy TeamReach code ${code}`}
    >
      <span className="village-code-value">{code}</span>
      <span className="village-code-action">{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}

export function VillageLocalHub({
  villageSlug,
  villageName,
  initial,
}: {
  villageSlug: string;
  villageName: string;
  initial: VillageLocalBundle;
}) {
  const router = useRouter();
  const [kind, setKind] = useState<VillageLocalKind>("facebook");
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [code, setCode] = useState("");
  const [note, setNote] = useState("");
  const [body, setBody] = useState("");
  const [submittedBy, setSubmittedBy] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const fbSearch = facebookGroupSearchUrl(villageName);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setOk(null);
    try {
      const res = await fetch("/api/village-local", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          villageSlug,
          kind,
          title,
          url,
          code,
          note,
          body,
          submittedBy,
          website: honeypot,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not save");
      setOk(
        kind === "teamreach"
          ? "TeamReach group is on the village page."
          : kind === "facebook"
            ? "Facebook group is on the village page."
            : "Tip is on the village page."
      );
      setTitle("");
      setUrl("");
      setCode("");
      setNote("");
      setBody("");
      setOpen(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="village-local-hub about-panel">
      <div className="section-head" style={{ marginBottom: "0.85rem" }}>
        <div>
          <h2 style={{ margin: 0 }}>Village connections</h2>
          <p style={{ margin: "0.35rem 0 0" }}>
            Unique to the <strong>Village of {villageName}</strong> — Facebook
            groups, TeamReach codes, and neighbor tips. Not a Villages-wide
            board.
          </p>
        </div>
      </div>

      <div className="village-hub-grid">
        <div className="village-hub-col">
          <h3 className="village-hub-h">Facebook groups</h3>
          {initial.facebook.length === 0 ? (
            <p className="village-hub-empty">
              No village Facebook group on file yet. Search Facebook or add the
              one your street uses.
            </p>
          ) : (
            <ul className="village-hub-list">
              {initial.facebook.map((g) => (
                <li key={g.id}>
                  <a href={g.url} target="_blank" rel="noreferrer">
                    {g.title}
                  </a>
                  {g.note && <span>{g.note}</span>}
                  {g.source === "neighbor" && (
                    <em>Added by a neighbor</em>
                  )}
                </li>
              ))}
            </ul>
          )}
          <p className="village-hub-actions">
            <a href={fbSearch} target="_blank" rel="noreferrer" className="text-link">
              Search Facebook for “Village of {villageName}” →
            </a>
          </p>
        </div>

        <div className="village-hub-col">
          <h3 className="village-hub-h">TeamReach</h3>
          <p className="village-hub-lead">
            Neighbors join a village (or street) group by installing the free{" "}
            <a href={TEAMREACH_SITE} target="_blank" rel="noreferrer">
              TeamReach
            </a>{" "}
            app and entering a code. We never invent codes — only list ones
            neighbors share.
          </p>
          {initial.teamreach.length === 0 ? (
            <p className="village-hub-empty">
              No TeamReach code on file for {villageName} yet. If you have the
              village or street code, add it so newcomers can join in one tap.
            </p>
          ) : (
            <ul className="village-hub-list village-hub-codes">
              {initial.teamreach.map((g) => (
                <li key={g.id}>
                  <strong>{g.title}</strong>
                  {g.code && <CopyCode code={g.code} />}
                  {g.note && <span>{g.note}</span>}
                  {g.source === "neighbor" && (
                    <em>Added by a neighbor</em>
                  )}
                </li>
              ))}
            </ul>
          )}
          <p className="village-hub-actions village-hub-store">
            <a href={TEAMREACH_IOS} target="_blank" rel="noreferrer">
              iPhone
            </a>
            <span aria-hidden="true"> · </span>
            <a href={TEAMREACH_ANDROID} target="_blank" rel="noreferrer">
              Android
            </a>
            <span aria-hidden="true"> · </span>
            Open the app → Join group → paste the code.
          </p>
        </div>
      </div>

      {initial.tips.length > 0 && (
        <div className="village-tip-list">
          <h3 className="village-hub-h">Neighbor notes</h3>
          <ul className="topic-highlight-list">
            {initial.tips.map((t) => (
              <li key={t.id}>
                <strong>{t.title}</strong>
                <span>{t.body}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!open ? (
        <button
          type="button"
          className="btn btn-primary btn-sm"
          style={{ marginTop: "1rem" }}
          onClick={() => setOpen(true)}
        >
          Add a group, code, or tip for {villageName}
        </button>
      ) : (
        <form className="form-grid" style={{ marginTop: "1rem" }} onSubmit={submit}>
          <h3 style={{ margin: 0 }}>Help the next cart that moves in</h3>
          <p className="review-form-lead">
            Facebook group links and TeamReach codes only — no street addresses,
            no invented codes. Tips stay short and neighborly.
          </p>
          <div className="field">
            <label htmlFor="vloc-kind">What are you adding?</label>
            <select
              id="vloc-kind"
              value={kind}
              onChange={(e) => setKind(e.target.value as VillageLocalKind)}
            >
              <option value="facebook">Facebook group</option>
              <option value="teamreach">TeamReach code</option>
              <option value="tip">Local tip</option>
            </select>
          </div>
          <div className="form-row">
            <div className="field">
              <label htmlFor="vloc-title">
                {kind === "tip" ? "Tip title" : "Group name"}
              </label>
              <input
                id="vloc-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                maxLength={kind === "facebook" ? 100 : 80}
                placeholder={
                  kind === "teamreach"
                    ? "Edenfield neighbors"
                    : kind === "facebook"
                      ? "Village of Edenfield…"
                      : "Pools on McNeill Drive"
                }
              />
            </div>
            <div className="field">
              <label htmlFor="vloc-by">Your name (optional)</label>
              <input
                id="vloc-by"
                value={submittedBy}
                onChange={(e) => setSubmittedBy(e.target.value)}
                maxLength={60}
                placeholder="First name is plenty"
              />
            </div>
          </div>
          {kind === "facebook" && (
            <>
              <div className="field">
                <label htmlFor="vloc-url">Facebook group URL</label>
                <input
                  id="vloc-url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                  inputMode="url"
                  placeholder="https://www.facebook.com/groups/…"
                />
              </div>
              <div className="field">
                <label htmlFor="vloc-note">Note (optional)</label>
                <input
                  id="vloc-note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  maxLength={160}
                  placeholder="Private · street captains · ladies coffee"
                />
              </div>
            </>
          )}
          {kind === "teamreach" && (
            <>
              <div className="field">
                <label htmlFor="vloc-code">Join code</label>
                <input
                  id="vloc-code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                  autoCapitalize="off"
                  autoCorrect="off"
                  spellCheck={false}
                  placeholder="The code from the app — don’t guess"
                />
              </div>
              <div className="field">
                <label htmlFor="vloc-note-tr">Who it’s for (optional)</label>
                <input
                  id="vloc-note-tr"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  maxLength={160}
                  placeholder="Whole village · one street · pickleball crew"
                />
              </div>
            </>
          )}
          {kind === "tip" && (
            <div className="field">
              <label htmlFor="vloc-body">The tip</label>
              <textarea
                id="vloc-body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                required
                rows={3}
                maxLength={600}
                placeholder="Which rec, which gate, which cart path — keep addresses private."
              />
            </div>
          )}
          <input
            type="text"
            name="website"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            className="forum-honeypot"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
          />
          {error && <div className="msg msg-err">{error}</div>}
          {ok && <div className="msg msg-ok">{ok}</div>}
          <div className="admin-actions">
            <button type="submit" className="btn btn-primary" disabled={busy}>
              {busy ? "Saving…" : "Add to this village"}
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
      )}
    </section>
  );
}
