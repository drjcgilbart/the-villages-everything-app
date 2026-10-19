import { haversineMeters } from "./lightTourShared";

type Point = { latitude: number; longitude: number };

/**
 * A forward road may be this much longer than the short road before a
 * turnaround is the only sensible choice. The whole leg is not the limit:
 * the next house is often more than a mile ahead on the road already being driven.
 */
export const FORWARD_LIMIT_METERS = 1609.34;

/** More than this many degrees from the way the vehicle is facing counts as behind. */
export const BEHIND_DEGREES = 120;

/** A device heading farther than this from the car's track is ignored. */
export const HEADING_AGREE_DEGREES = 60;

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

/**
 * True when this departure goes back the way the vehicle came, not a normal left or right.
 * The drawn road wins over a router label. A snap onto the street is often tagged as a
 * U-turn even when the rest of the road continues forward.
 */
export function leavesBehind(heading: number | null, departure: number | null, uturn: boolean): boolean {
  if (heading == null) return false;
  if (departure != null) return angleBetween(heading, departure) > BEHIND_DEGREES;
  return uturn;
}

export type RouteChoice = { meters: number; departure: number | null; uturn: boolean };

/**
 * Prefer the route that continues the way the vehicle is already facing.
 * Turn around only when no forward road exists, or the forward road adds
 * more than a mile compared with turning around.
 */
export function chooseForwardRoute(
  heading: number | null,
  forward: RouteChoice | null,
  open: RouteChoice | null,
): { pick: "forward" | "open"; turnAround: boolean } | null {
  if (!open && !forward) return null;
  const behind = open != null && leavesBehind(heading, open.departure, open.uturn);
  if (!behind) return { pick: open ? "open" : "forward", turnAround: false };
  const extra = forward && open ? forward.meters - open.meters : (forward?.meters ?? Number.POSITIVE_INFINITY);
  const forwardOk =
    forward != null &&
    !leavesBehind(heading, forward.departure, forward.uturn) &&
    extra <= FORWARD_LIMIT_METERS;
  if (forwardOk) return { pick: "forward", turnAround: false };
  return { pick: "open", turnAround: true };
}

/**
 * Compass degrees for leaflet-rotate so this direction of travel sits at the
 * top of the screen. The plugin's positive bearing rotates the map clockwise,
 * which would put travel at the bottom if the heading were passed through as-is.
 */
export function directionUpBearing(travel: number): number {
  return (360 - (((travel % 360) + 360) % 360)) % 360;
}

/** Screen angle for the arrow. `mapBearing` is the clockwise rotation applied to the map. */
export function arrowScreenAngle(travel: number, mapBearing: number): number {
  return travel + mapBearing;
}

/**
 * Direction to trust. The track of GPS fixes is where the car actually went.
 * A device heading is used only when it agrees with that track.
 */
export function pickCourse(movement: number | null, device: number | null, previous: number | null): number | null {
  const track = cleanHeading(movement);
  const gps = cleanHeading(device);
  if (track != null && gps != null && angleBetween(gps, track) <= HEADING_AGREE_DEGREES) return gps;
  if (track != null) return track;
  if (gps != null && (previous == null || angleBetween(gps, previous) <= HEADING_AGREE_DEGREES)) return gps;
  return cleanHeading(previous);
}

export type TravelState = { heading: number | null; anchor: Point | null };

export function freshTravel(): TravelState {
  return { heading: null, anchor: null };
}

/**
 * Remember the direction the vehicle has been moving. Two fixes far enough
 * apart are the car's track. A device heading counts only when it agrees
 * with that track, so a phone facing the cabin cannot aim the arrow backward.
 * A stop keeps the last direction.
 */
export function noteTravel(
  state: TravelState,
  here: Point,
  motion?: { heading?: number | null; speed?: number | null },
): number | null {
  const speed = motion?.speed;
  const moving = speed != null && Number.isFinite(speed) && speed > 0.8;
  const device = moving ? cleanHeading(motion?.heading) : null;
  if (!state.anchor) state.anchor = here;
  const apart = haversineMeters(state.anchor, here);
  const movement = apart >= 8 ? bearingDegrees(state.anchor, here) : null;
  if (movement != null) state.anchor = here;
  state.heading = pickCourse(movement, device, state.heading);
  return state.heading;
}
