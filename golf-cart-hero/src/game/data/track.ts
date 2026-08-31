import { getDriveArea, type AreaId } from "./areas";
import { LANDMARKS } from "./landmarks";

export type Vec2 = { x: number; y: number; elev?: number };

/** Wider multi-lane boulevard (Mario Kart reference scale) */
export const ROAD_HALF_WIDTH = 8.5;
/** Painted curb strip outside asphalt */
export const CURB_WIDTH = 1.1;
/** Sidewalk outside curb */
export const SIDEWALK_WIDTH = 2.4;
/** Keep props/buildings outside asphalt + curb + sidewalk + buffer */
export const ROAD_CLEAR_BUILDING = ROAD_HALF_WIDTH + CURB_WIDTH + SIDEWALK_WIDTH + 10;
export const ROAD_CLEAR_PROP = ROAD_HALF_WIDTH + CURB_WIDTH + SIDEWALK_WIDTH + 0.8;
export const ROAD_CLEAR_TREE = ROAD_HALF_WIDTH + CURB_WIDTH + SIDEWALK_WIDTH + 2.2;
export const LAPS_TO_WIN = 3;
/**
 * Peak height of the cart-path on the overpass (world units above ground).
 * Kept modest so the approach isn't a ski-jump; the lattice sits much higher
 * in world3d so there's clear air between road and overpass.
 */
export const BRIDGE_PEAK_ELEV = 7.2;

export type RoadSample = {
  x: number;
  y: number;
  angle: number;
  dist: number;
  segment: number;
  /** Height above ground (0 = flat, higher on overpasses) */
  elev: number;
};

/** Villages-style multi-modal overpass sites along the active track */
export type BridgeSite = {
  x: number;
  y: number;
  /** Heading of the cart path on the bridge */
  angle: number;
  /** Distance along track to bridge center */
  dist: number;
  peakElev: number;
  /** Half-length of elevated span along the path */
  halfSpan: number;
};

/** Traffic circle / roundabout island on the active track */
export type RoundaboutSite = {
  x: number;
  y: number;
  /** Outer path radius (road centerline) */
  radius: number;
  /** Landscaped island radius (inside the road ring) */
  islandRadius: number;
};

/**
 * Gated-community style barrier along the cart path.
 * Arm raises so carts drive under / through — classic Villages flavor.
 */
export type GateSite = {
  x: number;
  y: number;
  angle: number;
  /** Distance along track */
  dist: number;
  /** Phase offset (seconds) — unused for auto-open; kept for layout variety */
  phase: number;
  /** Short label on the pillar plaque */
  label: string;
  /** 0 = down/blocking · 1 = raised/open. Only rises after a gate-pass wave. */
  open: number;
  /** Seconds to stay commanded open after a successful wave. */
  hold: number;
};

