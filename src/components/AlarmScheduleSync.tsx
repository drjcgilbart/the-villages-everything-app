"use client";

import { useEffect } from "react";
import {
  applyMedicineMarks,
  applyPetMarks,
  marksIncludeGym,
  parseMarks,
  pressStamp,
} from "@/lib/alarmComplete";
import { collectScheduledAlarms, readGymRest, rememberGymRest } from "@/lib/alarmSchedule";
import { dismissAlarm, openAlarmPage, raiseAlarm } from "@/lib/alarmAlert";
import { androidShellPlaysAlarms, readJsonStorage, writeJsonStorage } from "@/lib/mySpaceStorage";

const HEALTH_KEY = "tvea-ms-health-v2";
const PET_KEY = "tvea-ms-pet-v2";

type ShellWindow = Window & {
  ReactNativeWebView?: { postMessage: (data: string) => void };
};

type FiredDetail = {
  title?: string;
  detail?: string;
  seconds?: number;
  source?: string;
  path?: string;
  endsAt?: number;
};

function scopedBoard(prefix: string, memberId: string | null, server: unknown): unknown {
  if (typeof window !== "undefined") {
    const keys: string[] = [];
    if (memberId) keys.push(`${prefix}::${memberId}`);
    else {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i) || "";
        if (key.startsWith(`${prefix}::`)) keys.push(key);
      }
    }
    for (const key of keys) {
      const local = readJsonStorage<unknown>(key, null);
      if (local) return local;
    }
  }
  return server ?? null;
}

function postSchedule(health: unknown, pets: unknown) {
  const alarms = collectScheduledAlarms(health, pets, readGymRest(), Date.now());
  const shell = window as ShellWindow;
  shell.ReactNativeWebView?.postMessage(
    JSON.stringify({ type: "tvea-alarm-schedule", alarms })
  );
}

async function pushSchedule() {
  if (!androidShellPlaysAlarms()) return;
  const cachedHealth = scopedBoard(HEALTH_KEY, null, null);
  const cachedPets = scopedBoard(PET_KEY, null, null);
  if (cachedHealth || cachedPets || readGymRest()) {
    postSchedule(cachedHealth, cachedPets);
  }
  let memberId: string | null = null;
  let boards: Record<string, unknown> = {};
  try {
    const res = await fetch("/api/members/space/boards", {
      cache: "no-store",
      credentials: "include",
    });
    if (res.ok) {
      const json = (await res.json()) as { memberId?: string; boards?: Record<string, unknown> };
      memberId = json.memberId ? String(json.memberId) : null;
      boards = json.boards || {};
    } else {
      return;
    }
  } catch {
    return;
  }
  postSchedule(
    scopedBoard(HEALTH_KEY, memberId, boards.health),
    scopedBoard(PET_KEY, memberId, boards.pets)
  );
}

function sourceOf(value: string | undefined): "health" | "pet" | "gym" {
  if (value === "pet" || value === "gym") return value;
  return "health";
}

type DoneItem = { marks?: unknown; at?: number };

type ShellAck = Window & {
  ReactNativeWebView?: { postMessage: (data: string) => void };
};

function ackDone(at: number) {
  const shell = window as ShellAck;
  shell.ReactNativeWebView?.postMessage(JSON.stringify({ type: "tvea-alarm-done-ack", at }));
}

async function putBoard(board: "health" | "pets", data: unknown): Promise<boolean> {
  const res = await fetch("/api/members/space/boards", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ board, data }),
  });
  return res.ok;
}

let applyingDone = false;

/** Check off every item in one phone Done press. The planned clock is left alone. */
async function applyDoneQueue(queue: DoneItem[]) {
  if (applyingDone) return;
  applyingDone = true;
  try {
    await applyDoneQueueNow(queue);
  } finally {
    applyingDone = false;
  }
}

