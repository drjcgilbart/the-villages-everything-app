import fs from "node:fs";

const IMAGE_BASE =
  "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/";
const SITE = "https://yuhonas.github.io/free-exercise-db/";

const ALIASES = {
  "Leg press": "Leg Press",
  "Chest press": "Leverage Chest Press",
  "Shoulder press": "Machine Shoulder (Military) Press",
  "Lat pulldown": "Wide-Grip Lat Pulldown",
  "Seated row": "Seated Cable Rows",
  "Pec deck": "Butterfly",
  "Leg curl": "Seated Leg Curl",
  "Leg extension": "Leg Extensions",
  "Smith machine": "Smith Machine Squat",
  "Assisted pull-up": "Band Assisted Pull-Up",
  "Ab crunch machine": "Ab Crunch Machine",
  "Calf raise machine": "Standing Calf Raises",
  "Chest fly machine": "Butterfly",
  "Rear delt fly": "Reverse Machine Flyes",
  "Hack squat": "Hack Squat",
  "Hip abduction": "Thigh Abductor",
  "Hip adduction": "Thigh Adductor",
  "Glute kickback": "Glute Kickback",
  "Seated calf raise": "Seated Calf Raise",
  "Assisted dip": "Dip Machine",
  "Arm curl machine": "Machine Bicep Curl",
  "Tricep machine": "Machine Triceps Extension",
  "Back extension": "Hyperextensions (Back Extensions)",
  "Rotary torso": "Torso Rotation",
  "Barbell bench press": "Barbell Bench Press - Medium Grip",
  "Incline bench press": "Barbell Incline Bench Press - Medium Grip",
  "Decline bench press": "Decline Barbell Bench Press",
  Squat: "Barbell Squat",
  Deadlift: "Barbell Deadlift",
  "Overhead press": "Standing Dumbbell Press",
  "Barbell row": "Bent Over Barbell Row",
  "Dumbbell press": "Incline Dumbbell Press",
  "Dumbbell row": "One-Arm Dumbbell Row",
  "Goblet squat": "Goblet Squat",
  "Romanian deadlift": "Romanian Deadlift",
  Lunges: "Dumbbell Lunges",
  "Bulgarian split squat": "Split Squats",
  "Hip thrust": "Barbell Hip Thrust",
  "Dumbbell curl": "Dumbbell Bicep Curl",
  "Hammer curl": "Hammer Curls",
  "Preacher curl": "Preacher Curl",
  "Tricep extension": "Dumbbell Tricep Extension -Pronated Grip",
  "Skull crusher": "EZ-Bar Skullcrusher",
  "Lateral raise": "Side Lateral Raise",
  "Front raise": "Front Dumbbell Raise",
  "Farmer carry": "Farmer's Walk",
  "Kettlebell swing": "One-Arm Kettlebell Swings",
  "Step-ups": "Dumbbell Step Ups",
  Shrug: "Barbell Shrug",
  "Cable row": "Seated Cable Rows",
  "Face pull": "Face Pull",
  "Tricep pushdown": "Triceps Pushdown",
  "Cable fly": "Flat Bench Cable Flyes",
  Woodchop: "Standing Cable Wood Chop",
  "Cable curl": "Standing Biceps Cable Curl",
  "Straight-arm pulldown": "Straight-Arm Pulldown",
  "Cable crunch": "Cable Crunch",
  "Pallof press": "Pallof Press",
  Treadmill: "Walking, Treadmill",
  Elliptical: "Elliptical Trainer",
  "Recumbent bike": "Recumbent Bike",
  "Upright bike": "Air Bike",
  Rower: "Rowing, Stationary",
  "Stair climber": "Stairmaster",
  "Arc trainer": "Elliptical Trainer",
  "Assault bike": "Air Bike",
  "Jump rope": "Rope Jumping",
  "Battle ropes": "Battling Ropes",
  "Push-ups": "Pushups",
  "Sit-ups": "Sit-Up",
  Plank: "Plank",
  "Squats (bodyweight)": "Bodyweight Squat",
  "Wall sit": "Chair Squat",
  "Bird dog": "Superman",
  "Pull-ups": "Pullups",
  "Chin-ups": "Chin-Up",
  Dips: "Dips - Triceps Version",
  "Hip bridge": "Butt Lift (Bridge)",
  "Russian twist": "Russian Twist",
  Burpees: "Pushups",
  "Mountain climbers": "Mountain Climbers",
};

