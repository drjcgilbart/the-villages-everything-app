"use client";

import { useEffect, useMemo, useState } from "react";
import {
  nowTimeEastern,
  playAlarmTone,
  todayKeyEastern,
  uid,
  type AlarmTone,
} from "@/lib/mySpaceStorage";
import { useMemberBoard } from "@/components/useMemberBoard";

const KEY = "tvea-ms-health-v2";

type HistoryRange = "day" | "week" | "month" | "year" | "all" | "custom";
type HealthTab =
  | "overview"
  | "meds"
  | "meals"
  | "exercise"
  | "sleep"
  | "photos"
  | "journal"
  | "goals";

type DoseTime = {
  id: string;
  time: string;
  label: string;
  enabled: boolean;
};

type Medication = {
  id: string;
  name: string;
  dosage: string;
  schedule: string;
  notes: string;
  timesPerDay: number;
  doseTimes: DoseTime[];
  alarmEnabled: boolean;
  active: boolean;
};

type MedicationLog = {
  id: string;
  medicationId: string;
  medicationName: string;
  dosage: string;
  date: string;
  time: string;
  scheduledTime: string;
  doseTimeId?: string;
  notes: string;
};

type Meal = {
  id: string;
  date: string;
  time: string;
  mealType: string;
  title: string;
  calories: number | null;
  notes: string;
  photoName: string;
};

type Exercise = {
  id: string;
  date: string;
  time: string;
  activity: string;
  durationMin: number | null;
  distance: number | null;
  distanceUnit: "mi" | "km" | "m";
  calories: number | null;
  notes: string;
};

type SleepLog = {
  id: string;
  date: string;
  hours: number | null;
  quality: string;
  notes: string;
  bedtime: string;
  waketime: string;
  interruptions: number | null;
};

type Journal = {
  id: string;
  date: string;
  title: string;
  mood: string;
  body: string;
};

type ProgressPhoto = {
  id: string;
  date: string;
  caption: string;
  weight: number | null;
  photoName: string;
};

type WeightEntry = {
  date: string;
  weight: number | null;
  notes: string;
};

type DayHabit = {
  waterOz: number;
  steps: number;
  proteinG: number;
  walked: boolean;
  water: boolean;
  protein: boolean;
  sleep: boolean;
  strength: boolean;
};

type HealthState = {
  unit: "lbs";
  startWeight: number | null;
  currentWeight: number | null;
  goalWeight: number | null;
  heightInches: number | null;
  dailyCalorieTarget: number;
  dailyWaterGoalOz: number;
  dailyStepsGoal: number;
  dailyProteinGoalG: number;
  sleepGoalHours: number;
  medAlarmSound: AlarmTone;
  medAlarmDurationSec: number;
  medAlarmEnabled: boolean;
  habits: Record<string, DayHabit>;
  entries: WeightEntry[];
  meals: Meal[];
  exercises: Exercise[];
  journals: Journal[];
  medications: Medication[];
  medicationLogs: MedicationLog[];
  sleeps: SleepLog[];
  progressPhotos: ProgressPhoto[];
};

const EXERCISE_PRESETS = [
  "Swimming",
  "Walking",
  "Running",
  "Cycling",
  "Strength training",
  "Yoga / stretch",
  "Golf",
  "Pickleball",
  "Elliptical",
  "Other",
];

const MEAL_TYPES = [
  { id: "breakfast", label: "Breakfast" },
  { id: "lunch", label: "Lunch" },
  { id: "dinner", label: "Dinner" },
  { id: "snack", label: "Snack" },
  { id: "omd", label: "OMD (One Meal a Day)" },
];

const SLEEP_QUALITIES = [
  { id: "great", label: "Great", emoji: "😴", score: 5 },
  { id: "good", label: "Good", emoji: "😊", score: 4 },
  { id: "average", label: "Average", emoji: "😐", score: 3 },
  { id: "below-average", label: "Below Average", emoji: "😕", score: 2 },
  { id: "terrible", label: "Terrible", emoji: "😫", score: 1 },
];

const HABIT_DEFS: { key: keyof DayHabit; label: (goal: number) => string }[] = [
  { key: "walked", label: () => "Moved / walked today" },
  { key: "water", label: () => "Hit water goal" },
  { key: "protein", label: () => "Hit protein goal" },
  { key: "sleep", label: (goal) => `Hit sleep goal (${goal}h)` },
  { key: "strength", label: () => "Strength or stretch" },
];

const QUOTES = [
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { text: "Small daily improvements are the key to staggering long-term results.", author: "Unknown" },
  { text: "Take care of your body. It’s the only place you have to live.", author: "Jim Rohn" },
  { text: "You don’t have to be extreme, just consistent.", author: "Unknown" },
  { text: "Progress, not perfection.", author: "Unknown" },
  { text: "A year from now you may wish you had started today.", author: "Karen Lamb" },
  { text: "Fall in love with taking care of yourself.", author: "Unknown" },
  { text: "The groundwork of all happiness is health.", author: "Leigh Hunt" },
  { text: "Slow progress is still progress.", author: "Unknown" },
  { text: "The scale is data, not a verdict on your worth.", author: "Unknown" },
  { text: "Show up for yourself today. Tomorrow will thank you.", author: "Unknown" },
  { text: "Drink water, move your body, rest well, be kind to yourself.", author: "Unknown" },
  { text: "Consistency beats intensity when intensity is inconsistent.", author: "Unknown" },
  { text: "Focus on being healthier, not just lighter.", author: "Unknown" },
];

const DEFAULT_DOSE_TIMES: Record<number, string[]> = {
  1: ["08:00"],
  2: ["08:00", "20:00"],
  3: ["08:00", "14:00", "20:00"],
  4: ["08:00", "12:00", "16:00", "20:00"],
  5: ["07:00", "10:00", "13:00", "17:00", "21:00"],
  6: ["07:00", "10:00", "13:00", "16:00", "19:00", "22:00"],
};

const HISTORY_RANGES: { id: HistoryRange; label: string }[] = [
  { id: "day", label: "Day" },
  { id: "week", label: "Week" },
  { id: "month", label: "Month" },
  { id: "year", label: "Year" },
  { id: "all", label: "All time" },
  { id: "custom", label: "Custom" },
];

const TABS: { id: HealthTab; label: string; icon: string }[] = [
  { id: "overview", label: "Overview", icon: "💚" },
  { id: "meds", label: "Meds", icon: "💊" },
  { id: "meals", label: "Meals", icon: "🍽️" },
  { id: "exercise", label: "Exercise", icon: "🏃" },
  { id: "sleep", label: "Sleep", icon: "😴" },
  { id: "photos", label: "Photos", icon: "📷" },
  { id: "journal", label: "Journal", icon: "📓" },
];

function emptyHabit(): DayHabit {
  return {
    waterOz: 0,
    steps: 0,
    proteinG: 0,
    walked: false,
    water: false,
    protein: false,
    sleep: false,
    strength: false,
  };
}

function defaultState(): HealthState {
  return {
    unit: "lbs",
    startWeight: null,
    currentWeight: null,
    goalWeight: null,
    heightInches: null,
    dailyCalorieTarget: 1800,
    dailyWaterGoalOz: 64,
    dailyStepsGoal: 8000,
    dailyProteinGoalG: 120,
    sleepGoalHours: 8,
    medAlarmSound: "classic",
    medAlarmDurationSec: 30,
    medAlarmEnabled: true,
    habits: {},
    entries: [],
    meals: [],
    exercises: [],
    journals: [],
    medications: [],
    medicationLogs: [],
    sleeps: [],
    progressPhotos: [],
  };
}

function dateOffset(dateStr: string, days: number): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + days);
  return dt.toISOString().slice(0, 10);
}

