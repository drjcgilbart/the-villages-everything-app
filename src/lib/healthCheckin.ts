/**
 * Browser-local daily wellness check-in for the public Health hub.
 * Not medical advice. History stays on this device only.
 */

import { nowTimeEastern, todayKeyEastern, uid } from "@/lib/mySpaceStorage";
import { DAILY_MOVES, MOOD_OPTIONS } from "@/lib/healthResources";

export const HEALTH_CHECKIN_KEY = "tvea-health-checkin-v2";
export const HEALTH_CHECKIN_LEGACY_KEY = "tvea-health-checkin-v1";
const KEEP_DAYS = 28;
const MAX_WATER = 24;
const MAX_CUSTOM_MOVES = 8;
const MAX_STEPS = 80000;

export type CustomMove = {
  id: string;
  label: string;
  emoji: string;
  minutes: number;
};

export type DayLog = {
  dateKey: string;
  mood?: string;
  moodNote?: string;
  water: number;
  waterGoal: number;
  waterTimes: string[];
  moves: string[];
  stepsGoal: number;
  stepsDone: number;
};

export type WellnessStore = {
  waterGoal: number;
  stepsGoal: number;
  customMoves: CustomMove[];
  note: string;
  days: Record<string, DayLog>;
};

export type WeekDay = {
  key: string;
  dow: string;
  isToday: boolean;
  log: DayLog | null;
};

export function todayKeyFlorida() {
  return todayKeyEastern();
}

export function floridaHour(d = new Date()) {
  const hour = new Intl.DateTimeFormat("en-GB", {
    timeZone: "America/New_York",
    hour: "2-digit",
    hour12: false,
  }).format(d);
  const n = Number(hour);
  return Number.isFinite(n) ? n % 24 : 0;
}

export function shiftDateKey(ymd: string, days: number) {
  const [y, m, d] = ymd.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d, 12));
  dt.setUTCDate(dt.getUTCDate() + days);
  return dt.toISOString().slice(0, 10);
}

export function weekdayShort(ymd: string) {
  const [y, m, d] = ymd.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d, 12)).toLocaleDateString("en-US", {
    weekday: "short",
    timeZone: "UTC",
  });
}

export function emptyDay(
  dateKey: string,
  prefs?: Pick<WellnessStore, "waterGoal" | "stepsGoal">
): DayLog {
  return {
    dateKey,
    water: 0,
    waterGoal: prefs?.waterGoal || 8,
    waterTimes: [],
    moves: [],
    stepsGoal: prefs?.stepsGoal || 6000,
    stepsDone: 0,
  };
}

export function emptyStore(): WellnessStore {
  return {
    waterGoal: 8,
    stepsGoal: 6000,
    customMoves: [],
    note: "",
    days: {},
  };
}

function clipInt(value: unknown, fallback: number, min: number, max: number) {
  const n = Math.round(Number(value));
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

function normalizeDay(raw: Partial<DayLog> | null | undefined, dateKey: string, prefs: Pick<WellnessStore, "waterGoal" | "stepsGoal">): DayLog {
  const base = emptyDay(dateKey, prefs);
  if (!raw || typeof raw !== "object") return base;
  const water = clipInt(raw.water, 0, 0, MAX_WATER);
  const times = Array.isArray(raw.waterTimes)
    ? raw.waterTimes.map((t) => String(t).slice(0, 8)).slice(0, MAX_WATER)
    : [];
  while (times.length < water) times.push("");
  return {
    dateKey,
    mood: typeof raw.mood === "string" ? raw.mood.slice(0, 20) : undefined,
    moodNote: typeof raw.moodNote === "string" ? raw.moodNote.slice(0, 80) : undefined,
    water,
    waterGoal: clipInt(raw.waterGoal, prefs.waterGoal, 4, 16),
    waterTimes: times.slice(0, water),
    moves: Array.isArray(raw.moves)
      ? raw.moves.map((id) => String(id).slice(0, 40)).slice(0, 24)
      : [],
    stepsGoal: clipInt(raw.stepsGoal, prefs.stepsGoal, 1000, 30000),
    stepsDone: clipInt(raw.stepsDone, 0, 0, MAX_STEPS),
  };
}

function normalizeCustomMoves(raw: unknown): CustomMove[] {
  if (!Array.isArray(raw)) return [];
  const out: CustomMove[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const row = item as Partial<CustomMove>;
    const label = String(row.label || "").trim().slice(0, 48);
    if (!label) continue;
    out.push({
      id: String(row.id || uid("win")).slice(0, 40),
      label,
      emoji: String(row.emoji || "✨").slice(0, 8),
      minutes: clipInt(row.minutes, 5, 1, 180),
    });
    if (out.length >= MAX_CUSTOM_MOVES) break;
  }
  return out;
}

export function normalizeStore(raw: Partial<WellnessStore> | null | undefined): WellnessStore {
  const base = emptyStore();
  if (!raw || typeof raw !== "object") return base;
  const waterGoal = clipInt(raw.waterGoal, 8, 4, 16);
  const stepsGoal = clipInt(raw.stepsGoal, 6000, 1000, 30000);
  const prefs = { waterGoal, stepsGoal };
  const days: Record<string, DayLog> = {};
  if (raw.days && typeof raw.days === "object") {
    for (const [key, value] of Object.entries(raw.days)) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(key)) continue;
      days[key] = normalizeDay(value, key, prefs);
    }
  }
  return {
    waterGoal,
    stepsGoal,
    customMoves: normalizeCustomMoves(raw.customMoves),
    note: String(raw.note || "").slice(0, 800),
    days: pruneDays(days),
  };
}

