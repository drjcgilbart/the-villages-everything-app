"use client";

/**
 * Admin "Go to pin": live driving directions to one pin, reusing the tour's
 * leg directions, spoken cues, off-route reroute, and arrival rules.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { haversineMeters, OFF_ROUTE_QUIET_METERS } from "./lightTourShared";
import { nextCue, stepsFromPayload, straightCue, type DrivingStep } from "./tourDirections";
import { speakTour, speakTourNow, stopTourSpeech } from "./tourSpeech";
import { freshOffRouteState, offRouteFix } from "./tourOffRoute";
import { ARRIVAL_METERS, arrivalFix, freshArrivalState } from "./tourArrival";

type Point = { latitude: number; longitude: number };
export type NavTarget = Point & { id: string; label: string };

type Leg = { fetchedAt: Point; at: number; steps: DrivingStep[] };

function cleanLine(value: unknown): [number, number][] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (pair): pair is [number, number] =>
      Array.isArray(pair) && pair.length >= 2 && Number.isFinite(pair[0]) && Number.isFinite(pair[1]),
  );
}

export function usePinNavigation() {
  const [target, setTarget] = useState<NavTarget | null>(null);
  const [line, setLine] = useState<[number, number][]>([]);
  const [cue, setCue] = useState("");
  const [arrived, setArrived] = useState(false);
  const targetRef = useRef<NavTarget | null>(null);
  const lineRef = useRef<[number, number][]>([]);
  const hereRef = useRef<Point | null>(null);
  const legRef = useRef<Leg | null>(null);
  const legAbort = useRef<AbortController | null>(null);
  const legBusy = useRef(false);
  const lineAbort = useRef<AbortController | null>(null);
  const spokenKey = useRef("");
  const offRoute = useRef(freshOffRouteState());
  const arrival = useRef(freshArrivalState());
  const gen = useRef(0);
  const guideRef = useRef<((here: Point) => Promise<void>) | null>(null);

  const say = useCallback((text: string, key: string) => {
    setCue((prev) => (prev === text ? prev : text));
    if (!text || spokenKey.current === key) return;
    spokenKey.current = key;
    speakTour(text);
  }, []);

  const drawLine = useCallback(async (from: Point, to: NavTarget) => {
    lineAbort.current?.abort();
    const ctrl = new AbortController();
    lineAbort.current = ctrl;
    offRoute.current.busy = true;
    offRoute.current.lastRerouteAt = Date.now();
    try {
      const res = await fetch("/api/light-tour/reroute", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        signal: ctrl.signal,
        body: JSON.stringify({ from, stops: [{ latitude: to.latitude, longitude: to.longitude }] }),
      });
      const data = (await res.json().catch(() => null)) as { line?: unknown } | null;
      if (ctrl.signal.aborted || targetRef.current?.id !== to.id) return;
      const fresh = res.ok ? cleanLine(data?.line) : [];
      const drawn = fresh.length >= 2 ? fresh : ([[from.latitude, from.longitude], [to.latitude, to.longitude]] as [number, number][]);
      lineRef.current = drawn;
      setLine(drawn);
      offRoute.current.misses = 0;
      offRoute.current.firstMissAt = 0;
      offRoute.current.segment = 0;
      spokenKey.current = `rerouted:${Date.now()}`;
      const latest = hereRef.current;
      if (latest) void guideRef.current?.(latest);
    } catch {
      /* Keep the old line. The cooldown stops a retry storm. */
    } finally {
      if (lineAbort.current === ctrl) {
        offRoute.current.busy = false;
        offRoute.current.lastRerouteAt = Date.now();
      }
    }
  }, []);

  const loadLeg = useCallback(async (here: Point, to: NavTarget) => {
    const prev = legRef.current;
    const moved = !prev || haversineMeters(prev.fetchedAt, here) > 75;
    const old = !prev || Date.now() - prev.at > 20000;
    if ((!moved && !old) || legBusy.current) return;
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
          toLatitude: to.latitude,
          toLongitude: to.longitude,
        }),
      });
      const data = (await res.json().catch(() => null)) as { steps?: unknown } | null;
      if (ctrl.signal.aborted) return;
      legRef.current = { fetchedAt: here, at: Date.now(), steps: res.ok ? stepsFromPayload(data?.steps) : [] };
    } catch {
      if (!ctrl.signal.aborted) legRef.current = { fetchedAt: here, at: Date.now(), steps: [] };
    } finally {
      if (legAbort.current === ctrl) legBusy.current = false;
    }
  }, []);

  const guide = useCallback(
    async (here: Point) => {
      const to = targetRef.current;
      if (!to || arrival.current.arrived) return;
      if (haversineMeters(here, to) <= ARRIVAL_METERS) return;
      const mine = (gen.current += 1);
      await loadLeg(here, to);
      if (mine !== gen.current || targetRef.current?.id !== to.id || arrival.current.arrived) return;
      const steps = legRef.current?.steps || [];
      const spoken = steps.length ? nextCue(here, steps, to.id) : null;
      if (spoken) {
        if (spoken.near) say(spoken.nearText, spoken.nearKey);
        else say(spoken.text, spoken.key);
        return;
      }
      const straight = straightCue(here, to);
      say(straight.text.replace("The next house", "The pin"), straight.key);
    },
    [loadLeg, say],
  );

  useEffect(() => {
    guideRef.current = guide;
  }, [guide]);

  /** Feed every live GPS fix while navigating. */
  const feed = useCallback(
    (here: Point, accuracy?: number) => {
      hereRef.current = here;
      const to = targetRef.current;
      if (!to || arrival.current.arrived) return;
      const event = arrivalFix(arrival.current, to, here, accuracy);
      if (event === "arrive") {
        setArrived(true);
        legAbort.current?.abort();
        lineAbort.current?.abort();
        say(`You have arrived at ${to.label}.`, `arrive:${to.id}`);
        return;
      }
      if (event === "approach") say(`${to.label} is just ahead.`, `approach:${to.id}`);
      if (lineRef.current.length < 2 && !offRoute.current.busy) void drawLine(here, to);
      void guide(here);
      if (haversineMeters(here, to) <= OFF_ROUTE_QUIET_METERS) {
        offRoute.current.misses = 0;
        return;
      }
      if (offRouteFix(offRoute.current, here, lineRef.current, Date.now(), accuracy)) {
        say("Rerouting.", `reroute:${Date.now()}`);
        legRef.current = null;
        void drawLine(here, to);
      }
    },
    [drawLine, guide, say],
  );

  const stop = useCallback(() => {
    gen.current += 1;
    legAbort.current?.abort();
    lineAbort.current?.abort();
    targetRef.current = null;
    lineRef.current = [];
    legRef.current = null;
    setTarget(null);
    setLine([]);
    setCue("");
    setArrived(false);
    stopTourSpeech();
  }, []);

  /** Start from a tap, so the first line can be spoken right away. */
  const start = useCallback(
    (to: NavTarget, from: Point | null) => {
      stop();
      targetRef.current = to;
      arrival.current = freshArrivalState(to.id);
      offRoute.current = freshOffRouteState();
      spokenKey.current = `start:${to.id}`;
      setTarget(to);
      setArrived(false);
      const opening = `Directions to ${to.label}.`;
      setCue(opening);
      speakTourNow(opening);
      const here = from || hereRef.current;
      if (here) {
        hereRef.current = here;
        void drawLine(here, to);
        void guide(here);
      }
    },
    [drawLine, guide, stop],
  );

  /**
   * The pin being driven to was moved (or edited) on the map: keep going, to
   * its new spot, without restarting the spoken opening.
   */
  const retarget = useCallback(
    (to: NavTarget) => {
      if (targetRef.current?.id !== to.id) return;
      targetRef.current = to;
      setTarget(to);
      legRef.current = null;
      lineRef.current = [];
      setLine([]);
      arrival.current = freshArrivalState(to.id);
      setArrived(false);
      const here = hereRef.current;
      if (here) {
        void drawLine(here, to);
        void guide(here);
      }
    },
    [drawLine, guide],
  );

  useEffect(() => {
    return () => {
      legAbort.current?.abort();
      lineAbort.current?.abort();
      if (targetRef.current) stopTourSpeech();
    };
  }, []);

  return { target, line, cue, arrived, start, stop, feed, retarget };
}
