"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  emptyBoards,
  type CalTask,
  type CalendarBoard,
  type EntertainmentBoard,
  type GolfLogBoard,
  type PickleballLogBoard,
} from "@/lib/memberBoardModel";
import { useMemberBoard } from "@/components/useMemberBoard";
import type { CalendarEvent } from "@/lib/calendarEventsTypes";
import {
  CAL_DAYS,
  CAL_HOURS,
  CAL_OFFICIAL,
  clubDates,
  datesInRange,
  fmtCountdown,
  formatTime,
  hourOf,
  shiftAnchor,
  shortDate,
  todayKey,
  viewRange,
  viewTitle,
  weekdayOf,
  type CalView,
  type OverlayEvent,
} from "@/lib/calendarCatalog";

function uid(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 5)}`;
}

function emptyTask(date: string): Omit<CalTask, "id"> {
  return {
    title: "",
    notes: "",
    startDate: date,
    startTime: "",
    endDate: "",
    endTime: "",
    timerMinutes: null,
    timerEndsAt: null,
    timerPausedMs: null,
    alarmEnabled: false,
    done: false,
  };
}

function kindLabel(kind: OverlayEvent["kind"]) {
  return (
    {
      task: "Task",
      show: "Show",
      club: "Rec club",
      watch: "Watch later",
      square: "Town square",
      golf: "Golf",
      pickle: "Pickleball",
      maint: "Maintenance",
    } as const
  )[kind];
}

function eventOnDate(ev: OverlayEvent, date: string) {
  return ev.date === date;
}

function remainingMs(t: CalTask, now: number) {
  if (t.timerEndsAt) return Math.max(0, t.timerEndsAt - now);
  if (t.timerPausedMs) return Math.max(0, t.timerPausedMs);
  if (t.timerMinutes) return t.timerMinutes * 60 * 1000;
  return null;
}

/**
 * Personal calendar — day/3-day/week/month, tasks with timers,
 * plus shows, rec clubs, watch-later, tee times, and square nights.
 */
export function MySpaceCalendarBoard() {
  const empty = emptyBoards().calendar;
  const { value, save, ready, saving, error } = useMemberBoard<CalendarBoard>(
    "calendar",
    empty,
    true
  );
  const ent = useMemberBoard<EntertainmentBoard>(
    "entertainment",
    emptyBoards().entertainment,
    true
  );
  const golf = useMemberBoard<GolfLogBoard>("golfLog", emptyBoards().golfLog, true);
  const pickle = useMemberBoard<PickleballLogBoard>(
    "pickleballLog",
    emptyBoards().pickleballLog,
    true
  );
  const [view, setView] = useState<CalView>("week");
  const [anchor, setAnchor] = useState(todayKey());
  const [form, setForm] = useState(emptyTask(todayKey()));
  const [editId, setEditId] = useState<string | null>(null);
  const [detail, setDetail] = useState<OverlayEvent | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [publicEvents, setPublicEvents] = useState<CalendarEvent[]>([]);

  const today = todayKey();
  const range = viewRange(anchor, view);
  const days = datesInRange(range.start, range.end);

  useEffect(() => {
    const tick = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(tick);
  }, []);

  useEffect(() => {
    const [y, m] = anchor.split("-").map(Number);
    let cancelled = false;
    fetch(`/api/calendar/events?year=${y}&month=${m}`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (Array.isArray(data.events)) setPublicEvents(data.events as CalendarEvent[]);
      })
      .catch(() => {
        if (!cancelled) setPublicEvents([]);
      });
    return () => {
      cancelled = true;
    };
  }, [anchor]);

  const overlay = useMemo(() => {
    const out: OverlayEvent[] = [];
    for (const t of value.tasks) {
      const start = t.startDate || today;
      const end = t.endDate && t.endDate >= start ? t.endDate : start;
      for (const iso of datesInRange(start, end)) {
        if (iso < range.start || iso > range.end) continue;
        out.push({
          id: `task:${t.id}:${iso}`,
          kind: "task",
          title: t.title,
          date: iso,
          time: t.startTime,
          endTime: t.endTime,
          notes: t.notes,
          done: t.done,
        });
      }
    }
    if (ent.ready) {
      for (const s of ent.value.shows) {
        if (!s.date || s.date < range.start || s.date > range.end) continue;
        out.push({
          id: `show:${s.id}`,
          kind: "show",
          title: s.title,
          date: s.date,
          time: s.time,
          location: s.venue,
          notes: [s.confirmation ? `conf ${s.confirmation}` : "", s.notes].filter(Boolean).join(" · "),
        });
      }
      for (const c of ent.value.clubs) {
        for (const o of clubDates(c, range.start, range.end)) {
          out.push({
            id: `club:${c.id}:${o.date}`,
            kind: "club",
            title: c.name,
            date: o.date,
            time: o.time,
            location: c.location || c.rec,
            notes: c.notes,
          });
        }
      }
      for (const w of ent.value.watchLater) {
        if (w.done) continue;
        if (w.date && w.date >= range.start && w.date <= range.end) {
          out.push({
            id: `watch:${w.id}`,
            kind: "watch",
            title: w.title,
            date: w.date,
            time: w.time,
            location: w.where,
            notes: w.notes,
          });
        }
        for (const iso of days) {
          if (!w.days?.length) continue;
          if (!w.days.includes(CAL_DAYS[weekdayOf(iso)])) continue;
          if (w.date === iso) continue;
          out.push({
            id: `watch:${w.id}:${iso}`,
            kind: "watch",
            title: w.title,
            date: iso,
            time: w.time,
            location: w.where,
            notes: w.notes,
          });
        }
      }
      if (ent.value.tonightDate && ent.value.tonightSquare) {
        const d = ent.value.tonightDate;
        if (d >= range.start && d <= range.end) {
          out.push({
            id: `square:${d}`,
            kind: "square",
            title: `Tonight at ${ent.value.tonightSquare.replace(/-/g, " ")}`,
            date: d,
            time: "18:00",
            notes: ent.value.tonightNotes,
          });
        }
      }
    }
    if (golf.ready) {
      for (const t of golf.value.teeTimes) {
        if (!t.date || t.date < range.start || t.date > range.end) continue;
        out.push({
          id: `golf:${t.id}`,
          kind: "golf",
          title: `Tee time · ${t.course}`,
          date: t.date,
          time: t.time,
          location: t.course,
          notes: t.notes,
        });
      }
    }
    if (pickle.ready) {
      for (const m of pickle.value.matches) {
        if (!m.date || m.date < range.start || m.date > range.end) continue;
        out.push({
          id: `pickle:${m.id}`,
          kind: "pickle",
          title: `Pickleball${m.court ? ` · ${m.court}` : ""}`,
          date: m.date,
          time: "",
          location: m.court,
          notes: [m.partner && `with ${m.partner}`, m.opponent && `vs ${m.opponent}`, m.score]
            .filter(Boolean)
            .join(" · "),
        });
      }
    }
    for (const e of publicEvents) {
      if (!e.date || e.date < range.start || e.date > range.end) continue;
      out.push({
        id: `pub:${e.id}`,
        kind: "square",
        title: e.title,
        date: e.date,
        time: "",
        location: e.venue || e.location,
        notes: e.timeLabel || e.description,
      });
    }
    return out;
  }, [value.tasks, ent, golf, pickle, publicEvents, range.start, range.end, days, today]);

  const todayTasks = value.tasks.filter((t) => {
    const start = t.startDate || today;
    const end = t.endDate && t.endDate >= start ? t.endDate : start;
    return start <= today && today <= end;
  });
  const left = todayTasks.filter((t) => !t.done).length;

  function persist(tasks: CalTask[]) {
    void save({ tasks: tasks.slice(0, 80) });
  }

  function saveTask() {
    const title = form.title.trim();
    if (!title) return;
    const row: CalTask = {
      ...form,
      id: editId || uid("cal"),
      title: title.slice(0, 200),
      notes: form.notes.trim().slice(0, 500),
      timerMinutes: form.timerMinutes && form.timerMinutes > 0 ? Math.min(1440, form.timerMinutes) : null,
    };
    persist(editId ? value.tasks.map((t) => (t.id === editId ? row : t)) : [row, ...value.tasks]);
    setEditId(null);
    setForm(emptyTask(anchor));
  }

  function patchTask(id: string, patch: Partial<CalTask>) {
    persist(value.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  }

  function timerAction(t: CalTask, action: "start" | "pause" | "resume" | "reset") {
    const minutes = t.timerMinutes || 25;
    if (action === "start") {
      patchTask(t.id, { timerEndsAt: Date.now() + minutes * 60 * 1000, timerPausedMs: null, timerMinutes: minutes });
    } else if (action === "pause") {
      patchTask(t.id, {
        timerPausedMs: Math.max(0, (t.timerEndsAt || Date.now()) - Date.now()),
        timerEndsAt: null,
      });
    } else if (action === "resume") {
      const leftMs = t.timerPausedMs || minutes * 60 * 1000;
      patchTask(t.id, { timerEndsAt: Date.now() + leftMs, timerPausedMs: null });
    } else {
      patchTask(t.id, { timerEndsAt: null, timerPausedMs: null });
    }
  }

  if (!ready) return <p className="panel-hint">Loading calendar board…</p>;

  const cols = view === "month" ? 7 : days.length;

  return (
    <div className="ms-ent-board">
      <p className="ms-module-lead">
        Shows, rec clubs, watch-later nights, and tasks land here automatically. Double-click an
        item for details. Google is optional — you do not need it.
      </p>
      <p className="panel-hint">
        Public Hub calendar stays free:{" "}
        <Link href="/calendar" className="text-link">
          Calendar of Events
        </Link>
        {" · "}
        <Link href="/town-squares" className="text-link">
          Town Squares
        </Link>
      </p>
      {error ? <p className="pf-form-error">{error}</p> : null}
      {saving ? <p className="panel-hint">Saving to your account…</p> : null}

      <div className="ms-h-toolbar">
        <span className="ms-h-pill">
          {overlay.filter((e) => e.kind !== "square" || e.id.startsWith("square:")).length} on
          calendar · {left} tasks left
        </span>
        <span className="panel-hint">Local schedule · Google optional</span>
      </div>

      <div className="ms-h-quick">
        {(
          [
            ["day", "Day"],
            ["three", "3 day"],
            ["week", "Week"],
            ["month", "Month"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={`ms-h-range-btn ${view === id ? "active" : ""}`}
            onClick={() => setView(id)}
          >
            {label}
          </button>
        ))}
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => setAnchor(shiftAnchor(anchor, view, -1))}>
          ‹
        </button>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => setAnchor(today)}>
          Today
        </button>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => setAnchor(shiftAnchor(anchor, view, 1))}>
          ›
        </button>
        <strong>{viewTitle(anchor, view)}</strong>
      </div>

      {view === "month" ? (
        <div className="ms-cal-month">
          {CAL_DAYS.map((d) => (
            <div key={d} className="ms-cal-dow">
              {d}
            </div>
          ))}
          {days.map((iso) => {
            const inMonth = iso.slice(0, 7) === anchor.slice(0, 7);
            const evs = overlay.filter((e) => eventOnDate(e, iso));
            return (
              <button
                key={iso}
                type="button"
                className={`ms-cal-mcell ${inMonth ? "" : "out"} ${iso === today ? "is-today" : ""} ${iso === anchor ? "is-anchor" : ""}`}
                onClick={() => {
                  setAnchor(iso);
                  setView("day");
                }}
              >
                <em>{Number(iso.slice(8, 10))}</em>
                {evs.slice(0, 3).map((e) => (
                  <span key={e.id} className={`ms-cal-chip kind-${e.kind}`}>
                    {e.title}
                  </span>
                ))}
                {evs.length > 3 ? <span className="panel-hint">+{evs.length - 3}</span> : null}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="ms-cal-week" style={{ gridTemplateColumns: `3rem repeat(${cols}, minmax(0, 1fr))` }}>
          <div className="ms-cal-gutter" />
          {days.map((iso) => (
            <button
              key={iso}
              type="button"
              className={`ms-cal-head ${iso === today ? "is-today" : ""}`}
              onClick={() => {
                setAnchor(iso);
                if (view !== "day") setView("day");
              }}
            >
              {CAL_DAYS[weekdayOf(iso)]} {Number(iso.slice(8, 10))}
            </button>
          ))}
          <div className="ms-cal-gutter">all</div>
          {days.map((iso) => {
            const allDay = overlay.filter((e) => eventOnDate(e, iso) && !e.time);
            return (
              <div key={`ad-${iso}`} className="ms-cal-slot ms-cal-allday">
                {allDay.map((e) => (
                  <button
                    key={e.id}
                    type="button"
                    className={`ms-cal-chip kind-${e.kind}`}
                    onClick={() => setDetail(e)}
                  >
                    {e.title}
                  </button>
                ))}
              </div>
            );
          })}
          {CAL_HOURS.map((h) => (
            <div key={`row-${h}`} className="ms-cal-row" style={{ gridColumn: "1 / -1", display: "contents" }}>
              <div className="ms-cal-gutter">{h > 12 ? h - 12 : h}{h >= 12 ? "p" : "a"}</div>
              {days.map((iso) => {
                const timed = overlay.filter((e) => eventOnDate(e, iso) && hourOf(e.time) === h);
                return (
                  <div
                    key={`${iso}-${h}`}
                    className="ms-cal-slot"
                    onClick={() => {
                      setAnchor(iso);
                      setForm({
                        ...emptyTask(iso),
                        startTime: `${String(h).padStart(2, "0")}:00`,
                      });
                    }}
                  >
                    {timed.map((e) => (
                      <button
                        key={e.id}
                        type="button"
                        className={`ms-cal-chip kind-${e.kind}${e.done ? " is-done" : ""}`}
                        onClick={(ev) => {
                          ev.stopPropagation();
                          setDetail(e);
                        }}
                      >
                        {e.time ? `${formatTime(e.time)} · ` : ""}
                        {e.title}
                      </button>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}

      {detail ? (
        <div className="about-panel ms-module">
          <p className="panel-hint">{kindLabel(detail.kind).toUpperCase()}</p>
          <h4>{detail.title}</h4>
          <p>
            {shortDate(detail.date)}
            {detail.time ? ` · ${formatTime(detail.time)}` : ""}
            {detail.endTime ? `–${formatTime(detail.endTime)}` : ""}
          </p>
          {detail.location ? <p>📍 {detail.location}</p> : null}
          {detail.notes ? <p>{detail.notes}</p> : null}
          <div className="hero-actions">
            {detail.kind === "task" ? (
              <>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    const id = detail.id.split(":")[1];
                    const t = value.tasks.find((x) => x.id === id);
                    if (!t) return;
                    setEditId(t.id);
                    setForm({ ...t });
                    setDetail(null);
                  }}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => {
                    const id = detail.id.split(":")[1];
                    persist(value.tasks.filter((x) => x.id !== id));
                    setDetail(null);
                  }}
                >
                  Delete
                </button>
              </>
            ) : (
              <Link
                href="/my-space"
                className="btn btn-ghost btn-sm"
                onClick={() => setDetail(null)}
              >
                {detail.kind === "show" || detail.kind === "club" || detail.kind === "watch"
                  ? "Open Entertainment"
                  : detail.kind === "golf"
                    ? "Open Golf"
                    : detail.kind === "pickle"
                      ? "Open Pickleball"
                      : "Close"}
              </Link>
            )}
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setDetail(null)}>
              Close
            </button>
          </div>
        </div>
      ) : null}

      <div className="about-panel ms-module">
        <h4>Today’s tasks</h4>
        <p className="panel-hint">
          Add a task, then Edit to change it, set a start/end time, or run a countdown timer with an
          alarm. <span className="ms-h-pill">{left} left</span>
        </p>
        {todayTasks.length === 0 ? (
          <p className="panel-hint">No tasks for today. Add one below.</p>
        ) : (
          <ul className="ms-cal-list">
            {todayTasks.map((t) => {
              const running = !!t.timerEndsAt && t.timerEndsAt > now;
              const paused = !running && !!t.timerPausedMs;
              const leftMs = remainingMs(t, now);
              return (
                <li key={t.id}>
                  <div>
                    <label className="ms-check">
                      <input
                        type="checkbox"
                        checked={t.done}
                        onChange={() => patchTask(t.id, { done: !t.done })}
                      />
                      <strong className={t.done ? "ms-note-done" : undefined}>{t.title}</strong>
                    </label>
                    <span>
                      {[
                        t.startTime && formatTime(t.startTime),
                        t.endTime && `until ${formatTime(t.endTime)}`,
                        t.timerMinutes && `${t.timerMinutes}-min timer`,
                        t.alarmEnabled && t.startTime && "alarm at start",
                        t.notes,
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </span>
                  </div>
                  <div className="hero-actions">
                    {t.timerMinutes ? (
                      running ? (
                        <>
                          <span className="ms-h-pill">{fmtCountdown(leftMs || 0)}</span>
                          <button type="button" className="btn btn-ghost btn-sm" onClick={() => timerAction(t, "pause")}>
                            Pause
                          </button>
                          <button type="button" className="btn btn-ghost btn-sm" onClick={() => timerAction(t, "reset")}>
                            Reset
                          </button>
                        </>
                      ) : paused ? (
                        <>
                          <span className="ms-h-pill">{fmtCountdown(leftMs || 0)}</span>
                          <button type="button" className="btn btn-primary btn-sm" onClick={() => timerAction(t, "resume")}>
                            Resume
                          </button>
                          <button type="button" className="btn btn-ghost btn-sm" onClick={() => timerAction(t, "reset")}>
                            Reset
                          </button>
                        </>
                      ) : (
                        <button type="button" className="btn btn-primary btn-sm" onClick={() => timerAction(t, "start")}>
                          Start {t.timerMinutes}m
                        </button>
                      )
                    ) : null}
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => {
                        setEditId(t.id);
                        setForm({ ...t });
                      }}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => persist(value.tasks.filter((x) => x.id !== t.id))}
                    >
                      Remove
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        <form
          className="form-grid ms-module-form"
          onSubmit={(e) => {
            e.preventDefault();
            saveTask();
          }}
        >
          <div className="field">
            <label>{editId ? "Edit task" : "Add a task"}</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Pickleball at Eisenhower"
              required
            />
          </div>
          <div className="field">
            <label>Notes (optional)</label>
            <input
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Court 3 · bring water"
            />
          </div>
          <div className="field">
            <label>Start date</label>
            <input
              type="date"
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            />
          </div>
          <div className="field">
            <label>Start time</label>
            <input
              type="time"
              value={form.startTime}
              onChange={(e) => setForm({ ...form, startTime: e.target.value })}
            />
          </div>
          <div className="field">
            <label>End date</label>
            <input
              type="date"
              value={form.endDate}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
            />
          </div>
          <div className="field">
            <label>End time</label>
            <input
              type="time"
              value={form.endTime}
              onChange={(e) => setForm({ ...form, endTime: e.target.value })}
            />
          </div>
          <div className="field">
            <label>Timer (minutes)</label>
            <input
              type="number"
              min={1}
              max={1440}
              placeholder="e.g. 25"
              value={form.timerMinutes ?? ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  timerMinutes: e.target.value === "" ? null : Number(e.target.value),
                })
              }
            />
          </div>
          <label className={form.alarmEnabled ? "on" : ""}>
            <input
              type="checkbox"
              checked={form.alarmEnabled}
              onChange={(e) => setForm({ ...form, alarmEnabled: e.target.checked })}
            />
            Alarm at start time
          </label>
          <button type="submit" className="btn btn-primary btn-sm">
            {editId ? "Save task" : "Add"}
          </button>
          {editId ? (
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => {
                setEditId(null);
                setForm(emptyTask(anchor));
              }}
            >
              Cancel
            </button>
          ) : null}
        </form>
      </div>

      <div className="about-panel ms-module">
        <h4>Optional: add Google Calendar</h4>
        <p className="panel-hint">
          You do not need Google. Tasks, rec clubs, shows, and Watch later already appear on the
          calendar above. Open Google Calendar only if you also keep doctor days or family events
          there — this Hub does not sign into your Google account.
        </p>
        <div className="hero-actions">
          <a className="btn btn-ghost btn-sm" href="https://calendar.google.com/" target="_blank" rel="noopener noreferrer">
            Open Google Calendar
          </a>
          <Link href="/calendar" className="btn btn-primary btn-sm">
            Hub public calendar
          </Link>
        </div>
        <h4>Official Villages calendars</h4>
        <p className="panel-hint">
          Nightly square hours this summer (Jun 1–Sep 30) are 6:00–10:00 PM. Rec ID for District
          programs. Confirm everything on the source site before you roll over.
        </p>
        <div className="hero-actions">
          {CAL_OFFICIAL.map((l) => (
            <a key={l.href} className="btn btn-ghost btn-sm" href={l.href} target="_blank" rel="noopener noreferrer">
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
