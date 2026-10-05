"use client";

import { useEffect } from "react";
import { collectScheduledAlarms, readGymRest } from "@/lib/alarmSchedule";
import { dismissAlarm, openAlarmPage, raiseAlarm } from "@/lib/alarmAlert";
import { androidShellPlaysAlarms, readJsonStorage } from "@/lib/mySpaceStorage";

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
    window.addEventListener("tvea-native-alarm", onFire);
    window.addEventListener("tvea-native-alarm-stop", onStop);
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
      window.clearInterval(id);
      window.removeEventListener("tvea-alarm-schedule-sync", kick);
      document.removeEventListener("visibilitychange", kick);
      window.removeEventListener("pagehide", kick);
    };
  }, []);
  return null;
}