function dist(a: Vec2, b: Vec2) {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Live track waypoints for the current race.
 * Replaced every race via `generateAndActivateTrack()`.
 */
export let TRACK_WAYPOINTS: Vec2[] = [];
/** Overpass sites for the active track (under-road + elevated cart path). */
export let TRACK_BRIDGES: BridgeSite[] = [];
/** Roundabout islands for the active track. */
export let TRACK_ROUNDABOUTS: RoundaboutSite[] = [];
/** Community gate barriers for the active track. */
export let TRACK_GATES: GateSite[] = [];

/** How fast a waved gate rises / drops. */
export const GATE_RAISE_SEC = 0.42;
export const GATE_LOWER_SEC = 0.9;
export const GATE_HOLD_SEC = 4.4;
/** How close you must be (and facing) to tap the post with a pass. */
export const GATE_WAVE_RANGE = 13;
export const GATE_OPEN_BLOCK = 0.55;

/** 0 = fully down/blocking · 1 = fully raised/open */
export function gateOpenAmount(site: GateSite): number {
  return site.open ?? 0;
}

/** Absolute heading delta, wrapped to [-π, π]. */
function headingDelta(from: number, to: number): number {
  let d = to - from;
  while (d > Math.PI) d -= Math.PI * 2;
  while (d < -Math.PI) d += Math.PI * 2;
  return d;
}

function pointHeading(a: Vec2, b: Vec2): number {
  return Math.atan2(b.y - a.y, b.x - a.x);
}

/**
 * Resample a closed polyline at roughly equal arc-length spacing.
 */
function resampleClosed(pts: Vec2[], spacing: number): Vec2[] {
  if (pts.length < 3) return pts.map((p) => ({ ...p }));
  const n = pts.length;
  const segLens: number[] = [];
  let total = 0;
  for (let i = 0; i < n; i++) {
    const len = dist(pts[i], pts[(i + 1) % n]);
    segLens.push(len);
    total += len;
  }
  if (total < spacing * 4) return pts.map((p) => ({ ...p }));

  const out: Vec2[] = [];
  const count = Math.max(48, Math.round(total / spacing));
  const step = total / count;
  let seg = 0;
  let along = 0;
  let target = 0;

  for (let k = 0; k < count; k++) {
    target = k * step;
    while (along + segLens[seg] < target - 1e-9) {
      along += segLens[seg];
      seg = (seg + 1) % n;
    }
    const local = target - along;
    const t = segLens[seg] > 1e-9 ? local / segLens[seg] : 0;
    const a = pts[seg];
    const b = pts[(seg + 1) % n];
    out.push({
      x: a.x + (b.x - a.x) * t,
      y: a.y + (b.y - a.y) * t,
    });
  }
  return out;
}

/**
 * Cumulative heading change over a window of samples (degrees).
 * Used to find the gentlest stretch for start/finish.
 */
function windowTurnCost(pts: Vec2[], i: number, window: number): number {
  const n = pts.length;
  let cost = 0;
  for (let k = 0; k < window; k++) {
    const a = pts[(i + k - 1 + n) % n];
    const b = pts[(i + k) % n];
    const c = pts[(i + k + 1) % n];
    cost += Math.abs(headingDelta(pointHeading(a, b), pointHeading(b, c)));
  }
  return cost;
}

function windowNearRoundabout(
  pts: Vec2[],
  i: number,
  window: number,
  extra: number,
): boolean {
  const n = pts.length;
  for (let k = 0; k < window; k++) {
    const p = pts[(i + k) % n];
    if (onRoundabout(p.x, p.y, extra)) return true;
  }
  return false;
}

function straightestStartIndex(pts: Vec2[], window = 18): number {
  const n = pts.length;
  if (n < window + 2) return 0;
  // Keep the banner, flags, and first few spawn samples off the circulating road.
  const pad = ROAD_HALF_WIDTH + 24;
  let bestClearI = -1;
  let bestClearCost = Infinity;
  let bestAnyI = 0;
  let bestAnyCost = Infinity;
  for (let i = 0; i < n; i++) {
    const cost = windowTurnCost(pts, i, window);
    if (cost < bestAnyCost) {
      bestAnyCost = cost;
      bestAnyI = i;
    }
    if (windowNearRoundabout(pts, i, window, pad)) continue;
    if (cost < bestClearCost) {
      bestClearCost = cost;
      bestClearI = i;
    }
  }
  const bestI = bestClearI >= 0 ? bestClearI : bestAnyI;
  // A couple of samples into the straight — still inside the scored window.
  const offset = bestClearI >= 0 ? Math.min(3, Math.floor(window / 5)) : 0;
  return (bestI + offset) % n;
}

/** If index 0 still sits on a circle, rotate until the start is on open path. */
function rotateStartOffRoundabouts(path: Vec2[]): Vec2[] {
  if (!path.length) return path;
  const pad = ROAD_HALF_WIDTH + 22;
  if (!onRoundabout(path[0].x, path[0].y, pad)) return path;
  for (let i = 1; i < path.length; i++) {
    if (!onRoundabout(path[i].x, path[i].y, pad)) {
      return [...path.slice(i), ...path.slice(0, i)];
    }
  }
  return path;
}

/**
 * Hard ceiling for any single vertex turn (degrees). Must stay under 90 forever.
 * We use 85° so road ribbon + sampling still read as “under 90.”
 */
export const MAX_TURN_DEG = 85;

/**
 * Absolute heading change (degrees) at every polyline vertex.
 * This is the true exterior turn the cart experiences at that corner.
 */
export function maxSampleTurnDeg(pts: Vec2[]): number {
  let max = 0;
  const n = pts.length;
  for (let i = 0; i < n; i++) {
    const t = Math.abs(vertexTurnRad(pts, i));
    if (t > max) max = t;
  }
  return (max * 180) / Math.PI;
}

function vertexTurnRad(pts: Vec2[], i: number): number {
  const n = pts.length;
  const a = pts[(i - 1 + n) % n];
  const b = pts[i];
  const c = pts[(i + 1) % n];
  return headingDelta(pointHeading(a, b), pointHeading(b, c));
}

/**
 * Build exterior turn angles (degrees) that sum to 360°, each in [minDeg, maxDeg].
 * Used for a convex CCW loop — each value is one corner's turn, never ≥ 90°.
 */
function randomExteriorAngles(
  n: number,
  minDeg: number,
  maxDeg: number,
  rng: () => number
): number[] {
  // Keep max strictly under 90
  const hardMax = Math.min(maxDeg, MAX_TURN_DEG);
  const hardMin = Math.min(minDeg, hardMax - 1);
  let angles = Array.from({ length: n }, () => hardMin + rng() * (hardMax - hardMin));
  for (let iter = 0; iter < 60; iter++) {
    const sum = angles.reduce((a, b) => a + b, 0) || 1;
    angles = angles.map((a) => (a / sum) * 360);
    let clipped = false;
    angles = angles.map((a) => {
      if (a < hardMin) {
        clipped = true;
        return hardMin;
      }
      if (a > hardMax) {
        clipped = true;
        return hardMax;
      }
      return a;
    });
    if (!clipped) {
      const s2 = angles.reduce((a, b) => a + b, 0);
      const diff = 360 - s2;
      if (Math.abs(diff) < 0.05) break;
      // Spread residual across all angles so none exceeds hardMax
      const adj = diff / n;
      angles = angles.map((a) => Math.min(hardMax, Math.max(hardMin, a + adj)));
    }
  }
  // Final clamp + re-normalize with soft projection
  angles = angles.map((a) => Math.min(hardMax, Math.max(hardMin, a)));
  const sum = angles.reduce((a, b) => a + b, 0) || 1;
  angles = angles.map((a) => (a / sum) * 360);
  // If normalize pushed any over hardMax, clip and accept slight sum error (rare)
  return angles.map((a) => Math.min(hardMax, Math.max(hardMin, a)));
}

/**
 * Place a closed convex control polygon on a (slightly squashed) ring.
 * Central angles = exteriorDeg (sum 360°, each ≤ MAX_TURN_DEG).
 * Always closes. Mild radius / aspect variation keeps it non-circular without
 * creating reflex corners.
 */
function placeConvexRing(
  exteriorDeg: number[],
  baseR: number,
  rot0: number,
  aspectY: number,
  rng: () => number
): Vec2[] {
  const n = exteriorDeg.length;
  const verts: Vec2[] = [];
  let ang = rot0;
  for (let i = 0; i < n; i++) {
    // Very mild radius wobble only — large wobble creates concave hooks
    const r = baseR * (0.94 + rng() * 0.12);
    verts.push({
      x: Math.cos(ang) * r,
      y: Math.sin(ang) * r * aspectY,
    });
    ang += (exteriorDeg[i] * Math.PI) / 180;
  }
  return verts;
}

/** Chaikin corner-cutting (closed). Softens corners while staying under the same max turn. */
function chaikinClosed(pts: Vec2[], rounds: number): Vec2[] {
  let cur = pts.map((p) => ({ ...p }));
  for (let r = 0; r < rounds; r++) {
    const n = cur.length;
    const next: Vec2[] = [];
    for (let i = 0; i < n; i++) {
      const a = cur[i];
      const b = cur[(i + 1) % n];
      next.push({
        x: a.x * 0.75 + b.x * 0.25,
        y: a.y * 0.75 + b.y * 0.25,
      });
      next.push({
        x: a.x * 0.25 + b.x * 0.75,
        y: a.y * 0.25 + b.y * 0.75,
      });
    }
    cur = next;
  }
  return cur;
}

/**
 * If any vertex still turns harder than maxDeg, replace it with a short circular
 * fillet so every micro-step is ≤ maxDeg. Guarantees the invariant.
 */
function enforceMaxTurnHard(pts: Vec2[], maxDeg: number): Vec2[] {
  const maxTurn = (maxDeg * Math.PI) / 180;
  let points: Vec2[] = pts.map((p) => ({ x: p.x, y: p.y, elev: p.elev }));

  for (let guard = 0; guard < 40; guard++) {
    const n = points.length;
    if (n < 4) break;
    let changed = false;
    const out: Vec2[] = [];

    for (let i = 0; i < n; i++) {
      const p0 = points[(i - 1 + n) % n];
      const p1 = points[i];
      const p2 = points[(i + 1) % n];
      const turn = headingDelta(pointHeading(p0, p1), pointHeading(p1, p2));
      const absTurn = Math.abs(turn);

      if (absTurn <= maxTurn + 1e-4) {
        out.push({ ...p1 });
        continue;
      }

      // Fillet: insert arc points between enter/leave, skip the sharp vertex
      changed = true;
      const d01 = dist(p0, p1);
      const d12 = dist(p1, p2);
      const half = absTurn / 2;
      const tanHalf = Math.tan(Math.min(half, Math.PI / 2 - 0.05));
      const trim = Math.min(d01 * 0.45, d12 * 0.45, 18, 12 * tanHalf + 2);
      const hIn = pointHeading(p0, p1);
      const hOut = pointHeading(p1, p2);
      const enter: Vec2 = {
        x: p1.x - Math.cos(hIn) * trim,
        y: p1.y - Math.sin(hIn) * trim,
      };
      const leave: Vec2 = {
        x: p1.x + Math.cos(hOut) * trim,
        y: p1.y + Math.sin(hOut) * trim,
      };

      // Number of steps so each step turn ≤ maxTurn
      const steps = Math.max(2, Math.ceil(absTurn / maxTurn));
      for (let s = 0; s <= steps; s++) {
        const t = s / steps;
        // Quadratic Bezier enter → p1 → leave, but pull control toward chord
        // so the curve is rounder than the original corner
        const ctrl = {
          x: p1.x * 0.55 + (enter.x + leave.x) * 0.225,
          y: p1.y * 0.55 + (enter.y + leave.y) * 0.225,
        };
        const u = 1 - t;
        out.push({
          x: u * u * enter.x + 2 * u * t * ctrl.x + t * t * leave.x,
          y: u * u * enter.y + 2 * u * t * ctrl.y + t * t * leave.y,
        });
      }
    }

    // Light smooth only on new points
    const m = out.length;
    const soft: Vec2[] = [];
    for (let i = 0; i < m; i++) {
      const prev = out[(i - 1 + m) % m];
      const cur = out[i];
      const next = out[(i + 1) % m];
      soft.push({
        x: prev.x * 0.15 + cur.x * 0.7 + next.x * 0.15,
        y: prev.y * 0.15 + cur.y * 0.7 + next.y * 0.15,
        elev: cur.elev,
      });
    }
    points = soft;
    if (!changed) break;
  }

  // Absolute last resort: if still over, keep subdividing midpoints
  for (let guard = 0; guard < 25; guard++) {
    const n = points.length;
    let fixed = false;
    const out: Vec2[] = [];
    for (let i = 0; i < n; i++) {
      const p1 = points[i];
      const p2 = points[(i + 1) % n];
      out.push(p1);
      const turn = Math.abs(vertexTurnRad(points, i));
      if (turn > maxTurn) {
        fixed = true;
        out.push({
          x: (p1.x + p2.x) * 0.5,
          y: (p1.y + p2.y) * 0.5,
        });
      }
    }
    points = out;
    if (!fixed) break;
  }

  return dedupePath(points, 1.1);
}

/**
 * Long technical cart-path loop around a Town Square.
 *
 * INVARIANT: every vertex turn is in (0°, MAX_TURN_DEG] with MAX_TURN_DEG < 90°.
 * Built as a convex walk (variable side lengths) → Chaikin smooth → resample → hard enforce.
 */
export function generateAreaTrack(areaId: AreaId, seed = Date.now()): Vec2[] {
  const rng = mulberry32(seed >>> 0);
  const area = getDriveArea(areaId);

  const square = LANDMARKS.find((l) => l.id === area.squareLandmarkId);
  const cx = square?.x ?? 0;
  const cy = square?.y ?? 0;

  // Many corners for a longer technical loop; each central/exterior 14–38° (all < 90°)
  const nCorners = 14 + Math.floor(rng() * 6); // 14–19 corners
  const exterior = randomExteriorAngles(nCorners, 14, 38, rng);

  // Larger radius → longer laps; mild aspect squash for non-circle shape
  const baseR = 175 + rng() * 55;
  const aspectY = 0.82 + rng() * 0.28; // 0.82–1.10
  const rot0 = rng() * Math.PI * 2;

  let verts = placeConvexRing(exterior, baseR, rot0, aspectY, rng);

  // Center on the town square
  let ax = 0;
  let ay = 0;
  for (const v of verts) {
    ax += v.x;
    ay += v.y;
  }
  ax /= verts.length;
  ay /= verts.length;
  for (const v of verts) {
    v.x = cx + (v.x - ax);
    v.y = cy + (v.y - ay);
  }

  // Stretch some edges by pushing every 3rd vertex slightly outward (keeps convex
  // if the push is small) for longer “straight” runs between corners
  for (let i = 0; i < verts.length; i++) {
    if (i % 3 !== 0) continue;
    const dx = verts[i].x - cx;
    const dy = verts[i].y - cy;
    const len = Math.hypot(dx, dy) || 1;
    const boost = 1 + 0.08 + rng() * 0.14; // up to ~22% farther out
    verts[i] = {
      x: cx + (dx / len) * len * boost,
      y: cy + (dy / len) * len * boost,
    };
  }

  // Chaikin softens corners (turns only get milder on a convex shape)
  let path = chaikinClosed(verts, 2);
  path = chaikinClosed(path, 1);

  // Dense even spacing for the road ribbon
  path = resampleClosed(path, 5);
  path = dedupePath(path, 1.2);

  // HARD guarantee: no vertex turn over MAX_TURN_DEG
  path = enforceMaxTurnHard(path, MAX_TURN_DEG);
  path = resampleClosed(path, 5);
  path = enforceMaxTurnHard(path, MAX_TURN_DEG);

  // Several Villages traffic circles on every loop
  const roundaboutCount = 3 + Math.floor(rng() * 3); // 3–5
  path = insertRoundabouts(path, roundaboutCount, rng);

  path = enforceMaxTurnHard(path, MAX_TURN_DEG);
  path = resampleClosed(path, 5);
  path = enforceMaxTurnHard(path, MAX_TURN_DEG);

  // Safety assert — if anything slipped through, fall back to a gentle regular loop
  if (maxSampleTurnDeg(path) > 90) {
    console.warn("[track] turn > 90° detected; regenerating safe regular loop");
    path = buildSafeRegularLoop(cx, cy, 170 + rng() * 30, 16);
    path = enforceMaxTurnHard(path, MAX_TURN_DEG);
    TRACK_ROUNDABOUTS = [];
    path = insertRoundabouts(path, 3, rng);
    path = enforceMaxTurnHard(path, MAX_TURN_DEG);
  }

  const startI = straightestStartIndex(path, 14);
  if (startI > 0) {
    path = [...path.slice(startI), ...path.slice(0, startI)];
  }
  // Re-check after rotate (should be identical turns)
  path = enforceMaxTurnHard(path, MAX_TURN_DEG);
  path = rotateStartOffRoundabouts(path);

  applyBridgeElevations(path, rng);
  placeCommunityGates(path, rng);
  return path;
}

/**
 * Splice Villages-style roundabouts into the closed path.
 * Each one is a near-full circular detour with a landscaped island center.
 */
function insertRoundabouts(
  path: Vec2[],
  count: number,
  rng: () => number
): Vec2[] {
  TRACK_ROUNDABOUTS = [];
  const n0 = path.length;
  if (n0 < 60 || count < 1) return path;

  // Candidate indices evenly around the loop, away from start (index 0)
  const margin = Math.max(8, Math.floor(n0 * 0.06));
  const usable = n0 - margin * 2;
  if (usable < count * 10) return path;

  const targets: number[] = [];
  for (let k = 0; k < count; k++) {
    const base = margin + Math.floor(((k + 0.5) / count) * usable);
    const jitter = Math.floor((rng() - 0.5) * (usable / count) * 0.35);
    targets.push(Math.max(margin, Math.min(n0 - margin - 1, base + jitter)));
  }
  // Insert back-to-front so earlier indices stay valid
  targets.sort((a, b) => b - a);

  let pts: Vec2[] = path.map((p) => ({ x: p.x, y: p.y, elev: p.elev }));
  for (const idx of targets) {
    // Skip if too close to an already-placed roundabout (after previous splices indices shift —
    // check by spatial distance to sites)
    const pCheck = pts[Math.min(idx, pts.length - 1)];
    if (
      TRACK_ROUNDABOUTS.some(
        (r) => Math.hypot(r.x - pCheck.x, r.y - pCheck.y) < r.radius * 3.2
      )
    ) {
      continue;
    }
    const radius = 18 + rng() * 10; // 18–28 road radius
    const result = spliceRoundabout(pts, idx, radius, rng);
    pts = result.path;
    TRACK_ROUNDABOUTS.push(result.site);
  }

  return pts;
}

/**
 * Replace a short chord of the path with a circular arc around a traffic island.
 * Center sits ON the original road centerline so the circle is equal left/right.
 * Sweep is ~270–340° so carts drive most of the way around before continuing.
 */
function spliceRoundabout(
  path: Vec2[],
  atIndex: number,
  radius: number,
  rng: () => number
): { path: Vec2[]; site: RoundaboutSite } {
  const n = path.length;
  const i = ((atIndex % n) + n) % n;
  const p = path[i];
  const prev = path[(i - 3 + n) % n];
  const next = path[(i + 3) % n];
  const heading = pointHeading(prev, next);

  // Center of the roundabout = road centerline (equal left / right of the path)
  const cx = p.x;
  const cy = p.y;

  // CCW circle: at angle θ the outward radial is (cos θ, sin θ).
  // Tangent for CCW travel is θ + π/2. Match that to approach heading at entry.
  const entryAng = heading - Math.PI / 2;
  // Nearly full circle — classic roundabout tour — keep turns gentle via dense samples
  const sweep = Math.PI * 2 * (0.78 + rng() * 0.14); // ~281–331°
  const steps = Math.max(22, Math.ceil((sweep * radius) / 4.2));
  const circle: Vec2[] = [];
  for (let s = 0; s <= steps; s++) {
    const t = s / steps;
    const ang = entryAng + sweep * t; // CCW around island
    circle.push({
      x: cx + Math.cos(ang) * radius,
      y: cy + Math.sin(ang) * radius,
    });
  }

  // Drop original path points that sit inside / on the circle so we don't
  // leave a chord through the island (center is on the old centerline).
  const keepOutside = (q: Vec2) => Math.hypot(q.x - cx, q.y - cy) > radius * 0.92;
  const out: Vec2[] = [];
  for (let j = 0; j < i; j++) {
    if (keepOutside(path[j])) out.push({ ...path[j] });
  }
  for (const c of circle) out.push(c);
  for (let j = i; j < n; j++) {
    if (keepOutside(path[j])) out.push({ ...path[j] });
  }

  // If too aggressive, fall back to original path
  if (out.length < 24) {
    return {
      path,
      site: { x: cx, y: cy, radius, islandRadius: radius * 0.48 },
    };
  }

  return {
    path: out,
    site: {
      x: cx,
      y: cy,
      radius,
      islandRadius: radius * (0.42 + rng() * 0.08),
    },
  };
}

/** Must appear on a community gate in every race. */
export const EDENFIELD_GATE_NAME = "Edenfield Verandas West";

/**
 * Real neighborhood villages in The Villages, Florida
 * (districtgov.org residential districts + Inside the Bubble neighborhood list).
 */
const VILLAGE_GATE_NAMES = [
  "Country Club",
  "Mira Mesa",
  "Del Mar",
  "Valle Verde",
  "Orange Blossom Gardens",
  "El Cortez",
  "La Reynalda",
  "Silver Lake",
  "La Zamora",
  "Hacienda",
  "Pine Ridge",
  "Pine Hills",
  "De Allende",
  "De La Vista",
  "Palo Alto",
  "Rio Grande",
  "Rio Ponderosa",
  "Rio Ranchero",
  "Tierra Del Sol",
  "Alhambra",
  "Santiago",
  "Santo Domingo",
  "Belle Aire",
  "Glenbrook",
  "Polo Ridge",
  "Summerhill",
  "Briar Meadow",
  "Piedmont",
  "Calumet Grove",
  "Springdale",
  "Chatham",
  "Woodbury",
  "Ashland",
  "Belvedere",
  "Bonnybrook",
  "Liberty Park",
  "Lynnhaven",
  "Poinciana",
  "Sunset Pointe",
  "Winifred",
  "Amelia",
  "Caroline",
  "Largo",
  "Mallory Square",
  "Sabal Chase",
  "Tall Trees",
  "Virginia Trace",
  "Bonita",
  "Duval",
  "Hadley",
  "Hemingway",
  "Buttonwood",
  "Pennecamp",
  "St. Charles",
  "St. James",
  "Tamarind Grove",
  "Sanibel",
  "Charlotte",
  "Fernandina",
  "Gilchrist",
  "Pinellas",
  "Collier",
  "Hillsborough",
  "Lake Deaton",
  "Dunedin",
  "LaBelle",
  "Osceola Hills",
  "Fenney",
  "DeSoto",
  "McClure",
  "Chitty Chatty",
  "Linden",
  "DeLuna",
  "Monarch Grove",
  "Bradford",
  "Hawkins",
  "St. Catherine",
  "Citrus Grove",
  "Cason Hammock",
  "Richmond",
  "Dabney",
  "Lake Denham",
  "Newell",
  "Moultrie Creek",
  "Shady Brook",
  "Oak Hollow",
  "Edenfield",
  "LaGrange",
];

function pickVillageGateNames(count: number, rng: () => number): string[] {
  const n = Math.max(0, count);
  const pool = VILLAGE_GATE_NAMES.filter((name) => name !== EDENFIELD_GATE_NAME);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = pool[i];
    pool[i] = pool[j];
    pool[j] = tmp;
  }
  const names = [EDENFIELD_GATE_NAME, ...pool.slice(0, Math.max(0, n - 1))];
  for (let i = names.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = names[i];
    names[i] = names[j];
    names[j] = tmp;
  }
  return names.slice(0, n);
}

