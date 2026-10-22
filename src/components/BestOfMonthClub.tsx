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
import { BOM_MAX_UPLOAD_BYTES, prepareBomUploadFile } from "@/lib/bomUploadClient";

type ShowcaseCat = {
  category: BomCategory;
  holding: boolean;
  open: boolean;
  monthKey: string;
  winner: BomEntry | null;
  honorableMentions: BomEntry[];
};

type Feed = {
  monthKey: string;
  categories: typeof BOM_CATEGORY_META;
  categoryIds: BomCategory[];
  entriesByCategory: Record<BomCategory, BomEntry[]>;
  myVotes: Partial<Record<BomCategory, string>>;
  showcase: ShowcaseCat[];
};

function formatMonth(key: string) {
  const [y, m] = key.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
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

  function setFileFromInput(
    next: File | null,
    options?: { preserveMsg?: boolean }
  ) {
    setFile(next);
    // IMPORTANT: do not clear submitMsg when resetting the form after a
    // successful submit — that was wiping the success banner immediately.
    if (!options?.preserveMsg) {
      setSubmitMsg(null);
    }
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return next && next.type.startsWith("image/")
        ? URL.createObjectURL(next)
        : null;
    });
    // Pre-check: show that a big photo will be auto-resized on submit
    if (next && next.type.startsWith("image/") && next.size > BOM_MAX_UPLOAD_BYTES) {
      setSubmitMsg({
        kind: "info",
        text: `Photo is ${Math.round(next.size / 1024 / 1024 * 10) / 10} MB — it will be automatically resized to under 2 MB when you click Submit.`,
      });
    }
  }

  function showSubmitResult(kind: "ok" | "err", text: string) {
    setSubmitMsg({ kind, text });
    setNote(text);
    // Browser alert so the result is impossible to miss
    try {
      window.alert(kind === "ok" ? `Success!\n\n${text}` : `Could not submit\n\n${text}`);
    } catch {
      /* ignore */
    }
    // Scroll form status into view after alert is dismissed
    requestAnimationFrame(() => {
      document.getElementById("bom-submit-status")?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
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
      // Always auto-resize large phone photos (e.g. 4.6 MB Corvette shots)
      setSubmitMsg({
        kind: "info",
        text: `Resizing photo if needed (${Math.round(file.size / 1024)} KB)…`,
      });
      const prepared = await prepareBomUploadFile(file);
      const uploadFile = prepared.file;

      setSubmitMsg({
        kind: "info",
        text: prepared.compressed
          ? `Photo compressed ${Math.round(prepared.originalBytes / 1024)} KB → ${Math.round(uploadFile.size / 1024)} KB. Uploading…`
          : `Uploading ${Math.round(uploadFile.size / 1024)} KB…`,
      });
      const fd = new FormData();
      fd.append("file", uploadFile);
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

      const sizeNote = prepared.compressed
        ? ` Photo auto-resized ${Math.round(prepared.originalBytes / 1024)} KB → ${Math.round(uploadFile.size / 1024)} KB.`
        : "";
      const okText = `“${t}” is pending admin approval.${sizeNote} Open Admin → Best of Month → Pending to approve it.`;
      setTitle("");
      setDescription("");
      // preserveMsg: true — form clear must not erase the success banner
      setFileFromInput(null, { preserveMsg: true });
      showSubmitResult("ok", okText);
      await load();
    } catch (err) {
      const text = err instanceof Error ? err.message : "Submit failed";
      showSubmitResult("err", text);
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

  const showcase = feed.showcase || [];
  const showChampGrid = showcase.some((item) => item.winner || item.open);

  return (
    <div className="bom-club">
      {note && <div className="bom-note about-panel">{note}</div>}

      <section className="bom-section" id="winners">
        <div className="section-head">
          <div>
            <h2>Current champs</h2>
            <p>
              A champ stays on this page until a new neighbor is nominated in
              that category. A quiet month does not clear the board.
            </p>
          </div>
        </div>

        {!showChampGrid ? (
          <div className="empty-state about-panel">
            No champs yet. Be the first to enter a photo this month.
          </div>
        ) : (
          <div className="bom-winners-grid">
            {BOM_CATEGORIES.map((cat) => {
              const block = showcase.find((item) => item.category === cat);
              const meta = BOM_CATEGORY_META[cat];
              if (!block?.winner) {
                return (
                  <article key={cat} className="about-panel bom-winner-card">
                    <div className="bom-winner-head">
                      <CategoryArt cat={cat} size="sm" />
                      <span className="pill">{meta.label}</span>
                    </div>
                    <p className="bom-muted">
                      {block?.open
                        ? "New nominees are open for votes below."
                        : "No champ yet. Nominate one below."}
                    </p>
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
                    {block.winner.submitterName ? (
                      <>Submitted by {block.winner.submitterName} · </>
                    ) : null}
                    <strong>{block.winner.votes}</strong> votes
                    {block.holding ? ` · ${formatMonth(block.monthKey)}` : ""}
                  </p>
                  {block.holding ? (
                    <p className="bom-muted">Stays until a new nominee.</p>
                  ) : null}
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
              description. Totals update live. Categories with no new nominee
              keep the champ above.
            </p>
          </div>
        </div>

        {BOM_CATEGORIES.every((cat) => (feed.entriesByCategory[cat] || []).length === 0) ? (
          <div className="empty-state about-panel">
            No new nominees this month. The champs above stay until someone
            enters.
          </div>
        ) : null}

        {BOM_CATEGORIES.map((cat) => {
          const meta = BOM_CATEGORY_META[cat];
          const entries = feed.entriesByCategory[cat] || [];
          const myPick = feed.myVotes[cat];
          if (entries.length === 0) return null;
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
                          {entry.submitterName ? (
                            <p className="bom-muted">by {entry.submitterName}</p>
                          ) : null}
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
                {detail.submitterName ? <>Submitted by {detail.submitterName} · </> : null}
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
              photos (even 5–12 MB) are <strong>automatically resized</strong>{" "}
              before upload so they always fit. Entries need admin approval
              before they appear for voting.
            </p>
          </div>
        </div>

        <form className="form-grid about-panel bom-submit" onSubmit={submit}>
          <div
            id="bom-submit-status"
            role="status"
            aria-live="assertive"
            style={{ gridColumn: "1 / -1" }}
          >
            {submitMsg && (
              <div
                style={{
                  marginBottom: "0.75rem",
                  padding: "1rem 1.1rem",
                  borderRadius: 12,
                  fontSize: "1.05rem",
                  fontWeight: 600,
                  lineHeight: 1.45,
                  color:
                    submitMsg.kind === "err"
                      ? "#5c1a12"
                      : submitMsg.kind === "ok"
                        ? "#0f3d24"
                        : "#0c2d4a",
                  background:
                    submitMsg.kind === "err"
                      ? "#fde8e4"
                      : submitMsg.kind === "ok"
                        ? "#d8f5e4"
                        : "#e3f0fc",
                  border:
                    submitMsg.kind === "err"
                      ? "2px solid #c44"
                      : submitMsg.kind === "ok"
                        ? "2px solid #2a8f55"
                        : "2px solid #3a7fc4",
                  boxShadow: "0 4px 18px rgba(0,0,0,0.12)",
                }}
              >
                {submitMsg.kind === "err"
                  ? "❌ Could not submit: "
                  : submitMsg.kind === "ok"
                    ? "✅ Success! "
                    : "⏳ "}
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
