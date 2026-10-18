"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { LightTourMap } from "./LightTourMap";
import { LightTourSubmit } from "./LightTourSubmit";
import {
  geoErrorCode,
  locationBlockedText,
  nativeLocationReady,
  readDeviceLocation,
  watchNativeLocation,
} from "@/lib/deviceLocation";
import { HOLIDAY_LABELS, TOUR_HOLIDAYS, type TourHoliday } from "@/lib/lightTourShared";
import { usePinNavigation } from "@/lib/usePinNavigation";

type AdminPin = {
  id: string;
  holiday: TourHoliday;
  latitude: number;
  longitude: number;
  address: string;
  photoUrl: string;
  note: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  status?: "pending" | "approved";
};

type Draft = {
  id?: string;
  holiday: TourHoliday;
  latitude: string;
  longitude: string;
  address: string;
  note: string;
  photoUrl: string;
};

const PAGE = 15;

type TermsAcceptance = {
  userId: string;
  memberName: string;
  memberEmail: string;
  deviceType: string;
  appVersion: string;
  acceptedAt: string;
  termsVersion: string;
  emailVerifiedAt: string;
  ip: string;
  userAgent: string;
};

function acceptedWhen(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  const clock = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
  return `${clock} ET`;
}

function deviceLabel(deviceType: string) {
  if (deviceType === "android-app") return "Android app";
  if (deviceType === "ios-app") return "iPhone app";
  if (deviceType === "android-web") return "Android browser";
  if (deviceType === "ios-web") return "iPhone browser";
  if (deviceType === "desktop-web") return "Computer browser";
  return "Unknown device";
}

function locationHelp(err: unknown) {
  if (geoErrorCode(err) === 1) {
    return locationBlockedText("You can type the latitude and longitude instead.");
  }
  if (err instanceof Error && err.message === "This browser does not share location.") {
    return "This browser does not share location. You can type the latitude and longitude instead.";
  }
  return "Location did not come through. You can type the latitude and longitude instead.";
}

