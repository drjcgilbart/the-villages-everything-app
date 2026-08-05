"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { VillageNeighbor } from "@/lib/villageNeighborTypes";
import { formatDate } from "@/lib/format";

export function VillageNeighborsSection({
  villageSlug,
  villageName,
  initialNeighbors,
}: {
  villageSlug: string;
  villageName: string;
  initialNeighbors: VillageNeighbor[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [areaNote, setAreaNote] = useState("");
  const [tenure, setTenure] = useState("");
  const [interests, setInterests] = useState("");
  const [bio, setBio] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setOk(false);
    try {
      const res = await fetch("/api/village-neighbors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          villageSlug,
          displayName,
          areaNote,
          tenure,
          interests,
          bio,
          website: honeypot,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not post intro");
      setOk(true);
      setDisplayName("");
      setAreaNote("");
      setTenure("");
      setInterests("");
      setBio("");
      setOpen(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not post intro");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="village-neighbors-section about-panel">
      <div className="section-head" style={{ marginBottom: "0.85rem" }}>
        <div>
          <h2 style={{ margin: 0 }}>Meet Your Neighbors</h2>
          <p style={{ margin: "0.35rem 0 0" }}>
            Unique to the <strong>Village of {villageName}</strong> — say hello,
            share a hobby, find your cart-path crew. Not a global board; just
            this village.
          </p>
        </div>
      </div>

      {initialNeighbors.length === 0 ? (
        <div className="empty-state" style={{ marginBottom: "1rem" }}>
          No neighbor intros yet in {villageName}. Be the first wave from a cart!
        </div>
      ) : (
        <div className="village-neighbor-cards">
          {initialNeighbors.map((n) => (
            <article key={n.id} className="village-neighbor-card">
              <div className="village-neighbor-card-head">
                <span className="member-name">
                  <strong className="member-name-text">{n.displayName}</strong>
                  {n.badges && n.badges.length > 0 ? (
                    <span className="member-badges" aria-label="Member badges">
                      {n.badges.map((b) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          key={b.id}
                          src={b.image}
                          alt={b.label}
                          title={b.title}
                          width={22}
                          height={22}
                          className="member-badge"
                          loading="lazy"
                        />
                      ))}
                    </span>
                  ) : null}
                </span>
                {n.tenure && <span className="pill pill-cuisine">{n.tenure}</span>}
              </div>
              {n.areaNote && (
                <p className="village-neighbor-area">{n.areaNote}</p>
              )}
              <p className="village-neighbor-bio">{n.bio}</p>
              {n.interests?.length > 0 && (
                <div className="village-neighbor-tags">
                  {n.interests.map((t) => (
                    <span key={t} className="tag">
                      #{t}
                    </span>
                  ))}
                </div>
              )}
              <time className="village-neighbor-date" dateTime={n.createdAt}>
                Joined the board {formatDate(n.createdAt)}
              </time>
            </article>
          ))}
        </div>
      )}

      {!open ? (
        <button
          type="button"
          className="btn btn-primary btn-sm"
          style={{ marginTop: "1rem" }}
          onClick={() => setOpen(true)}
        >
          Introduce yourself in {villageName}
        </button>
      ) : (
        <form className="form-grid" style={{ marginTop: "1rem" }} onSubmit={submit}>
          <h3 style={{ margin: 0 }}>Say hello in {villageName}</h3>
          <p className="review-form-lead">
            Keep addresses private. A first name (or nickname) is plenty.
          </p>
          <div className="form-row">
            <div className="field">
              <label htmlFor="nbr-name">Display name</label>
              <input
                id="nbr-name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                maxLength={60}
                placeholder="Pat & Sam"
              />
            </div>
            <div className="field">
              <label htmlFor="nbr-tenure">In this village since… (optional)</label>
              <input
                id="nbr-tenure"
                value={tenure}
                onChange={(e) => setTenure(e.target.value)}
                maxLength={40}
                placeholder="2025 · Snowbird · Forever"
              />
            </div>
          </div>
          <div className="field">
            <label htmlFor="nbr-area">Area note (optional)</label>
            <input
              id="nbr-area"
              value={areaNote}
              onChange={(e) => setAreaNote(e.target.value)}
              maxLength={80}
              placeholder="Near the rec path — not a street address"
            />
          </div>
          <div className="field">
            <label htmlFor="nbr-interests">Interests (comma-separated)</label>
            <input
              id="nbr-interests"
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              placeholder="Pickleball, golf carts, dogs"
            />
          </div>
          <div className="field">
            <label htmlFor="nbr-bio">Short intro</label>
            <textarea
              id="nbr-bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              required
              rows={3}
              maxLength={600}
              placeholder="Who you are, what you’re looking for, how to wave hello…"
            />
          </div>
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
          {ok && (
            <div className="msg msg-ok">You&apos;re on the {villageName} board!</div>
          )}
          <div className="admin-actions">
            <button type="submit" className="btn btn-primary" disabled={busy}>
              {busy ? "Posting…" : "Post intro"}
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