/**
 * Place a few gated-community barriers on flat, open stretches of path.
 */
function placeCommunityGates(path: Vec2[], rng: () => number) {
  TRACK_GATES = [];
  const n = path.length;
  if (n < 50) return;

  const cum: number[] = [0];
  for (let i = 0; i < n; i++) {
    cum.push(cum[i] + dist(path[i], path[(i + 1) % n]));
  }
  const total = cum[n] || 1;

  const gateCount = 3 + Math.floor(rng() * 3); // 3–5
  const usedFrac: number[] = [];
  const pending: Omit<GateSite, "label">[] = [];

  for (let g = 0; g < gateCount; g++) {
    let bestI = Math.floor(((g + 0.5) / gateCount) * n) % n;
    let bestScore = -Infinity;
    const band = Math.floor(n / gateCount);
    const base = Math.floor((g / gateCount) * n);

    for (let k = 0; k < band; k++) {
      const i = (base + k) % n;
      const frac = cum[i] / total;
      // Keep clear of start/finish
      if (frac < 0.1 || frac > 0.92) continue;
      if (usedFrac.some((f) => Math.abs(f - frac) < 0.12)) continue;

      const p = path[i];
      // Avoid bridges (elevated)
      if ((p.elev ?? 0) > 0.8) continue;
      // Stay well off the circulating road, island, and flared approaches
      if (
        TRACK_ROUNDABOUTS.some(
          (r) =>
            Math.hypot(r.x - p.x, r.y - p.y) <
            r.radius + ROAD_HALF_WIDTH + CURB_WIDTH + SIDEWALK_WIDTH + 20
        )
      ) {
        continue;
      }
      // Prefer straighter stretches so pillars sit cleanly
      const a = path[(i - 2 + n) % n];
      const c = path[(i + 2) % n];
      const turn = Math.abs(
        headingDelta(pointHeading(a, p), pointHeading(p, c))
      );
      const score = 2.5 - turn * 4 + rng() * 0.25;
      if (score > bestScore) {
        bestScore = score;
        bestI = i;
      }
    }

    if (bestScore === -Infinity) continue;

    const p = path[bestI];
    if (
      TRACK_ROUNDABOUTS.some(
        (r) =>
          Math.hypot(r.x - p.x, r.y - p.y) <
          r.radius + ROAD_HALF_WIDTH + CURB_WIDTH + SIDEWALK_WIDTH + 20
      )
    ) {
      continue;
    }
    const q = path[(bestI + 1) % n];
    const frac = cum[bestI] / total;
    usedFrac.push(frac);
    pending.push({
      x: p.x,
      y: p.y,
      angle: pointHeading(p, q),
      dist: cum[bestI],
      phase: rng() * 8,
      open: 0,
      hold: 0,
    });
  }

  // Guarantee at least one gate so Edenfield Verandas West is always on the loop.
  if (!pending.length) {
    let fallbackI = -1;
    let fallbackScore = -Infinity;
    for (let i = 0; i < n; i++) {
      const frac = cum[i] / total;
      if (frac < 0.08 || frac > 0.94) continue;
      const p = path[i];
      if ((p.elev ?? 0) > 0.8) continue;
      if (
        TRACK_ROUNDABOUTS.some(
          (r) =>
            Math.hypot(r.x - p.x, r.y - p.y) <
            r.radius + ROAD_HALF_WIDTH + 12
        )
      ) {
        continue;
      }
      const a = path[(i - 2 + n) % n];
      const c = path[(i + 2) % n];
      const turn = Math.abs(
        headingDelta(pointHeading(a, p), pointHeading(p, c))
      );
      const score = 2 - turn * 3;
      if (score > fallbackScore) {
        fallbackScore = score;
        fallbackI = i;
      }
    }
    if (fallbackI >= 0) {
      const p = path[fallbackI];
      const q = path[(fallbackI + 1) % n];
      pending.push({
        x: p.x,
        y: p.y,
        angle: pointHeading(p, q),
        dist: cum[fallbackI],
        phase: rng() * 8,
        open: 0,
        hold: 0,
      });
    }
  }

  const labels = pickVillageGateNames(pending.length, rng);
  TRACK_GATES = pending.map((site, i) => ({
    ...site,
    label: labels[i] ?? EDENFIELD_GATE_NAME,
  }));
}

