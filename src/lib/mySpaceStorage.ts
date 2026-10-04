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

/** True when a scheduled clock time is this minute, or up to two minutes late. */
export function clockIsDue(slot: string, now = nowTimeEastern(), graceMinutes = 2): boolean {
  const toMin = (value: string) => {
    const match = String(value || "").trim().match(/^(\d{1,2}):(\d{2})/);
    if (!match) return null;
    const hour = Number(match[1]);
    const minute = Number(match[2]);
    if (hour > 23 || minute > 59) return null;
    return hour * 60 + minute;
  };
  const slotMin = toMin(slot);
  const nowMin = toMin(now);
  if (slotMin == null || nowMin == null) return false;
  let ago = nowMin - slotMin;
  if (ago < 0) ago += 24 * 60;
  return ago <= graceMinutes;
}

/** Simple Web Audio beeps for med/pet alarms (no audio files required). */
export type AlarmTone = "classic" | "chime" | "urgent" | "digital";

export const ALARM_TONE_OPTIONS: { id: AlarmTone; label: string; hint: string }[] = [
  { id: "classic", label: "Classic beep", hint: "Windows-style two-beep" },
  { id: "chime", label: "Soft chime", hint: "Gentle rising notes" },
  { id: "urgent", label: "Urgent alert", hint: "Fast repeating beep" },
  { id: "digital", label: "Digital pulse", hint: "Stepped rising tones" },
];

const TONE_STEPS: Record<AlarmTone, { freq: number; gap: number; len: number }[]> = {
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

let unlockInstalled = false;
let audioPrimed = false;
let audioPriming = false;
let sharedCtx: AudioContext | null = null;
let phoneSpeaker: HTMLAudioElement | null = null;
let silentUrl = "";
const phoneLoopUrls = new Map<AlarmTone, string>();

function androidPhone(): boolean {
  return typeof navigator !== "undefined" && /Android/i.test(navigator.userAgent);
}

function audioContextCtor(): typeof AudioContext | null {
  if (typeof window === "undefined") return null;
  const webkit = window as Window & { webkitAudioContext?: typeof AudioContext };
  return window.AudioContext || webkit.webkitAudioContext || null;
}

function sharedAudio(): AudioContext | null {
  const Ctor = audioContextCtor();
  if (!Ctor) return null;
  if (!sharedCtx || sharedCtx.state === "closed") {
    try {
      sharedCtx = new Ctor();
    } catch {
      return null;
    }
  }
  return sharedCtx;
}

function silentWavUrl(): string {
  if (silentUrl) return silentUrl;
  const rate = 8000;
  const samples = new Float32Array(rate / 10);
  silentUrl = URL.createObjectURL(wavBlob(samples, rate));
  return silentUrl;
}

function wavBlob(samples: Float32Array, rate: number): Blob {
  const bytes = samples.length * 2;
  const buffer = new ArrayBuffer(44 + bytes);
  const view = new DataView(buffer);
  const write = (offset: number, text: string) => {
    for (let i = 0; i < text.length; i++) view.setUint8(offset + i, text.charCodeAt(i));
  };
  write(0, "RIFF");
  view.setUint32(4, 36 + bytes, true);
  write(8, "WAVE");
  write(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, rate, true);
  view.setUint32(28, rate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  write(36, "data");
  view.setUint32(40, bytes, true);
  let offset = 44;
  for (let i = 0; i < samples.length; i++) {
    const shaped = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, shaped < 0 ? shaped * 0x8000 : shaped * 0x7fff, true);
    offset += 2;
  }
  return new Blob([buffer], { type: "audio/wav" });
}

function toneSamples(tone: AlarmTone): Float32Array {
  const rate = 22050;
  const amp = 0.62;
  const steps = TONE_STEPS[tone] || TONE_STEPS.classic;
  const chunks: Float32Array[] = [];
  for (const step of steps) {
    const count = Math.max(1, Math.floor((step.len / 1000) * rate));
    const beep = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const on = Math.sin((2 * Math.PI * step.freq * i) / rate) >= 0 ? 1 : -1;
      beep[i] = on * amp;
    }
    const fade = Math.min(count, Math.floor(rate * 0.008));
    for (let i = 0; i < fade; i++) {
      const gain = i / fade;
      beep[i] *= gain;
      beep[count - 1 - i] *= gain;
    }
    chunks.push(beep);
    chunks.push(new Float32Array(Math.max(1, Math.floor((step.gap / 1000) * rate))));
  }
  chunks.push(new Float32Array(Math.floor(rate * 0.35)));
  const total = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
  const joined = new Float32Array(total);
  let cursor = 0;
  for (const chunk of chunks) {
    joined.set(chunk, cursor);
    cursor += chunk.length;
  }
  return joined;
}

function phoneLoopUrl(tone: AlarmTone): string {
  const cached = phoneLoopUrls.get(tone);
  if (cached) return cached;
  const url = URL.createObjectURL(wavBlob(toneSamples(tone), 22050));
  phoneLoopUrls.set(tone, url);
  return url;
}

function phoneElement(): HTMLAudioElement | null {
  if (typeof Audio === "undefined") return null;
  if (!phoneSpeaker) {
    phoneSpeaker = new Audio();
    phoneSpeaker.setAttribute("playsinline", "true");
    phoneSpeaker.preload = "auto";
  }
  return phoneSpeaker;
}

