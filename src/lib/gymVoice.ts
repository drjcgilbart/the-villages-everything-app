import type { GymLift, GymSet } from "./memberBoardModel";

export type GymVoiceAt = { exercise: number; set: number };

export type GymVoiceCommand =
  | { type: "done" }
  | { type: "undo" }
  | { type: "next"; scope: "set" | "exercise" }
  | { type: "back" }
  | { type: "weight"; value: number }
  | { type: "weightDelta"; delta: number }
  | { type: "reps"; value: number }
  | { type: "time"; value: number }
  | { type: "rest"; value: number }
  | { type: "stopAlarm" }
  | { type: "stopBare" }
  | { type: "stop" }
  | { type: "show"; kind: "video" | "pictures" }
  | { type: "close"; kind: "video" | "pictures" }
  | { type: "finish" }
  | { type: "unknown" };

const ONES: Record<string, number> = {
  zero: 0,
  oh: 0,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  eleven: 11,
  twelve: 12,
  thirteen: 13,
  fourteen: 14,
  fifteen: 15,
  sixteen: 16,
  seventeen: 17,
  eighteen: 18,
  nineteen: 19,
};

const TENS: Record<string, number> = {
  twenty: 20,
  thirty: 30,
  forty: 40,
  fifty: 50,
  sixty: 60,
  seventy: 70,
  eighty: 80,
  ninety: 90,
};

function wordsToNumber(phrase: string): number | null {
  const parts = phrase.toLowerCase().split(/[\s-]+/).filter(Boolean);
  if (parts.length === 1 && ONES[parts[0]] != null) return ONES[parts[0]];
  if (parts.length === 1 && TENS[parts[0]] != null) return TENS[parts[0]];
  if (parts.length === 2 && TENS[parts[0]] != null && ONES[parts[1]] != null) {
    return TENS[parts[0]] + ONES[parts[1]];
  }
  return null;
}

function firstNumber(text: string): number | null {
  const digit = text.match(/\d+(?:\.\d+)?/);
  if (digit) return Number(digit[0]);
  const tokens = text.toLowerCase().split(/\s+/).filter(Boolean);
  for (let i = 0; i < tokens.length; i++) {
    if (TENS[tokens[i]] != null) {
      const two = wordsToNumber(tokens.slice(i, i + 2).join(" "));
      if (two != null) return two;
    }
    const one = wordsToNumber(tokens[i]);
    if (one != null) return one;
  }
  return null;
}

const WEIGHT_WORDS = new Set(["weight", "pounds", "pound", "lbs", "lb"]);
const REP_WORDS = new Set(["reps", "rep"]);
const TIME_WORDS = new Set(["time", "seconds", "second", "secs", "sec"]);
const UP_WORDS = new Set(["add", "plus", "increase", "up"]);
const DOWN_WORDS = new Set(["minus", "decrease", "down", "drop", "less"]);

type VoiceTok = { kind: "num"; value: number } | { kind: "word"; value: string };