/** Boring but guaranteed-safe loop if something goes wrong. */
function buildSafeRegularLoop(
  cx: number,
  cy: number,
  radius: number,
  n: number
): Vec2[] {
  const pts: Vec2[] = [];
  for (let i = 0; i < n; i++) {
    const t = (i / n) * Math.PI * 2;
    // Slight ellipse, still convex
    pts.push({
      x: cx + Math.cos(t) * radius,
      y: cy + Math.sin(t) * radius * 0.88,
    });
  }
  return chaikinClosed(pts, 2);
}

/**
 * Paint smooth height humps onto the path and fill TRACK_BRIDGES
 * for concrete multi-modal overpass props.
 */
function applyBridgeElevations(path: Vec2[], rng: () => number) {
  TRACK_BRIDGES = [];
  const n = path.length;
  if (n < 40) return;

  // Cumulative length for placement
  const cum: number[] = [0];
  for (let i = 0; i < n; i++) {
    cum.push(cum[i] + dist(path[i], path[(i + 1) % n]));
  }
  const total = cum[n] || 1;

  const bridgeCount = 2 + (rng() > 0.45 ? 1 : 0); // 2 or 3
  // Ramp is ~84–112 units long; keep the whole hill off any traffic circle.
  const maxHalfSpan = 56;
  const usedFrac: number[] = [];
  for (let b = 0; b < bridgeCount; b++) {
    let bestI = -1;
    let bestScore = -Infinity;
    const band = Math.floor(n / bridgeCount);
    const base = Math.floor((b / bridgeCount) * n);
    for (let k = 0; k < band; k++) {
      const i = (base + k) % n;
      const frac = cum[i] / total;
      if (frac < 0.08 || frac > 0.94) continue;
      if (usedFrac.some((f) => Math.abs(f - frac) < 0.18)) continue;
      const p = path[i];
      // Keep the overpass *and* its ramps well clear of every roundabout
      if (
        TRACK_ROUNDABOUTS.some(
          (r) => Math.hypot(r.x - p.x, r.y - p.y) < r.radius + maxHalfSpan + 24
        )
      ) {
        continue;
      }
      const a = path[(i - 2 + n) % n];
      const c = path[(i + 2) % n];
      const turn = Math.abs(
        headingDelta(pointHeading(a, path[i]), pointHeading(path[i], c))
      );
      const score = 2 - turn * 3 + rng() * 0.2;
      if (score > bestScore) {
        bestScore = score;
        bestI = i;
      }
    }
    if (bestI < 0) continue;

    const frac = cum[bestI] / total;
    usedFrac.push(frac);

    const halfSpan = 42 + rng() * 14;
    const peak = BRIDGE_PEAK_ELEV * (0.95 + rng() * 0.08);
    const centerDist = cum[bestI];

    for (let i = 0; i < n; i++) {
      const sample = path[i];
      if (
        TRACK_ROUNDABOUTS.some(
          (r) => Math.hypot(r.x - sample.x, r.y - sample.y) < r.radius + 16
        )
      ) {
        continue;
      }
      let dAlong = Math.abs(cum[i] - centerDist);
      dAlong = Math.min(dAlong, total - dAlong);
      if (dAlong >= halfSpan) continue;
      const t = dAlong / halfSpan;
      const hump = Math.cos((t * Math.PI) / 2);
      const e = peak * hump * hump;
      sample.elev = Math.max(sample.elev ?? 0, e);
    }

    const p = path[bestI];
    const q = path[(bestI + 1) % n];
    TRACK_BRIDGES.push({
      x: p.x,
      y: p.y,
      angle: pointHeading(p, q),
      dist: centerDist,
      peakElev: peak,
      halfSpan,
    });
  }

  // Ensure elev field exists on all points
  for (const p of path) {
    if (p.elev === undefined) p.elev = 0;
  }
}

