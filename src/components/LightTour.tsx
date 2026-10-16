"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { LightTourMap } from "./LightTourMap";
import { LightTourMine, type MemberHouse } from "./LightTourMine";
import { LightTourSubmit } from "./LightTourSubmit";
import { ThemeMusicPlayer } from "./ThemeMusicPlayer";
import { holidayTracksFor } from "@/lib/holidayMusic";
import {
  geoErrorCode,
  nativeLocationReady,
  readDeviceLocation,
  watchNativeLocation,
} from "@/lib/deviceLocation";
import { isNativeAppShell } from "@/lib/nativeAppShell";
import { nextCue, stepsFromPayload, straightCue, type DrivingStep } from "@/lib/tourDirections";
import { speakTour, speakTourNow, stopTourSpeech } from "@/lib/tourSpeech";
import { TOUR_MUSIC_STATE_EVENT, TOUR_MUSIC_TOGGLE_EVENT } from "@/lib/themeMusic";
import {
  DEFAULT_STOPS,
  GEOFENCE_METERS,
  HOLIDAY_LABELS,
  MAX_STOPS,
  TOUR_HOLIDAYS,
  VILLAGES_CENTER,
  haversineMeters,
  tourStartProblem,
  type TourHoliday,
} from "@/lib/lightTourShared";
import { buildTourSheetPdf } from "@/lib/tourSheetPdf";
import { freshOffRouteState, offRouteFix } from "@/lib/tourOffRoute";
import { HolidayLightsTermsGate } from "./HolidayLightsTermsGate";

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

const VILLAGES_START = {
  latitude: VILLAGES_CENTER.latitude,
  longitude: VILLAGES_CENTER.longitude,
};

function blockedLocationNote() {
  if (typeof navigator !== "undefined" && isNativeAppShell()) {
    return "Location is blocked for the app, so the route starts in the middle of The Villages. Open Settings, then Apps, The Villages Everything App, Permissions, Location, and choose Allow. On Android, turn Precise on too. Or turn off Use my location and type your street address.";
  }
  if (typeof navigator !== "undefined" && /Android|iPhone|iPad/i.test(navigator.userAgent)) {
    return "Location is blocked on this phone, so the route starts in the middle of The Villages. Tap the lock icon in the address bar, set Location to Allow, then build the route again. Or turn off Use my location and type your street address.";
  }
  return "This computer did not share a location, so the route starts in the middle of The Villages. Turn off Use my location and type your street address.";
}

