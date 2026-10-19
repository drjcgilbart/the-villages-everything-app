import { haversineMeters } from "./lightTourShared";
import type { DrivingStep } from "./tourDirections";
import {
  bearingDegrees,
  chooseForwardRoute,
  cleanHeading,
  type RouteChoice,
} from "./tourHeading";

type Point = { latitude: number; longitude: number };

type OsrmStep = {
  distance?: number;
  name?: string;
  maneuver?: { type?: string; modifier?: string; location?: [number, number] };
};

export type DrivingChoice = {
  line: [number, number][];
  legs: { meters: number; seconds: number }[];
  steps: DrivingStep[];
  turnAround: boolean;
  fallback: boolean;
};

type Fetched = RouteChoice & {
  line: [number, number][];
  legs: { meters: number; seconds: number }[];
  steps: DrivingStep[];
};

function straight(points: Point[]): DrivingChoice {
  return {
    line: points.map((point) => [point.latitude, point.longitude] as [number, number]),
    legs: points.slice(1).map((point, index) => ({
      meters: Math.round(haversineMeters(points[index], point)),
      seconds: Math.round(haversineMeters(points[index], point) / 13),
    })),
    steps: [],
    turnAround: false,
    fallback: true,
  };
}

/** Bearing of the first real movement along the drawn line. */
export function departureBearing(line: [number, number][]): number | null {
  if (line.length < 2) return null;
  const start = { latitude: line[0][0], longitude: line[0][1] };
  for (let i = 1; i < line.length; i += 1) {
    const point = { latitude: line[i][0], longitude: line[i][1] };
    if (haversineMeters(start, point) >= 18) return bearingDegrees(start, point);
  }
  const end = line[line.length - 1];
  const point = { latitude: end[0], longitude: end[1] };
  if (haversineMeters(start, point) < 5) return null;
  return bearingDegrees(start, point);
}

function parseSteps(raw: OsrmStep[]): DrivingStep[] {
  const steps: DrivingStep[] = [];
  for (const step of raw) {
    const loc = step.maneuver?.location;
    if (!loc || loc.length < 2) continue;
    const latitude = loc[1];
    const longitude = loc[0];
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) continue;
    steps.push({
      type: step.maneuver?.type || "continue",
      modifier: step.maneuver?.modifier || "",
      name: step.name || "",
      latitude,
      longitude,
      meters: Math.round(step.distance || 0),
    });
    if (steps.length >= 40) break;
  }
  return steps;
}

function startsWithUturn(steps: DrivingStep[]): boolean {
  return steps.slice(0, 3).some((step) => step.modifier === "uturn" || step.type === "uturn");
}

async function osrmDrive(points: Point[], heading: number | null): Promise<Fetched | null> {
  const path = points.map((point) => `${point.longitude},${point.latitude}`).join(";");
  const bearings =
    heading == null
      ? ""
      : `&bearings=${encodeURIComponent([`${Math.round(heading)},100`, ...points.slice(1).map(() => "")].join(";"))}`;
  const url = `https://router.project-osrm.org/route/v1/driving/${path}?overview=full&geometries=geojson&steps=true${bearings}`;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(12000) });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      code?: string;
      routes?: {
        geometry?: { coordinates?: [number, number][] };
        legs?: { distance?: number; duration?: number; steps?: OsrmStep[] }[];
      }[];
    };
    const route = data.routes?.[0];
    if (data.code !== "Ok" || !route?.geometry?.coordinates?.length) return null;
    const line = route.geometry.coordinates.map(([lon, lat]) => [lat, lon] as [number, number]);
    const legs = (route.legs || []).map((leg) => ({
      meters: Math.round(leg.distance || 0),
      seconds: Math.round(leg.duration || 0),
    }));
    const steps = parseSteps((route.legs || []).flatMap((leg) => leg.steps || []));
    return {
      meters: legs[0]?.meters ?? 0,
      departure: departureBearing(line),
      uturn: startsWithUturn(steps),
      line,
      legs,
      steps,
    };
  } catch {
    return null;
  }
}

/**
 * Driving line and turn list from where the vehicle is, through the stops.
 * The road that continues forward wins unless that way back is over a mile.
 */
export async function drivingChoice(points: Point[], heading: number | null): Promise<DrivingChoice> {
  if (points.length < 2) return straight(points);
  const face = cleanHeading(heading);
  const open = await osrmDrive(points, null);
  if (!open) return straight(points);
  // The shortest road already leaves forward, or we do not know which way the vehicle faces.
  if (!chooseForwardRoute(face, null, open)?.turnAround) {
    return { line: open.line, legs: open.legs, steps: open.steps, turnAround: false, fallback: false };
  }
  const forward = await osrmDrive(points, face);
  const useForward = chooseForwardRoute(face, forward, open)?.pick === "forward" && forward;
  const pick = useForward ? forward : open;
  return {
    line: pick.line,
    legs: pick.legs,
    steps: pick.steps,
    turnAround: !useForward,
    fallback: false,
  };
}
