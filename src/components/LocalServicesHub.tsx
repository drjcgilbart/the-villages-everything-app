"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  LocalServiceDetailLightbox,
  LOCAL_SVC_UPDATE_EVENT,
} from "@/components/LocalServiceDetailLightbox";
import { StarRating } from "@/components/StarRating";
import { VillagerOwnedBadge } from "@/components/VillagerOwnedBadge";
import {
  LOCAL_PROS_CATEGORIES,
  isVillagerOwned,
  listingMainPhoto,
  listingPhotos,
  listingTradeCategory,
  type LocalServiceCategory,
  type LocalServiceListing,
} from "@/lib/localServicesTypes";
import { prepareUploadImageFile } from "@/lib/browserImage";

type Feed = {
  listings: LocalServiceListing[];
  categories: readonly string[];
};

const MAX_PHOTOS = 3;

type SubmitFlash = {
  kind: "ok" | "err";
  title: string;
  text: string;
  extra: string;
};

function truncate(text: string, max = 140) {
  const t = text.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1).trimEnd()}…`;
}

export function LocalServicesHub() {
  const defaultCats = LOCAL_PROS_CATEGORIES;
  const [feed, setFeed] = useState<Feed | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [villagerOnly, setVillagerOnly] = useState(false);
  const [detail, setDetail] = useState<LocalServiceListing | null>(null);

  // Form
  const [businessName, setBusinessName] = useState("");
  const [contactName, setContactName] = useState("");
  const [formCategory, setFormCategory] = useState<LocalServiceCategory>(
    defaultCats[0]
  );
  const [description, setDescription] = useState("");
  const [village, setVillage] = useState("");
  const [serviceArea, setServiceArea] = useState("");
  const [address, setAddress] = useState("");
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
  const [submitFlash, setSubmitFlash] = useState<SubmitFlash | null>(null);
  const [sentOk, setSentOk] = useState(false);
  const [villagerOwned, setVillagerOwned] = useState(false);
  const submitPopupRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/local-services", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not load");
      setFeed({
        listings: data.listings || [],
        categories: data.categories || defaultCats,
      });
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load");
    }
  }, [defaultCats]);

  const prefillUpdate = useCallback((l: LocalServiceListing) => {
    setDetail(null);
    setReplacesId(l.id);
    setBusinessName(l.businessName);
    setContactName(l.contactName);
    setFormCategory(l.category);
    setDescription(l.description);
    setVillage(l.village || "");
    setServiceArea(l.serviceArea || "");
    setAddress(l.address || "");
    setPhone(l.phone || "");
    setEmail(l.email || "");
    setWebsite(l.website || "");
    setPhotos(listingPhotos(l));
    setSubmittedByName(l.contactName);
    setVillagerOwned(isVillagerOwned(l));
    setNote(`Updating “${l.businessName}” — submit for admin approval.`);
    setSubmitFlash(null);
    setSentOk(false);
    document.getElementById("local-service-form")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!submitFlash) return;
    const el = submitPopupRef.current;
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.focus();
  }, [submitFlash]);

  useEffect(() => {
    function onUpdate(e: Event) {
      const listing = (e as CustomEvent<LocalServiceListing>).detail;
      if (listing) prefillUpdate(listing);
    }
    window.addEventListener(LOCAL_SVC_UPDATE_EVENT, onUpdate);
    return () => window.removeEventListener(LOCAL_SVC_UPDATE_EVENT, onUpdate);
  }, [prefillUpdate]);

  const filtered = useMemo(() => {
    const list = feed?.listings || [];
    const q = query.trim().toLowerCase();
    return list.filter((l) => {
      if (villagerOnly && !isVillagerOwned(l)) return false;
      if (
        category !== "all" &&
        l.category !== category &&
        listingTradeCategory(l) !== category
      ) {
        return false;
      }
      if (!q) return true;
      return (
        l.businessName.toLowerCase().includes(q) ||
        l.contactName.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q) ||
        l.category.toLowerCase().includes(q) ||
        (l.village || "").toLowerCase().includes(q)
      );
    });
  }, [feed, category, query, villagerOnly]);

  function openDetail(l: LocalServiceListing) {
    setDetail(l);
  }

  function applyListingUpdate(next: LocalServiceListing) {
    setDetail(next);
    setFeed((prev) =>
      prev
        ? {
            ...prev,
            listings: prev.listings.map((x) =>
              x.id === next.id ? { ...x, ...next } : x
            ),
          }
        : prev
    );
  }

  async function uploadPhoto(file: File): Promise<string> {
    const prepared = await prepareUploadImageFile(file);
    const fd = new FormData();
    fd.append("file", prepared.file);
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
    if (sentOk) return;
    setBusy(true);
    setFormErr(null);
    setNote(null);
    setSubmitFlash(null);
    try {
      const res = await fetch("/api/local-services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scope: "area",
          villagerOwned,
          businessName,
          contactName,
          category: formCategory,
          description,
          village: village || undefined,
          serviceArea: serviceArea || undefined,
          address: address || undefined,
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
      setSubmitFlash({
        kind: "ok",
        title: "It worked — we got your listing!",
        text:
          data.message ||
          "Thanks! Your listing is pending admin approval on Local Pros.",
        extra:
          "Please do not tap Submit again for this same listing. We already have it. An admin will review it before it goes live.",
      });
      setSentOk(true);
      setDescription("");
      setReplacesId("");
      setPhotos([]);
      try {
        await load();
      } catch {
        /* listing already saved — don't hide the success popup */
      }
    } catch (err) {
      const text = err instanceof Error ? err.message : "Submit failed";
      setFormErr(text);
      setSentOk(false);
      setSubmitFlash({
        kind: "err",
        title: "It didn’t go through",
        text,
        extra:
          "Nothing was saved. Fix the issue, then tap Submit for approval once.",
      });
    } finally {
      setBusy(false);
    }
  }

  if (error && !feed) {
    return <div className="empty-state">{error}</div>;
  }
  if (!feed) {
    return (
      <div className="empty-state">
        Loading local pros…
      </div>
    );
  }

  const cats = feed.categories;

  return (
    <div className="local-svc-hub">
      <div className="local-svc-toolbar">
        <label className="rc-field club-search-field">
          <span>Search listings</span>
          <input
            className="rc-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Name, trade, village, city…"
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
        <label className="rc-field" style={{ justifyContent: "flex-end" }}>
          <span className="checkbox-row">
            <input
              type="checkbox"
              checked={villagerOnly}
              onChange={(e) => setVillagerOnly(e.target.checked)}
            />
            Villager-owned only
          </span>
        </label>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state about-panel">
          No approved listings yet
          {category !== "all" ? " in this category" : ""}.{" "}
          Use the form below to submit a business for review. Villager-owned
          listings get a mascot badge.
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
                  {isVillagerOwned(l) ? (
                    <span className="villager-owned-badge-wrap">
                      <VillagerOwnedBadge size="sm" />
                    </span>
                  ) : null}
                </div>
                <div className="local-svc-card-body">
                  <div className="local-svc-card-top">
                    {isVillagerOwned(l) ? <VillagerOwnedBadge size="sm" /> : null}
                    <span className="pill">{l.category}</span>
                    {l.village ? (
                      <span className="pill">{l.village}</span>
                    ) : null}
                    {l.serviceArea ? (
                      <span className="pill">{l.serviceArea}</span>
                    ) : null}
                  </div>
                  <h3>{l.businessName}</h3>
                  <p className="local-svc-contact">
                    <strong>{l.contactName}</strong>
                    {l.address ? (
                      <>
                        <br />
                        <span className="local-svc-address">{l.address}</span>
                      </>
                    ) : null}
                    {l.phone ? (
                      <>
                        <br />
                        <a
                          href={`tel:${l.phone.replace(/[^\d+]/g, "")}`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {l.phone}
                        </a>
                      </>
                    ) : null}
                    {l.website ? (
                      <>
                        <br />
                        <a
                          href={l.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Website
                        </a>
                      </>
                    ) : null}
                  </p>
                  {l.stats && l.stats.reviewCount > 0 ? (
                    <div className="local-svc-card-rating">
                      <StarRating
                        value={l.stats.averageRating}
                        size="sm"
                        showValue
                      />
                      <small>
                        {l.stats.reviewCount} vote
                        {l.stats.reviewCount === 1 ? "" : "s"}
                      </small>
                    </div>
                  ) : (
                    <p className="local-svc-card-hint" style={{ marginTop: 0 }}>
                      No ratings yet — be the first
                    </p>
                  )}
                  <p className="local-svc-desc local-svc-desc-clip">
                    {truncate(l.description)}
                  </p>
                  <p className="local-svc-card-hint">
                    Click for full details, photos &amp; to vote
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {detail ? (
        <LocalServiceDetailLightbox
          key={detail.id}
          listing={detail}
          onClose={() => setDetail(null)}
          onListingUpdate={applyListingUpdate}
        />
      ) : null}

      <div
        className="about-panel local-svc-form-panel"
        id="local-service-form"
        style={{ marginTop: "1.75rem" }}
      >
        <span className="kicker">List your business</span>
        <h2 style={{ marginTop: "0.35rem" }}>
          {replacesId ? "Update a listing" : "Submit for admin approval"}
        </h2>
        <p style={{ color: "var(--muted)", marginTop: 0 }}>
          Trades, salons, vets, sitters, and neighbor-run services all live
          here. If the owner lives in The Villages, check the Villager box so
          the mascot badge shows on the listing. Listings go live only after
          admin approval. Photos optional: 1 main photo for the card, plus up
          to 2 extras (JPG/PNG/WebP, under 3&nbsp;MB each).
        </p>

        {note ? <div className="msg msg-ok">{note}</div> : null}
        {formErr ? <div className="msg msg-err">{formErr}</div> : null}

        <form
          className="form-grid"
          onSubmit={onSubmit}
          onInput={() => {
            if (sentOk) setSentOk(false);
          }}
        >
          <div className="field">
            <label htmlFor="svc-business">Business / display name *</label>
            <input
              id="svc-business"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              required
              maxLength={100}
              placeholder="ABC Electric of Lady Lake"
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
              {(feed.categories.length
                ? feed.categories
                : LOCAL_PROS_CATEGORIES
              ).map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="svc-village">
              Village / neighborhood (optional)
            </label>
            <input
              id="svc-village"
              value={village}
              onChange={(e) => setVillage(e.target.value)}
              maxLength={80}
              placeholder="Fenney, Colony, Sumter Landing…"
            />
          </div>
          <div className="field">
            <label htmlFor="svc-area">City / towns you serve (optional)</label>
            <input
              id="svc-area"
              value={serviceArea}
              onChange={(e) => setServiceArea(e.target.value)}
              maxLength={120}
              placeholder="Lady Lake, Wildwood, Fruitland Park…"
            />
          </div>
          <div className="field field-full">
            <label htmlFor="svc-address">Street address (optional)</label>
            <input
              id="svc-address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              maxLength={200}
              placeholder="123 Main St, Lady Lake, FL 32159"
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
            <label htmlFor="svc-villager" className="checkbox-row">
              <input
                id="svc-villager"
                type="checkbox"
                checked={villagerOwned}
                onChange={(e) => setVillagerOwned(e.target.checked)}
              />
              The owner lives in The Villages (shows the Villager mascot badge)
            </label>
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
          <div className="field-full local-svc-submit-wrap">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={busy || uploading || sentOk}
            >
              {busy
                ? "Submitting… please wait"
                : sentOk
                  ? "Submitted — you’re done"
                  : replacesId
                    ? "Submit update for approval"
                    : "Submit for approval"}
            </button>
            {submitFlash ? (
              <div
                ref={submitPopupRef}
                id="local-svc-submit-popup"
                className={`local-svc-submit-popup local-svc-submit-popup-${submitFlash.kind}`}
                role="alert"
                aria-live="assertive"
                tabIndex={-1}
              >
                <strong>{submitFlash.title}</strong>
                <p>{submitFlash.text}</p>
                <p className="local-svc-submit-popup-extra">{submitFlash.extra}</p>
                <button
                  type="button"
                  className="btn btn-sm local-svc-submit-popup-ok-btn"
                  onClick={() => setSubmitFlash(null)}
                >
                  OK, got it
                </button>
              </div>
            ) : null}
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
