export type HazardType =
  | "golf-ball"
  | "turtle"
  | "alligator"
  | "lightning"
  | "wanderer"
  | "cop"
  | "porch-police"
  | "palm-frond"
  | "sinkhole";

export type HazardDef = {
  type: HazardType;
  name: string;
  emoji: string;
  scorePenalty: number;
  speedMul: number;
  duration: number;
  /** Collision radius in meters */
  radius: number;
  message: string;
  color: string;
  /** World mesh scale */
  scale: number;
};

export const HAZARD_DEFS: Record<HazardType, HazardDef> = {
  "golf-ball": {
    type: "golf-ball",
    name: "Errant Golf Ball",
    emoji: "⛳",
    scorePenalty: 80,
    speedMul: 0.45,
    duration: 1.2,
    radius: 2.2,
    message: "FORE! Bonked by a Titleist!",
    color: "#ffffff",
    scale: 1.2,
  },
  turtle: {
    type: "turtle",
    name: "Road Turtle",
    emoji: "🐢",
    scorePenalty: 120,
    speedMul: 0.35,
    duration: 1.6,
    radius: 2.4,
    message: "You hit a turtle! Shell of a mistake.",
    color: "#5c8a4a",
    scale: 1.4,
  },
  alligator: {
    type: "alligator",
    name: "Retention Pond Gator",
    emoji: "🐊",
    scorePenalty: 150,
    speedMul: 0.3,
    duration: 1.8,
    radius: 3.2,
    message: "Gator chomp! Stay out of the ponds!",
    color: "#2f6f4e",
    scale: 1.8,
  },
  lightning: {
    type: "lightning",
    name: "Florida Lightning",
    emoji: "⚡",
    scorePenalty: 100,
    speedMul: 0.25,
    duration: 1.4,
    radius: 3.6,
    message: "Lightning strike! Cart electronics fried.",
    color: "#c8d8f0",
    scale: 1.35,
  },
  wanderer: {
    type: "wanderer",
    name: "Tipsy Wanderer",
    emoji: "🥴",
    scorePenalty: 140,
    speedMul: 0.4,
    duration: 1.5,
    radius: 2.2,
    message: "Near-miss with a square-night wanderer!",
    color: "#e85d4c",
    scale: 1.5,
  },
  cop: {
    type: "cop",
    name: "Cart Cop",
    emoji: "🚓",
    scorePenalty: 200,
    speedMul: 0.2,
    duration: 2.4,
    radius: 2.8,
    message: "Ticket issued! Slow down, hot rod.",
    color: "#3a5a9a",
    scale: 1.6,
  },
  "porch-police": {
    type: "porch-police",
    name: "Porch Police",
    emoji: "👴",
    scorePenalty: 60,
    speedMul: 0.5,
    duration: 2.0,
    radius: 2.5,
    message: '"SLOW DOWN!! This isn\'t Daytona!"',
    color: "#8b7355",
    scale: 1.5,
  },
  "palm-frond": {
    type: "palm-frond",
    name: "Storm Fronds",
    emoji: "🌿",
    scorePenalty: 70,
    speedMul: 0.42,
    duration: 1.5,
    radius: 2.6,
    message: "Palm fronds on the path! After the storm.",
    color: "#2f6b3a",
    scale: 1.6,
  },
  sinkhole: {
    type: "sinkhole",
    name: "Cart-Path Sinkhole",
    emoji: "🕳",
    scorePenalty: 160,
    speedMul: 0,
    duration: 5,
    radius: 3.4,
    message: "Sinkhole! You're stuck — wait it out.",
    color: "#e85d14",
    scale: 2.4,
  },
};

export type HazardInstance = {
  id: number;
  type: HazardType;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  active: boolean;
  /** World facing = direction of travel (atan2 of velocity) */
  angle: number;
  /** Bob phase for animation */
  phase: number;
  /**
   * Sprite mirror: +1 = art as drawn (face / nose toward texture-right),
   * −1 = mirrored. Updated with hysteresis so the face always points the
   * way the hazard is moving on screen.
   */
  faceSign: number;
};

/**
 * When scale.x > 0, does the hazard art face toward the RIGHT of the image?
 * All current side-view sprites do (gator snout, turtle head, cart nose, people).
 */
export const HAZARD_ART_FACES_RIGHT: Partial<Record<HazardType, boolean>> = {
  alligator: true,
  turtle: true,
  wanderer: true,
  cop: true,
  "porch-police": true,
  lightning: true,
};
