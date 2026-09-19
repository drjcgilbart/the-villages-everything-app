"use client";

import { useState } from "react";
import {
  CLUB_LISTING_CATEGORIES,
  type ClubListingCategory,
  type ClubMembershipStatus,
} from "@/lib/clubListingsTypes";

export function ClubLeaderDirectory() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<ClubListingCategory>("Social & Community");
  const [location, setLocation] = useState("");
  const [leaderName, setLeaderName] = useState("");
  const [website, setWebsite] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [membershipStatus, setMembershipStatus] =
    useState<ClubMembershipStatus>("open");
  const [submittedByName, setSubmittedByName] = useState("");
  const [replacesId, setReplacesId] = useState("");
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [formErr, setFormErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setFormErr(null);
    setNote(null);
    try {
      const res = await fetch("/api/clubs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          category,
          location,
          leaderName,
          website: website || undefined,
          email: email || undefined,
          phone: phone || undefined,
          description,
          membershipStatus,
          submittedByName: submittedByName || leaderName,
          replacesId: replacesId || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submit failed");
      setNote(data.message || "Submitted for approval.");
      setDescription("");
      setReplacesId("");
    } catch (err) {
      setFormErr(err instanceof Error ? err.message : "Submit failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form
      id="club-leader-form"
      className="form-grid about-panel club-leader-form"
      onSubmit={onSubmit}
    >
      <h3 style={{ margin: "0 0 0.25rem" }}>
        {replacesId ? "Submit a club update" : "Club leader: list your club"}
      </h3>
      <p className="club-leader-form-lead">
        Fill this out if you lead (or help run) a club. New listings and updates
        stay <strong>pending</strong> until an admin approves them.
      </p>
      {replacesId ? (
        <p className="club-leader-update-banner">
          You are updating an existing listing.{" "}
          <button
            type="button"
            className="text-link"
            onClick={() => setReplacesId("")}
          >
            Clear — submit as new instead
          </button>
        </p>
      ) : null}
      {note ? <div className="msg msg-ok">{note}</div> : null}
      {formErr ? <div className="msg msg-err">{formErr}</div> : null}

      <div className="form-row">
        <div className="field">
          <label htmlFor="cl-name">Club / activity name</label>
          <input
            id="cl-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength={100}
            placeholder="e.g. Tuesday Morning Mah Jongg"
          />
        </div>
        <div className="field">
          <label htmlFor="cl-cat">Category</label>
          <select
            id="cl-cat"
            value={category}
            onChange={(e) =>
              setCategory(e.target.value as ClubListingCategory)
            }
          >
            {CLUB_LISTING_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="field">
          <label htmlFor="cl-loc">Location / meeting place</label>
          <input
            id="cl-loc"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            maxLength={120}
            placeholder="Rec center, room, or usual area"
          />
        </div>
        <div className="field">
          <label htmlFor="cl-leader">Leader name</label>
          <input
            id="cl-leader"
            value={leaderName}
            onChange={(e) => setLeaderName(e.target.value)}
            required
            maxLength={80}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="field">
          <label htmlFor="cl-web">Group website (optional)</label>
          <input
            id="cl-web"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            maxLength={200}
            placeholder="https://"
          />
        </div>
        <div className="field">
          <label htmlFor="cl-email">Email (optional)</label>
          <input
            id="cl-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            maxLength={120}
          />
        </div>
        <div className="field">
          <label htmlFor="cl-phone">Phone (optional)</label>
          <input
            id="cl-phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            maxLength={40}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="field">
          <label htmlFor="cl-mem">New members?</label>
          <select
            id="cl-mem"
            value={membershipStatus}
            onChange={(e) =>
              setMembershipStatus(e.target.value as ClubMembershipStatus)
            }
          >
            <option value="open">Open to new members</option>
            <option value="waitlist">Waitlist / limited spots</option>
            <option value="closed">Closed / full</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="cl-by">Your name (if different from leader)</label>
          <input
            id="cl-by"
            value={submittedByName}
            onChange={(e) => setSubmittedByName(e.target.value)}
            maxLength={80}
            placeholder="Defaults to leader name"
          />
        </div>
      </div>

      <div className="field">
        <label htmlFor="cl-desc">Brief description</label>
        <textarea
          id="cl-desc"
          rows={3}
          maxLength={800}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          placeholder="What the club is about, when you roughly meet, skill level, what to bring…"
        />
      </div>

      <p className="club-leader-form-hint">
        Include at least one contact method (email, phone, or website). Public
        page shows only approved listings.
      </p>

      <button type="submit" className="btn btn-primary" disabled={busy}>
        {busy
          ? "Sending…"
          : replacesId
            ? "Submit update for approval"
            : "Submit for approval"}
      </button>
    </form>
  );
}
