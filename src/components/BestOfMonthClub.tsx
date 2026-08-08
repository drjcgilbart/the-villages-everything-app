"use client";

import { useCallback, useEffect, useState } from "react";
import type {
  BomCategory,
  BomEntry,
  BomFileType,
} from "@/lib/bestOfMonthTypes";
import {
  BOM_CATEGORIES,
  BOM_CATEGORY_META,
} from "@/lib/bestOfMonthTypes";

type FeaturedCat = {
  category: BomCategory;
  winnerEntryId: string | null;
  honorableMentionIds: string[];
  winner: BomEntry | null;
  honorableMentions: BomEntry[];
};

type Feed = {
  monthKey: string;
  categories: typeof BOM_CATEGORY_META;
  categoryIds: BomCategory[];
  entriesByCategory: Record<BomCategory, BomEntry[]>;
  myVotes: Partial<Record<BomCategory, string>>;
  lastMonthResults: {
    monthKey: string;
    tabulatedAt: string;
    categories: Record<string, FeaturedCat>;
  } | null;
};

function formatMonth(key: string) {
  const [y, m] = key.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

/**
 * Phone photos are often 5–12 MB. While Vercel Blob is over quota, Redis only
 * accepts ~3 MB — so we resize/compress JPGs in the browser before upload.
 */
async function prepareBomUploadFile(file: File): Promise<File> {
  const name = file.name || "photo.jpg";
  const isPdf =
    file.type === "application/pdf" || /\.pdf$/i.test(name);
  if (isPdf) return file;

  // Already small enough — keep original
  if (file.size <= 2.5 * 1024 * 1024 && file.type === "image/jpeg") {
    return file;
  }

  // Try canvas resize (works for jpeg/png/webp; HEIC may fail in some browsers)
  try {
    const bitmap = await createImageBitmap(file);
    const maxEdge = 1600;
    const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
    const w = Math.max(1, Math.round(bitmap.width * scale));
    const h = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, w, h);
    bitmap.close?.();

    const blob: Blob | null = await new Promise((resolve) =>
      canvas.toBlob((b) => resolve(b), "image/jpeg", 0.82)
    );
    if (!blob || blob.size < 500) return file;

    const base = name.replace(/\.[^.]+$/, "") || "photo";
    return new File([blob], `${base}.jpg`, { type: "image/jpeg" });
  } catch {
    // HEIC / unsupported — send as-is; server will error with a clear message if too large
    return file;
  }
}

function EntryMedia({
  entry,
  large,
  hero,
}: {
  entry: BomEntry;
  large?: boolean;
  /** Full-size for detail modal */
  hero?: boolean;
}) {
  if (entry.fileType === "pdf") {
    return (
      <div
        className={`bom-media bom-media-pdf${large ? " is-large" : ""}${
          hero ? " is-hero" : ""
        }`}
      >
        <a href={entry.imageUrl} target="_blank" rel="noopener noreferrer">
          📄 View PDF
        </a>
        <iframe
          src={entry.imageUrl}
          title={entry.title}
          className={`bom-pdf-frame${hero ? " is-hero" : ""}`}
        />
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={entry.imageUrl}
      alt={entry.title}
      className={`bom-media-img${large ? " is-large" : ""}${
        hero ? " is-hero" : ""
      }`}
    />
  );
}

function CategoryArt({
  cat,
  size = "md",
}: {
  cat: BomCategory;
  size?: "sm" | "md";
}) {
  const meta = BOM_CATEGORY_META[cat];
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={meta.art}
      alt=""
      className={`bom-cat-art bom-cat-art-${size}`}
      width={size === "sm" ? 40 : 56}
      height={size === "sm" ? 40 : 56}
      loading="lazy"
    />
  );
}

