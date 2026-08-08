/**
 * Golf skill / feat badges for members AND visitors.
 * Earned from approved rounds & hole-in-ones on the Golf hub.
 * Names match case-insensitively (same player name on scorecard = same badges).
 *
 * Tiers (inspired by common golf-app metal tiers — pink reserved for rare feats):
 *   Bronze · Silver · Gold · Pink (hole-in-one ⛳)
 * Score rings (UI only when showing a number):
 *   single circle = birdie-caliber round · double = eagle / ace-caliber
 */

import { loadGolfClub } from "./golfClub";
import type { GolfRound } from "./golfClubTypes";
import type { BadgeDef } from "./memberBadgeTypes";

export const GOLF_BADGE_IDS = {
  bronze: "golf_bronze",
  silver: "golf_silver",
  gold: "golf_gold",
  pinkAce: "golf_pink_ace",
} as const;

/** Metal / pink achievement badges (image strip next to name). */
export const GOLF_SKILL_BADGES: Record<string, BadgeDef> = {
  [GOLF_BADGE_IDS.bronze]: {
    id: GOLF_BADGE_IDS.bronze,
    label: "Golf Bronze",
    title:
      "Golf Bronze — solid neighbor-reported play (approved rounds on the Leader Board).",
    image: "/graphics/badges/golf-bronze.jpg",
    kind: "golf",
    metal: "bronze",
  },
  [GOLF_BADGE_IDS.silver]: {
    id: GOLF_BADGE_IDS.silver,
    label: "Golf Silver",
    title:
      "Golf Silver — strong handicap (18 or better) from approved rounds.",
    image: "/graphics/badges/golf-silver.jpg",
    kind: "golf",
    metal: "silver",
  },
  [GOLF_BADGE_IDS.gold]: {
    id: GOLF_BADGE_IDS.gold,
    label: "Golf Gold",
    title:
      "Golf Gold — low handicap (10 or better) from approved rounds. Cart-path legend territory.",
    image: "/graphics/badges/golf-gold.jpg",
    kind: "golf",
    metal: "gold",
  },
  [GOLF_BADGE_IDS.pinkAce]: {
    id: GOLF_BADGE_IDS.pinkAce,
    label: "Hole-in-One ⛳",
    title:
      "Pink Ace ⛳ — rare feat: an approved hole-in-one on The Villages Leader Board / Ace Wall.",
    image: "/graphics/badges/golf-pink-ace.jpg",
    kind: "golf",
    metal: "pink",
    emoji: "⛳",
  },
};

