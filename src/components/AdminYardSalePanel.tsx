"use client";

import { useCallback, useEffect, useState } from "react";
import type { YardListing } from "@/lib/yardSaleTypes";
import { formatPrice } from "@/components/YardListingCard";
import { formatDate } from "@/lib/format";

/**
 * Yard Sale listings only. Membership approval lives on the Studio
 * “Members” tab (AdminMembersPanel).
 */
export function AdminYardSalePanel() {
  const [listings, setListings] = useState<
    (YardListing & { seller?: { name?: string } | null })[]
  >([]);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(
    null
  );
  const [busy, setBusy] = useState(false);

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
                  {formatPrice(l)} · {l.seller?.name || "Unknown seller"} ·{" "}
                  {l.images?.length || 0} photo(s)
                  {l.videoUrl ? " · video" : ""} · {formatDate(l.createdAt)}
                </span>
              </div>
            </div>
            <div className="admin-actions">
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
          </div>
        ))}
      </div>
    </div>
  );
}
