/** Client-safe types for The Villages Golf Club hub */

import { GOLF_COURSES as GOLF_COURSE_DIRECTORY } from "./entertainmentCatalog";

export type GolfModStatus = "pending" | "approved" | "rejected";

export type GolfFoursomeSection = "men" | "women" | "mixed";

export type GolfPlayersNeeded = 1 | 2 | 3;

export type GolfHoles = 9 | 18;

/** Last dropdown choice — neighbors type a course name that is not listed. */
export const GOLF_COURSE_WRITE_IN = "Other / not listed";

export const GOLF_COURSE_GROUPS: {
  kind: "championship" | "executive" | "pitch-putt";
  label: string;
  courses: string[];
}[] = (
  [
    ["championship", "Championship / country club"],
    ["executive", "Executive trail"],
    ["pitch-putt", "Pitch & putt / specialty"],
  ] as const
).map(([kind, label]) => ({
  kind,
  label,
  courses: GOLF_COURSE_DIRECTORY.filter((c) => c.kind === kind)
    .map((c) => c.name)
    .sort((a, b) => a.localeCompare(b, "en")),
}));

/**
 * Official Golf The Villages playable courses (championship + executive trail
 * + pitch & putt), plus a write-in for anything the directory missed.
 * Sourced from golfthevillages.com course lists (checked Sep 2026).
 */
export const GOLF_COURSES: string[] = [
  ...GOLF_COURSE_GROUPS.flatMap((g) => g.courses),
  GOLF_COURSE_WRITE_IN,
];

export type GolfCourseName = string;

export function isGolfCourseWriteIn(value: string) {
  const t = value.trim();
  return (
    t === GOLF_COURSE_WRITE_IN ||
    /^other\s*\/\s*(write-in|not listed)/i.test(t)
  );
}

/** Use the typed name when the neighbor picked Other / not listed. */
export function resolveGolfCourse(selected: string, custom?: string) {
  if (isGolfCourseWriteIn(selected)) return (custom || "").trim();
  return selected.trim();
}

export const FOURSOME_SECTIONS: {
  id: GolfFoursomeSection;
  label: string;
  blurb: string;
}[] = [
  {
    id: "men",
    label: "Men",
    blurb: "Looking for guys to fill out a group.",
  },
  {
    id: "women",
    label: "Women",
    blurb: "Looking for ladies to fill out a group.",
  },
  {
    id: "mixed",
    label: "Mixed",
    blurb: "Open to anyone — make a friendly foursome.",
  },
];

/** Submitted best game / scorecard entry */
export type GolfRound = {
  id: string;
  playerName: string;
  /** USGA-style handicap index (lower is better); optional */
  handicap: number | null;
  course: string;
  /** YYYY-MM-DD */
  playDate: string;
  /** HH:mm optional */
  playTime?: string;
  holes: GolfHoles;
  /** Gross score for the round */
  score: number;
  notes?: string;
  status: GolfModStatus;
  createdAt: string;
};

/**
 * Heuristic “great round” tiers when we only have gross score + holes.
 * Client-safe (no Node/fs) — used for score ring UI on the Golf hub.
 */
export type ScoreRing = "birdie" | "eagle" | null;

export function scoreRingForRound(
  round: Pick<GolfRound, "holes" | "score">
): ScoreRing {
  const { holes, score } = round;
  if (!Number.isFinite(score) || score <= 0) return null;
  if (holes === 9) {
    if (score <= 27) return "eagle";
    if (score <= 32) return "birdie";
    return null;
  }
  if (score <= 68) return "eagle";
  if (score <= 78) return "birdie";
  return null;
}

/** Looking for 1–3 to make a foursome */
export type GolfFoursomePost = {
  id: string;
  organizerName: string;
  section: GolfFoursomeSection;
  playersNeeded: GolfPlayersNeeded;
  course?: string;
  /** Free-text preferred day/window */
  whenNote: string;
  message: string;
  contact: string;
  /** open | filled | hidden */
  status: "open" | "filled" | "hidden";
  createdAt: string;
};

/** Hole-in-one celebration */
export type GolfAce = {
  id: string;
  playerName: string;
  course: string;
  hole: number;
  /** YYYY-MM-DD */
  playDate: string;
  clubUsed?: string;
  story?: string;
  /** One photo uploaded with the report (`/api/media/...`) */
  photoUrl?: string;
  status: GolfModStatus;
  createdAt: string;
};

export type GolfClubData = {
  rounds: GolfRound[];
  foursomes: GolfFoursomePost[];
  aces: GolfAce[];
  updatedAt: string | null;
};

export type GolfHandicapLeader = {
  playerName: string;
  handicap: number;
  roundsCount: number;
};

export type GolfCourseLeader = {
  course: string;
  holes: GolfHoles;
  playerName: string;
  score: number;
  playDate: string;
  roundId: string;
};
