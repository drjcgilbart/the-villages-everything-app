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
  doseTimes: DoseTime[];
  alarmEnabled: boolean;
  active: boolean;
};

type Meal = {
  id: string;
  date: string;
  name: string;
  calories: number | null;
  proteinG: number | null;
  note: string;
};

type Exercise = {
  id: string;
  date: string;
  activity: string;
  minutes: number | null;
  note: string;
};

type Journal = {
  id: string;
  date: string;
  text: string;
};

type DayHabit = {
  waterOz: number;
  steps: number;
  proteinG: number;
  walked: boolean;
};

type Sleep = {
  id: string;
  date: string;
  hours: number | null;
  quality: string;
  note: string;
};

type ProgressPhoto = {
  id: string;
  date: string;
  note: string;
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
  weightLog: { date: string; weight: number }[];
  meals: Meal[];
  exercises: Exercise[];
  journals: Journal[];
  medications: Medication[];
  sleeps: Sleep[];
  progressPhotos: ProgressPhoto[];
  /** medId:doseId:date → done */
  medDone: Record<string, boolean>;
};

const EXERCISE_PRESETS = [
  "Walking",
  "Swimming",
  "Golf",
  "Pickleball",
  "Cycling",
  "Strength",
  "Yoga",
  "Other",
];

function emptyHabit(): DayHabit {
  return { waterOz: 0, steps: 0, proteinG: 0, walked: false };
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
    weightLog: [],
    meals: [],
    exercises: [],
    journals: [],
    medications: [],
    sleeps: [],
    progressPhotos: [],
    medDone: {},
  };
}

function bmi(weight: number | null, heightIn: number | null): number | null {
  if (!weight || !heightIn || heightIn <= 0) return null;
  return Math.round(((weight * 703) / (heightIn * heightIn)) * 10) / 10;
}

/**
 * Health lanai — ported from the My Retirement Reboot health tracker.
 * Saved to the Hub member account (PC, iPhone, and Android share it).
 */
