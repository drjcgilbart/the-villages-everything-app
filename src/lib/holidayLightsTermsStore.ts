import { getSessionMember } from "./memberAuth";
import {
  cacheDurableJson,
  durableConfigured,
  isEphemeralHost,
  pullDurableJson,
  pullJsonFromBlob,
  readJsonFile,
  writeJsonFileAsync,
} from "./dataFs";
import { isGuestTermsUserId, tourDeviceFromUserAgent } from "./holidayLightsTerms";

export const HOLIDAY_LIGHTS_TERMS_FILE = "light-tour-terms.json";

export type HolidayLightsAcceptance = {
  userId: string;
  deviceType: string;
  appVersion: string;
  acceptedAt: string;
};

type Store = { acceptances: HolidayLightsAcceptance[] };

let writeChain: Promise<unknown> = Promise.resolve();

function enqueue<T>(work: () => Promise<T>): Promise<T> {
  const run = writeChain.then(work, work);
  writeChain = run.then(
    () => undefined,
    () => undefined
  );
  return run;
}

function clip(value: unknown, max: number) {
  return String(value ?? "").trim().slice(0, max);
}

function redisOverLimit(err: unknown) {
  const msg = err instanceof Error ? err.message : String(err);
  return /plan limits|fixed plan/i.test(msg);
}

function parseStore(raw: unknown): Store {
  if (raw == null) return { acceptances: [] };
  const data = typeof raw === "string" ? (JSON.parse(raw) as { acceptances?: unknown }) : (raw as { acceptances?: unknown });
  if (!data || typeof data !== "object" || !Array.isArray(data.acceptances)) {
    throw new Error("Could not read Holiday Lights terms.");
  }
  const acceptances: HolidayLightsAcceptance[] = [];
  for (const row of data.acceptances) {
    if (!row || typeof row !== "object") continue;
    const item = row as Partial<HolidayLightsAcceptance>;
    const userId = clip(item.userId, 80);
    const acceptedAt = clip(item.acceptedAt, 40);
    if (!userId || !acceptedAt) continue;
    acceptances.push({
      userId,
      deviceType: clip(item.deviceType, 40) || "unknown",
      appVersion: clip(item.appVersion, 40) || "web",
      acceptedAt,
    });
  }
  return { acceptances: acceptances.slice(-4000) };
}

async function pullTermsText(): Promise<string | null> {
  try {
    return await pullDurableJson(HOLIDAY_LIGHTS_TERMS_FILE);
  } catch (err) {
    if (!redisOverLimit(err)) throw err;
    return pullJsonFromBlob(HOLIDAY_LIGHTS_TERMS_FILE);
  }
}

async function readForWrite(): Promise<Store> {
  if (isEphemeralHost() && durableConfigured()) {
    const text = await pullTermsText();
    if (text) {
      cacheDurableJson(HOLIDAY_LIGHTS_TERMS_FILE, text);
      return parseStore(text);
    }
    return { acceptances: [] };
  }
  return parseStore(readJsonFile<Store>(HOLIDAY_LIGHTS_TERMS_FILE));
}

/** Signed-in members are recorded by account id. Everyone else uses a guest id stored on that device. */
export async function termsUserIdForRequest(visitorId: unknown) {
  const member = await getSessionMember();
  if (member?.id) return clip(member.id, 80);
  const visitor = clip(visitorId, 80);
  if (!isGuestTermsUserId(visitor)) return "";
  return visitor.toLowerCase();
}

export async function hasHolidayLightsAcceptance(userId: string) {
  const id = clip(userId, 80);
  if (!id) return false;
  const store = await readForWrite();
  return store.acceptances.some((row) => row.userId === id);
}

export function recordHolidayLightsAcceptance(userId: string, req: Request): Promise<HolidayLightsAcceptance> {
  const id = clip(userId, 80);
  if (!id) throw new Error("Need a user id.");
  const { deviceType, appVersion } = tourDeviceFromUserAgent(req.headers.get("user-agent") || "");
  const record: HolidayLightsAcceptance = {
    userId: id,
    deviceType,
    appVersion,
    acceptedAt: new Date().toISOString(),
  };
  return enqueue(async () => {
    const store = await readForWrite();
    store.acceptances.push(record);
    await writeJsonFileAsync(HOLIDAY_LIGHTS_TERMS_FILE, {
      acceptances: store.acceptances.slice(-4000),
    });
    return record;
  });
}
