/** Client-safe types for The Villages Golf Club hub */

export type GolfModStatus = "pending" | "approved" | "rejected";

export type GolfFoursomeSection = "men" | "women" | "mixed";

export type GolfPlayersNeeded = 1 | 2 | 3;

export type GolfHoles = 9 | 18;

/** Curated Villages courses (executive + championship / club). */
export const GOLF_COURSES = [
  // Executive Trail (sample of popular nines)
  "Amberwood",
  "Bacall",
  "Belle Aire",
  "Buttonwood",
  "Cane Garden",
  "Chula Vista",
  "Churchill Downs",
  "Country Club Hills",
  "De La Vista",
  "El Diablo",
  "Glenview",
  "Hacienda Hills",
  "Hemingway",
  "Hilltop",
  "Lake Miona",
  "Nancy Lopez Legacy (exec)",
  "Odell",
  "Orange Blossom Hills",
  "Piper",
  "Saddlebrook",
  "Sandhill",
  "Southern Trades",
  "Summerhill",
  "Sunset Pointe",
  "Sweetgum",
  "Tierra del Sol",
  "Turtle Mound",
  "Volterra",
  // Championship / country club
  "Belleview Country Club",
  "Cane Garden Country Club",
  "Hacienda Hills Country Club",
  "Lake Miona Country Club",
  "Nancy Lopez Legacy Country Club",
  "Orange Blossom Hills Country Club",
  "Silver Lake Country Club",
  "Southern Trades Country Club",
  "Tierra del Sol Country Club",
  "Other / write-in",
] as const;

export type GolfCourseName = (typeof GOLF_COURSES)[number] | string;

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
