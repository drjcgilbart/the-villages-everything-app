import { type AlarmMark } from "@/lib/alarmComplete";
import { todayKeyEastern, type AlarmTone } from "@/lib/mySpaceStorage";

export type { AlarmMark };

export const GYM_REST_KEY = "tvea-gym-rest";

export type ScheduledAlarm = {
  id: string;
  at: number;
  title: string;
  detail: string;
  seconds: number;
  source: "health" | "pet" | "gym";
  tone: AlarmTone;
  uri?: string;
  /** What Done should check off. The dose or task clock is not in here as a new time. */
  marks: AlarmMark[];
  /** Page Open should show, including the item to edit. */
  openPath: string;
};

const ZONE = "America/New_York";
const GRACE_MS = 2 * 60 * 1000;

type DosePeriod = "day" | "week" | "month" | "other";

type DoseTime = { id?: string; time?: string; label?: string; enabled?: boolean };

type Medication = {
  id?: string;
  name?: string;
  active?: boolean;
  alarmEnabled?: boolean;
  alarmSound?: AlarmTone;
  alarmUri?: string;
  alarmDurationSec?: number;
  timesPerDay?: number;
  dosePeriod?: DosePeriod;
  dosePeriodOther?: string;
  doseTimes?: DoseTime[];
};

type MedicationLog = {
  medicationId?: string;
  doseTimeId?: string;
  date?: string;
  time?: string;
};

type HealthBoard = {
  medAlarmEnabled?: boolean;
  medAlarmSound?: AlarmTone;
  medAlarmUri?: string;
  medAlarmDurationSec?: number;
  medications?: Medication[];
  medicationLogs?: MedicationLog[];
};

type PetEvent = { id?: string; time?: string; label?: string; enabled?: boolean };

type Pet = {
  id?: string;
  name?: string;
  species?: string;
  alarmSound?: AlarmTone;
  alarmUri?: string;
  alarmDurationSec?: number;
  walkAlarmEnabled?: boolean;
  feedAlarmEnabled?: boolean;
  walks?: PetEvent[];
  feeds?: PetEvent[];
};

type PetBoard = {
  pets?: Pet[];
  completions?: Record<string, { done?: boolean } | boolean>;
};

/** Remember a gym rest so it can ring after leaving the Gym screen. */
export function rememberGymRest(endsAt: number | null): void {
  if (typeof window === "undefined") return;
  if (endsAt == null) sessionStorage.removeItem(GYM_REST_KEY);
  else sessionStorage.setItem(GYM_REST_KEY, JSON.stringify({ endsAt }));
  window.dispatchEvent(new Event("tvea-alarm-schedule-sync"));
}

export function readGymRest(now = Date.now()): { endsAt: number } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(GYM_REST_KEY);
    if (!raw) return null;
    const endsAt = Number(JSON.parse(raw).endsAt);
    if (!Number.isFinite(endsAt) || endsAt <= now - 15_000) {
      sessionStorage.removeItem(GYM_REST_KEY);
      return null;
    }
    return { endsAt };
  } catch {
    return null;
  }
}

export function collectScheduledAlarms(
  health: unknown,
  pets: unknown,
  gymRest: { endsAt: number } | null,
  now = Date.now()
): ScheduledAlarm[] {
  const alarms: ScheduledAlarm[] = [];
  alarms.push(...medicineAlarms(health as HealthBoard, now));
  alarms.push(...petAlarms(pets as PetBoard, now));
  if (gymRest && gymRest.endsAt > now - 15_000) {
    alarms.push({
      id: `gym-rest:${gymRest.endsAt}`,
      at: Math.max(gymRest.endsAt, now + 500),
      title: "Rest is over",
      detail: "The rest timer finished.",
      seconds: 10,
      source: "gym",
      tone: "chime",
      marks: [{ kind: "gym" }],
      openPath: "/health?section=gym#my-health",
    });
  }
  alarms.sort((a, b) => a.at - b.at);
  return alarms;
}

function medicineAlarms(board: HealthBoard | null | undefined, now: number): ScheduledAlarm[] {
  if (!board || board.medAlarmEnabled === false) return [];
  const today = todayKeyEastern();
  const logs = Array.isArray(board.medicationLogs) ? board.medicationLogs : [];
  const grouped = new Map<number, ScheduledAlarm>();
  for (const med of board.medications || []) {
    if (med.active === false || med.alarmEnabled === false || !med.id) continue;
    const doses = enabledDoses(med);
    for (const dose of doses) {
      const clock = normalizeClock(dose.time || "");
      if (!clock || !dose.id) continue;
      const at = nextDoseAt(med, dose.id, logs, today, clock, now);
      if (at == null) continue;
      const seconds = clampSeconds(med.alarmDurationSec || board.medAlarmDurationSec || 30);
      const tone = med.alarmSound || board.medAlarmSound || "chime";
      const uri = tone === "phone" ? med.alarmUri || board.medAlarmUri || "" : "";
      const name = String(med.name || "Medication");
      const dueDate = dateOf(at);
      const mark = {
        kind: "med" as const,
        medId: String(med.id),
        doseId: String(dose.id),
        scheduledTime: clock,
        dueDate,
      };
      const existing = grouped.get(at);
      if (existing) {
        existing.detail = `${existing.detail.replace(/\.$/, "")}, ${name}.`;
        existing.seconds = Math.max(existing.seconds, seconds);
        existing.id = `${existing.id}+${med.id}:${dose.id}`;
        existing.marks.push(mark);
        existing.openPath = medOpenPath(existing.marks);
      } else {
        grouped.set(at, {
          id: `med:${dueDate}:${med.id}:${dose.id}`,
          at,
          title: "Medicine alarm",
          detail: `${formatClock(clock)} — ${name}. Not marked taken yet.`,
          seconds,
          source: "health",
          tone,
          uri,
          marks: [mark],
          openPath: medOpenPath([mark]),
        });
      }
    }
  }
  return [...grouped.values()];
}

