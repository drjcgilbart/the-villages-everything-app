import { isExampleId } from "./sampleBoards";
import type { GymMediaItem, GymWorkout } from "./memberBoardModel";

export type DayRecap = {
  id: string;
  date: string;
  generatedAt: string;
  auto: boolean;
  favorite: boolean;
  title: string;
  headline: string;
  article: string;
  highlights: string[];
  improve: string[];
  bestMoment: string;
  closer: string;
  pdfUrl: string;
  mood: string;
  photos: { url: string; localId: string; caption: string }[];
};

export type DaySnapshot = {
  date: string;
  weekday: string;
  weight: number | null;
  habits: {
    waterOz: number;
    steps: number;
    proteinG: number;
    sleepHours: number;
    walked: boolean;
    water: boolean;
    protein: boolean;
    sleep: boolean;
    strength: boolean;
  };
  goals: {
    waterOz: number;
    steps: number;
    proteinG: number;
    sleepHours: number;
    calories: number;
  };
  medsTaken: { name: string; dosage: string; time: string }[];
  medsMissed: { name: string; time: string }[];
  meals: {
    type: string;
    title: string;
    calories: number | null;
    notes: string;
    time: string;
  }[];
  exercises: {
    activity: string;
    durationMin: number | null;
    distance: number | null;
    distanceUnit: string;
    notes: string;
  }[];
  gyms: {
    gymName: string;
    durationMin: number | "";
    felt: string;
    notes: string;
    lifts: string[];
    media: GymMediaItem[];
  }[];
  sleep: {
    hours: number | null;
    quality: string;
    bedtime: string;
    waketime: string;
    notes: string;
  } | null;
  photos: { caption: string; weight: number | null; photoName: string }[];
  journals: { title: string; mood: string; body: string }[];
};

const MEAL_LABEL: Record<string, string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
  snack: "Snack",
  omd: "One meal a day",
};

function clip(s: unknown, n: number) {
  return String(s || "").trim().slice(0, n);
}

function weekdayFor(date: string) {
  try {
    return new Date(`${date}T12:00:00`).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return date;
  }
}

export function prettyDate(date: string) {
  return weekdayFor(date);
}

export type HealthLike = {
  currentWeight?: number | null;
  dailyCalorieTarget?: number;
  dailyWaterGoalOz?: number;
  dailyStepsGoal?: number;
  dailyProteinGoalG?: number;
  sleepGoalHours?: number;
  habits?: Record<
    string,
    {
      waterOz?: number;
      steps?: number;
      proteinG?: number;
      sleepHours?: number;
      walked?: boolean;
      water?: boolean;
      protein?: boolean;
      sleep?: boolean;
      strength?: boolean;
    }
  >;
  entries?: { date?: string; weight?: number | null }[];
  meals?: {
    id?: string;
    date?: string;
    time?: string;
    mealType?: string;
    title?: string;
    calories?: number | null;
    notes?: string;
  }[];
  exercises?: {
    id?: string;
    date?: string;
    activity?: string;
    durationMin?: number | null;
    distance?: number | null;
    distanceUnit?: string;
    notes?: string;
  }[];
  journals?: {
    id?: string;
    date?: string;
    title?: string;
    mood?: string;
    body?: string;
  }[];
  medications?: {
    id?: string;
    name?: string;
    dosage?: string;
    active?: boolean;
    doseTimes?: { id?: string; time?: string; enabled?: boolean }[];
  }[];
  medicationLogs?: {
    id?: string;
    date?: string;
    time?: string;
    medicationName?: string;
    dosage?: string;
    doseTimeId?: string;
  }[];
  sleeps?: {
    id?: string;
    date?: string;
    hours?: number | null;
    quality?: string;
    bedtime?: string;
    waketime?: string;
    notes?: string;
  }[];
  progressPhotos?: {
    id?: string;
    date?: string;
    caption?: string;
    weight?: number | null;
    photoName?: string;
  }[];
};

