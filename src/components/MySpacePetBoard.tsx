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

type PetState = {
  petName: string;
  species: string;
  alarmSound: AlarmTone;
  alarmDurationSec: number;
  walkAlarmEnabled: boolean;
  feedAlarmEnabled: boolean;
  walks: PetEvent[];
  feeds: PetEvent[];
  /** eventId:date → done */
  completions: Record<string, boolean>;
};

function defaults(): PetState {
  return {
    petName: "Angelcake",
    species: "dog",
    alarmSound: "classic",
    alarmDurationSec: 20,
    walkAlarmEnabled: true,
    feedAlarmEnabled: true,
    walks: [
      { id: "walk-morning", time: "07:30", label: "Morning walk", enabled: true },
      { id: "walk-midday", time: "12:30", label: "Midday walk", enabled: true },
      { id: "walk-evening", time: "17:30", label: "Evening walk", enabled: true },
      { id: "walk-night", time: "21:00", label: "Night walk", enabled: true },
    ],
    feeds: [
      {
        id: "feed-breakfast",
        time: "08:00",
        label: "Breakfast",
        enabled: true,
      },
      { id: "feed-dinner", time: "18:00", label: "Dinner", enabled: true },
    ],
    completions: {},
  };
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
  const loaded = value;
  const state: PetState = {
    ...defaults(),
    ...loaded,
    walks: Array.isArray(loaded.walks) ? loaded.walks : defaults().walks,
    feeds: Array.isArray(loaded.feeds) ? loaded.feeds : defaults().feeds,
  };
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
      check(state.walks, state.walkAlarmEnabled);
      check(state.feeds, state.feedAlarmEnabled);
    };
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, [
    ready,
    state.walks,
    state.feeds,
    state.walkAlarmEnabled,
    state.feedAlarmEnabled,
    state.alarmSound,
    state.alarmDurationSec,
    state.completions,
  ]);

  if (!ready) return <p className="panel-hint">Loading pet parade…</p>;

  const walkDone = state.walks.filter((w) => w.enabled && isDone(w.id)).length;
  const walkTotal = state.walks.filter((w) => w.enabled).length;
  const feedDone = state.feeds.filter((f) => f.enabled && isDone(f.id)).length;
  const feedTotal = state.feeds.filter((f) => f.enabled).length;

  return (
    <div className="ms-pet-board">
      <p className="ms-module-lead">
        Walks, meals, and alarms for the real CEO of the household — ported
        from the desktop Angelcake care panel. Data stays on this browser.
      </p>

      <div className="about-panel ms-module">
        <div className="form-grid ms-module-form">
          <div className="field">
            <label>Pet name</label>
            <input
              value={state.petName}
              onChange={(e) =>
                persist({ ...state, petName: e.target.value.slice(0, 60) })
              }
            />
          </div>
          <div className="field">
            <label>Species / notes</label>
            <input
              value={state.species}
              onChange={(e) =>
                persist({ ...state, species: e.target.value.slice(0, 40) })
              }
              placeholder="dog, cat, bird…"
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
          {state.walks.map((w) => (
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
                  persist({
                    ...state,
                    walks: state.walks.map((x) =>
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
            persist({
              ...state,
              walks: [
                ...state.walks,
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
          {state.feeds.map((f) => (
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
                  persist({
                    ...state,
                    feeds: state.feeds.map((x) =>
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
            persist({
              ...state,
              feeds: [
                ...state.feeds,
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
