import type { GymLift, GymRoutine, GymSet, GymWorkout } from "@/lib/memberBoardModel";

export const ROUTINE_PRESETS = [
  "Leg Day",
  "Upper Body",
  "Chest Day",
  "Back Day",
  "Arms",
  "Shoulders",
  "Core",
  "Cardio",
  "HIIT",
  "Full Body",
  "Push",
  "Pull",
  "Stretch / Mobility",
] as const;

export const EQUIPMENT: Record<string, string[]> = {
  machine: [
    "Leg press",
    "Chest press",
    "Shoulder press",
    "Lat pulldown",
    "Seated row",
    "Pec deck",
    "Leg curl",
    "Leg extension",
    "Smith machine",
    "Assisted pull-up",
    "Ab crunch machine",
    "Calf raise machine",
    "Chest fly machine",
    "Rear delt fly",
    "Hack squat",
    "Hip abduction",
    "Hip adduction",
    "Glute kickback",
    "Seated calf raise",
    "Assisted dip",
    "Arm curl machine",
    "Tricep machine",
    "Back extension",
    "Rotary torso",
  ],
  free: [
    "Barbell bench press",
    "Incline bench press",
    "Decline bench press",
    "Squat",
    "Deadlift",
    "Overhead press",
    "Barbell row",
    "Dumbbell press",
    "Dumbbell row",
    "Goblet squat",
    "Romanian deadlift",
    "Lunges",
    "Bulgarian split squat",
    "Hip thrust",
    "Dumbbell curl",
    "Hammer curl",
    "Preacher curl",
    "Tricep extension",
    "Skull crusher",
    "Lateral raise",
    "Front raise",
    "Farmer carry",
    "Kettlebell swing",
    "Step-ups",
    "Shrug",
  ],
  cable: [
    "Cable row",
    "Face pull",
    "Tricep pushdown",
    "Cable fly",
    "Woodchop",
    "Cable curl",
    "Straight-arm pulldown",
    "Cable crunch",
    "Pallof press",
  ],
  cardio: [
    "Treadmill",
    "Elliptical",
    "Recumbent bike",
    "Upright bike",
    "Rower",
    "Stair climber",
    "Arc trainer",
    "Assault bike",
    "Jump rope",
    "Battle ropes",
  ],
  bodyweight: [
    "Push-ups",
    "Sit-ups",
    "Plank",
    "Squats (bodyweight)",
    "Wall sit",
    "Bird dog",
    "Pull-ups",
    "Chin-ups",
    "Dips",
    "Hip bridge",
    "Russian twist",
    "Burpees",
    "Mountain climbers",
  ],
};

export const EXERCISE_NAMES = [...new Set(Object.values(EQUIPMENT).flat())];
export const EXERCISE_KIND = Object.fromEntries(
  Object.entries(EQUIPMENT).flatMap(([kind, names]) => names.map((n) => [n, kind]))
) as Record<string, string>;
export const KIND_LABEL: Record<string, string> = {
  machine: "Machine",
  free: "Free weights",
  cable: "Cable",
  cardio: "Cardio",
  bodyweight: "Bodyweight",
};

type Starter = { name: string; sets: number; reps: number; seconds?: number };

