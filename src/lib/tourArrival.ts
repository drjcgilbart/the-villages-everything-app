/**
 * Arrival and approach detection for live Holiday Lights navigation.
 * Pure state machine fed one GPS fix at a time, shared by the tour and the
 * admin "Go to pin" navigation so both arrive the same way.
 */
import { haversineMeters } from "./lightTourShared";

type Point = { latitude: number; longitude: number };

/** Straight-line distance to the pin that counts as being at the house. */
export const ARRIVAL_METERS = 20;
/** A fix must report accuracy this good (or better) to count at ARRIVAL_METERS. */
export const ARRIVAL_ACCURACY_METERS = 25;
/** Looser fixes still count when distance plus reported accuracy fits inside this. */
export const ARRIVAL_WORST_CASE_METERS = 35;
/** Fixes in a row that must qualify before arrival is announced. */
export const ARRIVAL_FIXES = 2;
/** "Stop N is just ahead" heads-up distance. */
export const APPROACH_METERS = 100;
/** Approach needs at least this accuracy so a wild fix does not trigger it. */
export const APPROACH_ACCURACY_METERS = 50;
/** Pass-by: got this close, then moved away on consecutive fixes. */
export const PASS_BY_NEAR_METERS = 40;
export const PASS_BY_FIXES = 2;
/** Ignore fixes worse than this for everything. */
export const MAX_USABLE_ACCURACY_METERS = 75;

export type ArrivalState = {
  stopId: string;
  hits: number;
  closest: number;
  last: number;
  receding: number;
  approached: boolean;
  arrived: boolean;
};

export function freshArrivalState(stopId = ""): ArrivalState {
  return {
    stopId,
    hits: 0,
    closest: Number.POSITIVE_INFINITY,
    last: Number.POSITIVE_INFINITY,
    receding: 0,
    approached: false,
    arrived: false,
  };
}

export type ArrivalEvent = "none" | "approach" | "arrive";

function usableAccuracy(accuracy?: number): number | null {
  return accuracy != null && Number.isFinite(accuracy) && accuracy >= 0 ? accuracy : null;
}

/** True when this single fix places the driver at the pin. */
export function fixAtPin(meters: number, accuracy?: number): boolean {
  const acc = usableAccuracy(accuracy);
  if (acc == null) return meters <= ARRIVAL_METERS; // older app builds send no accuracy
  if (acc <= ARRIVAL_ACCURACY_METERS) return meters <= ARRIVAL_METERS;
  return meters + acc <= ARRIVAL_WORST_CASE_METERS;
}

/**
 * Feed one fix for the active stop. Mutates `state` and returns at most one
 * event per call. Resets itself when the stop changes.
 */
export function arrivalFix(
  state: ArrivalState,
  stop: Point & { id: string },
  here: Point,
  accuracy?: number,
): ArrivalEvent {
  if (state.stopId !== stop.id) Object.assign(state, freshArrivalState(stop.id));
  if (state.arrived) return "none";
  const acc = usableAccuracy(accuracy);
  if (acc != null && acc > MAX_USABLE_ACCURACY_METERS) return "none";
  const meters = haversineMeters(here, stop);

  state.hits = fixAtPin(meters, accuracy) ? state.hits + 1 : 0;

  // Pass-by: came near, then the distance grew on consecutive fixes.
  if (meters > state.last + 3) state.receding += 1;
  else if (meters < state.last - 3) state.receding = 0;
  state.last = meters;
  if (meters < state.closest) state.closest = meters;
  const passed = state.closest <= PASS_BY_NEAR_METERS && state.receding >= PASS_BY_FIXES;

  if (state.hits >= ARRIVAL_FIXES || passed) {
    state.arrived = true;
    state.approached = true;
    return "arrive";
  }
  if (!state.approached && meters <= APPROACH_METERS && (acc == null || acc <= APPROACH_ACCURACY_METERS)) {
    state.approached = true;
    return "approach";
  }
  return "none";
}
