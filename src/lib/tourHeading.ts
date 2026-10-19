import { haversineMeters } from "./lightTourShared";

type Point = { latitude: number; longitude: number };

/** A forward loop longer than this may tell the driver to turn around. */
export const FORWARD_LIMIT_METERS = 1609.34;

/** More than this many degrees from the way the vehicle is facing counts as behind. */
export const BEHIND_DEGREES = 120;

/** Smallest turn from `fromDeg` to `toDeg`, in degrees, from 0 to 180. */
export function angleBetween(fromDeg: number, toDeg: number): number {
  return Math.abs(((((toDeg - fromDeg) % 360) + 540) % 360) - 180);
}

/** Compass bearing in degrees, 0 north, clockwise. */
export function bearingDegrees(from: Point, to: Point): number {
  const rad = Math.PI / 180;
  const y = Math.sin((to.longitude - from.longitude) * rad) * Math.cos(to.latitude * rad);
  const x =
    Math.cos(from.latitude * rad) * Math.sin(to.latitude * rad) -
    Math.sin(from.latitude * rad) * Math.cos(to.latitude * rad) * Math.cos((to.longitude - from.longitude) * rad);
  return (Math.atan2(y, x) / rad + 360) % 360;
}

export function cleanHeading(value: unknown): number | null {
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  return ((n % 360) + 360) % 360;
}

/** True when this departure goes back the way the vehicle came, not a normal left or right. */
export function leavesBehind(heading: number | null, departure: number | null, uturn: boolean): boolean {
  if (heading == null) return false;
  if (uturn) return true;
  if (departure == null) return false;
  return angleBetween(heading, departure) > BEHIND_DEGREES;
}

export type RouteChoice = { meters: number; departure: number | null; uturn: boolean };

/**
 * Prefer the route that continues the way the vehicle is already facing.
 * A route that leaves behind is used only when the forward way back to the
 * next stop is longer than a mile, or when no forward road exists.
 */
export function chooseForwardRoute(
  heading: number | null,
  forward: RouteChoice | null,
  open: RouteChoice | null,
): { pick: "forward" | "open"; turnAround: boolean } | null {
  if (!open && !forward) return null;
  const behind = open != null && leavesBehind(heading, open.departure, open.uturn);
  if (!behind) return { pick: open ? "open" : "forward", turnAround: false };
  const forwardOk =
    forward != null &&
    !leavesBehind(heading, forward.departure, forward.uturn) &&
    forward.meters <= FORWARD_LIMIT_METERS;
  if (forwardOk) return { pick: "forward", turnAround: false };
  return { pick: "open", turnAround: true };
}

export type TravelState = { heading: number | null; anchor: Point | null };

export function freshTravel(): TravelState {
  return { heading: null, anchor: null };
}

/**
 * Remember the direction the vehicle has been moving. A GPS heading counts
 * while it is actually moving. Otherwise two fixes far enough apart set it.
 * A stop keeps the last direction.
 */
export function noteTravel(
  state: TravelState,
  here: Point,
  motion?: { heading?: number | null; speed?: number | null },
): number | null {
  const gps = motion?.heading;
  const speed = motion?.speed;
  const gpsOk =
    gps != null &&
    Number.isFinite(gps) &&
    gps >= 0 &&
    gps <= 360 &&
    (speed == null || !Number.isFinite(speed) || speed > 0.8);
  if (gpsOk) {
    state.heading = gps === 360 ? 0 : gps;
    state.anchor = here;
    return state.heading;
  }
  const prev = state.anchor;
  if (!prev) {
    state.anchor = here;
    return state.heading;
  }
  if (haversineMeters(prev, here) < 8) return state.heading;
  state.heading = bearingDegrees(prev, here);
  state.anchor = here;
  return state.heading;
}
