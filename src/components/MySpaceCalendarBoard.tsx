"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type Dispatch, type SetStateAction } from "react";
import { createPortal } from "react-dom";
import {
  emptyBoards,
  type CalTask,
  type CalendarBoard,
  type EntertainmentBoard,
  type FoodBoard,
  type GolfLogBoard,
  type GymBoard,
  type MaintenanceBoard,
  type PickleballLogBoard,
} from "@/lib/memberBoardModel";
import { useMemberBoard } from "@/components/useMemberBoard";
import { extrasFromBoards } from "@/lib/plannerExtras";
import { rememberPlannerReturn } from "@/lib/plannerReturn";
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

type TaskDraft = Omit<CalTask, "id">;

function TaskEditor({
  form,
  setForm,
  editing,
  onSave,
  onCancel,
  showCancel,
  autoFocusTitle,
}: {
  form: TaskDraft;
  setForm: Dispatch<SetStateAction<TaskDraft>>;
  editing: boolean;
  onSave: () => void;
  onCancel: () => void;
  showCancel?: boolean;
  autoFocusTitle?: boolean;
}) {
  return (
    <form
      className="form-grid ms-module-form"
      onSubmit={(e) => {
        e.preventDefault();
        onSave();
      }}
    >
      <div className="field">
        <label>{editing ? "Edit task" : "Add a task"}</label>
        <input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="e.g. Pickleball at Eisenhower"
          required
          autoFocus={autoFocusTitle}
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
        {editing ? "Save task" : "Add"}
      </button>
      {editing || showCancel ? (
        <button type="button" className="btn btn-ghost btn-sm" onClick={onCancel}>
          Cancel
        </button>
      ) : null}
    </form>
  );
}

