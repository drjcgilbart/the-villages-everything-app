import { BRAND } from "../theme";
import type { CartId } from "./data/carts";
import type { DriverId } from "./data/drivers";

const STORAGE_KEY = "vgch-lanai-legends-v1";
const MAX_ENTRIES = 15;

export type LeaderboardEntry = {
  id: string;
  playerName: string;
  score: number;
  place: number;
  timeSec: number;
  cartId: CartId;
  driverId: DriverId;
  laps: number;
  hazardsHit: number;
  date: string;
};

export function loadLeaderboard(): LeaderboardEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as LeaderboardEntry[];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((e) => e && typeof e.score === "number" && e.playerName)
      .sort((a, b) => b.score - a.score)
      .slice(0, MAX_ENTRIES);
  } catch {
    return [];
  }
}

export function saveLeaderboard(entries: LeaderboardEntry[]) {
  const sorted = [...entries].sort((a, b) => b.score - a.score).slice(0, MAX_ENTRIES);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sorted));
  return sorted;
}

export function submitScore(entry: Omit<LeaderboardEntry, "id" | "date">): LeaderboardEntry[] {
  const full: LeaderboardEntry = {
    ...entry,
    id: `lb-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    date: new Date().toISOString(),
  };
  const list = loadLeaderboard();
  list.push(full);
  return saveLeaderboard(list);
}

export function isHighScore(score: number): boolean {
  const list = loadLeaderboard();
  if (list.length < MAX_ENTRIES) return score > 0;
  return score > (list[list.length - 1]?.score ?? 0);
}

export function leaderboardTitle() {
  return BRAND.leaderboard;
}
