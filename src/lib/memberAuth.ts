import { cookies } from "next/headers";
import crypto from "crypto";
import { getMemberById } from "./yardSale";
import { cookieSecure } from "./security";

const COOKIE = "tvi_member";

function secret() {
  return process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD || "villages-idiot-dev-secret";
}

export function memberToken(memberId: string) {
  return crypto
    .createHmac("sha256", secret())
    .update(`member:${memberId}`)
    .digest("hex");
}

export function memberCookieOptions(memberId: string, maxAgeSec = 60 * 60 * 24 * 21) {
  return {
    name: COOKIE,
    value: `${memberId}.${memberToken(memberId)}`,
    httpOnly: true,
    sameSite: "lax" as const,
    secure: cookieSecure(),
    path: "/",
    maxAge: maxAgeSec,
  };
}

export function clearMemberCookieOptions() {
  return {
    name: COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax" as const,
    secure: cookieSecure(),
    path: "/",
    maxAge: 0,
  };
}

export async function getSessionMemberId() {
  const jar = await cookies();
  const raw = jar.get(COOKIE)?.value;
  if (!raw || !raw.includes(".")) return null;
  const [memberId, token] = raw.split(".");
  if (!memberId || !token) return null;
  const expected = memberToken(memberId);
  try {
    if (!crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expected))) {
      return null;
    }
  } catch {
    return null;
  }
  return memberId;
}

export async function getSessionMember() {
  const id = await getSessionMemberId();
  if (!id) return null;
  return getMemberById(id);
}

export async function requireApprovedMember() {
  const member = await getSessionMember();
  if (!member) throw Object.assign(new Error("Please sign in"), { code: 401 });
  if (member.status === "pending") {
    throw Object.assign(
      new Error("Your membership is pending admin approval"),
      { code: 403 }
    );
  }
  if (member.status !== "approved") {
    throw Object.assign(new Error("Membership is not active"), { code: 403 });
  }
  return member;
}
