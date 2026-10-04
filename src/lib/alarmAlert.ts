"use client";

import { alarmNotifySilently, playAlarmTone, type AlarmTone } from "@/lib/mySpaceStorage";

export type AlarmSource = "health" | "pet" | "gym";

export type AlarmView = {
  id: string;
  title: string;
  detail: string;
  source: AlarmSource;
};

type AlarmRecord = AlarmView & {
  stop: () => void;
  onDismiss?: () => void;
};

type Listener = (alert: AlarmView | null) => void;

const listeners = new Set<Listener>();
let current: AlarmRecord | null = null;
let dismissing = false;
let savedTitle: string | null = null;
let fallbackNote: Notification | null = null;
let stopListenerOn = false;

const NOTE_TAG = "tvea-alarm";

function viewOf(row: AlarmRecord): AlarmView {
  return { id: row.id, title: row.title, detail: row.detail, source: row.source };
}

function emit() {
  const snap = current ? viewOf(current) : null;
  for (const fn of listeners) fn(snap);
}

export function subscribeAlarm(fn: Listener): () => void {
  listeners.add(fn);
  fn(current ? viewOf(current) : null);
  return () => {
    listeners.delete(fn);
  };
}

export function ensureAlarmStopListener(): void {
  if (stopListenerOn || typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;
  stopListenerOn = true;
  navigator.serviceWorker.addEventListener("message", (event: MessageEvent) => {
    const data = event.data as { type?: string } | null;
    if (data?.type === "tvea-alarm-stop") dismissAlarm();
  });
}

function flashTitle(title: string) {
  if (typeof document === "undefined") return;
  if (savedTitle == null) savedTitle = document.title;
  document.title = `Alarm: ${title}`;
}

function restoreTitle() {
  if (typeof document === "undefined" || savedTitle == null) return;
  document.title = savedTitle;
  savedTitle = null;
}

async function closeOsNote() {
  try {
    fallbackNote?.close();
  } catch {
    /* already closed */
  }
  fallbackNote = null;
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;
  try {
    const reg = await navigator.serviceWorker.getRegistration();
    const notes = await reg?.getNotifications({ tag: NOTE_TAG });
    notes?.forEach((note) => note.close());
  } catch {
    /* notifications unavailable */
  }
}

async function pingOs(title: string, detail: string) {
  try {
    window.focus();
  } catch {
    /* the browser may ignore this from a timer */
  }
  if (typeof Notification === "undefined" || Notification.permission !== "granted") return;
  const body = detail;
  try {
    if ("serviceWorker" in navigator) {
      const reg = await navigator.serviceWorker.getRegistration();
      if (reg) {
        await reg.showNotification(title, {
          body,
          requireInteraction: true,
          silent: alarmNotifySilently(),
          tag: NOTE_TAG,
          renotify: true,
          actions: [{ action: "stop", title: "Turn alarm off" }],
        } as NotificationOptions);
        return;
      }
    }
  } catch {
    /* fall through to a page notification */
  }
  try {
    const note = new Notification(title, {
      body,
      requireInteraction: true,
      silent: alarmNotifySilently(),
      tag: NOTE_TAG,
    });
    note.onclick = () => {
      try {
        window.focus();
      } catch {
        /* */
      }
      note.close();
    };
    fallbackNote = note;
  } catch {
    /* permission or constructor blocked */
  }
}

export function askAlarmNotificationPermission(): void {
  if (typeof window === "undefined" || typeof Notification === "undefined") return;
  if (Notification.permission !== "default") return;
  void Notification.requestPermission().catch(() => {});
}

export function raiseAlarm(input: {
  source: AlarmSource;
  title: string;
  detail: string;
  tone?: AlarmTone;
  seconds?: number;
  volume?: number;
  onDismiss?: () => void;
}): string {
  if (typeof window === "undefined") return "";
  ensureAlarmStopListener();
  const prev = current;
  current = null;
  if (prev) {
    try {
      prev.stop();
    } catch {
      /* already stopped */
    }
    try {
      prev.onDismiss?.();
    } catch {
      /* board already gone */
    }
  }
  const merge = Boolean(prev && prev.source !== input.source);
  const title = merge && prev ? `${prev.title} and ${input.title}` : input.title;
  const detail = merge && prev ? `${prev.detail}\n\n${input.detail}` : input.detail;
  const id = `alarm-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
  const stop = playAlarmTone(input.tone ?? "classic", input.seconds ?? 30, input.volume ?? 0.06);
  current = {
    id,
    source: input.source,
    title,
    detail,
    stop,
    onDismiss: input.onDismiss,
  };
  flashTitle(title);
  emit();
  void pingOs(title, detail);
  return id;
}

export function dismissAlarm(match?: { id?: string; source?: AlarmSource }): void {
  const row = current;
  if (!row || dismissing) return;
  if (match?.id && row.id !== match.id) return;
  if (match?.source && row.source !== match.source) return;
  dismissing = true;
  current = null;
  try {
    row.stop();
  } catch {
    /* already stopped */
  }
  restoreTitle();
  void closeOsNote();
  emit();
  try {
    row.onDismiss?.();
  } catch {
    /* board already gone */
  }
  dismissing = false;
}
