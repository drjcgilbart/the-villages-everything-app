"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { finishPlannerReturn } from "@/lib/plannerReturn";
import {
  emptyBoards,
  type GymBoard,
  type GymLift,
  type GymMediaItem,
  type GymPlace,
  type GymRoutine,
  type GymSet,
  type GymWorkout,
} from "@/lib/memberBoardModel";
import {
  cloneLifts,
  emptyGymSet,
  EXERCISE_KIND,
  EXERCISE_NAMES,
  KIND_LABEL,
  lastUsedFor,
  nearbyReps,
  nearbySeconds,
  nearbyWeights,
  ROUTINE_PRESETS,
  seedLiftsFromHistory,
  sessionProgress,
  dumbbellPlanRoutines,
  starterLifts,
  workoutHasNumbers,
} from "@/lib/gymCatalog";
import { useMemberBoard } from "@/components/useMemberBoard";
import { GymExerciseHowTo } from "@/components/GymExerciseHowTo";
import {
  forgetPhoneMedia,
  GymWorkoutMediaPicker,
  GymWorkoutMediaStrip,
  phoneLocalIds,
} from "@/components/GymWorkoutMedia";

type GymTab = "today" | "routines" | "gyms" | "history" | "supps";

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
const NEW_GYM = "__new__";

const TABS: { id: GymTab; label: string; icon: string }[] = [
  { id: "today", label: "At the gym", icon: "🏋️" },
  { id: "routines", label: "My routines", icon: "📋" },
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
  return emptyGymSet();
}

function emptyLift(): GymLift {
  return { name: "Leg press", kind: "machine", equipment: "", sets: [emptySet()] };
}

function trailNumber(lift: GymLift, setIndex: number, field: "weight" | "reps" | "seconds") {
  for (let k = setIndex; k >= 0; k--) {
    const n = Number(lift.sets[k]?.[field]);
    if (n > 0) return n;
  }
  return 0;
}

function NearbyPick({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: number | "";
  options: number[];
  onChange: (n: number | "") => void;
}) {
  const [typed, setTyped] = useState(false);
  const str = value === "" ? "" : String(value);
  const inList = value !== "" && options.some((n) => n === Number(value));
  if (typed) {
    return (
      <label className="ms-gym-mini">
        {label}
        <input
          type="number"
          inputMode="decimal"
          min={0}
          step="any"
          value={str}
          autoFocus
          placeholder="e.g. 72.5"
          onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))}
          onBlur={() => setTyped(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              setTyped(false);
            }
          }}
        />
      </label>
    );
  }
  return (
    <label className="ms-gym-mini">
      {label}
      <select
        value={str}
        onChange={(e) => {
          if (e.target.value === "__custom__") {
            setTyped(true);
            return;
          }
          onChange(e.target.value === "" ? "" : Number(e.target.value));
        }}
      >
        <option value="">—</option>
        {value !== "" && !inList ? <option value={str}>{str}</option> : null}
        {options.map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
        <option value="__custom__">Type my own…</option>
      </select>
    </label>
  );
}

