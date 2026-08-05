"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  CATEGORY_OPTIONS,
  CONDITION_LABELS,
  MEETUP_LABELS,
  type ItemCondition,
  type MeetupType,
  type PublicMember,
  type YardListing,
} from "@/lib/yardSaleTypes";
import { formatPrice } from "@/components/YardListingCard";
import { formatDate } from "@/lib/format";

const emptyForm = {
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

export function MemberDashboard() {
  const [member, setMember] = useState<PublicMember | null | undefined>(undefined);
  const [listings, setListings] = useState<YardListing[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  const flash = (kind: "ok" | "err", text: string) => {
    setMsg({ kind, text });
    setTimeout(() => setMsg(null), 4500);
  };

  const load = useCallback(async () => {
    const meRes = await fetch("/api/members/me", { cache: "no-store" });
    const meData = await meRes.json();
    setMember(meData.member || null);
    if (meData.member) {
      const listRes = await fetch("/api/yard-sale?mine=1", { cache: "no-store" });
      const listData = await listRes.json();
      setListings(listData.listings || []);
    }
  }, []);

  useEffect(() => {
    load().catch(() => setMember(null));
  }, [load]);

  async function logout() {
    await fetch("/api/members/logout", { method: "POST" });
    setMember(null);
    setListings([]);
  }

  async function uploadFile(file: File, kind: "image" | "video") {
    const fd = new FormData();
    fd.append("file", file);
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
        if (form.images.length + 1 > 5) {
          flash("err", "Maximum 5 photos per listing");
          break;
        }
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
      flash("ok", "Listing submitted for admin approval");
      await load();
    } catch (err) {
      flash("err", err instanceof Error ? err.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  async function markSoldApi(id: string) {
    const res = await fetch("/api/yard-sale/listings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, markSold: true }),
    });
    const data = await res.json();
    if (!res.ok) flash("err", data.error || "Could not mark sold");
    else flash("ok", "Marked as sold");
  }

  async function removeListing(id: string) {
    if (!confirm("Remove this listing?")) return;
    const res = await fetch(`/api/yard-sale/listings?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (!res.ok) flash("err", data.error || "Delete failed");
    else {
      flash("ok", "Listing removed");
      await load();
    }
  }

  if (member === undefined) {
    return <div className="admin-card">Loading…</div>;
  }

  if (!member) {
    return (
      <div className="admin-card">
        <h2 style={{ marginTop: 0 }}>Sign in required</h2>
        <p className="panel-hint">
          You need an approved membership to post yard sale items.
        </p>
        <div className="hero-actions">
          <Link href="/yard-sale/login" className="btn btn-primary">
            Sign in
          </Link>
          <Link href="/yard-sale/join" className="btn btn-ghost">
            Request membership
          </Link>
        </div>
      </div>
    );
  }

  if (member.status === "pending") {
    return (
      <div className="admin-card">
        <h2 style={{ marginTop: 0 }}>Membership pending</h2>
        <p>
          Hi {member.name} — your request is waiting for admin approval. You&apos;ll
          be able to post listings once approved.
        </p>
        <button type="button" className="btn btn-ghost" onClick={logout}>
          Sign out
        </button>
      </div>
    );
  }

  if (member.status !== "approved") {
    return (
      <div className="admin-card">
        <h2 style={{ marginTop: 0 }}>Account not active</h2>
        <p className="panel-hint">Status: {member.status}</p>
        <button type="button" className="btn btn-ghost" onClick={logout}>
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="yard-dash">
      <div className="admin-card">
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <h2 style={{ margin: 0 }}>Hello, {member.name}</h2>
            <p className="panel-hint" style={{ marginBottom: 0 }}>
              {member.email}
              {member.village ? ` · ${member.village}` : ""}
            </p>
          </div>
          <div className="admin-actions">
            <Link href="/yard-sale" className="btn btn-ghost btn-sm">
              Browse sale
            </Link>
            <button type="button" className="btn btn-ghost btn-sm" onClick={logout}>
              Sign out
            </button>
          </div>
        </div>
      </div>

      {msg && <div className={`msg msg-${msg.kind}`}>{msg.text}</div>}

      <div className="admin-card" style={{ marginTop: "1rem" }}>
        <h2 style={{ marginTop: 0 }}>New listing</h2>
        <form className="form-grid" onSubmit={submitListing}>
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
            <label>
              Photos (required, up to 5) {uploading ? "· uploading…" : ""}
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                void onImages(e.target.files);
                e.target.value = "";
              }}
            />
            {form.images.length > 0 && (
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
            )}
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
            {form.videoUrl && (
              <p className="panel-hint">
                Video ready ·{" "}
                <button
                  type="button"
                  className="text-link"
                  style={{ background: "none", border: 0, cursor: "pointer" }}
                  onClick={() => setForm((f) => ({ ...f, videoUrl: "" }))}
                >
                  Remove
                </button>
              </p>
            )}
          </div>
          <button type="submit" className="btn btn-primary" disabled={busy || uploading}>
            {busy ? "Submitting…" : "Submit for approval"}
          </button>
        </form>
      </div>

      <div className="admin-card" style={{ marginTop: "1rem" }}>
        <h2 style={{ marginTop: 0 }}>Your listings</h2>
        <div className="admin-list">
          {listings.length === 0 && (
            <p className="panel-hint">No listings yet.</p>
          )}
          {listings.map((l) => (
            <div key={l.id} className="admin-item">
              <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                {l.images[0] ? (
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
                  <strong>{l.title}</strong>
                  <span>
                    {formatPrice(l)} · {l.status} · {formatDate(l.createdAt)}
                    {l.adminNote ? ` · Note: ${l.adminNote}` : ""}
                  </span>
                </div>
              </div>
              <div className="admin-actions">
                {l.status === "approved" && (
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => markSoldApi(l.id).then(load)}
                  >
                    Mark sold
                  </button>
                )}
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => removeListing(l.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