export function buildDaySnapshot(
  date: string,
  health: HealthLike,
  workouts: GymWorkout[]
): DaySnapshot {
  const meals = (health.meals || []).filter(
    (m) => m.date === date && !isExampleId(m.id)
  );
  const exercises = (health.exercises || []).filter(
    (e) => e.date === date && !isExampleId(e.id)
  );
  const journals = (health.journals || []).filter(
    (j) => j.date === date && !isExampleId(j.id)
  );
  const sleeps = (health.sleeps || []).filter(
    (s) => s.date === date && !isExampleId(s.id)
  );
  const photos = (health.progressPhotos || []).filter(
    (p) => p.date === date && !isExampleId(p.id)
  );
  const gyms = (workouts || []).filter(
    (w) => w.date === date && !isExampleId(w.id)
  );
  const logs = (health.medicationLogs || []).filter(
    (l) => l.date === date && !isExampleId(l.id)
  );
  const takenKeys = new Set(
    logs.map((l) => `${l.doseTimeId || ""}|${l.medicationName || ""}`)
  );
  const medsTaken = logs.map((l) => ({
    name: clip(l.medicationName, 80) || "Medication",
    dosage: clip(l.dosage, 40),
    time: clip(l.time, 8),
  }));
  const medsMissed: { name: string; time: string }[] = [];
  if (logs.length) {
    for (const med of health.medications || []) {
      if (isExampleId(med.id) || med.active === false) continue;
      for (const dose of med.doseTimes || []) {
        if (dose.enabled === false) continue;
        const key = `${dose.id || ""}|${med.name || ""}`;
        if (!takenKeys.has(key) && !logs.some((l) => l.doseTimeId === dose.id)) {
          medsMissed.push({
            name: clip(med.name, 80) || "Medication",
            time: clip(dose.time, 8),
          });
        }
      }
    }
  }
  const dayEntry = (health.entries || []).find(
    (e) => e.date === date && e.weight != null
  )?.weight;
  const carried = [...(health.entries || [])]
    .filter((e) => e.date && e.date <= date && e.weight != null)
    .sort((a, b) => String(a.date).localeCompare(String(b.date)))
    .slice(-1)[0]?.weight;
  const weigh = dayEntry ?? carried ?? health.currentWeight ?? null;
  const rawHabit = health.habits?.[date];
  const sleepHours =
    Number(rawHabit?.sleepHours) ||
    Number(sleeps[0]?.hours) ||
    0;
  const habits = {
    waterOz: Number(rawHabit?.waterOz) || 0,
    steps: Number(rawHabit?.steps) || 0,
    proteinG: Number(rawHabit?.proteinG) || 0,
    sleepHours,
    walked: !!rawHabit?.walked,
    water: !!rawHabit?.water,
    protein: !!rawHabit?.protein,
    sleep: !!rawHabit?.sleep || sleepHours > 0,
    strength: !!rawHabit?.strength,
  };

  return {
    date,
    weekday: weekdayFor(date),
    weight: weigh ?? null,
    habits,
    goals: {
      waterOz: health.dailyWaterGoalOz || 64,
      steps: health.dailyStepsGoal || 8000,
      proteinG: health.dailyProteinGoalG || 120,
      sleepHours: health.sleepGoalHours || 8,
      calories: health.dailyCalorieTarget || 1800,
    },
    medsTaken,
    medsMissed,
    meals: meals.map((m) => ({
      type: MEAL_LABEL[String(m.mealType || "")] || clip(m.mealType, 20) || "Meal",
      title: clip(m.title, 120) || "Meal",
      calories: m.calories ?? null,
      notes: clip(m.notes, 240),
      time: clip(m.time, 8),
    })),
    exercises: exercises.map((e) => ({
      activity: clip(e.activity, 80) || "Movement",
      durationMin: e.durationMin ?? null,
      distance: e.distance ?? null,
      distanceUnit: clip(e.distanceUnit, 4) || "mi",
      notes: clip(e.notes, 240),
    })),
    gyms: gyms.map((w) => ({
      gymName: clip(w.gymName, 80) || "Gym",
      durationMin: w.durationMin,
      felt: clip(w.felt, 20),
      notes: clip(w.notes, 240),
      lifts: (w.exercises || [])
        .map((l) => {
          const sets = (l.sets || [])
            .map((s) => {
              if (s.seconds) return `${s.seconds}s`;
              if (s.weight || s.reps) return `${s.weight || 0} lb × ${s.reps || "?"}`;
              return "";
            })
            .filter(Boolean)
            .join(", ");
          return sets ? `${l.name}: ${sets}` : l.name;
        })
        .filter(Boolean)
        .slice(0, 20),
      media: w.media || [],
    })),
    sleep:
      sleeps[0] || sleepHours
        ? {
            hours: sleeps[0]?.hours ?? sleepHours ?? null,
            quality: clip(sleeps[0]?.quality, 20) || "average",
            bedtime: clip(sleeps[0]?.bedtime, 8),
            waketime: clip(sleeps[0]?.waketime, 8),
            notes: clip(sleeps[0]?.notes, 240),
          }
        : null,
    photos: photos.map((p) => ({
      caption: clip(p.caption, 160) || "Check-in",
      weight: p.weight ?? null,
      photoName: clip(p.photoName, 80),
    })),
    journals: journals.map((j) => ({
      title: clip(j.title, 120),
      mood: clip(j.mood, 40),
      body: clip(j.body, 2000),
    })),
  };
}

