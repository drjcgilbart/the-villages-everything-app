"use client";

import { useMemo, useState } from "react";
import {
  emptyBoards,
  type GymBoard,
  type GymLift,
  type GymPlace,
  type GymSet,
  type GymWorkout,
} from "@/lib/memberBoardModel";
import { useMemberBoard } from "@/components/useMemberBoard";

type GymTab = "today" | "gyms" | "history" | "supps";

const FIT_HOURS = "Mon–Fri 6:30am–8:00pm · Sat–Sun 7:00am–5:00pm";
const FIT_GEAR =
  "Typical Fit Club mix: cardio machines, a short circuit, free weights, and core trainers. Clubs are compact — equipment varies and a machine may be out for repair.";
const FIT_FEES =
  "Fit Club membership is separate from the amenity fee. District-published examples: about $9.35 daily, $44.39 / one month single, $363.49 / 12-month single (plus tax; couple rates available). Confirm at the rec desk — prices change.";
const FIT_OFFICIAL = "https://www.districtgov.org/programs/fit-club/";
const FIT_RULES = "https://www.districtgov.org/forms/fit-club-rules";

const FIT_CLUBS = [
  {
    id: "fc-colony",
    name: "Colony Cottage Fit Club",
    rec: "Colony Cottage Recreation",
    phone: "352-750-5282",
    address: "510 Colony Blvd, The Villages, FL",
  },
  {
    id: "fc-ezell",
    name: "Ezell Fit Club",
    rec: "Ezell Recreation",
    phone: "352-674-1859",
    address: "Ezell Regional Recreation Center, The Villages, FL",
  },
  {
    id: "fc-fenney",
    name: "Fenney Fit Club",
    rec: "Fenney Recreation",
    phone: "352-674-8464",
    address: "Fenney Regional Recreation Center, The Villages, FL",
  },
  {
    id: "fc-laurel",
    name: "Laurel Manor Fit Club",
    rec: "Laurel Manor Recreation",
    phone: "352-751-7101",
    address: "1985 Laurel Manor Dr, The Villages, FL",
  },
  {
    id: "fc-mulberry",
    name: "Mulberry Grove Fit Club",
    rec: "Mulberry Grove Recreation",
    phone: "352-674-1829",
    address: "8445 SE 165 Mulberry Lane, The Villages, FL",
  },
  {
    id: "fc-olympia",
    name: "Olympia Fit Club",
    rec: "Olympia Recreation",
    phone: "352-674-1944",
    address: "1210 McPherson Terrace, The Villages, FL 33585",
    note: "Eastport. Indoor Fit Club plus the Athletic Club gymnasium (pickleball, basketball, volleyball). Bring a resident ID.",
  },
  {
    id: "fc-rohan",
    name: "Rohan Fit Club",
    rec: "Rohan Recreation",
    phone: "352-674-8404",
    address: "Rohan Regional Recreation Center, The Villages, FL",
  },
  {
    id: "fc-seabreeze",
    name: "SeaBreeze Fit Club",
    rec: "SeaBreeze Recreation",
    phone: "352-750-0237",
    address: "SeaBreeze Regional Recreation Center, The Villages, FL",
  },
].map((c) => ({ ...c, hours: FIT_HOURS, gear: FIT_GEAR }));

const CHAIN_PRESETS = [
  { chain: "Planet Fitness", name: "Planet Fitness" },
  { chain: "LA Fitness", name: "LA Fitness" },
  { chain: "Anytime Fitness", name: "Anytime Fitness" },
  { chain: "YMCA", name: "YMCA" },
  { chain: "Orangetheory", name: "Orangetheory Fitness" },
  { chain: "Home", name: "Home gym" },
];

