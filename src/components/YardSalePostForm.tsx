"use client";

import { useState } from "react";
import {
  CATEGORY_OPTIONS,
  CONDITION_LABELS,
  MEETUP_LABELS,
  type ItemCondition,
  type MeetupType,
} from "@/lib/yardSaleTypes";
import { prepareUploadImageFile } from "@/lib/browserImage";

const emptyForm = {
  sellerName: "",
  sellerEmail: "",
  sellerPhone: "",
  sellerVillage: "",
  title: "",
  description: "",
  price: "",
  isFree: false,
  condition: "good" as ItemCondition,
  category: "Other",
  meetupType: "message_to_arrange" as MeetupType,
  meetupNotes: "",
  contactMethod: "either" as "email" | "phone" | "either",
  images: [] as string[],
  videoUrl: "" as string,
};

export function YardSalePostForm() {
  const [form, setForm] = useState(emptyForm);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  const flash = (kind: "ok" | "err", text: string) => {
    setMsg({ kind, text });
    window.setTimeout(() => setMsg(null), 6000);
  };

  async function uploadFile(file: File, kind: "image" | "video") {
    const ready =
      kind === "image"
        ? (await prepareUploadImageFile(file, { maxBytes: 6.5 * 1024 * 1024 })).file
        : file;
    const fd = new FormData();
    fd.append("file", ready);
    const res = await fetch("/api/yard-sale/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Upload failed");
    if (kind === "image") {
      setForm((f) => {
        if (f.images.length >= 5) throw new Error("Maximum 5 photos");
        return { ...f, images: [...f.images, data.url] };
      });
    } else {
      setForm((f) => ({ ...f, videoUrl: data.url }));
    }
  }

  async function onImages(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        await uploadFile(file, "image");
      }
      flash("ok", "Photo(s) uploaded");
    } catch (err) {
      flash("err", err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function onVideo(file: File | null) {
    if (!file) return;
    setUploading(true);
    try {
      await uploadFile(file, "video");
      flash("ok", "Video uploaded");
    } catch (err) {
      flash("err", err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function submitListing(e: React.FormEvent) {
    e.preventDefault();
    if (!form.images.length) {
      flash("err", "Add at least one photo");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/yard-sale/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sellerName: form.sellerName,
          sellerEmail: form.sellerEmail,
          sellerPhone: form.sellerPhone,
          sellerVillage: form.sellerVillage,
          title: form.title,
          description: form.description,
          isFree: form.isFree,
          price: form.isFree ? 0 : Number(form.price),
          condition: form.condition,
          category: form.category,
          meetupType: form.meetupType,
          meetupNotes: form.meetupNotes,
          contactMethod: form.contactMethod,
          images: form.images,
          videoUrl: form.videoUrl || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not create listing");
      setForm(emptyForm);
      flash("ok", "Listing submitted. It goes live after a quick admin review.");
    } catch (err) {
      flash("err", err instanceof Error ? err.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="admin-card" id="post-item">
      <h2 style={{ marginTop: 0 }}>Post an item</h2>
      <p className="panel-hint">
        Free for everyone. No membership required. Listings are reviewed before they
        appear on the board. Meet in a public place when you can.
      </p>
      {msg ? <div className={`msg msg-${msg.kind}`}>{msg.text}</div> : null}
      <form className="form-grid" onSubmit={submitListing}>
        <div className="form-row">
          <div className="field">
            <label>Your name</label>
            <input
              required
              value={form.sellerName}
              onChange={(e) => setForm((f) => ({ ...f, sellerName: e.target.value }))}
              placeholder="First name is fine"
            />
          </div>
          <div className="field">
            <label>Village (optional)</label>
            <input
              value={form.sellerVillage}
              onChange={(e) => setForm((f) => ({ ...f, sellerVillage: e.target.value }))}
              placeholder="e.g. Edenfield"
            />
          </div>
        </div>
        <div className="form-row">
          <div className="field">
            <label>Email</label>
            <input
              type="email"
              value={form.sellerEmail}
              onChange={(e) => setForm((f) => ({ ...f, sellerEmail: e.target.value }))}
              placeholder="so a buyer can write you"
            />
          </div>
          <div className="field">
            <label>Phone</label>
            <input
              value={form.sellerPhone}
              onChange={(e) => setForm((f) => ({ ...f, sellerPhone: e.target.value }))}
              placeholder="so a buyer can call or text"
            />
          </div>
        </div>
        <div className="field">
          <label>Title</label>
          <input
            required
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="e.g. Patio set — 4 chairs + table"
          />
        </div>
        <div className="field">
          <label>Description</label>
          <textarea
            required
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            placeholder="Condition, size, pickup notes, etc."
          />
        </div>
        <div className="form-row">
          <div className="field">
            <label>Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            >
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Condition</label>
            <select
              value={form.condition}
              onChange={(e) =>
                setForm((f) => ({ ...f, condition: e.target.value as ItemCondition }))
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
              disabled={form.isFree}
              value={form.isFree ? "0" : form.price}
              onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
            />
          </div>
          <div className="field" style={{ display: "flex", alignItems: "flex-end" }}>
            <label className="checkbox-row" style={{ width: "100%" }}>
              <input
                type="checkbox"
                checked={form.isFree}
                onChange={(e) => setForm((f) => ({ ...f, isFree: e.target.checked }))}
              />
              Free / giveaway
            </label>
          </div>
        </div>
        <div className="form-row">
          <div className="field">
            <label>Meetup type</label>
            <select
              value={form.meetupType}
              onChange={(e) =>
                setForm((f) => ({ ...f, meetupType: e.target.value as MeetupType }))
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
              value={form.contactMethod}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  contactMethod: e.target.value as "email" | "phone" | "either",
                }))
              }
            >
              <option value="either">Email or phone</option>
              <option value="email">Email only</option>
              <option value="phone">Phone only</option>
            </select>
          </div>
        </div>
        <div className="field">
          <label>Meetup notes (optional)</label>
          <input
            value={form.meetupNotes}
            onChange={(e) => setForm((f) => ({ ...f, meetupNotes: e.target.value }))}
            placeholder="e.g. Evenings after 5, near rec center parking"
          />
        </div>
        <div className="field">
          <label>Photos (required, up to 5) {uploading ? "· uploading…" : ""}</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              void onImages(e.target.files);
              e.target.value = "";
            }}
          />
          {form.images.length > 0 ? (
            <div className="admin-photo-grid" style={{ marginTop: "0.75rem" }}>
              {form.images.map((url, i) => (
                <div key={url} className="admin-photo-tile">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" />
                  <div className="admin-photo-tile-actions">
                    <span className="panel-hint">Photo {i + 1}</span>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() =>
                        setForm((f) => ({
                          ...f,
                          images: f.images.filter((u) => u !== url),
                        }))
                      }
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
        <div className="field">
          <label>Optional short video (1 max, under 40 MB)</label>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => {
              void onVideo(e.target.files?.[0] || null);
              e.target.value = "";
            }}
          />
          {form.videoUrl ? <p className="panel-hint">Video attached.</p> : null}
        </div>
        <button type="submit" className="btn btn-primary" disabled={busy || uploading}>
          {busy ? "Submitting…" : "Submit listing"}
        </button>
      </form>
    </div>
  );
}
