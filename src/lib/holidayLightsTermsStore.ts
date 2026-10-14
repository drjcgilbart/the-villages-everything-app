import crypto from "crypto";
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
import { HOLIDAY_LIGHTS_TERMS, HOLIDAY_LIGHTS_TERMS_VERSION, tourDeviceFromUserAgent } from "./holidayLightsTerms";
import { memberEmailIsVerified } from "./memberEmailVerify";
import { getMemberById, hydrateYardSale, markMemberEmailVerified } from "./yardSale";

export const HOLIDAY_LIGHTS_TERMS_FILE = "light-tour-terms.json";

export type HolidayLightsAcceptance = {
  userId: string;
  memberName: string;
  memberEmail: string;
  deviceType: string;
  appVersion: string;
  acceptedAt: string;
  termsVersion: string;
  termsHash: string;
  emailVerifiedAt: string;
  ip: string;
  userAgent: string;
};

export function holidayLightsTermsHash() {
  return crypto.createHash("sha256").update(HOLIDAY_LIGHTS_TERMS).digest("hex");
}

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
      memberName: clip(item.memberName, 80),
      memberEmail: clip(item.memberEmail, 120),
      deviceType: clip(item.deviceType, 40) || "unknown",
      appVersion: clip(item.appVersion, 40) || "web",
      acceptedAt,
      termsVersion: clip(item.termsVersion, 40),
      termsHash: clip(item.termsHash, 64),
      emailVerifiedAt: clip(item.emailVerifiedAt, 40),
      ip: clip(item.ip, 64),
      userAgent: clip(item.userAgent, 240),
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

function clientIp(req: Request) {
  const forwarded = req.headers.get("x-forwarded-for") || "";
  const first = forwarded.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "";
  return clip(first, 64);
}

function coversCurrentTerms(row: HolidayLightsAcceptance) {
  if (row.termsHash) return row.termsHash === holidayLightsTermsHash();
  return (row.termsVersion || HOLIDAY_LIGHTS_TERMS_VERSION) === HOLIDAY_LIGHTS_TERMS_VERSION;
}

/** The signed-in membership is the only identity. A typed name is never accepted. */
export async function termsUserIdForRequest() {
  const member = await getSessionMember();
  if (!member?.id) return "";
  if (member.status === "rejected" || member.status === "suspended") return "";
  return clip(member.id, 80);
}

export async function hasHolidayLightsAcceptance(userId: string) {
  const id = clip(userId, 80);
  if (!id || id.startsWith("guest-")) return false;
  const member = getMemberById(id);
  if (!member || !memberEmailIsVerified(member)) return false;
  const store = await readForWrite();
  return store.acceptances.some(
    (row) => row.userId === id && Boolean(row.emailVerifiedAt) && coversCurrentTerms(row)
  );
}

export async function listHolidayLightsAcceptances() {
  const store = await readForWrite();
  return [...store.acceptances].reverse().slice(0, 200);
}

export function recordHolidayLightsAcceptance(req: Request): Promise<HolidayLightsAcceptance> {
  return enqueue(async () => {
    await hydrateYardSale();
    const member = await getSessionMember();
    if (!member?.id) {
      throw Object.assign(new Error("Sign in before accepting."), { status: 401 });
    }
    if (member.status === "rejected" || member.status === "suspended") {
      throw Object.assign(new Error("This membership is not active, so the tour stays closed."), { status: 403 });
    }
    if (!memberEmailIsVerified(member)) {
      throw Object.assign(new Error("Confirm your email before accepting."), { status: 403 });
    }
    const verified = member.emailVerifiedAt
      ? member
      : (await markMemberEmailVerified(member.id)) || member;
    if (!verified.emailVerifiedAt) {
      throw Object.assign(new Error("Confirm your email before accepting."), { status: 403 });
    }
    const userAgent = req.headers.get("user-agent") || "";
    const { deviceType, appVersion } = tourDeviceFromUserAgent(userAgent);
    const record: HolidayLightsAcceptance = {
      userId: clip(verified.id, 80),
      memberName: clip(verified.name, 80),
      memberEmail: clip(verified.email, 120),
      deviceType,
      appVersion,
      acceptedAt: new Date().toISOString(),
      termsVersion: HOLIDAY_LIGHTS_TERMS_VERSION,
      termsHash: holidayLightsTermsHash(),
      emailVerifiedAt: clip(verified.emailVerifiedAt, 40),
      ip: clientIp(req),
      userAgent: clip(userAgent, 240),
    };
    const store = await readForWrite();
    store.acceptances.push(record);
    await writeJsonFileAsync(HOLIDAY_LIGHTS_TERMS_FILE, {
      acceptances: store.acceptances.slice(-4000),
    });
    return record;
  });
}
