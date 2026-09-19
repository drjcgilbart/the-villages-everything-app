"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  CUISINES,
  PRICE_RANGES,
  cuisineLabel,
  type Cuisine,
  type Interview,
  type PriceRange,
  type Restaurant,
  type RestaurantStats,
  type RestaurantSuggestion,
  type Review,
} from "@/lib/diningTypes";
import type { DiningClosedCandidate } from "@/lib/diningRefreshTypes";

type RestRow = Restaurant & { stats: RestaurantStats };

type RestForm = {
  id: string;
  name: string;
  slug: string;
  cuisine: Cuisine;
  cuisineOther: string;
  tags: string;
  area: string;
  address: string;
  phone: string;
  website: string;
  priceRange: PriceRange;
  description: string;
  specialties: string;
  featured: boolean;
};

type IntForm = {
  id: string;
  restaurantId: string;
  personName: string;
  role: string;
  title: string;
  excerpt: string;
  body: string;
  quote: string;
  featured: boolean;
};

const emptyRest: RestForm = {
  id: "",
  name: "",
  slug: "",
  cuisine: "American",
  cuisineOther: "",
  tags: "",
  area: "",
  address: "",
  phone: "",
  website: "",
  priceRange: "$$",
  description: "",
  specialties: "",
  featured: false,
};

const emptyInt: IntForm = {
  id: "",
  restaurantId: "",
  personName: "",
  role: "",
  title: "",
  excerpt: "",
  body: "",
  quote: "",
  featured: false,
};