const EQUIPMENT: Record<string, string[]> = {
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

const EXERCISE_NAMES = [...new Set(Object.values(EQUIPMENT).flat())];
const EXERCISE_KIND = Object.fromEntries(
  Object.entries(EQUIPMENT).flatMap(([kind, names]) => names.map((n) => [n, kind]))
) as Record<string, string>;
const KIND_LABEL: Record<string, string> = {
  machine: "Machine",
  free: "Free weights",
  cable: "Cable",
  cardio: "Cardio",
  bodyweight: "Bodyweight",
};
const FELT_OPTS = [
  { id: "", label: "—" },
  { id: "great", label: "Great" },
  { id: "good", label: "Good" },
  { id: "ok", label: "OK" },
  { id: "tired", label: "Tired" },
];
const SUPPLEMENT_PRESETS = [
  "Creatine",
  "Protein powder",
  "Electrolytes",
  "Vitamin D",
  "Fish oil",
  "Collagen",
  "Magnesium",
  "Pre-workout",
  "BCAA",
];
const TABS: { id: GymTab; label: string; icon: string }[] = [
  { id: "today", label: "Log workout", icon: "🏋️" },
  { id: "gyms", label: "Fit Clubs & gyms", icon: "📍" },
  { id: "history", label: "History", icon: "📜" },
  { id: "supps", label: "Supplements", icon: "💊" },
];

function uid(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 5)}`;
}

function today() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "America/New_York" });
}

function daysAgo(dateStr: string, todayStr: string): number {
  const a = Date.parse(`${dateStr}T12:00:00`);
  const b = Date.parse(`${todayStr}T12:00:00`);
  if (!Number.isFinite(a) || !Number.isFinite(b)) return 999;
  return Math.round((b - a) / 86400000);
}

function yesterday(dateStr: string): string {
  const d = new Date(`${dateStr}T12:00:00`);
  d.setDate(d.getDate() - 1);
  return d.toLocaleDateString("en-CA", { timeZone: "America/New_York" });
}

function emptySet(): GymSet {
  return { weight: "", reps: "", seconds: "" };
}

function emptyLift(): GymLift {
  return { name: "Leg press", kind: "machine", equipment: "", sets: [emptySet()] };
}

function gymVolume(workout: GymWorkout) {
  let sets = 0;
  let reps = 0;
  let load = 0;
  for (const lift of workout.exercises || []) {
    for (const set of lift.sets || []) {
      sets += 1;
      const r = Number(set.reps) || 0;
      const w = Number(set.weight) || 0;
      reps += r;
      load += w * r;
    }
  }
  return { sets, reps, load };
}

function computeStats(workouts: GymWorkout[]) {
  const t = today();
  const list = [...workouts].sort((a, b) => String(a.date).localeCompare(String(b.date)));
  const dates = [...new Set(list.map((w) => w.date).filter(Boolean))];
  const last7 = dates.filter((d) => daysAgo(d, t) <= 6).length;
  const last30 = dates.filter((d) => daysAgo(d, t) <= 29).length;
  let streak = 0;
  const set = new Set(dates);
  let cursor = t;
  if (!set.has(t)) cursor = yesterday(t);
  while (set.has(cursor) && streak < 400) {
    streak += 1;
    cursor = yesterday(cursor);
  }
  const weekMinutes = list
    .filter((w) => daysAgo(w.date, t) <= 6)
    .reduce((sum, w) => sum + (Number(w.durationMin) || 0), 0);
  const prs: { name: string; weight: number; reps: number | ""; date: string }[] = [];
  const best = new Map<string, { name: string; weight: number; reps: number | ""; date: string }>();
  for (const w of list) {
    for (const lift of w.exercises || []) {
      const key = lift.name.toLowerCase();
      for (const s of lift.sets || []) {
        const weight = Number(s.weight);
        if (!Number.isFinite(weight) || weight <= 0) continue;
        const prev = best.get(key);
        if (!prev || weight > prev.weight) {
          best.set(key, { name: lift.name, weight, reps: s.reps, date: w.date });
        }
      }
    }
  }
  prs.push(...[...best.values()].sort((a, b) => b.weight - a.weight).slice(0, 12));
  return { sessions: list.length, last7, last30, streak, weekMinutes, prs };
}

function placeLabel(p: { name: string; location?: string }) {
  return p.location ? `${p.name} — ${p.location}` : p.name;
}

/**
 * Gym lanai — same feature set as My Retirement Reboot Gym
 * (Fit Clubs, Planet Fitness, sets & reps, supplements).
 */
export function MySpaceGymBoard() {
  const empty = emptyBoards().gym;
  const { value, save, ready, saving, error } = useMemberBoard<GymBoard>("gym", empty, true);
  const [tab, setTab] = useState<GymTab>("today");
  const [date, setDate] = useState(today());
  const [time, setTime] = useState("");
  const [minutes, setMinutes] = useState("45");
  const [felt, setFelt] = useState("");
  const [notes, setNotes] = useState("");
  const [gymId, setGymId] = useState("");
  const [lifts, setLifts] = useState<GymLift[]>([emptyLift()]);
  const [editWorkoutId, setEditWorkoutId] = useState<string | null>(null);
  const [openDetails, setOpenDetails] = useState<string | null>(null);
  const [placeName, setPlaceName] = useState("");
  const [placeLoc, setPlaceLoc] = useState("");
  const [placeKind, setPlaceKind] = useState("chain");
  const [placeChain, setPlaceChain] = useState("");
  const [placeAddr, setPlaceAddr] = useState("");
  const [placePhone, setPlacePhone] = useState("");
  const [placeHours, setPlaceHours] = useState("");
  const [placeMem, setPlaceMem] = useState("");
  const [placeNotes, setPlaceNotes] = useState("");
  const [editPlaceId, setEditPlaceId] = useState<string | null>(null);
  const [supName, setSupName] = useState("");
  const [supDose, setSupDose] = useState("");
  const [supWhen, setSupWhen] = useState("");
  const [supDays, setSupDays] = useState("Daily");
  const [supNotes, setSupNotes] = useState("");

  const gyms = value.gyms || [];
  const workouts = value.workouts || [];
  const supplements = value.supplements || [];
  const supplementLogs = value.supplementLogs || [];
  const stats = useMemo(() => computeStats(workouts), [workouts]);

  const allPlaces = useMemo(() => {
    const savedIds = new Set(gyms.map((g) => g.id));
    const clubs = FIT_CLUBS.filter((c) => !savedIds.has(c.id)).map((c) => ({
      id: c.id,
      name: c.name,
      location: "",
    }));
    return [...clubs, ...gyms.map((g) => ({ id: g.id, name: g.name, location: g.location }))];
  }, [gyms]);

  const home = FIT_CLUBS.find((c) => c.id === value.homeGymId) || gyms.find((g) => g.id === value.homeGymId);
  const todayWos = workouts.filter((w) => w.date === today());

  function persist(next: GymBoard) {
    void save(next);
  }

  function placeNameById(id: string, fallback = ""): string {
    const p = allPlaces.find((x) => x.id === id);
    if (p) return placeLabel(p);
    return fallback || "Gym";
  }

  function patchLift(i: number, patch: Partial<GymLift>) {
    setLifts((prev) => prev.map((l, idx) => (idx === i ? { ...l, ...patch } : l)));
  }

  function patchSet(liftI: number, setI: number, patch: Partial<GymSet>) {
    setLifts((prev) =>
      prev.map((l, idx) =>
        idx === liftI
          ? { ...l, sets: l.sets.map((s, j) => (j === setI ? { ...s, ...patch } : s)) }
          : l
      )
    );
  }

  function loadWorkout(w: GymWorkout) {
    setEditWorkoutId(w.id);
    setDate(w.date || today());
    setTime(w.time || "");
    setMinutes(w.durationMin === "" || w.durationMin == null ? "" : String(w.durationMin));
    setFelt(w.felt || "");
    setNotes(w.notes || "");
    setGymId(w.gymId || "");
    setLifts(
      w.exercises?.length
        ? w.exercises.map((l) => ({
            name: l.name,
            kind: l.kind || "machine",
            equipment: l.equipment || "",
            sets: l.sets?.length ? l.sets : [emptySet()],
          }))
        : [emptyLift()]
    );
    setTab("today");
  }

  function resetForm() {
    setEditWorkoutId(null);
    setDate(today());
    setTime("");
    setMinutes("45");
    setFelt("");
    setNotes("");
    setGymId(value.homeGymId || "");
    setLifts([emptyLift()]);
  }

  function saveWorkout() {
    const cleaned: GymLift[] = lifts
      .map((l) => ({
        ...l,
        name: l.name.trim().slice(0, 80),
        equipment: (l.equipment || "").trim().slice(0, 80),
        sets: l.sets.filter((s) => s.weight !== "" || s.reps !== "" || s.seconds !== "").slice(0, 20),
      }))
      .filter((l) => l.name && l.sets.length);
    if (!cleaned.length && !notes.trim()) return;
    const selected = allPlaces.find((p) => p.id === (gymId || value.homeGymId));
    const wo: GymWorkout = {
      id: editWorkoutId || uid("wo"),
      date: date || today(),
      time,
      gymId: gymId || value.homeGymId || "",
      gymName: selected ? placeLabel(selected) : "",
      durationMin: (Number(minutes) || "") as number | "",
      felt,
      notes: notes.trim().slice(0, 400),
      exercises: cleaned,
    };
    const next = editWorkoutId
      ? workouts.map((w) => (w.id === editWorkoutId ? wo : w))
      : [wo, ...workouts];
    persist({ ...value, workouts: next.slice(0, 80) });
    resetForm();
  }

  function loadPlace(g: GymPlace) {
    setEditPlaceId(g.id);
    setPlaceName(g.name);
    setPlaceLoc(g.location || "");
    setPlaceKind(g.kind || "chain");
    setPlaceChain(g.chain || "");
    setPlaceAddr(g.address || "");
    setPlacePhone(g.phone || "");
    setPlaceHours(g.hours || "");
    setPlaceMem(g.membership || "");
    setPlaceNotes(g.notes || "");
  }

  function resetPlace() {
    setEditPlaceId(null);
    setPlaceName("");
    setPlaceLoc("");
    setPlaceKind("chain");
    setPlaceChain("");
    setPlaceAddr("");
    setPlacePhone("");
    setPlaceHours("");
    setPlaceMem("");
    setPlaceNotes("");
  }

  function savePlace() {
    const name = placeName.trim();
    if (!name) return;
    const row: GymPlace = {
      id: editPlaceId || uid("gy"),
      name: name.slice(0, 80),
      kind: placeKind,
      chain: placeChain.trim().slice(0, 40),
      location: placeLoc.trim().slice(0, 80),
      address: placeAddr.trim().slice(0, 120),
      phone: placePhone.trim().slice(0, 40),
      hours: placeHours.trim().slice(0, 120),
      membership: placeMem.trim().slice(0, 80),
      notes: placeNotes.trim().slice(0, 400),
    };
    const next = editPlaceId ? gyms.map((g) => (g.id === editPlaceId ? row : g)) : [row, ...gyms];
    persist({
      ...value,
      gyms: next.slice(0, 40),
      homeGymId: value.homeGymId || row.id,
    });
    resetPlace();
  }

  if (!ready) return <p className="panel-hint">Loading gym…</p>;

  return (
    <div className="ms-health-board">
      <p className="ms-module-lead">
        Fit Clubs, Planet Fitness, home gym — sets, reps, and supplements. Not coaching; confirm Fit
        Club hours at the rec desk.
      </p>
      {error ? <p className="pf-form-error">{error}</p> : null}
      {saving ? <p className="panel-hint">Saving to your account…</p> : null}

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
        <span className="ms-h-pill">{stats.last7} days this week</span>
        <span className="panel-hint">Fit Clubs · Planet Fitness · sets &amp; reps</span>
      </div>
      <p className="panel-hint">
        Strength notebook only — not coaching, not a medical plan. Fit Club hours and fees change;
        confirm at the rec desk.
      </p>

      {tab === "today" && (
        <div className="about-panel ms-module">
          <div className="ms-stat-row">
            <div className="ms-stat">
              <strong>{stats.last7}</strong>
              <span>days this week</span>
            </div>
            <div className="ms-stat">
              <strong>{stats.streak}</strong>
              <span>day streak</span>
            </div>
            <div className="ms-stat">
              <strong>{stats.weekMinutes}</strong>
              <span>min this week</span>
            </div>
            <div className="ms-stat">
              <strong>{stats.last30}</strong>
              <span>days / 30</span>
            </div>
          </div>
          <p className="panel-hint">
            {home ? (
              <>
                Home gym: <strong>{home.name}</strong>.{" "}
              </>
            ) : (
              "Pick a home gym under Fit Clubs & gyms — Planet Fitness or a Villages Fit Club. "
            )}
            Fit Clubs are small rec-center rooms; Planet Fitness and other clubs are the full-size
            option.
          </p>

          <h3>{editWorkoutId ? "Edit workout" : "Log a gym session"}</h3>
          <form
            className="form-grid ms-module-form"
            onSubmit={(e) => {
              e.preventDefault();
              saveWorkout();
            }}
          >
            <div className="field">
              <label>Gym</label>
              <select
                value={gymId || value.homeGymId || ""}
                onChange={(e) => setGymId(e.target.value)}
              >
                <option value="">Choose gym</option>
                {FIT_CLUBS.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
                {gyms.map((g) => (
                  <option key={g.id} value={g.id}>
                    {placeLabel(g)}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>
            <div className="field">
              <label>Time</label>
              <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
            </div>
            <div className="field">
              <label>Minutes</label>
              <input
                type="number"
                min={1}
                max={300}
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)}
                placeholder="45"
              />
            </div>
            <div className="field">
              <label>How it felt</label>
              <select value={felt} onChange={(e) => setFelt(e.target.value)}>
                {FELT_OPTS.map((o) => (
                  <option key={o.id || "none"} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </form>

          {lifts.map((lift, i) => {
            const listed = EXERCISE_NAMES.includes(lift.name);
            return (
            <article key={i} className="ms-gym-lift">
              <div className="form-grid ms-module-form">
                <div className="field">
                  <label>Exercise</label>
                  <select
                    value={listed ? lift.name : "__custom__"}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (v === "__custom__") {
                        patchLift(i, { name: "" });
                        return;
                      }
                      patchLift(i, { name: v, kind: EXERCISE_KIND[v] || lift.kind });
                    }}
                  >
                    {EXERCISE_NAMES.map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                    <option value="__custom__">Custom…</option>
                  </select>
                  {!listed ? (
                    <input
                      value={lift.name}
                      onChange={(e) => patchLift(i, { name: e.target.value })}
                      placeholder="Type a custom exercise"
                      style={{ marginTop: "0.4rem" }}
                    />
                  ) : null}
                </div>
                <div className="field">
                  <label>Type</label>
                  <select
                    value={lift.kind}
                    onChange={(e) => patchLift(i, { kind: e.target.value })}
                  >
                    {Object.entries(KIND_LABEL).map(([k, lab]) => (
                      <option key={k} value={k}>
                        {lab}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label>Machine / bar</label>
                  <input
                    value={lift.equipment}
                    onChange={(e) => patchLift(i, { equipment: e.target.value })}
                    placeholder="optional"
                  />
                </div>
              </div>
              <p className="panel-hint">Each row is one set: weight × reps. Cardio can use seconds instead.</p>
              {lift.sets.map((s, j) => (
                <div key={j} className="ms-gym-set">
                  <input
                    type="number"
                    min={0}
                    step={0.5}
                    placeholder="lb"
                    value={s.weight}
                    onChange={(e) =>
                      patchSet(i, j, { weight: e.target.value === "" ? "" : Number(e.target.value) })
                    }
                  />
                  <input
                    type="number"
                    min={0}
                    placeholder="reps"
                    value={s.reps}
                    onChange={(e) =>
                      patchSet(i, j, { reps: e.target.value === "" ? "" : Number(e.target.value) })
                    }
                  />
                  <input
                    type="number"
                    min={0}
                    placeholder="sec"
                    value={s.seconds}
                    onChange={(e) =>
                      patchSet(i, j, {
                        seconds: e.target.value === "" ? "" : Number(e.target.value),
                      })
                    }
                  />
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    aria-label="Remove set"
                    onClick={() =>
                      patchLift(i, {
                        sets: lift.sets.length > 1 ? lift.sets.filter((_, x) => x !== j) : [emptySet()],
                      })
                    }
                  >
                    ×
                  </button>
                </div>
              ))}
              <div className="hero-actions">
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => patchLift(i, { sets: [...lift.sets, emptySet()].slice(0, 20) })}
                >
                  Add set
                </button>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() =>
                    setLifts((prev) =>
                      prev.length > 1 ? prev.filter((_, x) => x !== i) : [emptyLift()]
                    )
                  }
                >
                  Remove exercise
                </button>
              </div>
            </article>
            );
          })}

          <div className="hero-actions" style={{ margin: "0.75rem 0" }}>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => setLifts((prev) => [...prev, emptyLift()].slice(0, 40))}
            >
              Add exercise
            </button>
          </div>
          <div className="field">
            <label>Notes</label>
            <input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Busy at 9am · skipped leg press"
            />
          </div>
          <div className="hero-actions" style={{ marginTop: "0.75rem" }}>
            <button type="button" className="btn btn-primary btn-sm" onClick={saveWorkout}>
              {editWorkoutId ? "Save changes" : "Save workout"}
            </button>
            {editWorkoutId ? (
              <button type="button" className="btn btn-ghost btn-sm" onClick={resetForm}>
                Cancel
              </button>
            ) : null}
          </div>

          <h3>Today</h3>
          {todayWos.length === 0 ? (
            <p className="panel-hint">
              No gym session logged today. Health → Exercise is still there for walks and swimming.
            </p>
          ) : (
            todayWos.map((w) => (
              <SessionRow
                key={w.id}
                w={w}
                title={placeNameById(w.gymId, w.gymName)}
                sub={`${w.durationMin ? `${w.durationMin} min · ` : ""}${gymVolume(w).sets} sets · ${gymVolume(w).reps} reps`}
                open={openDetails === w.id}
                onDetails={() => setOpenDetails(openDetails === w.id ? null : w.id)}
                onEdit={() => loadWorkout(w)}
                onDelete={() =>
                  persist({ ...value, workouts: workouts.filter((x) => x.id !== w.id) })
                }
              />
            ))
          )}
        </div>
      )}

      {tab === "gyms" && (
        <div className="about-panel ms-module">
          <p className="panel-hint">
            Villages <strong>Fit Clubs</strong> sit inside regional rec centers. They are small rooms
            (cardio + a short circuit + free weights). Hours and fees come from the Community
            Development Districts Fit Club page and can change — confirm at the desk. Bring a
            resident or guest ID.
          </p>
          <p className="panel-hint">
            {FIT_FEES}{" "}
            <a href={FIT_OFFICIAL} className="text-link" target="_blank" rel="noopener noreferrer">
              Official Fit Club page
            </a>
            {" · "}
            <a href={FIT_RULES} className="text-link" target="_blank" rel="noopener noreferrer">
              Rules
            </a>
          </p>
          <h3>The Villages Fit Clubs</h3>
          <div className="ms-gym-place-grid">
            {FIT_CLUBS.map((c) => (
              <article key={c.id} className="ms-gym-place">
                <h4>{c.name}</h4>
                <p className="panel-hint">
                  {c.rec} · {c.address}
                </p>
                <p>{c.hours}</p>
                <p>
                  <a className="text-link" href={`tel:${c.phone}`}>
                    {c.phone}
                  </a>
                </p>
                {"note" in c && c.note ? <p className="panel-hint">{c.note}</p> : null}
                {value.homeGymId === c.id ? (
                  <span className="ms-h-pill">Home gym</span>
                ) : (
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => persist({ ...value, homeGymId: c.id })}
                  >
                    Set as home
                  </button>
                )}
              </article>
            ))}
          </div>

          <h3>{editPlaceId ? "Edit gym" : "My gyms (Planet Fitness and others)"}</h3>
          <p className="panel-hint">
            {editPlaceId
              ? "Fix the name, city, or hours, then save."
              : "Add Planet Fitness or any club outside The Villages. Tap a chain to pre-fill the name, then add the city. You can edit it later."}
          </p>
          <div className="ms-h-quick">
            {CHAIN_PRESETS.map((c) => (
              <button
                key={c.chain}
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => {
                  setPlaceName(c.name);
                  setPlaceChain(c.chain === "Home" ? "" : c.chain);
                  setPlaceKind(c.chain === "Home" ? "home" : "chain");
                }}
              >
                {c.name}
              </button>
            ))}
          </div>
          <form
            className="form-grid ms-module-form"
            onSubmit={(e) => {
              e.preventDefault();
              savePlace();
            }}
          >
            <div className="field">
              <label>Name</label>
              <input
                value={placeName}
                onChange={(e) => setPlaceName(e.target.value)}
                placeholder="Planet Fitness"
                required
              />
            </div>
            <div className="field">
              <label>Location / city</label>
              <input
                value={placeLoc}
                onChange={(e) => setPlaceLoc(e.target.value)}
                placeholder="Leesburg"
              />
            </div>
            <div className="field">
              <label>Type</label>
              <select value={placeKind} onChange={(e) => setPlaceKind(e.target.value)}>
                <option value="chain">Chain</option>
                <option value="independent">Independent</option>
                <option value="home">Home gym</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="field">
              <label>Chain (if any)</label>
              <input
                value={placeChain}
                onChange={(e) => setPlaceChain(e.target.value)}
                placeholder="Planet Fitness"
              />
            </div>
            <div className="field">
              <label>Address</label>
              <input value={placeAddr} onChange={(e) => setPlaceAddr(e.target.value)} />
            </div>
            <div className="field">
              <label>Phone</label>
              <input value={placePhone} onChange={(e) => setPlacePhone(e.target.value)} />
            </div>
            <div className="field">
              <label>Hours</label>
              <input
                value={placeHours}
                onChange={(e) => setPlaceHours(e.target.value)}
                placeholder="5am–11pm"
              />
            </div>
            <div className="field">
              <label>Membership #</label>
              <input value={placeMem} onChange={(e) => setPlaceMem(e.target.value)} />
            </div>
            <div className="field">
              <label>Notes</label>
              <input
                value={placeNotes}
                onChange={(e) => setPlaceNotes(e.target.value)}
                placeholder="Black card · towel in the car"
              />
            </div>
            <button type="submit" className="btn btn-primary btn-sm">
              {editPlaceId ? "Save changes" : "Add gym"}
            </button>
            {editPlaceId ? (
              <button type="button" className="btn btn-ghost btn-sm" onClick={resetPlace}>
                Cancel
              </button>
            ) : null}
          </form>

          <h3>Saved clubs</h3>
          {gyms.length === 0 ? (
            <p className="panel-hint">None yet. Add Planet Fitness so it shows in the workout log.</p>
          ) : (
            gyms.map((g) => (
              <article key={g.id} className="ms-gym-place">
                <h4>{placeLabel(g)}</h4>
                <p className="panel-hint">
                  {g.chain || g.kind}
                  {g.address ? ` · ${g.address}` : ""}
                </p>
                {g.hours ? <p>{g.hours}</p> : null}
                {g.membership ? <p className="panel-hint">Membership: {g.membership}</p> : null}
                <div className="hero-actions">
                  {value.homeGymId === g.id ? (
                    <span className="ms-h-pill">Home gym</span>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => persist({ ...value, homeGymId: g.id })}
                    >
                      Set as home
                    </button>
                  )}
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => loadPlace(g)}>
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() =>
                      persist({
                        ...value,
                        gyms: gyms.filter((x) => x.id !== g.id),
                        homeGymId: value.homeGymId === g.id ? "" : value.homeGymId,
                      })
                    }
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      )}

      {tab === "history" && (
        <div className="about-panel ms-module">
          <p className="panel-hint">
            {stats.sessions} session{stats.sessions === 1 ? "" : "s"} saved on this account. Edit or
            delete any row. Health → Exercise is still for walks and swimming.
          </p>
          <h3>Best lifts</h3>
          {stats.prs.length === 0 ? (
            <p className="panel-hint">Personal records appear after you log weighted sets.</p>
          ) : (
            <div className="ms-gym-pr-grid">
              {stats.prs.map((p) => (
                <div key={p.name} className="ms-gym-pr">
                  <strong>{p.name}</strong>
                  <span>
                    {p.weight} lb × {p.reps || "?"} · {p.date}
                  </span>
                </div>
              ))}
            </div>
          )}
          {workouts.length === 0 ? (
            <p className="panel-hint">No workouts yet.</p>
          ) : (
            [...workouts]
              .sort((a, b) => `${b.date}T${b.time || "00:00"}`.localeCompare(`${a.date}T${a.time || "00:00"}`))
              .map((w) => (
                <SessionRow
                  key={w.id}
                  w={w}
                  title={`${w.date}${w.time ? ` · ${w.time}` : ""}`}
                  sub={`${placeNameById(w.gymId, w.gymName)}${w.durationMin ? ` · ${w.durationMin} min` : ""} · ${gymVolume(w).sets} sets`}
                  open={openDetails === w.id}
                  onDetails={() => setOpenDetails(openDetails === w.id ? null : w.id)}
                  onEdit={() => loadWorkout(w)}
                  onDelete={() =>
                    persist({ ...value, workouts: workouts.filter((x) => x.id !== w.id) })
                  }
                />
              ))
          )}
        </div>
      )}

      {tab === "supps" && (
        <div className="about-panel ms-module">
          <p className="panel-hint">
            Household reminder list only — not medical advice. Ask your own doctor or pharmacist
            before starting creatine or anything else.
          </p>
          <h3>Add a supplement</h3>
          <form
            className="form-grid ms-module-form"
            onSubmit={(e) => {
              e.preventDefault();
              if (!supName.trim()) return;
              persist({
                ...value,
                supplements: [
                  {
                    id: uid("sup"),
                    name: supName.trim().slice(0, 60),
                    dose: supDose.trim().slice(0, 40),
                    when: supWhen.trim().slice(0, 40),
                    days: supDays.trim().slice(0, 40),
                    notes: supNotes.trim().slice(0, 200),
                  },
                  ...supplements,
                ].slice(0, 40),
              });
              setSupName("");
              setSupDose("");
              setSupWhen("");
              setSupDays("Daily");
              setSupNotes("");
            }}
          >
            <div className="field">
              <label>Name</label>
              <input
                list="ms-gym-sup-presets"
                value={supName}
                onChange={(e) => setSupName(e.target.value)}
                placeholder="Creatine"
                required
              />
              <datalist id="ms-gym-sup-presets">
                {SUPPLEMENT_PRESETS.map((n) => (
                  <option key={n} value={n} />
                ))}
              </datalist>
            </div>
            <div className="field">
              <label>Dose</label>
              <input
                value={supDose}
                onChange={(e) => setSupDose(e.target.value)}
                placeholder="5 g"
              />
            </div>
            <div className="field">
              <label>When</label>
              <input
                value={supWhen}
                onChange={(e) => setSupWhen(e.target.value)}
                placeholder="After lifting"
              />
            </div>
            <div className="field">
              <label>Days</label>
              <input
                value={supDays}
                onChange={(e) => setSupDays(e.target.value)}
                placeholder="Daily"
              />
            </div>
            <div className="field">
              <label>Notes</label>
              <input value={supNotes} onChange={(e) => setSupNotes(e.target.value)} />
            </div>
            <button type="submit" className="btn btn-primary btn-sm">
              Save supplement
            </button>
          </form>

          <h3>My list</h3>
          {supplements.length === 0 ? (
            <p className="panel-hint">Add creatine or protein if you use them.</p>
          ) : (
            <ul className="ms-cal-list">
              {supplements.map((s) => (
                <li key={s.id}>
                  <div>
                    <strong>{s.name}</strong>
                    <span>{[s.dose, s.when, s.days].filter(Boolean).join(" · ")}</span>
                    {s.notes ? <span>{s.notes}</span> : null}
                  </div>
                  <div className="hero-actions">
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() =>
                        persist({
                          ...value,
                          supplementLogs: [
                            {
                              id: uid("sl"),
                              supplementId: s.id,
                              name: s.name,
                              date: today(),
                            },
                            ...supplementLogs,
                          ].slice(0, 120),
                        })
                      }
                    >
                      Took today
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() =>
                        persist({
                          ...value,
                          supplements: supplements.filter((x) => x.id !== s.id),
                        })
                      }
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <h3>Taken log</h3>
          {supplementLogs.length === 0 ? (
            <p className="panel-hint">Tap “Took today” on a supplement.</p>
          ) : (
            <ul className="ms-cal-list">
              {supplementLogs.slice(0, 40).map((l) => (
                <li key={l.id}>
                  <div>
                    <strong>{l.date}</strong>
                    <span>{l.name} · taken</span>
                  </div>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() =>
                      persist({
                        ...value,
                        supplementLogs: supplementLogs.filter((x) => x.id !== l.id),
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
    </div>
  );
}

function SessionRow({
  w,
  title,
  sub,
  open,
  onDetails,
  onEdit,
  onDelete,
}: {
  w: GymWorkout;
  title: string;
  sub: string;
  open: boolean;
  onDetails: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <article className="ms-gym-session">
      <div className="ms-gym-session-main">
        <div>
          <strong>{title}</strong>
          <p className="panel-hint">{sub}</p>
        </div>
        <div className="hero-actions">
          <button type="button" className="btn btn-ghost btn-sm" onClick={onDetails}>
            Details
          </button>
          <button type="button" className="btn btn-ghost btn-sm" onClick={onEdit}>
            Edit
          </button>
          <button type="button" className="btn btn-ghost btn-sm" onClick={onDelete}>
            Delete
          </button>
        </div>
      </div>
      {open ? (
        <div>
          <p>
            {(w.exercises || [])
              .map((l) => l.name)
              .filter(Boolean)
              .join(" · ") || "No lifts"}
          </p>
          {w.notes ? <p className="panel-hint">{w.notes}</p> : null}
          <ul className="panel-hint">
            {(w.exercises || []).map((l, i) => (
              <li key={`${l.name}-${i}`}>
                {l.name}
                {l.equipment ? ` (${l.equipment})` : ""} ·{" "}
                {l.sets
                  .map((s) => {
                    if (s.seconds) return `${s.seconds}s`;
                    return `${s.weight || 0} lb × ${s.reps || "?"}`;
                  })
                  .join(", ")}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </article>
  );
}
