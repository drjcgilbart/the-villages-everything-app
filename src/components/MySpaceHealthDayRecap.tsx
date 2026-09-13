"use client";

import { useEffect, useMemo, useState } from "react";
import { emptyBoards, type GymBoard, type GymMediaItem } from "@/lib/memberBoardModel";
import {
  buildDaySnapshot,
  datesWithLogs,
  prettyDate,
  sanitizeDayRecaps,
  snapshotHasLogs,
  type DayRecap,
  type DaySnapshot,
} from "@/lib/healthDayRecap";
import { readUseGrok, runHealthDayRecap, writeUseGrok } from "@/lib/runHealthDayRecap";
import { useMemberBoard } from "@/components/useMemberBoard";
import type { HealthLike } from "@/lib/healthDayRecap";
import { GymWorkoutMediaStrip } from "@/components/GymWorkoutMedia";



function monthStart(date: string) {
  return `${date.slice(0, 7)}-01`;
}

function addMonths(date: string, delta: number) {
  const [y, m] = date.split("-").map(Number);
  const d = new Date(Date.UTC(y, m - 1 + delta, 1));
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-01`;
}

function daysInMonth(start: string) {
  const [y, m] = start.split("-").map(Number);
  const count = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const firstDow = new Date(Date.UTC(y, m - 1, 1)).getUTCDay();
  const cells: (string | null)[] = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= count; d++) {
    cells.push(`${start.slice(0, 7)}-${String(d).padStart(2, "0")}`);
  }
  return cells;
}

function recapStreak(recaps: DayRecap[], today: string) {
  const set = new Set(recaps.map((r) => r.date));
  let n = 0;
  let cursor = today;
  if (!set.has(cursor)) {
    const y = new Date(`${today}T12:00:00`);
    y.setDate(y.getDate() - 1);
    cursor = y.toISOString().slice(0, 10);
  }
  while (set.has(cursor) && n < 400) {
    n += 1;
    const d = new Date(`${cursor}T12:00:00`);
    d.setDate(d.getDate() - 1);
    cursor = d.toISOString().slice(0, 10);
  }
  return n;
}



export function MySpaceHealthDayRecap({
  health,
  recaps: recapsIn,
  onSaveRecaps,
  today,
}: {
  health: HealthLike;
  recaps: DayRecap[];
  onSaveRecaps: (next: DayRecap[]) => void;
  today: string;
}) {
  const gymEmpty = emptyBoards().gym;
  const { value: gym, ready: gymReady } = useMemberBoard<GymBoard>("gym", gymEmpty, true);
  const recaps = useMemo(() => sanitizeDayRecaps(recapsIn), [recapsIn]);
  const [selected, setSelected] = useState(today);
  const [month, setMonth] = useState(monthStart(today));
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [useGrok, setUseGrok] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/members/me", { credentials: "include", cache: "no-store" })
      .then((res) => res.json())
      .then((json: { isAdmin?: boolean }) => {
        if (cancelled) return;
        const admin = json.isAdmin === true;
        setIsAdmin(admin);
        setUseGrok(admin ? readUseGrok() : false);
      })
      .catch(() => {
        if (!cancelled) {
          setIsAdmin(false);
          setUseGrok(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const workouts = gym.workouts || [];
  const snap = useMemo(
    () => buildDaySnapshot(selected, health, workouts),
    [selected, health, workouts]
  );
  const loggedDates = useMemo(
    () => datesWithLogs(health, workouts),
    [health, workouts]
  );
  const recapByDate = useMemo(() => {
    const m = new Map<string, DayRecap>();
    for (const r of recaps) m.set(r.date, r);
    return m;
  }, [recaps]);
  const current = recapByDate.get(selected) || null;
  const streak = recapStreak(recaps, today);
  const week = useMemo(() => {
    const days: string[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(`${today}T12:00:00`);
      d.setDate(d.getDate() - i);
      days.push(d.toISOString().slice(0, 10));
    }
    return days;
  }, [today]);

  async function generate(opts?: { auto?: boolean; date?: string }) {
    const date = opts?.date || selected;
    if (!gymReady && !opts?.auto) {
      setErr("Still loading gym workouts and photos — tap Rewrite again in a moment.");
      return;
    }
    const daySnap = buildDaySnapshot(date, health, workouts);
    if (opts?.auto && !snapshotHasLogs(daySnap)) return;
    setBusy(true);
    setErr(null);
    setNote(opts?.auto ? "Writing yesterday’s recap…" : "Writing your day…");
    try {
      const { recap, source, grokConfigured, grokError } = await runHealthDayRecap({
        date,
        health,
        workouts,
        auto: !!opts?.auto,
        favorite: recapByDate.get(date)?.favorite || false,
        useGrok: isAdmin && useGrok,
      });
      onSaveRecaps(sanitizeDayRecaps([recap, ...recaps.filter((r) => r.date !== date)]));
      setSelected(date);
      if (useGrok && source !== "grok") {
        setNote(
          grokConfigured
            ? `Saved the standard recap — Grok didn’t finish (${grokError || "no reply"}). You were not charged for a completed write-up.`
            : "Saved the standard recap. To turn Grok on, add XAI_API_KEY in Vercel → Settings → Environment Variables (Production), then Redeploy."
        );
      } else if (source === "grok") {
        setNote("Grok wrote this recap. Workout photos are in the story below and in the PDF.");
      } else {
        setNote("Standard recap saved. Workout photos are in the story below and in the PDF.");
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not write recap");
    } finally {
      setBusy(false);
    }
  }

  function toggleFavorite() {
    if (!current) return;
    onSaveRecaps(
      recaps.map((r) =>
        r.date === current.date ? { ...r, favorite: !r.favorite } : r
      )
    );
  }

  function removeRecap() {
    if (!current) return;
    if (!window.confirm("Remove this day's recap PDF from your account?")) return;
    onSaveRecaps(recaps.filter((r) => r.date !== current.date));
  }

  const cells = daysInMonth(month);
  const monthLabel = new Date(`${month}T12:00:00`).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="about-panel ms-module">
      <p className="ms-module-lead">My Day — one story of how you lived it</p>
      <p className="panel-hint">
        When a day ends, we gather Overview sliders (weight, water, steps, protein, sleep), plus
        meds, meals, exercise, gym, photos, and journal into one optimistic recap PDF. Write it
        early and we still pull the current slider values. Open any date on the calendar. Not
        medical advice.
      </p>

      <div className="ms-h-toolbar">
        <span className="ms-h-pill">
          {streak ? `${streak}-day recap streak` : "Start a recap streak"}
        </span>
        <span className="panel-hint">{recaps.length} saved PDF{recaps.length === 1 ? "" : "s"}</span>
      </div>

      <div className="ms-day-week" aria-label="Last 7 days">
        {week.map((d) => {
          const rec = recapByDate.has(d);
          const logged = loggedDates.has(d);
          const dow = new Date(`${d}T12:00:00`).getDay();
          return (
            <button
              key={d}
              type="button"
              className={`ms-day-week-cell dow-${dow}${selected === d ? " is-on" : ""}${rec ? " has-recap" : ""}${logged && !rec ? " has-log" : ""}`}
              onClick={() => {
                setSelected(d);
                setMonth(monthStart(d));
              }}
            >
              <span>
                {new Date(`${d}T12:00:00`).toLocaleDateString("en-US", { weekday: "narrow" })}
              </span>
              <strong>{Number(d.slice(8))}</strong>
              <i>{rec ? "PDF" : logged ? "log" : ""}</i>
            </button>
          );
        })}
      </div>

      <div className="ms-day-cal">
        <div className="ms-day-cal-nav">
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => setMonth(addMonths(month, -1))}
          >
            ←
          </button>
          <strong>{monthLabel}</strong>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => setMonth(addMonths(month, 1))}
          >
            →
          </button>
        </div>
        <div className="ms-day-cal-dow">
          {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
            <span key={`${d}-${i}`}>{d}</span>
          ))}
        </div>
        <div className="ms-day-cal-grid">
          {cells.map((d, i) =>
            d ? (
              <button
                key={d}
                type="button"
                className={`ms-day-cal-cell${i % 7 === 0 || i % 7 === 6 ? " is-weekend" : ""}${
                  selected === d ? " is-on" : ""
                }${recapByDate.has(d) ? " has-recap" : ""}${
                  loggedDates.has(d) && !recapByDate.has(d) ? " has-log" : ""
                }${d === today ? " is-today" : ""}`}
                onClick={() => setSelected(d)}
              >
                {Number(d.slice(8))}
              </button>
            ) : (
              <span key={`e-${i}`} className="ms-day-cal-empty" />
            )
          )}
        </div>
        <p className="panel-hint">
          Green = saved recap · blue = something logged · gold ring = today · weekends are warmer.
        </p>
      </div>

      <div className="hero-actions" style={{ margin: "0.75rem 0" }}>
        <button
          type="button"
          className={`btn btn-sm ${isAdmin && useGrok ? "btn-primary" : "btn-ghost"}`}
          aria-pressed={isAdmin && useGrok}
          disabled={!isAdmin}
          title={
            isAdmin
              ? "Only you can turn Grok on or off. Neighbors always get the standard recap."
              : "Grok write-up is an admin control. Your recaps use the standard write-up."
          }
          onClick={() => {
            if (!isAdmin) return;
            const next = !useGrok;
            setUseGrok(next);
            writeUseGrok(next);
            setNote(
              next
                ? "Grok write-up is ON for your recaps only. Neighbors are not charged."
                : "Grok write-up is OFF. Recaps use the standard write-up — no Grok charge."
            );
          }}
        >
          {isAdmin && useGrok ? "Grok write-up: On" : "Grok write-up: Off"}
        </button>
        <button
          type="button"
          className="btn btn-primary"
          disabled={busy}
          onClick={() => void generate({ date: selected })}
        >
          {current
            ? selected === today
              ? "Rewrite today’s recap"
              : "Rewrite this day’s recap"
            : selected === today
              ? "Write today’s recap now"
              : "Write this day’s recap"}
        </button>
        {current?.pdfUrl ? (
          <>
            <a className="btn btn-ghost" href={current.pdfUrl} target="_blank" rel="noreferrer">
              Open PDF
            </a>
            <a className="btn btn-ghost" href={current.pdfUrl} download={`my-day-${selected}.pdf`}>
              Download
            </a>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                const w = window.open(current.pdfUrl, "_blank");
                w?.addEventListener("load", () => w.print());
              }}
            >
              Print
            </button>
          </>
        ) : null}
      </div>
      {busy ? <p className="panel-hint">{note || "Working…"}</p> : null}
      {!busy && note ? <p className="panel-hint">{note}</p> : null}
      {err ? <p className="pf-form-error">{err}</p> : null}

      <h3>{prettyDate(selected)}</h3>
      <DayFacts snap={snap} />
      {!snapshotHasLogs(snap) && !current ? (
        <p className="panel-hint">
          You can still write today’s recap now — it will snapshot the current Overview sliders,
          even if some are still at zero.
        </p>
      ) : null}

      {current ? (
        <article className="ms-day-story">
          <div className="ms-day-story-head">
            <div>
              <p className="panel-hint">
                Saved {current.generatedAt ? new Date(current.generatedAt).toLocaleString() : ""}
                {current.auto ? " · auto after the day ended" : ""}
                {current.mood ? ` · mood: ${current.mood}` : ""}
              </p>
              <h4>{current.title}</h4>
              {current.headline ? <p className="ms-day-kicker">{current.headline}</p> : null}
            </div>
            <div className="hero-actions">
              <button type="button" className="btn btn-ghost btn-sm" onClick={toggleFavorite}>
                {current.favorite ? "★ Favorite" : "☆ Favorite"}
              </button>
              <button type="button" className="btn btn-ghost btn-sm" onClick={removeRecap}>
                Delete recap
              </button>
            </div>
          </div>
          {current.article.split(/\n+/).map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          <RecapPhotos current={current} snap={snap} />
          {current.bestMoment ? (
            <blockquote className="ms-day-best">
              <strong>Best moment.</strong> {current.bestMoment}
            </blockquote>
          ) : null}
          {current.highlights.length ? (
            <div className="ms-day-cols">
              <div>
                <h4>What went well</h4>
                <ul>
                  {current.highlights.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4>Grow from here</h4>
                <ul>
                  {current.improve.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : null}
          {current.closer ? <p className="ms-day-closer">{current.closer}</p> : null}
        </article>
      ) : snapshotHasLogs(snap) ? (
        <p className="panel-hint">
          This day has notes but no PDF yet. Tap <strong>Write this day’s recap</strong> to snapshot
          the current Overview sliders. Yesterday writes itself the next time you open Health.
        </p>
      ) : null}

      {recaps.filter((r) => r.favorite).length ? (
        <>
          <h3>Favorites</h3>
          <ul className="ms-simple-list">
            {recaps
              .filter((r) => r.favorite)
              .map((r) => (
                <li key={r.id}>
                  <button
                    type="button"
                    className="text-link"
                    onClick={() => {
                      setSelected(r.date);
                      setMonth(monthStart(r.date));
                    }}
                  >
                    {prettyDate(r.date)} — {r.title}
                  </button>
                </li>
              ))}
          </ul>
        </>
      ) : null}
    </div>
  );
}

function recapMedia(current: DayRecap | null, snap: DaySnapshot): GymMediaItem[] {
  const live = snap.gyms.flatMap((g) =>
    (g.media || []).filter((m) => m.kind === "photo" || m.kind === "video")
  );
  if (live.length) return live;
  return (current?.photos || []).map((p, i) => ({
    id: `recap-photo-${i}`,
    kind: "photo" as const,
    storage: p.localId ? ("phone" as const) : ("account" as const),
    name: p.caption,
    url: p.url,
    localId: p.localId,
    bytes: 0,
  }));
}

function RecapPhotos({ current, snap }: { current: DayRecap; snap: DaySnapshot }) {
  const items = recapMedia(current, snap);
  if (!items.length) return null;
  return (
    <div className="ms-day-photos">
      <h4>Photos from the day</h4>
      <GymWorkoutMediaStrip items={items} />
    </div>
  );
}

function DayFacts({ snap }: { snap: DaySnapshot }) {
  const gymPhotos = snap.gyms.reduce(
    (n, g) => n + (g.media || []).filter((m) => m.kind === "photo").length,
    0
  );
  const items: string[] = [];
  if (snap.weight != null) items.push(`Weight ${snap.weight} lbs`);
  items.push(`${snap.habits.waterOz} oz water`);
  items.push(`${snap.habits.steps.toLocaleString()} steps`);
  items.push(`${snap.habits.proteinG} g protein`);
  items.push(`${snap.habits.sleepHours || snap.sleep?.hours || 0}h sleep`);
  if (snap.medsTaken.length) items.push(`${snap.medsTaken.length} meds taken`);
  if (snap.meals.length) items.push(`${snap.meals.length} meals`);
  if (snap.exercises.length) items.push(`${snap.exercises.length} exercise`);
  if (snap.gyms.length) items.push(`${snap.gyms.length} gym`);
  if (gymPhotos) items.push(`${gymPhotos} workout photo${gymPhotos === 1 ? "" : "s"}`);
  if (snap.journals.length) items.push("Journal");
  if (snap.photos.length) items.push(`${snap.photos.length} photo note${snap.photos.length === 1 ? "" : "s"}`);
  return (
    <p className="panel-hint">
      Overview + log: {items.join(" · ")}
    </p>
  );
}
