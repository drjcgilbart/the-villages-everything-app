"use client";

import { useEffect, useState } from "react";
import { StarPicker, StarRating } from "@/components/StarRating";
import {
  listingPhotos,
  type LocalServiceListing,
  type LocalServiceStats,
} from "@/lib/localServicesTypes";

/** Hub listens so “Update this listing” can prefill the submit form. */
export const LOCAL_SVC_UPDATE_EVENT = "tvea-local-svc-update";

type Props = {
  listing: LocalServiceListing;
  onClose: () => void;
  onListingUpdate?: (listing: LocalServiceListing) => void;
};

export function LocalServiceDetailLightbox({
  listing,
  onClose,
  onListingUpdate,
}: Props) {
  const [photoIdx, setPhotoIdx] = useState(0);
  const [voteRating, setVoteRating] = useState(5);
  const [voteName, setVoteName] = useState("");
  const [voteBody, setVoteBody] = useState("");
  const [voteBusy, setVoteBusy] = useState(false);
  const [voteMsg, setVoteMsg] = useState<string | null>(null);
  const [voteErr, setVoteErr] = useState<string | null>(null);

  const gallery = listingPhotos(listing);
  const hero = gallery[photoIdx] || gallery[0] || null;

  useEffect(() => {
    setPhotoIdx(0);
    setVoteRating(5);
    setVoteMsg(null);
    setVoteErr(null);
  }, [listing.id]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  async function submitVote(e: React.FormEvent) {
    e.preventDefault();
    setVoteBusy(true);
    setVoteErr(null);
    setVoteMsg(null);
    try {
      const res = await fetch("/api/local-services/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId: listing.id,
          authorName: voteName || "Neighbor",
          rating: voteRating,
          body: voteBody || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not save rating");
      setVoteMsg(data.message || "Thanks for your rating!");
      setVoteBody("");
      const stats = data.stats as LocalServiceStats | undefined;
      if (stats) {
        onListingUpdate?.({ ...listing, stats });
      }
    } catch (err) {
      setVoteErr(err instanceof Error ? err.message : "Could not save rating");
    } finally {
      setVoteBusy(false);
    }
  }

  function requestUpdate() {
    window.dispatchEvent(
      new CustomEvent<LocalServiceListing>(LOCAL_SVC_UPDATE_EVENT, {
        detail: listing,
      })
    );
    onClose();
    document.getElementById("local-service-form")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <div
      className="local-svc-lightbox"
      role="dialog"
      aria-modal="true"
      aria-labelledby="local-svc-lightbox-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="local-svc-lightbox-panel about-panel">
        <div className="local-svc-lightbox-head">
          <div>
            <div className="local-svc-card-top">
              <span className="pill">{listing.category}</span>
              {listing.village ? (
                <span className="pill">{listing.village}</span>
              ) : null}
              {listing.serviceArea ? (
                <span className="pill">{listing.serviceArea}</span>
              ) : null}
            </div>
            <h3 id="local-svc-lightbox-title">{listing.businessName}</h3>
            <p className="local-svc-contact" style={{ marginBottom: 0 }}>
              Contact: <strong>{listing.contactName}</strong>
            </p>
          </div>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        {hero ? (
          <div className="local-svc-lightbox-media">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={hero}
              alt={`${listing.businessName} photo`}
              className="local-svc-lightbox-hero"
            />
            {gallery.length > 1 ? (
              <div className="local-svc-lightbox-thumbs">
                {gallery.map((url, i) => (
                  <button
                    key={`${url}-${i}`}
                    type="button"
                    className={`local-svc-thumb-btn${
                      i === photoIdx ? " is-active" : ""
                    }`}
                    onClick={() => setPhotoIdx(i)}
                    aria-label={
                      i === 0 ? "Show main photo" : `Show photo ${i + 1}`
                    }
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt="" />
                    {i === 0 ? (
                      <span className="local-svc-thumb-label">Main</span>
                    ) : null}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        ) : (
          <p className="local-svc-card-hint">No photos on this listing yet.</p>
        )}

        <div className="local-svc-lightbox-body">
          {listing.stats && listing.stats.reviewCount > 0 ? (
            <div className="local-svc-detail-rating">
              <StarRating
                value={listing.stats.averageRating}
                size="md"
                showValue
              />
              <span>
                {listing.stats.reviewCount} neighbor vote
                {listing.stats.reviewCount === 1 ? "" : "s"}
              </span>
            </div>
          ) : (
            <p className="local-svc-card-hint">No ratings yet</p>
          )}
          {listing.description ? (
            <p className="local-svc-lightbox-desc">{listing.description}</p>
          ) : null}
          <ul className="club-leader-meta">
            {listing.address ? (
              <li>
                <strong>Address:</strong>{" "}
                {listing.mapsUrl ? (
                  <a
                    href={listing.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {listing.address}
                  </a>
                ) : (
                  listing.address
                )}
              </li>
            ) : null}
            {listing.village ? (
              <li>
                <strong>Village:</strong> {listing.village}
              </li>
            ) : null}
            {listing.serviceArea ? (
              <li>
                <strong>Serves:</strong> {listing.serviceArea}
              </li>
            ) : null}
            {listing.phone ? (
              <li>
                <strong>Phone:</strong>{" "}
                <a href={`tel:${listing.phone.replace(/[^\d+]/g, "")}`}>
                  {listing.phone}
                </a>
              </li>
            ) : null}
            {listing.email ? (
              <li>
                <strong>Email:</strong>{" "}
                <a href={`mailto:${listing.email}`}>{listing.email}</a>
              </li>
            ) : null}
            {listing.website ? (
              <li>
                <strong>Website:</strong>{" "}
                <a
                  href={listing.website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit site
                </a>
              </li>
            ) : null}
            {listing.mapsUrl && !listing.address ? (
              <li>
                <strong>Map / reviews:</strong>{" "}
                <a
                  href={listing.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open map
                </a>
              </li>
            ) : null}
          </ul>

          <form className="local-svc-vote-form" onSubmit={submitVote}>
            <span className="kicker">Rate this pro</span>
            <p style={{ margin: "0.25rem 0 0.5rem", color: "var(--muted)" }}>
              1–5 stars — same idea as dining. Helps neighbors pick a crew.
            </p>
            {voteMsg ? <div className="msg msg-ok">{voteMsg}</div> : null}
            {voteErr ? <div className="msg msg-err">{voteErr}</div> : null}
            <StarPicker value={voteRating} onChange={setVoteRating} />
            <div className="field" style={{ marginTop: "0.65rem" }}>
              <label htmlFor="svc-vote-name">Your name</label>
              <input
                id="svc-vote-name"
                value={voteName}
                onChange={(e) => setVoteName(e.target.value)}
                maxLength={80}
                placeholder="Neighbor"
              />
            </div>
            <div className="field">
              <label htmlFor="svc-vote-body">Note (optional)</label>
              <textarea
                id="svc-vote-body"
                value={voteBody}
                onChange={(e) => setVoteBody(e.target.value)}
                rows={2}
                maxLength={500}
                placeholder="Showed up on time, cleaned up after…"
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              disabled={voteBusy}
            >
              {voteBusy ? "Saving…" : "Submit rating"}
            </button>
          </form>

          <div className="hero-actions" style={{ marginTop: "1rem" }}>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={requestUpdate}
            >
              Update this listing
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={onClose}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
