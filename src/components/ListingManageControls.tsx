"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ContactChoices } from "@/components/ContactChoices";
import { DEFAULT_PHOTO_MAX_BYTES, prepareUploadImageFile } from "@/lib/browserImage";
import { DEFAULT_VIDEO_MAX_BYTES, prepareUploadVideoFile } from "@/lib/browserVideo";
import {
  CATEGORY_OPTIONS,
  CONDITION_LABELS,
  LISTING_MAX_REFRESHES,
  MEETUP_LABELS,
  canRefreshListing,
  contactChoiceError,
  resolveContactBy,
  type ContactBy,
  type ItemCondition,
  type MeetupType,
  type YardListing,
} from "@/lib/yardSaleTypes";

type ListingAction = "archive" | "refresh" | "remove";

type EditDraft = {
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
  contactBy: ContactBy;
  images: string[];
  videoUrl: string;
};

function draftFrom(listing: YardListing): EditDraft {
  return {
    sellerName: listing.sellerName || "",
    sellerVillage: listing.sellerVillage || "",
    sellerEmail: listing.sellerEmail || "",
    sellerPhone: listing.sellerPhone || "",
    title: listing.title,
    description: listing.description,
    price: listing.isFree ? "0" : String(listing.price ?? ""),
    isFree: listing.isFree,
    condition: listing.condition,
    category: listing.category,
    meetupType: listing.meetupType,
    meetupNotes: listing.meetupNotes || "",
    contactBy: resolveContactBy(listing),
    images: [...(listing.images || [])],
    videoUrl: listing.videoUrl || "",
  };
}

function hintFor(listing: YardListing) {
  const used = listing.refreshCount || 0;
  if (listing.status === "approved" && used >= LISTING_MAX_REFRESHES) {
    return "Refreshed 3 times. Refresh is closed. This listing comes down 14 days after the last refresh unless you archive or remove it.";
  }
  if (listing.status === "approved") {
    return used
      ? `Refreshed ${used} of 3. Refresh Listing moves it back to the top.`
      : "Refresh Listing moves this to the top. You can do that 3 times.";
  }
  if (listing.status === "archived") {
    return "Archived. Neighbors no longer see this. An admin can approve it to put it back.";
  }
  if (listing.status === "pending") {
    return "Waiting for approval. You can still edit it before it goes live.";
  }
  if (listing.status === "rejected") {
    return "This was rejected. Edit it and it goes back for approval.";
  }
  return "";
}

