import { CAL_DAYS, datesInRange, weekdayOf, type OverlayEvent } from "./calendarCatalog";
import type {
  FoodBoard,
  GolfLogBoard,
  GymBoard,
  MaintenanceBoard,
  PickleballLogBoard,
} from "./memberBoardModel";

type Row = Record<string, unknown>;

function rows(value: unknown): Row[] {
  if (!Array.isArray(value)) return [];
  return value.filter((row) => row && typeof row === "object") as Row[];
}

function text(value: unknown, max = 120) {
  return String(value || "").trim().slice(0, max);
}

function inRange(date: string, start: string, end: string) {
  return !!date && date >= start && date <= end;
}

function push(out: OverlayEvent[], event: OverlayEvent) {
  if (!event.date || !event.title) return;
  out.push(event);
}

/** Dated picks saved on other boards, for the personal week grid. */
export function extrasFromBoards(input: {
  start: string;
  end: string;
  food?: FoodBoard | null;
  gym?: GymBoard | null;
  maintenance?: MaintenanceBoard | null;
  golf?: GolfLogBoard | null;
  pickle?: PickleballLogBoard | null;
  health?: Row | null;
  pets?: { pets?: unknown[]; completions?: Record<string, unknown> } | null;
}): OverlayEvent[] {
  const { start, end } = input;
  const days = datesInRange(start, end);
  const out: OverlayEvent[] = [];

  const food = input.food;
  if (food) {
    for (const hour of food.happyHours || []) {
      if (!hour.place) continue;
      for (const iso of days) {
        const name = CAL_DAYS[weekdayOf(iso)];
        if (!(hour.days || []).includes(name)) continue;
        push(out, {
          id: `hh:${hour.id}:${iso}`,
          kind: "show",
          title: hour.place,
          date: iso,
          time: hour.startTime || "",
          endTime: hour.endTime || "",
          location: hour.square,
          notes: hour.specials,
          href: "/my-space?tab=food",
          source: { board: "food", id: hour.id, repeats: true },
        });
      }
    }
    for (const [date, meal] of Object.entries(food.meals || {})) {
      if (!inRange(date, start, end) || !meal) continue;
      const slots: [string, string][] = [
        ["Breakfast", meal.breakfast],
        ["Lunch", meal.lunch],
        ["Dinner", meal.dinner],
      ];
      for (const [slot, title] of slots) {
        if (!title) continue;
        push(out, {
          id: `meal:${date}:${slot}`,
          kind: "show",
          title: `${slot} · ${title}`,
          date,
          time: "",
          href: "/my-space?tab=food",
          source: { board: "food", id: date, extra: slot.toLowerCase() },
        });
      }
    }
  }

  const gym = input.gym;
  if (gym) {
    for (const workout of gym.workouts || []) {
      if (!inRange(workout.date, start, end)) continue;
      push(out, {
        id: `gym:${workout.id}`,
        kind: "gym",
        title: workout.routineName || workout.gymName || "Gym",
        date: workout.date,
        time: workout.time || "",
        location: workout.gymName,
        notes: workout.notes,
        href: "/health#my-health",
        source: { board: "gym", id: workout.id },
      });
    }
  }

  const maint = input.maintenance;
  if (maint) {
    const assets = new Map((maint.assets || []).map((asset) => [asset.id, asset.name]));
    for (const task of maint.tasks || []) {
      if (!inRange(task.dueDate, start, end)) continue;
      push(out, {
        id: `maint:${task.id}`,
        kind: "maint",
        title: task.title,
        date: task.dueDate,
        time: "",
        location: assets.get(task.assetId) || "",
        notes: task.notes,
        done: task.done,
        href: "/my-space?tab=maintenance",
        source: { board: "maintenance", id: task.id },
      });
    }
  }

  const golf = input.golf;
  if (golf) {
    for (const round of golf.rounds || []) {
      if (!inRange(round.date, start, end)) continue;
      push(out, {
        id: `round:${round.id}`,
        kind: "golf",
        title: round.course ? `Round · ${round.course}` : "Golf round",
        date: round.date,
        time: "",
        location: round.course,
        notes: round.notes,
        href: "/golf-zone#my-scorecard",
        source: { board: "golf", id: round.id, extra: "round" },
      });
    }
    for (const note of golf.looking || []) {
      if (!inRange(note.date, start, end)) continue;
      push(out, {
        id: `glook:${note.id}`,
        kind: "golf",
        title: note.need ? `Looking for ${note.need}` : "Looking for a game",
        date: note.date,
        time: note.time || "",
        notes: note.notes,
        href: "/golf-zone#my-scorecard",
        source: { board: "golf", id: note.id, extra: "looking" },
      });
    }
  }

  const pickle = input.pickle;
  if (pickle) {
    for (const note of pickle.looking || []) {
      if (!inRange(note.date, start, end)) continue;
      push(out, {
        id: `plook:${note.id}`,
        kind: "pickle",
        title: note.courtName || note.court || "Looking for pickleball",
        date: note.date,
        time: note.time || "",
        location: note.courtName || note.court,
        notes: [note.format, note.need ? `need ${note.need}` : "", note.notes]
          .filter(Boolean)
          .join(" · "),
        href: "/pickleball#my-pickleball",
        source: { board: "pickle", id: note.id, extra: "looking" },
      });
    }
  }

  const medLogs = rows(input.health?.medicationLogs);
  const seenMedLogs = new Set<string>();
  for (const med of rows(input.health?.medications)) {
    const name = text(med.name, 80);
    if (!name) continue;
    const medId = text(med.id, 40) || name;
    const period = text(med.dosePeriod, 12);
    const repeating = period !== "week" && period !== "month" && period !== "other";
    const times = rows(med.doseTimes).filter((slot) => slot.enabled !== false && text(slot.time, 8));
    if (med.active === false || !repeating) continue;
    for (const iso of days) {
      for (const slot of times) {
        const time = text(slot.time, 8);
        const doseId = text(slot.id, 40);
        const log = medLogFor(medLogs, medId, doseId, time, iso);
        if (log) seenMedLogs.add(logKey(log));
        const label = text(slot.label, 40) || text(med.schedule, 80);
        push(out, {
          id: `med:${medId}:${iso}:${time}`,
          kind: "care",
          title: name,
          date: iso,
          time,
          notes: log ? takenNote(time, text(log.time, 8), [label, text(log.notes, 80)].filter(Boolean).join(" · ")) : label,
          done: !!log,
          href: "/health#my-health",
          source: { board: "health", id: medId, extra: time, repeats: true },
        });
      }
    }
  }
  for (const log of medLogs) {
    const date = text(log.date, 12);
    if (!inRange(date, start, end) || seenMedLogs.has(logKey(log))) continue;
    const name = text(log.medicationName, 80) || "Medication";
    const planned = text(log.scheduledTime, 8);
    push(out, {
      id: `medlog:${text(log.id, 40) || `${text(log.medicationId, 40)}:${date}:${planned}`}`,
      kind: "care",
      title: name,
      date,
      time: planned || text(log.time, 8),
      notes: takenNote(planned, text(log.time, 8), text(log.notes, 80)),
      done: true,
      href: "/health#my-health",
      source: {
        board: "health",
        id: text(log.medicationId, 40) || name,
        extra: planned || text(log.doseTimeId, 40),
      },
    });
  }
  for (const meal of rows(input.health?.meals)) {
    const date = text(meal.date, 12);
    if (!inRange(date, start, end)) continue;
    push(out, {
      id: `hmeal:${text(meal.id, 40) || date}`,
      kind: "care",
      title: text(meal.title, 80) || "Meal",
      date,
      time: text(meal.time, 8),
      notes: text(meal.mealType, 20),
      href: "/health#my-health",
      source: { board: "health", id: text(meal.id, 40) || date, extra: "meal" },
    });
  }
  for (const exercise of rows(input.health?.exercises)) {
    const date = text(exercise.date, 12);
    if (!inRange(date, start, end)) continue;
    push(out, {
      id: `hex:${text(exercise.id, 40) || date}`,
      kind: "care",
      title: text(exercise.activity, 80) || "Exercise",
      date,
      time: text(exercise.time, 8),
      notes: exercise.durationMin ? `${exercise.durationMin} min` : "",
      href: "/health#my-health",
      source: { board: "health", id: text(exercise.id, 40) || date, extra: "exercise" },
    });
  }

  const petDone = input.pets?.completions || {};
  for (const pet of rows(input.pets?.pets)) {
    const name = text(pet.name, 40) || "Pet";
    const events = [...rows(pet.walks), ...rows(pet.feeds)].filter(
      (event) => event.enabled !== false && text(event.time, 8)
    );
    for (const iso of days) {
      for (const event of events) {
        const time = text(event.time, 8);
        const eventId = text(event.id, 40);
        const finished = donePet(petDone[`${eventId}:${iso}`]);
        const label = text(event.label, 40) || "Care";
        push(out, {
          id: `pet:${text(pet.id, 40)}:${eventId}:${iso}`,
          kind: "care",
          title: `${name} · ${label}`,
          date: iso,
          time,
          notes: finished
            ? takenNote(time, finished.doneAt, [finished.note, finished.bowel ? "Bowel movement" : ""].filter(Boolean).join(" · "))
            : "",
          done: !!finished,
          href: "/my-space?tab=pets",
          source: {
            board: "pets",
            id: text(pet.id, 40),
            extra: eventId,
            repeats: true,
          },
        });
      }
    }
  }

  return out;
}