const STARTERS: Record<string, Starter[]> = {
  "Leg Day": [
    { name: "Leg press", sets: 3, reps: 10 },
    { name: "Leg curl", sets: 3, reps: 12 },
    { name: "Leg extension", sets: 3, reps: 12 },
    { name: "Goblet squat", sets: 3, reps: 10 },
    { name: "Calf raise machine", sets: 3, reps: 15 },
  ],
  "Upper Body": [
    { name: "Chest press", sets: 3, reps: 10 },
    { name: "Lat pulldown", sets: 3, reps: 10 },
    { name: "Seated row", sets: 3, reps: 12 },
    { name: "Shoulder press", sets: 3, reps: 10 },
    { name: "Tricep pushdown", sets: 3, reps: 12 },
  ],
  "Chest Day": [
    { name: "Chest press", sets: 3, reps: 10 },
    { name: "Pec deck", sets: 3, reps: 12 },
    { name: "Dumbbell press", sets: 3, reps: 10 },
    { name: "Push-ups", sets: 3, reps: 12 },
  ],
  "Back Day": [
    { name: "Lat pulldown", sets: 3, reps: 10 },
    { name: "Seated row", sets: 3, reps: 12 },
    { name: "Face pull", sets: 3, reps: 15 },
    { name: "Back extension", sets: 3, reps: 12 },
  ],
  Arms: [
    { name: "Arm curl machine", sets: 3, reps: 12 },
    { name: "Tricep machine", sets: 3, reps: 12 },
    { name: "Hammer curl", sets: 3, reps: 10 },
    { name: "Tricep pushdown", sets: 3, reps: 12 },
  ],
  Shoulders: [
    { name: "Shoulder press", sets: 3, reps: 10 },
    { name: "Lateral raise", sets: 3, reps: 12 },
    { name: "Rear delt fly", sets: 3, reps: 12 },
  ],
  Core: [
    { name: "Ab crunch machine", sets: 3, reps: 15 },
    { name: "Plank", sets: 3, reps: 0, seconds: 30 },
    { name: "Bird dog", sets: 3, reps: 10 },
  ],
  Cardio: [
    { name: "Recumbent bike", sets: 1, reps: 0, seconds: 1200 },
    { name: "Elliptical", sets: 1, reps: 0, seconds: 600 },
  ],
  HIIT: [
    { name: "Assault bike", sets: 8, reps: 0, seconds: 30 },
    { name: "Mountain climbers", sets: 4, reps: 20 },
    { name: "Burpees", sets: 4, reps: 8 },
  ],
  "Full Body": [
    { name: "Goblet squat", sets: 3, reps: 10 },
    { name: "Chest press", sets: 3, reps: 10 },
    { name: "Seated row", sets: 3, reps: 12 },
    { name: "Plank", sets: 2, reps: 0, seconds: 30 },
  ],
  Push: [
    { name: "Chest press", sets: 3, reps: 10 },
    { name: "Shoulder press", sets: 3, reps: 10 },
    { name: "Tricep pushdown", sets: 3, reps: 12 },
  ],
  Pull: [
    { name: "Lat pulldown", sets: 3, reps: 10 },
    { name: "Seated row", sets: 3, reps: 12 },
    { name: "Face pull", sets: 3, reps: 15 },
    { name: "Dumbbell curl", sets: 3, reps: 10 },
  ],
  "Stretch / Mobility": [
    { name: "Plank", sets: 2, reps: 0, seconds: 20 },
    { name: "Bird dog", sets: 2, reps: 8 },
    { name: "Hip bridge", sets: 2, reps: 10 },
  ],
};

export function emptyGymSet(): GymSet {
  return { weight: "", reps: "", seconds: "", rest: "", done: false };
}

export function plannedSets(count: number, reps: number, seconds?: number, rest?: number): GymSet[] {
  return Array.from({ length: Math.max(1, count) }, () => ({
    weight: "",
    reps: reps || "",
    seconds: seconds || "",
    rest: rest || "",
    done: false,
  }));
}

function planLift(
  name: string,
  sets: number,
  reps: number,
  seconds?: number,
  kind = "free"
): GymLift {
  return {
    name,
    kind,
    equipment: kind === "bodyweight" ? "" : "dumbbell",
    sets: plannedSets(sets, reps, seconds),
  };
}

const REST = "rest 60–90 sec";

