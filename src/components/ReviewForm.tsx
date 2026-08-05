"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { StarPicker } from "@/components/StarRating";

export function ReviewForm({
  restaurantId,
  restaurantName,
}: {
  restaurantId: string;
  restaurantName: string;
}) {
  const router = useRouter();
  const [authorName, setAuthorName] = useState("");
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [dish, setDish] = useState("");
  const [wouldReturn, setWouldReturn] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setOk(false);
    try {
      const res = await fetch("/api/dining/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantId,
          authorName,
          rating,
          title,
          body,
          dish,
          wouldReturn,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not save review");
      setOk(true);
      setTitle("");
      setBody("");
      setDish("");
      setRating(5);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save review");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="form-grid review-form" onSubmit={submit}>
      <h3>Rate {restaurantName}</h3>
      <p className="review-form-lead">
        Honest takes help the whole village eat better. 1–5 stars, no password required.
      </p>

      <div className="field">
        <label>Your rating</label>
        <StarPicker value={rating} onChange={setRating} />
      </div>

      <div className="form-row">
        <div className="field">
          <label htmlFor="rev-name">Your name</label>
          <input
            id="rev-name"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            required
            maxLength={60}
            placeholder="First name is fine"
          />
        </div>
        <div className="field">
          <label htmlFor="rev-dish">Dish you ordered (optional)</label>
          <input
            id="rev-dish"
            value={dish}
            onChange={(e) => setDish(e.target.value)}
            maxLength={80}
            placeholder="e.g. Grouper sandwich"
          />
        </div>
      </div>

      <div className="field">
        <label htmlFor="rev-title">Headline</label>
        <input
          id="rev-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          maxLength={120}
          placeholder="Early-bird perfection"
        />
      </div>

      <div className="field">
        <label htmlFor="rev-body">Your review</label>
        <textarea
          id="rev-body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
          maxLength={2000}
          rows={4}
          placeholder="Food, service, vibe, parking-lot cart chaos…"
        />
      </div>

      <label className="checkbox-row">
        <input
          type="checkbox"
          checked={wouldReturn}
          onChange={(e) => setWouldReturn(e.target.checked)}
        />
        I&apos;d go back
      </label>

      {error && <div className="msg msg-err">{error}</div>}
      {ok && (
        <div className="msg msg-ok">
          Thanks! Your rating is live and the leaderboards just updated.
        </div>
      )}

      <button type="submit" className="btn btn-primary" disabled={busy}>
        {busy ? "Posting…" : "Post review"}
      </button>
    </form>
  );
}
