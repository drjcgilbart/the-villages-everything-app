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
import { SAMPLE_PET } from "@/lib/sampleBoards";

const KEY = "tvea-ms-pet-v2";
const MAX_PETS = 20;

type PetEvent = {
  id: string;
  time: string;
  label: string;
  enabled: boolean;
};

type Completion = { done: boolean; note: string; doneAt?: string };

type Pet = {
  id: string;
  name: string;
  species: string;
  breed: string;
  color: string;
  sex: string;
  birthday: string;
  weight: number | null;
  notes: string;
  vetName: string;
  vetPhone: string;
  photoName: string;
  alarmSound: AlarmTone;
  alarmDurationSec: number;
  walkAlarmEnabled: boolean;
  feedAlarmEnabled: boolean;
  walks: PetEvent[];
  feeds: PetEvent[];
};

type PetState = {
  activePetId: string;
  pets: Pet[];
  /** eventId:date → completion */
  completions: Record<string, Completion | boolean>;
  alarmSound?: AlarmTone;
  alarmDurationSec?: number;
  walkAlarmEnabled?: boolean;
  feedAlarmEnabled?: boolean;
};

const SPECIES = [
  { id: "dog", label: "Dog", emoji: "🐶", outingLabel: "Walks", outingAdd: "walk" },
  { id: "cat", label: "Cat", emoji: "🐱", outingLabel: "Play times", outingAdd: "play session" },
  { id: "bird", label: "Bird", emoji: "🐦", outingLabel: "Out-of-cage time", outingAdd: "out time" },
  { id: "fish", label: "Fish", emoji: "🐠", outingLabel: "Tank care", outingAdd: "tank check" },
  { id: "reptile", label: "Reptile", emoji: "🦎", outingLabel: "Habitat checks", outingAdd: "habitat check" },
  { id: "small-mammal", label: "Small mammal", emoji: "🐹", outingLabel: "Play / exercise", outingAdd: "play time" },
  { id: "horse", label: "Horse", emoji: "🐴", outingLabel: "Turnout / exercise", outingAdd: "turnout" },
  { id: "other", label: "Other", emoji: "🐾", outingLabel: "Care times", outingAdd: "care time" },
];

function speciesMeta(id: string) {
  return SPECIES.find((s) => s.id === id) || SPECIES[SPECIES.length - 1];
}

function defaultSchedule(species: string): { walks: PetEvent[]; feeds: PetEvent[] } {
  if (species === "dog") {
    return {
      walks: [
        { id: uid("walk"), time: "07:30", label: "Morning walk", enabled: true },
        { id: uid("walk"), time: "12:30", label: "Midday walk", enabled: true },
        { id: uid("walk"), time: "17:30", label: "Evening walk", enabled: true },
        { id: uid("walk"), time: "21:00", label: "Night walk", enabled: true },
      ],
      feeds: [
        { id: uid("feed"), time: "08:00", label: "Breakfast", enabled: true },
        { id: uid("feed"), time: "18:00", label: "Dinner", enabled: true },
      ],
    };
  }
  if (species === "cat") {
    return {
      walks: [{ id: uid("walk"), time: "19:00", label: "Play time", enabled: true }],
      feeds: [
        { id: uid("feed"), time: "07:30", label: "Breakfast", enabled: true },
        { id: uid("feed"), time: "18:00", label: "Dinner", enabled: true },
      ],
    };
  }
  if (species === "fish") {
    return {
      walks: [{ id: uid("walk"), time: "10:00", label: "Tank check", enabled: true }],
      feeds: [{ id: uid("feed"), time: "08:00", label: "Feeding", enabled: true }],
    };
  }
  if (species === "bird") {
    return {
      walks: [{ id: uid("walk"), time: "09:00", label: "Out-of-cage time", enabled: true }],
      feeds: [
        { id: uid("feed"), time: "08:00", label: "Morning feed", enabled: true },
        { id: uid("feed"), time: "17:00", label: "Evening feed", enabled: true },
      ],
    };
  }
  return {
    walks: [{ id: uid("walk"), time: "10:00", label: "Care / play", enabled: true }],
    feeds: [
      { id: uid("feed"), time: "08:00", label: "Breakfast", enabled: true },
      { id: uid("feed"), time: "18:00", label: "Dinner", enabled: true },
    ],
  };
}