/** Remove nearly coincident samples that flip heading 180°. */
function dedupePath(pts: Vec2[], minDist: number): Vec2[] {
  if (pts.length < 4) return pts;
  const out: Vec2[] = [{ ...pts[0] }];
  for (let i = 1; i < pts.length; i++) {
    const prev = out[out.length - 1];
    if (dist(prev, pts[i]) >= minDist) out.push({ ...pts[i] });
  }
  // Ensure close isn't a duplicate of first
  if (out.length > 2 && dist(out[out.length - 1], out[0]) < minDist) {
    out.pop();
  }
  return out;
}

/** Activate a themed area track for the next race. */
export function generateAndActivateTrack(areaId: AreaId, seed?: number): Vec2[] {
  TRACK_BRIDGES = [];
  TRACK_ROUNDABOUTS = [];
  TRACK_GATES = [];
  TRACK_WAYPOINTS = generateAreaTrack(
    areaId,
    seed ?? (Date.now() ^ (Math.random() * 1e9))
  );
  return TRACK_WAYPOINTS;
}

// Bootstrap default path (Spanish Springs) so imports always have a track
if (!TRACK_WAYPOINTS.length) {
  generateAndActivateTrack("spanish-springs", 0xc0ffee);
}

export function buildRoadSamples(spacing = 5): RoadSample[] {
  const pts = TRACK_WAYPOINTS;
  const samples: RoadSample[] = [];
  let total = 0;

  for (let i = 0; i < pts.length; i++) {
    const a = pts[i];
    const b = pts[(i + 1) % pts.length];
    const len = dist(a, b);
    const steps = Math.max(1, Math.ceil(len / spacing));
    const ea = a.elev ?? 0;
    const eb = b.elev ?? 0;
    for (let s = 0; s < steps; s++) {
      const t = s / steps;
      const x = a.x + (b.x - a.x) * t;
      const y = a.y + (b.y - a.y) * t;
      const elev = ea + (eb - ea) * t;
      const angle = Math.atan2(b.y - a.y, b.x - a.x);
      samples.push({ x, y, angle, dist: total + len * t, segment: i, elev });
    }
    total += len;
  }

  // Blend headings with neighbors so road ribbon normals stay smooth in corners
  if (samples.length > 4) {
    const blended = samples.map((s) => s.angle);
    for (let i = 0; i < samples.length; i++) {
      const a0 = samples[(i - 1 + samples.length) % samples.length].angle;
      const a1 = samples[i].angle;
      const a2 = samples[(i + 1) % samples.length].angle;
      // Average in unit-vector space to avoid wrap issues
      const x = Math.cos(a0) + Math.cos(a1) * 2 + Math.cos(a2);
      const y = Math.sin(a0) + Math.sin(a1) * 2 + Math.sin(a2);
      blended[i] = Math.atan2(y, x);
    }
    for (let i = 0; i < samples.length; i++) samples[i].angle = blended[i];
  }

  return samples;
}