function kindLabel(kind: OverlayEvent["kind"]) {
  return (
    {
      task: "Task",
      show: "Show",
      club: "Club",
      watch: "Watch later",
      square: "Town square",
      golf: "Golf",
      pickle: "Pickleball",
      maint: "Maintenance",
      care: "Care",
      gym: "Gym",
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
  const food = useMemberBoard<FoodBoard>("food", emptyBoards().food, true);
  const gym = useMemberBoard<GymBoard>("gym", emptyBoards().gym, true);
  const maintenance = useMemberBoard<MaintenanceBoard>(
    "maintenance",
    emptyBoards().maintenance,
    true
  );
  const health = useMemberBoard<Record<string, unknown>>("health", {}, true);
  const pets = useMemberBoard<{ pets?: unknown[] }>("pets", { pets: [] }, true);
  const [view, setView] = useState<CalView>("week");
  const [anchor, setAnchor] = useState(todayKey());
  const [form, setForm] = useState(emptyTask(todayKey()));
  const [editId, setEditId] = useState<string | null>(null);
  const [detail, setDetail] = useState<OverlayEvent | null>(null);
  const [detailEditing, setDetailEditing] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [detailBusy, setDetailBusy] = useState(false);
  const [composer, setComposer] = useState<{ date: string; time: string } | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [starredClubs, setStarredClubs] = useState<OverlayEvent[]>([]);

  const today = todayKey();
  const range = viewRange(anchor, view);
  const days = datesInRange(range.start, range.end);

  useEffect(() => {
    const tick = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(tick);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const params = new URLSearchParams({ start: range.start, end: range.end });
    fetch(`/api/members/planner-clubs?${params}`, { cache: "no-store", credentials: "include" })
      .then((r) => (r.ok ? r.json() : { events: [] }))
      .then((data) => {
        if (cancelled) return;
        setStarredClubs(Array.isArray(data.events) ? data.events : []);
      })
      .catch(() => {
        if (!cancelled) setStarredClubs([]);
      });
    return () => {
      cancelled = true;
    };
  }, [range.start, range.end]);

  useEffect(() => {
    if (!detail && !composer) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setDetail(null);
        setDetailEditing(false);
        setComposer(null);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [detail, composer]);

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
          source: { board: "calendar", id: t.id },
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
          source: { board: "entertainment", id: s.id, extra: "show" },
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
            source: { board: "entertainment", id: c.id, extra: "club", repeats: true },
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
            source: { board: "entertainment", id: w.id, extra: "watch" },
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
            source: { board: "entertainment", id: w.id, extra: "watch", repeats: true },
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
          source: { board: "golf", id: t.id, extra: "tee" },
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
          time: m.time || "",
          location: m.court,
          notes: [m.partner && `with ${m.partner}`, m.opponent && `vs ${m.opponent}`, m.score]
            .filter(Boolean)
            .join(" · "),
          source: { board: "pickle", id: m.id, extra: "match" },
        });
      }
    }
    if (food.ready || gym.ready || maintenance.ready || health.ready || pets.ready) {
      out.push(
        ...extrasFromBoards({
          start: range.start,
          end: range.end,
          food: food.ready ? food.value : null,
          gym: gym.ready ? gym.value : null,
          maintenance: maintenance.ready ? maintenance.value : null,
          golf: golf.ready ? golf.value : null,
          pickle: pickle.ready ? pickle.value : null,
          health: health.ready ? health.value : null,
          pets: pets.ready ? pets.value : null,
        })
      );
    }
    for (const club of starredClubs) {
      if (club.date < range.start || club.date > range.end) continue;
      out.push(club);
    }
    return out;
  }, [
    value.tasks,
    ent,
    golf,
    pickle,
    food,
    gym,
    maintenance,
    health,
    pets,
    starredClubs,
    range.start,
    range.end,
    days,
    today,
  ]);

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

  function openDetail(event: OverlayEvent) {
    setComposer(null);
    setDetailEditing(false);
    setDetailError(null);
    setDetail(event);
  }

  function openComposer(date: string, time: string) {
    setDetail(null);
    setDetailEditing(false);
    setDetailError(null);
    setEditId(null);
    setForm({
      ...emptyTask(date),
      startTime: time,
      endDate: time ? date : "",
    });
    setComposer({ date, time });
  }

  function closeComposer() {
    setComposer(null);
    setEditId(null);
    setForm(emptyTask(anchor));
  }

  function closeDetail() {
    setDetail(null);
    setDetailEditing(false);
    setDetailError(null);
    setDetailBusy(false);
  }

  function editDestination(board: string) {
    if (board === "gym" || board === "health") return "/health#my-health";
    if (board === "pets") return "/my-space?tab=pets";
    if (board === "food") return "/my-space?tab=food";
    if (board === "maintenance") return "/my-space?tab=maintenance";
    if (board === "golf") return "/golf-zone#my-scorecard";
    if (board === "pickle") return "/pickleball#my-pickleball";
    if (board === "entertainment") return "/town-squares#my-nights";
    if (board === "club" && detail?.href) return detail.href;
    return "/calendar#my-calendar";
  }

  async function deleteDetail() {
    if (!detail?.source) {
      setDetailError("This item is not saved on a board, so there is nothing to delete.");
      return;
    }
    const src = detail.source;
    if (
      src.repeats &&
      !window.confirm("This repeats. Delete removes it from every day on your planner.")
    ) {
      return;
    }
    setDetailBusy(true);
    setDetailError(null);
    try {
      if (src.board === "calendar") {
        const next = value.tasks.filter((task) => task.id !== src.id);
        if (next.length === value.tasks.length) {
          throw new Error("That task is no longer on your list.");
        }
        persist(next);
      } else if (src.board === "gym") {
        if (!gym.ready) throw new Error("The gym log is still loading. Try again.");
        await gym.save({
          ...gym.value,
          workouts: (gym.value.workouts || []).filter((workout) => workout.id !== src.id),
        });
      } else if (src.board === "maintenance") {
        if (!maintenance.ready) throw new Error("Maintenance is still loading. Try again.");
        await maintenance.save({
          ...maintenance.value,
          tasks: (maintenance.value.tasks || []).filter((task) => task.id !== src.id),
        });
      } else if (src.board === "food") {
        if (!food.ready) throw new Error("Food is still loading. Try again.");
        if (src.extra === "breakfast" || src.extra === "lunch" || src.extra === "dinner") {
          const meals = { ...(food.value.meals || {}) };
          const prev = meals[src.id] || { breakfast: "", lunch: "", dinner: "" };
          meals[src.id] = { ...prev, [src.extra]: "" };
          await food.save({ ...food.value, meals });
        } else {
          await food.save({
            ...food.value,
            happyHours: (food.value.happyHours || []).filter((hour) => hour.id !== src.id),
          });
        }
      } else if (src.board === "golf") {
        if (!golf.ready) throw new Error("Golf is still loading. Try again.");
        const next = { ...golf.value };
        if (src.extra === "round") next.rounds = next.rounds.filter((row) => row.id !== src.id);
        else if (src.extra === "looking") next.looking = next.looking.filter((row) => row.id !== src.id);
        else next.teeTimes = next.teeTimes.filter((row) => row.id !== src.id);
        await golf.save(next);
      } else if (src.board === "pickle") {
        if (!pickle.ready) throw new Error("Pickleball is still loading. Try again.");
        const next = { ...pickle.value };
        if (src.extra === "looking") next.looking = next.looking.filter((row) => row.id !== src.id);
        else next.matches = next.matches.filter((row) => row.id !== src.id);
        await pickle.save(next);
      } else if (src.board === "entertainment") {
        if (!ent.ready) throw new Error("Entertainment is still loading. Try again.");
        const next = { ...ent.value };
        if (src.extra === "club") next.clubs = next.clubs.filter((row) => row.id !== src.id);
        else if (src.extra === "watch") next.watchLater = next.watchLater.filter((row) => row.id !== src.id);
        else next.shows = next.shows.filter((row) => row.id !== src.id);
        await ent.save(next);
      } else if (src.board === "health") {
        if (!health.ready) throw new Error("Health is still loading. Try again.");
        const raw = { ...(health.value || {}) } as Record<string, unknown>;
        const list = (key: string) =>
          Array.isArray(raw[key]) ? (raw[key] as { id?: string }[]) : [];
        if (src.extra === "meal") raw.meals = list("meals").filter((row) => row.id !== src.id);
        else if (src.extra === "exercise") {
          raw.exercises = list("exercises").filter((row) => row.id !== src.id);
        } else {
          raw.medications = list("medications").map((row) => {
            if (row.id !== src.id) return row;
            const med = row as { doseTimes?: { time?: string }[]; active?: boolean };
            const doseTimes = (med.doseTimes || []).filter((slot) => slot.time !== src.extra);
            return { ...med, doseTimes, active: doseTimes.length > 0 && med.active !== false };
          });
        }
        await health.save(raw);
      } else if (src.board === "pets") {
        if (!pets.ready) throw new Error("Pets are still loading. Try again.");
        const current = pets.value || {};
        const list = Array.isArray(current.pets) ? current.pets : [];
        await pets.save({
          ...current,
          pets: list.map((pet) => {
            const row = pet as {
              id?: string;
              walks?: { id?: string }[];
              feeds?: { id?: string }[];
            };
            if (row.id !== src.id) return pet;
            return {
              ...row,
              walks: (row.walks || []).filter((event) => event.id !== src.extra),
              feeds: (row.feeds || []).filter((event) => event.id !== src.extra),
            };
          }),
        });
      } else if (src.board === "club") {
        const res = await fetch("/api/members/space", { cache: "no-store", credentials: "include" });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Could not update favorites");
        const ids = Array.isArray(data.space?.favoriteClubIds)
          ? (data.space.favoriteClubIds as string[]).filter((id) => id !== src.id)
          : [];
        const saved = await fetch("/api/members/space", {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ favoriteClubIds: ids }),
        });
        if (!saved.ok) throw new Error("Could not remove that starred club");
        setStarredClubs((prev) => prev.filter((event) => event.source?.id !== src.id));
      }
      closeDetail();
    } catch (err) {
      setDetailError(err instanceof Error ? err.message : "Could not delete that.");
      setDetailBusy(false);
    }
  }

  if (!ready) return <p className="panel-hint">Loading calendar board…</p>;

  const cols = view === "month" ? 7 : days.length;
  const hourNow = Number(
    new Date().toLocaleString("en-US", {
      timeZone: "America/New_York",
      hour: "numeric",
      hour12: false,
    })
  );

  return (
    <div className="ms-ent-board">
      <div className="ms-cal-hero">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="ms-cal-hero-mascot"
          src="/graphics/mascot-calendar.jpg"
          alt="Golf-ball mascot holding a calendar with a gold star on today"
          width={92}
          height={92}
        />
        <div>
          <span className="kicker">Lanai calendar</span>
          <h4>Your week in sunshine — not a cave</h4>
          <p>
            Your tasks, starred clubs, tee times, and other dated picks land here.
            Town-square nights stay on the month calendar below. Today gets the gold star.
          </p>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="ms-cal-hero-banner"
          src="/graphics/ms-cal-banner.jpg"
          alt=""
          width={220}
          height={108}
        />
      </div>
      <p className="panel-hint">
        Town-square entertainment stays on the month calendar below. This grid
        is your own dates. Click an empty hour to type your own plan. Click a
        colored item and a card opens on this screen. Star a club that has a
        published meeting time and it shows up
        here with the place.{" "}
        <Link href="#events-calendar" className="text-link">
          Month of town-square nights
        </Link>
        .
      </p>
      {error ? <p className="pf-form-error">{error}</p> : null}
      {saving ? <p className="panel-hint">Saving to your account…</p> : null}

      <div className="ms-h-toolbar">
        <span className="ms-h-pill">
          {overlay.length} on calendar · {left} tasks left
        </span>
        <span className="panel-hint">Private to this login</span>
      </div>

      <ul className="ms-cal-legend" aria-label="Calendar colors">
        <li className="kind-task"><i /> Task</li>
        <li className="kind-show"><i /> Show</li>
        <li className="kind-club"><i /> Rec club</li>
        <li className="kind-watch"><i /> Watch later</li>
        <li className="kind-golf"><i /> Golf</li>
        <li className="kind-pickle"><i /> Pickleball</li>
        <li className="kind-care"><i /> Care</li>
        <li className="kind-gym"><i /> Gym</li>
        <li className="kind-maint"><i /> Maintenance</li>
        <li className="kind-square"><i /> Town square</li>
      </ul>

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
              <div
                key={`ad-${iso}`}
                className="ms-cal-slot ms-cal-allday"
                title="Add an all-day plan"
                onClick={() => openComposer(iso, "")}
              >
                {allDay.map((e) => (
                  <button
                    key={e.id}
                    type="button"
                    className={`ms-cal-chip kind-${e.kind}`}
                    onClick={(ev) => {
                      ev.stopPropagation();
                      openDetail(e);
                    }}
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
                    className={`ms-cal-slot${iso === today && h === hourNow ? " is-now" : ""}`}
                    title={`Add a plan at ${h > 12 ? h - 12 : h}${h >= 12 ? " PM" : " AM"}`}
                    onClick={() => openComposer(iso, `${String(h).padStart(2, "0")}:00`)}
                  >
                    {timed.map((e) => (
                      <button
                        key={e.id}
                        type="button"
                        className={`ms-cal-chip kind-${e.kind}${e.done ? " is-done" : ""}`}
                        onClick={(ev) => {
                          ev.stopPropagation();
                          openDetail(e);
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

      {detail && typeof document !== "undefined"
        ? createPortal(
            <div className="ms-cal-pop-scrim" onClick={closeDetail}>
              <div
                className="ms-cal-pop"
                role="dialog"
                aria-modal="true"
                aria-labelledby="ms-cal-pop-title"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="ms-cal-pop-bar">
                  <p className="panel-hint">{kindLabel(detail.kind)}</p>
                  <button type="button" className="ms-cal-pop-close" onClick={closeDetail}>
                    Close
                  </button>
                </div>
                <h3 id="ms-cal-pop-title">{detail.title}</h3>
                <p>
                  {shortDate(detail.date)}
                  {detail.time ? ` · ${formatTime(detail.time)}` : ""}
                  {detail.endTime ? `–${formatTime(detail.endTime)}` : ""}
                </p>
                {detail.location ? <p>{detail.location}</p> : null}
                {detail.notes ? <p>{detail.notes}</p> : null}
                {detailError ? <p className="pf-form-error">{detailError}</p> : null}
                {detailEditing ? (
                  <TaskEditor
                    form={form}
                    setForm={setForm}
                    editing
                    onSave={() => {
                      saveTask();
                      closeDetail();
                    }}
                    onCancel={() => {
                      setDetailEditing(false);
                      setEditId(null);
                      setForm(emptyTask(anchor));
                    }}
                  />
                ) : (
                  <div className="hero-actions">
                    {detail.source?.board === "calendar" ? (
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => {
                          const task = value.tasks.find((row) => row.id === detail.source?.id);
                          if (!task) {
                            setDetailError("That task is no longer on your list.");
                            return;
                          }
                          setEditId(task.id);
                          setForm({ ...task });
                          setDetailEditing(true);
                        }}
                      >
                        Edit
                      </button>
                    ) : detail.source ? (
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => {
                          rememberPlannerReturn({
                            board: detail.source!.board,
                            id: detail.source!.id,
                            extra: detail.source!.extra,
                          });
                          window.location.assign(editDestination(detail.source!.board));
                        }}
                      >
                        {detail.source.board === "gym" ? "Edit workout" : "Edit"}
                      </button>
                    ) : null}
                    {detail.source ? (
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        disabled={detailBusy}
                        onClick={() => void deleteDetail()}
                      >
                        {detailBusy ? "Deleting…" : "Delete"}
                      </button>
                    ) : null}
                  </div>
                )}
              </div>
            </div>,
            document.body
          )
        : null}

      {composer && typeof document !== "undefined"
        ? createPortal(
            <div className="ms-cal-pop-scrim" onClick={closeComposer}>
              <div
                className="ms-cal-pop"
                role="dialog"
                aria-modal="true"
                aria-labelledby="ms-cal-add-title"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="ms-cal-pop-bar">
                  <p className="panel-hint">Your plan</p>
                  <button type="button" className="ms-cal-pop-close" onClick={closeComposer}>
                    Close
                  </button>
                </div>
                <h3 id="ms-cal-add-title">Add to this hour</h3>
                <p>
                  {shortDate(composer.date)}
                  {composer.time ? ` · ${formatTime(composer.time)}` : " · all day"}
                </p>
                <TaskEditor
                  form={form}
                  setForm={setForm}
                  editing={false}
                  showCancel
                  autoFocusTitle
                  onSave={() => {
                    saveTask();
                    setComposer(null);
                  }}
                  onCancel={closeComposer}
                />
              </div>
            </div>,
            document.body
          )
        : null}

      <div className="about-panel ms-module">
        <h4>Today’s tasks</h4>
        <p className="panel-hint">
          Add a task, then Edit to change it, set a start/end time, or run a countdown timer with an
          alarm. <span className="ms-h-pill">{left} left</span>
        </p>
        {todayTasks.length === 0 ? (
          <div className="ms-cal-empty">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/graphics/ms-cal-empty.jpg"
              alt="Golf-ball mascot napping with an empty calendar"
              width={88}
              height={88}
            />
            <p>
              No tasks for today. The alarm clock is napping. Add one below —
              or just protect early-bird.
            </p>
          </div>
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

        {detailEditing ? null : (
          <TaskEditor
            form={form}
            setForm={setForm}
            editing={!!editId}
            onSave={saveTask}
            onCancel={() => {
              setEditId(null);
              setForm(emptyTask(anchor));
            }}
          />
        )}
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
