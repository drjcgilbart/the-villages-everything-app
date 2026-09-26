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
  | { type: "stop" }
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

/** Turn one spoken phrase into a gym command. Unknown speech does not change the workout. */
export function parseGymVoice(raw: string): GymVoiceCommand {
  const text = String(raw || "")
    .toLowerCase()
    .replace(/[^a-z0-9.\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!text) return { type: "unknown" };
  if (
    /\b(stop listening|microphone off|mic off|turn off the microphone|turn off microphone|stop microphone|pause listening)\b/.test(
      text
    ) ||
    text === "pause" ||
    text === "stop"
  ) {
    return { type: "stop" };
  }
  if (/\bnext exercise\b|\bnext movement\b/.test(text)) return { type: "next", scope: "exercise" };
  if (/\b(next set|next|skip)\b/.test(text)) return { type: "next", scope: "set" };
  if (/\b(previous|go back|back|last set)\b/.test(text)) return { type: "back" };
  if (/\b(undo|not done|uncheck)\b/.test(text)) return { type: "undo" };
  if (/\b(done|check|finished|complete|got it)\b/.test(text)) return { type: "done" };

  const amount = firstNumber(text);
  if (amount == null || amount < 0 || amount > 999) return { type: "unknown" };
  if (/\b(rest)\b/.test(text)) return { type: "rest", value: Math.round(amount) };
  if (/\b(add|plus|increase|up)\b/.test(text)) return { type: "weightDelta", delta: amount };
  if (/\b(minus|decrease|down|drop|less)\b/.test(text)) return { type: "weightDelta", delta: -amount };
  if (/\b(reps|rep)\b/.test(text)) return { type: "reps", value: Math.round(amount) };
  if (/\b(time|seconds|second|secs|sec)\b/.test(text)) return { type: "time", value: Math.round(amount) };
  if (/\b(weight|pounds|pound|lbs|lb)\b/.test(text)) return { type: "weight", value: amount };
  return { type: "unknown" };
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

function withExerciseSets(lifts: GymLift[], exercise: number, patch: Partial<GymSet>): GymLift[] {
  return lifts.map((lift, i) =>
    i === exercise
      ? { ...lift, sets: lift.sets.map((set) => ({ ...set, ...patch })) }
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
): { lifts: GymLift[]; at: GymVoiceAt; message: string; stop?: boolean } {
  if (!lifts.length || command.type === "unknown") {
    return { lifts, at, message: "Didn’t catch a command." };
  }
  if (command.type === "stop") {
    return { lifts, at, message: "Microphone off.", stop: true };
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
      lifts: withExerciseSets(lifts, cur.exercise, { weight: command.value }),
      at: cur,
      message: `${name} set to ${command.value} pounds.`,
    };
  }
  if (command.type === "weightDelta") {
    const current = Number(lifts[cur.exercise]?.sets[cur.set]?.weight) || 0;
    const value = Math.max(0, Math.round((current + command.delta) * 10) / 10);
    return {
      lifts: withExerciseSets(lifts, cur.exercise, { weight: value }),
      at: cur,
      message: `${name} set to ${value} pounds.`,
    };
  }
  if (command.type === "reps") {
    return {
      lifts: withExerciseSets(lifts, cur.exercise, { reps: command.value }),
      at: cur,
      message: `${name} set to ${command.value} reps.`,
    };
  }
  if (command.type === "time") {
    return {
      lifts: withExerciseSets(lifts, cur.exercise, { seconds: command.value }),
      at: cur,
      message: `${name} set to ${command.value} seconds.`,
    };
  }
  return {
    lifts: withExerciseSets(lifts, cur.exercise, { rest: command.value }),
    at: cur,
    message: `${name} rest set to ${command.value} seconds.`,
  };
}
