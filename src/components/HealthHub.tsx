"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { PocketNoteCard } from "@/components/PocketNoteCard";
import { MOOD_OPTIONS, stretchOfDay, tipOfDay } from "@/lib/healthResources";
import {
  allMoves,
  emptyStore,
  ensureToday,
  heatNudge,
  loadStore,
  moodById,
  moodStreak,
  moveMinutes,
  newCustomMove,
  patchToday,
  saveStore,
  setWaterCount,
  stepsGoalStreak,
  stepsMiles,
  todayKeyFlorida,
  waterGoalStreak,
  waterOz,
  weekDays,
  weekSummary,
  type WellnessStore,
} from "@/lib/healthCheckin";

const STEP_GOALS = [3000, 4000, 5000, 6000, 8000, 10000, 12000];
const WATER_GOALS = [6, 8, 10, 12];

function pct(done: number, goal: number) {
  return Math.min(100, Math.round((done / Math.max(goal, 1)) * 100));
}

function streakLabel(n: number, noun: string) {
  if (n < 2) return null;
  return `${n}-day ${noun} streak`;
}

export function HealthHub() {
  const [store, setStore] = useState<WellnessStore>(() => ensureToday(emptyStore()));
  const [note, setNote] = useState("");
  const [savedFlash, setSavedFlash] = useState<string | null>(null);
  const [moodDraft, setMoodDraft] = useState("");
  const [stepsDraft, setStepsDraft] = useState("");
  const [winLabel, setWinLabel] = useState("");
  const [winMin, setWinMin] = useState("5");

  const tip = useMemo(() => tipOfDay(), []);
  const stretch = useMemo(() => stretchOfDay(), []);

  const apply = useCallback((fn: (prev: WellnessStore) => WellnessStore) => {
    setStore((prev) => {
      const next = ensureToday(fn(prev));
      saveStore(next);
      return next;
    });
  }, []);

  useEffect(() => {
    const initial = ensureToday(loadStore());
    saveStore(initial);
    setStore(initial);
    setNote(initial.note || "");
    const todayLog = initial.days[todayKeyFlorida()];
    setMoodDraft(todayLog?.moodNote || "");
  }, []);

  useEffect(() => {
    const tick = () => {
      setStore((prev) => {
        const next = ensureToday(prev);
        if (next === prev) return prev;
        saveStore(next);
        return next;
      });
    };
    const onVis = () => {
      if (document.visibilityState === "visible") tick();
    };
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("focus", tick);
    const id = window.setInterval(tick, 60_000);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("focus", tick);
      window.clearInterval(id);
    };
  }, []);

  const updateDay = useCallback((patch: Parameters<typeof patchToday>[1]) => {
    setStore((prev) => {
      const next = patchToday(prev, patch);
      saveStore(next);
      return next;
    });
  }, []);

  const data = store;
  const today = todayKeyFlorida();
  const day = data.days[today] ?? ensureToday(data).days[today];
  if (!day) {
    return <div className="empty-state">Loading your wellness tools…</div>;
  }

  const stepsPct = pct(day.stepsDone, day.stepsGoal);
  const waterPct = pct(day.water, day.waterGoal);
  const mood = moodById(day.mood);
  const week = weekDays(data, today);
  const summary = weekSummary(data, today);
  const moves = allMoves(data.customMoves);
  const winMinTotal = moveMinutes(day.moves, data.customMoves);
  const heat = heatNudge(day.water, day.waterGoal);
  const lastGlass = [...day.waterTimes].reverse().find((t) => t);
  const moodStreakN = moodStreak(data, today);
  const waterStreakN = waterGoalStreak(data, today);
  const stepsStreakN = stepsGoalStreak(data, today);
  const stepGoalOptions = STEP_GOALS.includes(day.stepsGoal)
    ? STEP_GOALS
    : [...STEP_GOALS, day.stepsGoal].sort((a, b) => a - b);

  function setWater(next: number) {
    apply((prev) => setWaterCount(prev, next));
  }

  function toggleMood(id: string) {
    const nextMood = day.mood === id ? undefined : id;
    updateDay({
      mood: nextMood,
      moodNote: nextMood ? (moodDraft.trim().slice(0, 80) || undefined) : undefined,
    });
  }

  function toggleMove(id: string) {
    const has = day.moves.includes(id);
    updateDay({
      moves: has ? day.moves.filter((m) => m !== id) : [...day.moves, id],
    });
  }

  function saveNote() {
    const text = note.trim().slice(0, 800);
    apply((prev) => ({ ...prev, note: text }));
    setSavedFlash("Saved on this browser ✓");
    window.setTimeout(() => setSavedFlash(null), 2000);
  }

  function addCustomWin() {
    const label = winLabel.trim();
    if (!label) return;
    const minutes = Number(winMin) || 5;
    const move = newCustomMove(label, minutes);
    if (!move.label) return;
    apply((prev) => {
      const todayKey = todayKeyFlorida();
      const current = prev.days[todayKey];
      const next: WellnessStore = {
        ...prev,
        customMoves: [...prev.customMoves, move].slice(0, 8),
      };
      return patchToday(next, {
        moves: [...(current?.moves || []), move.id],
      });
    });
    setWinLabel("");
    setWinMin("5");
  }

  function removeCustomWin(id: string) {
    apply((prev) => {
      const todayKey = todayKeyFlorida();
      const current = prev.days[todayKey];
      const patched = current
        ? patchToday(prev, { moves: current.moves.filter((m) => m !== id) })
        : prev;
      return {
        ...patched,
        customMoves: prev.customMoves.filter((m) => m.id !== id),
      };
    });
  }

  function applyExactSteps() {
    const n = Math.round(Number(stepsDraft));
    if (!Number.isFinite(n) || n < 0) return;
    updateDay({ stepsDone: Math.min(80000, n) });
    setStepsDraft("");
  }

  return (
    <div className="health-hub">
      <div className="section-head">
        <div>
          <h2>Wellness tools (on this device)</h2>
          <p>
            A light daily check-in stored only in your browser — no account, no
            lecture. Today resets at midnight Florida time; the last four weeks
            stay here so you can see the pattern.
          </p>
        </div>
      </div>

      <div className="health-tools-grid">
        <article className="about-panel health-tool-card">
          <div className="health-tool-head">
            <span className="health-tool-emoji" aria-hidden>
              🌤️
            </span>
            <div>
              <h3>How are you feeling?</h3>
              <p className="health-muted">
                Tap once — honesty counts more than polish. Tap again to clear.
              </p>
            </div>
          </div>
          <div className="health-mood-row" role="group" aria-label="Today’s mood">
            {MOOD_OPTIONS.map((m) => (
              <button
                key={m.id}
                type="button"
                className={`health-mood-btn${day.mood === m.id ? " is-on" : ""}`}
                onClick={() => toggleMood(m.id)}
                aria-pressed={day.mood === m.id}
              >
                <span aria-hidden>{m.emoji}</span>
                {m.label}
              </button>
            ))}
          </div>
          {mood ? (
            <>
              <p className="health-tool-hint">{mood.hint}</p>
              <label className="health-goal-label" htmlFor="mood-note">
                Optional note
              </label>
              <input
                id="mood-note"
                className="health-full-input"
                maxLength={80}
                value={moodDraft}
                onChange={(e) => setMoodDraft(e.target.value.slice(0, 80))}
                onBlur={() =>
                  updateDay({ moodNote: moodDraft.trim().slice(0, 80) || undefined })
                }
                placeholder="e.g. slept well · pickleball later"
              />
            </>
          ) : null}
          {streakLabel(moodStreakN, "check-in") ? (
            <p className="health-streak">{streakLabel(moodStreakN, "check-in")}</p>
          ) : null}
          <WeekStrip
            label="Mood this week"
            days={week}
            mark={(log) => moodById(log?.mood)?.emoji || "·"}
          />
        </article>

        <article className="about-panel health-tool-card">
          <div className="health-tool-head">
            <span className="health-tool-emoji" aria-hidden>
              💧
            </span>
            <div>
              <h3>Hydration</h3>
              <p className="health-muted">
                {day.water} of {day.waterGoal} glasses · {waterOz(day.water)} oz ·
                Florida tax included
              </p>
            </div>
          </div>
          <div
            className="health-meter"
            role="meter"
            aria-label="Glasses of water"
            aria-valuemin={0}
            aria-valuemax={day.waterGoal}
            aria-valuenow={day.water}
          >
            <div className="health-meter-bar" style={{ width: `${waterPct}%` }} />
          </div>
          <div className="health-glass-row" role="group" aria-label="Tap a glass">
            {Array.from({ length: day.waterGoal }, (_, i) => {
              const filled = i < day.water;
              return (
                <button
                  key={`glass-${i}`}
                  type="button"
                  className={`health-glass${filled ? " is-full" : ""}`}
                  onClick={() => {
                    const target = i + 1;
                    setWater(day.water === target ? target - 1 : target);
                  }}
                  aria-pressed={filled}
                  aria-label={`Glass ${i + 1}${filled ? ", filled" : ", empty"}`}
                >
                  {filled ? "💧" : "○"}
                </button>
              );
            })}
          </div>
          <div className="health-tool-actions">
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => setWater(day.water - 1)}
            >
              − Glass
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => setWater(day.water + 1)}
            >
              + Glass
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => setWater(0)}
            >
              Reset
            </button>
          </div>
          <label className="health-goal-label" htmlFor="water-goal">
            Daily glasses
          </label>
          <select
            id="water-goal"
            className="health-select"
            value={day.waterGoal}
            onChange={(e) => updateDay({ waterGoal: Number(e.target.value) })}
          >
            {WATER_GOALS.map((n) => (
              <option key={n} value={n}>
                {n} glasses ({waterOz(n)} oz)
              </option>
            ))}
          </select>
          {day.water >= day.waterGoal && day.waterGoal > 0 ? (
            <p className="health-streak">Water goal in the books. Nice work.</p>
          ) : heat ? (
            <p className="health-tool-hint">{heat}</p>
          ) : lastGlass ? (
            <p className="health-muted">Last glass around {lastGlass} Florida time.</p>
          ) : null}
          {streakLabel(waterStreakN, "water-goal") ? (
            <p className="health-streak">{streakLabel(waterStreakN, "water-goal")}</p>
          ) : null}
          <WeekBars
            label="Water this week"
            days={week}
            value={(log) => (log ? pct(log.water, log.waterGoal) : 0)}
            title={(log) =>
              log ? `${log.water}/${log.waterGoal} glasses` : "No log"
            }
          />
        </article>

        <article className="about-panel health-tool-card">
          <div className="health-tool-head">
            <span className="health-tool-emoji" aria-hidden>
              👟
            </span>
            <div>
              <h3>Steps goal</h3>
              <p className="health-muted">
                {day.stepsDone.toLocaleString()} / {day.stepsGoal.toLocaleString()}{" "}
                ({stepsPct}%)
                {day.stepsDone > 0
                  ? ` · about ${stepsMiles(day.stepsDone)} mi`
                  : ""}
              </p>
            </div>
          </div>
          <div
            className="health-meter health-meter-steps"
            role="meter"
            aria-label="Steps toward today’s goal"
            aria-valuemin={0}
            aria-valuemax={day.stepsGoal}
            aria-valuenow={day.stepsDone}
          >
            <div className="health-meter-bar" style={{ width: `${stepsPct}%` }} />
          </div>
          <div className="health-tool-actions">
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() =>
                updateDay({ stepsDone: Math.max(0, day.stepsDone - 500) })
              }
            >
              −500
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => updateDay({ stepsDone: day.stepsDone + 250 })}
            >
              +250
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => updateDay({ stepsDone: day.stepsDone + 500 })}
            >
              +500
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => updateDay({ stepsDone: day.stepsDone + 1000 })}
            >
              +1k
            </button>
          </div>
          <label className="health-goal-label" htmlFor="steps-exact">
            Set exact steps
          </label>
          <div className="health-inline-add">
            <input
              id="steps-exact"
              className="health-full-input"
              type="number"
              min={0}
              inputMode="numeric"
              placeholder={day.stepsDone ? String(day.stepsDone) : "e.g. 4320"}
              value={stepsDraft}
              onChange={(e) => setStepsDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") applyExactSteps();
              }}
            />
            <button type="button" className="btn btn-ghost btn-sm" onClick={applyExactSteps}>
              Set
            </button>
          </div>
          <label className="health-goal-label" htmlFor="steps-goal">
            Daily goal
          </label>
          <select
            id="steps-goal"
            className="health-select"
            value={day.stepsGoal}
            onChange={(e) => updateDay({ stepsGoal: Number(e.target.value) })}
          >
            {stepGoalOptions.map((n) => (
              <option key={n} value={n}>
                {n.toLocaleString()} steps
              </option>
            ))}
          </select>
          {stepsPct >= 100 ? (
            <p className="health-streak">
              Goal reached — that’s about {stepsMiles(day.stepsDone)} miles of
              villager motion.
            </p>
          ) : streakLabel(stepsStreakN, "steps") ? (
            <p className="health-streak">{streakLabel(stepsStreakN, "steps")}</p>
          ) : summary.stepsAvg > 0 ? (
            <p className="health-muted">
              7-day average: {summary.stepsAvg.toLocaleString()} steps
            </p>
          ) : null}
          <WeekBars
            label="Steps this week"
            days={week}
            value={(log) => (log ? pct(log.stepsDone, log.stepsGoal) : 0)}
            title={(log) =>
              log ? `${log.stepsDone.toLocaleString()} steps` : "No log"
            }
          />
        </article>

        <article className="about-panel health-tool-card health-tool-wide">
          <div className="health-tool-head">
            <span className="health-tool-emoji" aria-hidden>
              ✅
            </span>
            <div>
              <h3>Tiny wins checklist</h3>
              <p className="health-muted">
                {day.moves.length} of {moves.length} today
                {winMinTotal ? ` · ~${winMinTotal} min` : ""} — no gold stars
                required (but we&apos;ll imagine them).
              </p>
            </div>
          </div>
          <ul className="health-move-list">
            {moves.map((m) => {
              const on = day.moves.includes(m.id);
              return (
                <li key={m.id} className={m.custom ? "health-move-custom" : undefined}>
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
                  {m.custom ? (
                    <button
                      type="button"
                      className="health-move-remove"
                      onClick={() => removeCustomWin(m.id)}
                      aria-label={`Remove ${m.label}`}
                    >
                      ×
                    </button>
                  ) : null}
                </li>
              );
            })}
          </ul>
          <label className="health-goal-label" htmlFor="custom-win">
            Add your own win
          </label>
          <div className="health-inline-add">
            <input
              id="custom-win"
              className="health-full-input"
              maxLength={48}
              value={winLabel}
              onChange={(e) => setWinLabel(e.target.value.slice(0, 48))}
              onKeyDown={(e) => {
                if (e.key === "Enter") addCustomWin();
              }}
              placeholder="e.g. Morning rec swim"
            />
            <input
              className="health-min-input"
              type="number"
              min={1}
              max={180}
              inputMode="numeric"
              aria-label="Minutes"
              value={winMin}
              onChange={(e) => setWinMin(e.target.value)}
            />
            <button type="button" className="btn btn-ghost btn-sm" onClick={addCustomWin}>
              Add
            </button>
          </div>
        </article>
      </div>

      <article className="about-panel health-week-card">
        <h3>This week on this device</h3>
        <p className="health-muted">
          Rolling seven Florida days. Nothing leaves this browser.
        </p>
        <div className="health-week-stats">
          <div>
            <strong>
              {summary.moodDays}
              <span>/7</span>
            </strong>
            <span>Mood check-ins</span>
          </div>
          <div>
            <strong>
              {summary.waterHits}
              <span>/7</span>
            </strong>
            <span>Water goals hit</span>
          </div>
          <div>
            <strong>{summary.stepsAvg.toLocaleString()}</strong>
            <span>Avg steps (logged days)</span>
          </div>
          <div>
            <strong>
              {summary.wins}
              {summary.winMinutes ? <span> · {summary.winMinutes}m</span> : null}
            </strong>
            <span>Tiny wins</span>
          </div>
        </div>
      </article>

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
          <div className="health-tool-actions" style={{ marginTop: "0.7rem" }}>
            <button
              type="button"
              className={`btn btn-sm${day.moves.includes("stretch") ? " btn-primary" : " btn-ghost"}`}
              onClick={() => toggleMove("stretch")}
              aria-pressed={day.moves.includes("stretch")}
            >
              {day.moves.includes("stretch")
                ? "Stretch checked off ✓"
                : "I did this stretch"}
            </button>
          </div>
        </article>
      </div>

      <PocketNoteCard
        heading="Pocket note (optional)"
        hint="Med reminder, appointment, or “call the dermatologist” — stays on this device and does not reset at midnight."
        placeholder="e.g. Refill BP med Thursday · bloodwork Friday 9:15"
        value={note}
        maxLength={800}
        onChange={setNote}
        onSave={saveNote}
        savedLabel={savedFlash}
      />
    </div>
  );
}

