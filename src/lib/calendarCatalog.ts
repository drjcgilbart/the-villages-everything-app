/** Date helpers + official Villages calendar links for My Space Calendar. */

export const CAL_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
export const CAL_HOURS = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];

export const CAL_OFFICIAL = [
  {
    label: "Villages rec calendar",
    href: "https://www.thevillages.com/calendar/",
    note: "Official recreation & events calendar",
  },
  {
    label: "Nightly entertainment",
    href: "https://www.thevillagesentertainment.com/nightly-entertainment/",
    note: "Square lineups · summer hours 6–10pm (Jun 1–Sep 30)",
  },
  {
    label: "Ticketed performances",
    href: "https://www.thevillagesentertainment.com/ticketed-performances/",
    note: "The Sharon, Savannah Center, The Tracy, SigPro",
  },
  {
    label: "District programs",
    href: "https://www.districtgov.org/programs/",
    note: "Senior Games, Camp Villages, sports, clubs",
  },
  {
    label: "Camp Villages",
    href: "https://www.districtgov.org/programs/camp-villages/",
    note: "Grandkids programs · summer Jun 8–Aug 7, 2026",
  },
  {
    label: "Polo Club events",
    href: "https://thevillagespoloclub.com/upcoming-events/",
    note: "Matches and Cloud Chasers",
  },
  {
    label: "Google Calendar (your own)",
    href: "https://calendar.google.com/",
    note: "Optional — keep doctor days there if you already use Google",
  },
];

export function todayKey() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "America/New_York" });
}

export function addDays(iso: string, n: number) {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
}

export function weekdayOf(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

export function shortDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function monthTitle(iso: string) {
  const [y, m] = iso.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export type CalView = "day" | "three" | "week" | "month";

export function viewRange(anchor: string, view: CalView) {
  if (view === "day") return { start: anchor, end: anchor };
  if (view === "three") return { start: anchor, end: addDays(anchor, 2) };
  if (view === "week") {
    const start = addDays(anchor, -weekdayOf(anchor));
    return { start, end: addDays(start, 6) };
  }
  const [y, m] = anchor.split("-").map(Number);
  const first = `${y}-${String(m).padStart(2, "0")}-01`;
  const lastN = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const last = `${y}-${String(m).padStart(2, "0")}-${String(lastN).padStart(2, "0")}`;
  return { start: addDays(first, -weekdayOf(first)), end: addDays(last, 6 - weekdayOf(last)) };
}

export function shiftAnchor(anchor: string, view: CalView, dir: number) {
  if (view === "month") {
    const [y, m] = anchor.split("-").map(Number);
    return new Date(Date.UTC(y, m - 1 + dir, 1)).toISOString().slice(0, 10);
  }
  const step = view === "day" ? 1 : view === "three" ? 3 : 7;
  return addDays(anchor, dir * step);
}

export function viewTitle(anchor: string, view: CalView) {
  const { start, end } = viewRange(anchor, view);
  if (view === "month") return monthTitle(anchor);
  if (start === end) return shortDate(start);
  return `${shortDate(start)} – ${shortDate(end)}`;
}

export function datesInRange(start: string, end: string) {
  const out: string[] = [];
  if (!start || !end || end < start) return out;
  for (let iso = start; iso <= end; iso = addDays(iso, 1)) out.push(iso);
  return out;
}

export function hourOf(time: string) {
  if (!/^\d{2}:\d{2}/.test(time || "")) return null;
  return Number(time.slice(0, 2));
}

export function formatTime(hhmm: string) {
  if (!/^\d{2}:\d{2}/.test(hhmm || "")) return "";
  const hRaw = Number(hhmm.slice(0, 2));
  const m = hhmm.slice(3, 5);
  const ampm = hRaw >= 12 ? "PM" : "AM";
  const h = hRaw % 12 || 12;
  return `${h}:${m} ${ampm}`;
}

export function fmtCountdown(ms: number) {
  const s = Math.max(0, Math.ceil(ms / 1000));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h) return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  return `${m}:${String(sec).padStart(2, "0")}`;
}

export type OverlayKind = "task" | "show" | "club" | "watch" | "square" | "golf" | "pickle" | "maint";

export type OverlayEvent = {
  id: string;
  kind: OverlayKind;
  title: string;
  date: string;
  time: string;
  endTime?: string;
  location?: string;
  notes?: string;
  done?: boolean;
};

function weekIndex(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = Date.UTC(y, m - 1, d);
  const monday = Date.UTC(1970, 0, 5);
  return Math.floor((dt - monday) / 604800000);
}

/** Expand a rec-club row onto dates in [start, end]. */
export function clubDates(
  club: {
    kind: string;
    days: string[];
    interval: number;
    time: string;
    extraDates: { date: string; time: string }[];
  },
  start: string,
  end: string
) {
  const extra = new Map<string, string>();
  for (const item of club.extraDates || []) {
    if (item.date) extra.set(item.date, item.time || club.time || "");
  }
  const out: { date: string; time: string }[] = [];
  for (let iso = start; iso <= end; iso = addDays(iso, 1)) {
    if (extra.has(iso)) {
      out.push({ date: iso, time: extra.get(iso) || "" });
      continue;
    }
    const name = CAL_DAYS[weekdayOf(iso)];
    const kind = club.kind || "weekly";
    if (kind === "dates") continue;
    if (kind === "monthly-dates") {
      const days = (club.extraDates || []).map((d) => Number(d.date.slice(8, 10))).filter(Boolean);
      if (days.includes(Number(iso.slice(8, 10)))) out.push({ date: iso, time: club.time || "" });
      continue;
    }
    if (!(club.days || []).includes(name)) continue;
    if (kind === "monthly-week") {
      const nth = Math.ceil(Number(iso.slice(8, 10)) / 7);
      if (nth === 1 || nth === 3) out.push({ date: iso, time: club.time || "" });
      continue;
    }
    if ((club.interval || 1) > 1) {
      const anchor = start;
      if ((((weekIndex(iso) - weekIndex(anchor)) % 2) + 2) % 2 !== 0) continue;
    }
    out.push({ date: iso, time: club.time || "" });
  }
  return out;
}