export function AdminDiningPanel() {
  const [restaurants, setRestaurants] = useState<RestRow[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [suggestions, setSuggestions] = useState<RestaurantSuggestion[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [restForm, setRestForm] = useState<RestForm>(emptyRest);
  const [intForm, setIntForm] = useState<IntForm>(emptyInt);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [sub, setSub] = useState<
    "suggestions" | "restaurants" | "reviews" | "interviews"
  >("suggestions");
  const [sugFilter, setSugFilter] = useState<"pending" | "all">("pending");
  const [refreshing, setRefreshing] = useState(false);
  const [closedQueue, setClosedQueue] = useState<DiningClosedCandidate[]>([]);
  const [refreshSummary, setRefreshSummary] = useState<string | null>(null);
  const restFormRef = useRef<HTMLDivElement>(null);

  const flash = (kind: "ok" | "err", text: string) => {
    setMsg({ kind, text });
    setTimeout(() => setMsg(null), 4000);
  };

  const load = useCallback(async () => {
    const [rRes, revRes, iRes, sRes] = await Promise.all([
      fetch("/api/dining/restaurants"),
      fetch("/api/dining/reviews?all=1"),
      fetch("/api/dining/interviews"),
      fetch("/api/dining/suggestions?status=all"),
    ]);
    const rData = await rRes.json();
    const revData = await revRes.json();
    const iData = await iRes.json();
    const sData = await sRes.json();
    setRestaurants(rData.restaurants || []);
    setReviews(revData.reviews || []);
    setInterviews(iData.interviews || []);
    setSuggestions(sData.suggestions || []);
    setPendingCount(Number(sData.pendingCount) || 0);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function saveRestaurant(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await fetch("/api/dining/restaurants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(restForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      flash("ok", restForm.id ? "Restaurant updated" : "Restaurant added");
      setRestForm(emptyRest);
      await load();
    } catch (err) {
      flash("err", err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  async function saveInterview(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await fetch("/api/dining/interviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(intForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      flash("ok", intForm.id ? "Interview updated" : "Interview published");
      setIntForm(emptyInt);
      await load();
    } catch (err) {
      flash("err", err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  async function refreshRestaurants() {
    setRefreshing(true);
    setRefreshSummary(null);
    try {
      const res = await fetch("/api/dining/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "refresh" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Refresh failed");
      const added = Array.isArray(data.added) ? data.added.length : 0;
      const updated = Array.isArray(data.updated) ? data.updated.length : 0;
      const closed = Array.isArray(data.closedCandidates)
        ? data.closedCandidates
        : [];
      const extra =
        Array.isArray(data.errors) && data.errors.length
          ? ` Notes: ${data.errors.join(" · ")}`
          : "";
      setRefreshSummary(
        `Added ${added} new spot${added === 1 ? "" : "s"}, updated ${updated}.${extra}`
      );
      setClosedQueue(closed);
      if (closed.length === 0) {
        flash(
          "ok",
          `Refresh finished — added ${added}, updated ${updated}. Existing restaurants were kept.`
        );
      }
      await load();
    } catch (err) {
      flash("err", err instanceof Error ? err.message : "Refresh failed");
    } finally {
      setRefreshing(false);
    }
  }

  async function decideClosed(keep: boolean) {
    const current = closedQueue[0];
    if (!current) return;
    if (!keep) {
      try {
        const res = await fetch("/api/dining/refresh", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "remove-closed", id: current.id }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Could not remove restaurant");
        flash("ok", `Removed ${current.name}`);
        if (restForm.id === current.id) setRestForm(emptyRest);
        await load();
      } catch (err) {
        flash("err", err instanceof Error ? err.message : "Could not remove");
        return;
      }
    }
    setClosedQueue((q) => q.slice(1));
  }

  async function removeRestaurant(id: string) {
    if (!confirm("Delete this restaurant and its reviews/interviews?")) return;
    const res = await fetch(`/api/dining/restaurants?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const data = await res.json();
      flash("err", data.error || "Delete failed");
      return;
    }
    flash("ok", "Restaurant deleted");
    if (restForm.id === id) setRestForm(emptyRest);
    await load();
  }

  async function hideReview(id: string, hidden: boolean) {
    const res = await fetch("/api/dining/reviews", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, hidden }),
    });
    if (!res.ok) {
      const data = await res.json();
      flash("err", data.error || "Update failed");
      return;
    }
    flash("ok", hidden ? "Review hidden" : "Review restored");
    await load();
  }

  async function removeReview(id: string) {
    if (!confirm("Permanently delete this review?")) return;
    const res = await fetch(`/api/dining/reviews?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const data = await res.json();
      flash("err", data.error || "Delete failed");
      return;
    }
    flash("ok", "Review deleted");
    await load();
  }

  async function removeInterview(id: string) {
    if (!confirm("Delete this interview?")) return;
    const res = await fetch(`/api/dining/interviews?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const data = await res.json();
      flash("err", data.error || "Delete failed");
      return;
    }
    flash("ok", "Interview deleted");
    if (intForm.id === id) setIntForm(emptyInt);
    await load();
  }

  function editRestaurant(r: RestRow) {
    setRestForm({
      id: r.id,
      name: r.name,
      slug: r.slug,
      cuisine: r.cuisine,
      cuisineOther: r.cuisineOther || "",
      tags: (r.tags || []).join(", "),
      area: r.area || "",
      address: r.address || "",
      phone: r.phone || "",
      website: r.website || "",
      priceRange: r.priceRange,
      description: r.description || "",
      specialties: (r.specialties || []).join(", "),
      featured: !!r.featured,
    });
    setSub("restaurants");
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        restFormRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        restFormRef.current
          ?.querySelector<HTMLInputElement>("form input")
          ?.focus({ preventScroll: true });
      });
    });
  }

  function editInterview(i: Interview) {
    setIntForm({
      id: i.id,
      restaurantId: i.restaurantId,
      personName: i.personName,
      role: i.role,
      title: i.title,
      excerpt: i.excerpt || "",
      body: i.body || "",
      quote: i.quote || "",
      featured: !!i.featured,
    });
    setSub("interviews");
  }

  const restName = (id: string) =>
    restaurants.find((r) => r.id === id)?.name || id;

  const visibleSuggestions =
    sugFilter === "pending"
      ? suggestions.filter((s) => s.status === "pending")
      : suggestions;

  async function suggestionAction(
    action: "approve" | "reject" | "delete",
    id: string
  ) {
    setBusy(true);
    try {
      const res = await fetch("/api/dining/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          id,
          reason: action === "reject" ? "Not a fit for the guide right now" : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Action failed");
      flash("ok", data.message || "Updated");
      await load();
    } catch (err) {
      flash("err", err instanceof Error ? err.message : "Action failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <p style={{ color: "var(--muted)", marginTop: 0 }}>
        Manage the Dining guide — visitor suggestions, restaurants, community
        reviews, and kitchen interviews. Leaderboards update automatically from
        star ratings.
      </p>
      {msg && <div className={`msg msg-${msg.kind}`}>{msg.text}</div>}

      {closedQueue[0] && (
        <div
          className="fav-site-overlay"
          role="presentation"
          onClick={(e) => {
            if (e.target === e.currentTarget) void decideClosed(true);
          }}
        >
          <div
            className="fav-site-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="dining-closed-title"
          >
            <p className="fav-site-kicker">Possible closed restaurant</p>
            <h2 id="dining-closed-title">{closedQueue[0].name}</h2>
            <p className="fav-site-lead">
              This spot may have gone out of business. Refresh does not delete
              restaurants on its own — you decide.
            </p>
            <p>
              <strong>Why it was flagged:</strong> {closedQueue[0].reason}
            </p>
            <p style={{ color: "var(--muted)" }}>{closedQueue[0].evidence}</p>
            {closedQueue[0].area && (
              <p style={{ color: "var(--muted)" }}>
                Listed area: {closedQueue[0].area}
              </p>
            )}
            <p>
              Remove it if neighbors can no longer eat there. Keep it if you
              are not sure — it stays in Dining with its reviews.
            </p>
            <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
              {closedQueue.length} possible closed listing
              {closedQueue.length === 1 ? "" : "s"} to review.
            </p>
            <div className="hero-actions">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => void decideClosed(true)}
              >
                Keep it
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => void decideClosed(false)}
              >
                Remove from Dining
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="admin-tabs" style={{ marginBottom: "1rem" }}>
        <button
          type="button"
          className="active"
          disabled={busy || refreshing}
          onClick={() => void refreshRestaurants()}
        >
          {refreshing ? "Refreshing…" : "Refresh restaurants"}
        </button>
        <button
          type="button"
          className={sub === "suggestions" ? "active" : ""}
          onClick={() => setSub("suggestions")}
        >
          Suggestions{pendingCount > 0 ? ` (${pendingCount})` : ""}
        </button>
        <button
          type="button"
          className={sub === "restaurants" ? "active" : ""}
          onClick={() => setSub("restaurants")}
        >
          Restaurants
        </button>
        <button
          type="button"
          className={sub === "reviews" ? "active" : ""}
          onClick={() => setSub("reviews")}
        >
          Reviews
        </button>
        <button
          type="button"
          className={sub === "interviews" ? "active" : ""}
          onClick={() => setSub("interviews")}
        >
          Interviews
        </button>
      </div>
      <p style={{ color: "var(--muted)", marginTop: 0, fontSize: "0.92rem" }}>
        Refresh looks up public maps and Villages dining guides. Existing spots
        stay unless a listing looks closed — then you choose Keep or Remove.
      </p>
      {refreshSummary && (
        <p className="panel-hint" style={{ marginTop: 0 }}>
          {refreshSummary}
        </p>
      )}

      {sub === "suggestions" && (
        <>
          <div className="section-head" style={{ marginBottom: "0.75rem" }}>
            <div>
              <h2 style={{ margin: 0 }}>Restaurant suggestions</h2>
              <p style={{ margin: "0.35rem 0 0", color: "var(--muted)" }}>
                Visitors submit these from Dining. Approve to list the spot
                live; reject to dismiss.
              </p>
            </div>
            <div className="hero-actions">
              <button
                type="button"
                className={`btn btn-sm ${sugFilter === "pending" ? "btn-primary" : "btn-ghost"}`}
                onClick={() => setSugFilter("pending")}
              >
                Pending ({pendingCount})
              </button>
              <button
                type="button"
                className={`btn btn-sm ${sugFilter === "all" ? "btn-primary" : "btn-ghost"}`}
                onClick={() => setSugFilter("all")}
              >
                All
              </button>
            </div>
          </div>

          {visibleSuggestions.length === 0 ? (
            <div className="empty-state">
              {sugFilter === "pending"
                ? "No pending suggestions — nice and quiet."
                : "No suggestions yet."}
            </div>
          ) : (
            <div className="admin-list">
              {visibleSuggestions.map((s) => (
                <article key={s.id} className="about-panel admin-list-item">
                  <div className="card-meta">
                    <span className="pill">{s.status}</span>
                    <span className="pill pill-cuisine">
                      {cuisineLabel(s.cuisine, s.cuisineOther)}
                    </span>
                    <span>{s.priceRange}</span>
                    <span>{s.area}</span>
                    <time dateTime={s.createdAt}>
                      {new Date(s.createdAt).toLocaleString()}
                    </time>
                  </div>
                  <h3 style={{ margin: "0.4rem 0 0.25rem" }}>{s.name}</h3>
                  <p style={{ margin: "0 0 0.5rem", color: "var(--muted)" }}>
                    {s.description}
                  </p>
                  {s.specialties?.length > 0 && (
                    <p style={{ margin: "0 0 0.5rem", fontSize: "0.9rem" }}>
                      <strong>Must-tries:</strong> {s.specialties.join(" · ")}
                    </p>
                  )}
                  <p style={{ margin: "0 0 0.35rem", fontSize: "0.9rem" }}>
                    <strong>Suggested by:</strong> {s.suggestedBy}
                    {s.suggestedByEmail ? ` · ${s.suggestedByEmail}` : ""}
                  </p>
                  {s.note && (
                    <p style={{ margin: "0 0 0.35rem", fontSize: "0.9rem" }}>
                      <strong>Note:</strong> {s.note}
                    </p>
                  )}
                  {(s.address || s.phone || s.website) && (
                    <p
                      style={{
                        margin: "0 0 0.65rem",
                        fontSize: "0.88rem",
                        color: "var(--muted)",
                      }}
                    >
                      {[s.address, s.phone, s.website].filter(Boolean).join(" · ")}
                    </p>
                  )}
                  {s.status === "approved" && s.approvedRestaurantId && (
                    <p className="panel-hint" style={{ marginTop: 0 }}>
                      Live restaurant id: {s.approvedRestaurantId}
                    </p>
                  )}
                  {s.status === "rejected" && s.rejectReason && (
                    <p className="panel-hint" style={{ marginTop: 0 }}>
                      Rejected: {s.rejectReason}
                    </p>
                  )}
                  <div className="hero-actions">
                    {s.status === "pending" && (
                      <>
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          disabled={busy}
                          onClick={() => suggestionAction("approve", s.id)}
                        >
                          Approve &amp; list
                        </button>
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm"
                          disabled={busy}
                          onClick={() => suggestionAction("reject", s.id)}
                        >
                          Reject
                        </button>
                      </>
                    )}
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      disabled={busy}
                      onClick={() => {
                        if (
                          confirm(
                            "Delete this suggestion permanently?"
                          )
                        ) {
                          void suggestionAction("delete", s.id);
                        }
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </>
      )}

      {sub === "restaurants" && (
        <>
          <div
            ref={restFormRef}
            id="admin-dining-edit"
            className="dining-anchor-target"
          >
          <h2>{restForm.id ? "Edit restaurant" : "Add restaurant"}</h2>
          <form className="form-grid" onSubmit={saveRestaurant}>
            <div className="form-row">
              <div className="field">
                <label>Name</label>
                <input
                  value={restForm.name}
                  onChange={(e) => setRestForm((f) => ({ ...f, name: e.target.value }))}
                  required
                />
              </div>
              <div className="field">
                <label>Slug (optional)</label>
                <input
                  value={restForm.slug}
                  onChange={(e) => setRestForm((f) => ({ ...f, slug: e.target.value }))}
                  placeholder="auto-from-name"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="field">
                <label>Cuisine</label>
                <select
                  value={restForm.cuisine}
                  onChange={(e) =>
                    setRestForm((f) => ({ ...f, cuisine: e.target.value as Cuisine }))
                  }
                >
                  {CUISINES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label>Price</label>
                <select
                  value={restForm.priceRange}
                  onChange={(e) =>
                    setRestForm((f) => ({
                      ...f,
                      priceRange: e.target.value as PriceRange,
                    }))
                  }
                >
                  {PRICE_RANGES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {restForm.cuisine === "Other" ? (
              <div className="field">
                <label>Other cuisine (suggested)</label>
                <input
                  value={restForm.cuisineOther}
                  onChange={(e) =>
                    setRestForm((f) => ({
                      ...f,
                      cuisineOther: e.target.value,
                    }))
                  }
                  placeholder="e.g. Ethiopian, Peruvian, fusion…"
                />
              </div>
            ) : null}
            <div className="form-row">
              <div className="field">
                <label>Area</label>
                <input
                  value={restForm.area}
                  onChange={(e) => setRestForm((f) => ({ ...f, area: e.target.value }))}
                  placeholder="Spanish Springs"
                />
              </div>
              <div className="field">
                <label>Address</label>
                <input
                  value={restForm.address}
                  onChange={(e) => setRestForm((f) => ({ ...f, address: e.target.value }))}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="field">
                <label>Phone</label>
                <input
                  value={restForm.phone}
                  onChange={(e) => setRestForm((f) => ({ ...f, phone: e.target.value }))}
                />
              </div>
              <div className="field">
                <label>Website</label>
                <input
                  value={restForm.website}
                  onChange={(e) => setRestForm((f) => ({ ...f, website: e.target.value }))}
                />
              </div>
            </div>
            <div className="field">
              <label>Description (optional)</label>
              <textarea
                value={restForm.description}
                onChange={(e) =>
                  setRestForm((f) => ({ ...f, description: e.target.value }))
                }
              />
            </div>
            <div className="form-row">
              <div className="field">
                <label>Specialties (comma-separated)</label>
                <input
                  value={restForm.specialties}
                  onChange={(e) =>
                    setRestForm((f) => ({ ...f, specialties: e.target.value }))
                  }
                />
              </div>
              <div className="field">
                <label>Tags (comma-separated)</label>
                <input
                  value={restForm.tags}
                  onChange={(e) => setRestForm((f) => ({ ...f, tags: e.target.value }))}
                />
              </div>
            </div>
            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={restForm.featured}
                onChange={(e) =>
                  setRestForm((f) => ({ ...f, featured: e.target.checked }))
                }
              />
              Featured
            </label>
            <div className="admin-actions">
              <button type="submit" className="btn btn-primary" disabled={busy}>
                {busy ? "Saving…" : restForm.id ? "Update restaurant" : "Add restaurant"}
              </button>
              {restForm.id && (
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setRestForm(emptyRest)}
                >
                  Cancel edit
                </button>
              )}
            </div>
          </form>
          </div>

          <h2 style={{ marginTop: "1.75rem" }}>Directory</h2>
          <div className="admin-list">
            {restaurants.map((r) => (
              <div key={r.id} className="admin-item">
                <div>
                  <strong>{r.name}</strong>
                  <span>
                    {cuisineLabel(r.cuisine, r.cuisineOther)} · {r.priceRange} · {r.stats.averageRating || "—"}★ (
                    {r.stats.reviewCount}) · {r.area}
                  </span>
                </div>
                <div className="admin-actions">
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => editRestaurant(r)}>
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => removeRestaurant(r.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {sub === "reviews" && (
        <>
          <h2>Community reviews</h2>
          <p style={{ color: "var(--muted)" }}>
            Hide spam or delete outright. Hidden reviews leave the leaderboards.
          </p>
          <div className="admin-list">
            {reviews.length === 0 && (
              <p style={{ color: "var(--muted)" }}>No reviews yet.</p>
            )}
            {reviews.map((r) => (
              <div key={r.id} className="admin-item">
                <div>
                  <strong>
                    {r.rating}★ · {r.title}
                  </strong>
                  <span>
                    {r.authorName} on {restName(r.restaurantId)}
                    {r.hidden ? " · HIDDEN" : ""}
                  </span>
                </div>
                <div className="admin-actions">
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => hideReview(r.id, !r.hidden)}
                  >
                    {r.hidden ? "Unhide" : "Hide"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => removeReview(r.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {sub === "interviews" && (
        <>
          <h2>{intForm.id ? "Edit interview" : "New interview"}</h2>
          <form className="form-grid" onSubmit={saveInterview}>
            <div className="field">
              <label>Restaurant</label>
              <select
                value={intForm.restaurantId}
                onChange={(e) =>
                  setIntForm((f) => ({ ...f, restaurantId: e.target.value }))
                }
                required
              >
                <option value="">Select…</option>
                {restaurants.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-row">
              <div className="field">
                <label>Person name</label>
                <input
                  value={intForm.personName}
                  onChange={(e) =>
                    setIntForm((f) => ({ ...f, personName: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="field">
                <label>Role</label>
                <input
                  value={intForm.role}
                  onChange={(e) => setIntForm((f) => ({ ...f, role: e.target.value }))}
                  required
                  placeholder="Executive Chef"
                />
              </div>
            </div>
            <div className="field">
              <label>Title</label>
              <input
                value={intForm.title}
                onChange={(e) => setIntForm((f) => ({ ...f, title: e.target.value }))}
                required
              />
            </div>
            <div className="field">
              <label>Excerpt</label>
              <input
                value={intForm.excerpt}
                onChange={(e) => setIntForm((f) => ({ ...f, excerpt: e.target.value }))}
              />
            </div>
            <div className="field">
              <label>Pull quote (optional)</label>
              <input
                value={intForm.quote}
                onChange={(e) => setIntForm((f) => ({ ...f, quote: e.target.value }))}
              />
            </div>
            <div className="field">
              <label>Full interview</label>
              <textarea
                value={intForm.body}
                onChange={(e) => setIntForm((f) => ({ ...f, body: e.target.value }))}
                required
                rows={6}
              />
            </div>
            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={intForm.featured}
                onChange={(e) =>
                  setIntForm((f) => ({ ...f, featured: e.target.checked }))
                }
              />
              Featured
            </label>
            <div className="admin-actions">
              <button type="submit" className="btn btn-primary" disabled={busy}>
                {busy ? "Saving…" : intForm.id ? "Update interview" : "Publish interview"}
              </button>
              {intForm.id && (
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setIntForm(emptyInt)}
                >
                  Cancel edit
                </button>
              )}
            </div>
          </form>

          <h2 style={{ marginTop: "1.75rem" }}>Published interviews</h2>
          <div className="admin-list">
            {interviews.map((i) => (
              <div key={i.id} className="admin-item">
                <div>
                  <strong>{i.title}</strong>
                  <span>
                    {i.personName} · {restName(i.restaurantId)}
                  </span>
                </div>
                <div className="admin-actions">
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => editInterview(i)}>
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => removeInterview(i.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