function petAlarms(board: PetBoard | null | undefined, now: number): ScheduledAlarm[] {
  if (!board || !Array.isArray(board.pets)) return [];
  const today = todayKeyEastern();
  const alarms: ScheduledAlarm[] = [];
  for (const pet of board.pets) {
    const name = String(pet.name || "Pet");
    const sound = pet.alarmSound || "chime";
    const uri = sound === "phone" ? pet.alarmUri || "" : "";
    const seconds = clampSeconds(pet.alarmDurationSec || 30);
    const rows: { events: PetEvent[] | undefined; enabled: boolean; word: string }[] = [
      { events: pet.walks, enabled: pet.walkAlarmEnabled !== false, word: outingWord(pet.species) },
      { events: pet.feeds, enabled: pet.feedAlarmEnabled !== false, word: "Meal" },
    ];
    for (const row of rows) {
      if (!row.enabled) continue;
      for (const event of row.events || []) {
        if (event.enabled === false || !event.id) continue;
        const clock = normalizeClock(event.time || "");
        if (!clock) continue;
        const doneKey = `${event.id}:${today}`;
        if (isDone(board.completions?.[doneKey])) continue;
        const at = nextClockAt(today, clock, now, true);
        if (at == null) continue;
        const when = formatClock(clock);
        const label = event.label ? ` (${event.label})` : "";
        const dueDate = dateOf(at);
        const petId = String(pet.id || "");
        const eventId = String(event.id || "");
        alarms.push({
          id: `pet:${dueDate}:${eventId}`,
          at,
          title: `${name} ${row.word.toLowerCase()} alarm`,
          detail: `${name} — ${row.word} at ${when}${label}`,
          seconds,
          source: "pet",
          tone: sound,
          uri,
          marks: [{ kind: "pet", petId, eventId, dueDate }],
          openPath: `/my-space?tab=pets&editPet=${encodeURIComponent(petId)}&editEvent=${encodeURIComponent(eventId)}`,
        });
      }
    }
  }
  return alarms;
}

function medOpenPath(marks: AlarmMark[]): string {
  const ids = [
    ...new Set(marks.flatMap((mark) => (mark.kind === "med" && mark.medId ? [mark.medId] : []))),
  ];
  if (ids.length === 1) {
    return `/health?section=meds&editMed=${encodeURIComponent(ids[0])}#my-health`;
  }
  return "/health?section=meds#my-health";
}

function enabledDoses(med: Medication): DoseTime[] {
  const real = (med.doseTimes || []).filter((dose) => dose && dose.enabled !== false && dose.id);
  if (real.length) return real;
  const n = Math.min(12, Math.max(1, Math.round(med.timesPerDay || 1)));
  const template = DEFAULT_TIMES[n];
  const times = template
    ? template.slice(0, n)
    : Array.from({ length: n }, (_, i) => {
        const hour = Math.min(23, 7 + Math.floor((i * 14) / Math.max(1, n - 1)));
        return `${String(hour).padStart(2, "0")}:00`;
      });
  return times.map((time, i) => ({
    id: `interval:${med.id}:${i}`,
    time,
    enabled: true,
  }));
}

function nextDoseAt(
  med: Medication,
  doseId: string,
  logs: MedicationLog[],
  today: string,
  clock: string,
  now: number
): number | null {
  if (doseIsDue(med, doseId, logs, today)) {
    const at = nextClockAt(today, clock, now, true);
    if (at != null) return at;
  }
  for (let day = 1; day <= 40; day++) {
    const date = addDays(today, day);
    if (!doseIsDue(med, doseId, logs, date)) continue;
    return zonedEpoch(date, clock);
  }
  return null;
}

/** Today if it is still inside the 2-minute grace, otherwise the next day. */
function nextClockAt(date: string, clock: string, now: number, allowTomorrow: boolean): number | null {
  const at = zonedEpoch(date, clock);
  if (at == null) return null;
  if (at >= now - GRACE_MS) return Math.max(at, now + 500);
  if (!allowTomorrow) return null;
  return zonedEpoch(addDays(date, 1), clock);
}