function migrateLegacy(raw: Record<string, unknown>): WellnessStore {
  const dateKey = typeof raw.dateKey === "string" && /^\d{4}-\d{2}-\d{2}$/.test(raw.dateKey)
    ? raw.dateKey
    : todayKeyFlorida();
  const stepsGoal = clipInt(raw.stepsGoal, 6000, 1000, 30000);
  const store = emptyStore();
  store.stepsGoal = stepsGoal;
  store.note = String(raw.note || "").slice(0, 800);
  store.days[dateKey] = normalizeDay(
    {
      dateKey,
      mood: typeof raw.mood === "string" ? raw.mood : undefined,
      water: Number(raw.water) || 0,
      waterGoal: 8,
      waterTimes: [],
      moves: Array.isArray(raw.moves) ? (raw.moves as string[]) : [],
      stepsGoal,
      stepsDone: Number(raw.stepsDone) || 0,
    },
    dateKey,
    store
  );
  return store;
}

function pruneDays(days: Record<string, DayLog>, today = todayKeyFlorida()) {
  const keep = new Set(Array.from({ length: KEEP_DAYS }, (_, i) => shiftDateKey(today, -i)));
  const next: Record<string, DayLog> = {};
  for (const key of keep) {
    if (days[key]) next[key] = days[key];
  }
  return next;
}

export function loadStore(): WellnessStore {
  if (typeof window === "undefined") return emptyStore();
  try {
    const v2 = localStorage.getItem(HEALTH_CHECKIN_KEY);
    if (v2) return normalizeStore(JSON.parse(v2) as Partial<WellnessStore>);
    const v1 = localStorage.getItem(HEALTH_CHECKIN_LEGACY_KEY);
    if (v1) return migrateLegacy(JSON.parse(v1) as Record<string, unknown>);
  } catch {
    /* ignore */
  }
  return emptyStore();
}

export function saveStore(store: WellnessStore) {
  try {
    const pruned = { ...store, days: pruneDays(store.days) };
    localStorage.setItem(HEALTH_CHECKIN_KEY, JSON.stringify(pruned));
  } catch {
    /* quota */
  }
}

export function ensureToday(store: WellnessStore, today = todayKeyFlorida()): WellnessStore {
  if (store.days[today]) return store;
  return {
    ...store,
    days: pruneDays({ ...store.days, [today]: emptyDay(today, store) }, today),
  };
}

export function patchToday(
  store: WellnessStore,
  patch: Partial<DayLog>,
  today = todayKeyFlorida()
): WellnessStore {
  const base = ensureToday(store, today);
  const current = base.days[today] || emptyDay(today, base);
  const nextDay = normalizeDay({ ...current, ...patch, dateKey: today }, today, {
    waterGoal: patch.waterGoal ?? current.waterGoal,
    stepsGoal: patch.stepsGoal ?? current.stepsGoal,
  });
  const next: WellnessStore = {
    ...base,
    days: { ...base.days, [today]: nextDay },
  };
  if (typeof patch.waterGoal === "number") next.waterGoal = nextDay.waterGoal;
  if (typeof patch.stepsGoal === "number") next.stepsGoal = nextDay.stepsGoal;
  return next;
}

export function setWaterCount(store: WellnessStore, count: number, today = todayKeyFlorida()) {
  const current = (ensureToday(store, today).days[today] || emptyDay(today, store));
  const water = clipInt(count, 0, 0, MAX_WATER);
  const stamp = nowTimeEastern();
  let times = [...current.waterTimes];
  if (water > times.length) {
    while (times.length < water) times.push(stamp);
  } else {
    times = times.slice(0, water);
  }
  return patchToday(store, { water, waterTimes: times }, today);
}

