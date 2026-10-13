"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { LightTourMap } from "./LightTourMap";
import { HOLIDAY_LABELS, TOUR_HOLIDAYS, type TourHoliday } from "@/lib/lightTourShared";

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

function readLocation(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("This browser does not share location."));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 12000,
      maximumAge: 5000,
    });
  });
}

function locationHelp(err: unknown) {
  const code = err && typeof err === "object" && "code" in err ? Number((err as { code: number }).code) : 0;
  if (code === 1) {
    return "Location is blocked. Allow location for this site in the browser or phone settings, then try again.";
  }
  return "Location did not come through. You can type the latitude and longitude instead.";
}

function blankDraft(holiday: TourHoliday): Draft {
  return { holiday, latitude: "", longitude: "", address: "", note: "", photoUrl: "" };
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
  }

  useEffect(() => {
    void load().catch((err) => {
      setError(err instanceof Error ? err.message : "Pins did not load.");
      setReady(true);
    });
  }, []);

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

  async function dropPin() {
    setError("");
    setNotice("");
    setDraft(blankDraft(holiday));
    try {
      const pos = await readLocation();
      setDraft({
        ...blankDraft(holiday),
        latitude: pos.coords.latitude.toFixed(6),
        longitude: pos.coords.longitude.toFixed(6),
      });
    } catch (err) {
      setError(locationHelp(err));
    }
  }

  async function useHere() {
    setError("");
    try {
      const pos = await readLocation();
      setDraft((current) =>
        current
          ? {
              ...current,
              latitude: pos.coords.latitude.toFixed(6),
              longitude: pos.coords.longitude.toFixed(6),
              address: "",
            }
          : current
      );
    } catch (err) {
      setError(locationHelp(err));
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
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "The pin did not delete.");
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

        <LightTourMap visitor={null} line={[]} stops={mapStops} />

        {draft ? (
          <div id="lt-pin-draft" className="about-panel lt-card">
            <h2>{draft.id ? "Edit pin" : "New pin"}</h2>
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
            <button type="button" className="btn btn-ghost lt-go" onClick={() => void useHere()}>
              Use where I am
            </button>
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

        {TOUR_HOLIDAYS.map((item) => {
          const group = pins.filter((pin) => pin.holiday === item && pin.status !== "pending");
          const visible = group.slice(0, shown[item]);
          return (
            <div key={item} className="about-panel lt-card">
              <h2>
                {HOLIDAY_LABELS[item]} ({group.length})
              </h2>
              {group.length === 0 ? <p className="lt-empty">No pins yet.</p> : null}
              <ul className="lt-list">
                {visible.map((pin) => (
                  <li key={pin.id} className="lt-pin">
                    <strong>{pin.address || `${pin.latitude.toFixed(5)}, ${pin.longitude.toFixed(5)}`}</strong>
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
                ))}
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

        <button type="button" className="btn btn-primary lt-drop" onClick={() => void dropPin()}>
          Drop pin
        </button>
      </div>
    </section>
  );
}
