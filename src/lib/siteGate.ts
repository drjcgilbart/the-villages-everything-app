import crypto from "crypto";
import {
  ensureDurableHydrated,
  readJsonFile,
  writeJsonFile,
  writeJsonFileAsync,
} from "./dataFs";
import { cookieSecure } from "./security";

/** HTTP-only cookie set after a successful beta unlock */
export const SITE_GATE_COOKIE = "tvh_site_gate";

const SETTINGS_FILE = "site-gate-settings.json";

export type SiteGateSettings = {
  /**
   * When true (and SITE_PASSWORD is set), the public beta password wall is on.
   * Default false = site is fully open.
   */
  enabled: boolean;
  updatedAt: string | null;
};

function defaultSettings(): SiteGateSettings {
  return { enabled: false, updatedAt: null };
}

export function loadSiteGateSettings(): SiteGateSettings {
  const raw = readJsonFile<SiteGateSettings>(SETTINGS_FILE);
  if (!raw || typeof raw !== "object") return defaultSettings();
  return {
    enabled: Boolean(raw.enabled),
    updatedAt: raw.updatedAt || null,
  };
}

export async function loadSiteGateSettingsAsync(): Promise<SiteGateSettings> {
  await ensureDurableHydrated();
  return loadSiteGateSettings();
}

export function saveSiteGateSettings(settings: SiteGateSettings) {
  settings.updatedAt = new Date().toISOString();
  writeJsonFile(SETTINGS_FILE, settings);
  return settings;
}

export async function saveSiteGateSettingsAsync(settings: SiteGateSettings) {
  settings.updatedAt = new Date().toISOString();
  await writeJsonFileAsync(SETTINGS_FILE, settings);
  return settings;
}

export async function setSiteGateEnabled(enabled: boolean): Promise<SiteGateSettings> {
  return saveSiteGateSettingsAsync({
    enabled: Boolean(enabled),
    updatedAt: null,
  });
}

/**
 * Shared beta unlock password from env (never stored in the toggle JSON).
 * Keep this set in Vercel even when the gate is off so you can re-enable anytime.
 */
export function getSitePassword(): string {
  return (process.env.SITE_PASSWORD || "").trim();
}

export function isSitePasswordConfigured(): boolean {
  return Boolean(getSitePassword());
}

function siteGateEnvOverride(): "on" | "off" | "unset" {
  const envFlag = (process.env.SITE_GATE_ENABLED || "").trim().toLowerCase();
  if (envFlag === "0" || envFlag === "false" || envFlag === "off") return "off";
  if (envFlag === "1" || envFlag === "true" || envFlag === "on") return "on";
  return "unset";
}

/**
 * Live wall (Routing Middleware) is env-only so the public site cannot 504.
 * On only when SITE_PASSWORD is set AND SITE_GATE_ENABLED=on|true|1.
 */
export function isSiteGateEnabled(): boolean {
  if (!isSitePasswordConfigured()) return false;
  return siteGateEnvOverride() === "on";
}

export async function isSiteGateEnabledAsync(): Promise<boolean> {
  return isSiteGateEnabled();
}

/**
 * Unlock token derived only from SITE_PASSWORD (no secondary secret).
 * Must match the Edge middleware implementation in src/middleware.ts.
 */
export function siteGateTokenForPassword(password: string): string {
  return crypto
    .createHash("sha256")
    .update(`tvh-site-gate-v1:${password}`, "utf8")
    .digest("hex");
}

export function expectedSiteGateToken(): string {
  return siteGateTokenForPassword(getSitePassword());
}

export function siteGateCookieOptions(maxAgeSec = 60 * 60 * 24 * 30) {
  return {
    name: SITE_GATE_COOKIE,
    value: expectedSiteGateToken(),
    httpOnly: true,
    sameSite: "lax" as const,
    secure: cookieSecure(),
    path: "/",
    maxAge: maxAgeSec,
  };
}

export function clearSiteGateCookieOptions() {
  return {
    name: SITE_GATE_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax" as const,
    secure: cookieSecure(),
    path: "/",
    maxAge: 0,
  };
}

/** Public/admin status payload (never includes the password). */
export async function getSiteGateStatus() {
  await ensureDurableHydrated();
  const settings = loadSiteGateSettings();
  const passwordConfigured = isSitePasswordConfigured();
  const envOverride = siteGateEnvOverride();
  const enabled = passwordConfigured && envOverride === "on";
  return {
    enabled,
    /** Admin asked for the wall (may still be inactive unless SITE_GATE_ENABLED=on) */
    toggleOn: settings.enabled === true,
    passwordConfigured,
    envOverride,
    updatedAt: settings.updatedAt,
  };
}