/** Call from a tap so Android will allow a later alarm to use the speaker. */
export function primeAlarmAudio(): void {
  if (typeof window === "undefined") return;
  const ctx = sharedAudio();
  if (ctx && ctx.state !== "running") {
    try {
      const buffer = ctx.createBuffer(1, 1, 22050);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start(0);
      void ctx.resume();
    } catch {
      /* the speaker element below is the Android path */
    }
  }
  const el = phoneElement();
  if (!el) return;
  // A timer may have started the alarm before Android allowed sound.
  // Play again inside this tap so the same element can keep ringing.
  if (el.dataset.alarm === "1") {
    el.muted = false;
    el.volume = 1;
    void el.play()?.catch(() => {});
    return;
  }
  if (audioPrimed || audioPriming) return;
  audioPriming = true;
  try {
    el.src = silentWavUrl();
    const started = el.play();
    if (!started) {
      audioPriming = false;
      return;
    }
    void started.then(() => {
      audioPriming = false;
      audioPrimed = true;
      if (el.dataset.alarm === "1") return;
      el.pause();
    }).catch(() => {
      audioPriming = false;
    });
  } catch {
    audioPriming = false;
  }
}

export function installAlarmAudioUnlock(): void {
  if (unlockInstalled || typeof window === "undefined") return;
  unlockInstalled = true;
  const kick = () => primeAlarmAudio();
  window.addEventListener("pointerdown", kick, { capture: true, passive: true });
  window.addEventListener("touchend", kick, { capture: true, passive: true });
  window.addEventListener("keydown", kick, { capture: true });
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") void sharedCtx?.resume();
  });
}

/** Android notification should ding only when the page itself cannot play. */
export function alarmNotifySilently(): boolean {
  if (!androidPhone()) return true;
  return typeof document === "undefined" || document.visibilityState !== "hidden";
}

function playAndroidOscillators(tone: AlarmTone, stopAt: number): () => void {
  const ctx = sharedAudio();
  if (!ctx) return () => {};
  void ctx.resume();
  let cancelled = false;
  const oscillators: OscillatorNode[] = [];
  const steps = TONE_STEPS[tone] || TONE_STEPS.classic;

  const schedule = (when: number) => {
    if (cancelled || Date.now() >= stopAt) return;
    let cursor = when;
    for (const step of steps) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(step.freq, cursor);
      gain.gain.setValueAtTime(0.45, cursor);
      osc.connect(gain);
      gain.connect(ctx.destination);
      const end = cursor + step.len / 1000;
      osc.start(cursor);
      osc.stop(end);
      oscillators.push(osc);
      cursor += (step.len + step.gap) / 1000;
    }
    const wait = Math.max(200, (cursor + 0.4 - ctx.currentTime) * 1000);
    window.setTimeout(() => schedule(ctx.currentTime + 0.05), wait);
  };
  schedule(ctx.currentTime + 0.02);
  return () => {
    cancelled = true;
    for (const osc of oscillators) {
      try {
        osc.stop();
      } catch {
        /* already stopped */
      }
    }
  };
}

function playAndroidAlarm(tone: AlarmTone, durationSec: number): () => void {
  primeAlarmAudio();
  const el = phoneElement();
  const stopAt = Date.now() + Math.min(300, Math.max(1, durationSec)) * 1000;
  let cancelled = false;
  let starting = false;
  let oscStop: (() => void) | null = null;
  const kick = () => {
    if (cancelled || starting) return;
    if (!el) {
      if (!oscStop) oscStop = playAndroidOscillators(tone, stopAt);
      return;
    }
    el.loop = true;
    el.volume = 1;
    el.muted = false;
    el.dataset.alarm = "1";
    if (el.dataset.tone !== tone) {
      el.dataset.tone = tone;
      el.src = phoneLoopUrl(tone);
    }
    starting = true;
    const started = el.play();
    if (!started) {
      starting = false;
      return;
    }
    void started.then(() => {
      starting = false;
    }).catch(() => {
      starting = false;
      if (!cancelled && !oscStop) oscStop = playAndroidOscillators(tone, stopAt);
    });
  };
  kick();
  const timer = window.setInterval(() => {
    if (cancelled || Date.now() >= stopAt) {
      finish();
      return;
    }
    if (!el || (el.paused && !starting)) kick();
  }, 1000);
  const onWake = () => {
    if (document.visibilityState === "visible") {
      void sharedCtx?.resume();
      kick();
    }
  };
  document.addEventListener("visibilitychange", onWake);
  function finish() {
    if (cancelled) return;
    cancelled = true;
    window.clearInterval(timer);
    document.removeEventListener("visibilitychange", onWake);
    oscStop?.();
    if (el && el.dataset.alarm === "1") {
      el.pause();
      el.dataset.alarm = "";
      el.dataset.tone = "";
    }
  }
  return finish;
}

export function playAlarmTone(
  tone: AlarmTone = "classic",
  durationSec = 2,
  volume = 0.06
): () => void {
  if (typeof window === "undefined") return () => {};
  installAlarmAudioUnlock();
  if (androidPhone()) return playAndroidAlarm(tone, durationSec);
  let ctx: AudioContext;
  try {
    ctx = new AudioContext();
  } catch {
    return () => {};
  }

  const stopAt = Date.now() + Math.min(300, Math.max(1, durationSec)) * 1000;
  let cancelled = false;
  let timer: ReturnType<typeof setTimeout> | null = null;

  function beep(freq: number, len: number) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "square";
    osc.frequency.value = freq;
    gain.gain.value = volume;
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
    const steps = TONE_STEPS[tone] || TONE_STEPS.classic;
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
