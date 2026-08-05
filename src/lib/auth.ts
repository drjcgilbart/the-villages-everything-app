import { cookies } from "next/headers";
import crypto from "crypto";

const COOKIE = "tvi_admin";

function secret() {
  return process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD || "villages-idiot-dev-secret";
}

function tokenForPassword(password: string) {
  return crypto.createHmac("sha256", secret()).update(`admin:${password}`).digest("hex");
}

export function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || "changeme";
}

export function expectedToken() {
  return tokenForPassword(getAdminPassword());
}

export async function isAdminAuthenticated() {
  const jar = await cookies();
  const val = jar.get(COOKIE)?.value;
  if (!val) return false;
  const expected = expectedToken();
  try {
    return crypto.timingSafeEqual(Buffer.from(val), Buffer.from(expected));
  } catch {
    return false;
  }
}

export function adminCookieOptions(maxAgeSec = 60 * 60 * 24 * 14) {
  return {
    name: COOKIE,
    value: expectedToken(),
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: maxAgeSec,
  };
}

export function clearAdminCookieOptions() {
  return {
    name: COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  };
}
