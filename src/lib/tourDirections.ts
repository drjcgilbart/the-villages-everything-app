import { haversineMeters } from "./lightTourShared";

export type DrivingStep = {
  type: string;
  modifier: string;
  name: string;
  latitude: number;
  longitude: number;
  /** Road distance from this maneuver to the next one. */
  meters: number;
};

type Point = { latitude: number; longitude: number };

const ANNOUNCE = new Set([
  "turn",
  "end of road",
  "roundabout",
  "rotary",
  "exit roundabout",
  "fork",
  "merge",
  "on ramp",
  "off ramp",
  "arrive",
]);

export type DirectionCue = {
  key: string;
  text: string;
  near: boolean;
  nearKey: string;
  nearText: string;
};

export function stepsFromPayload(value: unknown): DrivingStep[] {
  if (!Array.isArray(value)) return [];
  const steps: DrivingStep[] = [];
  for (const row of value) {
    if (!row || typeof row !== "object") continue;
    const step = row as Record<string, unknown>;
    const latitude = Number(step.latitude);
    const longitude = Number(step.longitude);
    const meters = Number(step.meters);
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) continue;
    steps.push({
      type: typeof step.type === "string" ? step.type : "continue",
      modifier: typeof step.modifier === "string" ? step.modifier : "",
      name: typeof step.name === "string" ? step.name : "",
      latitude,
      longitude,
      meters: Number.isFinite(meters) ? Math.max(0, meters) : 0,
    });
  }
  return steps;
}

function spokenDistance(meters: number): string {
  const feet = meters * 3.28084;
  if (feet < 1000) return `about ${Math.max(50, Math.round(feet / 50) * 50)} feet`;
  const miles = meters / 1609.34;
  if (miles < 0.4) return "about a quarter mile";
  if (miles < 0.75) return "about half a mile";
  if (miles < 1.4) return "about a mile";
  if (miles < 10) return `about ${miles.toFixed(1)} miles`;
  return `about ${Math.round(miles)} miles`;
}

function turnPhrase(modifier: string): string {
  switch (modifier) {
    case "left":
      return "Turn left";
    case "right":
      return "Turn right";
    case "slight left":
      return "Bear left";
    case "slight right":
      return "Bear right";
    case "sharp left":
      return "Make a sharp left";
    case "sharp right":
      return "Make a sharp right";
    case "uturn":
      return "Make a U-turn";
    case "straight":
      return "Continue straight";
    default:
      return modifier ? `Turn ${modifier}` : "Continue";
  }
}

export function phraseStep(step: DrivingStep, meters: number): string {
  const onto = step.name ? ` onto ${step.name}` : "";
  const along = step.name ? ` on ${step.name}` : "";
  const when = meters > 40 ? `In ${spokenDistance(meters)}, ` : "";
  switch (step.type) {
    case "arrive":
      return meters > 80
        ? `The house is ${spokenDistance(meters)} ahead.`
        : "The house is just ahead.";
    case "depart":
      return step.name ? `Head out on ${step.name}.` : "Head toward the next house.";
    case "roundabout":
    case "rotary":
    case "exit roundabout":
      return `${when}take the roundabout${along}.`;
    case "merge":
      return `${when}merge${along}.`;
    case "on ramp":
      return `${when}take the ramp${along}.`;
    case "off ramp":
      return `${when}take the exit${along}.`;
    case "fork":
      return `${when}${step.modifier ? `keep ${step.modifier}` : "stay on the route"}${along}.`;
    case "end of road":
    case "turn":
      return `${when}${turnPhrase(step.modifier)}${onto}.`;
    case "continue":
    case "new name":
      return step.name ? `Continue on ${step.name}.` : "Continue straight.";
    default:
      return step.name ? `${when}continue on ${step.name}.` : `${when}continue toward the next house.`;
  }
}

function compassPhrase(from: Point, to: Point): string {
  const rad = Math.PI / 180;
  const y = Math.sin((to.longitude - from.longitude) * rad) * Math.cos(to.latitude * rad);
  const x =
    Math.cos(from.latitude * rad) * Math.sin(to.latitude * rad) -
    Math.sin(from.latitude * rad) * Math.cos(to.latitude * rad) * Math.cos((to.longitude - from.longitude) * rad);
  const bearing = (Math.atan2(y, x) * 180) / Math.PI;
  const names = [
    "to the north",
    "to the northeast",
    "to the east",
    "to the southeast",
    "to the south",
    "to the southwest",
    "to the west",
    "to the northwest",
  ];
  const index = Math.round(((bearing + 360) % 360) / 45) % 8;
  return names[index];
}

function toXY(point: Point, lat0: number) {
  const rad = Math.PI / 180;
  return {
    x: point.longitude * rad * Math.cos(lat0 * rad) * 6371000,
    y: point.latitude * rad * 6371000,
  };
}

function distanceToSegment(point: Point, start: Point, end: Point) {
  const lat0 = (start.latitude + end.latitude) / 2;
  const p = toXY(point, lat0);
  const a = toXY(start, lat0);
  const b = toXY(end, lat0);
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len2 = dx * dx + dy * dy;
  let t = 0;
  if (len2 > 1) t = ((p.x - a.x) * dx + (p.y - a.y) * dy) / len2;
  t = Math.min(1, Math.max(0, t));
  return { meters: Math.hypot(p.x - (a.x + dx * t), p.y - (a.y + dy * t)), t };
}

export function nextCue(here: Point, steps: DrivingStep[], stopId: string): DirectionCue | null {
  if (!steps.length) return null;
  let best = 0;
  let bestD = Infinity;
  let bestT = 0;
  for (let i = 0; i < steps.length; i += 1) {
    const end = steps[i + 1] || steps[i];
    const along = distanceToSegment(here, steps[i], end);
    if (along.meters < bestD - 5 || (Math.abs(along.meters - bestD) <= 5 && i > best)) {
      best = i;
      bestD = along.meters;
      bestT = along.t;
    }
  }
  if (bestD > 120) return null;

  let remaining = (1 - bestT) * steps[best].meters;
  let index = best + 1 < steps.length ? best + 1 : best;
  if (index !== best) {
    while (index < steps.length - 1 && !ANNOUNCE.has(steps[index].type)) {
      remaining += steps[index].meters;
      index += 1;
    }
  }
  const step = steps[index];
  if (best === 0 && steps[0].type === "depart" && bestT < 0.2 && remaining > 400) {
    const text = phraseStep(steps[0], 0);
    return { key: `${stopId}:depart:${steps[0].name}`, text, near: false, nearKey: "", nearText: "" };
  }
  const text = phraseStep(step, remaining);
  const nearText = phraseStep(step, 20);
  const key = `${stopId}:${index}:${step.type}:${step.modifier}:${step.name}`;
  return {
    key,
    text,
    near: remaining < 180 && step.type !== "depart",
    nearKey: `${key}:close`,
    nearText,
  };
}

export function straightCue(here: Point, stop: Point & { id: string }): DirectionCue {
  const meters = haversineMeters(here, stop);
  const bucket = Math.round(meters / 800);
  const text = `The next house is ${spokenDistance(meters)} ${compassPhrase(here, stop)}.`;
  return {
    key: `straight:${stop.id}:${bucket}`,
    text,
    near: false,
    nearKey: "",
    nearText: "",
  };
}
