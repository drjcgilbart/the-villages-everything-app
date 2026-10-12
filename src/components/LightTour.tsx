"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { LightTourMap } from "./LightTourMap";
import {
  DEFAULT_STOPS,
  GEOFENCE_METERS,
  HOLIDAY_LABELS,
  MAX_STOPS,
  TOUR_HOLIDAYS,
  haversineMeters,
  tourStartProblem,
  type TourHoliday,
} from "@/lib/lightTourShared";

type Stop = {
  id: string;
  order: number;
  holiday: TourHoliday;
  latitude: number;
  longitude: number;
  address: string;
  photoUrl: string;
  note: string;
  metersFromPrevious: number;
  secondsFromPrevious: number;
};

type Phase = "pick" | "route" | "tour" | "done";
type Here = { latitude: number; longitude: number };

function distanceLabel(meters: number) {
  if (!Number.isFinite(meters)) return "";
  if (meters < 300) return `${Math.round(meters)} meters`;
  return `${(meters / 1609.34).toFixed(1)} miles`;
}

function sessionId() {
  const key = "tvea-light-tour";
  try {
    const existing = localStorage.getItem(key);
    if (existing) return existing;
    const id = `visit-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
    localStorage.setItem(key, id);
    return id;
  } catch {
    return `visit-${Date.now().toString(36)}`;
  }
}

function readFix(timeout: number): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("This browser does not share location."));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout,
      maximumAge: 0,
    });
  });
}

/** A first fix is sometimes 0, 0. Ask once more before giving up. */
async function readLocation(): Promise<GeolocationPosition> {
  const first = await readFix(12000);
  const here = { latitude: first.coords.latitude, longitude: first.coords.longitude };
  if (!tourStartProblem(here)) return first;
  try {
    return await readFix(20000);
  } catch {
    return first;
  }
}

function stopsFromText(text: string) {
  const n = Math.round(Number(text));
  if (!Number.isFinite(n) || n < 1) return DEFAULT_STOPS;
  return Math.min(MAX_STOPS, n);
}

function locationHelp(err: unknown) {
  const code = err && typeof err === "object" && "code" in err ? Number((err as { code: number }).code) : 0;
  if (code === 1) {
    return "Location is blocked. Allow location for this site in the browser or phone settings, then try again.";
  }
  return "Location did not come through. Turn location on and try again.";
}

export function LightTour() {
  const [holiday, setHoliday] = useState<TourHoliday>("halloween");
  const [countText, setCountText] = useState(String(DEFAULT_STOPS));
  const [useMine, setUseMine] = useState(true);
  const [typedLat, setTypedLat] = useState("");
  const [typedLng, setTypedLng] = useState("");
  const [phase, setPhase] = useState<Phase>("pick");
  const [visitor, setVisitor] = useState<Here | null>(null);
  const [stops, setStops] = useState<Stop[]>([]);
  const [line, setLine] = useState<[number, number][]>([]);
  const [warning, setWarning] = useState("");
  const [empty, setEmpty] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [index, setIndex] = useState(0);
  const [popup, setPopup] = useState(false);
  const [offline, setOffline] = useState(false);
  const seen = useRef(new Set<string>());
  const watch = useRef<number | null>(null);
  const hereRef = useRef<Here | null>(null);
  const indexRef = useRef(0);
  const stopsRef = useRef<Stop[]>([]);
  const phaseRef = useRef<Phase>("pick");
  const popupButton = useRef<HTMLButtonElement>(null);

  indexRef.current = index;
  stopsRef.current = stops;
  phaseRef.current = phase;

  useEffect(() => {
    const sync = () => setOffline(!navigator.onLine);
    sync();
    window.addEventListener("online", sync);
    window.addEventListener("offline", sync);
    return () => {
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", sync);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (watch.current != null) navigator.geolocation.clearWatch(watch.current);
    };
  }, []);

  useEffect(() => {
    if (popup) popupButton.current?.focus();
  }, [popup, index]);

  const current = stops[index] || null;
  const mapVisitor = useMemo(() => {
    if (!visitor) return null;
    return {
      latitude: Math.round(visitor.latitude * 10000) / 10000,
      longitude: Math.round(visitor.longitude * 10000) / 10000,
    };
  }, [visitor]);

  function noteArrival() {
    if (phaseRef.current !== "tour") return;
    const here = hereRef.current;
    const stop = stopsRef.current[indexRef.current];
    if (!here || !stop || seen.current.has(stop.id)) return;
    if (haversineMeters(here, stop) <= GEOFENCE_METERS) {
      seen.current.add(stop.id);
      setPopup(true);
    }
  }

  function rememberHere(here: Here) {
    hereRef.current = here;
    setVisitor((prev) => (prev && haversineMeters(prev, here) < 8 ? prev : here));
    noteArrival();
  }

  async function startingPoint(): Promise<Here> {
    let here: Here;
    if (useMine) {
      const pos = await readLocation();
      here = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
    } else if (!typedLat.trim() || !typedLng.trim()) {
      throw new Error("Type a latitude and longitude, or turn Use my location back on.");
    } else {
      here = { latitude: Number(typedLat), longitude: Number(typedLng) };
    }
    const problem = tourStartProblem(here);
    if (problem) throw new Error(problem);
    return here;
  }

  async function buildRoute() {
    setError("");
    setEmpty(false);
    setBusy(true);
    try {
      const here = await startingPoint();
      const stopCount = stopsFromText(countText);
      setCountText(String(stopCount));
      rememberHere(here);
      const res = await fetch("/api/light-tour/route", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ holiday, latitude: here.latitude, longitude: here.longitude, count: stopCount }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "The route did not load.");
      setStops(data.stops || []);
      setLine(data.line || []);
      setWarning(data.warning || "");
      setEmpty(!!data.empty);
      setIndex(0);
      indexRef.current = 0;
      setPopup(false);
      seen.current = new Set();
      setPhase(data.empty ? "pick" : "route");
      phaseRef.current = data.empty ? "pick" : "route";
    } catch (err) {
      const code = err && typeof err === "object" && "code" in err ? Number((err as { code: number }).code) : 0;
      setError(code ? locationHelp(err) : err instanceof Error ? err.message : locationHelp(err));
    } finally {
      setBusy(false);
    }
  }

  function logVisit(completed: boolean) {
    void fetch("/api/light-tour/tours", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: sessionId(),
        holiday,
        stopCount: stops.length,
        startedAt: new Date().toISOString(),
        completedAt: completed ? new Date().toISOString() : "",
      }),
    }).catch(() => undefined);
  }

  function startTour() {
    setPhase("tour");
    phaseRef.current = "tour";
    setIndex(0);
    indexRef.current = 0;
    setPopup(false);
    seen.current = new Set();
    logVisit(false);
    if (!navigator.geolocation) return;
    if (watch.current != null) navigator.geolocation.clearWatch(watch.current);
    watch.current = navigator.geolocation.watchPosition(
      (pos) => {
        rememberHere({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
      },
      (err) => {
        if (err.code === 1) setError(locationHelp(err));
      },
      { enableHighAccuracy: true, maximumAge: 4000, timeout: 12000 }
    );
    noteArrival();
  }

  function advance(fromPopup = false) {
    setPopup(false);
    if (!fromPopup && current) seen.current.add(current.id);
    if (index >= stops.length - 1) {
      if (watch.current != null) navigator.geolocation.clearWatch(watch.current);
      watch.current = null;
      setPhase("done");
      phaseRef.current = "done";
      logVisit(true);
      return;
    }
    const next = index + 1;
    indexRef.current = next;
    setIndex(next);
  }

  useEffect(() => {
    noteArrival();
    // Recheck when the active stop changes. GPS ticks call noteArrival directly.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, phase]);

  function resetPick() {
    if (watch.current != null) navigator.geolocation.clearWatch(watch.current);
    watch.current = null;
    setPhase("pick");
    phaseRef.current = "pick";
    setStops([]);
    setLine([]);
    setPopup(false);
    setWarning("");
    setError("");
  }

  const sheet = (
    <>
      {phase === "route" ? (
        <div className="about-panel lt-card">
          <h2>{stops.length} {stops.length === 1 ? "stop" : "stops"}</h2>
          <ol className="lt-list">
            {stops.map((stop) => (
              <li key={stop.id}>
                <strong>
                  {stop.order}. {stop.address || "Saved house"}
                </strong>
                <span>{distanceLabel(stop.metersFromPrevious)} from the previous point</span>
                {stop.note ? <span>{stop.note}</span> : null}
              </li>
            ))}
          </ol>
          <button type="button" className="btn btn-primary lt-go" onClick={startTour}>
            Start tour
          </button>
          <button type="button" className="btn btn-ghost lt-go" onClick={resetPick}>
            Change holiday
          </button>
        </div>
      ) : null}

      {phase === "tour" && current ? (
        <div className="about-panel lt-card">
          <p className="lt-progress">
            {index + 1} of {stops.length}
          </p>
          <h2>Stop {current.order}</h2>
          <p>{current.address || "Saved house"}</p>
          {current.note ? <p>{current.note}</p> : null}
          {current.photoUrl ? (
            <img src={current.photoUrl} alt={current.note || `Stop ${current.order}`} loading="lazy" className="lt-photo" />
          ) : null}
          <p className="panel-hint">
            {distanceLabel(current.metersFromPrevious)} from the previous point. A card pops up within about 150 meters.
          </p>
          <button type="button" className="btn btn-primary lt-go" onClick={() => advance(false)}>
            {index >= stops.length - 1 ? "Finish tour" : "Next stop"}
          </button>
          {index < stops.length - 1 ? (
            <button type="button" className="btn btn-ghost lt-go" onClick={() => advance(false)}>
              Skip
            </button>
          ) : null}
        </div>
      ) : null}

      {phase === "done" ? (
        <div className="about-panel lt-card lt-done">
          <h2>Tour complete</h2>
          <p>
            You finished {stops.length} {stops.length === 1 ? "stop" : "stops"} on the {HOLIDAY_LABELS[holiday]} route.
          </p>
          <button type="button" className="btn btn-primary lt-go" onClick={resetPick}>
            Start a new tour
          </button>
          <button type="button" className="btn btn-ghost lt-go" onClick={resetPick}>
            Switch holiday
          </button>
        </div>
      ) : null}
    </>
  );

  return (
    <section className="section">
      <div className="shell lt-wrap">
        {offline ? (
          <p className="lt-banner" role="status">
            You are offline. The map and the next route need a connection.
          </p>
        ) : null}
        <div className="lt-live" aria-live="assertive">
          {popup && current ? `Arrived at stop ${current.order}. ${current.address || current.note}` : ""}
        </div>

        {phase === "pick" ? (
          <div className="about-panel lt-card">
            <h2>Pick a holiday</h2>
            <div className="lt-chips" role="radiogroup" aria-label="Holiday">
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
            <div className="field">
              <label htmlFor="lt-stops">Stops</label>
              <input
                id="lt-stops"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                value={countText}
                onFocus={(e) => {
                  const el = e.currentTarget;
                  requestAnimationFrame(() => el.select());
                }}
                onChange={(e) => setCountText(e.target.value.replace(/\D/g, "").slice(0, 2))}
                onBlur={() => setCountText(String(stopsFromText(countText)))}
              />
              <p className="panel-hint">Type a number from 1 to {MAX_STOPS}. Click the number, then type the new one.</p>
            </div>
            <button
              type="button"
              className={`lt-chip ${useMine ? "is-on" : ""}`}
              role="switch"
              aria-checked={useMine}
              onClick={() => setUseMine((on) => !on)}
            >
              Use my location
            </button>
            <p className="panel-hint">
              The tour uses your location to find the nearest houses and a driving route. Allow location when the phone asks.
            </p>
            {useMine ? null : (
              <div className="lt-coords">
                <div className="field">
                  <label htmlFor="lt-lat">Latitude</label>
                  <input
                    id="lt-lat"
                    inputMode="decimal"
                    value={typedLat}
                    placeholder="28.908"
                    onChange={(e) => setTypedLat(e.target.value)}
                  />
                </div>
                <div className="field">
                  <label htmlFor="lt-lng">Longitude</label>
                  <input
                    id="lt-lng"
                    inputMode="decimal"
                    value={typedLng}
                    placeholder="-81.985"
                    onChange={(e) => setTypedLng(e.target.value)}
                  />
                </div>
              </div>
            )}
            {empty ? (
              <p className="lt-empty">
                No {HOLIDAY_LABELS[holiday]} houses are saved yet. Try another holiday, or check back after pins are added.
              </p>
            ) : null}
            {error ? (
              <p className="lt-error" role="alert">
                {error}
              </p>
            ) : null}
            <button type="button" className="btn btn-primary lt-go" disabled={busy || offline} onClick={() => void buildRoute()}>
              {busy ? "Finding houses…" : "Build my route"}
            </button>
            <p className="panel-hint">
              <Link href="/tour/admin">Drop pins</Link> is for the site owner.
            </p>
          </div>
        ) : null}

        {phase !== "pick" ? (
          <div className="lt-stage">
            <div>
              <LightTourMap visitor={mapVisitor} line={line} stops={stops} activeId={current?.id} />
              {warning ? (
                <p className="lt-banner" role="status">
                  {warning}
                </p>
              ) : null}
              {error ? (
                <p className="lt-error" role="alert">
                  {error}
                </p>
              ) : null}
            </div>
            <div className="lt-sheet">{sheet}</div>
          </div>
        ) : null}

        {popup && current ? (
          <div className="lt-pop-scrim">
            <div className="lt-pop" role="dialog" aria-modal="true" aria-labelledby="lt-pop-title">
              <p className="panel-hint">
                Stop {current.order} of {stops.length}
              </p>
              <h3 id="lt-pop-title">{current.address || "Saved house"}</h3>
              {current.photoUrl ? (
                <img src={current.photoUrl} alt={current.note || current.address || "House"} loading="lazy" className="lt-photo" />
              ) : null}
              {current.note ? <p>{current.note}</p> : null}
              <button ref={popupButton} type="button" className="btn btn-primary lt-go" onClick={() => advance(true)}>
                {index >= stops.length - 1 ? "Finish tour" : "Next"}
              </button>
              {index < stops.length - 1 ? (
                <button type="button" className="btn btn-ghost lt-go" onClick={() => advance(true)}>
                  Skip
                </button>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