function mediaHint(workout: GymWorkout) {
  const items = workout.media || [];
  if (!items.length) return "";
  if (items.some((item) => item.kind === "video")) return " · video";
  return ` · ${items.length} photo${items.length === 1 ? "" : "s"}`;
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
  const [media, setMedia] = useState<GymMediaItem[]>([]);
  const [savedPhoneIds, setSavedPhoneIds] = useState<string[]>([]);
  const [editWorkoutId, setEditWorkoutId] = useState<string | null>(null);
  const [routineName, setRoutineName] = useState("");
  const [customRoutine, setCustomRoutine] = useState("");
  const [sessionOn, setSessionOn] = useState(false);
  const [editRoutineId, setEditRoutineId] = useState<string | null>(null);
  const [addingGym, setAddingGym] = useState(false);
  const [gymBeforeNew, setGymBeforeNew] = useState("");
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
  const openedFromPlanner = useRef(false);
  const seededDumbbell = useRef(false);

  useEffect(() => {
    if (!ready || openedFromPlanner.current) return;
    const raw = sessionStorage.getItem("tvea-planner-edit");
    if (!raw) return;
    let parsed: { board?: string; id?: string } | null = null;
    try {
      parsed = JSON.parse(raw) as { board?: string; id?: string };
    } catch {
      return;
    }
    if (parsed?.board !== "gym" || !parsed.id) return;
    const workout = workouts.find((row) => row.id === parsed?.id);
    if (!workout) return;
    openedFromPlanner.current = true;
    sessionStorage.removeItem("tvea-planner-edit");
    loadWorkout(workout);
    // loadWorkout is stable enough for the one handoff from the planner.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, workouts]);

  useEffect(() => {
    if (!ready || seededDumbbell.current) return;
    const have = new Set((value.routines || []).map((r) => r.name.toLowerCase()));
    const add = dumbbellPlanRoutines().filter((r) => !have.has(r.name.toLowerCase()));
    seededDumbbell.current = true;
    if (!add.length) return;
    persist({
      ...value,
      routines: [...add, ...(value.routines || [])].slice(0, 24),
    });
    // Seed once when the gym board finishes loading.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  const routines = value.routines || [];
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
    setLifts((prev) => {
      const next = prev.map((l, idx) =>
        idx === liftI
          ? { ...l, sets: l.sets.map((s, j) => (j === setI ? { ...s, ...patch } : s)) }
          : l
      );
      if (sessionOn) writeWorkout(next, true);
      return next;
    });
  }

  function loadWorkout(w: GymWorkout) {
    setEditWorkoutId(w.id);
    setSessionOn(true);
    setRoutineName(w.routineName || "");
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
            sets: l.sets?.length ? l.sets.map((s) => ({ ...emptySet(), ...s })) : [emptySet()],
          }))
        : [emptyLift()]
    );
    const existing = w.media || [];
    setMedia(existing);
    setSavedPhoneIds(phoneLocalIds(existing));
    setTab("today");
    jumpTo("ms-gym-live");
  }

  function resetForm() {
    const unsaved = media.filter(
      (item) => item.storage === "phone" && item.localId && !savedPhoneIds.includes(item.localId)
    );
    if (unsaved.length) void forgetPhoneMedia(unsaved);
    setEditWorkoutId(null);
    setSessionOn(false);
    setRoutineName("");
    setCustomRoutine("");
    setDate(today());
    setTime("");
    setMinutes("45");
    setFelt("");
    setNotes("");
    setGymId(value.homeGymId || "");
    setLifts([emptyLift()]);
    setMedia([]);
    setSavedPhoneIds([]);
  }

  function writeWorkout(nextLifts: GymLift[], keepOpen: boolean) {
    const cleaned: GymLift[] = nextLifts
      .map((l) => ({
        ...l,
        name: l.name.trim().slice(0, 80),
        equipment: (l.equipment || "").trim().slice(0, 80),
        sets: l.sets.slice(0, 20),
      }))
      .filter((l) => l.name);
    if (!cleaned.length && !notes.trim() && !media.length) return;
    const selected = allPlaces.find((p) => p.id === (gymId || value.homeGymId));
    const wo: GymWorkout = {
      id: editWorkoutId || uid("wo"),
      date: date || today(),
      time,
      gymId: gymId || value.homeGymId || "",
      gymName: selected ? placeLabel(selected) : "",
      routineName: routineName.trim().slice(0, 80) || undefined,
      durationMin: (Number(minutes) || "") as number | "",
      felt,
      notes: notes.trim().slice(0, 400),
      exercises: cleaned,
      media: media.some((item) => item.kind === "video")
        ? media.filter((item) => item.kind === "video").slice(0, 1)
        : media.filter((item) => item.kind === "photo").slice(0, 3),
    };
    const previous = editWorkoutId
      ? workouts.find((w) => w.id === editWorkoutId)?.media || []
      : [];
    const kept = new Set(phoneLocalIds(wo.media));
    const dropped = previous.filter(
      (item) => item.storage === "phone" && item.localId && !kept.has(item.localId)
    );
    if (dropped.length) void forgetPhoneMedia(dropped);
    const next = editWorkoutId
      ? workouts.map((w) => (w.id === editWorkoutId ? wo : w))
      : [wo, ...workouts];
    const nextRoutines =
      !keepOpen && wo.routineName && workoutHasNumbers(wo)
        ? upsertRoutine(routines, wo.routineName, cloneLifts(cleaned))
        : routines;
    persist({
      ...value,
      workouts: next.slice(0, 80),
      routines: nextRoutines.slice(0, 24),
    });
    if (keepOpen) {
      setEditWorkoutId(wo.id);
      return;
    }
    resetForm();
    finishPlannerReturn();
  }

  function saveWorkout() {
    writeWorkout(lifts, false);
  }

  function startRoutine(name: string, from?: GymLift[]) {
    const label = name.trim().slice(0, 80);
    if (!label) return;
    const fallback = from?.length ? cloneLifts(from) : starterLifts(label);
    const next = seedLiftsFromHistory(
      workouts,
      label,
      fallback.length ? fallback : [emptyLift()]
    );
    setRoutineName(label);
    setCustomRoutine("");
    setLifts(next);
    setSessionOn(true);
    setDate(today());
    setGymId(gymId || value.homeGymId || "");
    const selected = allPlaces.find((p) => p.id === (gymId || value.homeGymId));
    const wo: GymWorkout = {
      id: uid("wo"),
      date: today(),
      time,
      gymId: gymId || value.homeGymId || "",
      gymName: selected ? placeLabel(selected) : "",
      routineName: label,
      durationMin: (Number(minutes) || "") as number | "",
      felt,
      notes: "",
      exercises: next,
      media: [],
    };
    persist({ ...value, workouts: [wo, ...workouts].slice(0, 80) });
    setEditWorkoutId(wo.id);
    setTab("today");
    jumpTo("ms-gym-live");
  }

  function upsertRoutine(list: GymRoutine[], name: string, exercises: GymLift[]): GymRoutine[] {
    const key = name.trim().toLowerCase();
    const existing = list.find((r) => r.name.toLowerCase() === key);
    const row: GymRoutine = {
      id: existing?.id || uid("rt"),
      name: name.trim().slice(0, 80),
      exercises,
    };
    if (existing) return list.map((r) => (r.id === existing.id ? row : r));
    return [row, ...list];
  }

  function jumpTo(id: string) {
    window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  }

  function openRoutineEditor(routine: GymRoutine) {
    setEditRoutineId(routine.id);
    setRoutineName(routine.name);
    setLifts(cloneLifts(routine.exercises));
    jumpTo("ms-gym-builder");
  }

  function saveRoutineFromLifts(name: string, list: GymLift[]) {
    const label = name.trim().slice(0, 80);
    if (!label) return;
    const exercises = cloneLifts(list.filter((l) => l.name.trim()));
    if (!exercises.length) return;
    const row: GymRoutine = {
      id: editRoutineId || uid("rt"),
      name: label,
      exercises,
    };
    const next = editRoutineId
      ? routines.map((r) => (r.id === editRoutineId ? row : r))
      : [row, ...routines.filter((r) => r.name.toLowerCase() !== label.toLowerCase())];
    persist({ ...value, routines: next.slice(0, 24) });
    setEditRoutineId(null);
    jumpTo("ms-gym-saved");
  }

  function deleteWorkout(id: string) {
    const row = workouts.find((w) => w.id === id);
    if (row?.media?.length) void forgetPhoneMedia(row.media);
    persist({ ...value, workouts: workouts.filter((x) => x.id !== id) });
    if (editWorkoutId === id) {
      setEditWorkoutId(null);
      setMedia([]);
      setSavedPhoneIds([]);
    }
    finishPlannerReturn();
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

  function savePlace(): string | null {
    const name = placeName.trim();
    if (!name) return null;
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
    return row.id;
  }

  function openNewGymForm() {
    setGymBeforeNew(gymId || value.homeGymId || "");
    setAddingGym(true);
    resetPlace();
  }

  function cancelNewGymForm() {
    setAddingGym(false);
    setGymId(gymBeforeNew);
  }

  if (!ready) return <p className="panel-hint">Loading gym…</p>;

  return (
    <div className="ms-health-board">
      <p className="ms-module-lead">
        Built for the Fit Club floor: pick Leg Day or HIIT, tap a box when a set is done, bump
        weight or reps without typing. Not coaching — confirm Fit Club hours at the rec desk.
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
        <div className="about-panel ms-module ms-gym-floor">
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
              <strong>{sessionOn ? `${sessionProgress(lifts).done}/${sessionProgress(lifts).total}` : stats.weekMinutes}</strong>
              <span>{sessionOn ? "sets done" : "min this week"}</span>
            </div>
          </div>

          {!sessionOn ? (
            <>
              <h3>What are you doing today?</h3>
              <p className="panel-hint">
                One tap starts the workout. At the machine, tap the box when the set is done.
                {home ? (
                  <>
                    {" "}
                    Home gym: <strong>{home.name}</strong>.
                  </>
                ) : null}
              </p>
              <div className="ms-gym-routine-chips">
                {routines.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => startRoutine(r.name, r.exercises)}
                  >
                    {r.name}
                  </button>
                ))}
                {ROUTINE_PRESETS.filter(
                  (n) => !routines.some((r) => r.name.toLowerCase() === n.toLowerCase())
                ).map((n) => (
                  <button
                    key={n}
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => startRoutine(n)}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <div className="ms-gym-custom-row">
                <input
                  value={customRoutine}
                  onChange={(e) => setCustomRoutine(e.target.value.slice(0, 80))}
                  placeholder="Name your own — e.g. Recumbent Sunday"
                />
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => startRoutine(customRoutine)}
                >
                  Start
                </button>
              </div>
              {todayWos.length ? (
                <>
                  <h3>Today already</h3>
                  {todayWos.map((w) => (
                    <SessionRow
                      key={w.id}
                      w={w}
                      title={`${w.routineName ? `${w.routineName} · ` : ""}${placeNameById(w.gymId, w.gymName)}`}
                      sub={`${w.durationMin ? `${w.durationMin} min · ` : ""}${gymVolume(w).sets} sets · ${gymVolume(w).reps} reps${mediaHint(w)}`}
                      open={openDetails === w.id}
                      onDetails={() => setOpenDetails(openDetails === w.id ? null : w.id)}
                      onEdit={() => loadWorkout(w)}
                      onDelete={() => deleteWorkout(w.id)}
                    />
                  ))}
                </>
              ) : null}
            </>
          ) : (
            <>
              <div className="ms-gym-live-head" id="ms-gym-live">
                <div>
                  <p className="ms-golf-kicker">{routineName || "Workout"}</p>
                  <h3 style={{ margin: "0.15rem 0 0" }}>Tap a box when the set is done</h3>
                </div>
                <button type="button" className="btn btn-primary btn-sm" onClick={saveWorkout}>
                  Finish
                </button>
              </div>
              <div className="field">
                <label>Gym</label>
                <select
                  value={addingGym ? NEW_GYM : gymId || value.homeGymId || ""}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (v === NEW_GYM) {
                      openNewGymForm();
                      return;
                    }
                    setAddingGym(false);
                    setGymId(v);
                  }}
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
                  <option value={NEW_GYM}>New gym…</option>
                </select>
              </div>
              {addingGym ? (
                <div className="ms-gym-new-place">
                  <p className="panel-hint">
                    Add Planet Fitness, a home gym, or any club. Then you’re back on this
                    workout.
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
                      const id = savePlace();
                      if (!id) return;
                      setGymId(id);
                      setAddingGym(false);
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
                        placeholder="Towel in the cart"
                      />
                    </div>
                    <div className="hero-actions" style={{ gridColumn: "1 / -1" }}>
                      <button type="submit" className="btn btn-primary btn-sm">
                        Save gym and keep going
                      </button>
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        onClick={cancelNewGymForm}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              ) : null}

              {lifts.map((lift, i) => {
                const listed = EXERCISE_NAMES.includes(lift.name);
                const last = lastUsedFor(workouts, lift.name);
                const isCardio = lift.kind === "cardio" || lift.sets.some((row) => row.seconds !== "");
                return (
                  <article key={i} className="ms-gym-lift ms-gym-lift-live">
                    <div className="ms-gym-lift-title">
                      <div>
                        <strong>{lift.name || "Exercise"}</strong>
                        <span>{KIND_LABEL[lift.kind] || lift.kind}</span>
                      </div>
                      <GymExerciseHowTo name={lift.name} />
                    </div>
                    <div className="field">
                      <label className="visually-hidden">Exercise</label>
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
                    {lift.sets.map((s, j) => (
                      <div
                        key={j}
                        className={`ms-gym-set-live${s.done ? " is-done" : ""}`}
                      >
                        <button
                          type="button"
                          className={`ms-gym-check${s.done ? " is-on" : ""}`}
                          aria-pressed={Boolean(s.done)}
                          aria-label={`Set ${j + 1} ${s.done ? "done" : "not done"}`}
                          onClick={() => {
                            const next = lifts.map((l, idx) =>
                              idx === i
                                ? {
                                    ...l,
                                    sets: l.sets.map((row, k) =>
                                      k === j ? { ...row, done: !row.done } : row
                                    ),
                                  }
                                : l
                            );
                            setLifts(next);
                            writeWorkout(next, true);
                          }}
                        >
                          {s.done ? "✓" : j + 1}
                        </button>
                        {isCardio ? (
                          <NearbyPick
                            label="Sec"
                            value={s.seconds}
                            options={nearbySeconds(
                              trailNumber(lift, j, "seconds") || last?.seconds || 30
                            )}
                            onChange={(n) => patchSet(i, j, { seconds: n })}
                          />
                        ) : (
                          <>
                            <NearbyPick
                              label="Lb"
                              value={s.weight}
                              options={nearbyWeights(
                                trailNumber(lift, j, "weight") || last?.weight || 40
                              )}
                              onChange={(n) => patchSet(i, j, { weight: n })}
                            />
                            <NearbyPick
                              label="Reps"
                              value={s.reps}
                              options={nearbyReps(
                                trailNumber(lift, j, "reps") || last?.reps || 10
                              )}
                              onChange={(n) => patchSet(i, j, { reps: n })}
                            />
                          </>
                        )}
                        <div className="ms-gym-nudge">
                          <button
                            type="button"
                            className="ms-gym-bump"
                            aria-label="Lower"
                            onClick={() => {
                              if (isCardio) {
                                const cur = Number(s.seconds) || 30;
                                patchSet(i, j, { seconds: Math.max(5, cur - 5) });
                              } else {
                                const cur = Number(s.weight) || 0;
                                patchSet(i, j, { weight: Math.max(0, cur - 5) });
                              }
                            }}
                          >
                            −
                          </button>
                          <button
                            type="button"
                            className="ms-gym-bump"
                            aria-label="Raise"
                            onClick={() => {
                              if (isCardio) {
                                const cur = Number(s.seconds) || 30;
                                patchSet(i, j, { seconds: cur + 5 });
                              } else {
                                const cur = Number(s.weight) || 0;
                                patchSet(i, j, { weight: cur + 5 });
                              }
                            }}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                    <div className="hero-actions">
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        onClick={() => {
                          const last = lift.sets[lift.sets.length - 1] || emptySet();
                          patchLift(i, {
                            sets: [...lift.sets, { ...last, done: false }].slice(0, 20),
                          });
                        }}
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
                        Remove
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
                {routineName ? (
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => saveRoutineFromLifts(routineName, lifts)}
                  >
                    Save as routine
                  </button>
                ) : null}
              </div>
              <details>
                <summary>Notes, time, photos</summary>
                <div className="form-grid ms-module-form" style={{ marginTop: "0.6rem" }}>
                  <div className="field">
                    <label>Minutes</label>
                    <input
                      type="number"
                      min={1}
                      max={300}
                      value={minutes}
                      onChange={(e) => setMinutes(e.target.value)}
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
                </div>
                <div className="field">
                  <label>Notes</label>
                  <input
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Skipped leg press · recumbent after"
                  />
                </div>
                <GymWorkoutMediaPicker
                  items={media}
                  onChange={setMedia}
                  protectedLocalIds={savedPhoneIds}
                  disabled={saving}
                />
              </details>
              <div className="hero-actions" style={{ marginTop: "0.75rem" }}>
                <button type="button" className="btn btn-primary" onClick={saveWorkout}>
                  Finish workout
                </button>
                <button type="button" className="btn btn-ghost btn-sm" onClick={resetForm}>
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {tab === "routines" && (
        <div className={`about-panel ms-module${editRoutineId ? " is-editing-routine" : ""}`}>
          <h3 id="ms-gym-saved">Your saved routines</h3>
          <p className="panel-hint">
            Dumbbell Upper Body, Dumbbell Lower Body, and Dumbbell Core are here with the
            routines you already saved. Start loads one at the gym. Edit opens it in the builder
            below.
          </p>
          {routines.length === 0 ? (
            <p className="panel-hint">None yet — tap a preset below, tweak it, save.</p>
          ) : (
            [...routines]
              .sort((a, b) => {
                const rank = (name: string) => (name.toLowerCase().startsWith("dumbbell") ? 0 : 1);
                return rank(a.name) - rank(b.name) || a.name.localeCompare(b.name);
              })
              .map((r) => (
              <article key={r.id} className="ms-gym-session">
                <div className="ms-gym-session-main">
                  <div>
                    <strong>{r.name}</strong>
                    <p className="panel-hint">
                      {r.exercises.length
                        ? `${r.exercises.length} exercises`
                        : "No exercises"}
                    </p>
                  </div>
                  <div className="hero-actions">
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => startRoutine(r.name, r.exercises)}
                    >
                      Start
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => openRoutineEditor(r)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() =>
                        persist({
                          ...value,
                          routines: routines.filter((x) => x.id !== r.id),
                        })
                      }
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
          <div id="ms-gym-builder" className={editRoutineId ? "is-open" : undefined}>
          <h3>
            {editRoutineId ? `Editing ${routineName || "routine"}` : "Build a routine once, tap it at the gym"}
          </h3>
          <p className="panel-hint">
            Name it Leg Day, HIIT, or whatever you actually do. Add the exercises and planned
            sets. Next time, one tap loads the whole list.
          </p>
          <div className="ms-gym-routine-chips">
            {routines.map((r) => (
              <button
                key={r.id}
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => openRoutineEditor(r)}
              >
                {r.name}
              </button>
            ))}
            {ROUTINE_PRESETS.filter(
              (n) => !routines.some((r) => r.name.toLowerCase() === n.toLowerCase())
            ).map((n) => (
              <button
                key={n}
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => {
                  setEditRoutineId(null);
                  setRoutineName(n);
                  setLifts(seedLiftsFromHistory(workouts, n, starterLifts(n)));
                  jumpTo("ms-gym-builder");
                }}
              >
                {n}
              </button>
            ))}
          </div>
          <div className="field">
            <label>Routine name</label>
            <input
              value={routineName}
              onChange={(e) => setRoutineName(e.target.value.slice(0, 80))}
              placeholder="Leg Day"
              list="ms-gym-routine-names"
            />
            <datalist id="ms-gym-routine-names">
              {ROUTINE_PRESETS.map((n) => (
                <option key={n} value={n} />
              ))}
            </datalist>
          </div>
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
                    <GymExerciseHowTo name={lift.name} />
                  </div>
                  <div className="field">
                    <label>Sets</label>
                    <input
                      type="number"
                      min={1}
                      max={12}
                      value={lift.sets.length}
                      onChange={(e) => {
                        const n = Math.max(1, Math.min(12, Number(e.target.value) || 1));
                        const last = lift.sets[0] || emptySet();
                        patchLift(i, {
                          sets: Array.from({ length: n }, () => ({ ...last, done: false })),
                        });
                      }}
                    />
                  </div>
                  <div className="field">
                    <label>Reps (or sec)</label>
                    <input
                      type="number"
                      min={0}
                      value={lift.sets[0]?.reps === "" ? lift.sets[0]?.seconds || "" : lift.sets[0]?.reps}
                      onChange={(e) => {
                        const n = e.target.value === "" ? "" : Number(e.target.value);
                        const cardio = lift.kind === "cardio";
                        patchLift(i, {
                          sets: lift.sets.map((s) =>
                            cardio ? { ...s, seconds: n, reps: "" } : { ...s, reps: n }
                          ),
                        });
                      }}
                    />
                  </div>
                </div>
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
              </article>
            );
          })}
          <div className="hero-actions">
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => setLifts((prev) => [...prev, emptyLift()].slice(0, 20))}
            >
              Add exercise
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => saveRoutineFromLifts(routineName, lifts)}
            >
              {editRoutineId ? "Save routine" : "Save routine"}
            </button>
          </div>
          </div>
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
            delete any row. Health → Exercise (the previous submenu) is still for walks and swimming.
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
                  sub={`${placeNameById(w.gymId, w.gymName)}${w.durationMin ? ` · ${w.durationMin} min` : ""} · ${gymVolume(w).sets} sets${mediaHint(w)}`}
                  open={openDetails === w.id}
                  onDetails={() => setOpenDetails(openDetails === w.id ? null : w.id)}
                  onEdit={() => loadWorkout(w)}
                  onDelete={() => deleteWorkout(w.id)}
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
      <GymWorkoutMediaStrip items={w.media || []} />
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