export function snapshotHasLogs(snap: DaySnapshot): boolean {
  const h = snap.habits;
  return Boolean(
    snap.medsTaken.length ||
      snap.meals.length ||
      snap.exercises.length ||
      snap.gyms.length ||
      snap.photos.length ||
      snap.journals.length ||
      (snap.sleep && (snap.sleep.hours || 0) > 0) ||
      h.walked ||
      h.water ||
      h.protein ||
      h.sleep ||
      h.strength ||
      h.steps > 0 ||
      h.waterOz > 0 ||
      h.proteinG > 0 ||
      h.sleepHours > 0
  );
}

export function datesWithLogs(
  health: HealthLike,
  workouts: GymWorkout[]
): Set<string> {
  const dates = new Set<string>();
  const push = (id: string | undefined, date?: string) => {
    if (date && !isExampleId(id)) dates.add(date);
  };
  for (const m of health.meals || []) push(m.id, m.date);
  for (const e of health.exercises || []) push(e.id, e.date);
  for (const j of health.journals || []) push(j.id, j.date);
  for (const s of health.sleeps || []) push(s.id, s.date);
  for (const p of health.progressPhotos || []) push(p.id, p.date);
  for (const l of health.medicationLogs || []) push(l.id, l.date);
  for (const w of workouts || []) push(w.id, w.date);
  for (const e of health.entries || []) {
    if (e.date && e.weight != null) dates.add(e.date);
  }
  for (const [d, h] of Object.entries(health.habits || {})) {
    if (
      h &&
      (Number(h.waterOz) ||
        Number(h.steps) ||
        Number(h.proteinG) ||
        Number(h.sleepHours) ||
        h.walked ||
        h.water ||
        h.protein ||
        h.sleep ||
        h.strength)
    ) {
      dates.add(d);
    }
  }
  return dates;
}

export function sanitizeDayRecaps(raw: unknown): DayRecap[] {
  if (!Array.isArray(raw)) return [];
  const out: DayRecap[] = [];
  for (const row of raw.slice(0, 120)) {
    if (!row || typeof row !== "object") continue;
    const r = row as Record<string, unknown>;
    const date = clip(r.date, 12);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) continue;
    const pdf = clip(r.pdfUrl, 220);
    const pdfUrl = pdf.startsWith("/api/media/") ? pdf : "";
    out.push({
      id: clip(r.id, 40) || `recap-${date}`,
      date,
      generatedAt: clip(r.generatedAt, 40),
      auto: r.auto === true,
      favorite: r.favorite === true,
      title: clip(r.title, 140) || `My day · ${date}`,
      headline: clip(r.headline, 200),
      article: clip(r.article, 4500),
      highlights: Array.isArray(r.highlights)
        ? r.highlights.map((h) => clip(h, 240)).filter(Boolean).slice(0, 6)
        : [],
      improve: Array.isArray(r.improve)
        ? r.improve.map((h) => clip(h, 240)).filter(Boolean).slice(0, 6)
        : [],
      bestMoment: clip(r.bestMoment, 280),
      closer: clip(r.closer, 280),
      pdfUrl,
      mood: clip(r.mood, 40),
      photos: Array.isArray(r.photos)
        ? r.photos
            .map((p) => {
              if (!p || typeof p !== "object") return null;
              const row = p as Record<string, unknown>;
              const url = clip(row.url, 220);
              const localId = clip(row.localId, 80);
              if (url && !url.startsWith("/api/media/")) return null;
              if (!url && !localId) return null;
              return {
                url,
                localId,
                caption: clip(row.caption, 80),
              };
            })
            .filter(Boolean)
            .slice(0, 6) as DayRecap["photos"]
        : [],
    });
  }
  const byDate = new Map<string, DayRecap>();
  for (const rec of out) byDate.set(rec.date, rec);
  return [...byDate.values()]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 60);
}

