"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  LOCAL_SERVICE_CATEGORIES,
  listingMainPhoto,
  listingPhotos,
  type LocalServiceCategory,
  type LocalServiceListing,
} from "@/lib/localServicesTypes";

type Feed = {
  listings: LocalServiceListing[];
  categories: readonly string[];
};

const MAX_PHOTOS = 3;

function truncate(text: string, max = 140) {
  const t = text.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1).trimEnd()}…`;
}

export function LocalServicesHub() {
  const [feed, setFeed] = useState<Feed | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [detail, setDetail] = useState<LocalServiceListing | null>(null);
  const [detailPhotoIdx, setDetailPhotoIdx] = useState(0);

  // Form
  const [businessName, setBusinessName] = useState("");
  const [contactName, setContactName] = useState("");
  const [formCategory, setFormCategory] =
    useState<LocalServiceCategory>("Home & Handyman");
  const [description, setDescription] = useState("");
  const [village, setVillage] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  /** photos[0] = main, photos[1..2] = extras */
  const [photos, setPhotos] = useState<string[]>([]);
  const [submittedByName, setSubmittedByName] = useState("");
  const [replacesId, setReplacesId] = useState("");
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [formErr, setFormErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/local-services", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not load");
      setFeed({
        listings: data.listings || [],
        categories: data.categories || LOCAL_SERVICE_CATEGORIES,
      });
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

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

  const filtered = useMemo(() => {
    const list = feed?.listings || [];
    const q = query.trim().toLowerCase();
    return list.filter((l) => {
      if (category !== "all" && l.category !== category) return false;
      if (!q) return true;
      return (
        l.businessName.toLowerCase().includes(q) ||
        l.contactName.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q) ||
        l.category.toLowerCase().includes(q) ||
        (l.village || "").toLowerCase().includes(q)
      );
    });
  }, [feed, category, query]);

  function openDetail(l: LocalServiceListing) {
    setDetail(l);
    setDetailPhotoIdx(0);
  }

  function prefillUpdate(l: LocalServiceListing) {
    setDetail(null);
    setReplacesId(l.id);
    setBusinessName(l.businessName);
    setContactName(l.contactName);
    setFormCategory(l.category);
    setDescription(l.description);
    setVillage(l.village || "");
    setPhone(l.phone || "");
    setEmail(l.email || "");
    setWebsite(l.website || "");
    setPhotos(listingPhotos(l));
    setSubmittedByName(l.contactName);
    setNote(`Updating “${l.businessName}” — submit for admin approval.`);
    document.getElementById("local-service-form")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  async function uploadPhoto(file: File): Promise<string> {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/local-services/upload", {
      method: "POST",
      body: fd,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Upload failed");
    return data.url as string;
  }

  async function onPhotosChange(files: FileList | null) {
    if (!files || files.length === 0) return;
    const room = MAX_PHOTOS - photos.length;
    if (room <= 0) {
      setFormErr("You can add up to 3 photos (1 main + 2 extras).");
      return;
    }
    setUploading(true);
    setFormErr(null);
    try {
      const batch = Array.from(files).slice(0, room);
      const urls: string[] = [];
      for (const file of batch) {
        urls.push(await uploadPhoto(file));
      }
      setPhotos((prev) => [...prev, ...urls].slice(0, MAX_PHOTOS));
    } catch (e) {
      setFormErr(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function removePhoto(index: number) {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  }

  function makeMain(index: number) {
    if (index <= 0) return;
    setPhotos((prev) => {
      const next = [...prev];
      const [picked] = next.splice(index, 1);
      next.unshift(picked);
      return next;
    });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setFormErr(null);
    setNote(null);
    try {
      const res = await fetch("/api/local-services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName,
          contactName,
          category: formCategory,
          description,
          village: village || undefined,
          phone: phone || undefined,
          email: email || undefined,
          website: website || undefined,
          photos: photos.length ? photos : undefined,
          submittedByName: submittedByName || contactName,
          replacesId: replacesId || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submit failed");
      setNote(data.message || "Submitted for approval.");
      setDescription("");
      setReplacesId("");
      setPhotos([]);
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
    return <div className="empty-state">Loading local services…</div>;
  }

  const cats = feed.categories;
  const detailGallery = detail ? listingPhotos(detail) : [];
  const detailMain =
    detailGallery[detailPhotoIdx] || detailGallery[0] || null;

  return (
    <div className="local-svc-hub">
      <div className="local-svc-toolbar">
        <label className="rc-field club-search-field">
          <span>Search listings</span>
          <input
            className="rc-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Name, service, village…"
          />
        </label>
        <label className="rc-field">
          <span>Category</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="all">All categories</option>
            {cats.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state about-panel">
          No approved service listings yet
          {category !== "all" ? " in this category" : ""}. Villagers: use the
          form below to submit your service for review.
        </div>
      ) : (
        <div className="local-svc-grid">
          {filtered.map((l) => {
            const main = listingMainPhoto(l);
            const count = listingPhotos(l).length;
            return (
              <article
                key={l.id}
                className="about-panel local-svc-card local-svc-card-clickable"
                role="button"
                tabIndex={0}
                onClick={() => openDetail(l)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openDetail(l);
                  }
                }}
                aria-label={`Open details for ${l.businessName}`}
              >
                <div className="local-svc-card-media">
                  {main ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={main} alt="" className="local-svc-photo" />
                  ) : (
                    <div className="local-svc-photo-placeholder" aria-hidden>
                      ★
                    </div>
                  )}
                  {count > 1 ? (
                    <span className="local-svc-photo-count">
                      {count} photos
                    </span>
                  ) : null}
                </div>
                <div className="local-svc-card-body">
                  <div className="local-svc-card-top">
                    <span className="pill">{l.category}</span>
                    {l.village ? (
                      <span className="pill">{l.village}</span>
                    ) : null}
                  </div>
                  <h3>{l.businessName}</h3>
                  <p className="local-svc-contact">
                    <strong>{l.contactName}</strong>
                  </p>
                  <p className="local-svc-desc local-svc-desc-clip">
                    {truncate(l.description)}
                  </p>
                  <p className="local-svc-card-hint">
                    Click for full details
                    {count > 0 ? " & photos" : ""}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {detail ? (
        <div
          className="local-svc-lightbox"
          role="dialog"
          aria-modal="true"
          aria-labelledby="local-svc-lightbox-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setDetail(null);
          }}
        >
          <div className="local-svc-lightbox-panel about-panel">
            <div className="local-svc-lightbox-head">
              <div>
                <div className="local-svc-card-top">
                  <span className="pill">{detail.category}</span>
                  {detail.village ? (
                    <span className="pill">{detail.village}</span>
                  ) : null}
                </div>
                <h3 id="local-svc-lightbox-title">{detail.businessName}</h3>
                <p className="local-svc-contact" style={{ marginBottom: 0 }}>
                  Contact: <strong>{detail.contactName}</strong>
                </p>
              </div>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => setDetail(null)}
              >
                Close
              </button>
            </div>

            {detailMain ? (
              <div className="local-svc-lightbox-media">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={detailMain}
                  alt={`${detail.businessName} photo`}
                  className="local-svc-lightbox-hero"
                />
                {detailGallery.length > 1 ? (
                  <div className="local-svc-lightbox-thumbs">
                    {detailGallery.map((url, i) => (
                      <button
                        key={`${url}-${i}`}
                        type="button"
                        className={`local-svc-thumb-btn${
                          i === detailPhotoIdx ? " is-active" : ""
                        }`}
                        onClick={() => setDetailPhotoIdx(i)}
                        aria-label={
                          i === 0
                            ? "Show main photo"
                            : `Show photo ${i + 1}`
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
            ) : null}

            <div className="local-svc-lightbox-body">
              <p className="local-svc-lightbox-desc">{detail.description}</p>
              <ul className="club-leader-meta">
                {detail.phone ? (
                  <li>
                    <strong>Phone:</strong>{" "}
                    <a
                      href={`tel:${detail.phone.replace(/[^\d+]/g, "")}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {detail.phone}
                    </a>
                  </li>
                ) : null}
                {detail.email ? (
                  <li>
                    <strong>Email:</strong>{" "}
                    <a
                      href={`mailto:${detail.email}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {detail.email}
                    </a>
                  </li>
                ) : null}
                {detail.website ? (
                  <li>
                    <strong>Website:</strong>{" "}
                    <a
                      href={detail.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Visit site
                    </a>
                  </li>
                ) : null}
              </ul>
              <div className="hero-actions">
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => prefillUpdate(detail)}
                >
                  Update this listing
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => setDetail(null)}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div
        className="about-panel local-svc-form-panel"
        id="local-service-form"
        style={{ marginTop: "1.75rem" }}
      >
        <span className="kicker">List your service</span>
        <h2 style={{ marginTop: "0.35rem" }}>
          {replacesId ? "Update a listing" : "Submit for admin approval"}
        </h2>
        <p style={{ color: "var(--muted)", marginTop: 0 }}>
          Tell neighbors what you do. Listings go live only after admin
          approval. Photos optional: 1 main photo for the card, plus up to 2
          extras in the detail view (JPG/PNG/WebP, under 3&nbsp;MB each).
        </p>

        {note ? <div className="msg msg-ok">{note}</div> : null}
        {formErr ? <div className="msg msg-err">{formErr}</div> : null}

        <form className="form-grid" onSubmit={onSubmit}>
          <div className="field">
            <label htmlFor="svc-business">Business / display name *</label>
            <input
              id="svc-business"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              required
              maxLength={100}
              placeholder="Cart Path Handyman"
            />
          </div>
          <div className="field">
            <label htmlFor="svc-contact">Contact name *</label>
            <input
              id="svc-contact"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              required
              maxLength={80}
              placeholder="Who to ask for"
            />
          </div>
          <div className="field">
            <label htmlFor="svc-category">Category *</label>
            <select
              id="svc-category"
              value={formCategory}
              onChange={(e) =>
                setFormCategory(e.target.value as LocalServiceCategory)
              }
            >
              {LOCAL_SERVICE_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="svc-village">Village / area (optional)</label>
            <input
              id="svc-village"
              value={village}
              onChange={(e) => setVillage(e.target.value)}
              maxLength={80}
              placeholder="Fenney, Colony, Sumter Landing…"
            />
          </div>
          <div className="field field-full">
            <label htmlFor="svc-desc">What you do *</label>
            <textarea
              id="svc-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              maxLength={800}
              placeholder="Short description — services, hours, areas you cover, price range if you like…"
            />
          </div>
          <div className="field">
            <label htmlFor="svc-phone">Phone</label>
            <input
              id="svc-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              maxLength={40}
              placeholder="(352) …"
            />
          </div>
          <div className="field">
            <label htmlFor="svc-email">Email</label>
            <input
              id="svc-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              maxLength={120}
            />
          </div>
          <div className="field">
            <label htmlFor="svc-web">Website (optional)</label>
            <input
              id="svc-web"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              maxLength={200}
              placeholder="https://…"
            />
          </div>
          <div className="field">
            <label htmlFor="svc-submitter">Your name (if different)</label>
            <input
              id="svc-submitter"
              value={submittedByName}
              onChange={(e) => setSubmittedByName(e.target.value)}
              maxLength={80}
              placeholder="Defaults to contact name"
            />
          </div>
          <div className="field field-full">
            <label htmlFor="svc-photos">
              Photos (optional — main + up to 2 more)
            </label>
            <input
              id="svc-photos"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.jpg,.jpeg,.png,.webp"
              multiple
              disabled={uploading || busy || photos.length >= MAX_PHOTOS}
              onChange={(e) => {
                onPhotosChange(e.target.files);
                e.target.value = "";
              }}
            />
            <p className="panel-hint">
              First photo is the <strong>main</strong> card image. You can set
              another as main after upload. {photos.length}/{MAX_PHOTOS}{" "}
              uploaded.
            </p>
            {uploading ? (
              <p className="panel-hint">Uploading photo(s)…</p>
            ) : null}
            {photos.length > 0 ? (
              <div className="local-svc-form-photos">
                {photos.map((url, i) => (
                  <div key={`${url}-${i}`} className="local-svc-form-photo">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt={i === 0 ? "Main photo" : `Extra photo ${i}`}
                    />
                    <span className="local-svc-form-photo-badge">
                      {i === 0 ? "Main" : `Extra ${i}`}
                    </span>
                    <div className="local-svc-form-photo-actions">
                      {i > 0 ? (
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm"
                          onClick={() => makeMain(i)}
                        >
                          Make main
                        </button>
                      ) : null}
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        onClick={() => removePhoto(i)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
          {replacesId ? (
            <p className="panel-hint field-full">
              This will replace listing <code>{replacesId}</code> when approved.{" "}
              <button
                type="button"
                className="text-link"
                onClick={() => setReplacesId("")}
              >
                Clear update mode
              </button>
            </p>
          ) : null}
          <div className="field-full">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={busy || uploading}
            >
              {busy
                ? "Submitting…"
                : replacesId
                  ? "Submit update for approval"
                  : "Submit for approval"}
            </button>
          </div>
        </form>
        <p className="panel-hint" style={{ marginBottom: 0 }}>
          Need at least one contact method (phone, email, or website). Not an
          official The Villages® directory — neighbors hire at their own
          discretion.
        </p>
      </div>
    </div>
  );
}
