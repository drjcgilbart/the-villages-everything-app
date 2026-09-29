"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import type { ItemCondition, MeetupType, YardListing } from "@/lib/yardSaleTypes";
import {
  CATEGORY_OPTIONS,
  CONDITION_LABELS,
  MEETUP_LABELS,
} from "@/lib/yardSaleTypes";
import { formatPrice } from "@/components/YardListingCard";
import { DEFAULT_PHOTO_MAX_BYTES, prepareUploadImageFile } from "@/lib/browserImage";
import { formatDate } from "@/lib/format";

type ListingRow = YardListing & {
  seller?: { name?: string; village?: string; email?: string; phone?: string } | null;
};

type EditDraft = {
  id: string;
  sellerName: string;
  sellerVillage: string;
  sellerEmail: string;
  sellerPhone: string;
  title: string;
  description: string;
  price: string;
  isFree: boolean;
  condition: ItemCondition;
  category: string;
  meetupType: MeetupType;
  meetupNotes: string;
  contactMethod: "email" | "phone" | "either";
  postedBy: string;
  images: string[];
};

/**
 * Yard Sale listings only. Membership approval lives on the Studio
 * “Members” tab (AdminMembersPanel).
 */
export function AdminYardSalePanel() {
  const [listings, setListings] = useState<ListingRow[]>([]);
  const [editing, setEditing] = useState<EditDraft | null>(null);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(
    null
  );
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);

  const flash = (kind: "ok" | "err", text: string) => {
    setMsg({ kind, text });
    setTimeout(() => setMsg(null), 4000);
  };

  const load = useCallback(async () => {
    const lRes = await fetch("/api/yard-sale?all=1", { cache: "no-store" });
    const lData = await lRes.json();
    if (!lRes.ok) throw new Error(lData.error || "Could not load listings");
    setListings(lData.listings || []);
  }, []);

  useEffect(() => {
    load().catch((err) => flash("err", err.message || "Load failed"));
  }, [load]);

  async function setListingStatus(id: string, adminStatus: string) {
    setBusy(true);
    try {
      const res = await fetch("/api/yard-sale/listings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, adminStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");
      await load();
      flash("ok", `Listing ${adminStatus}`);
    } catch (err) {
      flash("err", err instanceof Error ? err.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  function startEdit(listing: ListingRow) {
    setEditing({
      id: listing.id,
      sellerName: listing.sellerName || listing.seller?.name || "",
      sellerVillage: listing.sellerVillage || listing.seller?.village || "",
      sellerEmail: listing.sellerEmail || listing.seller?.email || "",
      sellerPhone: listing.sellerPhone || listing.seller?.phone || "",
      title: listing.title,
      description: listing.description,
      price: listing.isFree ? "0" : String(listing.price ?? ""),
      isFree: listing.isFree,
      condition: listing.condition,
      category: listing.category,
      meetupType: listing.meetupType,
      meetupNotes: listing.meetupNotes || "",
      contactMethod: listing.contactMethod,
      postedBy: listing.submittedByName || "Guest",
      images: [...(listing.images || [])],
    });
  }

  function removePhoto(url: string) {
    setEditing((current) =>
      current
        ? { ...current, images: current.images.filter((item) => item !== url) }
        : current
    );
  }

  function makeCover(url: string) {
    setEditing((current) => {
      if (!current) return current;
      return {
        ...current,
        images: [url, ...current.images.filter((item) => item !== url)],
      };
    });
  }

  async function addPhotos(files: FileList | null) {
    if (!files?.length || !editing) return;
    const id = editing.id;
    const room = Math.max(0, 3 - editing.images.length);
    const picked = Array.from(files).slice(0, room);
    if (!picked.length) {
      flash("err", "Maximum 3 photos per listing");
      return;
    }
    setUploading(true);
    try {
      let next = [...editing.images];
      let shrunk = 0;
      for (const file of picked) {
        const prepared = await prepareUploadImageFile(file, {
          maxBytes: DEFAULT_PHOTO_MAX_BYTES,
        });
        if (prepared.compressed) shrunk += 1;
        const fd = new FormData();
        fd.append("file", prepared.file);
        const res = await fetch("/api/yard-sale/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Upload failed");
        next = [...next, data.url];
      }
      setEditing((current) =>
        current && current.id === id ? { ...current, images: next } : current
      );
      flash(
        "ok",
        shrunk ? `Photo added — ${shrunk} shrunk to fit.` : "Photo added. Save the listing to keep it."
      );
    } catch (err) {
      flash("err", err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function saveEdit(e: FormEvent) {
    e.preventDefault();
    if (!editing) return;
    if (!editing.images.length) {
      flash("err", "Keep at least one photo");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/yard-sale/listings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editing.id,
          adminEdit: true,
          sellerName: editing.sellerName,
          sellerVillage: editing.sellerVillage,
          sellerEmail: editing.sellerEmail,
          sellerPhone: editing.sellerPhone,
          title: editing.title,
          description: editing.description,
          isFree: editing.isFree,
          price: editing.isFree ? 0 : Number(editing.price),
          condition: editing.condition,
          category: editing.category,
          meetupType: editing.meetupType,
          meetupNotes: editing.meetupNotes,
          contactMethod: editing.contactMethod,
          images: editing.images,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not save listing");
      setEditing(null);
      await load();
      flash("ok", "Listing updated");
    } catch (err) {
      flash("err", err instanceof Error ? err.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  async function removeListing(id: string) {
    if (!confirm("Delete this listing permanently?")) return;
    const res = await fetch(
      `/api/yard-sale/listings?id=${encodeURIComponent(id)}`,
      { method: "DELETE" }
    );
    const data = await res.json();
    if (!res.ok) flash("err", data.error || "Delete failed");
    else {
      flash("ok", "Listing deleted");
      await load();
    }
  }

  const pendingListings = listings.filter((l) => l.status === "pending");

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Community Yard Sale listings</h2>
      <p className="panel-hint">
        Approve item listings here before they go public.{" "}
        <strong>Membership requests</strong> are on the{" "}
        <strong>Members</strong> tab in this Admin Portal.
      </p>
      {msg && <div className={`msg msg-${msg.kind}`}>{msg.text}</div>}

      <h3>
        Listings{" "}
        {pendingListings.length > 0 && (
          <span className="pill pill-yard">
            {pendingListings.length} pending
          </span>
        )}
      </h3>
      <div className="admin-list">
        {listings.length === 0 && (
          <p className="panel-hint">No listings yet.</p>
        )}
        {listings.map((l) => (
          <div key={l.id} className="admin-item">
            <div
              style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}
            >
              {l.images?.[0] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={l.images[0]}
                  alt=""
                  style={{
                    width: 56,
                    height: 56,
                    objectFit: "cover",
                    borderRadius: 10,
                  }}
                />
              ) : null}
              <div>
                <strong>
                  {l.title}{" "}
                  <span className={`status-tag status-${l.status}`}>
                    {l.status}
                  </span>
                </strong>
                <span>
                  {formatPrice(l)} · Seller: {l.seller?.name || "Unknown seller"}
                  {l.seller?.village ? ` · ${l.seller.village}` : ""} · Posted by{" "}
                  {l.submittedByName || "Guest"} · {l.images?.length || 0} photo(s)
                  {l.videoUrl ? " · video" : ""} · {formatDate(l.createdAt)}
                </span>
              </div>
            </div>
            <div className="admin-actions">
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                disabled={busy}
                onClick={() =>
                  editing?.id === l.id ? setEditing(null) : startEdit(l)
                }
              >
                {editing?.id === l.id ? "Close" : "Edit"}
              </button>
              {l.status !== "approved" && (
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  disabled={busy}
                  onClick={() => setListingStatus(l.id, "approved")}
                >
                  Approve
                </button>
              )}
              {l.status !== "rejected" && (
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  disabled={busy}
                  onClick={() => setListingStatus(l.id, "rejected")}
                >
                  Reject
                </button>
              )}
              {l.status === "approved" && (
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  disabled={busy}
                  onClick={() => setListingStatus(l.id, "sold")}
                >
                  Mark sold
                </button>
              )}
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={() => removeListing(l.id)}
              >
                Delete
              </button>
            </div>
            {editing?.id === l.id ? (
              <form
                className="form-grid"
                style={{ flexBasis: "100%" }}
                onSubmit={saveEdit}
              >
                <p className="panel-hint" style={{ margin: 0 }}>
                  Posted by {editing.postedBy}. That name stays on the admin
                  record. Buyers see the seller name below.
                </p>
                <div className="form-row">
                  <div className="field">
                    <label>Seller name</label>
                    <input
                      required
                      value={editing.sellerName}
                      onChange={(e) =>
                        setEditing({ ...editing, sellerName: e.target.value })
                      }
                    />
                  </div>
                  <div className="field">
                    <label>Village</label>
                    <input
                      value={editing.sellerVillage}
                      onChange={(e) =>
                        setEditing({ ...editing, sellerVillage: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="field">
                    <label>Email</label>
                    <input
                      type="email"
                      value={editing.sellerEmail}
                      onChange={(e) =>
                        setEditing({ ...editing, sellerEmail: e.target.value })
                      }
                    />
                  </div>
                  <div className="field">
                    <label>Phone</label>
                    <input
                      value={editing.sellerPhone}
                      onChange={(e) =>
                        setEditing({ ...editing, sellerPhone: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="field">
                  <label>Title</label>
                  <input
                    required
                    value={editing.title}
                    onChange={(e) =>
                      setEditing({ ...editing, title: e.target.value })
                    }
                  />
                </div>
                <div className="field">
                  <label>Description</label>
                  <textarea
                    required
                    value={editing.description}
                    onChange={(e) =>
                      setEditing({ ...editing, description: e.target.value })
                    }
                  />
                </div>
                <div className="form-row">
                  <div className="field">
                    <label>Category</label>
                    <select
                      value={editing.category}
                      onChange={(e) =>
                        setEditing({ ...editing, category: e.target.value })
                      }
                    >
                      {(CATEGORY_OPTIONS.includes(editing.category)
                        ? CATEGORY_OPTIONS
                        : [editing.category, ...CATEGORY_OPTIONS]
                      ).map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="field">
                    <label>Condition</label>
                    <select
                      value={editing.condition}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          condition: e.target.value as ItemCondition,
                        })
                      }
                    >
                      {Object.entries(CONDITION_LABELS).map(([k, v]) => (
                        <option key={k} value={k}>
                          {v}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="field">
                    <label>Price (USD)</label>
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      disabled={editing.isFree}
                      value={editing.isFree ? "0" : editing.price}
                      onChange={(e) =>
                        setEditing({ ...editing, price: e.target.value })
                      }
                    />
                  </div>
                  <div className="field" style={{ display: "flex", alignItems: "flex-end" }}>
                    <label className="checkbox-row" style={{ width: "100%" }}>
                      <input
                        type="checkbox"
                        checked={editing.isFree}
                        onChange={(e) =>
                          setEditing({ ...editing, isFree: e.target.checked })
                        }
                      />
                      Free / giveaway
                    </label>
                  </div>
                </div>
                <div className="form-row">
                  <div className="field">
                    <label>Meetup</label>
                    <select
                      value={editing.meetupType}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          meetupType: e.target.value as MeetupType,
                        })
                      }
                    >
                      {Object.entries(MEETUP_LABELS).map(([k, v]) => (
                        <option key={k} value={k}>
                          {v}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="field">
                    <label>Preferred contact</label>
                    <select
                      value={editing.contactMethod}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          contactMethod: e.target.value as EditDraft["contactMethod"],
                        })
                      }
                    >
                      <option value="either">Email or phone</option>
                      <option value="email">Email only</option>
                      <option value="phone">Phone only</option>
                    </select>
                  </div>
                </div>
                <div className="field">
                  <label>Meetup notes</label>
                  <input
                    value={editing.meetupNotes}
                    onChange={(e) =>
                      setEditing({ ...editing, meetupNotes: e.target.value })
                    }
                  />
                </div>
                <div className="field">
                  <label>
                    Photos (up to 3). The first photo is the cover buyers see.{" "}
                    {uploading ? "Uploading…" : ""}
                  </label>
                  {editing.images.length > 0 ? (
                    <div className="admin-photo-grid" style={{ marginTop: "0.5rem" }}>
                      {editing.images.map((url, i) => (
                        <div
                          key={url}
                          className={`admin-photo-tile${i === 0 ? " featured" : ""}`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={url} alt="" />
                          <div className="admin-photo-tile-actions">
                            <span className="panel-hint">
                              {i === 0 ? "Cover" : `Photo ${i + 1}`}
                            </span>
                            {i !== 0 ? (
                              <button
                                type="button"
                                className="btn btn-ghost btn-sm"
                                onClick={() => makeCover(url)}
                              >
                                Make cover
                              </button>
                            ) : null}
                            <button
                              type="button"
                              className="btn btn-danger btn-sm"
                              onClick={() => removePhoto(url)}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="panel-hint">No photos yet. Add at least one.</p>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    disabled={uploading || busy || editing.images.length >= 3}
                    style={{ marginTop: "0.75rem" }}
                    onChange={(e) => {
                      void addPhotos(e.target.files);
                      e.target.value = "";
                    }}
                  />
                  {editing.images.length >= 3 ? (
                    <p className="panel-hint">Remove a photo before adding another.</p>
                  ) : null}
                </div>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  disabled={busy || uploading || editing.images.length === 0}
                >
                  {busy ? "Saving…" : "Save listing"}
                </button>
              </form>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