export function trackLength(samples: RoadSample[]): number {
  if (!samples.length) return 1;
  const last = samples[samples.length - 1];
  return last.dist + dist(last, samples[0]);
}

export function nearestRoadPoint(
  samples: RoadSample[],
  x: number,
  y: number
): { sample: RoadSample; index: number; distToRoad: number } {
  let best = 0;
  let bestD = Infinity;
  const step = Math.max(1, Math.floor(samples.length / 400));
  for (let i = 0; i < samples.length; i += step) {
    const s = samples[i];
    const d = (s.x - x) ** 2 + (s.y - y) ** 2;
    if (d < bestD) {
      bestD = d;
      best = i;
    }
  }
  const lo = Math.max(0, best - step * 2);
  const hi = Math.min(samples.length - 1, best + step * 2);
  for (let i = lo; i <= hi; i++) {
    const s = samples[i];
    const d = (s.x - x) ** 2 + (s.y - y) ** 2;
    if (d < bestD) {
      bestD = d;
      best = i;
    }
  }
  return { sample: samples[best], index: best, distToRoad: Math.sqrt(bestD) };
}

/**
 * Nearest road sample constrained to a window around the previous index.
 * Prevents progress from “teleporting” across the loop when the path folds
 * near itself (roundabouts, parallel cart-path segments). Critical for lap counting.
 */
