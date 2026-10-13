"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { prepareUploadImageFile } from "@/lib/browserImage";
import { geoErrorCode, locationBlockedText, readDeviceLocation } from "@/lib/deviceLocation";
import { HOLIDAY_LABELS, TOUR_HOLIDAYS, type TourHoliday } from "@/lib/lightTourShared";

type Here = { latitude: number; longitude: number };

export function LightTourSubmit({
  open,
  holiday,
  canSubmit,
  pendingMember,
  onClose,
}: {
  open: boolean;
  holiday: TourHoliday;
  canSubmit: boolean;
  pendingMember: boolean;
  onClose: () => void;
}) {
  const [picked, setPicked] = useState<TourHoliday>(holiday);
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [preview, setPreview] = useState("");
  const [here, setHere] = useState<Here | null>(null);
  const [hereNote, setHereNote] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const addressRef = useRef<HTMLInputElement>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    if (!preview.startsWith("blob:")) return;
    return () => URL.revokeObjectURL(preview);
  }, [preview]);

  useEffect(() => {
    if (!open || !canSubmit) return;
    const timer = window.setTimeout(() => addressRef.current?.focus(), 0);
    return () => window.clearTimeout(timer);
  }, [open, canSubmit]);

  useEffect(() => {
    if (!open) {
      wasOpen.current = false;
      return;
    }
    if (wasOpen.current) return;
    wasOpen.current = true;
    setPicked(holiday);
    setAddress("");
    setNote("");
    setPhotoUrl("");
    setPreview("");
    setHere(null);
    setHereNote("");
    setError("");
    setSent(false);
    setBusy(false);
  }, [open, holiday]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  async function useHere() {
    setError("");
    setBusy(true);
    try {
      const point = await readDeviceLocation();
      setHere(point);
      setHereNote("Using where you are now. Add the street address if you know it.");
    } catch (err) {
      if (geoErrorCode(err) === 1) {
        setError(locationBlockedText("Or type the street address."));
      } else if (err instanceof Error && err.message === "This browser does not share location.") {
        setError("This browser does not share location. Type the street address instead.");
      } else {
        setError("Location did not come through. Type the street address instead.");
      }
    } finally {
      setBusy(false);
    }
  }

  async function uploadPhoto(file: File) {
    setError("");
    setBusy(true);
    try {
      const prepared = await prepareUploadImageFile(file);
      const body = new FormData();
      body.set("file", prepared.file);
      const res = await fetch("/api/light-tour/upload", {
        method: "POST",
        credentials: "same-origin",
        body,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "The photo did not upload.");
      setPhotoUrl(String(data.url || ""));
      setPreview(URL.createObjectURL(prepared.file));
    } catch (err) {
      setError(err instanceof Error ? err.message : "The photo did not upload.");
    } finally {
      setBusy(false);
    }
  }

  async function send() {
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/light-tour/submit", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          holiday: picked,
          address,
          note,
          photoUrl,
          latitude: here?.latitude,
          longitude: here?.longitude,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "The house did not send.");
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "The house did not send.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="lt-pop-scrim">
      <div className="lt-pop lt-pop-form" role="dialog" aria-modal="true" aria-labelledby="lt-add-title">
        <h3 id="lt-add-title">Add a lit house</h3>
        {!canSubmit ? (
          <>
            <p>
              {pendingMember
                ? "Your membership is still waiting for approval. Once it is approved, you can add a house. The free Porch Waver plan is enough."
                : "Become a member first. The free Porch Waver plan is enough, and the paid plans work too."}
            </p>
            {pendingMember ? null : (
              <Link href="/yard-sale/join" className="btn btn-primary lt-go">
                Become a member
              </Link>
            )}
            <Link href="/yard-sale/login?next=/tour" className="btn btn-ghost lt-go">
              Sign in
            </Link>
            <button type="button" className="btn btn-ghost lt-go" onClick={onClose}>
              Close
            </button>
          </>
        ) : sent ? (
          <>
            <p>Sent. The house stays off the tour until the admin approves it.</p>
            <button type="button" className="btn btn-primary lt-go" onClick={onClose}>
              Done
            </button>
          </>
        ) : (
          <>
            <p>
              Share a house with cool holiday lights. Pick the holiday, type the address, add a short note, and a photo
              if you have one. It does not show on the tour until the admin approves it.
            </p>
            <div className="lt-chips" role="radiogroup" aria-label="Holiday">
              {TOUR_HOLIDAYS.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={`lt-chip ${picked === item ? "is-on" : ""}`}
                  role="radio"
                  aria-checked={picked === item}
                  onClick={() => setPicked(item)}
                >
                  {HOLIDAY_LABELS[item]}
                </button>
              ))}
            </div>
            <div className="field">
              <label htmlFor="lt-add-address">Address</label>
              <input
                id="lt-add-address"
                ref={addressRef}
                value={address}
                maxLength={180}
                autoComplete="street-address"
                placeholder="3129 Hutchinson Way, The Villages, FL"
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="lt-add-note">Note</label>
              <input
                id="lt-add-note"
                value={note}
                maxLength={160}
                placeholder="Porch full of pumpkins"
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
            <button type="button" className="btn btn-ghost lt-go" disabled={busy} onClick={() => void useHere()}>
              Use where I am
            </button>
            {hereNote ? <p className="panel-hint">{hereNote}</p> : null}
            <div className="lt-photo-row">
              <label className="btn btn-ghost">
                Take photo
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    e.target.value = "";
                    if (file) void uploadPhoto(file);
                  }}
                />
              </label>
              <label className="btn btn-ghost">
                Photo library
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    e.target.value = "";
                    if (file) void uploadPhoto(file);
                  }}
                />
              </label>
            </div>
            {preview ? <img src={preview} alt="House photo" className="lt-photo" /> : null}
            {error ? (
              <p className="lt-error" role="alert">
                {error}
              </p>
            ) : null}
            <button
              type="button"
              className="btn btn-primary lt-go"
              disabled={busy || (!address.trim() && !here)}
              onClick={() => void send()}
            >
              {busy ? "Sending…" : "Send for approval"}
            </button>
            <button type="button" className="btn btn-ghost lt-go" disabled={busy} onClick={onClose}>
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
}