function normName(name: string) {
  return String(name || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

/**
 * Heuristic “great round” tiers when we only have gross score + holes
 * (no hole-by-hole card). Tuned for executive 9s and casual 18s.
 */
export type ScoreRing = "birdie" | "eagle" | null;

export function scoreRingForRound(round: Pick<GolfRound, "holes" | "score">): ScoreRing {
  const { holes, score } = round;
  if (!Number.isFinite(score) || score <= 0) return null;
  if (holes === 9) {
    if (score <= 27) return "eagle"; // ~ even par or better on short executive
    if (score <= 32) return "birdie";
    return null;
  }
  // 18 holes
  if (score <= 68) return "eagle";
  if (score <= 78) return "birdie";
  return null;
}

export type GolfPlayerStats = {
  playerName: string;
  approvedRounds: number;
  bestHandicap: number | null;
  aceCount: number;
  best9: number | null;
  best18: number | null;
  courseRecords: number;
};

export function buildGolfPlayerStats(): Map<string, GolfPlayerStats> {
  const data = loadGolfClub();
  const map = new Map<string, GolfPlayerStats>();

  function ensure(displayName: string): GolfPlayerStats {
    const key = normName(displayName);
    let row = map.get(key);
    if (!row) {
      row = {
        playerName: displayName.trim(),
        approvedRounds: 0,
        bestHandicap: null,
        aceCount: 0,
        best9: null,
        best18: null,
        courseRecords: 0,
      };
      map.set(key, row);
    }
    return row;
  }

  for (const r of data.rounds) {
    if (r.status !== "approved") continue;
    const row = ensure(r.playerName);
    row.approvedRounds += 1;
    if (r.handicap !== null && r.handicap !== undefined) {
      if (row.bestHandicap === null || r.handicap < row.bestHandicap) {
        row.bestHandicap = r.handicap;
      }
    }
    if (r.holes === 9) {
      if (row.best9 === null || r.score < row.best9) row.best9 = r.score;
    } else if (r.holes === 18) {
      if (row.best18 === null || r.score < row.best18) row.best18 = r.score;
    }
  }

  for (const a of data.aces) {
    if (a.status !== "approved") continue;
    const row = ensure(a.playerName);
    row.aceCount += 1;
  }

  // Course record holders (best approved score per course+holes)
  const best = new Map<string, { key: string; score: number }>();
  for (const r of data.rounds) {
    if (r.status !== "approved") continue;
    const ck = `${r.course.toLowerCase()}|${r.holes}`;
    const prev = best.get(ck);
    if (!prev || r.score < prev.score) {
      best.set(ck, { key: normName(r.playerName), score: r.score });
    }
  }
  for (const { key } of best.values()) {
    const row = map.get(key);
    if (row) row.courseRecords += 1;
  }

  return map;
}

/**
 * Highest metal earned from handicap / activity (bronze < silver < gold).
 * Pink ace is separate and stacks on top.
 */
function metalFromStats(stats: GolfPlayerStats): BadgeDef | null {
  const h = stats.bestHandicap;
  // Gold: elite reported handicap
  if (h !== null && h <= 10) return GOLF_SKILL_BADGES[GOLF_BADGE_IDS.gold];
  // Gold alternate: exceptional gross without handicap
  if (
    (stats.best9 !== null && stats.best9 <= 27) ||
    (stats.best18 !== null && stats.best18 <= 68)
  ) {
    return GOLF_SKILL_BADGES[GOLF_BADGE_IDS.gold];
  }
  // Silver
  if (h !== null && h <= 18) return GOLF_SKILL_BADGES[GOLF_BADGE_IDS.silver];
  if (
    (stats.best9 !== null && stats.best9 <= 32) ||
    (stats.best18 !== null && stats.best18 <= 78) ||
    stats.courseRecords >= 1
  ) {
    return GOLF_SKILL_BADGES[GOLF_BADGE_IDS.silver];
  }
  // Bronze: any approved contribution that shows “good golf” activity
  if (stats.approvedRounds >= 1 || stats.aceCount >= 1) {
    return GOLF_SKILL_BADGES[GOLF_BADGE_IDS.bronze];
  }
  return null;
}

/**
 * Badges for a player name (member or visitor) based on approved golf data.
 * Order: metal first, then pink ace (rare) so it reads last / most special.
 */
export function golfBadgesForName(playerName: string | null | undefined): BadgeDef[] {
  const q = normName(playerName || "");
  if (q.length < 2) return [];
  const stats = buildGolfPlayerStats().get(q);
  if (!stats) return [];

  const out: BadgeDef[] = [];
  const metal = metalFromStats(stats);
  if (metal) out.push(metal);
  if (stats.aceCount >= 1) {
    out.push(GOLF_SKILL_BADGES[GOLF_BADGE_IDS.pinkAce]);
  }
  return out;
}

export function golfBadgeCatalog(): BadgeDef[] {
  return [
    GOLF_SKILL_BADGES[GOLF_BADGE_IDS.bronze],
    GOLF_SKILL_BADGES[GOLF_BADGE_IDS.silver],
    GOLF_SKILL_BADGES[GOLF_BADGE_IDS.gold],
    GOLF_SKILL_BADGES[GOLF_BADGE_IDS.pinkAce],
  ];
}
