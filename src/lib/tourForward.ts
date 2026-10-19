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

function pointAlong(
  from: { latitude: number; longitude: number },
  to: { latitude: number; longitude: number },
  t: number,
) {
  return {
    latitude: from.latitude + (to.latitude - from.latitude) * t,
    longitude: from.longitude + (to.longitude - from.longitude) * t,
  };
}

/**
 * Bearing of the road once the route has left the driveway snap.
 * The first few meters often point back to the street the car is already on.
 */
export function departureBearing(line: [number, number][]): number | null {
  if (line.length < 2) return null;
  const points = line.map(([latitude, longitude]) => ({ latitude, longitude }));
  const skip = 22;
  const sample = 40;
  let walked = 0;
  let origin: { latitude: number; longitude: number } | null = null;
  for (let i = 1; i < points.length; i += 1) {
    const step = haversineMeters(points[i - 1], points[i]);
    if (step <= 0) continue;
    const nextWalk = walked + step;
    if (!origin && nextWalk >= skip) origin = pointAlong(points[i - 1], points[i], (skip - walked) / step);
    if (origin && nextWalk >= skip + sample) {
      const end = pointAlong(points[i - 1], points[i], Math.min(1, (skip + sample - walked) / step));
      if (haversineMeters(origin, end) >= 12) return bearingDegrees(origin, end);
    }
    walked = nextWalk;
  }
  const end = points[points.length - 1];
  if (origin && haversineMeters(origin, end) >= 12) return bearingDegrees(origin, end);
  if (haversineMeters(points[0], end) >= 12) return bearingDegrees(points[0], end);
  return null;
}

/** Drop a snap that the router labeled as a U-turn when the road itself continues forward. */
function withoutFalseUturn(steps: DrivingStep[], turnAround: boolean): DrivingStep[] {
  if (turnAround) return steps;
  let index = 0;
  while (index < steps.length && index < 2 && (steps[index].type === "uturn" || steps[index].modifier === "uturn")) {
    index += 1;
  }
  return index ? steps.slice(index) : steps;
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
 * The road that continues forward wins unless that detour adds more than a mile.
 */
export async function drivingChoice(points: Point[], heading: number | null): Promise<DrivingChoice> {
  if (points.length < 2) return straight(points);
  const face = cleanHeading(heading);
  const open = await osrmDrive(points, null);
  if (!open) return straight(points);
  // The shortest road already leaves forward, or we do not know which way the vehicle faces.
  if (!chooseForwardRoute(face, null, open)?.turnAround) {
    return {
      line: open.line,
      legs: open.legs,
      steps: withoutFalseUturn(open.steps, false),
      turnAround: false,
      fallback: false,
    };
  }
  const forward = await osrmDrive(points, face);
  const useForward = chooseForwardRoute(face, forward, open)?.pick === "forward" && forward;
  const pick = useForward ? forward : open;
  const turnAround = !useForward;
  return {
    line: pick.line,
    legs: pick.legs,
    steps: withoutFalseUturn(pick.steps, turnAround),
    turnAround,
    fallback: false,
  };
}
