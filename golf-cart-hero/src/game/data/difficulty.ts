/**
 * Race difficulty — funny Villages-themed names for three skill tiers.
 * Controls NPC AI skill, rubber-band, and how tightly rivals hold the cart path.
 */

export type DifficultyId = "lanai-learner" | "happy-hour" | "turnpike-terror";

export type DifficultyDef = {
  id: DifficultyId;
  name: string;
  /** Short UI tagline */
  blurb: string;
  emoji: string;
  /** Base AI skill multiplier (≈1 = match player cart pace) */
  aiSkillMin: number;
  aiSkillMax: number;
  /** How hard AI pulls back onto the asphalt when drifting */
  roadGrip: number;
  /** Look-ahead samples along the path */
  lookAheadMin: number;
  lookAheadMax: number;
  /** Corner slowdown aggressiveness 0–1 */
  cornerCare: number;
  /** Rubber-band strength when behind the player */
  rubberBand: number;
  /** Soft card accent */
  cardGradient: string;
};

export const DIFFICULTIES: DifficultyDef[] = [
  {
    id: "lanai-learner",
    name: "Lanai Learner",
    blurb: "Sunday drivers. They wave a lot and miss a few turns. Perfect for first cart-path laps.",
    emoji: "🪑",
    aiSkillMin: 0.72,
    aiSkillMax: 0.84,
    roadGrip: 0.55,
    lookAheadMin: 10,
    lookAheadMax: 16,
    cornerCare: 0.35,
    rubberBand: 0.65,
    cardGradient: "linear-gradient(135deg, #7ec8e8 0%, #c8e8d0 100%)",
  },
  {
    id: "happy-hour",
    name: "Happy Hour Hotshot",
    blurb: "Square-night energy. Solid pack that stays on the path and keeps you honest.",
    emoji: "🍹",
    aiSkillMin: 0.9,
    aiSkillMax: 1.02,
    roadGrip: 0.82,
    lookAheadMin: 16,
    lookAheadMax: 24,
    cornerCare: 0.62,
    rubberBand: 1,
    cardGradient: "linear-gradient(135deg, #e8b84a 0%, #e85d4c 100%)",
  },
  {
    id: "turnpike-terror",
    name: "Turnpike Terror",
    blurb: "Bridge-bandit pace. Tight lines, early apexes, zero mercy on the multi-modal.",
    emoji: "🌉",
    aiSkillMin: 1.05,
    aiSkillMax: 1.16,
    roadGrip: 0.95,
    lookAheadMin: 22,
    lookAheadMax: 34,
    cornerCare: 0.88,
    rubberBand: 1.15,
    cardGradient: "linear-gradient(135deg, #5a2a28 0%, #c45c48 50%, #e8b84a 100%)",
  },
];

export function getDifficulty(id: DifficultyId): DifficultyDef {
  return DIFFICULTIES.find((d) => d.id === id) ?? DIFFICULTIES[1];
}
