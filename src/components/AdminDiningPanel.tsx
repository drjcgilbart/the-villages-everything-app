"use client";

import { useCallback, useEffect, useState } from "react";
import { CUISINES, PRICE_RANGES, type Cuisine, type Interview, type PriceRange, type Restaurant, type RestaurantStats, type Review } from "@/lib/diningTypes";

type RestRow = Restaurant & { stats: RestaurantStats };

type RestForm = {
  id: string;
  name: string;
  slug: string;
  cuisine: Cuisine;
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
  const [restForm, setRestForm] = useState<RestForm>(emptyRest);
  const [intForm, setIntForm] = useState<IntForm>(emptyInt);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [sub, setSub] = useState<"restaurants" | "reviews" | "interviews">("restaurants");

  const flash = (kind: "ok" | "err", text: string) => {
    setMsg({ kind, text });
    setTimeout(() => setMsg(null), 4000);
  };

  const load = useCallback(async () => {
    const [rRes, revRes, iRes] = await Promise.all([
      fetch("/api/dining/restaurants"),
      fetch("/api/dining/reviews?all=1"),
      fetch("/api/dining/interviews"),
    ]);
    const rData = await rRes.json();
    const revData = await revRes.json();
    const iData = await iRes.json();
    setRestaurants(rData.restaurants || []);
    setReviews(revData.reviews || []);
    setInterviews(iData.interviews || []);
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

  return (
    <div>
      <p style={{ color: "var(--muted)", marginTop: 0 }}>
        Manage the Dining guide — restaurants, community reviews, and kitchen
        interviews. Leaderboards update automatically from star ratings.
      </p>
      {msg && <div className={`msg msg-${msg.kind}`}>{msg.text}</div>}

      <div className="admin-tabs" style={{ marginBottom: "1rem" }}>
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

      {sub === "restaurants" && (
        <>
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
              <label>Description</label>
              <textarea
                value={restForm.description}
                onChange={(e) =>
                  setRestForm((f) => ({ ...f, description: e.target.value }))
                }
                required
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

          <h2 style={{ marginTop: "1.75rem" }}>Directory</h2>
          <div className="admin-list">
            {restaurants.map((r) => (
              <div key={r.id} className="admin-item">
                <div>
                  <strong>{r.name}</strong>
                  <span>
                    {r.cuisine} · {r.priceRange} · {r.stats.averageRating || "—"}★ (
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
