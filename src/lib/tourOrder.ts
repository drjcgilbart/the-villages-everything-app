import { haversineMeters } from "./lightTourShared";
import { BEHIND_DEGREES, FORWARD_LIMIT_METERS, angleBetween, bearingDegrees, cleanHeading } from "./tourHeading";

type Point = { latitude: number; longitude: number };

/** Off the drawn line by this much, the remaining houses may be reordered. */
export const WAY_OFF_METERS = 200;

const MIN_SAVE_METERS = 400;

function pathMeters(from: Point, stops: Point[]): number {
  let total = 0;
  let cursor = from;
  for (const stop of stops) {
    total += haversineMeters(cursor, stop);
    cursor = stop;
  }
  return total;
}

function isBehind(here: Point, heading: number | null, stop: Point): boolean {
  if (heading == null) return false;
  return angleBetween(heading, bearingDegrees(here, stop)) > BEHIND_DEGREES;
}

/**
 * True when the driver is far enough off the current line, or the next house
 * is behind the car, that the remaining order should be reconsidered.
 */
export function wantsReorder(offMeters: number, here: Point, heading: number | null, next: Point | null): boolean {
  if (offMeters >= WAY_OFF_METERS) return true;
  return Boolean(next && isBehind(here, heading, next));
}

function stepCost(from: Point, heading: number | null, stop: Point): number {
  const dist = haversineMeters(from, stop);
  if (heading == null) return dist;
  const turn = angleBetween(heading, bearingDegrees(from, stop));
  if (turn > BEHIND_DEGREES) return dist + 8000;
  return dist * (1 + turn / 270);
}

/** Greedy order that keeps the car going forward when a forward house exists. */
function greedyForward<T extends Point>(here: Point, heading: number | null, stops: T[]): T[] {
  const left = stops.slice();
  const out: T[] = [];
  let from = here;
  let face = cleanHeading(heading);
  while (left.length) {
    let best = 0;
    let bestCost = Number.POSITIVE_INFINITY;
    for (let i = 0; i < left.length; i += 1) {
      const cost = stepCost(from, face, left[i]);
      if (cost < bestCost) {
        best = i;
        bestCost = cost;
      }
    }
    const pick = left.splice(best, 1)[0];
    out.push(pick);
    if (haversineMeters(from, pick) >= 8) face = bearingDegrees(from, pick);
    from = pick;
  }
  return out;
}

/**
 * Reorder the houses still ahead when a forward order is clearly shorter,
 * or when the planned next house is behind the car and another house is not.
 * Returns the same list when the current order should stay.
 */
export function reorderRemaining<T extends Point>(
  here: Point,
  heading: number | null,
  stops: T[],
): { stops: T[]; changed: boolean } {
  if (stops.length < 2) return { stops, changed: false };
  const next = greedyForward(here, heading, stops);
  const same = next.every((stop, index) => stop === stops[index]);
  if (same) return { stops, changed: false };
  const before = pathMeters(here, stops);
  const after = pathMeters(here, next);
  const saved = before - after;
  const escape =
    isBehind(here, heading, stops[0]) &&
    !isBehind(here, heading, next[0]) &&
    after <= before + FORWARD_LIMIT_METERS;
  const worth = saved >= MIN_SAVE_METERS || (before > 0 && saved / before >= 0.2);
  if (!escape && (!worth || after > before)) return { stops, changed: false };
  return { stops: next, changed: true };
}