function normalizeVoice(raw: string) {
  return String(raw || "")
    .toLowerCase()
    .replace(/[^a-z0-9.\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** True when the phrase is asking to cancel the rest countdown or its alarm. */
export function isRestCancelPhrase(raw: string) {
  const text = normalizeVoice(raw);
  if (!text) return false;
  return /\b(stop|cancel|silence|end)\b/.test(text) && /\b(timer|alarm)\b/.test(text);
}

function isStopPhrase(text: string) {
  return (
    /\b(stop listening|microphone off|mic off|turn off the microphone|turn off microphone|stop microphone|pause listening)\b/.test(
      text
    ) ||
    text === "pause"
  );
}

function tokenizeVoice(text: string): VoiceTok[] {
  const raw = text.split(/\s+/).filter(Boolean);
  const out: VoiceTok[] = [];
  for (let i = 0; i < raw.length; i++) {
    if (TENS[raw[i]] != null && ONES[raw[i + 1]] != null) {
      out.push({ kind: "num", value: TENS[raw[i]] + ONES[raw[i + 1]] });
      i += 1;
      continue;
    }
    if (/^\d+(?:\.\d+)?$/.test(raw[i])) {
      out.push({ kind: "num", value: Number(raw[i]) });
      continue;
    }
    const one = wordsToNumber(raw[i]);
    if (one != null) {
      out.push({ kind: "num", value: one });
      continue;
    }
    out.push({ kind: "word", value: raw[i] });
  }
  return out;
}

function inRange(n: number) {
  return n >= 0 && n <= 999;
}

function skipFillers(tokens: VoiceTok[], index: number) {
  let j = index;
  while (j < tokens.length) {
    const tok = tokens[j];
    if (tok?.kind !== "word") break;
    if (!["the", "a", "an", "me", "my", "some", "this"].includes(tok.value)) break;
    j += 1;
  }
  return j;
}

function mediaKind(word: string): "video" | "pictures" | null {
  if (word === "video" || word === "videos") return "video";
  if (
    word === "picture" ||
    word === "pictures" ||
    word === "pic" ||
    word === "pics" ||
    word === "photo" ||
    word === "photos" ||
    word === "image" ||
    word === "images"
  ) {
    return "pictures";
  }
  return null;
}

/** Turn one spoken phrase into the commands it contains, in order. */
export function parseGymVoiceSequence(raw: string): GymVoiceCommand[] {
  const text = normalizeVoice(raw);
  if (!text) return [{ type: "unknown" }];
  if (text === "stop") return [{ type: "stopBare" }];
  if (isStopPhrase(text)) return [{ type: "stop" }];

  const tokens = tokenizeVoice(text);
  const commands: GymVoiceCommand[] = [];
  let i = 0;
  while (i < tokens.length) {
    const tok = tokens[i];
    if (tok.kind === "word") {
      const next = tokens[i + 1];
      if (tok.value === "stop" || tok.value === "silence" || tok.value === "cancel") {
        let j = i + 1;
        const filler = tokens[j];
        if (filler?.kind === "word" && (filler.value === "the" || filler.value === "my")) j += 1;
        const what = tokens[j];
        if (what?.kind === "word" && (what.value === "alarm" || what.value === "timer" || what.value === "rest" || what.value === "now")) {
          commands.push({ type: "stopAlarm" });
          i = j + 1;
          continue;
        }
      }
      if (tok.value === "alarm" && next?.kind === "word" && next.value === "off") {
        commands.push({ type: "stopAlarm" });
        i += 2;
        continue;
      }
      if (tok.value === "next" && next?.kind === "word" && (next.value === "exercise" || next.value === "movement")) {
        commands.push({ type: "next", scope: "exercise" });
        i += 2;
        continue;
      }
      if (tok.value === "next" && next?.kind === "word" && next.value === "set") {
        commands.push({ type: "next", scope: "set" });
        i += 2;
        continue;
      }
      if (tok.value === "next" || tok.value === "skip") {
        commands.push({ type: "next", scope: "set" });
        i += 1;
        continue;
      }
      if (tok.value === "go" && next?.kind === "word" && next.value === "back") {
        commands.push({ type: "back" });
        i += 2;
        continue;
      }
      if (tok.value === "last" && next?.kind === "word" && next.value === "set") {
        commands.push({ type: "back" });
        i += 2;
        continue;
      }
      if (tok.value === "back" || tok.value === "previous") {
        commands.push({ type: "back" });
        i += 1;
        continue;
      }
      if (tok.value === "undo" || tok.value === "uncheck" || (tok.value === "not" && next?.kind === "word" && next.value === "done")) {
        commands.push({ type: "undo" });
        i += tok.value === "not" ? 2 : 1;
        continue;
      }
      if (tok.value === "show" || tok.value === "open" || tok.value === "play") {
        const what = tokens[skipFillers(tokens, i + 1)];
        const kind = what?.kind === "word" ? mediaKind(what.value) : null;
        if (kind) {
          commands.push({ type: "show", kind });
          i = tokens.indexOf(what) + 1;
          continue;
        }
      }
      if (tok.value === "close" || tok.value === "hide") {
        const what = tokens[skipFillers(tokens, i + 1)];
        const kind = what?.kind === "word" ? mediaKind(what.value) : null;
        if (kind) {
          commands.push({ type: "close", kind });
          i = tokens.indexOf(what) + 1;
          continue;
        }
        commands.push({ type: "close", kind: "video" });
        commands.push({ type: "close", kind: "pictures" });
        i += 1;
        continue;
      }
      if (tok.value === "finish" || tok.value === "finished" || tok.value === "end") {
        const what = tokens[skipFillers(tokens, i + 1)];
        if (
          what?.kind === "word" &&
          (what.value === "workout" || what.value === "routine" || what.value === "session")
        ) {
          commands.push({ type: "finish" });
          i = tokens.indexOf(what) + 1;
          continue;
        }
      }
      if (tok.value === "done" || tok.value === "finished" || tok.value === "complete" || (tok.value === "got" && next?.kind === "word" && next.value === "it") || tok.value === "check") {
        commands.push({ type: "done" });
        i += tok.value === "got" ? 2 : 1;
        continue;
      }
      if (tok.value === "rest") {
        let j = i + 1;
        const filler = tokens[j];
        if (filler?.kind === "word" && (filler.value === "for" || filler.value === "of")) j += 1;
        const num = tokens[j];
        if (num?.kind === "num" && inRange(num.value)) {
          commands.push({ type: "rest", value: Math.round(num.value) });
          j += 1;
          const unit = tokens[j];
          if (unit?.kind === "word" && (TIME_WORDS.has(unit.value) || unit.value === "rest")) j += 1;
          i = j;
          continue;
        }
      }
      if (next?.kind === "num" && inRange(next.value)) {
        if (UP_WORDS.has(tok.value)) {
          commands.push({ type: "weightDelta", delta: next.value });
          i += 2;
          const unit = tokens[i];
          if (unit?.kind === "word" && WEIGHT_WORDS.has(unit.value)) i += 1;
          continue;
        }
        if (DOWN_WORDS.has(tok.value)) {
          commands.push({ type: "weightDelta", delta: -next.value });
          i += 2;
          const unit = tokens[i];
          if (unit?.kind === "word" && WEIGHT_WORDS.has(unit.value)) i += 1;
          continue;
        }
        if (REP_WORDS.has(tok.value)) {
          commands.push({ type: "reps", value: Math.round(next.value) });
          i += 2;
          continue;
        }
        if (TIME_WORDS.has(tok.value)) {
          commands.push({ type: "time", value: Math.round(next.value) });
          i += 2;
          continue;
        }
        if (WEIGHT_WORDS.has(tok.value)) {
          commands.push({ type: "weight", value: next.value });
          i += 2;
          continue;
        }
      }
      i += 1;
      continue;
    }

    const unit = tokens[i + 1];
    if (unit?.kind === "word" && inRange(tok.value)) {
      if (WEIGHT_WORDS.has(unit.value)) {
        commands.push({ type: "weight", value: tok.value });
        i += 2;
        continue;
      }
      if (REP_WORDS.has(unit.value)) {
        commands.push({ type: "reps", value: Math.round(tok.value) });
        i += 2;
        continue;
      }
      if (unit.value === "rest") {
        commands.push({ type: "rest", value: Math.round(tok.value) });
        i += 2;
        continue;
      }
      if (TIME_WORDS.has(unit.value)) {
        const after = tokens[i + 2];
        if (after?.kind === "word" && after.value === "rest") {
          commands.push({ type: "rest", value: Math.round(tok.value) });
          i += 3;
          continue;
        }
        commands.push({ type: "time", value: Math.round(tok.value) });
        i += 2;
        continue;
      }
    }
    i += 1;
  }
  return commands.length ? commands : [{ type: "unknown" }];
}

/** Turn one spoken phrase into a gym command. Unknown speech does not change the workout. */
export function parseGymVoice(raw: string): GymVoiceCommand {
  return parseGymVoiceSequence(raw)[0] || { type: "unknown" };
}

function clampAt(lifts: GymLift[], at: GymVoiceAt): GymVoiceAt {
  const exercise = Math.min(Math.max(0, at.exercise), Math.max(0, lifts.length - 1));
  const sets = lifts[exercise]?.sets.length || 1;
  return { exercise, set: Math.min(Math.max(0, at.set), sets - 1) };
}

function withSet(lifts: GymLift[], at: GymVoiceAt, patch: Partial<GymSet>): GymLift[] {
  return lifts.map((lift, i) =>
    i === at.exercise
      ? {
          ...lift,
          sets: lift.sets.map((set, j) => (j === at.set ? { ...set, ...patch } : set)),
        }
      : lift
  );
}

function step(lifts: GymLift[], at: GymVoiceAt, dir: 1 | -1): GymVoiceAt {
  const cur = clampAt(lifts, at);
  let exercise = cur.exercise;
  let set = cur.set + dir;
  while (exercise >= 0 && exercise < lifts.length) {
    const count = lifts[exercise].sets.length;
    if (set >= 0 && set < count) return { exercise, set };
    if (dir > 0) {
      exercise += 1;
      set = 0;
    } else {
      exercise -= 1;
      set = (lifts[exercise]?.sets.length || 1) - 1;
    }
  }
  return cur;
}

export function applyGymVoice(
  lifts: GymLift[],
  at: GymVoiceAt,
  command: GymVoiceCommand
): {
  lifts: GymLift[];
  at: GymVoiceAt;
  message: string;
  stop?: boolean;
  restSeconds?: number;
  stopAlarm?: boolean;
} {
  if (!lifts.length || command.type === "unknown") {
    return { lifts, at, message: "Didn’t catch a command." };
  }
  if (command.type === "stop") {
    return { lifts, at, message: "Microphone off.", stop: true };
  }
  if (command.type === "stopAlarm" || command.type === "stopBare") {
    return { lifts, at, message: "Timer stopped.", stopAlarm: true };
  }
  if (command.type === "show") {
    return {
      lifts,
      at,
      message: command.kind === "video" ? "Playing the video." : "Showing the pictures.",
    };
  }
  if (command.type === "close") {
    return {
      lifts,
      at,
      message: command.kind === "video" ? "Video closed." : "Pictures closed.",
    };
  }
  if (command.type === "finish") {
    return { lifts, at, message: "Workout finished." };
  }
  const cur = clampAt(lifts, at);
  const name = lifts[cur.exercise]?.name || "Exercise";

  if (command.type === "next") {
    const next =
      command.scope === "exercise"
        ? { exercise: Math.min(lifts.length - 1, cur.exercise + 1), set: 0 }
        : step(lifts, cur, 1);
    const label = lifts[next.exercise]?.name || name;
    return {
      lifts,
      at: next,
      message:
        command.scope === "exercise"
          ? `Next exercise: ${label}.`
          : `${label}, set ${next.set + 1}.`,
    };
  }
  if (command.type === "back") {
    const next = step(lifts, cur, -1);
    return { lifts, at: next, message: `${lifts[next.exercise]?.name || name}, set ${next.set + 1}.` };
  }
  if (command.type === "done") {
    const target = lifts[cur.exercise]?.sets[cur.set]?.done ? step(lifts, cur, 1) : cur;
    const nextLifts = withSet(lifts, target, { done: true });
    const after = step(nextLifts, target, 1);
    const moved = after.exercise !== target.exercise || after.set !== target.set;
    return {
      lifts: nextLifts,
      at: moved ? after : target,
      message: moved
        ? `${lifts[target.exercise]?.name || name} set ${target.set + 1} done. Next is ${nextLifts[after.exercise]?.name || name}, set ${after.set + 1}.`
        : `${name} set ${target.set + 1} done.`,
    };
  }
  if (command.type === "undo") {
    return {
      lifts: withSet(lifts, cur, { done: false }),
      at: cur,
      message: `${name} set ${cur.set + 1} is open again.`,
    };
  }
  if (command.type === "weight") {
    return {
      lifts: withSet(lifts, cur, { weight: command.value }),
      at: cur,
      message: `${name}, set ${cur.set + 1}: ${command.value} pounds.`,
    };
  }
  if (command.type === "weightDelta") {
    const current = Number(lifts[cur.exercise]?.sets[cur.set]?.weight) || 0;
    const value = Math.max(0, Math.round((current + command.delta) * 10) / 10);
    return {
      lifts: withSet(lifts, cur, { weight: value }),
      at: cur,
      message: `${name}, set ${cur.set + 1}: ${value} pounds.`,
    };
  }
  if (command.type === "reps") {
    return {
      lifts: withSet(lifts, cur, { reps: command.value }),
      at: cur,
      message: `${name}, set ${cur.set + 1}: ${command.value} reps.`,
    };
  }
  if (command.type === "time") {
    return {
      lifts: withSet(lifts, cur, { seconds: command.value }),
      at: cur,
      message: `${name}, set ${cur.set + 1}: ${command.value} seconds.`,
    };
  }
  return {
    lifts,
    at: cur,
    message: `Resting ${command.value} seconds.`,
    restSeconds: command.value,
  };
}

/** Apply every command in one phrase. Each number stays on the set you are on. */
export function applyGymVoiceSequence(
  lifts: GymLift[],
  at: GymVoiceAt,
  commands: GymVoiceCommand[]
): {
  lifts: GymLift[];
  at: GymVoiceAt;
  message: string;
  stop?: boolean;
  timer: "stop" | { seconds: number } | null;
} {
  if (!commands.length) return { ...applyGymVoice(lifts, at, { type: "unknown" }), timer: null };
  let liftsNow = lifts;
  let atNow = at;
  const notes: string[] = [];
  let stop = false;
  let timer: "stop" | { seconds: number } | null = null;
  for (const command of commands) {
    const result = applyGymVoice(liftsNow, atNow, command);
    liftsNow = result.lifts;
    atNow = result.at;
    if (result.message) notes.push(result.message);
    if (result.stopAlarm) timer = "stop";
    if (result.restSeconds) timer = { seconds: result.restSeconds };
    if (result.stop) {
      stop = true;
      break;
    }
  }
  return { lifts: liftsNow, at: atNow, message: notes.join(" "), stop, timer };
}