export function MySpaceHealthBoard() {
  const { value, save, ready } = useMemberBoard<HealthState>(
    "health",
    defaultState(),
    true,
    { localKey: KEY, debounceMs: 700 }
  );
  const state: HealthState = {
    ...defaultState(),
    ...value,
    sleeps: Array.isArray(value.sleeps) ? value.sleeps : [],
    progressPhotos: Array.isArray(value.progressPhotos) ? value.progressPhotos : [],
    medications: Array.isArray(value.medications) ? value.medications : [],
  };
  const [tab, setTab] = useState<
    "today" | "weight" | "meds" | "meals" | "move" | "sleep" | "photos" | "journal" | "goals"
  >("today");
  const [sleepHours, setSleepHours] = useState("8");
  const [sleepQuality, setSleepQuality] = useState("good");
  const [photoNote, setPhotoNote] = useState("");
  const [mealName, setMealName] = useState("");
  const [mealCal, setMealCal] = useState("");
  const [exActivity, setExActivity] = useState("Walking");
  const [exMin, setExMin] = useState("30");
  const [journalText, setJournalText] = useState("");
  const [medName, setMedName] = useState("");
  const [medDose, setMedDose] = useState("");
  const [medTime, setMedTime] = useState("08:00");
  const [weightInput, setWeightInput] = useState("");

  const today = todayKeyEastern();

  function persist(next: HealthState) {
    void save(next);
  }

  const habit = state.habits[today] || emptyHabit();

  function patchHabit(patch: Partial<DayHabit>) {
    const nextHabit = { ...emptyHabit(), ...habit, ...patch };
    persist({
      ...state,
      habits: { ...state.habits, [today]: nextHabit },
    });
  }

  const bmiVal = bmi(state.currentWeight, state.heightInches);
  const lost =
    state.startWeight != null && state.currentWeight != null
      ? Math.round((state.startWeight - state.currentWeight) * 10) / 10
      : null;
  const toGoal =
    state.goalWeight != null && state.currentWeight != null
      ? Math.round((state.currentWeight - state.goalWeight) * 10) / 10
      : null;

  const todayMeals = useMemo(
    () => state.meals.filter((m) => m.date === today),
    [state.meals, today]
  );
  const todayEx = useMemo(
    () => state.exercises.filter((e) => e.date === today),
    [state.exercises, today]
  );

  // Med alarm check every 30s
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
          const key = `${med.id}:${dose.id}:${d}`;
          if (state.medDone[key] || fired.has(key)) continue;
          fired.add(key);
          playAlarmTone(state.medAlarmSound, state.medAlarmDurationSec || 8);
        }
      }
    };
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, [ready, state.medAlarmEnabled, state.medAlarmSound, state.medications, state.medDone]);

  if (!ready) return <p className="panel-hint">Loading health lanai…</p>;

  return (
    <div className="ms-health-board">
      <p className="ms-module-lead">
        Weight, meds, meals, movement, and a journal — private on this device
        (same idea as the desktop Villages dashboard). No wellness cult
        required.
      </p>

      <div className="ms-subnav" role="tablist">
        {(
          [
            ["today", "Overview"],
            ["weight", "Weight"],
            ["meds", "Meds"],
            ["meals", "Meals"],
            ["move", "Exercise"],
            ["sleep", "Sleep"],
            ["photos", "Photos"],
            ["journal", "Journal"],
            ["goals", "Goals"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={`ms-subnav-btn ${tab === id ? "active" : ""}`}
            onClick={() => setTab(id)}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "today" && (
        <div className="about-panel ms-module">
          <div className="ms-stat-row">
            <div className="ms-stat">
              <span>Weight</span>
              <strong>
                {state.currentWeight != null ? `${state.currentWeight} lbs` : "—"}
              </strong>
            </div>
            <div className="ms-stat">
              <span>BMI</span>
              <strong>{bmiVal ?? "—"}</strong>
            </div>
            <div className="ms-stat">
              <span>Lost</span>
              <strong>{lost != null ? `${lost} lbs` : "—"}</strong>
            </div>
            <div className="ms-stat">
              <span>To goal</span>
              <strong>{toGoal != null ? `${toGoal} lbs` : "—"}</strong>
            </div>
          </div>

          <div className="form-grid ms-module-form" style={{ marginTop: "1rem" }}>
            <div className="field">
              <label>
                Water ({habit.waterOz} / {state.dailyWaterGoalOz} oz)
              </label>
              <div className="hero-actions">
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() =>
                    patchHabit({ waterOz: Math.max(0, habit.waterOz - 8) })
                  }
                >
                  −8
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => patchHabit({ waterOz: habit.waterOz + 8 })}
                >
                  +8 oz
                </button>
              </div>
            </div>
            <div className="field">
              <label>Steps (goal {state.dailyStepsGoal.toLocaleString()})</label>
              <input
                type="number"
                min={0}
                value={habit.steps || ""}
                onChange={(e) =>
                  patchHabit({ steps: Math.max(0, Number(e.target.value) || 0) })
                }
                placeholder="0"
              />
            </div>
            <div className="field">
              <label>Protein g (goal {state.dailyProteinGoalG})</label>
              <input
                type="number"
                min={0}
                value={habit.proteinG || ""}
                onChange={(e) =>
                  patchHabit({
                    proteinG: Math.max(0, Number(e.target.value) || 0),
                  })
                }
              />
            </div>
            <label className="ms-check">
              <input
                type="checkbox"
                checked={habit.walked}
                onChange={(e) => patchHabit({ walked: e.target.checked })}
              />
              I moved on purpose today
            </label>
          </div>

          <h4 style={{ marginTop: "1.25rem" }}>Today’s meds</h4>
          {state.medications.filter((m) => m.active).length === 0 ? (
            <p className="panel-hint">No medications yet — add some under Meds.</p>
          ) : (
            <ul className="ms-check-list">
              {state.medications
                .filter((m) => m.active)
                .flatMap((med) =>
                  med.doseTimes
                    .filter((d) => d.enabled)
                    .map((dose) => {
                      const key = `${med.id}:${dose.id}:${today}`;
                      const done = !!state.medDone[key];
                      return (
                        <li key={key}>
                          <label className="ms-check">
                            <input
                              type="checkbox"
                              checked={done}
                              onChange={(e) => {
                                persist({
                                  ...state,
                                  medDone: {
                                    ...state.medDone,
                                    [key]: e.target.checked,
                                  },
                                });
                              }}
                            />
                            <span>
                              <strong>{med.name}</strong>
                              {med.dosage ? ` · ${med.dosage}` : ""} · {dose.time}{" "}
                              {dose.label}
                            </span>
                          </label>
                        </li>
                      );
                    })
                )}
            </ul>
          )}

          <p className="panel-hint" style={{ marginBottom: 0 }}>
            Meals today: {todayMeals.length} · Workouts: {todayEx.length}
          </p>
        </div>
      )}

      {tab === "weight" && (
        <div className="about-panel ms-module">
          <form
            className="form-grid ms-module-form"
            onSubmit={(e) => {
              e.preventDefault();
              const w = Number(weightInput);
              if (!Number.isFinite(w) || w <= 0) return;
              const rounded = Math.round(w * 10) / 10;
              persist({
                ...state,
                currentWeight: rounded,
                startWeight: state.startWeight ?? rounded,
                weightLog: [
                  { date: today, weight: rounded },
                  ...state.weightLog.filter((x) => x.date !== today),
                ].slice(0, 90),
              });
              setWeightInput("");
            }}
          >
            <div className="field">
              <label>Log weight today (lbs)</label>
              <input
                type="number"
                step="0.1"
                value={weightInput}
                onChange={(e) => setWeightInput(e.target.value)}
                placeholder={
                  state.currentWeight != null
                    ? String(state.currentWeight)
                    : "e.g. 185"
                }
                required
              />
            </div>
            <button type="submit" className="btn btn-primary btn-sm">
              Save weight
            </button>
          </form>
          <ul className="ms-simple-list">
            {state.weightLog.slice(0, 14).map((e) => (
              <li key={e.date}>
                <strong>{e.weight} lbs</strong>
                <span className="panel-hint">{e.date}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {tab === "meds" && (
        <div className="about-panel ms-module">
          <form
            className="form-grid ms-module-form"
            onSubmit={(e) => {
              e.preventDefault();
              const name = medName.trim();
              if (!name) return;
              const med: Medication = {
                id: uid("med"),
                name: name.slice(0, 120),
                dosage: medDose.trim().slice(0, 80),
                doseTimes: [
                  {
                    id: uid("dose"),
                    time: medTime || "08:00",
                    label: "Dose",
                    enabled: true,
                  },
                ],
                alarmEnabled: true,
                active: true,
              };
              persist({ ...state, medications: [...state.medications, med] });
              setMedName("");
              setMedDose("");
            }}
          >
            <div className="field">
              <label>Medication</label>
              <input
                value={medName}
                onChange={(e) => setMedName(e.target.value)}
                placeholder="e.g. Vitamin D"
                required
              />
            </div>
            <div className="field">
              <label>Dosage</label>
              <input
                value={medDose}
                onChange={(e) => setMedDose(e.target.value)}
                placeholder="1000 IU"
              />
            </div>
            <div className="field">
              <label>Time (Eastern)</label>
              <input
                type="time"
                value={medTime}
                onChange={(e) => setMedTime(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary btn-sm">
              Add med
            </button>
          </form>
          <label className="ms-check" style={{ marginTop: "0.75rem" }}>
            <input
              type="checkbox"
              checked={state.medAlarmEnabled}
              onChange={(e) =>
                persist({ ...state, medAlarmEnabled: e.target.checked })
              }
            />
            Browser alarm sounds at dose times (keep this tab open)
          </label>
          <div className="field" style={{ marginTop: "0.5rem" }}>
            <label>Alarm tone</label>
            <select
              value={state.medAlarmSound}
              onChange={(e) =>
                persist({
                  ...state,
                  medAlarmSound: e.target.value as AlarmTone,
                })
              }
            >
              <option value="classic">Classic beep</option>
              <option value="chime">Soft chime</option>
              <option value="urgent">Urgent</option>
              <option value="digital">Digital</option>
            </select>
          </div>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => playAlarmTone(state.medAlarmSound, 2)}
          >
            Test alarm
          </button>
          <ul className="ms-simple-list">
            {state.medications.map((m) => (
              <li key={m.id}>
                <div>
                  <strong>{m.name}</strong>
                  {m.dosage ? ` · ${m.dosage}` : ""} ·{" "}
                  {m.doseTimes.map((d) => d.time).join(", ")}
                </div>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() =>
                    persist({
                      ...state,
                      medications: state.medications.filter((x) => x.id !== m.id),
                    })
                  }
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {tab === "meals" && (
        <div className="about-panel ms-module">
          <form
            className="form-grid ms-module-form"
            onSubmit={(e) => {
              e.preventDefault();
              const name = mealName.trim();
              if (!name) return;
              const meal: Meal = {
                id: uid("meal"),
                date: today,
                name: name.slice(0, 120),
                calories: mealCal ? Number(mealCal) || null : null,
                proteinG: null,
                note: "",
              };
              persist({ ...state, meals: [meal, ...state.meals].slice(0, 200) });
              setMealName("");
              setMealCal("");
            }}
          >
            <div className="field">
              <label>Meal / snack</label>
              <input
                value={mealName}
                onChange={(e) => setMealName(e.target.value)}
                placeholder="Greek yogurt"
                required
              />
            </div>
            <div className="field">
              <label>Calories (optional)</label>
              <input
                type="number"
                value={mealCal}
                onChange={(e) => setMealCal(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary btn-sm">
              Log meal
            </button>
          </form>
          <ul className="ms-simple-list">
            {state.meals.slice(0, 20).map((m) => (
              <li key={m.id}>
                <div>
                  <strong>{m.name}</strong>
                  {m.calories != null ? ` · ${m.calories} cal` : ""}
                  <span className="panel-hint"> · {m.date}</span>
                </div>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() =>
                    persist({
                      ...state,
                      meals: state.meals.filter((x) => x.id !== m.id),
                    })
                  }
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {tab === "move" && (
        <div className="about-panel ms-module">
          <form
            className="form-grid ms-module-form"
            onSubmit={(e) => {
              e.preventDefault();
              const ex: Exercise = {
                id: uid("ex"),
                date: today,
                activity: exActivity,
                minutes: exMin ? Number(exMin) || null : null,
                note: "",
              };
              persist({
                ...state,
                exercises: [ex, ...state.exercises].slice(0, 200),
              });
            }}
          >
            <div className="field">
              <label>Activity</label>
              <select
                value={exActivity}
                onChange={(e) => setExActivity(e.target.value)}
              >
                {EXERCISE_PRESETS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Minutes</label>
              <input
                type="number"
                min={1}
                value={exMin}
                onChange={(e) => setExMin(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary btn-sm">
              Log workout
            </button>
          </form>
          <ul className="ms-simple-list">
            {state.exercises.slice(0, 20).map((x) => (
              <li key={x.id}>
                <div>
                  <strong>{x.activity}</strong>
                  {x.minutes != null ? ` · ${x.minutes} min` : ""}
                  <span className="panel-hint"> · {x.date}</span>
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
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {tab === "sleep" && (
        <div className="about-panel ms-module">
          <form
            className="form-grid ms-module-form"
            onSubmit={(e) => {
              e.preventDefault();
              persist({
                ...state,
                sleeps: [
                  {
                    id: uid("sl"),
                    date: today,
                    hours: Number(sleepHours) || null,
                    quality: sleepQuality,
                    note: "",
                  },
                  ...state.sleeps.filter((s) => s.date !== today),
                ].slice(0, 90),
              });
            }}
          >
            <div className="field">
              <label>Hours last night</label>
              <input
                type="number"
                step="0.5"
                value={sleepHours}
                onChange={(e) => setSleepHours(e.target.value)}
              />
            </div>
            <div className="field">
              <label>Quality</label>
              <select value={sleepQuality} onChange={(e) => setSleepQuality(e.target.value)}>
                <option value="great">Great</option>
                <option value="good">Good</option>
                <option value="average">Average</option>
                <option value="below-average">Below average</option>
                <option value="terrible">Terrible</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary btn-sm">
              Save sleep
            </button>
          </form>
          <ul className="ms-simple-list">
            {state.sleeps.slice(0, 14).map((s) => (
              <li key={s.id}>
                <strong>
                  {s.hours ?? "—"} hrs · {s.quality}
                </strong>
                <span className="panel-hint">{s.date}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {tab === "photos" && (
        <div className="about-panel ms-module">
          <p className="panel-hint">
            Progress notes (date + caption). Keep photos on your phone camera roll; this is the
            private notebook of when you took them.
          </p>
          <form
            className="form-grid ms-module-form"
            onSubmit={(e) => {
              e.preventDefault();
              if (!photoNote.trim()) return;
              persist({
                ...state,
                progressPhotos: [
                  { id: uid("pp"), date: today, note: photoNote.trim().slice(0, 200) },
                  ...state.progressPhotos,
                ].slice(0, 60),
              });
              setPhotoNote("");
            }}
          >
            <div className="field">
              <label>Progress note</label>
              <input
                value={photoNote}
                onChange={(e) => setPhotoNote(e.target.value)}
                placeholder="Week 4 · lanai light"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary btn-sm">
              Add
            </button>
          </form>
          <ul className="ms-simple-list">
            {state.progressPhotos.map((p) => (
              <li key={p.id}>
                <strong>{p.note}</strong>
                <span className="panel-hint">{p.date}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {tab === "journal" && (
        <div className="about-panel ms-module">
          <form
            className="form-grid ms-module-form"
            onSubmit={(e) => {
              e.preventDefault();
              const text = journalText.trim();
              if (!text) return;
              const entry: Journal = {
                id: uid("j"),
                date: today,
                text: text.slice(0, 2000),
              };
              persist({
                ...state,
                journals: [entry, ...state.journals].slice(0, 100),
              });
              setJournalText("");
            }}
          >
            <div className="field">
              <label>Today’s note</label>
              <textarea
                rows={4}
                value={journalText}
                onChange={(e) => setJournalText(e.target.value)}
                placeholder="What went well on the cart path today…"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary btn-sm">
              Save journal
            </button>
          </form>
          <ul className="ms-simple-list ms-journal-list">
            {state.journals.slice(0, 15).map((j) => (
              <li key={j.id}>
                <div>
                  <span className="panel-hint">{j.date}</span>
                  <p style={{ margin: "0.25rem 0 0" }}>{j.text}</p>
                </div>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() =>
                    persist({
                      ...state,
                      journals: state.journals.filter((x) => x.id !== j.id),
                    })
                  }
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {tab === "goals" && (
        <div className="about-panel ms-module">
          <div className="form-grid ms-module-form">
            <div className="field">
              <label>Start weight (lbs)</label>
              <input
                type="number"
                step="0.1"
                value={state.startWeight ?? ""}
                onChange={(e) =>
                  persist({
                    ...state,
                    startWeight: e.target.value
                      ? Number(e.target.value)
                      : null,
                  })
                }
              />
            </div>
            <div className="field">
              <label>Goal weight (lbs)</label>
              <input
                type="number"
                step="0.1"
                value={state.goalWeight ?? ""}
                onChange={(e) =>
                  persist({
                    ...state,
                    goalWeight: e.target.value
                      ? Number(e.target.value)
                      : null,
                  })
                }
              />
            </div>
            <div className="field">
              <label>Height (inches)</label>
              <input
                type="number"
                value={state.heightInches ?? ""}
                onChange={(e) =>
                  persist({
                    ...state,
                    heightInches: e.target.value
                      ? Number(e.target.value)
                      : null,
                  })
                }
                placeholder="e.g. 70"
              />
            </div>
            <div className="field">
              <label>Daily calorie target</label>
              <input
                type="number"
                value={state.dailyCalorieTarget}
                onChange={(e) =>
                  persist({
                    ...state,
                    dailyCalorieTarget: Math.max(800, Number(e.target.value) || 1800),
                  })
                }
              />
            </div>
            <div className="field">
              <label>Sleep goal (hours)</label>
              <input
                type="number"
                step="0.5"
                value={state.sleepGoalHours}
                onChange={(e) =>
                  persist({
                    ...state,
                    sleepGoalHours: Math.max(4, Number(e.target.value) || 8),
                  })
                }
              />
            </div>
            <div className="field">
              <label>Daily water goal (oz)</label>
              <input
                type="number"
                value={state.dailyWaterGoalOz}
                onChange={(e) =>
                  persist({
                    ...state,
                    dailyWaterGoalOz: Math.max(
                      8,
                      Number(e.target.value) || 64
                    ),
                  })
                }
              />
            </div>
            <div className="field">
              <label>Daily steps goal</label>
              <input
                type="number"
                value={state.dailyStepsGoal}
                onChange={(e) =>
                  persist({
                    ...state,
                    dailyStepsGoal: Math.max(
                      1000,
                      Number(e.target.value) || 8000
                    ),
                  })
                }
              />
            </div>
            <div className="field">
              <label>Daily protein goal (g)</label>
              <input
                type="number"
                value={state.dailyProteinGoalG}
                onChange={(e) =>
                  persist({
                    ...state,
                    dailyProteinGoalG: Math.max(
                      20,
                      Number(e.target.value) || 120
                    ),
                  })
                }
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
