"use client";

import { useEffect } from "react";
import {
  nowTimeEastern,
  playAlarmTone,
  todayKeyEastern,
  uid,
  type AlarmTone,
} from "@/lib/mySpaceStorage";
import { useMemberBoard } from "@/components/useMemberBoard";

const KEY = "tvea-ms-pet-v2";

type PetEvent = {
  id: string;
  time: string;
  label: string;
  enabled: boolean;
};

type Pet = {
  id: string;
  name: string;
  species: string;
  vetNotes: string;
  walks: PetEvent[];
  feeds: PetEvent[];
};

type PetState = {
  alarmSound: AlarmTone;
  alarmDurationSec: number;
  walkAlarmEnabled: boolean;
  feedAlarmEnabled: boolean;
  activePetId: string;
  pets: Pet[];
  /** eventId:date → done */
  completions: Record<string, boolean>;
};

function dogSchedule(): { walks: PetEvent[]; feeds: PetEvent[] } {
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

function defaults(): PetState {
  const first: Pet = {
    id: "pet-angelcake",
    name: "Angelcake",
    species: "dog",
    vetNotes: "",
    ...dogSchedule(),
  };
  return {
    alarmSound: "classic",
    alarmDurationSec: 20,
    walkAlarmEnabled: true,
    feedAlarmEnabled: true,
    activePetId: first.id,
    pets: [first],
    completions: {},
  };
}

function migratePets(raw: PetState & { petName?: string; species?: string; walks?: PetEvent[]; feeds?: PetEvent[] }): PetState {
  const base = defaults();
  if (Array.isArray(raw.pets) && raw.pets.length) {
    return {
      ...base,
      ...raw,
      pets: raw.pets,
      activePetId: raw.activePetId || raw.pets[0].id,
      completions: raw.completions || {},
    };
  }
  if (raw.petName || raw.walks) {
    const one: Pet = {
      id: "pet-legacy",
      name: raw.petName || "My pet",
      species: raw.species || "dog",
      vetNotes: "",
      walks: Array.isArray(raw.walks) ? raw.walks : dogSchedule().walks,
      feeds: Array.isArray(raw.feeds) ? raw.feeds : dogSchedule().feeds,
    };
    return { ...base, ...raw, pets: [one], activePetId: one.id };
  }
  return { ...base, ...raw };
}

/**
 * Pet parade — ported from My Retirement Reboot Angelcake care tracker.
 * Saved to the Hub member account so PC and phones stay in sync.
 */
export function MySpacePetBoard() {
  const { value, save, ready } = useMemberBoard<PetState>(
    "pets",
    defaults(),
    true,
    { localKey: KEY, debounceMs: 700 }
  );
  const state = migratePets(value as PetState);
  const pet = state.pets.find((p) => p.id === state.activePetId) || state.pets[0];
  const today = todayKeyEastern();

  function persist(next: PetState) {
    void save(next);
  }

  function toggleDone(eventId: string, done: boolean) {
    const key = `${eventId}:${today}`;
    persist({
      ...state,
      completions: { ...state.completions, [key]: done },
    });
  }

  function isDone(eventId: string) {
    return !!state.completions[`${eventId}:${today}`];
  }

  // Alarm loop
  useEffect(() => {
    if (!ready) return;
    const fired = new Set<string>();
    const tick = () => {
      const t = nowTimeEastern();
      const d = todayKeyEastern();
      const check = (events: PetEvent[], enabled: boolean) => {
        if (!enabled) return;
        for (const ev of events) {
          if (!ev.enabled || ev.time !== t) continue;
          const key = `${ev.id}:${d}`;
          if (state.completions[key] || fired.has(key)) continue;
          fired.add(key);
          playAlarmTone(state.alarmSound, state.alarmDurationSec);
        }
      };
      for (const p of state.pets) {
        check(p.walks, state.walkAlarmEnabled);
        check(p.feeds, state.feedAlarmEnabled);
      }
    };
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, [
    ready,
    state.pets,
    state.walkAlarmEnabled,
    state.feedAlarmEnabled,
    state.alarmSound,
    state.alarmDurationSec,
    state.completions,
  ]);

  if (!ready) return <p className="panel-hint">Loading pet parade…</p>;

  const walkDone = pet.walks.filter((w) => w.enabled && isDone(w.id)).length;
  const walkTotal = pet.walks.filter((w) => w.enabled).length;
  const feedDone = pet.feeds.filter((f) => f.enabled && isDone(f.id)).length;
  const feedTotal = pet.feeds.filter((f) => f.enabled).length;

  function patchPet(next: Pet) {
    persist({
      ...state,
      pets: state.pets.map((p) => (p.id === next.id ? next : p)),
    });
  }

  return (
    <div className="ms-pet-board">
      <p className="ms-module-lead">
        Multiple pets, walks, meals, vet notes, and alarms — the same household
        pack as the old My Retirement Reboot app, saved to your member account.
      </p>

      <div className="ms-subnav">
        {state.pets.map((p) => (
          <button
            key={p.id}
            type="button"
            className={`ms-subnav-btn ${p.id === pet.id ? "is-on" : ""}`}
            onClick={() => persist({ ...state, activePetId: p.id })}
          >
            {p.name}
          </button>
        ))}
        <button
          type="button"
          className="ms-subnav-btn"
          onClick={() => {
            const extra: Pet = {
              id: uid("pet"),
              name: "New pet",
              species: "dog",
              vetNotes: "",
              ...dogSchedule(),
            };
            persist({
              ...state,
              pets: [...state.pets, extra].slice(0, 20),
              activePetId: extra.id,
            });
          }}
        >
          + Add pet
        </button>
      </div>

      <div className="about-panel ms-module">
        <div className="form-grid ms-module-form">
          <div className="field">
            <label>Pet name</label>
            <input
              value={pet.name}
              onChange={(e) =>
                patchPet({ ...pet, name: e.target.value.slice(0, 60) })
              }
            />
          </div>
          <div className="field">
            <label>Species</label>
            <input
              value={pet.species}
              onChange={(e) =>
                patchPet({ ...pet, species: e.target.value.slice(0, 40) })
              }
              placeholder="dog, cat, bird…"
            />
          </div>
          <div className="field">
            <label>Vet notes</label>
            <input
              value={pet.vetNotes}
              onChange={(e) =>
                patchPet({ ...pet, vetNotes: e.target.value.slice(0, 200) })
              }
              placeholder="Vet, meds, allergies…"
            />
          </div>
        </div>

        <div className="ms-stat-row" style={{ marginTop: "1rem" }}>
          <div className="ms-stat">
            <span>Walks today</span>
            <strong>
              {walkDone}/{walkTotal}
            </strong>
          </div>
          <div className="ms-stat">
            <span>Meals today</span>
            <strong>
              {feedDone}/{feedTotal}
            </strong>
          </div>
        </div>
      </div>

      <div className="about-panel ms-module">
        <h4 style={{ marginTop: 0 }}>Walks — {today}</h4>
        <ul className="ms-check-list">
          {pet.walks.map((w) => (
            <li key={w.id}>
              <label className="ms-check">
                <input
                  type="checkbox"
                  checked={isDone(w.id)}
                  disabled={!w.enabled}
                  onChange={(e) => toggleDone(w.id, e.target.checked)}
                />
                <span>
                  <strong>{w.label}</strong> · {w.time}
                </span>
              </label>
              <input
                type="time"
                value={w.time}
                className="ms-inline-time"
                onChange={(e) =>
                  patchPet({
                    ...pet,
                    walks: pet.walks.map((x) =>
                      x.id === w.id ? { ...x, time: e.target.value } : x
                    ),
                  })
                }
              />
            </li>
          ))}
        </ul>
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={() =>
            patchPet({
              ...pet,
              walks: [
                ...pet.walks,
                {
                  id: uid("walk"),
                  time: "15:00",
                  label: "Extra walk",
                  enabled: true,
                },
              ],
            })
          }
        >
          + Add walk
        </button>
      </div>

      <div className="about-panel ms-module">
        <h4 style={{ marginTop: 0 }}>Meals — {today}</h4>
        <ul className="ms-check-list">
          {pet.feeds.map((f) => (
            <li key={f.id}>
              <label className="ms-check">
                <input
                  type="checkbox"
                  checked={isDone(f.id)}
                  disabled={!f.enabled}
                  onChange={(e) => toggleDone(f.id, e.target.checked)}
                />
                <span>
                  <strong>{f.label}</strong> · {f.time}
                </span>
              </label>
              <input
                type="time"
                value={f.time}
                className="ms-inline-time"
                onChange={(e) =>
                  patchPet({
                    ...pet,
                    feeds: pet.feeds.map((x) =>
                      x.id === f.id ? { ...x, time: e.target.value } : x
                    ),
                  })
                }
              />
            </li>
          ))}
        </ul>
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={() =>
            patchPet({
              ...pet,
              feeds: [
                ...pet.feeds,
                {
                  id: uid("feed"),
                  time: "12:00",
                  label: "Snack",
                  enabled: true,
                },
              ],
            })
          }
        >
          + Add meal
        </button>
      </div>

      <div className="about-panel ms-module">
        <h4 style={{ marginTop: 0 }}>Alarms</h4>
        <p className="panel-hint">
          Keep My Space open in a browser tab for beeps at schedule times
          (Eastern). Check off items to silence that slot for today.
        </p>
        <label className="ms-check">
          <input
            type="checkbox"
            checked={state.walkAlarmEnabled}
            onChange={(e) =>
              persist({ ...state, walkAlarmEnabled: e.target.checked })
            }
          />
          Walk alarms on
        </label>
        <label className="ms-check">
          <input
            type="checkbox"
            checked={state.feedAlarmEnabled}
            onChange={(e) =>
              persist({ ...state, feedAlarmEnabled: e.target.checked })
            }
          />
          Meal alarms on
        </label>
        <div className="field" style={{ marginTop: "0.5rem" }}>
          <label>Sound</label>
          <select
            value={state.alarmSound}
            onChange={(e) =>
              persist({
                ...state,
                alarmSound: e.target.value as AlarmTone,
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
          onClick={() => playAlarmTone(state.alarmSound, 2)}
        >
          Test alarm
        </button>
      </div>
    </div>
  );
}
