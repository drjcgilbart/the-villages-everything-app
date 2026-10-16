/**
 * Off-route detection for the live Holiday Lights Tour.
 * Pure functions plus a small stateful tracker so the component stays simple.
 */

export type LatLng = [number, number];
type Point = { latitude: number; longitude: number };

/** Farther than this from the drawn route counts as one off-route fix. */
export const OFF_ROUTE_METERS = 60;
/** Far enough that two fixes in a row are clearly off the route (wrong road, not GPS drift). */
export const OFF_ROUTE_FAR_METERS = 120;
/** Fixes in a row needed before a reroute. */
export const OFF_ROUTE_FIXES = 3;
export const OFF_ROUTE_FAR_FIXES = 2;
/** Back within this distance resets the counter (hysteresis, so the edge does not flicker). */
export const ON_ROUTE_METERS = 40;
/** Never reroute more often than this. */
export const REROUTE_COOLDOWN_MS = 20000;
/** Fixes reported worse than this accuracy are ignored for off-route checks. */
export const MAX_FIX_ACCURACY_METERS = 75;

const EARTH = 6371000;

/** Meters from a point to segment a-b, using a local flat projection (fine at street scale). */
function segmentMeters(p: Point, a: LatLng, b: LatLng): { meters: number; t: number } {
  const lat0 = (p.latitude * Math.PI) / 180;
  const kx = (Math.PI / 180) * EARTH * Math.cos(lat0);
  const ky = (Math.PI / 180) * EARTH;
  const ax = (a[1] - p.longitude) * kx;
  const ay = (a[0] - p.latitude) * ky;
  const bx = (b[1] - p.longitude) * kx;
  const by = (b[0] - p.latitude) * ky;
  const dx = bx - ax;
  const dy = by - ay;
  const len2 = dx * dx + dy * dy;
  let t = len2 > 0 ? -(ax * dx + ay * dy) / len2 : 0;
  t = Math.max(0, Math.min(1, t));
  const cx = ax + t * dx;
  const cy = ay + t * dy;
  return { meters: Math.sqrt(cx * cx + cy * cy), t };
}

/**
 * Nearest distance from the point to the line, searching from `fromSegment` on
 * (a few segments back so a small GPS wobble does not fall off the window).
 */
export function distanceToLine(
  point: Point,
  line: LatLng[],
  fromSegment = 0,
): { meters: number; segment: number } {
  if (line.length === 0) return { meters: Number.POSITIVE_INFINITY, segment: 0 };
  if (line.length === 1) {
    return { meters: segmentMeters(point, line[0], line[0]).meters, segment: 0 };
  }
  const start = Math.max(0, Math.min(line.length - 2, fromSegment - 3));
  let best = Number.POSITIVE_INFINITY;
  let bestSeg = start;
  for (let i = start; i < line.length - 1; i += 1) {
    const { meters } = segmentMeters(point, line[i], line[i + 1]);
    if (meters < best) {
      best = meters;
      bestSeg = i;
    }
  }
  return { meters: best, segment: bestSeg };
}

export type OffRouteState = {
  misses: number;
  segment: number;
  lastRerouteAt: number;
  busy: boolean;
};

export function freshOffRouteState(): OffRouteState {
  return { misses: 0, segment: 0, lastRerouteAt: 0, busy: false };
}

/**
 * Feed one GPS fix. Returns true when the driver has been off the route long
 * enough to reroute now. Mutates `state`.
 */
export function offRouteFix(
  state: OffRouteState,
  point: Point,
  line: LatLng[],
  now: number,
  accuracy?: number,
): boolean {
  if (line.length < 2) return false;
  if (accuracy != null && Number.isFinite(accuracy) && accuracy > MAX_FIX_ACCURACY_METERS) return false;
  const { meters, segment } = distanceToLine(point, line, state.segment);
  if (meters <= ON_ROUTE_METERS) {
    state.misses = 0;
    state.segment = segment;
    return false;
  }
  if (meters <= OFF_ROUTE_METERS) return false; // in the hysteresis band: hold the count
  state.misses += 1;
  const needed = meters >= OFF_ROUTE_FAR_METERS ? OFF_ROUTE_FAR_FIXES : OFF_ROUTE_FIXES;
  if (state.misses < needed) return false;
  if (state.busy || now - state.lastRerouteAt < REROUTE_COOLDOWN_MS) return false;
  return true;
}
