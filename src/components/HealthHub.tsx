"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  DAILY_MOVES,
  MOOD_OPTIONS,
  stretchOfDay,
  tipOfDay,
} from "@/lib/healthResources";

const STORAGE_KEY = "tvea-health-checkin-v1";

type DayLog = {
  dateKey: string;
  mood?: string;
  water: number;
  moves: string[];
  stepsGoal: number;
  stepsDone: number;
  note?: string;
};

function todayKey() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const y = parts.find((p) => p.type === "year")?.value;
  const m = parts.find((p) => p.type === "month")?.value;
  const d = parts.find((p) => p.type === "day")?.value;
  return `${y}-${m}-${d}`;
}

function emptyLog(dateKey: string): DayLog {
  return {
    dateKey,
    water: 0,
    moves: [],
    stepsGoal: 6000,
    stepsDone: 0,
  };
}

function loadLog(): DayLog {
  if (typeof window === "undefined") return emptyLog(todayKey());
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyLog(todayKey());
    const parsed = JSON.parse(raw) as DayLog;
    const key = todayKey();
    if (parsed.dateKey !== key) return emptyLog(key);
    return {
      ...emptyLog(key),
      ...parsed,
      dateKey: key,
      water: Number(parsed.water) || 0,
      moves: Array.isArray(parsed.moves) ? parsed.moves : [],
      stepsGoal: Number(parsed.stepsGoal) || 6000,
      stepsDone: Number(parsed.stepsDone) || 0,
    };
  } catch {
    return emptyLog(todayKey());
  }
}

function saveLog(log: DayLog) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(log));
  } catch {
    /* ignore quota */
  }
}