export function nearestRoadPointContinuous(
  samples: RoadSample[],
  x: number,
  y: number,
  prevIndex: number,
  windowFrac = 0.14
): { sample: RoadSample; index: number; distToRoad: number } {
  const n = samples.length;
  if (!n) {
    return {
      sample: { x: 0, y: 0, angle: 0, dist: 0, segment: 0, elev: 0 },
      index: 0,
      distToRoad: 0,
    };
  }

  const window = Math.max(48, Math.floor(n * windowFrac));
  let best = ((prevIndex % n) + n) % n;
  let bestD = Infinity;

  for (let d = -window; d <= window; d++) {
    const i = ((prevIndex + d) % n + n) % n;
    const s = samples[i];
    const distSq = (s.x - x) ** 2 + (s.y - y) ** 2;
    if (distSq < bestD) {
      bestD = distSq;
      best = i;
    }
  }

  const localDist = Math.sqrt(bestD);
  // Far off the local ribbon (shortcut / respawn) → allow global snap
  const global = nearestRoadPoint(samples, x, y);
  if (global.distToRoad + 10 < localDist) {
    return global;
  }

  return {
    sample: samples[best],
    index: best,
    distToRoad: localDist,
  };
}

/** Distance from a point to the *active* track polyline. */
export function roadDistance(x: number, y: number): number {
  let best = Infinity;
  const pts = TRACK_WAYPOINTS;
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i];
    const b = pts[(i + 1) % pts.length];
    const d = distPointToSegment(x, y, a.x, a.y, b.x, b.y);
    if (d < best) best = d;
  }
  return best;
}

function distPointToSegment(
  px: number,
  py: number,
  ax: number,
  ay: number,
  bx: number,
  by: number
): number {
  const abx = bx - ax;
  const aby = by - ay;
  const apx = px - ax;
  const apy = py - ay;
  const ab2 = abx * abx + aby * aby || 1;
  let t = (apx * abx + apy * aby) / ab2;
  t = Math.max(0, Math.min(1, t));
  const cx = ax + abx * t;
  const cy = ay + aby * t;
  return Math.hypot(px - cx, py - cy);
}

export function clearOfRoad(x: number, y: number, minDist: number): boolean {
  return roadDistance(x, y) >= minDist;
}

/** True if (x, y) is on a roundabout island, circulating road, or just into an approach. */
export function onRoundabout(x: number, y: number, extra = 0): boolean {
  for (const r of TRACK_ROUNDABOUTS) {
    if (Math.hypot(x - r.x, y - r.y) < r.radius + extra) return true;
  }
  return false;
}