function fmtShortDate(dateStr: string): string {
  if (!dateStr) return "—";
  return new Date(`${dateStr}T12:00:00`).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function formatMedTime(hhmm: string): string {
  if (!/^\d{2}:\d{2}$/.test(hhmm || "")) return hhmm || "—";
  const [h, m] = hhmm.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = ((h + 11) % 12) + 1;
  return `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

function num(v: unknown): number | null {
  if (v == null || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

function calcBmi(weight: number | null, heightIn: number | null): number | null {
  if (!weight || !heightIn || heightIn <= 0) return null;
  return round1((weight * 703) / (heightIn * heightIn));
}

function bmiLabel(bmiVal: number | null): string {
  if (bmiVal == null) return "Add height";
  if (bmiVal < 18.5) return "Underweight";
  if (bmiVal < 25) return "Healthy range";
  if (bmiVal < 30) return "Overweight";
  return "Obese range";
}

function quoteForDate(dateStr: string) {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash * 31 + dateStr.charCodeAt(i)) >>> 0;
  }
  return QUOTES[hash % QUOTES.length];
}

function defaultDoseTimes(timesPerDay: number): DoseTime[] {
  let n = Math.min(12, Math.max(1, Math.round(timesPerDay || 1)));
  const template = DEFAULT_DOSE_TIMES[n];
  const times = template
    ? [...template]
    : Array.from({ length: n }, (_, i) => {
        const hour = Math.min(23, 7 + Math.floor((i * 14) / Math.max(1, n - 1)));
        return `${String(hour).padStart(2, "0")}:00`;
      });
  return times.map((time, i) => ({
    id: uid("dose"),
    time,
    label: n === 1 ? "Daily dose" : n === 2 ? (i === 0 ? "Morning" : "Evening") : `Dose ${i + 1}`,
    enabled: true,
  }));
}

function historyWindow(
  range: HistoryRange,
  today: string,
  custom: { start: string; end: string }
): { start: string; end: string } {
  if (range === "day") return { start: today, end: today };
  if (range === "week") return { start: dateOffset(today, -6), end: today };
  if (range === "month") return { start: dateOffset(today, -29), end: today };
  if (range === "year") return { start: dateOffset(today, -364), end: today };
  if (range === "custom") {
    const start = custom.start || dateOffset(today, -6);
    const end = custom.end || today;
    return start <= end ? { start, end } : { start: end, end: start };
  }
  return { start: "0000-01-01", end: "9999-12-31" };
}

function rangePhrase(range: HistoryRange): string {
  return (
    {
      day: "today",
      week: "the last week",
      month: "the last month",
      year: "the last year",
      all: "all time",
      custom: "this custom range",
    }[range] || "this period"
  );
}

function hoursFromBedWake(bed: string, wake: string): number | null {
  if (!/^\d{2}:\d{2}$/.test(bed || "") || !/^\d{2}:\d{2}$/.test(wake || "")) return null;
  const [bh, bm] = bed.split(":").map(Number);
  const [wh, wm] = wake.split(":").map(Number);
  let mins = wh * 60 + wm - (bh * 60 + bm);
  if (mins <= 0) mins += 24 * 60;
  return Math.min(18, Math.max(0.5, Math.round((mins / 60) * 4) / 4));
}

function sleepQualityMeta(id: string) {
  return SLEEP_QUALITIES.find((q) => q.id === id) || SLEEP_QUALITIES[2];
}

function computeSleepStats(sleeps: SleepLog[], goalHours: number, today: string) {
  const goal = goalHours || 8;
  const sorted = [...sleeps]
    .filter((s) => s && s.date && s.hours != null)
    .sort((a, b) => a.date.localeCompare(b.date));
  const lastNight = sorted.filter((s) => s.date <= today).slice(-1)[0] || null;
  const weekStart = dateOffset(today, -6);
  const week = sorted.filter((s) => s.date >= weekStart && s.date <= today);
  const hoursThisWeek = round1(week.reduce((sum, s) => sum + (s.hours || 0), 0));
  const avgHours = week.length ? round1(hoursThisWeek / week.length) : null;
  const debt = week.length ? round1(goal * week.length - hoursThisWeek) : 0;
  let streak = 0;
  let cursor = today;
  const byDate = new Map(sorted.map((s) => [s.date, s]));
  if (!byDate.has(cursor)) cursor = dateOffset(today, -1);
  while (true) {
    const log = byDate.get(cursor);
    if (!log || (log.hours || 0) < goal) break;
    streak += 1;
    cursor = dateOffset(cursor, -1);
    if (streak > 400) break;
  }
  const last7days = [];
  for (let i = 6; i >= 0; i--) {
    const date = dateOffset(today, -i);
    last7days.push({ date, log: byDate.get(date) || null });
  }
  return { lastNight, avgHours, hoursThisWeek, nightsLogged: week.length, debt, streak, last7days, goal };
}

function asArray<T>(v: unknown): T[] {
  return Array.isArray(v) ? (v as T[]) : [];
}

function hydrateHealth(raw: Record<string, unknown> | HealthState): HealthState {
  const r = (raw || {}) as Record<string, unknown>;
  const base = defaultState();
  const habitsIn = (r.habits && typeof r.habits === "object" ? r.habits : {}) as Record<
    string,
    Partial<DayHabit>
  >;
  const habits: Record<string, DayHabit> = {};
  for (const [k, v] of Object.entries(habitsIn)) {
    habits[k] = { ...emptyHabit(), ...v };
  }

  let entries = asArray<WeightEntry>(r.entries).map((e) => ({
    date: String(e.date || ""),
    weight: num(e.weight),
    notes: String(e.notes || ""),
  }));
  const oldLog = asArray<{ date: string; weight: number }>(r.weightLog);
  if (!entries.length && oldLog.length) {
    entries = oldLog.map((e) => ({
      date: String(e.date || ""),
      weight: num(e.weight),
      notes: "",
    }));
  }

  const meals = asArray<Meal & { name?: string; note?: string; calories?: number | null }>(r.meals).map(
    (m) => ({
      id: m.id || uid("meal"),
      date: String(m.date || ""),
      time: String(m.time || "12:00"),
      mealType: String(m.mealType || "meal"),
      title: String(m.title || m.name || "Meal").slice(0, 120),
      calories: num(m.calories),
      notes: String(m.notes || m.note || ""),
      photoName: String(m.photoName || ""),
    })
  );

  const exercises: Exercise[] = asArray<Exercise & { minutes?: number | null }>(r.exercises).map(
    (e) => ({
      id: e.id || uid("ex"),
      date: String(e.date || ""),
      time: String(e.time || "12:00"),
      activity: String(e.activity || "Other"),
      durationMin: num(e.durationMin ?? e.minutes),
      distance: num(e.distance),
      distanceUnit: (e.distanceUnit === "km" || e.distanceUnit === "m" ? e.distanceUnit : "mi") as
        | "mi"
        | "km"
        | "m",
      calories: num(e.calories),
      notes: String(e.notes || ""),
    })
  );

  const journals = asArray<Journal & { text?: string }>(r.journals).map((j) => ({
    id: j.id || uid("j"),
    date: String(j.date || ""),
    title: String(j.title || ""),
    mood: String(j.mood || ""),
    body: String(j.body || j.text || ""),
  }));

  const sleeps = asArray<SleepLog & { note?: string }>(r.sleeps).map((s) => ({
    id: s.id || uid("sl"),
    date: String(s.date || ""),
    hours: num(s.hours),
    quality: String(s.quality || "average"),
    notes: String(s.notes || s.note || ""),
    bedtime: String(s.bedtime || ""),
    waketime: String(s.waketime || ""),
    interruptions: num(s.interruptions),
  }));

  const progressPhotos = asArray<ProgressPhoto & { note?: string }>(r.progressPhotos).map((p) => ({
    id: p.id || uid("pp"),
    date: String(p.date || ""),
    caption: String(p.caption || p.note || ""),
    weight: num(p.weight),
    photoName: String(p.photoName || ""),
  }));

  const medications = asArray<Medication>(r.medications).map((m) => {
    let doseTimes = Array.isArray(m.doseTimes) ? m.doseTimes.filter(Boolean) : [];
    if (!doseTimes.length) doseTimes = defaultDoseTimes(Number(m.timesPerDay) || 1);
    return {
      id: m.id || uid("med"),
      name: String(m.name || "Medication").slice(0, 120),
      dosage: String(m.dosage || ""),
      schedule: String(m.schedule || ""),
      notes: String(m.notes || ""),
      timesPerDay: Math.max(1, doseTimes.length),
      doseTimes,
      alarmEnabled: m.alarmEnabled !== false,
      active: m.active !== false,
    };
  });

  let medicationLogs = asArray<MedicationLog>(r.medicationLogs);
  const medDone = (r.medDone && typeof r.medDone === "object" ? r.medDone : {}) as Record<
    string,
    boolean
  >;
  if (!medicationLogs.length && Object.keys(medDone).length) {
    for (const [key, done] of Object.entries(medDone)) {
      if (!done) continue;
      const [medId, doseId, date] = key.split(":");
      const med = medications.find((m) => m.id === medId);
      const slot = med?.doseTimes.find((d) => d.id === doseId);
      medicationLogs.push({
        id: uid("mlog"),
        medicationId: medId,
        medicationName: med?.name || "Medication",
        dosage: med?.dosage || "",
        date: date || "",
        time: slot?.time || "08:00",
        scheduledTime: slot?.time || "",
        doseTimeId: doseId,
        notes: "",
      });
    }
  }

  return {
    ...base,
    unit: "lbs",
    startWeight: num(r.startWeight) ?? base.startWeight,
    currentWeight: num(r.currentWeight) ?? base.currentWeight,
    goalWeight: num(r.goalWeight) ?? base.goalWeight,
    heightInches: num(r.heightInches) ?? base.heightInches,
    dailyCalorieTarget: Number(r.dailyCalorieTarget) || base.dailyCalorieTarget,
    dailyWaterGoalOz: Number(r.dailyWaterGoalOz) || base.dailyWaterGoalOz,
    dailyStepsGoal: Number(r.dailyStepsGoal) || base.dailyStepsGoal,
    dailyProteinGoalG: Number(r.dailyProteinGoalG) || base.dailyProteinGoalG,
    sleepGoalHours: Number(r.sleepGoalHours) || base.sleepGoalHours,
    medAlarmSound: (r.medAlarmSound as AlarmTone) || "classic",
    medAlarmDurationSec: Number(r.medAlarmDurationSec) || 30,
    medAlarmEnabled: r.medAlarmEnabled !== false,
    habits,
    entries,
    meals,
    exercises,
    journals,
    medications,
    medicationLogs,
    sleeps,
    progressPhotos,
  };
}

function HistoryTabs({
  value,
  onChange,
  custom,
  onCustom,
}: {
  value: HistoryRange;
  onChange: (r: HistoryRange) => void;
  custom: { start: string; end: string };
  onCustom: (next: { start: string; end: string }) => void;
}) {
  return (
    <div>
      <div className="ms-h-range" role="tablist" aria-label="History range">
        {HISTORY_RANGES.map((r) => (
          <button
            key={r.id}
            type="button"
            className={`ms-h-range-btn ${value === r.id ? "active" : ""}`}
            onClick={() => onChange(r.id)}
          >
            {r.label}
          </button>
        ))}
      </div>
      {value === "custom" && (
        <div className="form-grid ms-module-form" style={{ marginTop: "0.65rem" }}>
          <div className="field">
            <label>Start date</label>
            <input
              type="date"
              value={custom.start}
              onChange={(e) => onCustom({ ...custom, start: e.target.value })}
            />
          </div>
          <div className="field">
            <label>End date</label>
            <input
              type="date"
              value={custom.end}
              onChange={(e) => onCustom({ ...custom, end: e.target.value })}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function WeightChart({
  points,
  start,
  goal,
}: {
  points: { date: string; weight: number }[];
  start: number | null;
  goal: number | null;
}) {
  if (points.length < 2) {
    return <p className="panel-hint">Log a couple of weigh-ins to see the chart.</p>;
  }
  const w = 520;
  const h = 160;
  const pad = 28;
  const weights = points.map((p) => p.weight);
  if (start != null) weights.push(start);
  if (goal != null) weights.push(goal);
  const min = Math.min(...weights) - 2;
  const max = Math.max(...weights) + 2;
  const span = Math.max(0.5, max - min);
  const x = (i: number) => pad + (i * (w - pad * 2)) / Math.max(1, points.length - 1);
  const y = (v: number) => pad + ((max - v) / span) * (h - pad * 2);
  const d = points.map((p, i) => `${i === 0 ? "M" : "L"} ${x(i).toFixed(1)} ${y(p.weight).toFixed(1)}`).join(" ");
  return (
    <svg className="ms-h-chart" viewBox={`0 0 ${w} ${h}`} role="img" aria-label="Weight chart">
      {start != null && (
        <line
          x1={pad}
          x2={w - pad}
          y1={y(start)}
          y2={y(start)}
          stroke="rgba(31,107,74,0.35)"
          strokeDasharray="4 4"
        />
      )}
      {goal != null && (
        <line
          x1={pad}
          x2={w - pad}
          y1={y(goal)}
          y2={y(goal)}
          stroke="rgba(232,184,74,0.9)"
          strokeDasharray="4 4"
        />
      )}
      <path d={d} fill="none" stroke="#1f6b4a" strokeWidth="2.5" />
      {points.map((p, i) => (
        <circle key={p.date} cx={x(i)} cy={y(p.weight)} r="3.5" fill="#1f6b4a" />
      ))}
      <text x={pad} y={14} fontSize="11" fill="#5b6573">
        Logged
        {start != null ? " · start" : ""}
        {goal != null ? " · goal" : ""}
      </text>
    </svg>
  );
}

function pct(n: number, goal: number): number {
  if (!goal) return 0;
  return clamp(Math.round((n / goal) * 100), 0, 100);
}

/**
 * Health lanai — same feature set as My Retirement Reboot Health,
 * saved to the Hub member account (no photo files on the server).
 */
export function MySpaceHealthBoard() {
  const { value, save, ready } = useMemberBoard<HealthState>(
    "health",
    defaultState(),
    true,
    { localKey: KEY, debounceMs: 700 }
  );
  const state = useMemo(
    () => hydrateHealth((value || {}) as Record<string, unknown>),
    [value]
  );
  const [tab, setTab] = useState<HealthTab>("overview");
  const [weightInput, setWeightInput] = useState("");
  const [weightNote, setWeightNote] = useState("");
  const [mealType, setMealType] = useState("breakfast");
  const [mealTitle, setMealTitle] = useState("");
  const [mealPick, setMealPick] = useState("__new__");
  const [mealCal, setMealCal] = useState("");
  const [mealDate, setMealDate] = useState("");
  const [mealTime, setMealTime] = useState("");
  const [mealNotes, setMealNotes] = useState("");
  const [mealPhotoName, setMealPhotoName] = useState("");
  const [exActivity, setExActivity] = useState("Swimming");
  const [exCustom, setExCustom] = useState("");
  const [exMin, setExMin] = useState("30");
  const [exDist, setExDist] = useState("");
  const [exUnit, setExUnit] = useState<"mi" | "km" | "m">("mi");
  const [exCal, setExCal] = useState("");
  const [exNotes, setExNotes] = useState("");
  const [sleepDate, setSleepDate] = useState("");
  const [sleepHours, setSleepHours] = useState("7.5");
  const [sleepBed, setSleepBed] = useState("");
  const [sleepWake, setSleepWake] = useState("");
  const [sleepWakes, setSleepWakes] = useState("0");
  const [sleepQuality, setSleepQuality] = useState("good");
  const [sleepNotes, setSleepNotes] = useState("");
  const [photoCaption, setPhotoCaption] = useState("");
  const [photoWeight, setPhotoWeight] = useState("");
  const [photoName, setPhotoName] = useState("");
  const [journalTitle, setJournalTitle] = useState("");
  const [journalMood, setJournalMood] = useState("");
  const [journalBody, setJournalBody] = useState("");
  const [reviewJournalId, setReviewJournalId] = useState<string | null>(null);
  const [medName, setMedName] = useState("");
  const [medDose, setMedDose] = useState("");
  const [medTimes, setMedTimes] = useState("1");
  const [medSchedule, setMedSchedule] = useState("");
  const [medNotes, setMedNotes] = useState("");
  const [medAlarmOn, setMedAlarmOn] = useState(true);
  const [newDoseTime, setNewDoseTime] = useState("12:00");
  const [newDoseLabel, setNewDoseLabel] = useState("");
  const [doseMedId, setDoseMedId] = useState<string | null>(null);
  const [medHistQ, setMedHistQ] = useState("");
  const [hist, setHist] = useState<Record<string, HistoryRange>>({
    meds: "week",
    meals: "week",
    exercise: "week",
    sleep: "week",
  });
  const [custom, setCustom] = useState<Record<string, { start: string; end: string }>>({
    meds: { start: "", end: "" },
    meals: { start: "", end: "" },
    exercise: { start: "", end: "" },
    sleep: { start: "", end: "" },
  });
  const [dictating, setDictating] = useState(false);

  const today = todayKeyEastern();

  useEffect(() => {
    if (!mealDate) setMealDate(today);
    if (!mealTime) setMealTime(nowTimeEastern());
    if (!sleepDate) setSleepDate(today);
  }, [today, mealDate, mealTime, sleepDate]);

  useEffect(() => {
    const todayJ = state.journals.find((j) => j.date === today);
    if (todayJ && !journalBody) {
      setJournalTitle(todayJ.title);
      setJournalMood(todayJ.mood);
      setJournalBody(todayJ.body);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, today]);

  function persist(next: HealthState) {
    void save(next);
  }

  const habit = { ...emptyHabit(), ...(state.habits[today] || {}) };

  function patchHabit(patch: Partial<DayHabit>) {
    persist({
      ...state,
      habits: { ...state.habits, [today]: { ...habit, ...patch } },
    });
  }

  const bmiVal = calcBmi(state.currentWeight, state.heightInches);
  const lost =
    state.startWeight != null && state.currentWeight != null
      ? round1(state.startWeight - state.currentWeight)
      : null;
  const remaining =
    state.goalWeight != null && state.currentWeight != null
      ? round1(state.currentWeight - state.goalWeight)
      : null;
  const journeyPct =
    state.startWeight != null && state.goalWeight != null && state.currentWeight != null
      ? clamp(
          Math.round(
            ((state.startWeight - state.currentWeight) /
              Math.max(0.1, Math.abs(state.startWeight - state.goalWeight))) *
              100
          ),
          0,
          100
        )
      : null;

  const weightPoints = useMemo(
    () =>
      [...state.entries]
        .filter((e) => e.weight != null)
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(-30)
        .map((e) => ({ date: e.date, weight: e.weight as number })),
    [state.entries]
  );

  const weekStart = dateOffset(today, -6);
  const weekWeights = state.entries.filter(
    (e) => e.weight != null && e.date >= weekStart && e.date <= today
  );
  const weeklyAvg = weekWeights.length
    ? round1(weekWeights.reduce((s, e) => s + (e.weight || 0), 0) / weekWeights.length)
    : null;

  const sleepStats = useMemo(
    () => computeSleepStats(state.sleeps, state.sleepGoalHours, today),
    [state.sleeps, state.sleepGoalHours, today]
  );

  const quote = quoteForDate(today);
  const todayMeals = state.meals.filter((m) => m.date === today);
  const todayExMin = state.exercises
    .filter((e) => e.date === today)
    .reduce((s, e) => s + (e.durationMin || 0), 0);

  const activeMeds = state.medications.filter((m) => m.active);
  const todaySlots = activeMeds.flatMap((med) =>
    med.doseTimes
      .filter((d) => d.enabled)
      .map((dose) => {
        const log = state.medicationLogs.find(
          (l) => l.medicationId === med.id && l.date === today && l.doseTimeId === dose.id
        );
        return { med, dose, log };
      })
  );
  const due = todaySlots.length;
  const taken = todaySlots.filter((s) => s.log).length;
  const now = nowTimeEastern();
  const nextUp = todaySlots.find((s) => !s.log);

  const adherence = useMemo(() => {
    const last7 = [];
    for (let i = 6; i >= 0; i--) {
      const date = dateOffset(today, -i);
      let dayDue = 0;
      let dayTaken = 0;
      for (const med of activeMeds) {
        for (const slot of med.doseTimes.filter((d) => d.enabled)) {
          dayDue += 1;
          if (
            state.medicationLogs.some(
              (l) => l.medicationId === med.id && l.date === date && l.doseTimeId === slot.id
            )
          ) {
            dayTaken += 1;
          }
        }
      }
      last7.push({
        date,
        due: dayDue,
        taken: dayTaken,
        complete: dayDue > 0 && dayTaken >= dayDue,
      });
    }
    const weekDue = last7.reduce((s, d) => s + d.due, 0);
    const weekTaken = last7.reduce((s, d) => s + d.taken, 0);
    return {
      last7,
      weekDue,
      weekTaken,
      weekPct: weekDue ? Math.round((weekTaken / weekDue) * 100) : null,
    };
  }, [activeMeds, state.medicationLogs, today]);

  useEffect(() => {
    if (!ready || !state.medAlarmEnabled) return;
    const fired = new Set<string>();
    const tick = () => {
      const t = nowTimeEastern();
      const d = todayKeyEastern();
      for (const med of state.medications) {
        if (!med.active || !med.alarmEnabled) continue;
        for (const dose of med.doseTimes) {
          if (!dose.enabled || dose.time !== t) continue;
          const already = state.medicationLogs.some(
            (l) => l.medicationId === med.id && l.date === d && l.doseTimeId === dose.id
          );
          const key = `${med.id}:${dose.id}:${d}`;
          if (already || fired.has(key)) continue;
          fired.add(key);
          playAlarmTone(state.medAlarmSound, state.medAlarmDurationSec || 8);
        }
      }
    };
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, [
    ready,
    state.medAlarmEnabled,
    state.medAlarmSound,
    state.medAlarmDurationSec,
    state.medications,
    state.medicationLogs,
  ]);

  function markDose(
    med: Medication,
    dose: DoseTime | null,
    done: boolean,
    time = nowTimeEastern()
  ) {
    let logs = [...state.medicationLogs];
    if (done) {
      const existing = logs.find(
        (l) =>
          l.medicationId === med.id &&
          l.date === today &&
          (dose ? l.doseTimeId === dose.id : !l.doseTimeId)
      );
      if (existing) {
        logs = logs.map((l) => (l.id === existing.id ? { ...l, time } : l));
      } else {
        logs.push({
          id: uid("mlog"),
          medicationId: med.id,
          medicationName: med.name,
          dosage: med.dosage,
          date: today,
          time,
          scheduledTime: dose?.time || "",
          doseTimeId: dose?.id,
          notes: "",
        });
      }
    } else {
      logs = logs.filter(
        (l) =>
          !(
            l.medicationId === med.id &&
            l.date === today &&
            (dose ? l.doseTimeId === dose.id : !l.doseTimeId)
          )
      );
    }
    persist({ ...state, medicationLogs: logs });
  }

  function filterByRange<T extends { date: string }>(items: T[], tabId: string): T[] {
    const range = hist[tabId] || "week";
    const win = historyWindow(range, today, custom[tabId] || { start: today, end: today });
    return items.filter((item) => item.date >= win.start && item.date <= win.end);
  }

  const mealSuggestions = useMemo(() => {
    const counts = new Map<string, number>();
    for (const m of state.meals) {
      const t = m.title.trim();
      if (!t) continue;
      counts.set(t, (counts.get(t) || 0) + 1);
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([title, count]) => ({ title, count }));
  }, [state.meals]);

  function confirmClear(label: string, message: string): boolean {
    return window.confirm(message || `Clear all ${label}? This cannot be undone.`);
  }

  if (!ready) return <p className="panel-hint">Loading health lanai…</p>;

  const reviewing = reviewJournalId
    ? state.journals.find((j) => j.id === reviewJournalId)
    : null;

  return (
    <div className="ms-health-board">
      <p className="ms-module-lead">
        Weight, meds, meals, movement, sleep, photos, and a journal — private on your Hub
        account (same idea as the desktop Villages dashboard). Not medical advice.
      </p>

      <div className="ms-h-tiles" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`ms-h-tile ${tab === t.id ? "active" : ""}`}
            onClick={() => setTab(t.id)}
          >
            <span aria-hidden="true">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      <div className="ms-h-toolbar">
        <span className="ms-h-pill">Tracking</span>
        <span className="panel-hint">Today · {today}</span>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => setTab("goals")}>
          Edit goals
        </button>
      </div>
      <p className="panel-hint">
        Personal wellness notebook only — not a medical app, not a diagnosis, and not treatment.
        Follow your own doctor or pharmacist.
      </p>

      {tab === "overview" && (
        <div className="about-panel ms-module">
          <div className="ms-h-quote">
            <div className="panel-hint">Today’s motivation</div>
            <p>
              “{quote.text}”
              <span> — {quote.author}</span>
            </p>
          </div>

          <div className="ms-stat-row">
            <div className="ms-stat">
              <span>Current</span>
              <strong>
                {state.currentWeight != null ? `${state.currentWeight} lbs` : "—"}
              </strong>
              <em>Start {state.startWeight != null ? `${state.startWeight} lbs` : "—"}</em>
            </div>
            <div className="ms-stat">
              <span>Goal</span>
              <strong>{state.goalWeight != null ? `${state.goalWeight} lbs` : "—"}</strong>
              <em>
                {remaining != null ? `${Math.abs(remaining)} lbs to go` : "Set a goal"}
              </em>
            </div>
            <div className="ms-stat">
              <span>Weekly avg</span>
              <strong>{weeklyAvg ?? "—"}</strong>
              <em>{weekWeights.length ? `${weekWeights.length} weigh-ins` : "Log this week"}</em>
            </div>
            <div className="ms-stat">
              <span>Lost so far</span>
              <strong>{lost != null ? lost : "—"}</strong>
              <em>lbs</em>
            </div>
            <div className="ms-stat">
              <span>BMI</span>
              <strong>{bmiVal ?? "—"}</strong>
              <em>{bmiLabel(bmiVal)}</em>
            </div>
          </div>

          <div className="ms-h-progress">
            <div className="ms-h-progress-head">
              <span>Journey progress</span>
              <strong>{journeyPct != null ? `${journeyPct}%` : "—"}</strong>
            </div>
            <div className="ms-h-bar" aria-hidden="true">
              <span style={{ width: `${journeyPct || 0}%` }} />
            </div>
          </div>

          <h4>Weight</h4>
          <WeightChart points={weightPoints} start={state.startWeight} goal={state.goalWeight} />

          <h4>Today’s fuel &amp; movement</h4>
          <div className="track-block">
            <div className="ms-h-track">
              <span>💧 Water</span>
              <strong>
                {habit.waterOz} / {state.dailyWaterGoalOz} oz
              </strong>
            </div>
            <div className="ms-h-mini">
              <span style={{ width: `${pct(habit.waterOz, state.dailyWaterGoalOz)}%` }} />
            </div>
            <div className="ms-h-quick">
              {[8, 12, 16].map((n) => (
                <button
                  key={n}
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => patchHabit({ waterOz: habit.waterOz + n })}
                >
                  +{n} oz
                </button>
              ))}
            </div>

            <div className="ms-h-track">
              <span>👟 Steps</span>
              <strong>
                {habit.steps.toLocaleString()} / {state.dailyStepsGoal.toLocaleString()}
              </strong>
            </div>
            <div className="ms-h-mini ms-h-mini-steps">
              <span style={{ width: `${pct(habit.steps, state.dailyStepsGoal)}%` }} />
            </div>
            <div className="ms-h-quick">
              {[1000, 2000, 5000].map((n) => (
                <button
                  key={n}
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => patchHabit({ steps: habit.steps + n })}
                >
                  +{n.toLocaleString()}
                </button>
              ))}
            </div>

            <div className="ms-h-track">
              <span>🥩 Protein</span>
              <strong>
                {habit.proteinG} / {state.dailyProteinGoalG} g
              </strong>
            </div>
            <div className="ms-h-mini ms-h-mini-protein">
              <span style={{ width: `${pct(habit.proteinG, state.dailyProteinGoalG)}%` }} />
            </div>
            <div className="ms-h-quick">
              {[20, 30, 40].map((n) => (
                <button
                  key={n}
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => patchHabit({ proteinG: habit.proteinG + n })}
                >
                  +{n} g
                </button>
              ))}
            </div>

            <div className="ms-h-track">
              <span>😴 Sleep</span>
              <strong>
                {sleepStats.lastNight
                  ? `${sleepStats.lastNight.hours}h · ${sleepQualityMeta(sleepStats.lastNight.quality).label}`
                  : "Not logged"}
              </strong>
            </div>
            <div className="ms-h-mini ms-h-mini-sleep">
              <span
                style={{
                  width: `${
                    sleepStats.lastNight?.hours
                      ? pct(sleepStats.lastNight.hours, state.sleepGoalHours)
                      : 0
                  }%`,
                }}
              />
            </div>
            <p className="panel-hint">
              {sleepStats.lastNight
                ? `Last night${sleepStats.streak ? ` · ${sleepStats.streak}-night goal streak` : ""}`
                : "Log last night on the Sleep tab"}
            </p>
            <p className="panel-hint">
              Today: {todayMeals.length} meal{todayMeals.length === 1 ? "" : "s"} · {todayExMin} min
              exercise · meds {taken}/{due} · calorie target {state.dailyCalorieTarget}
            </p>
          </div>

          <h4>Daily habits checklist</h4>
          <div className="ms-h-habits">
            {HABIT_DEFS.map((h) => (
              <label key={h.key} className="ms-check">
                <input
                  type="checkbox"
                  checked={Boolean(habit[h.key])}
                  onChange={(e) => patchHabit({ [h.key]: e.target.checked })}
                />
                {h.label(state.sleepGoalHours)}
              </label>
            ))}
          </div>

          <h4>Log weigh-in</h4>
          <form
            className="form-grid ms-module-form"
            onSubmit={(e) => {
              e.preventDefault();
              const w = Number(weightInput);
              if (!Number.isFinite(w) || w <= 0) return;
              const rounded = round1(w);
              persist({
                ...state,
                currentWeight: rounded,
                startWeight: state.startWeight ?? rounded,
                entries: [
                  ...state.entries.filter((x) => x.date !== today),
                  { date: today, weight: rounded, notes: weightNote.trim().slice(0, 200) },
                ].sort((a, b) => a.date.localeCompare(b.date)),
              });
              setWeightInput("");
              setWeightNote("");
            }}
          >
            <div className="field">
              <label>Weight (lbs)</label>
              <input
                type="number"
                step="0.1"
                value={weightInput}
                onChange={(e) => setWeightInput(e.target.value)}
                placeholder={
                  state.currentWeight != null ? String(state.currentWeight) : "e.g. 185"
                }
                required
              />
            </div>
            <div className="field">
              <label>Note (optional)</label>
              <input
                value={weightNote}
                onChange={(e) => setWeightNote(e.target.value)}
                placeholder="Felt strong today"
              />
            </div>
            <button type="submit" className="btn btn-primary btn-sm">
              Save weigh-in
            </button>
          </form>

          <div className="ms-h-clear">
            <div>
              <strong>Clear overview</strong>
              <p className="panel-hint">
                Erase weigh-ins, water, steps, protein, and habit checks. Goal numbers stay in Edit
                goals.
              </p>
            </div>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => {
                if (
                  !confirmClear(
                    "overview",
                    "Clear all overview data? This erases weigh-ins, water, steps, protein, and habit checks."
                  )
                )
                  return;
                persist({ ...state, entries: [], habits: {} });
              }}
            >
              Clear overview
            </button>
          </div>
        </div>
      )}

      {tab === "meds" && (
        <div className="about-panel ms-module">
          <div className="ms-h-progress-head">
            <div>
              <h3 style={{ margin: 0 }}>Today’s checklist</h3>
              <p className="panel-hint" style={{ margin: "4px 0 0" }}>
                {nextUp
                  ? `Next up: ${nextUp.med.name}${nextUp.dose.time ? ` at ${formatMedTime(nextUp.dose.time)}` : ""} · remaining stay at the top`
                  : due
                    ? "All of today’s doses are checked off."
                    : "Add medications to start checking them off."}
              </p>
            </div>
            <strong>
              {taken} / {due}
            </strong>
          </div>
          <div className="ms-h-bar" aria-hidden="true">
            <span style={{ width: `${due ? Math.round((taken / due) * 100) : 0}%` }} />
          </div>
          <div className="hero-actions" style={{ margin: "0.75rem 0" }}>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              disabled={!todaySlots.some((s) => !s.log)}
              onClick={() => {
                let logs = [...state.medicationLogs];
                const t = nowTimeEastern();
                for (const slot of todaySlots) {
                  if (slot.log) continue;
                  logs.push({
                    id: uid("mlog"),
                    medicationId: slot.med.id,
                    medicationName: slot.med.name,
                    dosage: slot.med.dosage,
                    date: today,
                    time: t,
                    scheduledTime: slot.dose.time,
                    doseTimeId: slot.dose.id,
                    notes: "",
                  });
                }
                persist({ ...state, medicationLogs: logs });
              }}
            >
              Mark remaining taken
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              disabled={!taken}
              onClick={() =>
                persist({
                  ...state,
                  medicationLogs: state.medicationLogs.filter((l) => l.date !== today),
                })
              }
            >
              Clear today’s checks
            </button>
          </div>

          {todaySlots.length === 0 ? (
            <p className="panel-hint">No medications on today’s list. Add a med below.</p>
          ) : (
            <ul className="ms-simple-list">
              {todaySlots.map(({ med, dose, log }) => {
                const late = !log && dose.time && now > dose.time;
                return (
                  <li key={`${med.id}:${dose.id}`} className={late ? "ms-h-late" : ""}>
                    <label className="ms-check">
                      <input
                        type="checkbox"
                        checked={Boolean(log)}
                        onChange={(e) => markDose(med, dose, e.target.checked)}
                      />
                      <span>
                        <strong>{med.name}</strong>
                        <span className="panel-hint">
                          {" "}
                          · {med.dosage || "No dosage"}
                          {dose.label ? ` · ${dose.label}` : ""}
                        </span>
                        <br />
                        <small>
                          {log
                            ? `Logged ${formatMedTime(log.time)}`
                            : late
                              ? `Late · suggested ${formatMedTime(dose.time)}`
                              : "Not taken yet"}
                        </small>
                      </span>
                    </label>
                    <div className="ms-h-times">
                      <span>
                        Suggested
                        <strong>{formatMedTime(dose.time)}</strong>
                      </span>
                      <label>
                        Actual time
                        <input
                          type="time"
                          className="ms-inline-time"
                          value={log?.time || ""}
                          onChange={(e) => {
                            if (!e.target.value) return;
                            markDose(med, dose, true, e.target.value);
                          }}
                        />
                      </label>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          <h4>7-day adherence</h4>
          <p className="panel-hint">
            {adherence.weekTaken} of {adherence.weekDue} scheduled doses this week
            {adherence.weekPct != null ? ` · ${adherence.weekPct}%` : ""}
          </p>
          <div className="ms-h-week" aria-label="Medication adherence last 7 days">
            {adherence.last7.map((d) => {
              const bar = d.due ? Math.max(10, Math.round((d.taken / d.due) * 100)) : 6;
              const label = new Date(`${d.date}T12:00:00`).toLocaleDateString("en-US", {
                weekday: "narrow",
              });
              const cls = d.due === 0 ? "empty" : d.complete ? "complete" : d.taken ? "partial" : "miss";
              return (
                <div key={d.date} className="ms-h-week-col" title={`${d.taken}/${d.due}`}>
                  <div className="ms-h-week-bar">
                    <span className={cls} style={{ height: `${bar}%` }} />
                  </div>
                  <strong>{d.due ? `${d.taken}/${d.due}` : "–"}</strong>
                  <span>{label}</span>
                </div>
              );
            })}
          </div>

          <h3>Schedule &amp; alarms</h3>
          <p className="panel-hint">
            Edit times, labels, and alarms here. Day-to-day check-off lives in the checklist above.
          </p>
          {activeMeds.map((med) => {
            const slots = med.doseTimes;
            const takenCount = slots.filter((d) =>
              state.medicationLogs.some(
                (l) => l.medicationId === med.id && l.date === today && l.doseTimeId === d.id
              )
            ).length;
            return (
              <article key={med.id} className="ms-h-med">
                <div className="ms-h-progress-head">
                  <div>
                    <strong>{med.name}</strong>
                    <div className="panel-hint">
                      {med.dosage || "Dosage not set"}
                      {med.schedule ? ` · ${med.schedule}` : ""}
                    </div>
                  </div>
                  <span>
                    {takenCount}/{slots.filter((d) => d.enabled).length || med.timesPerDay} doses
                    today
                  </span>
                </div>
                <label className="ms-check">
                  <input
                    type="checkbox"
                    checked={med.alarmEnabled}
                    onChange={(e) =>
                      persist({
                        ...state,
                        medications: state.medications.map((m) =>
                          m.id === med.id ? { ...m, alarmEnabled: e.target.checked } : m
                        ),
                      })
                    }
                  />
                  Alarm for this medication
                </label>
                {slots.map((slot) => (
                  <div key={slot.id} className="ms-h-dose">
                    <input
                      type="checkbox"
                      checked={Boolean(
                        state.medicationLogs.find(
                          (l) =>
                            l.medicationId === med.id &&
                            l.date === today &&
                            l.doseTimeId === slot.id
                        )
                      )}
                      disabled={!slot.enabled}
                      onChange={(e) => markDose(med, slot, e.target.checked)}
                    />
                    <input
                      value={slot.label}
                      onChange={(e) =>
                        persist({
                          ...state,
                          medications: state.medications.map((m) =>
                            m.id === med.id
                              ? {
                                  ...m,
                                  doseTimes: m.doseTimes.map((d) =>
                                    d.id === slot.id ? { ...d, label: e.target.value.slice(0, 80) } : d
                                  ),
                                }
                              : m
                          ),
                        })
                      }
                    />
                    <input
                      type="time"
                      value={slot.time}
                      onChange={(e) =>
                        persist({
                          ...state,
                          medications: state.medications.map((m) =>
                            m.id === med.id
                              ? {
                                  ...m,
                                  doseTimes: m.doseTimes.map((d) =>
                                    d.id === slot.id ? { ...d, time: e.target.value } : d
                                  ),
                                }
                              : m
                          ),
                        })
                      }
                    />
                    <label className="ms-check">
                      <input
                        type="checkbox"
                        checked={slot.enabled}
                        onChange={(e) =>
                          persist({
                            ...state,
                            medications: state.medications.map((m) =>
                              m.id === med.id
                                ? {
                                    ...m,
                                    doseTimes: m.doseTimes.map((d) =>
                                      d.id === slot.id ? { ...d, enabled: e.target.checked } : d
                                    ),
                                  }
                                : m
                            ),
                          })
                        }
                      />
                      On
                    </label>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() =>
                        persist({
                          ...state,
                          medications: state.medications.map((m) =>
                            m.id === med.id
                              ? {
                                  ...m,
                                  doseTimes: m.doseTimes.filter((d) => d.id !== slot.id),
                                  timesPerDay: Math.max(1, m.doseTimes.length - 1),
                                }
                              : m
                          ),
                        })
                      }
                    >
                      ×
                    </button>
                  </div>
                ))}
                <form
                  className="form-grid ms-module-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const time = newDoseTime || "12:00";
                    const label = newDoseLabel.trim() || "Dose";
                    persist({
                      ...state,
                      medications: state.medications.map((m) =>
                        m.id === med.id
                          ? {
                              ...m,
                              doseTimes: [
                                ...m.doseTimes,
                                { id: uid("dose"), time, label, enabled: true },
                              ],
                              timesPerDay: m.doseTimes.length + 1,
                            }
                          : m
                      ),
                    });
                    setNewDoseLabel("");
                    setDoseMedId(med.id);
                  }}
                >
                  <div className="field">
                    <label>Time</label>
                    <input
                      type="time"
                      value={doseMedId === med.id ? newDoseTime : "12:00"}
                      onChange={(e) => {
                        setDoseMedId(med.id);
                        setNewDoseTime(e.target.value);
                      }}
                    />
                  </div>
                  <div className="field">
                    <label>Label</label>
                    <input
                      value={doseMedId === med.id ? newDoseLabel : ""}
                      onChange={(e) => {
                        setDoseMedId(med.id);
                        setNewDoseLabel(e.target.value);
                      }}
                      placeholder="e.g. With lunch"
                    />
                  </div>
                  <button type="submit" className="btn btn-primary btn-sm">
                    Add dose time
                  </button>
                </form>
                <div className="hero-actions">
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => markDose(med, null, true)}
                  >
                    Quick log (no schedule)
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => {
                      const t = window.prompt("Actual time (HH:MM, 24-hour)", nowTimeEastern());
                      if (!t || !/^\d{2}:\d{2}$/.test(t)) return;
                      markDose(med, null, true, t);
                    }}
                  >
                    Log with time…
                  </button>
                </div>
              </article>
            );
          })}

          <h3>Medication alarm settings</h3>
          <div className="form-grid ms-module-form">
            <div className="field">
              <label>Alarm sound</label>
              <select
                value={state.medAlarmSound}
                onChange={(e) =>
                  persist({ ...state, medAlarmSound: e.target.value as AlarmTone })
                }
              >
                <option value="classic">Classic beep (Windows-style)</option>
                <option value="chime">Soft chime</option>
                <option value="urgent">Urgent alert</option>
                <option value="digital">Digital pulse</option>
              </select>
            </div>
            <div className="field">
              <label>Run alarm for (seconds)</label>
              <input
                type="number"
                min={5}
                max={300}
                step={5}
                value={state.medAlarmDurationSec}
                onChange={(e) =>
                  persist({
                    ...state,
                    medAlarmDurationSec: clamp(Number(e.target.value) || 30, 5, 300),
                  })
                }
              />
            </div>
            <label className="ms-check">
              <input
                type="checkbox"
                checked={state.medAlarmEnabled}
                onChange={(e) => persist({ ...state, medAlarmEnabled: e.target.checked })}
              />
              Run medication alarms
            </label>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => playAlarmTone(state.medAlarmSound, 2)}
            >
              Test alarm
            </button>
          </div>
          <p className="panel-hint">
            Alarms fire only for dose times that are On, not yet taken, and for meds with “Alarm for
            this medication” checked. Keep this tab open in the browser.
          </p>

          <h3>Add medication</h3>
          <p className="panel-hint">
            Name, dosage, and how many times per day (default dose times are created for you — edit
            them above).
          </p>
          <form
            className="form-grid ms-module-form"
            onSubmit={(e) => {
              e.preventDefault();
              const name = medName.trim();
              if (!name) return;
              const n = clamp(Number(medTimes) || 1, 1, 12);
              persist({
                ...state,
                medications: [
                  ...state.medications,
                  {
                    id: uid("med"),
                    name: name.slice(0, 120),
                    dosage: medDose.trim().slice(0, 120),
                    schedule: medSchedule.trim().slice(0, 200),
                    notes: medNotes.trim().slice(0, 500),
                    timesPerDay: n,
                    doseTimes: defaultDoseTimes(n),
                    alarmEnabled: medAlarmOn,
                    active: true,
                  },
                ],
              });
              setMedName("");
              setMedDose("");
              setMedTimes("1");
              setMedSchedule("");
              setMedNotes("");
              setMedAlarmOn(true);
            }}
          >
            <div className="field">
              <label>Medication name</label>
              <input
                value={medName}
                onChange={(e) => setMedName(e.target.value)}
                placeholder="e.g. Metformin"
                required
              />
            </div>
            <div className="field">
              <label>Dosage</label>
              <input
                value={medDose}
                onChange={(e) => setMedDose(e.target.value)}
                placeholder="e.g. 500 mg"
              />
            </div>
            <div className="field">
              <label>Times per day</label>
              <input
                type="number"
                min={1}
                max={12}
                value={medTimes}
                onChange={(e) => setMedTimes(e.target.value)}
              />
            </div>
            <div className="field">
              <label>Schedule notes</label>
              <input
                value={medSchedule}
                onChange={(e) => setMedSchedule(e.target.value)}
                placeholder="e.g. With food"
              />
            </div>
            <div className="field">
              <label>Other notes (optional)</label>
              <input
                value={medNotes}
                onChange={(e) => setMedNotes(e.target.value)}
                placeholder="Prescriber, purpose, etc."
              />
            </div>
            <label className="ms-check">
              <input
                type="checkbox"
                checked={medAlarmOn}
                onChange={(e) => setMedAlarmOn(e.target.checked)}
              />
              Enable alarms for this medication
            </label>
            <button type="submit" className="btn btn-primary btn-sm">
              Save medication
            </button>
          </form>

          {state.medications.length > 0 && (
            <>
              <h4>Your medication list</h4>
              <ul className="ms-simple-list">
                {state.medications.map((m) => (
                  <li key={m.id}>
                    <div>
                      <strong>{m.name}</strong>
                      <span className="panel-hint">
                        {" "}
                        · {m.dosage || "no dosage"} · {m.doseTimes.length} dose time(s)
                        {m.active ? "" : " · inactive"}
                      </span>
                    </div>
                    <div className="hero-actions">
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        onClick={() =>
                          persist({
                            ...state,
                            medications: state.medications.map((x) =>
                              x.id === m.id ? { ...x, active: !x.active } : x
                            ),
                          })
                        }
                      >
                        {m.active ? "Deactivate" : "Reactivate"}
                      </button>
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        onClick={() =>
                          persist({
                            ...state,
                            medications: state.medications.filter((x) => x.id !== m.id),
                            medicationLogs: state.medicationLogs.filter(
                              (l) => l.medicationId !== m.id
                            ),
                          })
                        }
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}

          <h4>Dose history</h4>
          <HistoryTabs
            value={hist.meds}
            onChange={(r) => setHist({ ...hist, meds: r })}
            custom={custom.meds}
            onCustom={(c) => setCustom({ ...custom, meds: c })}
          />
          <div className="field" style={{ marginTop: "0.65rem" }}>
            <label>Search</label>
            <input
              type="search"
              value={medHistQ}
              onChange={(e) => setMedHistQ(e.target.value)}
              placeholder="Medication name"
            />
          </div>
          {(() => {
            const q = medHistQ.trim().toLowerCase();
            const logs = filterByRange(state.medicationLogs, "meds")
              .filter((l) =>
                q
                  ? `${l.medicationName} ${l.dosage} ${l.notes}`.toLowerCase().includes(q)
                  : true
              )
              .sort((a, b) => `${b.date}T${b.time}`.localeCompare(`${a.date}T${a.time}`));
            if (!logs.length) {
              return (
                <p className="panel-hint">
                  {state.medicationLogs.length
                    ? `No matching doses in ${rangePhrase(hist.meds)}.`
                    : "Check a box on the checklist and it will show up here."}
                </p>
              );
            }
            let last = "";
            return (
              <ul className="ms-simple-list">
                {logs.map((l) => {
                  const head = l.date !== last;
                  last = l.date;
                  return (
                    <li key={l.id}>
                      <div>
                        {head && <div className="panel-hint">{fmtShortDate(l.date)}</div>}
                        <strong>{l.medicationName}</strong>
                        {l.dosage ? ` · ${l.dosage}` : ""}
                        <div className="panel-hint">
                          Actual {formatMedTime(l.time)}
                          {l.scheduledTime ? ` · suggested ${formatMedTime(l.scheduledTime)}` : ""}
                        </div>
                      </div>
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        onClick={() =>
                          persist({
                            ...state,
                            medicationLogs: state.medicationLogs.filter((x) => x.id !== l.id),
                          })
                        }
                      >
                        Undo
                      </button>
                    </li>
                  );
                })}
              </ul>
            );
          })()}

          <div className="ms-h-clear">
            <div>
              <strong>Clear medications</strong>
              <p className="panel-hint">Erase every medication, dose time, and taken-log.</p>
            </div>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => {
                if (
                  !confirmClear(
                    "medications",
                    "Clear all medications? This erases your meds list and taken-logs."
                  )
                )
                  return;
                persist({ ...state, medications: [], medicationLogs: [] });
              }}
            >
              Clear all meds
            </button>
          </div>
          <p className="panel-hint">
            Personal tracker only — not medical advice. Always follow your doctor or pharmacist’s
            instructions.
          </p>
        </div>
      )}

      {tab === "meals" && (
        <div className="about-panel ms-module">
          <h3>Log a meal</h3>
          <form
            className="form-grid ms-module-form"
            onSubmit={(e) => {
              e.preventDefault();
              const title = (mealPick !== "__new__" ? mealPick : mealTitle).trim();
              if (!title) return;
              persist({
                ...state,
                meals: [
                  {
                    id: uid("meal"),
                    date: mealDate || today,
                    time: mealTime || nowTimeEastern(),
                    mealType,
                    title: title.slice(0, 120),
                    calories: mealCal ? Number(mealCal) || null : null,
                    notes: mealNotes.trim().slice(0, 1000),
                    photoName: mealPhotoName,
                  },
                  ...state.meals,
                ].slice(0, 250),
              });
              setMealTitle("");
              setMealPick("__new__");
              setMealCal("");
              setMealNotes("");
              setMealPhotoName("");
            }}
          >
            <div className="field">
              <label>Type</label>
              <select value={mealType} onChange={(e) => setMealType(e.target.value)}>
                {MEAL_TYPES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>What did you eat?</label>
              {mealSuggestions.length > 0 && (
                <select
                  value={mealPick}
                  onChange={(e) => {
                    setMealPick(e.target.value);
                    if (e.target.value !== "__new__") setMealTitle(e.target.value);
                  }}
                >
                  <option value="__new__">Add a new meal…</option>
                  {mealSuggestions.map((s) => (
                    <option key={s.title} value={s.title}>
                      {s.title}
                      {s.count > 1 ? ` (${s.count}×)` : ""}
                    </option>
                  ))}
                </select>
              )}
              {mealPick === "__new__" && (
                <input
                  value={mealTitle}
                  onChange={(e) => setMealTitle(e.target.value)}
                  placeholder="Type a new meal"
                  required={mealPick === "__new__"}
                />
              )}
            </div>
            <div className="field">
              <label>Calories (optional)</label>
              <input
                type="number"
                value={mealCal}
                onChange={(e) => setMealCal(e.target.value)}
                placeholder="450"
              />
            </div>
            <div className="field">
              <label>Date</label>
              <input type="date" value={mealDate} onChange={(e) => setMealDate(e.target.value)} />
            </div>
            <div className="field">
              <label>Time</label>
              <input type="time" value={mealTime} onChange={(e) => setMealTime(e.target.value)} />
            </div>
            <div className="field">
              <label>Photo (optional — stays on your phone)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setMealPhotoName(e.target.files?.[0]?.name || "")}
              />
              {mealPhotoName ? (
                <span className="panel-hint">Remembered filename: {mealPhotoName}</span>
              ) : null}
            </div>
            <div className="field">
              <label>Notes</label>
              <input
                value={mealNotes}
                onChange={(e) => setMealNotes(e.target.value)}
                placeholder="Felt satisfied, good protein"
              />
            </div>
            <button type="submit" className="btn btn-primary btn-sm">
              Save meal
            </button>
          </form>

          <h4>Meal history</h4>
          <HistoryTabs
            value={hist.meals}
            onChange={(r) => setHist({ ...hist, meals: r })}
            custom={custom.meals}
            onCustom={(c) => setCustom({ ...custom, meals: c })}
          />
          {(() => {
            const list = filterByRange(state.meals, "meals");
            if (!list.length) {
              return (
                <p className="panel-hint">
                  {state.meals.length
                    ? `No meals in ${rangePhrase(hist.meals)}. Try a longer range, or Custom.`
                    : "Add breakfast, lunch, dinner, snacks, or OMD."}
                </p>
              );
            }
            return (
              <ul className="ms-simple-list">
                {list.map((m) => (
                  <li key={m.id}>
                    <div>
                      <strong>{m.title}</strong>
                      <span className="panel-hint">
                        {" "}
                        · {MEAL_TYPES.find((t) => t.id === m.mealType)?.label || m.mealType} ·{" "}
                        {fmtShortDate(m.date)}
                        {m.time ? ` · ${formatMedTime(m.time)}` : ""}
                        {m.calories != null ? ` · ${m.calories} cal` : ""}
                      </span>
                      {m.notes ? <div className="panel-hint">{m.notes}</div> : null}
                    </div>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() =>
                        persist({ ...state, meals: state.meals.filter((x) => x.id !== m.id) })
                      }
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            );
          })()}
          <div className="ms-h-clear">
            <div>
              <strong>Clear meals</strong>
              <p className="panel-hint">Erase every meal log on this account.</p>
            </div>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => {
                if (!confirmClear("meals", "Clear all meals? This erases meal logs permanently."))
                  return;
                persist({ ...state, meals: [] });
              }}
            >
              Clear all meals
            </button>
          </div>
        </div>
      )}

      {tab === "exercise" && (
        <div className="about-panel ms-module">
          <p className="panel-hint">
            Walks, swimming, and minutes belong here. For gym machines, free weights, Fit Clubs, and
            Planet Fitness, use the Gym board.
          </p>
          <h3>Log exercise</h3>
          <form
            className="form-grid ms-module-form"
            onSubmit={(e) => {
              e.preventDefault();
              persist({
                ...state,
                exercises: [
                  {
                    id: uid("ex"),
                    date: today,
                    time: nowTimeEastern(),
                    activity: exCustom.trim() || exActivity,
                    durationMin: exMin ? Number(exMin) || null : null,
                    distance: exDist ? Number(exDist) || null : null,
                    distanceUnit: exUnit,
                    calories: exCal ? Number(exCal) || null : null,
                    notes: exNotes.trim().slice(0, 500),
                  },
                  ...state.exercises,
                ].slice(0, 250),
              });
              setExCustom("");
              setExNotes("");
              setExDist("");
              setExCal("");
            }}
          >
            <div className="field">
              <label>Activity</label>
              <select value={exActivity} onChange={(e) => setExActivity(e.target.value)}>
                {EXERCISE_PRESETS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Or custom name</label>
              <input
                value={exCustom}
                onChange={(e) => setExCustom(e.target.value)}
                placeholder="e.g. Water aerobics"
              />
            </div>
            <div className="field">
              <label>Duration (min)</label>
              <input
                type="number"
                min={1}
                value={exMin}
                onChange={(e) => setExMin(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label>Distance (optional)</label>
              <input
                type="number"
                min={0}
                step="0.1"
                value={exDist}
                onChange={(e) => setExDist(e.target.value)}
              />
            </div>
            <div className="field">
              <label>Distance unit</label>
              <select
                value={exUnit}
                onChange={(e) => setExUnit(e.target.value as "mi" | "km" | "m")}
              >
                <option value="mi">Miles</option>
                <option value="km">Km</option>
                <option value="m">Meters (laps/pool)</option>
              </select>
            </div>
            <div className="field">
              <label>Calories (optional)</label>
              <input type="number" min={0} value={exCal} onChange={(e) => setExCal(e.target.value)} />
            </div>
            <div className="field">
              <label>Notes</label>
              <input
                value={exNotes}
                onChange={(e) => setExNotes(e.target.value)}
                placeholder="Easy pace, felt good in the water"
              />
            </div>
            <button type="submit" className="btn btn-primary btn-sm">
              Save workout
            </button>
          </form>

          <h4>Exercise history</h4>
          <HistoryTabs
            value={hist.exercise}
            onChange={(r) => setHist({ ...hist, exercise: r })}
            custom={custom.exercise}
            onCustom={(c) => setCustom({ ...custom, exercise: c })}
          />
          {(() => {
            const list = filterByRange(state.exercises, "exercise");
            if (!list.length) {
              return (
                <p className="panel-hint">
                  {state.exercises.length
                    ? `No workouts in ${rangePhrase(hist.exercise)}.`
                    : "Track swimming, walks, strength — whatever moves you."}
                </p>
              );
            }
            return (
              <ul className="ms-simple-list">
                {list.map((x) => (
                  <li key={x.id}>
                    <div>
                      <strong>{x.activity}</strong>
                      <span className="panel-hint">
                        {" "}
                        · {fmtShortDate(x.date)}
                        {x.durationMin ? ` · ${x.durationMin} min` : ""}
                        {x.distance != null ? ` · ${x.distance} ${x.distanceUnit}` : ""}
                        {x.calories != null ? ` · ${x.calories} cal` : ""}
                      </span>
                      {x.notes ? <div className="panel-hint">{x.notes}</div> : null}
                    </div>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() =>
                        persist({
                          ...state,
                          exercises: state.exercises.filter((e) => e.id !== x.id),
                        })
                      }
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            );
          })()}
          <div className="ms-h-clear">
            <div>
              <strong>Clear all exercise</strong>
              <p className="panel-hint">Erase every workout log.</p>
            </div>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => {
                if (!confirmClear("exercise", "Clear all exercise logs?")) return;
                persist({ ...state, exercises: [] });
              }}
            >
              Clear all exercise
            </button>
          </div>
        </div>
      )}

      {tab === "sleep" && (
        <div className="about-panel ms-module">
          <div className="ms-stat-row">
            <div className="ms-stat">
              <span>Last night</span>
              <strong>
                {sleepStats.lastNight ? `${sleepStats.lastNight.hours}h` : "—"}
              </strong>
              <em>
                {sleepStats.lastNight
                  ? `${sleepQualityMeta(sleepStats.lastNight.quality).emoji} ${sleepQualityMeta(sleepStats.lastNight.quality).label}`
                  : "Not logged"}
              </em>
            </div>
            <div className="ms-stat">
              <span>7-day average</span>
              <strong>{sleepStats.avgHours ?? "—"}</strong>
              <em>
                {sleepStats.nightsLogged} night{sleepStats.nightsLogged === 1 ? "" : "s"} logged
              </em>
            </div>
            <div className="ms-stat">
              <span>Goal streak</span>
              <strong>{sleepStats.streak}</strong>
              <em>{state.sleepGoalHours}h nights in a row</em>
            </div>
            <div className="ms-stat">
              <span>This week</span>
              <strong>{sleepStats.hoursThisWeek || "—"}</strong>
              <em>
                {sleepStats.nightsLogged
                  ? sleepStats.debt > 0.2
                    ? `${sleepStats.debt}h short of ${state.sleepGoalHours}h`
                    : "On target"
                  : "Log a few nights to see weekly sleep vs your goal."}
              </em>
            </div>
          </div>

          <h4>Last 7 nights</h4>
          <div className="ms-h-week" aria-label="Last 7 nights">
            {sleepStats.last7days.map((d) => {
              const hours = d.log?.hours;
              const bar =
                hours != null
                  ? Math.max(8, Math.round((hours / Math.max(state.sleepGoalHours, 8)) * 100))
                  : 4;
              const label = new Date(`${d.date}T12:00:00`).toLocaleDateString("en-US", {
                weekday: "narrow",
              });
              return (
                <div key={d.date} className="ms-h-week-col">
                  <div className="ms-h-week-bar">
                    <span className={`q-${d.log?.quality || "empty"}`} style={{ height: `${bar}%` }} />
                  </div>
                  <strong>{hours != null ? hours : "–"}</strong>
                  <span>{label}</span>
                </div>
              );
            })}
          </div>
          <p className="panel-hint">Goal {state.sleepGoalHours} hours. Bars are colored by how the night felt.</p>

          <h3>Log a night</h3>
          <p className="panel-hint">
            Use the morning you woke up as the date. Saving the same date updates that night.
          </p>
          <form
            className="form-grid ms-module-form"
            onSubmit={(e) => {
              e.preventDefault();
              const date = sleepDate || today;
              let hours = Number(sleepHours);
              if (!Number.isFinite(hours) || hours <= 0) {
                const computed = hoursFromBedWake(sleepBed, sleepWake);
                if (computed == null) return;
                hours = computed;
              }
              const nextSleep: SleepLog = {
                id: uid("sl"),
                date,
                hours,
                quality: sleepQuality,
                notes: sleepNotes.trim().slice(0, 1000),
                bedtime: sleepBed,
                waketime: sleepWake,
                interruptions: sleepWakes ? Number(sleepWakes) || 0 : null,
              };
              const nextHabits = { ...state.habits };
              if (hours >= 7) {
                nextHabits[date] = { ...emptyHabit(), ...(nextHabits[date] || {}), sleep: true };
              }
              persist({
                ...state,
                sleeps: [nextSleep, ...state.sleeps.filter((s) => s.date !== date)].slice(0, 120),
                habits: nextHabits,
              });
            }}
          >
            <div className="field">
              <label>Date (morning of)</label>
              <input type="date" value={sleepDate} onChange={(e) => setSleepDate(e.target.value)} />
            </div>
            <div className="field">
              <label>Hours slept</label>
              <input
                type="number"
                min={0.5}
                max={18}
                step={0.25}
                value={sleepHours}
                onChange={(e) => setSleepHours(e.target.value)}
              />
            </div>
            <div className="field">
              <label>Bedtime (optional)</label>
              <input type="time" value={sleepBed} onChange={(e) => setSleepBed(e.target.value)} />
            </div>
            <div className="field">
              <label>Wake time (optional)</label>
              <input type="time" value={sleepWake} onChange={(e) => setSleepWake(e.target.value)} />
            </div>
            <div className="field">
              <label>Wake-ups (optional)</label>
              <input
                type="number"
                min={0}
                max={20}
                value={sleepWakes}
                onChange={(e) => setSleepWakes(e.target.value)}
              />
            </div>
            <div className="ms-h-quick">
              {[6, 7, 7.5, 8, 9].map((h) => (
                <button
                  key={h}
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => setSleepHours(String(h))}
                >
                  {h}h
                </button>
              ))}
            </div>
            <div className="field">
              <label>Sleep quality</label>
              <div className="ms-h-q" role="radiogroup">
                {SLEEP_QUALITIES.map((q) => (
                  <label key={q.id} className={sleepQuality === q.id ? "active" : ""}>
                    <input
                      type="radio"
                      name="sleep-q"
                      checked={sleepQuality === q.id}
                      onChange={() => setSleepQuality(q.id)}
                    />
                    {q.emoji} {q.label}
                  </label>
                ))}
              </div>
            </div>
            <div className="field">
              <label>Notes (optional)</label>
              <input
                value={sleepNotes}
                onChange={(e) => setSleepNotes(e.target.value)}
                placeholder="Woke once, otherwise solid"
              />
            </div>
            <button type="submit" className="btn btn-primary btn-sm">
              Save night
            </button>
          </form>

          <h4>Sleep history</h4>
          <HistoryTabs
            value={hist.sleep}
            onChange={(r) => setHist({ ...hist, sleep: r })}
            custom={custom.sleep}
            onCustom={(c) => setCustom({ ...custom, sleep: c })}
          />
          {(() => {
            const list = filterByRange(state.sleeps, "sleep");
            if (!list.length) {
              return <p className="panel-hint">No nights logged yet. Record last night’s hours and how it felt.</p>;
            }
            return (
              <ul className="ms-simple-list">
                {list.map((s) => (
                  <li key={s.id}>
                    <div>
                      <strong>
                        {s.hours ?? "—"} hours · {sleepQualityMeta(s.quality).label}
                      </strong>
                      <span className="panel-hint"> · {fmtShortDate(s.date)}</span>
                      {s.notes ? <div className="panel-hint">{s.notes}</div> : null}
                    </div>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() =>
                        persist({ ...state, sleeps: state.sleeps.filter((x) => x.id !== s.id) })
                      }
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            );
          })()}
        </div>
      )}

      {tab === "photos" && (
        <div className="about-panel ms-module">
          <h3>Upload progress photo</h3>
          <p className="panel-hint">
            Keep the picture on your camera roll. We save the date, weight that day, and caption —
            not the image file (cloud size limit).
          </p>
          <form
            className="form-grid ms-module-form"
            onSubmit={(e) => {
              e.preventDefault();
              persist({
                ...state,
                progressPhotos: [
                  {
                    id: uid("pp"),
                    date: today,
                    caption: photoCaption.trim().slice(0, 200) || "Check-in",
                    weight: photoWeight ? Number(photoWeight) || state.currentWeight : state.currentWeight,
                    photoName,
                  },
                  ...state.progressPhotos,
                ].slice(0, 80),
              });
              setPhotoCaption("");
              setPhotoName("");
            }}
          >
            <div className="field">
              <label>Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPhotoName(e.target.files?.[0]?.name || "")}
              />
              {photoName ? <span className="panel-hint">Filename: {photoName}</span> : null}
            </div>
            <div className="field">
              <label>Weight that day (lbs)</label>
              <input
                type="number"
                step="0.1"
                value={photoWeight}
                onChange={(e) => setPhotoWeight(e.target.value)}
                placeholder={state.currentWeight != null ? String(state.currentWeight) : ""}
              />
            </div>
            <div className="field">
              <label>Caption</label>
              <input
                value={photoCaption}
                onChange={(e) => setPhotoCaption(e.target.value)}
                placeholder="Week 4 check-in"
              />
            </div>
            <button type="submit" className="btn btn-primary btn-sm">
              Save photo
            </button>
          </form>
          {state.progressPhotos.length === 0 ? (
            <p className="panel-hint">No progress photos yet. Upload a photo to see visual progress over time.</p>
          ) : (
            <ul className="ms-simple-list">
              {state.progressPhotos.map((p) => (
                <li key={p.id}>
                  <div>
                    <strong>{p.caption}</strong>
                    <span className="panel-hint">
                      {" "}
                      · {fmtShortDate(p.date)}
                      {p.weight != null ? ` · ${p.weight} lbs` : ""}
                      {p.photoName ? ` · ${p.photoName}` : ""}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() =>
                      persist({
                        ...state,
                        progressPhotos: state.progressPhotos.filter((x) => x.id !== p.id),
                      })
                    }
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {tab === "journal" && (
        <div className="about-panel ms-module">
          {reviewing ? (
            <>
              <div className="ms-h-progress-head">
                <h3 style={{ margin: 0 }}>{reviewing.title || "Journal entry"}</h3>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => setReviewJournalId(null)}
                >
                  Back to today
                </button>
              </div>
              <p className="panel-hint">
                {fmtShortDate(reviewing.date)}
                {reviewing.mood ? ` · Mood: ${reviewing.mood}` : ""}
              </p>
              <p style={{ whiteSpace: "pre-wrap" }}>{reviewing.body}</p>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => {
                  persist({
                    ...state,
                    journals: state.journals.filter((x) => x.id !== reviewing.id),
                  });
                  setReviewJournalId(null);
                }}
              >
                Delete entry
              </button>
            </>
          ) : (
            <>
              <h3>Today’s journal</h3>
              <p className="panel-hint">
                Capture wins, struggles, cravings, energy — anything on your mind. Saved for later
                review.
              </p>
              <form
                className="form-grid ms-module-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  const body = journalBody.trim();
                  if (!body) return;
                  const existing = state.journals.find((j) => j.date === today);
                  const entry: Journal = {
                    id: existing?.id || uid("j"),
                    date: today,
                    title: journalTitle.trim().slice(0, 120),
                    mood: journalMood.trim().slice(0, 40),
                    body: body.slice(0, 20000),
                  };
                  persist({
                    ...state,
                    journals: [entry, ...state.journals.filter((j) => j.date !== today)].slice(
                      0,
                      120
                    ),
                  });
                }}
              >
                <div className="field">
                  <label>Title (optional)</label>
                  <input
                    value={journalTitle}
                    onChange={(e) => setJournalTitle(e.target.value)}
                    placeholder="How today felt"
                  />
                </div>
                <div className="field">
                  <label>Mood (optional)</label>
                  <input
                    value={journalMood}
                    onChange={(e) => setJournalMood(e.target.value)}
                    placeholder="Hopeful / tired / proud"
                  />
                </div>
                <div className="field">
                  <label>Thoughts</label>
                  <textarea
                    rows={8}
                    value={journalBody}
                    onChange={(e) => setJournalBody(e.target.value)}
                    placeholder="What went well? What was hard? What will I try tomorrow? Or tap Speak and talk."
                    required
                  />
                </div>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => {
                    const w = window as unknown as {
                      SpeechRecognition?: new () => {
                        lang: string;
                        continuous: boolean;
                        interimResults: boolean;
                        onresult: ((ev: {
                          resultIndex: number;
                          results: ArrayLike<ArrayLike<{ transcript: string }>>;
                        }) => void) | null;
                        onend: (() => void) | null;
                        start: () => void;
                        stop: () => void;
                      };
                      webkitSpeechRecognition?: new () => {
                        lang: string;
                        continuous: boolean;
                        interimResults: boolean;
                        onresult: ((ev: {
                          resultIndex: number;
                          results: ArrayLike<ArrayLike<{ transcript: string }>>;
                        }) => void) | null;
                        onend: (() => void) | null;
                        start: () => void;
                        stop: () => void;
                      };
                    };
                    const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
                    if (!SR) {
                      window.alert("Speech recognition isn’t available in this browser.");
                      return;
                    }
                    const rec = new SR();
                    rec.lang = "en-US";
                    rec.continuous = true;
                    rec.interimResults = true;
                    rec.onresult = (ev) => {
                      let chunk = "";
                      for (let i = ev.resultIndex; i < ev.results.length; i++) {
                        chunk += ev.results[i]?.[0]?.transcript || "";
                      }
                      if (chunk) setJournalBody((prev) => (prev ? `${prev} ${chunk}` : chunk));
                    };
                    rec.onend = () => setDictating(false);
                    if (dictating) {
                      rec.stop();
                      setDictating(false);
                    } else {
                      rec.start();
                      setDictating(true);
                    }
                  }}
                >
                  {dictating ? "Stop" : "🎤 Speak"}
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  {state.journals.some((j) => j.date === today)
                    ? "Update today’s entry"
                    : "Save journal entry"}
                </button>
              </form>
            </>
          )}
          <h4>Review past entries</h4>
          {state.journals.length === 0 ? (
            <p className="panel-hint">No journal entries yet. Write your first one above.</p>
          ) : (
            <div className="ms-h-quick">
              {state.journals.map((j) => (
                <button
                  key={j.id}
                  type="button"
                  className={`btn btn-ghost btn-sm ${reviewJournalId === j.id ? "active" : ""}`}
                  onClick={() => setReviewJournalId(j.id)}
                >
                  {fmtShortDate(j.date)} · {(j.title || "Entry").slice(0, 28)}
                </button>
              ))}
            </div>
          )}
          <div className="ms-h-clear">
            <div>
              <strong>Clear journal</strong>
              <p className="panel-hint">Erase every journal entry.</p>
            </div>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => {
                if (!confirmClear("journal", "Clear all journal entries?")) return;
                persist({ ...state, journals: [] });
                setJournalBody("");
                setReviewJournalId(null);
              }}
            >
              Clear journal
            </button>
          </div>
        </div>
      )}

      {tab === "goals" && (
        <div className="about-panel ms-module">
          <h3>Edit goals</h3>
          <div className="form-grid ms-module-form">
            {(
              [
                ["startWeight", "Start weight (lbs)", 0.1],
                ["currentWeight", "Current weight (lbs)", 0.1],
                ["goalWeight", "Goal weight (lbs)", 0.1],
                ["heightInches", "Height (inches)", 0.5],
                ["dailyCalorieTarget", "Daily calorie target", 1],
                ["dailyWaterGoalOz", "Water goal (oz)", 1],
                ["dailyStepsGoal", "Steps goal", 100],
                ["dailyProteinGoalG", "Protein goal (g)", 1],
                ["sleepGoalHours", "Sleep goal (hours)", 0.25],
              ] as const
            ).map(([key, label, step]) => (
              <div className="field" key={key}>
                <label>{label}</label>
                <input
                  type="number"
                  step={step}
                  value={state[key] ?? ""}
                  onChange={(e) =>
                    persist({
                      ...state,
                      [key]: e.target.value === "" ? (key.includes("Weight") || key === "heightInches" ? null : 0) : Number(e.target.value),
                    })
                  }
                />
              </div>
            ))}
          </div>
          <p className="panel-hint">Not medical advice — for personal tracking and motivation only.</p>
        </div>
      )}
    </div>
  );
}