export function HealthHub() {
  const [log, setLog] = useState<DayLog | null>(null);
  const [note, setNote] = useState("");
  const [savedFlash, setSavedFlash] = useState(false);

  useEffect(() => {
    const initial = loadLog();
    setLog(initial);
    setNote(initial.note || "");
  }, []);

  const tip = useMemo(() => tipOfDay(), []);
  const stretch = useMemo(() => stretchOfDay(), []);

  const update = useCallback((patch: Partial<DayLog>) => {
    setLog((prev) => {
      const base = prev || emptyLog(todayKey());
      const next = { ...base, ...patch, dateKey: todayKey() };
      saveLog(next);
      return next;
    });
  }, []);

  if (!log) {
    return <div className="empty-state">Loading your wellness tools…</div>;
  }

  const stepsPct = Math.min(
    100,
    Math.round((log.stepsDone / Math.max(log.stepsGoal, 1)) * 100)
  );
  const waterGoal = 8;
  const waterPct = Math.min(100, Math.round((log.water / waterGoal) * 100));

  function toggleMove(id: string) {
    const has = log.moves.includes(id);
    update({
      moves: has ? log.moves.filter((m) => m !== id) : [...log.moves, id],
    });
  }

  function saveNote() {
    update({ note: note.trim().slice(0, 240) });
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 2000);
  }

  return (
    <div className="health-hub">
      <div className="section-head">
        <div>
          <h2>Wellness tools (on this device)</h2>
          <p>
            A light daily check-in stored only in your browser — no account, no
            lecture. Reset happens automatically tomorrow (Florida time).
          </p>
        </div>
      </div>

      <div className="health-tools-grid">
        {/* Mood */}
        <article className="about-panel health-tool-card">
          <div className="health-tool-head">
            <span className="health-tool-emoji" aria-hidden>
              🌤️
            </span>
            <div>
              <h3>How are you feeling?</h3>
              <p className="health-muted">Tap once — honesty counts more than polish.</p>
            </div>
          </div>
          <div className="health-mood-row">
            {MOOD_OPTIONS.map((m) => (
              <button
                key={m.id}
                type="button"
                className={`health-mood-btn${log.mood === m.id ? " is-on" : ""}`}
                onClick={() => update({ mood: m.id })}
              >
                <span aria-hidden>{m.emoji}</span>
                {m.label}
              </button>
            ))}
          </div>
        </article>

        {/* Water */}
        <article className="about-panel health-tool-card">
          <div className="health-tool-head">
            <span className="health-tool-emoji" aria-hidden>
              💧
            </span>
            <div>
              <h3>Hydration</h3>
              <p className="health-muted">
                {log.water} of {waterGoal} glasses · Florida tax included
              </p>
            </div>
          </div>
          <div className="health-meter">
            <div className="health-meter-bar" style={{ width: `${waterPct}%` }} />
          </div>
          <div className="health-tool-actions">
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => update({ water: Math.max(0, log.water - 1) })}
            >
              − Glass
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => update({ water: Math.min(20, log.water + 1) })}
            >
              + Glass
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => update({ water: 0 })}
            >
              Reset
            </button>
          </div>
        </article>

        {/* Steps */}
        <article className="about-panel health-tool-card">
          <div className="health-tool-head">
            <span className="health-tool-emoji" aria-hidden>
              👟
            </span>
            <div>
              <h3>Steps goal</h3>
              <p className="health-muted">
                {log.stepsDone.toLocaleString()} / {log.stepsGoal.toLocaleString()}{" "}
                ({stepsPct}%)
              </p>
            </div>
          </div>
          <div className="health-meter health-meter-steps">
            <div className="health-meter-bar" style={{ width: `${stepsPct}%` }} />
          </div>
          <div className="health-tool-actions">
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() =>
                update({ stepsDone: Math.max(0, log.stepsDone - 500) })
              }
            >
              −500
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => update({ stepsDone: log.stepsDone + 500 })}
            >
              +500
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => update({ stepsDone: log.stepsDone + 1000 })}
            >
              +1k
            </button>
          </div>
          <label className="health-goal-label" htmlFor="steps-goal">
            Daily goal
          </label>
          <select
            id="steps-goal"
            value={log.stepsGoal}
            onChange={(e) => update({ stepsGoal: Number(e.target.value) })}
          >
            {[4000, 5000, 6000, 8000, 10000].map((n) => (
              <option key={n} value={n}>
                {n.toLocaleString()} steps
              </option>
            ))}
          </select>
        </article>

        {/* Daily moves checklist */}
        <article className="about-panel health-tool-card health-tool-wide">
          <div className="health-tool-head">
            <span className="health-tool-emoji" aria-hidden>
              ✅
            </span>
            <div>
              <h3>Tiny wins checklist</h3>
              <p className="health-muted">
                Check off what you actually did — no gold stars required (but
                we&apos;ll imagine them).
              </p>
            </div>
          </div>
          <ul className="health-move-list">
            {DAILY_MOVES.map((m) => {
              const on = log.moves.includes(m.id);
              return (
                <li key={m.id}>
                  <button
                    type="button"
                    className={`health-move-chip${on ? " is-on" : ""}`}
                    onClick={() => toggleMove(m.id)}
                    aria-pressed={on}
                  >
                    <span aria-hidden>{on ? "✓" : m.emoji}</span>
                    <span>
                      {m.label}
                      <em> · ~{m.minutes} min</em>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </article>
      </div>

      <div className="health-daily-pair">
        <article className="about-panel health-tip-card">
          <span className="pill health-pill">Tip of the day</span>
          <p className="health-tip-text">{tip}</p>
        </article>
        <article className="about-panel health-tip-card">
          <span className="pill health-pill-stretch">Stretch of the day</span>
          <h3 style={{ margin: "0.45rem 0 0.35rem" }}>{stretch.name}</h3>
          <p className="health-muted" style={{ margin: 0 }}>
            {stretch.body}
          </p>
        </article>
      </div>

      <article className="about-panel health-note-card">
        <h3 style={{ marginTop: 0 }}>Pocket note (optional)</h3>
        <p className="health-muted">
          Med reminder, appointment, or “call the dermatologist” — stays on this
          device only.
        </p>
        <textarea
          rows={2}
          maxLength={240}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="e.g. Refill BP med Thursday · bloodwork Friday 9:15"
        />
        <div className="health-tool-actions">
          <button type="button" className="btn btn-primary btn-sm" onClick={saveNote}>
            Save note
          </button>
          {savedFlash ? (
            <span className="health-saved">Saved on this browser ✓</span>
          ) : null}
        </div>
      </article>
    </div>
  );
}