function logKey(log: Row) {
  const id = text(log.id, 40);
  if (id) return id;
  return `${text(log.medicationId, 40)}:${text(log.date, 12)}:${text(log.scheduledTime, 8)}:${text(log.time, 8)}`;
}

function medLogFor(logs: Row[], medId: string, doseId: string, time: string, iso: string) {
  return logs.find((log) => {
    if (text(log.date, 12) !== iso || text(log.medicationId, 40) !== medId) return false;
    const savedDose = text(log.doseTimeId, 40);
    if (doseId && savedDose === doseId) return true;
    return text(log.scheduledTime, 8) === time;
  });
}

function donePet(raw: unknown): { note: string; doneAt: string; bowel: boolean } | null {
  if (raw === true) return { note: "", doneAt: "", bowel: false };
  if (!raw || typeof raw !== "object") return null;
  const row = raw as { done?: boolean; note?: unknown; doneAt?: unknown; bowelMovement?: boolean };
  if (!row.done) return null;
  return { note: text(row.note, 160), doneAt: text(row.doneAt, 8), bowel: !!row.bowelMovement };
}

function takenNote(planned: string, logged: string, extra: string) {
  const bits = [];
  if (planned) bits.push(`Planned ${clockLabel(planned)}`);
  if (logged) bits.push(`Logged ${clockLabel(logged)}`);
  if (extra) bits.push(extra);
  return bits.join(" · ");
}

function clockLabel(value: string) {
  const match = value.match(/^(\d{1,2}):(\d{2})/);
  if (!match) return value;
  const hour = Number(match[1]);
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = ((hour + 11) % 12) + 1;
  return `${hour12}:${match[2]} ${ampm}`;
}
