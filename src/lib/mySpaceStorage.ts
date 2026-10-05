/** Shared localStorage helpers for My Space member modules (this browser only). */

import { isNativeAppShell } from "@/lib/nativeAppShell";

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

/** Soft built-in tones, plus a sound chosen from the phone. */
export type AlarmTone = "classic" | "chime" | "urgent" | "digital" | "phone";

export type PhoneAlarmSound = { title: string; uri: string };

export const ALARM_TONE_OPTIONS: { id: Exclude<AlarmTone, "phone">; label: string; hint: string }[] = [
  { id: "classic", label: "Classic beep", hint: "Two soft beeps" },
  { id: "chime", label: "Soft chime", hint: "Gentle rising notes" },
  { id: "urgent", label: "Urgent alert", hint: "Quicker soft beeps" },
  { id: "digital", label: "Digital pulse", hint: "Stepped rising tones" },
];

export function knownAlarmTone(value: unknown): AlarmTone {
  if (value === "classic" || value === "chime" || value === "urgent" || value === "digital" || value === "phone") {
    return value;
  }
  return "classic";
}

const TONE_STEPS: Record<Exclude<AlarmTone, "phone">, { freq: number; gap: number; len: number }[]> = {
  classic: [
    { freq: 523, gap: 160, len: 160 },
    { freq: 659, gap: 280, len: 220 },
  ],
  chime: [
    { freq: 523, gap: 90, len: 180 },
    { freq: 659, gap: 90, len: 180 },
    { freq: 784, gap: 360, len: 280 },
  ],
  urgent: [
    { freq: 698, gap: 80, len: 70 },
    { freq: 698, gap: 80, len: 70 },
    { freq: 784, gap: 220, len: 90 },
  ],
  digital: [
    { freq: 440, gap: 70, len: 90 },
    { freq: 554, gap: 70, len: 90 },
    { freq: 659, gap: 280, len: 160 },
  ],
};

const phoneAlarmWaiters = new Set<(sounds: PhoneAlarmSound[]) => void>();
let phoneAlarmSounds: PhoneAlarmSound[] = [];

function onPhoneAlarmSounds(event: Event) {
  const detail = (event as CustomEvent<PhoneAlarmSound[]>).detail;
  phoneAlarmSounds = Array.isArray(detail)
    ? detail.filter((row) => row && typeof row.uri === "string" && typeof row.title === "string")
    : [];
  phoneAlarmWaiters.forEach((waiter) => waiter(phoneAlarmSounds));
}

/** Ask the Android app for the alarm sounds already on the phone. */
let phoneAlarmListening = false;

export function requestPhoneAlarmSounds(): void {
  if (typeof window === "undefined") return;
  if (!phoneAlarmListening) {
    phoneAlarmListening = true;
    window.addEventListener("tvea-phone-alarms", onPhoneAlarmSounds);
  }
  if (!androidShellPlaysAlarms()) return;
  postShellAlarm({ action: "sounds" });
}

export function subscribePhoneAlarmSounds(waiter: (sounds: PhoneAlarmSound[]) => void): () => void {
  phoneAlarmWaiters.add(waiter);
  waiter(phoneAlarmSounds);
  return () => {
    phoneAlarmWaiters.delete(waiter);
  };
}

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

type AlarmShellWindow = Window & {
  ReactNativeWebView?: { postMessage: (data: string) => void };
  VillagesAndroidAlarm?: boolean;
};

/** True only in the Android app build that plays on the alarm stream. */
export function androidShellPlaysAlarms(): boolean {
  if (typeof window === "undefined" || !androidPhone() || !isNativeAppShell()) return false;
  const shell = window as AlarmShellWindow;
  return Boolean(shell.VillagesAndroidAlarm && shell.ReactNativeWebView?.postMessage);
}

function postShellAlarm(payload: Record<string, unknown>) {
  const shell = window as AlarmShellWindow;
  shell.ReactNativeWebView?.postMessage(JSON.stringify({ type: "tvea-alarm", ...payload }));
}

/** Heads-up for a real alarm. Short “hear it” previews do not call this. */
export function showAndroidShellAlarm(title: string, detail: string): void {
  if (!androidShellPlaysAlarms()) return;
  postShellAlarm({ action: "show", title, detail });
}

export function stopAndroidShellAlarm(): void {
  if (!androidShellPlaysAlarms()) return;
  postShellAlarm({ action: "stop" });
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

function toneSteps(tone: AlarmTone) {
  if (tone === "phone") return TONE_STEPS.chime;
  return TONE_STEPS[tone] || TONE_STEPS.chime;
}

function toneSamples(tone: AlarmTone): Float32Array {
  const rate = 22050;
  const amp = tone === "urgent" ? 0.2 : tone === "classic" ? 0.15 : 0.11;
  const steps = toneSteps(tone);
  const chunks: Float32Array[] = [];
  for (const step of steps) {
    const count = Math.max(1, Math.floor((step.len / 1000) * rate));
    const beep = new Float32Array(count);
    const fadeN = Math.max(1, Math.floor(rate * 0.012));
    for (let i = 0; i < count; i++) {
      const wave = Math.sin((2 * Math.PI * step.freq * i) / rate);
      const edge = Math.min(i, count - 1 - i, fadeN);
      beep[i] = wave * amp * (edge / fadeN);
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
  const steps = toneSteps(tone);

  const schedule = (when: number) => {
    if (cancelled || Date.now() >= stopAt) return;
    let cursor = when;
    for (const step of steps) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(step.freq, cursor);
      gain.gain.setValueAtTime(tone === "urgent" ? 0.16 : 0.1, cursor);
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
  tone: AlarmTone = "chime",
  durationSec = 2,
  volume = 0.06,
  uri = ""
): () => void {
  if (typeof window === "undefined") return () => {};
  if (androidShellPlaysAlarms()) {
    const seconds = Math.min(300, Math.max(1, durationSec));
    postShellAlarm({
      action: "start",
      seconds,
      tone: tone === "phone" ? "phone" : tone,
      uri: tone === "phone" ? uri : "",
    });
    return () => postShellAlarm({ action: "stop" });
  }
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
    osc.type = "sine";
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
    const steps = toneSteps(tone);
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
