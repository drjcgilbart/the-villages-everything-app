import { requireOptionalNativeModule } from "expo-modules-core";
import { Platform } from "react-native";

type FiredAlarm = {
  title?: string;
  detail?: string;
  source?: string;
  seconds?: number;
  endsAt?: number;
};

type AlarmNative = {
  prepare: () => void;
  start: (seconds: number, tone: string, uri: string) => void;
  show: (title: string, detail: string) => void;
  stop: () => void;
  phoneSounds: () => string;
  replaceSchedule: (raw: string) => void;
  addListener: (event: "onAlarmFired", listener: (payload: FiredAlarm) => void) => { remove: () => void };
};

function native(): AlarmNative | null {
  if (Platform.OS !== "android") return null;
  try {
    return requireOptionalNativeModule<AlarmNative>("AlarmSound");
  } catch {
    return null;
  }
}

/** Create the Alarms channel so Android lists this app under Do Not Disturb. */
export function prepareAndroidAlarms(): void {
  native()?.prepare();
}

/** Play on the alarm stream, which Do Not Disturb leaves on unless Alarms are off. */
export function startAndroidAlarm(seconds: number, tone = "chime", uri = ""): void {
  native()?.start(Math.min(300, Math.max(1, Math.round(seconds) || 30)), tone || "chime", uri || "");
}

export function listAndroidAlarmSounds(): { title: string; uri: string }[] {
  const raw = native()?.phoneSounds() || "[]";
  try {
    const parsed = JSON.parse(raw) as { title?: string; uri?: string }[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((row) => row && typeof row.uri === "string" && typeof row.title === "string") as {
      title: string;
      uri: string;
    }[];
  } catch {
    return [];
  }
}

export function showAndroidAlarm(title: string, detail: string): void {
  native()?.show(title || "Alarm", detail || "");
}

export function stopAndroidAlarm(): void {
  native()?.stop();
}

export function replaceAndroidAlarms(
  alarms: {
    id: string;
    at: number;
    title: string;
    detail: string;
    seconds: number;
    source: string;
    tone?: string;
    uri?: string;
  }[]
): void {
  native()?.replaceSchedule(JSON.stringify(alarms));
}

export function subscribeAndroidAlarms(listener: (payload: FiredAlarm) => void): () => void {
  const mod = native();
  if (!mod) return () => {};
  const sub = mod.addListener("onAlarmFired", listener);
  return () => sub.remove();
}