function doseIsDue(med: Medication, doseId: string, logs: MedicationLog[], day: string): boolean {
  const last = latestLog(logs, String(med.id || ""), doseId);
  if (!last?.date) return true;
  if (periodOf(med.dosePeriod) === "day") return last.date !== day;
  return day >= nextDueDate(last.date, periodOf(med.dosePeriod), med.dosePeriodOther);
}

function latestLog(logs: MedicationLog[], medId: string, doseId: string): MedicationLog | null {
  let best: MedicationLog | null = null;
  for (const log of logs) {
    if (log.medicationId !== medId || log.doseTimeId !== doseId || !log.date) continue;
    if (!best || `${log.date}T${log.time || ""}` > `${best.date}T${best.time || ""}`) best = log;
  }
  return best;
}

function nextDueDate(takenOn: string, period: DosePeriod, other?: string): string {
  if (period === "week") return addDays(takenOn, 7);
  if (period === "month") return addMonths(takenOn, 1);
  if (period === "other") {
    const text = String(other || "").toLowerCase();
    const n = Number(text.match(/(\d+)/)?.[1] || 0);
    if (/day/.test(text) && n) return addDays(takenOn, n);
    if (/week/.test(text) && n) return addDays(takenOn, n * 7);
    if (/month/.test(text) && n) return addMonths(takenOn, n);
    if (/other day/.test(text)) return addDays(takenOn, 2);
    return addDays(takenOn, 7);
  }
  return addDays(takenOn, 1);
}

function periodOf(value: unknown): DosePeriod {
  if (value === "week" || value === "month" || value === "other") return value;
  return "day";
}

function addDays(date: string, days: number): string {
  const [y, m, d] = date.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + days);
  return dt.toISOString().slice(0, 10);
}

function addMonths(date: string, months: number): string {
  const [y, m, d] = date.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1 + months, 1));
  const last = new Date(Date.UTC(dt.getUTCFullYear(), dt.getUTCMonth() + 1, 0)).getUTCDate();
  dt.setUTCDate(Math.min(d, last));
  return dt.toISOString().slice(0, 10);
}

export function zonedEpoch(date: string, clock: string): number | null {
  const clockOk = normalizeClock(clock);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !clockOk) return null;
  const [y, m, d] = date.split("-").map(Number);
  const [h, min] = clockOk.split(":").map(Number);
  const utcGuess = Date.UTC(y, m - 1, d, h, min, 0);
  const first = zoneOffset(utcGuess);
  let utc = utcGuess - first;
  const second = zoneOffset(utc);
  if (second !== first) utc = utcGuess - second;
  return utc;
}

function zoneOffset(epoch: number): number {
  const parts = easternParts(epoch);
  const asUtc = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second);
  return asUtc - epoch;
}

function easternParts(epoch: number) {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: ZONE,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const bag = Object.fromEntries(fmt.formatToParts(new Date(epoch)).map((part) => [part.type, part.value]));
  return {
    year: Number(bag.year),
    month: Number(bag.month),
    day: Number(bag.day),
    hour: Number(bag.hour === "24" ? "0" : bag.hour),
    minute: Number(bag.minute),
    second: Number(bag.second),
  };
}

function dateOf(epoch: number): string {
  const parts = easternParts(epoch);
  const month = String(parts.month).padStart(2, "0");
  const day = String(parts.day).padStart(2, "0");
  return `${parts.year}-${month}-${day}`;
}

function normalizeClock(value: string): string {
  const match = String(value || "").trim().match(/^(\d{1,2}):(\d{2})/);
  if (!match) return "";
  const hour = Math.min(23, Math.max(0, Number(match[1])));
  const minute = Math.min(59, Math.max(0, Number(match[2])));
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

function formatClock(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour12 = ((h + 11) % 12) + 1;
  return `${hour12}:${String(m).padStart(2, "0")} ${ampm}`;
}

function clampSeconds(value: unknown): number {
  const n = Number(value);
  if (!Number.isFinite(n)) return 30;
  return Math.min(300, Math.max(5, Math.round(n)));
}

function isDone(value: { done?: boolean } | boolean | undefined): boolean {
  if (value === true) return true;
  return Boolean(value && typeof value === "object" && value.done);
}

function outingWord(species: string | undefined): string {
  if (species === "cat") return "Play";
  if (species === "bird") return "Out time";
  if (species === "fish") return "Tank check";
  if (species === "reptile") return "Habitat check";
  if (species === "small-mammal") return "Play";
  if (species === "horse") return "Turnout";
  if (species === "other") return "Care";
  return "Walk";
}

const DEFAULT_TIMES: Record<number, string[]> = {
  1: ["08:00"],
  2: ["08:00", "20:00"],
  3: ["08:00", "14:00", "20:00"],
  4: ["08:00", "12:00", "16:00", "20:00"],
  5: ["07:00", "10:00", "13:00", "17:00", "21:00"],
  6: ["07:00", "10:00", "13:00", "16:00", "19:00", "22:00"],
};