function clampDuration(v: unknown): number {
  const n = Number(v);
  if (!Number.isFinite(n)) return 30;
  return Math.min(300, Math.max(5, Math.round(n)));
}

function seedPet(partial: Partial<Pet> & { name: string }): Pet {
  const species = SPECIES.some((s) => s.id === partial.species) ? partial.species! : "dog";
  const seeded = defaultSchedule(species);
  return {
    id: partial.id || uid("pet"),
    name: partial.name.slice(0, 60),
    species,
    breed: String(partial.breed || ""),
    color: String(partial.color || ""),
    sex: ["male", "female", "unknown"].includes(String(partial.sex)) ? String(partial.sex) : "unknown",
    birthday: /^\d{4}-\d{2}-\d{2}$/.test(String(partial.birthday || "")) ? String(partial.birthday) : "",
    weight: Number.isFinite(Number(partial.weight)) ? Number(partial.weight) : null,
    notes: String(partial.notes || (partial as { vetNotes?: string }).vetNotes || ""),
    vetName: String(partial.vetName || ""),
    vetPhone: String(partial.vetPhone || ""),
    photoName: String(partial.photoName || ""),
    alarmSound: (partial.alarmSound as AlarmTone) || "classic",
    alarmDurationSec: clampDuration(partial.alarmDurationSec),
    walkAlarmEnabled: partial.walkAlarmEnabled !== false,
    feedAlarmEnabled: partial.feedAlarmEnabled !== false,
    walks: Array.isArray(partial.walks) && partial.walks.length ? partial.walks : seeded.walks,
    feeds: Array.isArray(partial.feeds) && partial.feeds.length ? partial.feeds : seeded.feeds,
  };
}

function defaults(): PetState {
  const first = seedPet({ ...SAMPLE_PET, name: SAMPLE_PET.name });
  return { activePetId: first.id, pets: [first], completions: {} };
}

function asCompletion(v: Completion | boolean | undefined): Completion {
  if (v && typeof v === "object") {
    return { done: !!v.done, note: String(v.note || ""), doneAt: v.doneAt };
  }
  return { done: v === true, note: "" };
}

function migratePets(raw: PetState & { petName?: string; walks?: PetEvent[]; feeds?: PetEvent[]; vetNotes?: string }): PetState {
  const base = defaults();
  const globalSound = (raw.alarmSound as AlarmTone) || "classic";
  const globalDur = clampDuration(raw.alarmDurationSec);
  const globalWalk = raw.walkAlarmEnabled !== false;
  const globalFeed = raw.feedAlarmEnabled !== false;

  let pets: Pet[] = [];
  if (Array.isArray(raw.pets) && raw.pets.length) {
    pets = raw.pets.map((p) =>
      seedPet({
        ...p,
        name: p.name || "My pet",
        alarmSound: p.alarmSound || globalSound,
        alarmDurationSec: p.alarmDurationSec ?? globalDur,
        walkAlarmEnabled: p.walkAlarmEnabled ?? globalWalk,
        feedAlarmEnabled: p.feedAlarmEnabled ?? globalFeed,
        notes: p.notes || (p as { vetNotes?: string }).vetNotes || "",
      })
    );
  } else if (raw.petName || raw.walks) {
    pets = [
      seedPet({
        id: "pet-legacy",
        name: raw.petName || "My pet",
        species: (raw as { species?: string }).species || "dog",
        walks: raw.walks,
        feeds: raw.feeds,
        alarmSound: globalSound,
        alarmDurationSec: globalDur,
        walkAlarmEnabled: globalWalk,
        feedAlarmEnabled: globalFeed,
      }),
    ];
  } else if (!Array.isArray(raw.pets)) {
    pets = base.pets;
  } else {
    pets = [];
  }

  return {
    activePetId: pets.some((p) => p.id === raw.activePetId) ? raw.activePetId : pets[0].id,
    pets,
    completions: raw.completions || {},
  };
}