export function weekKeys(today = todayKeyFlorida()) {
  return Array.from({ length: 7 }, (_, i) => shiftDateKey(today, i - 6));
}

export function weekDays(store: WellnessStore, today = todayKeyFlorida()): WeekDay[] {
  return weekKeys(today).map((key) => ({
    key,
    dow: weekdayShort(key),
    isToday: key === today,
    log: store.days[key] || null,
  }));
}

export function consecutiveStreak(
  store: WellnessStore,
  hit: (log: DayLog | null) => boolean,
  today = todayKeyFlorida()
) {
  const start = hit(store.days[today] || null) ? 0 : 1;
  let n = 0;
  for (let i = start; i < KEEP_DAYS; i++) {
    const key = shiftDateKey(today, -i);
    if (!hit(store.days[key] || null)) break;
    n += 1;
  }
  return n;
}

export function moodStreak(store: WellnessStore, today = todayKeyFlorida()) {
  return consecutiveStreak(store, (log) => Boolean(log?.mood), today);
}

export function waterGoalStreak(store: WellnessStore, today = todayKeyFlorida()) {
  return consecutiveStreak(
    store,
    (log) => Boolean(log && log.waterGoal > 0 && log.water >= log.waterGoal),
    today
  );
}

export function stepsGoalStreak(store: WellnessStore, today = todayKeyFlorida()) {
  return consecutiveStreak(
    store,
    (log) => Boolean(log && log.stepsGoal > 0 && log.stepsDone >= log.stepsGoal),
    today
  );
}

export function stepsMiles(steps: number) {
  return Math.round((steps / 2100) * 10) / 10;
}

export function waterOz(glasses: number) {
  return glasses * 8;
}

export function moodById(id?: string) {
  return MOOD_OPTIONS.find((m) => m.id === id);
}

export function allMoves(custom: CustomMove[]) {
  const seen = new Set<string>();
  const list: { id: string; label: string; emoji: string; minutes: number; custom?: boolean }[] = [];
  for (const m of DAILY_MOVES) {
    seen.add(m.id);
    list.push({ ...m });
  }
  for (const m of custom) {
    if (seen.has(m.id)) continue;
    seen.add(m.id);
    list.push({ ...m, custom: true });
  }
  return list;
}

export function moveMinutes(ids: string[], custom: CustomMove[]) {
  const catalog = allMoves(custom);
  return ids.reduce((sum, id) => {
    const found = catalog.find((m) => m.id === id);
    return sum + (found?.minutes || 0);
  }, 0);
}

export type WeekSummary = {
  moodDays: number;
  waterHits: number;
  stepsAvg: number;
  stepsDays: number;
  wins: number;
  winMinutes: number;
};

export function weekSummary(store: WellnessStore, today = todayKeyFlorida()): WeekSummary {
  const days = weekDays(store, today);
  let moodDays = 0;
  let waterHits = 0;
  let stepsSum = 0;
  let stepsDays = 0;
  let wins = 0;
  let winMinutes = 0;
  for (const d of days) {
    if (d.log?.mood) moodDays += 1;
    if (d.log && d.log.water >= d.log.waterGoal && d.log.waterGoal > 0) waterHits += 1;
    if (d.log && d.log.stepsDone > 0) {
      stepsSum += d.log.stepsDone;
      stepsDays += 1;
    }
    if (d.log?.moves.length) {
      wins += d.log.moves.length;
      winMinutes += moveMinutes(d.log.moves, store.customMoves);
    }
  }
  return {
    moodDays,
    waterHits,
    stepsAvg: stepsDays ? Math.round(stepsSum / stepsDays) : 0,
    stepsDays,
    wins,
    winMinutes,
  };
}

export function heatNudge(water: number, waterGoal: number, hour = floridaHour()) {
  if (water >= waterGoal && waterGoal > 0) return null;
  if (hour >= 13 && hour < 18 && water < waterGoal * 0.5) {
    return "Afternoon heat is doing its thing. Another glass is a power move.";
  }
  if (hour >= 18 && water < waterGoal * 0.75) {
    return "Evening square energy pairs well with water.";
  }
  return null;
}

export function newCustomMove(label: string, minutes = 5): CustomMove {
  return {
    id: uid("win"),
    label: label.trim().slice(0, 48),
    emoji: "✨",
    minutes: clipInt(minutes, 5, 1, 180),
  };
}