function norm(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\b(the|a|an|machine|bar|the)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const db = JSON.parse(fs.readFileSync("scripts/free-exercise-db.json", "utf8"));
const byName = new Map(db.map((e) => [norm(e.name), e]));
const byId = new Map(db.map((e) => [e.id, e]));

function score(query, name) {
  const a = norm(query);
  const b = norm(name);
  if (!a || !b) return 0;
  if (a === b) return 100;
  if (b.startsWith(a) || a.startsWith(b)) return 86;
  if (b.includes(a) || a.includes(b)) return 74;
  const at = new Set(a.split(" "));
  const bt = new Set(b.split(" "));
  let hit = 0;
  for (const t of at) if (bt.has(t)) hit += 1;
  return (hit / Math.max(at.size, 1)) * 60;
}

function pick(query) {
  const alias = ALIASES[query];
  if (alias) {
    const hit = byName.get(norm(alias)) || db.find((e) => e.name === alias);
    if (hit) return hit;
  }
  let best = null;
  let bestScore = 0;
  for (const e of db) {
    const s = score(query, e.name);
    if (s > bestScore) {
      best = e;
      bestScore = s;
    }
  }
  return bestScore >= 55 ? best : null;
}

function compact(e) {
  if (!e) return null;
  return {
    id: e.id,
    name: e.name,
    images: (e.images || []).slice(0, 2),
    steps: (e.instructions || []).slice(0, 3),
  };
}

const names = [
  ...new Set(
    Object.keys(ALIASES).concat([
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
      "Cable row",
      "Face pull",
      "Tricep pushdown",
      "Cable fly",
      "Woodchop",
      "Cable curl",
      "Straight-arm pulldown",
      "Cable crunch",
      "Pallof press",
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
    ])
  ),
];

const byCatalog = {};
const missing = [];
for (const n of names) {
  const hit = pick(n);
  if (!hit) missing.push(n);
  else byCatalog[n] = compact(hit);
}

const index = db.map((e) => ({ id: e.id, name: e.name }));

const out = `/**
 * Compact lookup into the public-domain free-exercise-db
 * (https://github.com/yuhonas/free-exercise-db — Unlicense).
 */
export const EXERCISE_IMAGE_BASE =
  ${JSON.stringify(IMAGE_BASE)};
export const EXERCISE_DEMO_SITE = ${JSON.stringify(SITE)};

export type ExerciseDemo = {
  id: string;
  name: string;
  images: string[];
  steps: string[];
};

const BY_CATALOG: Record<string, ExerciseDemo> = ${JSON.stringify(byCatalog)};
const INDEX: { id: string; name: string }[] = ${JSON.stringify(index)};

function norm(s: string) {
  return s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\\s+/g, " ")
    .trim();
}

export function exerciseVideoUrl(name: string) {
  return \`https://www.youtube.com/results?search_query=\${encodeURIComponent(
    \`\${name} exercise proper form\`
  )}\`;
}

export function exerciseImageUrl(path: string) {
  return EXERCISE_IMAGE_BASE + path;
}

export function lookupExerciseDemo(name: string): ExerciseDemo | null {
  const raw = name.trim();
  if (!raw) return null;
  if (BY_CATALOG[raw]) return BY_CATALOG[raw];
  const key = norm(raw);
  const exact = Object.entries(BY_CATALOG).find(([n]) => norm(n) === key);
  if (exact) return exact[1];
  let best: { id: string; name: string } | null = null;
  let bestScore = 0;
  for (const row of INDEX) {
    const b = norm(row.name);
    let s = 0;
    if (b === key) s = 100;
    else if (b.includes(key) || key.includes(b)) s = 80;
    if (s > bestScore) {
      best = row;
      bestScore = s;
    }
  }
  if (!best || bestScore < 70) return null;
  const fromCatalog = Object.values(BY_CATALOG).find((d) => d.id === best.id);
  if (fromCatalog) return fromCatalog;
  return {
    id: best.id,
    name: best.name,
    images: [\`\${best.id}/0.jpg\`, \`\${best.id}/1.jpg\`],
    steps: [],
  };
}
`;

fs.writeFileSync("src/lib/gymExerciseDemos.ts", out);
console.log("mapped", Object.keys(byCatalog).length, "missing", missing);
if (missing.length) console.log(missing);
