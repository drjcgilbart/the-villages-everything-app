"use client";

import { useEffect, useState } from "react";
import { HOLIDAY_LABELS, type TourHoliday } from "@/lib/lightTourShared";

export type MemberHouse = {
  id: string;
  holiday: TourHoliday;
  address: string;
  note: string;
  photoUrl: string;
  status: "pending" | "approved";
};

export function LightTourMine({
  reloadKey,
  onEdit,
}: {
  reloadKey: number;
  onEdit: (house: MemberHouse) => void;
}) {
  const [houses, setHouses] = useState<MemberHouse[]>([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  useEffect(() => {
    let cancel = false;
    void (async () => {
      try {
        const res = await fetch("/api/light-tour/mine", { credentials: "same-origin", cache: "no-store" });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || "Your houses did not load.");
        if (!cancel) {
          setHouses(Array.isArray(data.pins) ? data.pins : []);
          setError("");
        }
      } catch (err) {
        if (!cancel) setError(err instanceof Error ? err.message : "Your houses did not load.");
      } finally {
        if (!cancel) setReady(true);
      }
    })();
    return () => {
      cancel = true;
    };
  }, [reloadKey]);

  async function remove(id: string) {
    setBusyId(id);
    setError("");
    try {
      const res = await fetch(`/api/light-tour/mine?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
        credentials: "same-origin",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "The house did not come off.");
      setHouses((current) => current.filter((house) => house.id !== id));
      setPendingDelete(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "The house did not come off.");
    } finally {
      setBusyId("");
    }
  }

  if (!ready) return null;

  return (
    <div className="about-panel lt-card" id="lt-mine">
      <h2>Your houses</h2>
      <p className="panel-hint">
        A house you add stays off the public tour until it is approved. You can change the photo and note, or remove
        the house. The site owner can do the same.
      </p>
      {error ? (
        <p className="lt-error" role="alert">
          {error}
        </p>
      ) : null}
      {houses.length === 0 ? <p className="lt-empty">You have not added a house yet.</p> : null}
      <ul className="lt-list">
        {houses.map((house) => (
          <li key={house.id} className="lt-pin">
            <strong>{house.address || "Saved house"}</strong>
            <span>
              {HOLIDAY_LABELS[house.holiday]}
              {" · "}
              {house.status === "pending" ? "Waiting for approval" : "On the tour"}
            </span>
            {house.note ? <span>{house.note}</span> : null}
            {house.photoUrl ? (
              <img src={house.photoUrl} alt={house.note || house.address || "House"} loading="lazy" className="lt-photo" />
            ) : null}
            <div className="lt-pin-actions">
              <button type="button" className="btn btn-ghost" onClick={() => onEdit(house)}>
                Edit
              </button>
              {pendingDelete === house.id ? (
                <>
                  <button
                    type="button"
                    className="btn btn-primary"
                    disabled={busyId === house.id}
                    onClick={() => void remove(house.id)}
                  >
                    Remove house
                  </button>
                  <button type="button" className="btn btn-ghost" onClick={() => setPendingDelete(null)}>
                    Keep
                  </button>
                </>
              ) : (
                <button type="button" className="btn btn-ghost" onClick={() => setPendingDelete(house.id)}>
                  Remove
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