export function LightTour({
  memberStatus = null,
}: {
  memberStatus?: "pending" | "approved" | "rejected" | "suspended" | null;
}) {
  const [holiday, setHoliday] = useState<TourHoliday>("halloween");
  const [countText, setCountText] = useState(String(DEFAULT_STOPS));
  const [useMine, setUseMine] = useState(true);
  const [typedAddress, setTypedAddress] = useState("");
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
  const [houseOpen, setHouseOpen] = useState(false);
  const [editing, setEditing] = useState<MemberHouse | null>(null);
  const [houseTick, setHouseTick] = useState(0);
  const [offline, setOffline] = useState(false);
  const seen = useRef(new Set<string>());
  const watch = useRef<number | null>(null);
  const nativeStop = useRef<(() => void) | null>(null);
  const hereRef = useRef<Here | null>(null);
  const indexRef = useRef(0);
  const stopsRef = useRef<Stop[]>([]);
  const phaseRef = useRef<Phase>("pick");
  const popupButton = useRef<HTMLButtonElement>(null);
  const voiceOnRef = useRef(true);
  const cueRef = useRef("");
  const spokenKeyRef = useRef("");
  const legRef = useRef<{ stopId: string; fetchedAt: Here; at: number; steps: DrivingStep[] } | null>(null);
  const legAbort = useRef<AbortController | null>(null);
  const legBusy = useRef(false);
  const guideGen = useRef(0);
  const houseOpenRef = useRef(false);
  const lineRef = useRef<[number, number][]>([]);
  const offRoute = useRef(freshOffRouteState());
  const rerouteAbort = useRef<AbortController | null>(null);
  const [voiceOn, setVoiceOn] = useState(true);
  const [musicOn, setMusicOn] = useState(false);
  const [cue, setCue] = useState("");
  const [sheetMode, setSheetMode] = useState<"" | "print" | "save">("");
  const [sheetError, setSheetError] = useState("");
  const sheetLock = useRef(false);
  const [termsTry, setTermsTry] = useState(0);
  const [termsState, setTermsState] = useState<"checking" | "signin" | "blocked" | "confirm" | "needed" | "unavailable" | "accepted">("checking");
  const [termsBusy, setTermsBusy] = useState(false);
  const [termsError, setTermsError] = useState("");
  const [termsNotice, setTermsNotice] = useState("");
  const [termsName, setTermsName] = useState("");
  const [termsEmail, setTermsEmail] = useState("");
  const [readingTerms, setReadingTerms] = useState(false);

  indexRef.current = index;
  stopsRef.current = stops;
  phaseRef.current = phase;
  houseOpenRef.current = houseOpen;

  useEffect(() => {
    let cancel = false;
    let settled = false;
    const slow = window.setTimeout(() => {
      if (cancel || settled) return;
      setTermsError("The membership check did not finish. Try again.");
      setTermsState("unavailable");
    }, 12000);
    void fetch("/api/light-tour/terms", { credentials: "include", cache: "no-store" })
      .then(async (res) => {
        const data = (await res.json().catch(() => null)) as {
          accepted?: boolean;
          signedIn?: boolean;
          name?: string;
          email?: string;
          status?: string;
          emailVerified?: boolean;
          error?: string;
        } | null;
        if (cancel) return;
        settled = true;
        setTermsName(data?.name || "");
        setTermsEmail(data?.email || "");
        if (!res.ok || !data) {
          setTermsError(data?.error || "The membership check did not finish. Try again.");
          setTermsState("unavailable");
          return;
        }
        setTermsError("");
        if (data.accepted) setTermsState("accepted");
        else if (!data.signedIn) setTermsState("signin");
        else if (data.status === "rejected" || data.status === "suspended") setTermsState("blocked");
        else if (!data.emailVerified) setTermsState("confirm");
        else setTermsState("needed");
      })
      .catch(() => {
        if (cancel) return;
        settled = true;
        setTermsError("The membership check did not finish. Try again.");
        setTermsState("unavailable");
      });
    return () => {
      cancel = true;
      window.clearTimeout(slow);
    };
  }, [termsTry]);

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
    try {
      if (localStorage.getItem("tvea-light-tour-voice") === "0") {
        voiceOnRef.current = false;
        setVoiceOn(false);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    document.body.classList.toggle("lt-touring", phase === "tour");
    return () => document.body.classList.remove("lt-touring");
  }, [phase]);

  useEffect(() => {
    const onState = (event: Event) => {
      const detail = (event as CustomEvent<{ playing?: boolean }>).detail;
      setMusicOn(Boolean(detail?.playing));
    };
    window.addEventListener(TOUR_MUSIC_STATE_EVENT, onState);
    return () => window.removeEventListener(TOUR_MUSIC_STATE_EVENT, onState);
  }, []);

  useEffect(() => {
    if (phase !== "tour" || !voiceOn) return;
    const id = window.setInterval(() => {
      const synth = window.speechSynthesis;
      if (synth?.speaking) synth.resume();
    }, 8000);
    return () => window.clearInterval(id);
  }, [phase, voiceOn]);

  useEffect(() => {
    return () => {
      if (watch.current != null) navigator.geolocation.clearWatch(watch.current);
      nativeStop.current?.();
      nativeStop.current = null;
      legAbort.current?.abort();
      rerouteAbort.current?.abort();
      stopTourSpeech();
    };
  }, []);

  useEffect(() => {
    if (popup) popupButton.current?.focus();
  }, [popup, index]);

  useEffect(() => {
    lineRef.current = line;
  }, [line]);

  const current = stops[index] || null;
  const musicTracks = useMemo(() => holidayTracksFor(holiday), [holiday]);
  const mapVisitor = useMemo(() => {
    if (!visitor) return null;
    return {
      latitude: Math.round(visitor.latitude * 1e5) / 1e5,
      longitude: Math.round(visitor.longitude * 1e5) / 1e5,
    };
  }, [visitor]);

  function noteArrival() {
    if (phaseRef.current !== "tour" || houseOpenRef.current) return;
    const here = hereRef.current;
    const stop = stopsRef.current[indexRef.current];
    if (!here || !stop || seen.current.has(stop.id)) return;
    if (haversineMeters(here, stop) <= GEOFENCE_METERS) {
      seen.current.add(stop.id);
      setPopup(true);
      showCue(`You have arrived at stop ${stop.order}.`, `arrive:${stop.id}`);
    }
  }

  function showCue(text: string, key: string) {
    cueRef.current = text;
    setCue((prev) => (prev === text ? prev : text));
    if (!voiceOnRef.current || !text) return;
    if (spokenKeyRef.current === key) return;
    spokenKeyRef.current = key;
    speakTour(text);
  }

  async function loadLeg(here: Here, stop: Stop) {
    const prev = legRef.current;
    const switched = !prev || prev.stopId !== stop.id;
    const moved = !prev || haversineMeters(prev.fetchedAt, here) > 75;
    const old = !prev || Date.now() - prev.at > 20000;
    if (!switched && !moved && !old) return;
    if (legBusy.current && !switched) return;
    legAbort.current?.abort();
    const ctrl = new AbortController();
    legAbort.current = ctrl;
    legBusy.current = true;
    try {
      const res = await fetch("/api/light-tour/leg", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        signal: ctrl.signal,
        body: JSON.stringify({
          fromLatitude: here.latitude,
          fromLongitude: here.longitude,
          toLatitude: stop.latitude,
          toLongitude: stop.longitude,
        }),
      });
      const data = (await res.json().catch(() => null)) as { steps?: unknown } | null;
      if (ctrl.signal.aborted) return;
      legRef.current = {
        stopId: stop.id,
        fetchedAt: here,
        at: Date.now(),
        steps: res.ok ? stepsFromPayload(data?.steps) : [],
      };
    } catch {
      if (ctrl.signal.aborted) return;
      legRef.current = { stopId: stop.id, fetchedAt: here, at: Date.now(), steps: [] };
    } finally {
      if (legAbort.current === ctrl) legBusy.current = false;
    }
  }

  async function guide(here: Here) {
    if (phaseRef.current !== "tour") return;
    const gen = (guideGen.current += 1);
    const stop = stopsRef.current[indexRef.current];
    if (!stop) return;
    if (haversineMeters(here, stop) <= GEOFENCE_METERS) return;
    await loadLeg(here, stop);
    if (gen !== guideGen.current) return;
    if (phaseRef.current !== "tour" || stopsRef.current[indexRef.current]?.id !== stop.id) return;
    const leg = legRef.current;
    const steps = leg && leg.stopId === stop.id ? leg.steps : [];
    const spoken = steps.length ? nextCue(here, steps, stop.id) : null;
    if (spoken) {
      if (spoken.near) showCue(spoken.nearText, spoken.nearKey);
      else showCue(spoken.text, spoken.key);
      return;
    }
    if (steps.length && leg && Date.now() - leg.at > 8000) {
      legRef.current = { ...leg, at: 0 };
    }
    const straight = straightCue(here, stop);
    showCue(straight.text, straight.key);
  }

  function rememberHere(here: Here, accuracy?: number) {
    hereRef.current = here;
    setVisitor((prev) => (prev && haversineMeters(prev, here) < 5 ? prev : here));
    noteArrival();
    if (phaseRef.current === "tour") {
      void guide(here);
      checkOffRoute(here, accuracy);
    }
  }

  /** Debounced off-route check on every live GPS fix. */
  function checkOffRoute(here: Here, accuracy?: number) {
    const stop = stopsRef.current[indexRef.current];
    if (!stop || houseOpenRef.current) return;
    // Pulling up to a house can leave the street line. That is not a wrong turn.
    if (haversineMeters(here, stop) <= GEOFENCE_METERS) {
      offRoute.current.misses = 0;
      return;
    }
    if (offRouteFix(offRoute.current, here, lineRef.current, Date.now(), accuracy)) {
      void reroute(here);
    }
  }

  /** Redraw the line from here through the remaining stops, same order. */
  async function reroute(here: Here) {
    const state = offRoute.current;
    const atIndex = indexRef.current;
    const ahead = stopsRef.current.slice(atIndex);
    if (!ahead.length) return;
    state.busy = true;
    state.lastRerouteAt = Date.now();
    rerouteAbort.current?.abort();
    const ctrl = new AbortController();
    rerouteAbort.current = ctrl;
    const next = ahead[0];
    showCue(`Rerouting. Heading back to stop ${next.order}.`, `reroute:${state.lastRerouteAt}`);
    try {
      const res = await fetch("/api/light-tour/reroute", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        signal: ctrl.signal,
        body: JSON.stringify({
          from: { latitude: here.latitude, longitude: here.longitude },
          stops: ahead.map((stop) => ({ latitude: stop.latitude, longitude: stop.longitude })),
        }),
      });
      const data = (await res.json().catch(() => null)) as { line?: unknown } | null;
      if (ctrl.signal.aborted || !res.ok) return;
      if (phaseRef.current !== "tour" || indexRef.current !== atIndex) return;
      const fresh = Array.isArray(data?.line)
        ? (data.line as unknown[]).filter(
            (pair): pair is [number, number] =>
              Array.isArray(pair) && pair.length >= 2 && Number.isFinite(pair[0]) && Number.isFinite(pair[1]),
          )
        : [];
      if (fresh.length < 2) return;
      // The new line starts at the driver, so the next fix is back on the route.
      // That, plus the cooldown, is what stops a reroute loop.
      lineRef.current = fresh;
      setLine(fresh);
      state.misses = 0;
      state.segment = 0;
      legRef.current = null;
      const latest = hereRef.current || here;
      void guide(latest);
    } catch {
      /* Network miss: keep the old line. The cooldown stops a retry storm. */
    } finally {
      if (rerouteAbort.current === ctrl) {
        state.busy = false;
        state.lastRerouteAt = Date.now();
      }
    }
  }

  /** Map locate button: a fresh fix when the map has none yet. */
  async function locateMe(): Promise<Here | null> {
    if (hereRef.current) return hereRef.current;
    try {
      const point = await readDeviceLocation();
      rememberHere(point);
      return point;
    } catch (err) {
      setError(locationHelp(err));
      return null;
    }
  }

  function toggleVoice() {
    const next = !voiceOnRef.current;
    voiceOnRef.current = next;
    setVoiceOn(next);
    try {
      localStorage.setItem("tvea-light-tour-voice", next ? "1" : "0");
    } catch {
      /* ignore */
    }
    if (!next) {
      stopTourSpeech();
      return;
    }
    if (phaseRef.current === "tour" && cueRef.current) {
      spokenKeyRef.current = "voice-on";
      speakTourNow(cueRef.current);
      return;
    }
    speakTourNow("Spoken directions are on.");
  }

  async function startingPoint(): Promise<{ here: Here; note: string; address: string }> {
    if (!useMine) {
      const address = typedAddress.trim();
      if (address) return { here: VILLAGES_START, note: "", address };
      if (!typedLat.trim() || !typedLng.trim()) {
        throw new Error("Type your street address, or a latitude and longitude.");
      }
      const typed = { latitude: Number(typedLat), longitude: Number(typedLng) };
      const typedProblem = tourStartProblem(typed);
      if (typedProblem) throw new Error(typedProblem);
      return { here: typed, note: "", address: "" };
    }
    try {
      const here = await readDeviceLocation((point) => !tourStartProblem(point));
      const problem = tourStartProblem(here);
      if (!problem) return { here, note: "", address: "" };
      // A desktop sometimes reports the ocean at 0, 0 instead of a real fix.
      if (Math.abs(here.latitude) < 0.05 && Math.abs(here.longitude) < 0.05) {
        return { here: VILLAGES_START, note: blockedLocationNote(), address: "" };
      }
      throw new Error(problem);
    } catch (err) {
      if (geoErrorCode(err) || (err instanceof Error && err.message === "This browser does not share location.")) {
        return { here: VILLAGES_START, note: blockedLocationNote(), address: "" };
      }
      throw err;
    }
  }

  async function acceptTerms() {
    setTermsBusy(true);
    setTermsError("");
    try {
      const res = await fetch("/api/light-tour/terms", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: "{}",
      });
      const data = (await res.json().catch(() => null)) as { accepted?: boolean; error?: string } | null;
      if (res.status === 401) {
        setTermsState("signin");
        setTermsError(data?.error || "Sign in before accepting.");
        return;
      }
      if (res.status === 403 && /confirm your email/i.test(data?.error || "")) {
        setTermsState("confirm");
        setTermsError(data?.error || "Confirm your email before accepting.");
        return;
      }
      if (!res.ok || !data?.accepted) {
        setTermsError(data?.error || "The acceptance did not save. Stay on this screen and try again.");
        return;
      }
      setTermsState("accepted");
    } catch {
      setTermsError("The acceptance did not save. Stay on this screen and try again.");
    } finally {
      setTermsBusy(false);
    }
  }

  async function buildRoute() {
    if (termsState !== "accepted") return;
    setError("");
    setSheetError("");
    setEmpty(false);
    setBusy(true);
    try {
      const start = await startingPoint();
      const stopCount = stopsFromText(countText);
      setCountText(String(stopCount));
      const res = await fetch("/api/light-tour/route", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          start.address
            ? { holiday, address: start.address, count: stopCount }
            : {
                holiday,
                latitude: start.here.latitude,
                longitude: start.here.longitude,
                count: stopCount,
              }
        ),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "The route did not load.");
      const reported = data.start as { latitude?: number; longitude?: number } | undefined;
      const here =
        reported && Number.isFinite(Number(reported.latitude)) && Number.isFinite(Number(reported.longitude))
          ? { latitude: Number(reported.latitude), longitude: Number(reported.longitude) }
          : start.here;
      rememberHere(here);
      setStops(data.stops || []);
      setLine(data.line || []);
      setWarning([start.note, data.warning].filter(Boolean).join(" "));
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
      credentials: "include",
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
    if (termsState !== "accepted") return;
    setPhase("tour");
    phaseRef.current = "tour";
    setIndex(0);
    indexRef.current = 0;
    setPopup(false);
    seen.current = new Set();
    legRef.current = null;
    spokenKeyRef.current = "";
    offRoute.current = freshOffRouteState();
    logVisit(false);
    const stop = stopsRef.current[0];
    const here = hereRef.current;
    if (voiceOnRef.current) {
      const away = stop && here ? haversineMeters(here, stop) : stop?.metersFromPrevious || 0;
      const line = stop
        ? `Starting the tour. The first house is about ${distanceLabel(away)} away.`
        : "Starting the tour.";
      spokenKeyRef.current = "opening";
      cueRef.current = line;
      setCue(line);
      speakTourNow(line);
    }
    stopFollow();
    if (nativeLocationReady()) {
      nativeStop.current = watchNativeLocation(
        (point) => rememberHere(point),
        (err) => {
          if (geoErrorCode(err) === 1) setError(locationHelp(err));
        },
      );
    } else if (navigator.geolocation) {
      let triedPrecise = false;
      const followPhone = (accurate: boolean) => {
        if (watch.current != null) navigator.geolocation.clearWatch(watch.current);
        watch.current = navigator.geolocation.watchPosition(
          (pos) => {
            rememberHere(
              { latitude: pos.coords.latitude, longitude: pos.coords.longitude },
              pos.coords.accuracy,
            );
            if (!accurate && !triedPrecise) {
              triedPrecise = true;
              followPhone(true);
            }
          },
          (err) => {
            if (accurate) {
              followPhone(false);
              return;
            }
            if (err.code === 1) setError(locationHelp(err));
          },
          { enableHighAccuracy: accurate, maximumAge: accurate ? 2000 : 15000, timeout: 20000 },
        );
      };
      followPhone(false);
    }
    if (here) void guide(here);
    noteArrival();
  }

  function stopFollow() {
    if (watch.current != null) navigator.geolocation.clearWatch(watch.current);
    watch.current = null;
    nativeStop.current?.();
    nativeStop.current = null;
  }

  function advance(fromPopup = false) {
    setPopup(false);
    if (!fromPopup && current) seen.current.add(current.id);
    if (index >= stops.length - 1) {
      stopFollow();
      legAbort.current?.abort();
      rerouteAbort.current?.abort();
      setPhase("done");
      phaseRef.current = "done";
      setCue("");
      cueRef.current = "";
      stopTourSpeech();
      if (voiceOnRef.current) speakTourNow("You finished the tour.");
      logVisit(true);
      return;
    }
    const next = index + 1;
    indexRef.current = next;
    setIndex(next);
    legRef.current = null;
    offRoute.current.misses = 0;
    const nextStop = stopsRef.current[next];
    if (voiceOnRef.current && nextStop) {
      const line = `Next stop. ${nextStop.address || "Saved house"}.`;
      spokenKeyRef.current = `next:${nextStop.id}`;
      cueRef.current = line;
      setCue(line);
      speakTourNow(line);
    } else {
      spokenKeyRef.current = "";
    }
    const here = hereRef.current;
    if (here) void guide(here);
  }

  useEffect(() => {
    noteArrival();
    // Recheck when the active stop changes. GPS ticks call noteArrival directly.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, phase]);

  function resetPick() {
    stopFollow();
    legAbort.current?.abort();
    rerouteAbort.current?.abort();
    offRoute.current = freshOffRouteState();
    legRef.current = null;
    stopTourSpeech();
    setCue("");
    cueRef.current = "";
    setPhase("pick");
    phaseRef.current = "pick";
    setStops([]);
    setLine([]);
    setPopup(false);
    setWarning("");
    setError("");
    setSheetError("");
  }

  async function sheetBytes() {
    return buildTourSheetPdf({
      stops: stopsRef.current.map((stop) => ({
        order: stop.order,
        latitude: stop.latitude,
        longitude: stop.longitude,
        address: stop.address,
        note: stop.note,
      })),
      line,
    });
  }

  function downloadSheet(bytes: Uint8Array) {
    const blob = new Blob([new Uint8Array(bytes)], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "holiday-lights-tour.pdf";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 4000);
  }

  async function saveSheet(notice = "") {
    if (termsState !== "accepted" || sheetLock.current) return;
    sheetLock.current = true;
    setSheetMode("save");
    setSheetError("");
    try {
      downloadSheet(await sheetBytes());
      setSheetError(notice);
    } catch (err) {
      setSheetError(err instanceof Error ? err.message : "The sheet did not build.");
    } finally {
      sheetLock.current = false;
      setSheetMode("");
    }
  }

  function printSheet() {
    if (termsState !== "accepted" || sheetLock.current) return;
    const preview = window.open("about:blank", "_blank");
    if (!preview) {
      void saveSheet("The print window was blocked, so the sheet was saved instead.");
      return;
    }
    sheetLock.current = true;
    setSheetMode("print");
    setSheetError("");
    try {
      preview.document.open();
      preview.document.write(
        "<!doctype html><title>Holiday Lights Tour</title><p style=\"font:20px sans-serif;padding:24px\">Making the sheet…</p>"
      );
      preview.document.close();
    } catch {
      /* The tab can still receive the sheet. */
    }
    void (async () => {
      try {
        const bytes = await sheetBytes();
        const file = new File([new Uint8Array(bytes)], "holiday-lights-tour.pdf", { type: "application/pdf" });
        const url = URL.createObjectURL(file);
        // The tab has to be the PDF itself. Printing a page that only frames the file prints a blank sheet.
        preview.location.replace(url);
        window.setTimeout(() => {
          try {
            preview.focus();
            preview.print();
          } catch {
            /* The sheet stays open in that tab. */
          }
        }, 1200);
        window.setTimeout(() => URL.revokeObjectURL(url), 300000);
      } catch (err) {
        setSheetError(err instanceof Error ? err.message : "The sheet did not build.");
        preview.close();
      } finally {
        sheetLock.current = false;
        setSheetMode("");
      }
    })();
  }

  function sheetActions() {
    if (!stops.length) return null;
    const busySheet = sheetMode !== "";
    return (
      <>
        <p className="panel-hint">This map and these houses go on the route sheet.</p>
        <button type="button" className="btn btn-ghost lt-go" disabled={busySheet} onClick={printSheet}>
          {sheetMode === "print" ? "Making the sheet…" : "Print this sheet"}
        </button>
        <button type="button" className="btn btn-ghost lt-go" disabled={busySheet} onClick={() => void saveSheet()}>
          {sheetMode === "save" ? "Making the sheet…" : "Save this sheet"}
        </button>
        {sheetError ? (
          <p className="lt-error" role="alert">
            {sheetError}
          </p>
        ) : null}
      </>
    );
  }

  function endTour() {
    const speak = voiceOnRef.current;
    resetPick();
    if (speak) speakTourNow("Tour ended.");
  }

  async function sendConfirmationEmail() {
    setTermsBusy(true);
    setTermsError("");
    setTermsNotice("");
    try {
      const res = await fetch("/api/members/verify/send", {
        method: "POST",
        credentials: "include",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: "{}",
      });
      const data = (await res.json().catch(() => null)) as { already?: boolean; email?: string; error?: string } | null;
      if (res.status === 401) {
        setTermsState("signin");
        setTermsError(data?.error || "Sign in before we can send the confirmation email.");
        return;
      }
      if (!res.ok) {
        setTermsError(data?.error || "The confirmation email did not send.");
        return;
      }
      if (data?.already) {
        setTermsNotice("This email is already confirmed. You can accept the warning.");
        setTermsState("needed");
        return;
      }
      setTermsNotice(`The link was sent to ${data?.email || termsEmail}. It is good for 48 hours.`);
    } catch {
      setTermsError("The confirmation email did not send.");
    } finally {
      setTermsBusy(false);
    }
  }

  function openHouseForm() {
    setPopup(false);
    setEditing(null);
    setHouseOpen(true);
  }

  function viewTermsLink() {
    return (
      <p className="lt-view-terms">
        <button type="button" className="text-link" onClick={() => setReadingTerms(true)}>
          View Terms
        </button>
      </p>
    );
  }

  const addHouseButton = (
    <button type="button" className="btn btn-ghost lt-go" onClick={openHouseForm}>
      Add a lit house
    </button>
  );

  function voiceSwitch() {
    return (
      <button
        type="button"
        className={`lt-chip ${voiceOn ? "is-on" : ""}`}
        role="switch"
        aria-checked={voiceOn}
        onClick={toggleVoice}
      >
        Spoken directions
      </button>
    );
  }

  function toggleHolidayMusic() {
    window.dispatchEvent(new Event(TOUR_MUSIC_TOGGLE_EVENT));
  }

  function musicSwitch(label = musicOn ? "Stop music" : "Music") {
    return (
      <button
        type="button"
        className={`lt-chip ${musicOn ? "is-on" : ""}`}
        aria-pressed={musicOn}
        onClick={toggleHolidayMusic}
      >
        {label}
      </button>
    );
  }

  const sheet = (
    <>
      {phase === "route" ? (
        <div className="about-panel lt-card">
          <h2>{stops.length} {stops.length === 1 ? "stop" : "stops"}</h2>
          {viewTermsLink()}
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
          {sheetActions()}
          <div className="lt-tour-tools">
            {voiceSwitch()}
            {musicSwitch()}
          </div>
          <p className="panel-hint">Spoken directions start with the tour and use the phone volume. Music uses the same volume.</p>
          <button type="button" className="btn btn-primary lt-go" onClick={startTour}>
            Start tour
          </button>
          <button type="button" className="btn btn-ghost lt-go" onClick={resetPick}>
            Change holiday
          </button>
          {addHouseButton}
        </div>
      ) : null}

      {phase === "tour" && current ? (
        <div className="about-panel lt-card">
          <p className="lt-progress">
            {index + 1} of {stops.length}
          </p>
          <h2>Stop {current.order}</h2>
          {cue ? (
            <p className="lt-cue" aria-live="polite">
              {cue}
            </p>
          ) : (
            <p className="panel-hint">The next turn shows here as soon as the phone has a fix.</p>
          )}
          <p>{current.address || "Saved house"}</p>
          {viewTermsLink()}
          {current.note ? <p>{current.note}</p> : null}
          {current.photoUrl ? (
            <img src={current.photoUrl} alt={current.note || `Stop ${current.order}`} loading="lazy" className="lt-photo" />
          ) : null}
          {sheetActions()}
          <div className="lt-tour-tools">
            {voiceSwitch()}
            {musicSwitch()}
          </div>
          <p className="panel-hint">A card pops up within about 150 meters. Spoken directions and music use the phone volume.</p>
          <button type="button" className="btn btn-primary lt-go" onClick={() => advance(false)}>
            {index >= stops.length - 1 ? "Finish tour" : "Next stop"}
          </button>
          {index < stops.length - 1 ? (
            <button type="button" className="btn btn-ghost lt-go" onClick={() => advance(false)}>
              Skip
            </button>
          ) : null}
          <button type="button" className="btn btn-ghost lt-go" onClick={endTour}>
            End tour
          </button>
          {addHouseButton}
        </div>
      ) : null}

      {phase === "done" ? (
        <div className="about-panel lt-card lt-done">
          <h2>Tour complete</h2>
          {viewTermsLink()}
          <p>
            You finished {stops.length} {stops.length === 1 ? "stop" : "stops"} on the {HOLIDAY_LABELS[holiday]} route.
          </p>
          {sheetActions()}
          {musicOn ? <div className="lt-tour-tools">{musicSwitch()}</div> : null}
          <button type="button" className="btn btn-primary lt-go" onClick={resetPick}>
            Start a new tour
          </button>
          <button type="button" className="btn btn-ghost lt-go" onClick={resetPick}>
            Switch holiday
          </button>
          {addHouseButton}
        </div>
      ) : null}
    </>
  );

  const houseForm = (
    <LightTourSubmit
      open={houseOpen}
      holiday={holiday}
      canSubmit
      pendingMember={false}
      house={editing}
      onClose={() => {
        setHouseOpen(false);
        setEditing(null);
      }}
      onSaved={() => setHouseTick((tick) => tick + 1)}
    />
  );

  const yourHouses =
    memberStatus === "approved" || memberStatus === "pending" ? (
      <LightTourMine
        reloadKey={houseTick}
        onEdit={(house) => {
          setPopup(false);
          setEditing(house);
          setHouseOpen(true);
        }}
      />
    ) : null;

  if (termsState !== "accepted") {
    return (
      <section className="section">
        <div className="shell lt-wrap">
          <HolidayLightsTermsGate
            inline
            mode={termsState}
            busy={termsBusy}
            error={termsError}
            accountName={termsName}
            accountEmail={termsEmail}
            notice={termsNotice}
            onAccept={() => void acceptTerms()}
            onSendEmail={() => void sendConfirmationEmail()}
            onRetry={() => {
              setTermsError("");
              setTermsNotice("");
              setTermsState("checking");
              setTermsTry((n) => n + 1);
            }}
          />
          {addHouseButton}
          <p className="panel-hint">
            Anyone can add a house. It stays off the tour until it is approved. Building a route and printing the sheet need a membership. The free plan is enough.
          </p>
          {yourHouses}
          {houseForm}
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="shell lt-wrap">
        {viewTermsLink()}
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
              {useMine
                ? "The tour uses your location to find the nearest houses and a driving route. Allow location when the phone asks. If location is blocked, the route still starts in the middle of The Villages."
                : "Type the street address where the tour should start. Include the city and ZIP."}
            </p>
            {useMine ? null : (
              <>
                <div className="field">
                  <label htmlFor="lt-start-address">Starting address</label>
                  <input
                    id="lt-start-address"
                    type="text"
                    autoComplete="off"
                    value={typedAddress}
                    placeholder="1234 Example St, The Villages, FL 32159"
                    onChange={(e) => setTypedAddress(e.target.value)}
                  />
                </div>
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
              </>
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
            {musicOn ? <div className="lt-tour-tools">{musicSwitch()}</div> : null}
            <button type="button" className="btn btn-primary lt-go" disabled={busy || offline} onClick={() => void buildRoute()}>
              {busy ? "Finding houses…" : "Build my route"}
            </button>
            {addHouseButton}
            <p className="panel-hint">
              Anyone can add a house. It stays off the tour until it is approved.
            </p>
          </div>
        ) : null}

        {phase !== "pick" ? (
          <div className="lt-stage">
            <div className="lt-map-col">
              <LightTourMap
                visitor={mapVisitor}
                line={line}
                stops={stops}
                activeId={current?.id}
                follow={phase === "tour"}
                onLocate={locateMe}
              />
              <button
                type="button"
                className={`lt-music-fab ${musicOn ? "is-on" : ""}`}
                aria-pressed={musicOn}
                onClick={toggleHolidayMusic}
              >
                <span aria-hidden="true">{musicOn ? "⏸" : "🎵"}</span>
                {musicOn ? "Stop" : "Music"}
              </button>
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
          <div className="lt-pop-scrim lt-pop-arrive">
            <div className="lt-pop" role="dialog" aria-modal="false" aria-labelledby="lt-pop-title">
              <div className="lt-pop-line">
                <p className="panel-hint lt-pop-kicker">
                  Stop {current.order} of {stops.length}
                </p>
                <h3 id="lt-pop-title">{current.address || "Saved house"}</h3>
              </div>
              {current.note ? <p className="lt-pop-note">{current.note}</p> : null}
              <div className="lt-pop-actions">
                <button ref={popupButton} type="button" className="btn btn-primary lt-go" onClick={() => advance(true)}>
                  {index >= stops.length - 1 ? "Finish" : "Next"}
                </button>
                {index < stops.length - 1 ? (
                  <button type="button" className="btn btn-ghost lt-go" onClick={() => advance(true)}>
                    Skip
                  </button>
                ) : null}
                <button type="button" className="btn btn-ghost lt-go" onClick={endTour}>
                  End
                </button>
                <button
                  type="button"
                  className={`btn btn-ghost lt-go lt-pop-music ${musicOn ? "is-on" : ""}`}
                  aria-pressed={musicOn}
                  onClick={toggleHolidayMusic}
                >
                  {musicOn ? "Stop" : "Music"}
                </button>
              </div>
            </div>
          </div>
        ) : null}
        {yourHouses}
        {houseForm}
      </div>
      <ThemeMusicPlayer
        tracks={musicTracks}
        storagePrefix="tvi-holiday"
        title="Holiday music"
        fabTitle="Holiday music"
        variant="tour"
        note="Real holiday songs for this page. Check the ones to rotate. When a song ends, the next checked song plays."
      />
      {readingTerms ? (
        <HolidayLightsTermsGate mode="reading" onBack={() => setReadingTerms(false)} />
      ) : null}
    </section>
  );
}
