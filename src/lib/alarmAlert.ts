"use client";

import {
  alarmNotifySilently,
  androidShellPlaysAlarms,
  playAlarmTone,
  showAndroidShellAlarm,
  stopAndroidShellAlarm,
  type AlarmTone,
} from "@/lib/mySpaceStorage";

export type AlarmSource = "health" | "pet" | "gym";

const ALARM_PAGES: Record<AlarmSource, string> = {
  health: "/health?section=meds#my-health",
  pet: "/my-space?tab=pets",
  gym: "/health?section=gym#my-health",
};

const ALARM_PATHS = new Set<string>(Object.values(ALARM_PAGES));

const ALARM_QUERY = new Set(["section", "editMed", "tab", "editPet", "editEvent"]);

/** Keep phone Open on this site's health and pet pages. */
export function safeAlarmPath(path: string | undefined): string {
  if (typeof window === "undefined" || !path) return "";
  try {
    const url = new URL(path, window.location.origin);
    if (url.origin !== window.location.origin) return "";
    if (url.pathname !== "/health" && url.pathname !== "/my-space") return "";
    const next = new URLSearchParams();
    url.searchParams.forEach((value, key) => {
      if (ALARM_QUERY.has(key) && value.length <= 80) next.set(key, value);
    });
    const search = next.toString();
    return `${url.pathname}${search ? `?${search}` : ""}${url.hash}`;
  } catch {
    return "";
  }
}

/** Open the board a phone alarm belongs to. Desktop alarms do not call this. */
export function openAlarmPage(path: string | undefined): void {
  const safe = safeAlarmPath(path) || (path && ALARM_PATHS.has(path) ? path : "");
  if (typeof window === "undefined" || !safe) return;
  const win = window as Window & { __tveaAlarmGoing?: string };
  if (win.__tveaAlarmGoing === safe) return;
  const here = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  if (here === safe) {
    window.dispatchEvent(new Event("tvea-alarm-open"));
    win.__tveaAlarmGoing = safe;
    return;
  }
  win.__tveaAlarmGoing = safe;
  window.location.assign(safe);
}

export function alarmPageFor(source: AlarmSource | undefined): string {
  if (!source) return "";
  return ALARM_PAGES[source] || "";
}

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
  /** The phone alarm clock already started the sound. */
  sound?: "page" | "native";
}): string {
  if (typeof window === "undefined") return "";
  ensureAlarmStopListener();
  const prev = current;
  current = null;
  if (prev && input.sound !== "native") {
    try {
      prev.stop();
    } catch {
      /* already stopped */
    }
  }
  if (prev) {
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
  const stop =
    input.sound === "native"
      ? () => stopAndroidShellAlarm()
      : playAlarmTone(input.tone ?? "classic", input.seconds ?? 30, input.volume ?? 0.06);
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
  if (input.sound !== "native") {
    if (androidShellPlaysAlarms()) showAndroidShellAlarm(title, detail);
    else void pingOs(title, detail);
  }
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