async function applyDoneQueueNow(queue: DoneItem[]) {
  const pending = queue.filter((item) => Number(item.at) > 0 && parseMarks(item.marks).length);
  if (!pending.length) {
    for (const item of queue) {
      if (Number(item.at) > 0) ackDone(Number(item.at));
    }
    return;
  }
  let memberId: string | null = null;
  let boards: Record<string, unknown> = {};
  try {
    const res = await fetch("/api/members/space/boards", { cache: "no-store", credentials: "include" });
    if (!res.ok) return;
    const json = (await res.json()) as { memberId?: string; boards?: Record<string, unknown> };
    memberId = json.memberId ? String(json.memberId) : null;
    boards = json.boards || {};
  } catch {
    return;
  }
  if (!memberId) return;
  const healthKey = `${HEALTH_KEY}::${memberId}`;
  const petKey = `${PET_KEY}::${memberId}`;
  let health = (readJsonStorage<Record<string, unknown> | null>(healthKey, null) ||
    boards.health ||
    {}) as Record<string, unknown>;
  let pets = (readJsonStorage<Record<string, unknown> | null>(petKey, null) ||
    boards.pets ||
    {}) as Record<string, unknown>;
  let meds = false;
  let petTasks = false;
  let gym = false;
  for (const item of pending) {
    const marks = parseMarks(item.marks);
    const pressed = pressStamp(Number(item.at)).time;
    health = applyMedicineMarks(health, marks, pressed);
    pets = applyPetMarks(pets, marks, pressed);
    if (marks.some((mark) => mark.kind === "med")) meds = true;
    if (marks.some((mark) => mark.kind === "pet")) petTasks = true;
    if (marksIncludeGym(marks)) gym = true;
  }
  if (meds) {
    writeJsonStorage(healthKey, health);
    const saved = await putBoard("health", health);
    if (!saved) return;
    window.dispatchEvent(new CustomEvent("tvea-alarm-logged", { detail: { health } }));
  }
  if (petTasks) {
    writeJsonStorage(petKey, pets);
    const saved = await putBoard("pets", pets);
    if (!saved) return;
    window.dispatchEvent(new CustomEvent("tvea-alarm-logged", { detail: { pets } }));
  }
  if (gym) {
    rememberGymRest(null);
    window.dispatchEvent(new Event("tvea-gym-rest-done"));
  }
  for (const item of queue) {
    if (Number(item.at) > 0) ackDone(Number(item.at));
  }
}

/** Arms the phone alarm clock from any page, and opens the popup when one fires. */
export function AlarmScheduleSync() {
  useEffect(() => {
    const onFire = (event: Event) => {
      const detail = (event as CustomEvent<FiredDetail>).detail;
      if (!detail?.title) return;
      const endsAt = Number(detail.endsAt || 0);
      if (endsAt && Date.now() > endsAt + 2000) return;
      const seconds = Math.max(1, Math.round((endsAt - Date.now()) / 1000) || Number(detail.seconds) || 30);
      raiseAlarm({
        source: sourceOf(detail.source),
        title: detail.title,
        detail: detail.detail || detail.title,
        seconds,
        sound: "native",
      });
    };
    const onStop = (event: Event) => {
      const path = (event as CustomEvent<FiredDetail>).detail?.path;
      dismissAlarm();
      openAlarmPage(path);
    };
    const onDone = (event: Event) => {
      dismissAlarm();
      const queue = (event as CustomEvent<{ queue?: DoneItem[] }>).detail?.queue;
      if (Array.isArray(queue) && queue.length) void applyDoneQueue(queue);
    };
    const onOpen = (event: Event) => {
      dismissAlarm();
      openAlarmPage((event as CustomEvent<FiredDetail>).detail?.path);
    };
    window.addEventListener("tvea-native-alarm", onFire);
    window.addEventListener("tvea-native-alarm-stop", onStop);
    window.addEventListener("tvea-native-alarm-done", onDone);
    window.addEventListener("tvea-native-alarm-open", onOpen);
    const kick = () => {
      void pushSchedule();
    };
    kick();
    const id = window.setInterval(kick, 30_000);
    window.addEventListener("tvea-alarm-schedule-sync", kick);
    document.addEventListener("visibilitychange", kick);
    window.addEventListener("pagehide", kick);
    return () => {
      window.removeEventListener("tvea-native-alarm", onFire);
      window.removeEventListener("tvea-native-alarm-stop", onStop);
      window.removeEventListener("tvea-native-alarm-done", onDone);
      window.removeEventListener("tvea-native-alarm-open", onOpen);
      window.clearInterval(id);
      window.removeEventListener("tvea-alarm-schedule-sync", kick);
      document.removeEventListener("visibilitychange", kick);
      window.removeEventListener("pagehide", kick);
    };
  }, []);
  return null;
}