/** Ara's one-hour dumbbell plan. Rep targets are the top of each range. */
export function dumbbellPlanRoutines(): GymRoutine[] {
  const rules =
    "About 1 hour. Light dumbbells you can control. Stop if it hurts sharp. Alternate days and take two full rest days a week; the other easy days are a 30-minute walk or light stretching.";
  return [
    {
      id: "rt-dumbbell-upper",
      name: "Dumbbell Upper Body",
      exercises: [
        planLift(rules, 1, 1, undefined, "bodyweight"),
        planLift("Warm-up: arm circles and shoulder rolls, 30 sec each", 1, 0, 30, "bodyweight"),
        planLift(`Dumbbell shoulder press · 10–12 · ${REST}`, 3, 12),
        planLift(`Bent-over rows · 10–12 · ${REST}`, 3, 12),
        planLift(`Floor or bench chest press · 10–12 · ${REST}`, 3, 12),
        planLift(`Bicep curls · 10–12 · ${REST}`, 3, 12),
        planLift(`Tricep kickbacks · 10–12 · ${REST}`, 3, 12),
        planLift(`Lateral raises · 10–12 · ${REST}`, 3, 12),
        planLift(`Hammer curls · 10–12 · ${REST}`, 3, 12),
        planLift(`Wrist curls · 10–12 · ${REST}`, 3, 12),
        planLift("Cool-down: gentle stretching, 5 minutes. Shoulders, back, chest, biceps, triceps, and forearms.", 1, 0, 300, "bodyweight"),
      ],
    },
    {
      id: "rt-dumbbell-lower",
      name: "Dumbbell Lower Body",
      exercises: [
        planLift(rules, 1, 1, undefined, "bodyweight"),
        planLift("Warm-up: leg swings and bodyweight squats, 30 sec each", 1, 0, 30, "bodyweight"),
        planLift(`Goblet squats · 10–12 · ${REST}`, 3, 12),
        planLift(`Romanian deadlifts · 10–12 · ${REST}`, 3, 12),
        planLift(`Reverse lunges · 10 per leg · ${REST}`, 3, 10),
        planLift(`Step-ups onto a sturdy chair · 10 per leg · ${REST}`, 3, 10),
        planLift(`Glute bridges · 12–15 · ${REST}`, 3, 15, undefined, "bodyweight"),
        planLift(`Calf raises · 15 · ${REST}`, 3, 15),
        planLift("Cool-down: hip and hamstring stretches, 5 minutes", 1, 0, 300, "bodyweight"),
      ],
    },
    {
      id: "rt-dumbbell-core",
      name: "Dumbbell Core",
      exercises: [
        planLift(`${rules} The extra round of planks and side planks fills out the hour.`, 1, 1, undefined, "bodyweight"),
        planLift("Warm-up: cat-cow and dead bug, 10 each", 1, 10, undefined, "bodyweight"),
        planLift(`Dead bug · 10 per side · ${REST}`, 3, 10, undefined, "bodyweight"),
        planLift(`Bird dog · 10 per side · ${REST}`, 3, 10, undefined, "bodyweight"),
        planLift(`Glute bridge · 12 · ${REST}`, 3, 12, undefined, "bodyweight"),
        planLift(`Plank · 20–30 sec · ${REST}`, 3, 0, 30, "bodyweight"),
        planLift(`Side plank · 15–20 sec per side · ${REST}`, 3, 0, 20, "bodyweight"),
        planLift(`Dead bug, round 2 · 10 per side · ${REST}`, 3, 10, undefined, "bodyweight"),
        planLift(`Plank, round 2 · 20–30 sec · ${REST}`, 3, 0, 30, "bodyweight"),
        planLift(`Side plank, round 2 · 15–20 sec per side · ${REST}`, 3, 0, 20, "bodyweight"),
        planLift("Cool-down: child's pose and knee-to-chest, 5 minutes", 1, 0, 300, "bodyweight"),
      ],
    },
  ];
}

export function starterLifts(routineName: string): GymLift[] {
  const rows = STARTERS[routineName];
  if (!rows) return [];
  return rows.map((r) => ({
    name: r.name,
    kind: EXERCISE_KIND[r.name] || "machine",
    equipment: "",
    sets: plannedSets(r.sets, r.reps, r.seconds),
  }));
}

export function cloneLifts(lifts: GymLift[]): GymLift[] {
  return lifts.map((l) => ({
    ...l,
    sets: l.sets.map((s) => ({ ...s, done: false })),
  }));
}

function workoutRecency(a: GymWorkout, b: GymWorkout) {
  const d = String(b.date).localeCompare(String(a.date));
  if (d) return d;
  return String(b.id).localeCompare(String(a.id));
}

function setHasNumbers(s: GymSet) {
  return s.weight !== "" || s.reps !== "" || s.seconds !== "" || Boolean(s.done);
}