export type DecorBlob = {
  x: number;
  y: number;
  r: number;
  kind: "houses" | "pond" | "golf" | "palm-grove" | "parking" | "plaza";
};

/**
 * Decorative fill for the active track neighborhood only.
 * Kept lean so the full cart path + scenery can build in one frame without blank hitches.
 */
export function buildDecor(seed = 0xc0ffee): DecorBlob[] {
  const blobs: DecorBlob[] = [];
  const rng = mulberry32(seed >>> 0);
  const pts = TRACK_WAYPOINTS;
  if (!pts.length) return blobs;

  // Bounds of this loop — never scatter props across the whole Villages map
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (const p of pts) {
    minX = Math.min(minX, p.x);
    maxX = Math.max(maxX, p.x);
    minY = Math.min(minY, p.y);
    maxY = Math.max(maxY, p.y);
  }
  const pad = 90;
  minX -= pad;
  maxX += pad;
  minY -= pad;
  maxY += pad;

  // Plaza near the square that owns this loop
  for (const sq of LANDMARKS.filter((l) => l.kind === "town-square")) {
    if (sq.x < minX || sq.x > maxX || sq.y < minY || sq.y > maxY) continue;
    if (clearOfRoad(sq.x, sq.y, ROAD_HALF_WIDTH + 2)) {
      blobs.push({ x: sq.x, y: sq.y, r: 38, kind: "plaza" });
    }
    for (let attempt = 0; attempt < 10; attempt++) {
      const ang = rng() * Math.PI * 2;
      const px = sq.x + Math.cos(ang) * (48 + rng() * 20);
      const py = sq.y + Math.sin(ang) * (48 + rng() * 20);
      if (clearOfRoad(px, py, ROAD_CLEAR_BUILDING)) {
        blobs.push({ x: px, y: py, r: 22, kind: "parking" });
        break;
      }
    }
  }

  for (let i = 0; i < 18; i++) {
    const idx = Math.floor(rng() * pts.length);
    const p = pts[idx];
    const n = pts[(idx + 1) % pts.length];
    const tang = Math.atan2(n.y - p.y, n.x - p.x) + Math.PI / 2;
    const side = rng() > 0.5 ? 1 : -1;
    const distOff = ROAD_CLEAR_BUILDING + 16 + rng() * 40;
    const x = p.x + Math.cos(tang) * distOff * side;
    const y = p.y + Math.sin(tang) * distOff * side;
    const r = 12 + rng() * 18;
    if (clearOfRoad(x, y, r + ROAD_CLEAR_PROP)) {
      blobs.push({ x, y, r, kind: "pond" });
    }
  }

  for (let i = 0; i < 10; i++) {
    const idx = Math.floor(rng() * pts.length);
    const p = pts[idx];
    const n = pts[(idx + 1) % pts.length];
    const tang = Math.atan2(n.y - p.y, n.x - p.x) + Math.PI / 2;
    const side = rng() > 0.5 ? 1 : -1;
    const distOff = ROAD_CLEAR_BUILDING + 30 + rng() * 40;
    const x = p.x + Math.cos(tang) * distOff * side;
    const y = p.y + Math.sin(tang) * distOff * side;
    const r = 30 + rng() * 28;
    if (clearOfRoad(x, y, r * 0.55 + ROAD_CLEAR_PROP)) {
      blobs.push({ x, y, r, kind: "golf" });
    }
  }

  // Roadside homes / palms — every other waypoint, fewer depth rings
  for (let i = 0; i < pts.length; i += 2) {
    const p = pts[i];
    const n = pts[(i + 1) % pts.length];
    const tang = Math.atan2(n.y - p.y, n.x - p.x) + Math.PI / 2;
    for (const side of [-1, 1] as const) {
      const front = ROAD_CLEAR_TREE + 1.5 + rng() * 2;
      {
        const x = p.x + Math.cos(tang) * front * side;
        const y = p.y + Math.sin(tang) * front * side;
        if (clearOfRoad(x, y, ROAD_CLEAR_TREE) && i % 4 === 0) {
          blobs.push({ x, y, r: 6 + rng() * 4, kind: "palm-grove" });
        }
      }
      for (const depth of [24, 36, 50, 68]) {
        if (rng() > 0.78 && depth > 40) continue;
        const jitter = (rng() - 0.5) * 3;
        const x = p.x + Math.cos(tang) * (depth + jitter) * side;
        const y = p.y + Math.sin(tang) * (depth + jitter) * side;
        if (!clearOfRoad(x, y, ROAD_CLEAR_BUILDING)) continue;
        const nearLm = LANDMARKS.some((l) => Math.hypot(l.x - x, l.y - y) < 40);
        if (nearLm) continue;
        blobs.push({
          x,
          y,
          r: 9 + rng() * 10,
          kind: rng() > 0.88 ? "palm-grove" : "houses",
        });
      }
    }
  }

  // Fill only inside the local loop bounds (not the entire map)
  for (let i = 0; i < 90; i++) {
    const x = minX + rng() * (maxX - minX);
    const y = minY + rng() * (maxY - minY);
    const dRoad = roadDistance(x, y);
    if (dRoad < ROAD_CLEAR_BUILDING) continue;
    if (dRoad > 120 && rng() > 0.35) continue;
    const nearLm = LANDMARKS.some((l) => Math.hypot(l.x - x, l.y - y) < 48);
    if (nearLm) continue;
    blobs.push({
      x,
      y,
      r: 12 + rng() * 18,
      kind: rng() > 0.8 ? "palm-grove" : "houses",
    });
  }

  return blobs;
}

export function startPose(
  samples: RoadSample[],
  lane = 0
): { x: number; y: number; angle: number } {
  // Just past the start/finish gate so the checkered banner is behind the pack
  const s = samples[Math.min(5, samples.length - 1)];
  const nx = Math.cos(s.angle + Math.PI / 2);
  const ny = Math.sin(s.angle + Math.PI / 2);
  const offset = (lane - 1.5) * 3.0;
  return {
    x: s.x + nx * offset,
    y: s.y + ny * offset,
    angle: s.angle,
  };
}