export function ListingManageControls({
  listing,
  onChanged,
  allowEdit = true,
  includeSold = true,
  leavePublicAfterClose = false,
  asAdmin = false,
}: {
  listing: YardListing;
  onChanged: () => Promise<void> | void;
  allowEdit?: boolean;
  includeSold?: boolean;
  /** After archive or remove on the public page, go to the member's listings. */
  leavePublicAfterClose?: boolean;
  /** Save through the admin edit path so a non-owner admin can change a live listing. */
  asAdmin?: boolean;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState<EditDraft | null>(null);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  const flash = (kind: "ok" | "err", text: string) => {
    setMsg({ kind, text });
    window.setTimeout(() => setMsg(null), 5000);
  };

  const editable =
    allowEdit &&
    listing.status !== "removed" &&
    listing.status !== "sold";

  async function runAction(action: ListingAction) {
    const prompts: Record<ListingAction, string> = {
      refresh:
        "Refresh this listing? It moves to the top of the Marketplace. You can refresh 3 times. It then stays up until 14 days from today unless you archive or remove it.",
      archive:
        "Archive this listing? It leaves the public Marketplace. You can still see it in your listings.",
      remove: "Remove this listing from the Marketplace?",
    };
    if (!window.confirm(prompts[action])) return;
    setBusy(true);
    try {
      const res = await fetch("/api/yard-sale/listings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: listing.id, action }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not update listing");
      const done =
        action === "refresh"
          ? "Listing refreshed. It is at the top of the Marketplace."
          : action === "archive"
            ? "Listing archived."
            : "Listing removed.";
      flash("ok", done);
      setEditing(null);
      await onChanged();
      if (leavePublicAfterClose && action !== "refresh") {
        router.push("/yard-sale/dashboard");
      } else {
        router.refresh();
      }
    } catch (err) {
      flash("err", err instanceof Error ? err.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  async function markSold() {
    setBusy(true);
    try {
      const res = await fetch("/api/yard-sale/listings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: listing.id, markSold: true }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not mark sold");
      flash("ok", "Marked as sold");
      await onChanged();
    } catch (err) {
      flash("err", err instanceof Error ? err.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  async function addPhotos(files: FileList | null) {
    if (!files?.length || !editing) return;
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
      setEditing((current) => (current ? { ...current, images: next } : current));
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

  async function addVideo(file: File | null) {
    if (!file || !editing) return;
    setUploading(true);
    try {
      const prepared = await prepareUploadVideoFile(file, {
        maxBytes: DEFAULT_VIDEO_MAX_BYTES,
      });
      const fd = new FormData();
      fd.append("file", prepared.file);
      const res = await fetch("/api/yard-sale/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setEditing((current) =>
        current ? { ...current, videoUrl: data.url } : current
      );
      flash("ok", prepared.compressed ? "Video shrunk and uploaded." : "Video uploaded");
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
    const contactProblem = contactChoiceError(
      editing.contactBy,
      editing.sellerEmail,
      editing.sellerPhone
    );
    if (contactProblem) {
      flash("err", contactProblem);
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/yard-sale/listings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: listing.id,
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
          contactBy: editing.contactBy,
          images: editing.images,
          videoUrl: editing.videoUrl || null,
          ...(asAdmin ? { adminEdit: true } : {}),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not save listing");
      setEditing(null);
      flash(
        "ok",
        data.listing?.status === "approved"
          ? "Listing updated. It stays live."
          : data.listing?.status === "pending"
            ? "Listing updated and sent for approval."
            : "Listing updated."
      );
      await onChanged();
      router.refresh();
    } catch (err) {
      flash("err", err instanceof Error ? err.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  const hint = hintFor(listing);
  const showRefresh = canRefreshListing(listing);
  const showArchive = listing.status === "approved";
  const showRemove = listing.status !== "removed";
  const showSold = includeSold && listing.status === "approved";
  if (!editable && !showRefresh && !showArchive && !showRemove && !showSold) {
    return null;
  }

  return (
    <div className="listing-manage">
      <div className="listing-manage-actions">
        {editable ? (
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            disabled={busy || uploading}
            onClick={() => setEditing((current) => (current ? null : draftFrom(listing)))}
          >
            {editing ? "Close edit" : "Edit listing"}
          </button>
        ) : null}
        {showRefresh ? (
          <button
            type="button"
            className="btn btn-primary btn-sm"
            disabled={busy}
            onClick={() => void runAction("refresh")}
          >
            Refresh Listing
          </button>
        ) : null}
        {showArchive ? (
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            disabled={busy}
            onClick={() => void runAction("archive")}
          >
            Archive Listing
          </button>
        ) : null}
        {showRemove ? (
          <button
            type="button"
            className="btn btn-danger btn-sm"
            disabled={busy}
            onClick={() => void runAction("remove")}
          >
            Remove Listing
          </button>
        ) : null}
        {showSold ? (
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            disabled={busy}
            onClick={() => void markSold()}
          >
            Mark sold
          </button>
        ) : null}
      </div>
      {hint ? <p className="panel-hint">{hint}</p> : null}
      {msg ? <div className={`msg msg-${msg.kind}`}>{msg.text}</div> : null}
      {editing ? (
        <form className="form-grid" onSubmit={saveEdit}>
          <p className="panel-hint" style={{ margin: 0 }}>
            Changes to a live listing stay live. The original poster name stays on the admin record.
          </p>
          <div className="form-row">
            <div className="field">
              <label>Seller name</label>
              <input
                required
                value={editing.sellerName}
                onChange={(e) => setEditing({ ...editing, sellerName: e.target.value })}
              />
            </div>
            <div className="field">
              <label>Village</label>
              <input
                value={editing.sellerVillage}
                onChange={(e) => setEditing({ ...editing, sellerVillage: e.target.value })}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="field">
              <label>Email</label>
              <input
                type="email"
                value={editing.sellerEmail}
                onChange={(e) => setEditing({ ...editing, sellerEmail: e.target.value })}
              />
            </div>
            <div className="field">
              <label>Phone</label>
              <input
                value={editing.sellerPhone}
                onChange={(e) => setEditing({ ...editing, sellerPhone: e.target.value })}
              />
            </div>
          </div>
          <div className="field">
            <label>Title</label>
            <input
              required
              value={editing.title}
              onChange={(e) => setEditing({ ...editing, title: e.target.value })}
            />
          </div>
          <div className="field">
            <label>Description</label>
            <textarea
              required
              rows={4}
              value={editing.description}
              onChange={(e) => setEditing({ ...editing, description: e.target.value })}
            />
          </div>
          <div className="form-row">
            <div className="field">
              <label>Category</label>
              <select
                value={editing.category}
                onChange={(e) => setEditing({ ...editing, category: e.target.value })}
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
                  setEditing({ ...editing, condition: e.target.value as ItemCondition })
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
                onChange={(e) => setEditing({ ...editing, price: e.target.value })}
              />
            </div>
            <div className="field field-check">
              <label className="checkbox-row">
                <input
                  type="checkbox"
                  checked={editing.isFree}
                  onChange={(e) => setEditing({ ...editing, isFree: e.target.checked })}
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
                  setEditing({ ...editing, meetupType: e.target.value as MeetupType })
                }
              >
                {Object.entries(MEETUP_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
            <ContactChoices
              value={editing.contactBy}
              onChange={(contactBy) =>
                setEditing((current) => (current ? { ...current, contactBy } : current))
              }
            />
          </div>
          <div className="field">
            <label>Meetup notes</label>
            <input
              value={editing.meetupNotes}
              onChange={(e) => setEditing({ ...editing, meetupNotes: e.target.value })}
            />
          </div>
          <div className="field">
            <label>
              Photos (up to 3). The first photo is the cover. {uploading ? "Uploading…" : ""}
            </label>
            {editing.images.length > 0 ? (
              <div className="admin-photo-grid" style={{ marginTop: "0.5rem" }}>
                {editing.images.map((url, i) => (
                  <div key={url} className={`admin-photo-tile${i === 0 ? " featured" : ""}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt="" />
                    <div className="admin-photo-tile-actions">
                      <span className="panel-hint">{i === 0 ? "Cover" : `Photo ${i + 1}`}</span>
                      {i !== 0 ? (
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm"
                          onClick={() =>
                            setEditing({
                              ...editing,
                              images: [url, ...editing.images.filter((item) => item !== url)],
                            })
                          }
                        >
                          Make cover
                        </button>
                      ) : null}
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() =>
                          setEditing({
                            ...editing,
                            images: editing.images.filter((item) => item !== url),
                          })
                        }
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="panel-hint">Add at least one photo.</p>
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
          </div>
          <div className="field">
            <label>Short video (optional)</label>
            <input
              type="file"
              accept="video/*"
              disabled={uploading || busy}
              onChange={(e) => {
                void addVideo(e.target.files?.[0] || null);
                e.target.value = "";
              }}
            />
            {editing.videoUrl ? (
              <p className="panel-hint">
                Video ready ·{" "}
                <button
                  type="button"
                  className="text-link"
                  style={{ background: "none", border: 0, cursor: "pointer" }}
                  onClick={() => setEditing({ ...editing, videoUrl: "" })}
                >
                  Remove video
                </button>
              </p>
            ) : null}
          </div>
          <button
            type="submit"
            className="btn btn-primary btn-sm"
            disabled={busy || uploading || editing.images.length === 0}
          >
            {busy ? "Saving…" : "Save changes"}
          </button>
        </form>
      ) : null}
    </div>
  );
}
