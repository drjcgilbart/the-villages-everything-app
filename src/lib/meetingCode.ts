import { addDays, datesInRange, weekdayOf } from "./calendarCatalog";

/** One published Villages club code, such as QTU@9AM or 1,3M@9AM. */
export type MeetingRule = {
  every: boolean;
  last: boolean;
  weeks: number[];
  weekday: number;
  exceptMonths: number[];
  onlyMonths: number[];
  time: string;
};

const DAY_CODES: [string, number][] = [
  ["SU", 0],
  ["SA", 6],
  ["TH", 4],
  ["TU", 2],
  ["W", 3],
  ["F", 5],
  ["M", 1],
];

const CODE_RE =
  /(?:LAST|Q|(?:\d[&,])*\d)?(?:SU|SA|TH|TU|W|F|M)(?:X[\d,&]+|[\d,&]+)?\s*@\s*[\d:.\s]*(?:AM|PM)?/gi;

function parseClock(raw: string): string {
  const s = raw.replace(/\s+/g, "").replace(/\./g, "").toUpperCase();
  const m = s.match(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?/);
  if (!m) return "";
  let h = Number(m[1]);
  const min = m[2] || "00";
  if (!Number.isFinite(h) || h > 23 || Number(min) > 59) return "";
  if (m[3] === "PM" && h < 12) h += 12;
  if (m[3] === "AM" && h === 12) h = 0;
  if (!m[3] && h <= 6) h += 12;
  return `${String(h).padStart(2, "0")}:${min}`;
}

function monthList(raw: string): number[] {
  const s = raw.replace(/\s+/g, "");
  if (!s) return [];
  const parts = s.includes(",") || s.includes("&") ? s.split(/[&,]/) : null;
  const nums: number[] = [];
  if (parts) {
    for (const part of parts) {
      const n = Number(part);
      if (n >= 1 && n <= 12) nums.push(n);
    }
    return nums;
  }
  if (!/^\d+$/.test(s)) return [];
  if (s.length <= 2) {
    const n = Number(s);
    return n >= 1 && n <= 12 ? [n] : [];
  }
  for (const ch of s) {
    const n = Number(ch);
    if (n >= 1 && n <= 9) nums.push(n);
  }
  return nums;
}

/** Turn one code into a rule. Returns null when the day cannot be read. */
export function parseMeetingCode(raw: string): MeetingRule | null {
  const compact = String(raw || "")
    .replace(/\s+/g, "")
    .toUpperCase()
    .replace(/-?[A-Z]{2}$/, "");
  const at = compact.indexOf("@");
  if (at < 0) return null;
  let left = compact.slice(0, at);
  const time = parseClock(compact.slice(at + 1));
  let every = false;
  let last = false;
  let weeks: number[] = [];
  if (left.startsWith("LAST")) {
    last = true;
    left = left.slice(4);
  } else if (left.startsWith("Q")) {
    every = true;
    left = left.slice(1);
  } else {
    const weeksMatch = left.match(/^((?:\d[&,])*\d)/);
    if (weeksMatch) {
      weeks = weeksMatch[1]
        .split(/[&,]/)
        .map(Number)
        .filter((n) => n >= 1 && n <= 5);
      left = left.slice(weeksMatch[1].length);
    }
  }
  let weekday = -1;
  for (const [code, day] of DAY_CODES) {
    if (left.startsWith(code)) {
      weekday = day;
      left = left.slice(code.length);
      break;
    }
  }
  if (weekday < 0) return null;
  if (!every && !last && !weeks.length) return null;
  let except = false;
  if (left.startsWith("X")) {
    except = true;
    left = left.slice(1);
  }
  const months = monthList(left);
  return {
    every,
    last,
    weeks,
    weekday,
    exceptMonths: except ? months : [],
    onlyMonths: except ? [] : months,
    time,
  };
}

export function meetingCodesInText(text: string): string[] {
  const phrase = String(text || "").match(/Published meeting code:\s*([^.]*)/i);
  const source = phrase ? phrase[1] : String(text || "");
  return source.match(CODE_RE) || [];
}

function nthInMonth(iso: string) {
  return Math.ceil(Number(iso.slice(8, 10)) / 7);
}

function isLastWeekday(iso: string) {
  return addDays(iso, 7).slice(0, 7) !== iso.slice(0, 7);
}

export function datesForRule(rule: MeetingRule, start: string, end: string) {
  const out: { date: string; time: string }[] = [];
  for (const iso of datesInRange(start, end)) {
    if (weekdayOf(iso) !== rule.weekday) continue;
    const month = Number(iso.slice(5, 7));
    if (rule.onlyMonths.length && !rule.onlyMonths.includes(month)) continue;
    if (rule.exceptMonths.includes(month)) continue;
    if (rule.every) {
      out.push({ date: iso, time: rule.time });
      continue;
    }
    if (rule.last) {
      if (isLastWeekday(iso)) out.push({ date: iso, time: rule.time });
      continue;
    }
    if (rule.weeks.includes(nthInMonth(iso))) out.push({ date: iso, time: rule.time });
  }
  return out;
}

/** Expand every readable code in a club description onto dates in the range. */
export function clubMeetingsInRange(description: string, start: string, end: string) {
  const out: { date: string; time: string; code: string }[] = [];
  for (const code of meetingCodesInText(description)) {
    const rule = parseMeetingCode(code);
    if (!rule) continue;
    for (const hit of datesForRule(rule, start, end)) {
      out.push({ ...hit, code: code.replace(/\s+/g, "") });
    }
  }
  return out;
}