export type DayRecapStory = {
  title: string;
  headline: string;
  article: string;
  highlights: string[];
  improve: string[];
  bestMoment: string;
  closer: string;
};

function mealLine(m: DaySnapshot["meals"][number]) {
  const cal = m.calories != null ? ` (${m.calories} cal)` : "";
  const notes = m.notes ? ` — ${m.notes}` : "";
  return `${m.type}: ${m.title}${cal}${notes}`;
}

/** Local fallback when XAI_API_KEY is not set — still optimistic and specific. */
export function writeLocalDayStory(snap: DaySnapshot): DayRecapStory {
  const bits: string[] = [];
  if (snap.medsTaken.length) {
    bits.push(
      `you honored ${snap.medsTaken.length} medication${snap.medsTaken.length === 1 ? "" : "s"}`
    );
  }
  if (snap.meals.length) bits.push(`you fed yourself ${snap.meals.length} time${snap.meals.length === 1 ? "" : "s"}`);
  if (snap.exercises.length || snap.gyms.length) bits.push("you moved your body on purpose");
  if (snap.sleep) bits.push("you logged rest");
  if (snap.habits.waterOz || snap.habits.steps || snap.habits.proteinG) {
    bits.push("you tracked water, steps, or protein on the Overview sliders");
  }
  if (snap.weight != null) bits.push(`the scale read ${snap.weight} lbs`);
  if (snap.journals.length) bits.push("you wrote it down");
  const showingUp = bits.length
    ? bits.join(", ")
    : "you still opened the lanai and looked at the day";

  const p1 = `${snap.weekday} in The Villages was not a throwaway square on the calendar. It was a day you showed up for yourself: ${showingUp}. That is how a healthier, kinder version of you gets built — one ordinary Florida afternoon at a time.`;

  const mealText = snap.meals.length
    ? snap.meals.map(mealLine).join(". ")
    : "Meals were quiet on the log, which can mean a rest-and-reset day — and rest counts.";
  const moveParts: string[] = [];
  for (const e of snap.exercises) {
    moveParts.push(
      `${e.activity}${e.durationMin ? ` for ${e.durationMin} minutes` : ""}${e.notes ? ` (${e.notes})` : ""}`
    );
  }
  for (const g of snap.gyms) {
    const pics = (g.media || []).filter((m) => m.kind === "photo").length;
    moveParts.push(
      `${g.gymName}${g.durationMin ? ` · ${g.durationMin} min` : ""}${g.felt ? ` · felt ${g.felt}` : ""}${pics ? ` · ${pics} photo${pics === 1 ? "" : "s"}` : ""}`
    );
  }
  const moveText = moveParts.length
    ? `Movement: ${moveParts.join("; ")}.`
    : "No formal workout made the page. A walk to the mailbox, a stretch on the lanai, even choosing rest after pickleball still belongs in a good life.";
  const sleepText = snap.sleep
    ? `Sleep: ${snap.sleep.hours ?? "—"} hours, ${snap.sleep.quality} quality${snap.sleep.notes ? ` — ${snap.sleep.notes}` : ""}.`
    : "Sleep did not get a number today. Protecting the evening still matters.";
  const journalText = snap.journals[0]?.body
    ? `In your own words: “${snap.journals[0].body.slice(0, 280)}${snap.journals[0].body.length > 280 ? "…" : ""}”`
    : "";

  const overviewText = `Overview sliders: ${snap.weight != null ? `${snap.weight} lbs` : "weight not set"}, ${snap.habits.waterOz} oz water (goal ${snap.goals.waterOz}), ${snap.habits.steps.toLocaleString()} steps (goal ${snap.goals.steps.toLocaleString()}), ${snap.habits.proteinG} g protein (goal ${snap.goals.proteinG}), ${snap.habits.sleepHours || snap.sleep?.hours || 0} hours of sleep (goal ${snap.goals.sleepHours}).`;
  const p2 = `${overviewText} ${mealText} ${moveText} ${sleepText} ${journalText}`.replace(/\s+/g, " ").trim();

  const highlights: string[] = [];
  if (snap.medsTaken.length) {
    highlights.push(
      `Medications taken: ${snap.medsTaken.map((m) => m.name).slice(0, 4).join(", ")}.`
    );
  }
  if (snap.meals.length) highlights.push(`You logged real food, not a blank plate.`);
  if (snap.gyms.length || snap.exercises.length) {
    highlights.push(`You trained or moved — the body you live in noticed.`);
  }
  if (snap.sleep && (snap.sleep.hours || 0) >= snap.goals.sleepHours) {
    highlights.push(`Sleep met your ${snap.goals.sleepHours}-hour aim.`);
  }
  if (snap.journals.length) highlights.push(`You journaled. That is courage with a pen.`);
  if (snap.habits?.walked) highlights.push(`Walk box checked. Cart stayed in the garage a little longer.`);
  if (!highlights.length) {
    highlights.push("You opened My Space and paid attention. Awareness is the first win.");
  }

  const improve: string[] = [];
  if (snap.medsMissed.length) {
    improve.push(
      `A couple of doses did not get a check. Set the next alarm while the coffee is still warm — future-you will thank present-you.`
    );
  }
  if (!snap.exercises.length && !snap.gyms.length && !snap.habits?.walked) {
    improve.push(
      `Tomorrow, steal ten minutes: a rec-center lap, a Fit Club machine, or a walk that does not involve a parking spot.`
    );
  }
  if (snap.sleep && (snap.sleep.hours || 0) < snap.goals.sleepHours) {
    improve.push(
      `Sleep ran a little short of your ${snap.goals.sleepHours}-hour goal. Dim the lanai lights a half hour earlier and let the evening be boring on purpose.`
    );
  }
  if (!snap.journals.length) {
    improve.push(`One honest sentence in the journal tomorrow is enough. Moods love to be named.`);
  }
  if (!improve.length) {
    improve.push(
      `Keep the streak boring: same water glass, same shoes by the door, same kind voice when the scale has opinions.`
    );
  }

  const bestMoment =
    snap.journals[0]?.title ||
    snap.gyms[0]?.notes ||
    snap.exercises[0]?.notes ||
    snap.meals[0]?.title ||
    "You chose to keep the record. That is the moment.";

  return {
    title: `A good day in ${snap.weekday.split(",")[0] || "The Villages"}`,
    headline: `You showed up. The rest is details — and the details are pretty great.`,
    article: `${p1}\n\n${p2}\n\nNone of this is a medical plan or a scorecard of your worth. It is a neighborly recap of a life you are actively building: cart paths, rec centers, early dinners, and the quiet decision to become your best self without waiting for a perfect Monday.`,
    highlights: highlights.slice(0, 5),
    improve: improve.slice(0, 4),
    bestMoment: String(bestMoment).slice(0, 280),
    closer:
      "Tomorrow does not need a reinvention. It needs the next kind, keepable step — and you already know how to take one.",
  };
}

export function recapSystemPrompt() {
  return `You write private daily health recaps for a resident of The Villages, Florida (55+ active-adult community). Tone: optimistic, warm, specific, slightly witty, never sarcastic about the person's body. Purpose: motivate them to become their best self. You are a encouraging neighbor, not a doctor.

Rules:
- Use ONLY the facts in the JSON. Do not invent workouts, meals, doses, or quotes they did not log.
- If a section is empty, treat it as rest or an incomplete log — never shame.
- Missed meds: gentle, practical, no scare language. This is not medical advice.
- 3–5 short paragraphs in "article". US English.
- highlights: 3–5 concrete good things from THIS day.
- improve: 2–4 kind, doable next steps (Villages-flavored: rec center, Fit Club, cart path, lanai, early-bird dinner).
- bestMoment: one sentence from their actual day.
- closer: one motivational sentence.
- Return ONLY JSON with keys: title, headline, article, highlights (string[]), improve (string[]), bestMoment, closer.`;
}
