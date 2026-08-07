"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CLUB_LISTING_CATEGORIES,
  membershipLabel,
  type ClubListing,
  type ClubListingCategory,
  type ClubMembershipStatus,
} from "@/lib/clubListingsTypes";

type Feed = {
  listings: ClubListing[];
  membershipStatuses: { id: ClubMembershipStatus; label: string }[];
  categories: readonly string[];
};

export function ClubLeaderDirectory() {
  const [feed, setFeed] = useState<Feed | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "open" | "waitlist" | "closed">(
    "all"
  );
  const [query, setQuery] = useState("");

  // Form
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

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/clubs", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not load");
      setFeed({
        listings: data.listings || [],
        membershipStatuses: data.membershipStatuses || [],
        categories: data.categories || CLUB_LISTING_CATEGORIES,
      });
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const list = feed?.listings || [];
    const q = query.trim().toLowerCase();
    return list.filter((l) => {
      if (filter !== "all" && l.membershipStatus !== filter) return false;
      if (!q) return true;
      return (
        l.name.toLowerCase().includes(q) ||
        l.leaderName.toLowerCase().includes(q) ||
        l.location.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q) ||
        l.category.toLowerCase().includes(q)
      );
    });
  }, [feed, filter, query]);

  function prefillUpdate(l: ClubListing) {
    setReplacesId(l.id);
    setName(l.name);
    setCategory(l.category);
    setLocation(l.location);
    setLeaderName(l.leaderName);
    setWebsite(l.website || "");
    setEmail(l.email || "");
    setPhone(l.phone || "");
    setDescription(l.description);
    setMembershipStatus(l.membershipStatus);
    setSubmittedByName(l.leaderName);
    setNote(`Updating “${l.name}” — submit for admin approval.`);
    document.getElementById("club-leader-form")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

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
      await load();
    } catch (err) {
      setFormErr(err instanceof Error ? err.message : "Submit failed");
    } finally {
      setBusy(false);
    }
  }

  if (error && !feed) {
    return <div className="empty-state">{error}</div>;
  }
  if (!feed) {
    return <div className="empty-state">Loading leader-updated clubs…</div>;
  }

  return (
    <div className="club-leader-dir">
      <div className="section-head">
        <div>
          <h2>Leader-updated club directory</h2>
          <p>
            Fresh contacts from club leaders — open vs full, where you meet, and
            how to reach them. Official District lists can go stale; this list
            only shows listings after admin approval.
          </p>
        </div>
      </div>

      <div className="club-leader-toolbar">
        <label className="rc-field club-search-field">
          <span>Search directory</span>
          <input
            className="rc-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Club name, leader, location…"
          />
        </label>
        <div className="club-leader-filters">
          {(
            [
              ["all", "All"],
              ["open", "Open"],
              ["waitlist", "Waitlist"],
              ["closed", "Closed"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={`btn btn-sm ${filter === id ? "btn-primary" : "btn-ghost"}`}
              onClick={() => setFilter(id)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state about-panel">
          No approved club listings yet
          {filter !== "all" ? " in this filter" : ""}. Leaders: use the form
          below to submit your club for review.
        </div>
      ) : (
        <div className="club-leader-grid">
          {filtered.map((l) => (
            <article key={l.id} className="about-panel club-leader-card">
              <div className="club-leader-card-top">
                <span className="pill">{l.category}</span>
                <span
                  className={`pill club-mem-${l.membershipStatus}`}
                >
                  {membershipLabel(l.membershipStatus)}
                </span>
              </div>
              <h3>{l.name}</h3>
              <p className="club-leader-desc">{l.description}</p>
              <ul className="club-leader-meta">
                <li>
                  <strong>Location:</strong> {l.location}
                </li>
                <li>
                  <strong>Leader:</strong> {l.leaderName}
                </li>
                {l.email ? (
                  <li>
                    <strong>Email:</strong>{" "}
                    <a href={`mailto:${l.email}`}>{l.email}</a>
                  </li>
                ) : null}
                {l.phone ? (
                  <li>
                    <strong>Phone:</strong>{" "}
                    <a href={`tel:${l.phone.replace(/[^\d+]/g, "")}`}>
                      {l.phone}
                    </a>
                  </li>
                ) : null}
                {l.website ? (
                  <li>
                    <strong>Website:</strong>{" "}
                    <a
                      href={l.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Visit site
                    </a>
                  </li>
                ) : null}
              </ul>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => prefillUpdate(l)}
              >
                Update this listing
              </button>
            </article>
          ))}
        </div>
      )}

      <form
        id="club-leader-form"
        className="form-grid about-panel club-leader-form"
        onSubmit={onSubmit}
      >
        <h3 style={{ margin: "0 0 0.25rem" }}>
          {replacesId ? "Submit a club update" : "Club leader: list your club"}
        </h3>
        <p className="club-leader-form-lead">
          Fill this out if you lead (or help run) a club. New listings and
          updates stay <strong>pending</strong> until an admin approves them —
          then they appear above for everyone.
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
    </div>
  );
}
