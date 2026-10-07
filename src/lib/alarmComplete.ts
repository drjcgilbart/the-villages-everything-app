/** Mark a ringing alarm done at the moment the phone button is pressed. */

export type AlarmMark =
  | { kind: "med"; medId: string; doseId: string; scheduledTime: string; dueDate: string }
  | { kind: "pet"; petId: string; eventId: string; dueDate: string }
  | { kind: "gym" };

type MedLog = {
  id?: string;
  medicationId?: string;
  medicationName?: string;
  dosage?: string;
  date?: string;
  time?: string;
  scheduledTime?: string;
  doseTimeId?: string;
  notes?: string;
};

type Med = {
  id?: string;
  name?: string;
  dosage?: string;
  doseTimes?: { id?: string; time?: string }[];
};

type HealthLike = {
  medications?: Med[];
  medicationLogs?: MedLog[];
};

type PetCompletion = {
  done?: boolean;
  note?: string;
  doneAt?: string;
  bowelMovement?: boolean;
};

type PetLike = {
  activePetId?: string;
  pets?: { id?: string }[];
  completions?: Record<string, PetCompletion | boolean>;
};

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function pressStamp(epoch: number): { date: string; time: string } {
  const when = new Date(epoch);
  const date = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(when);
  const time = when.toLocaleTimeString("en-GB", {
    timeZone: "America/New_York",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return { date, time: time.slice(0, 5) };
}

export function parseMarks(raw: unknown): AlarmMark[] {
  const rows = Array.isArray(raw) ? raw : [];
  const marks: AlarmMark[] = [];
  for (const row of rows) {
    if (!row || typeof row !== "object") continue;
    const item = row as Record<string, unknown>;
    const dueDate = DATE_RE.test(String(item.dueDate || "")) ? String(item.dueDate) : "";
    if (item.kind === "gym") {
      marks.push({ kind: "gym" });
      continue;
    }
    if (item.kind === "med") {
      const medId = String(item.medId || "");
      const doseId = String(item.doseId || "");
      if (!medId || !doseId || !dueDate) continue;
      marks.push({
        kind: "med",
        medId,
        doseId,
        scheduledTime: String(item.scheduledTime || ""),
        dueDate,
      });
      continue;
    }
    if (item.kind === "pet") {
      const eventId = String(item.eventId || "");
      if (!eventId || !dueDate) continue;
      marks.push({
        kind: "pet",
        petId: String(item.petId || ""),
        eventId,
        dueDate,
      });
    }
  }
  return marks;
}

function scheduledClock(med: Med | undefined, mark: Extract<AlarmMark, { kind: "med" }>): string {
  const dose = med?.doseTimes?.find((slot) => slot.id === mark.doseId);
  return dose?.time || mark.scheduledTime || "";
}

/** Add or update today's dose log. Dose clock times on the medication stay as they are. */
export function applyMedicineMarks<T extends HealthLike>(board: T, marks: AlarmMark[], pressedAt: string): T {
  const meds = Array.isArray(board.medications) ? board.medications : [];
  let logs = Array.isArray(board.medicationLogs) ? [...board.medicationLogs] : [];
  let changed = false;
  for (const mark of marks) {
    if (mark.kind !== "med") continue;
    const med = meds.find((item) => item.id === mark.medId);
    const planned = scheduledClock(med, mark);
    const existing = logs.find(
      (log) => log.medicationId === mark.medId && log.doseTimeId === mark.doseId && log.date === mark.dueDate
    );
    if (existing) {
      if (existing.time === pressedAt) continue;
      logs = logs.map((log) => (log === existing ? { ...log, time: pressedAt } : log));
      changed = true;
      continue;
    }
    logs.push({
      id: `mlog-alarm-${mark.dueDate}-${mark.doseId}`.slice(0, 96),
      medicationId: mark.medId,
      medicationName: String(med?.name || ""),
      dosage: String(med?.dosage || ""),
      date: mark.dueDate,
      time: pressedAt,
      scheduledTime: planned,
      doseTimeId: mark.doseId,
      notes: "",
    });
    changed = true;
  }
  if (!changed) return board;
  return { ...board, medicationLogs: logs };
}

function completionOf(value: PetCompletion | boolean | undefined): PetCompletion {
  if (value && typeof value === "object") {
    return {
      done: Boolean(value.done),
      note: String(value.note || ""),
      doneAt: value.doneAt,
      bowelMovement: Boolean(value.bowelMovement),
    };
  }
  return { done: value === true, note: "" };
}

/** Check the pet task done at the press time. The task's own clock stays put. */
export function applyPetMarks<T extends PetLike>(board: T, marks: AlarmMark[], pressedAt: string): T {
  const completions = { ...(board.completions || {}) };
  let changed = false;
  for (const mark of marks) {
    if (mark.kind !== "pet") continue;
    const key = `${mark.eventId}:${mark.dueDate}`;
    const current = completionOf(completions[key]);
    if (current.done && current.doneAt === pressedAt) continue;
    completions[key] = { ...current, done: true, doneAt: pressedAt };
    changed = true;
  }
  if (!changed) return board;
  return { ...board, completions };
}

export function marksIncludeGym(marks: AlarmMark[]): boolean {
  return marks.some((mark) => mark.kind === "gym");
}