function WaitingHouses({
  pins,
  busy,
  pendingDelete,
  onApprove,
  onEdit,
  onAskRemove,
  onRemove,
}: {
  pins: AdminPin[];
  busy: boolean;
  pendingDelete: string | null;
  onApprove: (pin: AdminPin) => void;
  onEdit: (pin: AdminPin) => void;
  onAskRemove: (id: string | null) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="about-panel lt-card">
      <h2>Waiting for approval ({pins.length})</h2>
      <p className="panel-hint">
        Members send these from the tour page. They stay off the map until you approve them.
      </p>
      {pins.length === 0 ? <p className="lt-empty">No houses are waiting.</p> : null}
      <ul className="lt-list">
        {pins.map((pin) => (
          <li key={pin.id} className="lt-pin">
            <strong>{pin.address || `${pin.latitude.toFixed(5)}, ${pin.longitude.toFixed(5)}`}</strong>
            <span>{HOLIDAY_LABELS[pin.holiday]}</span>
            {pin.note ? <span>{pin.note}</span> : null}
            {pin.createdBy ? <span>Sent by {pin.createdBy}</span> : null}
            {pin.photoUrl ? (
              <img src={pin.photoUrl} alt={pin.note || pin.address || "House"} loading="lazy" className="lt-photo" />
            ) : null}
            <div className="lt-pin-actions">
              <button type="button" className="btn btn-primary" disabled={busy} onClick={() => onApprove(pin)}>
                Approve
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => onEdit(pin)}>
                Edit
              </button>
              {pendingDelete === pin.id ? (
                <>
                  <button type="button" className="btn btn-primary" disabled={busy} onClick={() => onRemove(pin.id)}>
                    Remove house
                  </button>
                  <button type="button" className="btn btn-ghost" onClick={() => onAskRemove(null)}>
                    Keep
                  </button>
                </>
              ) : (
                <button type="button" className="btn btn-ghost" onClick={() => onAskRemove(pin.id)}>
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

function combineImportFiles(parts: string[]) {
  const trimmed = parts.map((part) => part.trim()).filter(Boolean);
  if (trimmed.length <= 1) return trimmed[0] || "";
  const rows: unknown[] = [];
  for (const part of trimmed) {
    if (!(part.startsWith("{") || part.startsWith("["))) return trimmed.join("\n\n");
    try {
      const parsed = JSON.parse(part) as unknown;
      if (Array.isArray(parsed)) rows.push(...parsed);
      else rows.push(parsed);
    } catch {
      return trimmed.join("\n\n");
    }
  }
  return JSON.stringify(rows);
}

export function LightTourAdmin() {
  const [ready, setReady] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [pins, setPins] = useState<AdminPin[]>([]);
  const [holiday, setHoliday] = useState<TourHoliday>("halloween");
  const [draft, setDraft] = useState<Draft | null>(null);
  const [importText, setImportText] = useState("");
  const [shown, setShown] = useState<Record<TourHoliday, number>>({ halloween: PAGE, christmas: PAGE, other: PAGE });
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const [houseOpen, setHouseOpen] = useState(false);
  const [acceptances, setAcceptances] = useState<TermsAcceptance[]>([]);
  const [termsNote, setTermsNote] = useState("");
  /** Live GPS for the blue dot. Accuracy is only known in the browser path. */
  const [me, setMe] = useState<{ latitude: number; longitude: number; accuracy?: number } | null>(null);
  const [toast, setToast] = useState<{ text: string; bad: boolean } | null>(null);
  const toastTimer = useRef(0);
  const [dropping, setDropping] = useState(false);
  /** The map's own Drop pin is on screen, so the floating copy stays hidden. */
  const [mapFabsSeen, setMapFabsSeen] = useState(false);
  const mapFabs = useRef<HTMLDivElement>(null);
  const pinsRef = useRef(pins);
  const draftRef = useRef(draft);
  const holidayRef = useRef(holiday);
  const moveToken = useRef(new Map<string, number>());
  const nav = usePinNavigation();
  const navFeed = useRef(nav.feed);
  navFeed.current = nav.feed;
  pinsRef.current = pins;
  draftRef.current = draft;
  holidayRef.current = holiday;

  async function load() {
    const res = await fetch("/api/light-tour/pins?admin=1", { credentials: "same-origin" });
    if (res.status === 401) {
      setSignedIn(false);
      setReady(true);
      return;
    }
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Pins did not load.");
    setPins(data.pins || []);
    setSignedIn(true);
    setReady(true);
    try {
      const termsRes = await fetch("/api/light-tour/terms?admin=1", { credentials: "same-origin" });
      const termsData = (await termsRes.json().catch(() => null)) as { acceptances?: TermsAcceptance[]; error?: string } | null;
      if (!termsRes.ok) {
        setTermsNote(termsData?.error || "The acceptance list did not load.");
        return;
      }
      setAcceptances(termsData?.acceptances || []);
      setTermsNote("");
    } catch {
      setTermsNote("The acceptance list did not load.");
    }
  }

  useEffect(() => {
    void load().catch((err) => {
      setError(err instanceof Error ? err.message : "Pins did not load.");
      setReady(true);
    });
  }, []);

  useEffect(() => {
    const node = mapFabs.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    const watch = new IntersectionObserver(([entry]) => setMapFabsSeen(Boolean(entry?.isIntersecting)), {
      threshold: 0,
    });
    watch.observe(node);
    return () => watch.disconnect();
  }, [ready, signedIn]);

  useEffect(() => {
    let stopNative: (() => void) | null = null;
    let webWatch: number | null = null;
    if (nativeLocationReady()) {
      stopNative = watchNativeLocation((point, accuracy) => {
        setMe({ ...point, accuracy });
        navFeed.current(point, accuracy);
      });
    } else if (typeof navigator !== "undefined" && navigator.geolocation) {
      webWatch = navigator.geolocation.watchPosition(
        (pos) => {
          const point = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
          setMe({ ...point, accuracy: pos.coords.accuracy });
          navFeed.current(point, pos.coords.accuracy);
        },
        () => undefined,
        { enableHighAccuracy: true, maximumAge: 3000, timeout: 20000 },
      );
    }
    return () => {
      stopNative?.();
      if (webWatch != null) navigator.geolocation.clearWatch(webWatch);
      window.clearTimeout(toastTimer.current);
    };
  }, []);

  function showToast(text: string, bad = false) {
    window.clearTimeout(toastTimer.current);
    setToast({ text, bad });
    toastTimer.current = window.setTimeout(() => setToast(null), bad ? 6000 : 3500);
  }

  /** The freshest point we have: the live dot, or a one-off reading. */
  async function hereNow(): Promise<{ latitude: number; longitude: number }> {
    if (me) return { latitude: me.latitude, longitude: me.longitude };
    return readDeviceLocation();
  }

  const mapStops = useMemo(
    () =>
      pins
        .filter((pin) => pin.holiday === holiday && pin.status !== "pending")
        .map((pin, index) => ({ ...pin, order: index + 1 })),
    [pins, holiday]
  );

  async function uploadPhoto(file: File) {
    if (!file.type.startsWith("image/")) {
      setError("Use a photo.");
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      setError("Photo must be under 3 MB.");
      return;
    }
    const body = new FormData();
    body.set("file", file);
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/light-tour/upload", { method: "POST", credentials: "same-origin", body });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "The photo did not upload.");
      setDraft((current) => (current ? { ...current, photoUrl: data.url || "" } : current));
    } catch (err) {
      setError(err instanceof Error ? err.message : "The photo did not upload.");
    } finally {
      setBusy(false);
    }
  }

  /**
   * Drop a pin at the phone's current GPS point and save it right away (same
   * POST as Save pin). The card then opens so a photo or note can be added.
   */
  async function dropPin() {
    if (dropping) return;
    setError("");
    setNotice("");
    setDropping(true);
    let pos: { latitude: number; longitude: number };
    try {
      pos = await hereNow();
    } catch (err) {
      const text = locationHelp(err);
      setError(text);
      showToast(`Pin not dropped. ${text}`, true);
      setDropping(false);
      return;
    }
    const forHoliday = holiday;
    try {
      const res = await fetch("/api/light-tour/pins", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          holiday: forHoliday,
          latitude: pos.latitude,
          longitude: pos.longitude,
          address: "",
          note: "",
          photoUrl: "",
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "The pin did not save.");
      const saved = data.pin as AdminPin | undefined;
      await load();
      showToast("Pin dropped");
      setNotice(`Pin dropped at ${pos.latitude.toFixed(6)}, ${pos.longitude.toFixed(6)}.`);
      if (saved?.id) editPin({ ...saved, holiday: saved.holiday || forHoliday });
    } catch (err) {
      const text = err instanceof Error ? err.message : "The pin did not save.";
      setError(text);
      showToast(`Pin not dropped. ${text}`, true);
    } finally {
      setDropping(false);
    }
  }

  /** One tap: move the selected pin to the current GPS fix, saved like a drag. */
  async function movePinHere(id: string) {
    let pos: { latitude: number; longitude: number };
    try {
      pos = await hereNow();
    } catch (err) {
      const text = locationHelp(err);
      setError(text);
      showToast(`Pin not moved. ${text}`, true);
      return;
    }
    const ok = await movePin(id, pos.latitude, pos.longitude);
    if (ok) showToast("Pin moved to your location");
    else showToast("Pin not moved. Try again.", true);
  }

  async function useHere() {
    setError("");
    try {
      const pos = await readDeviceLocation();
      setDraft((current) =>
        current
          ? {
              ...current,
              latitude: pos.latitude.toFixed(6),
              longitude: pos.longitude.toFixed(6),
              address: "",
            }
          : current
      );
    } catch (err) {
      setError(locationHelp(err));
    }
  }

  async function movePin(id: string, latitude: number, longitude: number): Promise<boolean> {
    const pin = pinsRef.current.find((row) => row.id === id);
    if (!pin) return false;
    const token = (moveToken.current.get(id) || 0) + 1;
    moveToken.current.set(id, token);
    const form = draftRef.current?.id === id ? draftRef.current : null;
    const order =
      pinsRef.current
        .filter((row) => row.holiday === holidayRef.current && row.status !== "pending")
        .findIndex((row) => row.id === id) + 1;
    const label = order > 0 ? `Pin ${order}` : "Pin";
    setPins((current) => current.map((row) => (row.id === id ? { ...row, latitude, longitude } : row)));
    setDraft((current) =>
      current?.id === id ? { ...current, latitude: latitude.toFixed(6), longitude: longitude.toFixed(6) } : current
    );
    setError("");
    setNotice(`${label} moved to ${latitude.toFixed(6)}, ${longitude.toFixed(6)}.`);
    try {
      const res = await fetch("/api/light-tour/pins", {
        method: "PUT",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          holiday: form?.holiday || pin.holiday,
          latitude,
          longitude,
          address: form ? form.address : pin.address,
          note: form ? form.note : pin.note,
          photoUrl: form ? form.photoUrl : pin.photoUrl,
          status: pin.status,
          keepAddress: true,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (moveToken.current.get(id) !== token) return false;
      if (!res.ok) throw new Error(data.error || "The pin did not move.");
      const saved = data.pin as AdminPin | undefined;
      if (saved?.id) {
        setPins((current) => current.map((row) => (row.id === id ? { ...row, ...saved } : row)));
        setDraft((current) => {
          if (current?.id !== id) return current;
          return {
            ...current,
            latitude: Number(saved.latitude).toFixed(6),
            longitude: Number(saved.longitude).toFixed(6),
            address: current.address || saved.address || "",
          };
        });
        setNotice(
          `${label} is saved at ${Number(saved.latitude).toFixed(6)}, ${Number(saved.longitude).toFixed(6)}.`
        );
      }
      return true;
    } catch (err) {
      if (moveToken.current.get(id) !== token) return false;
      setPins((current) =>
        current.map((row) => (row.id === id ? { ...row, latitude: pin.latitude, longitude: pin.longitude } : row))
      );
      setDraft((current) =>
        current?.id === id ? { ...current, latitude: String(pin.latitude), longitude: String(pin.longitude) } : current
      );
      setNotice("");
      setError(err instanceof Error ? err.message : "The pin did not move.");
      return false;
    }
  }

  async function saveDraft() {
    if (!draft) return;
    const latitude = Number(draft.latitude);
    const longitude = Number(draft.longitude);
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      setError("Need a latitude and longitude.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/light-tour/pins", {
        method: draft.id ? "PUT" : "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: draft.id,
          holiday: draft.holiday,
          latitude,
          longitude,
          address: draft.address,
          note: draft.note,
          photoUrl: draft.photoUrl,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "The pin did not save.");
      setDraft(null);
      setNotice(draft.id ? "Pin updated." : "Pin saved.");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "The pin did not save.");
    } finally {
      setBusy(false);
    }
  }

  async function removePin(id: string) {
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`/api/light-tour/pins?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
        credentials: "same-origin",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "The pin did not delete.");
      setPendingDelete(null);
      if (draft?.id === id) setDraft(null);
      setNotice("Pin removed.");
      showToast("Stop deleted");
      await load();
    } catch (err) {
      const text = err instanceof Error ? err.message : "The pin did not delete.";
      setError(text);
      showToast(text, true);
    } finally {
      setBusy(false);
    }
  }

  function editPin(pin: AdminPin) {
    setHoliday(pin.holiday);
    setDraft({
      id: pin.id,
      holiday: pin.holiday,
      latitude: String(pin.latitude),
      longitude: String(pin.longitude),
      address: pin.address,
      note: pin.note,
      photoUrl: pin.photoUrl,
    });
    setNotice("");
    window.setTimeout(() => {
      document.getElementById("lt-pin-draft")?.scrollIntoView({ behavior: "auto", block: "start" });
    }, 50);
  }

  async function approvePin(pin: AdminPin) {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/light-tour/pins", {
        method: "PUT",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: pin.id,
          holiday: pin.holiday,
          latitude: pin.latitude,
          longitude: pin.longitude,
          address: pin.address,
          note: pin.note,
          photoUrl: pin.photoUrl,
          status: "approved",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "The house did not approve.");
      setNotice("House approved. It is on the tour.");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "The house did not approve.");
    } finally {
      setBusy(false);
    }
  }

  async function runImport() {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const res = await fetch("/api/light-tour/import", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: importText, holiday }),
      });
      const raw = await res.text();
      let data: { error?: string; message?: string; added?: number; capped?: number } = {};
      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {
        throw new Error("The import did not finish. Click Import pins again.");
      }
      if (!res.ok) throw new Error(data.error || "The import did not finish. Click Import pins again.");
      if (!data.capped) setImportText("");
      setNotice(data.message || `Added ${data.added} ${data.added === 1 ? "pin" : "pins"}.`);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "The import did not finish.");
    } finally {
      setBusy(false);
    }
  }

  async function onImportFiles(files: File[]) {
    if (!files.length) return;
    let total = 0;
    const texts: string[] = [];
    for (const file of files) {
      total += file.size;
      if (file.size > 2_000_000 || total > 2_000_000) {
        setError("Those files are too large.");
        return;
      }
      texts.push(await file.text());
    }
    const combined = combineImportFiles(texts);
    if (combined.length > 2_000_000) {
      setError("Those files are too large.");
      return;
    }
    setError("");
    setImportText(combined);
    setNotice(
      files.length === 1
        ? `${files[0].name} is in the box. Click Import pins to add the houses.`
        : `${files.length} files are in the box. Click Import pins to add the houses.`
    );
  }

  /** The map corner holds Drop pin under the locate button. Off the map, a floating copy shows. */
  function dropButton(place: "lt-drop-map" | "lt-drop-float") {
    return (
      <button
        type="button"
        className={`btn btn-primary lt-drop ${place}`}
        disabled={dropping}
        onClick={() => void dropPin()}
      >
        {dropping ? "Dropping…" : "Drop pin"}
      </button>
    );
  }

  if (!ready) {
    return (
      <section className="section">
        <div className="shell">
          <p>Loading pins…</p>
        </div>
      </section>
    );
  }

  if (!signedIn) {
    return (
      <section className="section">
        <div className="shell">
          <div className="about-panel lt-card">
            <h2>Sign in to drop pins</h2>
            <p>The public tour stays open. Pin drops use the same admin sign-in as the rest of the site.</p>
            <Link href="/admin" className="btn btn-primary lt-go">
              Open admin sign-in
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="shell lt-wrap">
        <p className="panel-hint">
          <Link href="/tour">Back to the tour</Link>
        </p>
        {termsNote ? (
          <p className="lt-error" role="alert">
            {termsNote}
          </p>
        ) : null}
        <details className="about-panel lt-card lt-fold">
          <summary className="lt-fold-summary">
            <span className="lt-fold-arrow" aria-hidden="true" />
            <h2>Terms acceptances ({acceptances.length})</h2>
          </summary>
          <div className="lt-fold-body">
          <p className="panel-hint">
            Newest first. Each line is the membership that tapped Accept after that inbox was confirmed. The name and email come from the account. The time is Eastern.
          </p>
          {acceptances.length === 0 ? <p className="lt-empty">No one has accepted yet.</p> : null}
          <ul className="lt-terms-log">
            {acceptances.map((row, index) => {
              const named = Boolean(row.memberEmail) && !row.userId.startsWith("guest-");
              return (
                <li key={`${row.userId}-${row.acceptedAt}-${index}`}>
                  <strong>{named ? row.memberName || "Member" : "Not tied to an account"}</strong>
                  {named ? <span>{row.memberEmail}</span> : <span>This older record is only a device id. It does not unlock the tour.</span>}
                  {named ? (
                    <span>
                      {row.emailVerifiedAt
                        ? `Email confirmed ${acceptedWhen(row.emailVerifiedAt)}`
                        : "Email was not confirmed. This line does not unlock the tour."}
                    </span>
                  ) : null}
                  <span>{acceptedWhen(row.acceptedAt)}</span>
                  <span>
                    {deviceLabel(row.deviceType)}
                    {row.appVersion ? ` · app ${row.appVersion}` : ""}
                    {row.termsVersion ? ` · terms ${row.termsVersion}` : ""}
                    {row.ip ? ` · IP ${row.ip}` : ""}
                  </span>
                  <span>Account {row.userId}</span>
                </li>
              );
            })}
          </ul>
          </div>
        </details>
        {error ? (
          <p className="lt-error" role="alert">
            {error}
          </p>
        ) : null}
        {notice ? (
          <p className="lt-banner" role="status">
            {notice}
          </p>
        ) : null}

        {pins.some((pin) => pin.status === "pending") ? (
          <WaitingHouses
            pins={pins.filter((pin) => pin.status === "pending")}
            busy={busy}
            pendingDelete={pendingDelete}
            onApprove={(pin) => void approvePin(pin)}
            onEdit={editPin}
            onAskRemove={setPendingDelete}
            onRemove={(id) => void removePin(id)}
          />
        ) : null}

        <button type="button" className="btn btn-ghost lt-go" onClick={() => setHouseOpen(true)}>
          Add a lit house
        </button>

        <div className="lt-chips" role="radiogroup" aria-label="Holiday for new pins">
          {TOUR_HOLIDAYS.map((item) => (
            <button
              key={item}
              type="button"
              className={`lt-chip ${holiday === item ? "is-on" : ""}`}
              role="radio"
              aria-checked={holiday === item}
              onClick={() => setHoliday(item)}
            >
              {HOLIDAY_LABELS[item]}
            </button>
          ))}
        </div>

        <p className="panel-hint">
          Drag a number onto the house. The middle of the number is the GPS point. Letting go saves it. The street
          address stays the same. Double-click a number to edit that house. The scroll wheel still zooms the map.
        </p>
        <LightTourMap
          visitor={null}
          line={nav.line}
          stops={mapStops}
          activeId={draft?.id}
          me={me}
          fabsRef={mapFabs}
          actions={dropButton("lt-drop-map")}
          onLocate={async () => {
            try {
              return await hereNow();
            } catch (err) {
              showToast(locationHelp(err), true);
              return null;
            }
          }}
          onMoveStop={(id, latitude, longitude) => void movePin(id, latitude, longitude)}
          onOpenStop={(id) => {
            const pin = pinsRef.current.find((row) => row.id === id);
            if (pin) editPin(pin);
          }}
          onGoToStop={(id) => {
            const stop = mapStops.find((row) => row.id === id);
            if (!stop) return;
            nav.start(
              { id: stop.id, latitude: stop.latitude, longitude: stop.longitude, label: `pin ${stop.order}` },
              me ? { latitude: me.latitude, longitude: me.longitude } : null,
            );
            if (!me) showToast("Waiting for your location to start directions.");
          }}
        />
        {nav.target ? (
          <div className={`lt-nav-bar${nav.arrived ? " is-arrived" : ""}`} role="status" aria-live="polite">
            <span className="lt-nav-cue">{nav.cue || `Directions to ${nav.target.label}.`}</span>
            <button type="button" className="lt-nav-stop" onClick={nav.stop}>
              {nav.arrived ? "Done" : "Stop"}
            </button>
          </div>
        ) : null}

        {draft ? (
          <div id="lt-pin-draft" className="about-panel lt-card">
            <h2>{draft.id ? `Edit pin ${mapStops.find((stop) => stop.id === draft.id)?.order ?? ""}`.trim() : "New pin"}</h2>
            {draft.id ? (
              <p className="lt-card-where">
                {draft.address || "No street address yet"} · {Number(draft.latitude).toFixed(5)},{" "}
                {Number(draft.longitude).toFixed(5)}
              </p>
            ) : null}
            <div className="lt-chips" role="radiogroup" aria-label="Pin holiday">
              {TOUR_HOLIDAYS.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={`lt-chip ${draft.holiday === item ? "is-on" : ""}`}
                  role="radio"
                  aria-checked={draft.holiday === item}
                  onClick={() => setDraft({ ...draft, holiday: item })}
                >
                  {HOLIDAY_LABELS[item]}
                </button>
              ))}
            </div>
            <div className="lt-coords">
              <div className="field">
                <label htmlFor="lt-pin-lat">Latitude</label>
                <input
                  id="lt-pin-lat"
                  inputMode="decimal"
                  value={draft.latitude}
                  onChange={(e) => setDraft({ ...draft, latitude: e.target.value })}
                />
              </div>
              <div className="field">
                <label htmlFor="lt-pin-lng">Longitude</label>
                <input
                  id="lt-pin-lng"
                  inputMode="decimal"
                  value={draft.longitude}
                  onChange={(e) => setDraft({ ...draft, longitude: e.target.value })}
                />
              </div>
            </div>
            {draft.id ? (
              <button
                type="button"
                className="btn btn-ghost lt-go"
                disabled={busy}
                onClick={() => {
                  if (draft.id) void movePinHere(draft.id);
                }}
              >
                Move pin to my location
              </button>
            ) : (
              <button type="button" className="btn btn-ghost lt-go" onClick={() => void useHere()}>
                Use where I am
              </button>
            )}
            <div className="field">
              <label htmlFor="lt-pin-address">Address</label>
              <input
                id="lt-pin-address"
                value={draft.address}
                maxLength={180}
                placeholder="Filled in from the map point when you save"
                onChange={(e) => setDraft({ ...draft, address: e.target.value })}
              />
            </div>
            <div className="field">
              <label htmlFor="lt-pin-note">Note</label>
              <input
                id="lt-pin-note"
                value={draft.note}
                maxLength={160}
                placeholder="One line, optional"
                onChange={(e) => setDraft({ ...draft, note: e.target.value })}
              />
            </div>
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
            {draft.photoUrl ? (
              <img src={draft.photoUrl} alt={draft.note || "House photo"} loading="lazy" className="lt-photo" />
            ) : null}
            <button type="button" className="btn btn-primary lt-go" disabled={busy} onClick={() => void saveDraft()}>
              {busy ? "Saving…" : "Save pin"}
            </button>
            <button type="button" className="btn btn-ghost lt-go" onClick={() => setDraft(null)}>
              Cancel
            </button>
            {draft.id ? (
              pendingDelete === draft.id ? (
                <div className="lt-card-confirm" role="group" aria-label="Confirm delete">
                  <p>Delete this stop?</p>
                  <button
                    type="button"
                    className="btn btn-danger lt-go"
                    disabled={busy}
                    onClick={() => {
                      if (draft.id) void removePin(draft.id);
                    }}
                  >
                    {busy ? "Deleting…" : "Yes, delete"}
                  </button>
                  <button type="button" className="btn btn-ghost lt-go" onClick={() => setPendingDelete(null)}>
                    Keep it
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="btn btn-danger lt-go"
                  disabled={busy}
                  onClick={() => setPendingDelete(draft.id || null)}
                >
                  Delete
                </button>
              )
            ) : null}
          </div>
        ) : null}

        <div className="about-panel lt-card">
          <h2>Bring in saved pins</h2>
          <p className="panel-hint">
            Paste a Google Keep note, or choose the Takeout files. Choosing the files only loads them. Click Import
            pins to save the houses. A note is placed when it has a street address, a Google Maps link, or coordinates.
            A Keep label named Halloween, Christmas, or xmas picks the holiday. Otherwise these pins are tagged{" "}
            {HOLIDAY_LABELS[holiday]}.
          </p>
          <div className="field">
            <label htmlFor="lt-import">Note, coordinates, or file text</label>
            <textarea
              id="lt-import"
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder={"1234 Bailey Ridge Dr\nporch full of pumpkins"}
            />
          </div>
          <div className="field">
            <label htmlFor="lt-import-file">Keep, CSV, or GeoJSON</label>
            <input
              id="lt-import-file"
              type="file"
              multiple
              accept=".csv,.json,.geojson,.html,.htm,.txt,text/csv,application/json,text/html,text/plain"
              onChange={(e) => {
                const files = e.target.files ? [...e.target.files] : [];
                e.target.value = "";
                void onImportFiles(files);
              }}
            />
          </div>
          {error ? (
            <p className="lt-error" role="alert">
              {error}
            </p>
          ) : null}
          {notice ? (
            <p className="lt-banner" role="status">
              {notice}
            </p>
          ) : null}
          <button type="button" className="btn btn-primary lt-go" disabled={busy || !importText.trim()} onClick={() => void runImport()}>
            {busy ? "Importing…" : "Import pins"}
          </button>
        </div>

        <details className="about-panel lt-card lt-fold">
          <summary className="lt-fold-summary">
            <span className="lt-fold-arrow" aria-hidden="true" />
            <h2>Pinned houses ({pins.filter((pin) => pin.status !== "pending").length})</h2>
          </summary>
          <div className="lt-fold-body">
        {TOUR_HOLIDAYS.map((item) => {
          const group = pins.filter((pin) => pin.holiday === item && pin.status !== "pending");
          const visible = group.slice(0, shown[item]);
          return (
            <div key={item} className="lt-fold-group">
              <h2>
                {HOLIDAY_LABELS[item]} ({group.length})
              </h2>
              {group.length === 0 ? <p className="lt-empty">No pins yet.</p> : null}
              <ul className="lt-list">
                {visible.map((pin) => {
                  const order = item === holiday ? group.findIndex((row) => row.id === pin.id) + 1 : 0;
                  return (
                  <li key={pin.id} className="lt-pin">
                    <strong className="lt-pin-title">
                      {order > 0 ? <span className="lt-pin-num">{order}</span> : null}
                      <span>{pin.address || `${pin.latitude.toFixed(5)}, ${pin.longitude.toFixed(5)}`}</span>
                    </strong>
                    {pin.note ? <span>{pin.note}</span> : null}
                    <span>
                      {pin.latitude.toFixed(5)}, {pin.longitude.toFixed(5)}
                      {pin.createdBy ? ` · ${pin.createdBy}` : ""}
                    </span>
                    {pin.photoUrl ? (
                      <img src={pin.photoUrl} alt={pin.note || pin.address || "House"} loading="lazy" className="lt-photo" />
                    ) : null}
                    <div className="lt-pin-actions">
                      <button type="button" className="btn btn-ghost" onClick={() => editPin(pin)}>
                        Edit
                      </button>
                      {pendingDelete === pin.id ? (
                        <>
                          <button type="button" className="btn btn-primary" disabled={busy} onClick={() => void removePin(pin.id)}>
                            Remove pin
                          </button>
                          <button type="button" className="btn btn-ghost" onClick={() => setPendingDelete(null)}>
                            Keep
                          </button>
                        </>
                      ) : (
                        <button type="button" className="btn btn-ghost" onClick={() => setPendingDelete(pin.id)}>
                          Delete
                        </button>
                      )}
                    </div>
                  </li>
                  );
                })}
              </ul>
              {visible.length < group.length ? (
                <button
                  type="button"
                  className="btn btn-ghost lt-go"
                  onClick={() => setShown((current) => ({ ...current, [item]: current[item] + PAGE }))}
                >
                  Show more
                </button>
              ) : null}
            </div>
          );
        })}
          </div>
        </details>

        {mapFabsSeen ? null : dropButton("lt-drop-float")}
        {toast ? (
          <div className={`lt-toast${toast.bad ? " is-bad" : ""}`} role={toast.bad ? "alert" : "status"}>
            {toast.text}
          </div>
        ) : null}
        <LightTourSubmit
          open={houseOpen}
          holiday={holiday}
          canSubmit
          pendingMember={false}
          direct
          onClose={() => setHouseOpen(false)}
          onSaved={(savedHoliday) => {
            setHoliday(savedHoliday);
            void load().catch((err) => {
              setError(err instanceof Error ? err.message : "Pins did not load.");
            });
          }}
        />
      </div>
    </section>
  );
}