export function BestOfMonthClub() {
  const [feed, setFeed] = useState<Feed | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busyVote, setBusyVote] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  /** Entry open in full detail lightbox */
  const [detail, setDetail] = useState<BomEntry | null>(null);

  // Submit form
  const [category, setCategory] = useState<BomCategory>("pet");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitterName, setSubmitterName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  /** Message shown next to the submit form (not only at top of page) */
  const [submitMsg, setSubmitMsg] = useState<{
    kind: "ok" | "err" | "info";
    text: string;
  } | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/best-of-month/entries", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not load");
      setFeed(data);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load");
    }
  }, []);

  useEffect(() => {
    load();
    const t = setInterval(load, 30_000); // live totals
    return () => clearInterval(t);
  }, [load]);

  // Keep detail panel in sync with live vote totals after reload
  useEffect(() => {
    if (!detail || !feed) return;
    const cat = detail.category;
    const fresh = (feed.entriesByCategory[cat] || []).find(
      (e) => e.id === detail.id
    );
    if (fresh) setDetail(fresh);
  }, [feed]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!detail) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setDetail(null);
    }
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [detail]);

  async function vote(entryId: string) {
    setBusyVote(entryId);
    setNote(null);
    try {
      const res = await fetch("/api/best-of-month/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "vote", entryId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Vote failed");
      setNote(data.message || "Vote recorded!");
      await load();
    } catch (e) {
      setNote(e instanceof Error ? e.message : "Vote failed");
    } finally {
      setBusyVote(null);
    }
  }

  function setFileFromInput(next: File | null) {
    setFile(next);
    setSubmitMsg(null);
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return next && next.type.startsWith("image/")
        ? URL.createObjectURL(next)
        : null;
    });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const t = title.trim();
    const who = submitterName.trim();
    if (t.length < 2) {
      setSubmitMsg({ kind: "err", text: "Please enter a name/title for your entry." });
      return;
    }
    if (who.length < 2) {
      setSubmitMsg({ kind: "err", text: "Please enter your name." });
      return;
    }
    if (!file) {
      setSubmitMsg({ kind: "err", text: "Please choose a JPG or PDF file." });
      return;
    }

    setSubmitting(true);
    setSubmitMsg({
      kind: "info",
      text: "Uploading photo… large phone pictures are compressed first. Please wait.",
    });
    setNote(null);

    try {
      // Compress large phone photos so they survive Redis storage (Blob quota)
      setSubmitMsg({
        kind: "info",
        text: `Preparing photo (${Math.round(file.size / 1024)} KB)…`,
      });
      const prepared = await prepareBomUploadFile(file);
      if (prepared.size > 12 * 1024 * 1024) {
        throw new Error(
          "Photo is still over 12 MB after compression. Please choose a smaller JPG (or take a lower-resolution photo)."
        );
      }

      setSubmitMsg({
        kind: "info",
        text: `Uploading ${Math.round(prepared.size / 1024)} KB…`,
      });
      const fd = new FormData();
      fd.append("file", prepared);
      const up = await fetch("/api/best-of-month/upload", {
        method: "POST",
        body: fd,
      });
      let upData: { error?: string; url?: string; fileType?: string } = {};
      try {
        upData = await up.json();
      } catch {
        throw new Error(
          `Photo upload failed (HTTP ${up.status}). Try a smaller JPG.`
        );
      }
      if (!up.ok) {
        throw new Error(upData.error || `Photo upload failed (HTTP ${up.status})`);
      }
      if (!upData.url) {
        throw new Error("Photo upload returned no URL — please try again.");
      }

      setSubmitMsg({ kind: "info", text: "Saving entry for admin approval…" });
      const res = await fetch("/api/best-of-month/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "submit",
          category,
          title: t,
          description,
          submitterName: who,
          imageUrl: upData.url,
          fileType: (upData.fileType === "pdf" ? "pdf" : "image") as BomFileType,
        }),
      });
      let data: { error?: string; message?: string; entry?: { id?: string } } =
        {};
      try {
        data = await res.json();
      } catch {
        throw new Error(`Submit failed (HTTP ${res.status}). Please try again.`);
      }
      if (!res.ok) throw new Error(data.error || "Submit failed");

      const sizeNote =
        prepared.size !== file.size
          ? ` Photo optimized ${Math.round(file.size / 1024)} KB → ${Math.round(prepared.size / 1024)} KB.`
          : "";
      const okText = `Success! “${t}” is pending admin approval.${sizeNote} Check Admin → Best of Month → Pending.`;
      setSubmitMsg({ kind: "ok", text: okText });
      setNote(okText);
      setTitle("");
      setDescription("");
      setFileFromInput(null);
      await load();
      // Keep success message in view (form is at bottom of a long page)
      document.getElementById("bom-submit-status")?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    } catch (err) {
      const text = err instanceof Error ? err.message : "Submit failed";
      setSubmitMsg({ kind: "err", text });
      setNote(text);
      document.getElementById("bom-submit-status")?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    } finally {
      setSubmitting(false);
    }
  }

  if (error && !feed) {
    return <div className="empty-state">{error}</div>;
  }
  if (!feed) {
    return <div className="empty-state">Loading Best of the Month…</div>;
  }

  const last = feed.lastMonthResults;

  return (
    <div className="bom-club">
      {note && <div className="bom-note about-panel">{note}</div>}

      {/* —— Last month winners (featured this month) —— */}
      <section className="bom-section" id="winners">
        <div className="section-head">
          <div>
            <h2>
              {last
                ? `Winners · ${formatMonth(last.monthKey)}`
                : "Last month’s winners"}
            </h2>
            <p>
              {last
                ? "Champion plus two honorable mentions in each category — locked in when the month ended."
                : "When last month’s voting closes, winners and honorable mentions appear here automatically."}
            </p>
          </div>
        </div>

        {!last ? (
          <div className="empty-state about-panel">
            No completed month yet — be among the first to enter and vote this
            month!
          </div>
        ) : (
          <div className="bom-winners-grid">
            {BOM_CATEGORIES.map((cat) => {
              const block = last.categories[cat];
              const meta = BOM_CATEGORY_META[cat];
              if (!block?.winner) {
                return (
                  <article key={cat} className="about-panel bom-winner-card">
                    <div className="bom-winner-head">
                      <CategoryArt cat={cat} size="sm" />
                      <span className="pill">{meta.label}</span>
                    </div>
                    <p className="bom-muted">No entries last month.</p>
                  </article>
                );
              }
              return (
                <article key={cat} className="about-panel bom-winner-card is-champ">
                  <div className="bom-winner-head">
                    <CategoryArt cat={cat} size="sm" />
                    <span className="pill bom-pill-win">🏆 {meta.label}</span>
                  </div>
                  <EntryMedia entry={block.winner} large />
                  <h3>{block.winner.title}</h3>
                  <p className="bom-muted">
                    Submitted by {block.winner.submitterName} ·{" "}
                    <strong>{block.winner.votes}</strong> votes
                  </p>
                  {block.honorableMentions?.length > 0 && (
                    <div className="bom-hm">
                      <strong>Honorable mentions</strong>
                      <ul>
                        {block.honorableMentions.map((hm) => (
                          <li key={hm.id}>
                            <span>{hm.title}</span>
                            <em>{hm.votes} votes</em>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* —— This month voting —— */}
      <section className="bom-section" id="vote">
        <div className="section-head">
          <div>
            <h2>Vote · {formatMonth(feed.monthKey)}</h2>
            <p>
              One pick per category at a time — you can change your vote anytime
              until the month ends. Open a photo for the full picture and
              description. Totals update live.
            </p>
          </div>
        </div>

        {BOM_CATEGORIES.map((cat) => {
          const meta = BOM_CATEGORY_META[cat];
          const entries = feed.entriesByCategory[cat] || [];
          const myPick = feed.myVotes[cat];
          return (
            <div key={cat} className="bom-category-block about-panel" id={`bom-${cat}`}>
              <div className="bom-cat-head">
                <div className="bom-cat-title">
                  <CategoryArt cat={cat} />
                  <div>
                    <h3>{meta.label}</h3>
                    <p className="bom-muted">{meta.blurb}</p>
                  </div>
                </div>
                {myPick ? (
                  <span className="pill bom-pill-picked">Your pick set · changeable</span>
                ) : (
                  <span className="pill bom-pill-open">Open</span>
                )}
              </div>

              {entries.length === 0 ? (
                <p className="bom-muted">
                  No approved entries yet this month — submit one below!
                </p>
              ) : (
                <div className="bom-entry-grid">
                  {entries.map((entry) => {
                    const isMine = myPick === entry.id;
                    const hasOtherPick = Boolean(myPick) && !isMine;
                    return (
                      <article
                        key={entry.id}
                        className={`bom-entry-card${isMine ? " is-picked" : ""}`}
                      >
                        <button
                          type="button"
                          className="bom-entry-media-btn"
                          onClick={() => setDetail(entry)}
                          aria-label={`View full details for ${entry.title}`}
                        >
                          <EntryMedia entry={entry} />
                          <span className="bom-view-full">View full size</span>
                        </button>
                        <div className="bom-entry-body">
                          <h4>{entry.title}</h4>
                          {entry.description ? (
                            <p className="bom-entry-desc">{entry.description}</p>
                          ) : null}
                          {entry.description && entry.description.length > 80 ? (
                            <button
                              type="button"
                              className="bom-show-more"
                              onClick={() => setDetail(entry)}
                            >
                              Show more
                            </button>
                          ) : null}
                          <p className="bom-muted">
                            by {entry.submitterName}
                          </p>
                          <p className="bom-vote-count">
                            <strong>{entry.votes}</strong> vote
                            {entry.votes === 1 ? "" : "s"}
                          </p>
                          <div className="bom-entry-actions">
                            <button
                              type="button"
                              className="btn btn-ghost btn-sm"
                              onClick={() => setDetail(entry)}
                            >
                              Full view
                            </button>
                            <button
                              type="button"
                              className={`btn btn-sm ${isMine ? "btn-primary" : "btn-ghost"}`}
                              disabled={busyVote === entry.id}
                              onClick={() => vote(entry.id)}
                            >
                              {isMine
                                ? "★ Your pick"
                                : busyVote === entry.id
                                  ? "Saving…"
                                  : hasOtherPick
                                    ? "Switch vote here"
                                    : "Vote favorite"}
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </section>

      {/* Full-size entry lightbox */}
      {detail ? (
        <div
          className="bom-lightbox"
          role="dialog"
          aria-modal="true"
          aria-labelledby="bom-lightbox-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setDetail(null);
          }}
        >
          <div className="bom-lightbox-panel about-panel">
            <div className="bom-lightbox-head">
              <div>
                <span className="pill">
                  {BOM_CATEGORY_META[detail.category]?.label || detail.category}
                </span>
                <h3 id="bom-lightbox-title">{detail.title}</h3>
              </div>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => setDetail(null)}
              >
                Close
              </button>
            </div>
            <div className="bom-lightbox-media">
              <EntryMedia entry={detail} hero />
            </div>
            <div className="bom-lightbox-body">
              {detail.description ? (
                <p className="bom-lightbox-desc">{detail.description}</p>
              ) : (
                <p className="bom-muted">No description provided.</p>
              )}
              <p className="bom-muted">
                Submitted by {detail.submitterName} ·{" "}
                <strong>{detail.votes}</strong> vote
                {detail.votes === 1 ? "" : "s"}
              </p>
              <div className="bom-entry-actions">
                <a
                  href={detail.imageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost btn-sm"
                >
                  Open original {detail.fileType === "pdf" ? "PDF" : "image"}
                </a>
                <button
                  type="button"
                  className={`btn btn-sm ${
                    feed.myVotes[detail.category] === detail.id
                      ? "btn-primary"
                      : "btn-primary"
                  }`}
                  disabled={busyVote === detail.id}
                  onClick={() => vote(detail.id)}
                >
                  {feed.myVotes[detail.category] === detail.id
                    ? "★ Your pick"
                    : feed.myVotes[detail.category]
                      ? busyVote === detail.id
                        ? "Saving…"
                        : "Switch vote to this one"
                      : busyVote === detail.id
                        ? "Saving…"
                        : "Vote for this one"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* —— Submit —— */}
      <section className="bom-section" id="submit">
        <div className="section-head">
          <div>
            <h2>Enter this month</h2>
            <p>
              Upload a <strong>JPG</strong> or <strong>PDF</strong>. Large phone
              photos are automatically resized before upload. Entries need admin
              approval before they appear for voting.
            </p>
          </div>
        </div>

        <form className="form-grid about-panel bom-submit" onSubmit={submit}>
          <div
            id="bom-submit-status"
            role="status"
            aria-live="polite"
            style={{ gridColumn: "1 / -1" }}
          >
            {submitMsg && (
              <div
                className={
                  submitMsg.kind === "err"
                    ? "msg msg-err"
                    : submitMsg.kind === "ok"
                      ? "msg msg-ok"
                      : "msg"
                }
                style={{
                  marginBottom: "0.75rem",
                  padding: "0.85rem 1rem",
                  borderRadius: 12,
                  background:
                    submitMsg.kind === "err"
                      ? "rgba(180, 60, 40, 0.12)"
                      : submitMsg.kind === "ok"
                        ? "rgba(40, 140, 80, 0.12)"
                        : "rgba(40, 100, 180, 0.1)",
                  border:
                    submitMsg.kind === "err"
                      ? "1px solid rgba(180, 60, 40, 0.35)"
                      : submitMsg.kind === "ok"
                        ? "1px solid rgba(40, 140, 80, 0.35)"
                        : "1px solid rgba(40, 100, 180, 0.25)",
                }}
              >
                <strong>
                  {submitMsg.kind === "err"
                    ? "Could not submit: "
                    : submitMsg.kind === "ok"
                      ? "Done — "
                      : ""}
                </strong>
                {submitMsg.text}
              </div>
            )}
          </div>
          <div className="bom-submit-cat-preview">
            <CategoryArt cat={category} />
            <div>
              <strong>{BOM_CATEGORY_META[category].label}</strong>
              <p className="bom-muted">{BOM_CATEGORY_META[category].blurb}</p>
            </div>
          </div>
          <div className="form-row">
            <div className="field">
              <label htmlFor="bom-cat">Category</label>
              <select
                id="bom-cat"
                value={category}
                onChange={(e) => setCategory(e.target.value as BomCategory)}
                disabled={submitting}
              >
                {BOM_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {BOM_CATEGORY_META[c].label}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="bom-title">Name / title</label>
              <input
                id="bom-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                maxLength={80}
                disabled={submitting}
                placeholder="Pet name, car model, cart name, villager…"
              />
            </div>
          </div>
          <div className="field">
            <label htmlFor="bom-desc">Short description (optional)</label>
            <textarea
              id="bom-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={500}
              rows={2}
              placeholder="Why should they win?"
              disabled={submitting}
            />
          </div>
          <div className="form-row">
            <div className="field">
              <label htmlFor="bom-by">Your name</label>
              <input
                id="bom-by"
                value={submitterName}
                onChange={(e) => setSubmitterName(e.target.value)}
                required
                maxLength={60}
                disabled={submitting}
              />
            </div>
            <div className="field">
              <label htmlFor="bom-file">JPG or PDF</label>
              <input
                id="bom-file"
                type="file"
                accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp,application/pdf"
                onChange={(e) => setFileFromInput(e.target.files?.[0] || null)}
                required={!file}
                disabled={submitting}
              />
              {file && (
                <p className="bom-muted" style={{ margin: "0.35rem 0 0" }}>
                  Selected: {file.name} ({Math.round(file.size / 1024)} KB)
                </p>
              )}
            </div>
          </div>
          {previewUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewUrl}
              alt="Selected photo preview"
              style={{
                maxWidth: "220px",
                borderRadius: 12,
                display: "block",
                marginBottom: "0.5rem",
              }}
            />
          )}
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? "Sending… please wait" : "Submit for approval"}
          </button>
          <p className="bom-muted" style={{ margin: "0.5rem 0 0", fontSize: "0.9rem" }}>
            After you submit, a green or red message appears <strong>above this form</strong>.
            Green = pending admin approval. Red = what went wrong (often photo too large).
          </p>
        </form>
      </section>
    </div>
  );
}