function petAge(birthday: string): string {
  if (!birthday) return "";
  const born = new Date(`${birthday}T12:00:00`);
  if (Number.isNaN(born.getTime())) return "";
  const now = new Date();
  let months = (now.getFullYear() - born.getFullYear()) * 12 + (now.getMonth() - born.getMonth());
  if (now.getDate() < born.getDate()) months -= 1;
  if (months < 0) return "";
  if (months < 12) return `${months} mo`;
  const years = Math.floor(months / 12);
  const rem = months % 12;
  return rem ? `${years}y ${rem}mo` : `${years} year${years === 1 ? "" : "s"}`;
}

function formatPetTime(hhmm: string): string {
  if (!/^\d{2}:\d{2}$/.test(hhmm || "")) return hhmm || "";
  const [h, m] = hhmm.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = ((h + 11) % 12) + 1;
  return `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
}

/**
 * Pet parade — same household pack as My Retirement Reboot Pets,
 * saved to the Hub member account. Photos stay on your camera roll.
 */
export function MySpacePetBoard() {
  const { value, save, ready } = useMemberBoard<PetState>(
    "pets",
    defaults(),
    true,
    { localKey: KEY, debounceMs: 700 }
  );
  const state = useMemo(
    () => migratePets((value || defaults()) as PetState),
    [value]
  );
  const pet = state.pets.find((p) => p.id === state.activePetId) || state.pets[0];
  const today = todayKeyEastern();
  const meta = speciesMeta(pet.species);

  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [newName, setNewName] = useState("");
  const [newSpecies, setNewSpecies] = useState("dog");
  const [newBreed, setNewBreed] = useState("");
  const [walkTime, setWalkTime] = useState("15:00");
  const [walkLabel, setWalkLabel] = useState("");
  const [feedTime, setFeedTime] = useState("12:00");
  const [feedLabel, setFeedLabel] = useState("");
  const [edit, setEdit] = useState({
    name: "",
    species: "dog",
    breed: "",
    color: "",
    sex: "unknown",
    birthday: "",
    weight: "",
    vetName: "",
    vetPhone: "",
    notes: "",
  });

  function persist(next: PetState) {
    void save(next);
  }

  function patchPet(next: Pet) {
    persist({
      ...state,
      pets: state.pets.map((p) => (p.id === next.id ? next : p)),
    });
  }

  function completion(eventId: string): Completion {
    return asCompletion(state.completions[`${eventId}:${today}`]);
  }

  function setCompletion(eventId: string, patch: Partial<Completion>) {
    const key = `${eventId}:${today}`;
    const cur = asCompletion(state.completions[key]);
    persist({
      ...state,
      completions: { ...state.completions, [key]: { ...cur, ...patch } },
    });
  }

  useEffect(() => {
    if (!ready) return;
    const fired = new Set<string>();
    const tick = () => {
      const t = nowTimeEastern();
      const d = todayKeyEastern();
      for (const p of state.pets) {
        const check = (events: PetEvent[], enabled: boolean) => {
          if (!enabled) return;
          for (const ev of events) {
            if (!ev.enabled || ev.time !== t) continue;
            const key = `${ev.id}:${d}`;
            if (asCompletion(state.completions[key]).done || fired.has(key)) continue;
            fired.add(key);
            playAlarmTone(p.alarmSound, p.alarmDurationSec);
          }
        };
        check(p.walks, p.walkAlarmEnabled);
        check(p.feeds, p.feedAlarmEnabled);
      }
    };
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, [ready, state.pets, state.completions]);

  function openEdit() {
    setEdit({
      name: pet.name,
      species: pet.species,
      breed: pet.breed,
      color: pet.color,
      sex: pet.sex,
      birthday: pet.birthday,
      weight: pet.weight != null ? String(pet.weight) : "",
      vetName: pet.vetName,
      vetPhone: pet.vetPhone,
      notes: pet.notes,
    });
    setShowEdit(true);
    setShowAdd(false);
  }

  const walkDone = pet.walks.filter((w) => w.enabled && completion(w.id).done).length;
  const walkTotal = pet.walks.filter((w) => w.enabled).length;
  const feedDone = pet.feeds.filter((f) => f.enabled && completion(f.id).done).length;
  const feedTotal = pet.feeds.filter((f) => f.enabled).length;
  const allDone = walkTotal + feedTotal > 0 && walkDone === walkTotal && feedDone === feedTotal;

  const household = state.pets.reduce(
    (acc, p) => {
      const wT = p.walks.filter((w) => w.enabled).length;
      const fT = p.feeds.filter((f) => f.enabled).length;
      const wD = p.walks.filter((w) => w.enabled && completion(w.id).done).length;
      const fD = p.feeds.filter((f) => f.enabled && completion(f.id).done).length;
      acc.done += wD + fD;
      acc.total += wT + fT;
      return acc;
    },
    { done: 0, total: 0 }
  );

  const bits = [
    meta.label,
    pet.breed,
    pet.color,
    pet.sex && pet.sex !== "unknown" ? pet.sex : "",
    petAge(pet.birthday),
    pet.weight != null ? `${pet.weight} lbs` : "",
  ].filter(Boolean);

  if (!ready) return <p className="panel-hint">Loading pet parade…</p>;

  return (
    <div className="ms-pet-board">
      <p className="ms-module-lead">
        Multiple pets, walks, meals, vet notes, and alarms — the same household pack as the old My
        Retirement Reboot app, saved to your member account.
      </p>

      <div className="ms-h-toolbar">
        <span className="ms-h-pill">Tracking</span>
        <span className="panel-hint">
          {state.pets.length} pet{state.pets.length === 1 ? "" : "s"} · {household.done}/{household.total} today
        </span>
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={() => {
            setShowAdd(true);
            setShowEdit(false);
          }}
        >
          Add pet
        </button>
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={() => playAlarmTone(pet.alarmSound, 2)}
        >
          Test alarm
        </button>
      </div>

      <div className="ms-pet-roster">
        {state.pets.map((p) => {
          const sm = speciesMeta(p.species);
          const wT = p.walks.filter((w) => w.enabled).length;
          const fT = p.feeds.filter((f) => f.enabled).length;
          const wD = p.walks.filter((w) => w.enabled && completion(w.id).done).length;
          const fD = p.feeds.filter((f) => f.enabled && completion(f.id).done).length;
          return (
            <button
              key={p.id}
              type="button"
              className={`ms-pet-roster-card ${p.id === pet.id ? "active" : ""}`}
              onClick={() => {
                persist({ ...state, activePetId: p.id });
                setShowAdd(false);
                setShowEdit(false);
              }}
            >
              <span className="ms-pet-avatar" aria-hidden>
                {sm.emoji}
              </span>
              <span>
                <strong>{p.name}</strong>
                <em>{sm.label}</em>
                <small>
                  {wD + fD}/{wT + fT} today
                </small>
              </span>
            </button>
          );
        })}
      </div>

      {showAdd ? (
        <div className="about-panel ms-module">
          <h3>Add a pet</h3>
          <p className="panel-hint">Name and type are enough to start. You can add more details next.</p>
          <form
            className="form-grid ms-module-form"
            onSubmit={(e) => {
              e.preventDefault();
              const name = newName.trim();
              if (!name) return;
              if (state.pets.length >= MAX_PETS) return;
              const extra = seedPet({ name, species: newSpecies, breed: newBreed });
              persist({
                ...state,
                pets: [...state.pets, extra],
                activePetId: extra.id,
              });
              setNewName("");
              setNewBreed("");
              setNewSpecies("dog");
              setShowAdd(false);
            }}
          >
            <div className="field">
              <label>Name</label>
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Angelcake"
                required
              />
            </div>
            <div className="field">
              <label>Type</label>
              <select value={newSpecies} onChange={(e) => setNewSpecies(e.target.value)}>
                {SPECIES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.emoji} {s.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Breed (optional)</label>
              <input
                value={newBreed}
                onChange={(e) => setNewBreed(e.target.value)}
                placeholder="e.g. Mixed"
              />
            </div>
            <button type="submit" className="btn btn-primary btn-sm">
              Save pet
            </button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShowAdd(false)}>
              Cancel
            </button>
          </form>
        </div>
      ) : (
        <div className="about-panel ms-module">
          <div className="ms-pet-hero">
            <div className="ms-pet-avatar lg" aria-hidden>
              {meta.emoji}
            </div>
            <div>
              <h3 style={{ margin: 0 }}>{pet.name}</h3>
              <p className="panel-hint">{bits.join(" · ") || "Add details in Edit profile"}</p>
              {pet.vetName ? (
                <p className="panel-hint">
                  Vet: {pet.vetName}
                  {pet.vetPhone ? ` · ${pet.vetPhone}` : ""}
                </p>
              ) : null}
              {pet.notes ? <p>{pet.notes}</p> : null}
              {pet.photoName ? (
                <p className="panel-hint">Photo on camera roll: {pet.photoName}</p>
              ) : null}
            </div>
            <div className="hero-actions">
              <label className="btn btn-ghost btn-sm">
                Photo
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => {
                    const name = e.target.files?.[0]?.name || "";
                    patchPet({ ...pet, photoName: name });
                    e.target.value = "";
                  }}
                />
              </label>
              {pet.photoName ? (
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => patchPet({ ...pet, photoName: "" })}
                >
                  Remove photo
                </button>
              ) : null}
              <button type="button" className="btn btn-ghost btn-sm" onClick={openEdit}>
                {showEdit ? "Close editor" : "Edit profile"}
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => {
                  if (state.pets.length <= 1) {
                    window.alert("Keep at least one pet, or add another first.");
                    return;
                  }
                  if (!window.confirm(`Delete ${pet.name}? This removes their schedule too.`)) return;
                  const pets = state.pets.filter((p) => p.id !== pet.id);
                  persist({ ...state, pets, activePetId: pets[0].id });
                  setShowEdit(false);
                }}
              >
                Delete pet
              </button>
            </div>
          </div>

          {showEdit ? (
            <form
              className="form-grid ms-module-form"
              onSubmit={(e) => {
                e.preventDefault();
                const name = edit.name.trim();
                if (!name) return;
                patchPet({
                  ...pet,
                  name: name.slice(0, 60),
                  species: edit.species,
                  breed: edit.breed.trim().slice(0, 80),
                  color: edit.color.trim().slice(0, 40),
                  sex: edit.sex,
                  birthday: edit.birthday,
                  weight: edit.weight ? Number(edit.weight) || null : null,
                  vetName: edit.vetName.trim().slice(0, 80),
                  vetPhone: edit.vetPhone.trim().slice(0, 40),
                  notes: edit.notes.trim().slice(0, 1000),
                });
                setShowEdit(false);
              }}
            >
              <div className="field">
                <label>Name</label>
                <input value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} required />
              </div>
              <div className="field">
                <label>Type</label>
                <select value={edit.species} onChange={(e) => setEdit({ ...edit, species: e.target.value })}>
                  {SPECIES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.emoji} {s.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label>Breed</label>
                <input value={edit.breed} onChange={(e) => setEdit({ ...edit, breed: e.target.value })} />
              </div>
              <div className="field">
                <label>Color</label>
                <input value={edit.color} onChange={(e) => setEdit({ ...edit, color: e.target.value })} />
              </div>
              <div className="field">
                <label>Sex</label>
                <select value={edit.sex} onChange={(e) => setEdit({ ...edit, sex: e.target.value })}>
                  <option value="unknown">Unknown</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div className="field">
                <label>Birthday</label>
                <input
                  type="date"
                  value={edit.birthday}
                  onChange={(e) => setEdit({ ...edit, birthday: e.target.value })}
                />
              </div>
              <div className="field">
                <label>Weight (lbs)</label>
                <input
                  type="number"
                  min={0}
                  step={0.1}
                  value={edit.weight}
                  onChange={(e) => setEdit({ ...edit, weight: e.target.value })}
                />
              </div>
              <div className="field">
                <label>Vet name</label>
                <input value={edit.vetName} onChange={(e) => setEdit({ ...edit, vetName: e.target.value })} />
              </div>
              <div className="field">
                <label>Vet phone</label>
                <input value={edit.vetPhone} onChange={(e) => setEdit({ ...edit, vetPhone: e.target.value })} />
              </div>
              <div className="field">
                <label>Notes</label>
                <input
                  value={edit.notes}
                  onChange={(e) => setEdit({ ...edit, notes: e.target.value })}
                  placeholder="Meds, quirks, favorite treat…"
                />
              </div>
              <button type="submit" className="btn btn-primary btn-sm">
                Save profile
              </button>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShowEdit(false)}>
                Cancel
              </button>
            </form>
          ) : null}

          <div className="ms-stat-row" style={{ marginTop: "1rem" }}>
            <div className="ms-stat">
              <span>{meta.outingLabel} done</span>
              <strong>
                {walkDone}/{walkTotal}
              </strong>
            </div>
            <div className="ms-stat">
              <span>Meals done</span>
              <strong>
                {feedDone}/{feedTotal}
              </strong>
            </div>
            <div className="ms-stat">
              <span>Day status</span>
              <strong>{allDone ? "All done!" : "In progress"}</strong>
            </div>
          </div>
        </div>
      )}

      {!showAdd ? (
        <>
          <div className="ms-pet-grid">
            <EventColumn
              title={`${meta.emoji} ${meta.outingLabel}`}
              events={pet.walks}
              addTime={walkTime}
              addLabel={walkLabel}
              addPlaceholder={`e.g. ${meta.outingAdd}`}
              noteHint="Poops, limp, extra sniffing, short walk…"
              completion={completion}
              onAddTime={setWalkTime}
              onAddLabel={setWalkLabel}
              onAdd={() => {
                const label = walkLabel.trim() || meta.outingAdd;
                patchPet({
                  ...pet,
                  walks: [
                    ...pet.walks,
                    { id: uid("walk"), time: walkTime || "15:00", label: label.slice(0, 80), enabled: true },
                  ],
                });
                setWalkLabel("");
              }}
              onPatch={(next) => patchPet({ ...pet, walks: next })}
              onCompletion={setCompletion}
            />
            <EventColumn
              title="🥣 Feedings"
              events={pet.feeds}
              addTime={feedTime}
              addLabel={feedLabel}
              addPlaceholder="e.g. Lunch"
              noteHint="Ate well, skipped kibble, extra treat…"
              completion={completion}
              onAddTime={setFeedTime}
              onAddLabel={setFeedLabel}
              onAdd={() => {
                const label = feedLabel.trim() || "Snack";
                patchPet({
                  ...pet,
                  feeds: [
                    ...pet.feeds,
                    { id: uid("feed"), time: feedTime || "12:00", label: label.slice(0, 80), enabled: true },
                  ],
                });
                setFeedLabel("");
              }}
              onPatch={(next) => patchPet({ ...pet, feeds: next })}
              onCompletion={setCompletion}
            />
          </div>

          <div className="about-panel ms-module">
            <h3 style={{ marginTop: 0 }}>⏰ Alarms for {pet.name}</h3>
            <div className="form-grid ms-module-form">
              <div className="field">
                <label>Alarm sound</label>
                <select
                  value={pet.alarmSound}
                  onChange={(e) => patchPet({ ...pet, alarmSound: e.target.value as AlarmTone })}
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
                  value={pet.alarmDurationSec}
                  onChange={(e) =>
                    patchPet({ ...pet, alarmDurationSec: clampDuration(e.target.value) })
                  }
                />
              </div>
              <label className="ms-check">
                <input
                  type="checkbox"
                  checked={pet.walkAlarmEnabled}
                  onChange={(e) => patchPet({ ...pet, walkAlarmEnabled: e.target.checked })}
                />
                Run {meta.outingLabel.toLowerCase()} alarms
              </label>
              <label className="ms-check">
                <input
                  type="checkbox"
                  checked={pet.feedAlarmEnabled}
                  onChange={(e) => patchPet({ ...pet, feedAlarmEnabled: e.target.checked })}
                />
                Run feeding alarms
              </label>
            </div>
            <p className="panel-hint">
              Alarms fire for this pet’s enabled times that aren’t marked done yet. Every pet can have
              its own sound. Keep the dashboard open so they can ring.
            </p>
          </div>
        </>
      ) : null}
    </div>
  );
}

function EventColumn({
  title,
  events,
  addTime,
  addLabel,
  addPlaceholder,
  noteHint,
  completion,
  onAddTime,
  onAddLabel,
  onAdd,
  onPatch,
  onCompletion,
}: {
  title: string;
  events: PetEvent[];
  addTime: string;
  addLabel: string;
  addPlaceholder: string;
  noteHint: string;
  completion: (id: string) => Completion;
  onAddTime: (v: string) => void;
  onAddLabel: (v: string) => void;
  onAdd: () => void;
  onPatch: (next: PetEvent[]) => void;
  onCompletion: (id: string, patch: Partial<Completion>) => void;
}) {
  return (
    <div className="about-panel ms-module">
      <h3 style={{ marginTop: 0 }}>{title}</h3>
      {events.length === 0 ? <p className="panel-hint">No times scheduled yet.</p> : null}
      {events.map((ev) => {
        const c = completion(ev.id);
        return (
          <div key={ev.id} className={`ms-pet-event ${c.done ? "done" : ""} ${ev.enabled ? "" : "off"}`}>
            <input
              type="checkbox"
              checked={c.done}
              onChange={(e) =>
                onCompletion(ev.id, {
                  done: e.target.checked,
                  doneAt: e.target.checked ? nowTimeEastern() : undefined,
                })
              }
            />
            <div>
              <input
                value={ev.label}
                onChange={(e) =>
                  onPatch(events.map((x) => (x.id === ev.id ? { ...x, label: e.target.value.slice(0, 80) } : x)))
                }
              />
              <span className="panel-hint">
                {c.done
                  ? `Done · planned ${formatPetTime(ev.time)}`
                  : ev.enabled
                    ? "Included in schedule / alarms"
                    : "Skipped (enable with On)"}
              </span>
            </div>
            <input
              type="time"
              className="ms-inline-time"
              value={ev.time}
              onChange={(e) =>
                onPatch(events.map((x) => (x.id === ev.id ? { ...x, time: e.target.value } : x)))
              }
            />
            <label className="ms-check">
              <input
                type="checkbox"
                checked={ev.enabled}
                onChange={(e) =>
                  onPatch(events.map((x) => (x.id === ev.id ? { ...x, enabled: e.target.checked } : x)))
                }
              />
              On
            </label>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => onPatch(events.filter((x) => x.id !== ev.id))}
            >
              ×
            </button>
            <textarea
              rows={2}
              value={c.note}
              onChange={(e) => onCompletion(ev.id, { note: e.target.value.slice(0, 500) })}
              placeholder={noteHint}
            />
          </div>
        );
      })}
      <form
        className="form-grid ms-module-form"
        onSubmit={(e) => {
          e.preventDefault();
          onAdd();
        }}
      >
        <div className="field">
          <label>Time</label>
          <input type="time" value={addTime} onChange={(e) => onAddTime(e.target.value)} required />
        </div>
        <div className="field">
          <label>Label</label>
          <input
            value={addLabel}
            onChange={(e) => onAddLabel(e.target.value)}
            placeholder={addPlaceholder}
          />
        </div>
        <button type="submit" className="btn btn-primary btn-sm">
          Add
        </button>
      </form>
    </div>
  );
}
