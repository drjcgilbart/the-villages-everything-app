"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { prepareUploadImageFile } from "@/lib/browserImage";
import { geoErrorCode, locationBlockedText, readDeviceLocation } from "@/lib/deviceLocation";
import { HOLIDAY_LABELS, TOUR_HOLIDAYS, type TourHoliday } from "@/lib/lightTourShared";

type Here = { latitude: number; longitude: number };
type Notice = { title: string; body: string; tone: "wait" | "ok" | "bad" };

function sendFailure(err: unknown, direct: boolean): string {
  if (err instanceof Error) {
    if (err.name === "AbortError" || err.name === "TimeoutError") {
      return direct
        ? "This is taking too long, so nothing was confirmed. Check the house list before you add it again."
        : "This is taking too long, so nothing was confirmed. Look under Waiting for approval before you send it again.";
    }
    if (/failed to fetch|load failed|network/i.test(err.message)) {
      return direct
        ? "The phone could not reach the site. Nothing was saved. Try again when the signal is steady."
        : "The phone could not reach the site. Nothing was sent. Try again when the signal is steady.";
    }
    return err.message;
  }
  return direct ? "The house did not save." : "The house did not send.";
}

export function LightTourSubmit({
  open,
  holiday,
  canSubmit,
  pendingMember,
  onClose,
  direct = false,
  onSaved,
}: {
  open: boolean;
  holiday: TourHoliday;
  canSubmit: boolean;
  pendingMember: boolean;
  onClose: () => void;
  /** Admin page: the same card saves the house on the tour now. */
  direct?: boolean;
  onSaved?: (savedHoliday: TourHoliday) => void;
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
  const [notice, setNotice] = useState<Notice | null>(null);
  const addressRef = useRef<HTMLInputElement>(null);
  const wasOpen = useRef(false);
  const sending = useRef(false);

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
    setNotice(null);
    sending.current = false;
  }, [open, holiday]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

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
    if (sending.current) return;
    const place = address.trim();
    if (!place && !here) {
      setNotice({
        title: direct ? "Not saved" : "Not sent",
        body: direct
          ? "Type the street address, or tap Use where I am, and then tap OK again."
          : "Type the street address, or tap Use where I am, and then send it again.",
        tone: "bad",
      });
      return;
    }
    sending.current = true;
    setError("");
    setBusy(true);
    setNotice({
      title: direct ? "Saving" : "Sending for approval",
      body: direct
        ? place
          ? `Saving ${place} now. Stay on this screen until it finishes.`
          : "Saving this house now. Stay on this screen until it finishes."
        : place
          ? `Sending ${place} now. Stay on this screen until it finishes.`
          : "Sending this house now. Stay on this screen until it finishes.",
      tone: "wait",
    });
    const ac = new AbortController();
    const timer = window.setTimeout(() => ac.abort(), 25000);
    try {
      const res = await fetch(direct ? "/api/light-tour/add" : "/api/light-tour/submit", {
        method: "POST",
        credentials: "same-origin",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        signal: ac.signal,
        body: JSON.stringify({
          holiday: picked,
          address,
          note,
          photoUrl,
          latitude: here?.latitude,
          longitude: here?.longitude,
        }),
      });
      const text = await res.text();
      let data: { error?: string } = {};
      try {
        data = text ? (JSON.parse(text) as { error?: string }) : {};
      } catch {
        data = {
          error: direct
            ? "The house did not save. The server did not answer clearly."
            : "The house did not send. The server did not answer clearly.",
        };
      }
      if (!res.ok) throw new Error(data.error || (direct ? "The house did not save." : "The house did not send."));
      setSent(true);
      onSaved?.(picked);
      setNotice({
        title: direct ? "Added" : "Sent for approval",
        body: direct
          ? "This house is on the tour."
          : "This house was sent. It stays off the public tour until it is approved. On the admin page, look for Waiting for approval.",
        tone: "ok",
      });
    } catch (err) {
      const message = sendFailure(err, direct);
      setError(message);
      setNotice({ title: direct ? "Not saved" : "Not sent", body: message, tone: "bad" });
    } finally {
      window.clearTimeout(timer);
      sending.current = false;
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
            <p>{direct ? "Added. This house is on the tour." : "Sent. The house stays off the tour until the admin approves it."}</p>
            <button type="button" className="btn btn-primary lt-go" onClick={onClose}>
              Done
            </button>
          </>
        ) : (
          <>
            <p>
              Share a house with cool holiday lights. Pick the holiday, type the address, add a short note, and a photo
              if you have one.{" "}
              {direct
                ? "It goes on the tour right away."
                : "It does not show on the tour until the admin approves it."}
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
              disabled={busy}
              onPointerUp={(event) => {
                if (event.pointerType !== "touch") return;
                event.preventDefault();
                void send();
              }}
              onClick={(event) => {
                event.preventDefault();
                void send();
              }}
            >
              {busy ? (direct ? "Saving…" : "Sending…") : direct ? "OK" : "Send for approval"}
            </button>
            <button type="button" className="btn btn-ghost lt-go" disabled={busy} onClick={onClose}>
              Cancel
            </button>
          </>
        )}
      </div>
      {notice ? (
        <div className="lt-pop-scrim lt-pop-front">
          <div className="lt-pop" role="alertdialog" aria-modal="true" aria-labelledby="lt-send-title">
            <h3 id="lt-send-title">{notice.title}</h3>
            <p>{notice.body}</p>
            {notice.tone === "wait" ? (
              <p className="panel-hint">Please wait.</p>
            ) : (
              <button
                type="button"
                className="btn btn-primary lt-go"
                onClick={() => {
                  if (notice.tone === "ok") onClose();
                  else setNotice(null);
                }}
              >
                {notice.tone === "ok" ? "Done" : "Back to the form"}
              </button>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
