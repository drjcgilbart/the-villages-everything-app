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
  const [submitting, setSubmitting] = useState(false);

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

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      setNote("Please choose a JPG or PDF file");
      return;
    }
    setSubmitting(true);
    setNote(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const up = await fetch("/api/best-of-month/upload", {
        method: "POST",
        body: fd,
      });
      const upData = await up.json();
      if (!up.ok) throw new Error(upData.error || "Upload failed");

      const res = await fetch("/api/best-of-month/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "submit",
          category,
          title,
          description,
          submitterName,
          imageUrl: upData.url,
          fileType: upData.fileType as BomFileType,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submit failed");
      setNote(data.message);
      setTitle("");
      setDescription("");
      setFile(null);
      await load();
    } catch (err) {
      setNote(err instanceof Error ? err.message : "Submit failed");
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
              Upload a <strong>JPG</strong> or <strong>PDF</strong>. Entries need
              admin approval before they appear for voting.
            </p>
          </div>
        </div>

        <form className="form-grid about-panel bom-submit" onSubmit={submit}>
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
              />
            </div>
            <div className="field">
              <label htmlFor="bom-file">JPG or PDF</label>
              <input
                id="bom-file"
                type="file"
                accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp,application/pdf"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                required
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? "Sending…" : "Submit for approval"}
          </button>
        </form>
      </section>
    </div>
  );
}