function WeekStrip({
  label,
  days,
  mark,
}: {
  label: string;
  days: ReturnType<typeof weekDays>;
  mark: (log: (typeof days)[number]["log"]) => string;
}) {
  return (
    <ol className="health-week-strip" aria-label={label}>
      {days.map((d) => (
        <li key={d.key} className={d.isToday ? "is-today" : undefined}>
          <span className="health-week-dow">{d.dow}</span>
          <span className="health-week-mark" aria-hidden>
            {mark(d.log)}
          </span>
        </li>
      ))}
    </ol>
  );
}

function WeekBars({
  label,
  days,
  value,
  title,
}: {
  label: string;
  days: ReturnType<typeof weekDays>;
  value: (log: (typeof days)[number]["log"]) => number;
  title: (log: (typeof days)[number]["log"]) => string;
}) {
  return (
    <ol className="health-week-bars" aria-label={label}>
      {days.map((d) => {
        const v = Math.max(0, Math.min(100, value(d.log)));
        return (
          <li key={d.key} className={d.isToday ? "is-today" : undefined} title={title(d.log)}>
            <span className="health-week-bar-track" aria-hidden>
              <span className="health-week-bar-fill" style={{ height: `${Math.max(v, v > 0 ? 12 : 0)}%` }} />
            </span>
            <span className="health-week-dow">{d.dow.slice(0, 2)}</span>
          </li>
        );
      })}
    </ol>
  );
}
