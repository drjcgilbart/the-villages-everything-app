/** Shared localStorage helpers for My Space member modules (this browser only). */

export function todayKeyEastern(): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const y = parts.find((p) => p.type === "year")?.value;
  const m = parts.find((p) => p.type === "month")?.value;
  const d = parts.find((p) => p.type === "day")?.value;
  return `${y}-${m}-${d}`;
}

export function nowTimeEastern(): string {
  return new Date().toLocaleTimeString("en-GB", {
    timeZone: "America/New_York",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function uid(prefix = "id"): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
  }
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function readJsonStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeJsonStorage(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota */
  }
}

/** Simple Web Audio beeps for med/pet alarms (no audio files required). */
export type AlarmTone = "classic" | "chime" | "urgent" | "digital";

export function playAlarmTone(
  tone: AlarmTone = "classic",
  durationSec = 2
): () => void {
  if (typeof window === "undefined") return () => {};
  let ctx: AudioContext;
  try {
    ctx = new AudioContext();
  } catch {
    return () => {};
  }

  const stopAt = Date.now() + Math.min(30, Math.max(1, durationSec)) * 1000;
  let cancelled = false;
  let timer: ReturnType<typeof setTimeout> | null = null;

  const patterns: Record<AlarmTone, { freq: number; gap: number; len: number }[]> = {
    classic: [
      { freq: 880, gap: 200, len: 120 },
      { freq: 880, gap: 200, len: 120 },
    ],
    chime: [
      { freq: 523, gap: 180, len: 200 },
      { freq: 659, gap: 180, len: 200 },
      { freq: 784, gap: 400, len: 280 },
    ],
    urgent: [
      { freq: 990, gap: 90, len: 80 },
      { freq: 990, gap: 90, len: 80 },
      { freq: 990, gap: 90, len: 80 },
    ],
    digital: [
      { freq: 440, gap: 100, len: 60 },
      { freq: 660, gap: 100, len: 60 },
      { freq: 880, gap: 150, len: 80 },
    ],
  };

  function beep(freq: number, len: number) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "square";
    osc.frequency.value = freq;
    gain.gain.value = 0.06;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    setTimeout(() => {
      try {
        osc.stop();
      } catch {
        /* closed */
      }
    }, len);
  }

  function cycle() {
    if (cancelled || Date.now() >= stopAt) {
      try {
        ctx.close();
      } catch {
        /* */
      }
      return;
    }
    const steps = patterns[tone] || patterns.classic;
    let delay = 0;
    for (const step of steps) {
      setTimeout(() => {
        if (!cancelled) beep(step.freq, step.len);
      }, delay);
      delay += step.gap + step.len;
    }
    timer = setTimeout(cycle, delay + 400);
  }

  void ctx.resume().then(cycle).catch(() => {});

  return () => {
    cancelled = true;
    if (timer) clearTimeout(timer);
    try {
      ctx.close();
    } catch {
      /* */
    }
  };
}
