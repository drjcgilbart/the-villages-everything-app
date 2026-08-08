"use client";

import { useState } from "react";
import { CUISINES, PRICE_RANGES, type Cuisine, type PriceRange } from "@/lib/diningTypes";

export function RestaurantSuggestForm() {
  const [name, setName] = useState("");
  const [cuisine, setCuisine] = useState<Cuisine>("American");
  const [area, setArea] = useState("The Villages");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [priceRange, setPriceRange] = useState<PriceRange>("$$");
  const [description, setDescription] = useState("");
  const [specialties, setSpecialties] = useState("");
  const [suggestedBy, setSuggestedBy] = useState("");
  const [suggestedByEmail, setSuggestedByEmail] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setOk(null);
    try {
      const res = await fetch("/api/dining/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "submit",
          name,
          cuisine,
          area,
          address,
          phone,
          website,
          priceRange,
          description,
          specialties,
          suggestedBy,
          suggestedByEmail,
          note,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not submit suggestion");
      setOk(
        data.message ||
          "Thanks! Once an admin approves it, the restaurant will show up in Dining."
      );
      setName("");
      setAddress("");
      setPhone("");
      setWebsite("");
      setDescription("");
      setSpecialties("");
      setNote("");
      setCuisine("American");
      setPriceRange("$$");
      setArea("The Villages");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit suggestion");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="form-grid review-form dining-suggest-form" onSubmit={submit}>
      <h3 style={{ marginTop: 0 }}>Suggest a restaurant</h3>
      <p className="review-form-lead">
        Know a great spot in or around The Villages that isn&apos;t listed yet?
        Send it for review. After admin approval, it appears in the Dining guide
        for everyone to rate.
      </p>

      <div className="form-row">
        <div className="field">
          <label htmlFor="sug-name">Restaurant name</label>
          <input
            id="sug-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength={120}
            placeholder="e.g. Bella Vita Italian Steakhouse"
          />
        </div>
        <div className="field">
          <label htmlFor="sug-cuisine">Cuisine</label>
          <select
            id="sug-cuisine"
            value={cuisine}
            onChange={(e) => setCuisine(e.target.value as Cuisine)}
          >
            {CUISINES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="field">
          <label htmlFor="sug-area">Area</label>
          <input
            id="sug-area"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            maxLength={80}
            placeholder="Spanish Springs, Brownwood, Lady Lake…"
          />
        </div>
        <div className="field">
          <label htmlFor="sug-price">Price range</label>
          <select
            id="sug-price"
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value as PriceRange)}
          >
            {PRICE_RANGES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="field">
        <label htmlFor="sug-desc">Why list it? / short description</label>
        <textarea
          id="sug-desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          maxLength={2000}
          rows={3}
          placeholder="What should neighbors know — vibe, early-bird energy, must-order…"
        />
      </div>

      <div className="form-row">
        <div className="field">
          <label htmlFor="sug-address">Address (optional)</label>
          <input
            id="sug-address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            maxLength={160}
          />
        </div>
        <div className="field">
          <label htmlFor="sug-phone">Phone (optional)</label>
          <input
            id="sug-phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            maxLength={40}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="field">
          <label htmlFor="sug-web">Website (optional)</label>
          <input
            id="sug-web"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            maxLength={200}
            placeholder="https://"
          />
        </div>
        <div className="field">
          <label htmlFor="sug-spec">Must-tries (optional, comma-separated)</label>
          <input
            id="sug-spec"
            value={specialties}
            onChange={(e) => setSpecialties(e.target.value)}
            placeholder="Grouper sandwich, key lime pie"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="field">
          <label htmlFor="sug-by">Your name</label>
          <input
            id="sug-by"
            value={suggestedBy}
            onChange={(e) => setSuggestedBy(e.target.value)}
            required
            maxLength={60}
            placeholder="First name is fine"
          />
        </div>
        <div className="field">
          <label htmlFor="sug-email">Email (optional)</label>
          <input
            id="sug-email"
            type="email"
            value={suggestedByEmail}
            onChange={(e) => setSuggestedByEmail(e.target.value)}
            maxLength={120}
            placeholder="If we need a quick follow-up"
          />
        </div>
      </div>

      <div className="field">
        <label htmlFor="sug-note">Note for admin (optional)</label>
        <input
          id="sug-note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          maxLength={500}
          placeholder="e.g. New place near Eastport, great early-bird"
        />
      </div>

      {error && <p className="form-error">{error}</p>}
      {ok && <p className="form-success">{ok}</p>}

      <button type="submit" className="btn btn-primary" disabled={busy}>
        {busy ? "Sending…" : "Submit for approval"}
      </button>
    </form>
  );
}