export function workoutHasNumbers(w: GymWorkout) {
  return (w.exercises || []).some((l) => (l.sets || []).some(setHasNumbers));
}

export function lastCompletedForRoutine(
  workouts: GymWorkout[],
  routineName: string,
  excludeId?: string
): GymWorkout | null {
  const key = routineName.trim().toLowerCase();
  if (!key) return null;
  const sorted = [...workouts].sort(workoutRecency);
  for (const w of sorted) {
    if (excludeId && w.id === excludeId) continue;
    if ((w.routineName || "").trim().toLowerCase() !== key) continue;
    if (workoutHasNumbers(w)) return w;
  }
  return null;
}

export function lastLiftSnapshot(
  workouts: GymWorkout[],
  exerciseName: string,
  excludeId?: string
): GymLift | null {
  const key = exerciseName.trim().toLowerCase();
  if (!key) return null;
  const sorted = [...workouts].sort(workoutRecency);
  for (const w of sorted) {
    if (excludeId && w.id === excludeId) continue;
    const lift = (w.exercises || []).find((l) => l.name.trim().toLowerCase() === key);
    if (!lift?.sets?.some(setHasNumbers)) continue;
    return {
      ...lift,
      sets: lift.sets.map((s) => ({ ...s, done: false })),
    };
  }
  return null;
}

export function lastUsedFor(
  workouts: GymWorkout[],
  exerciseName: string
): { weight: number; reps: number; seconds: number } | null {
  const snap = lastLiftSnapshot(workouts, exerciseName);
  if (!snap) return null;
  let weight = 0;
  let reps = 0;
  let seconds = 0;
  for (let i = snap.sets.length - 1; i >= 0; i--) {
    const s = snap.sets[i];
    if (!weight && Number(s.weight)) weight = Number(s.weight);
    if (!reps && Number(s.reps)) reps = Number(s.reps);
    if (!seconds && Number(s.seconds)) seconds = Number(s.seconds);
    if (weight && (reps || seconds)) break;
  }
  if (!weight && !reps && !seconds) return null;
  return { weight, reps, seconds };
}

export function seedLiftsFromHistory(
  workouts: GymWorkout[],
  routineName: string,
  fallback: GymLift[]
): GymLift[] {
  const last = lastCompletedForRoutine(workouts, routineName);
  if (last?.exercises?.length) return cloneLifts(last.exercises);
  return fallback.map((lift) => {
    const snap = lastLiftSnapshot(workouts, lift.name);
    if (snap?.sets?.length) {
      return {
        ...lift,
        kind: snap.kind || lift.kind,
        equipment: snap.equipment || lift.equipment,
        sets: snap.sets.map((s) => ({ ...s, done: false })),
      };
    }
    return lift;
  });
}

function uniquePos(nums: number[]) {
  return [...new Set(nums.map((n) => Math.round(n * 4) / 4))].filter((n) => n > 0);
}

export function nearbyWeights(last: number): number[] {
  const center = last > 0 ? last : 40;
  const step = center >= 40 ? 5 : center >= 15 ? 2.5 : 1;
  const out: number[] = [];
  for (let i = -4; i <= 4; i++) out.push(center + i * step);
  return uniquePos(out);
}

export function nearbyReps(last: number): number[] {
  const center = last > 0 ? last : 10;
  const out: number[] = [];
  for (let i = -3; i <= 3; i++) {
    const n = center + i;
    if (n >= 1 && n <= 50) out.push(n);
  }
  return [...new Set(out)];
}

export function nearbySeconds(last: number): number[] {
  const center = last > 0 ? last : 30;
  const step = center >= 90 ? 30 : center >= 30 ? 15 : 5;
  const out: number[] = [];
  for (let i = -3; i <= 3; i++) out.push(center + i * step);
  return uniquePos(out);
}

export function sessionProgress(lifts: GymLift[]) {
  let total = 0;
  let done = 0;
  for (const lift of lifts) {
    for (const s of lift.sets) {
      total += 1;
      if (s.done) done += 1;
    }
  }
  return { total, done };
}
