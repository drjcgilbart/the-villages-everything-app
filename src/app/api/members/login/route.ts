import { NextResponse } from "next/server";
import {
  authenticateMember,
  getMemberByEmail,
  toPublicMember,
} from "@/lib/yardSale";
import { memberCookieOptions } from "@/lib/memberAuth";
import { clearAuthAttempts, rateLimitResponse } from "@/lib/authRateLimit";
import { isLocalPcHost } from "@/lib/localDevHost";
import { secretsMatch } from "@/lib/security";
import type { Member } from "@/lib/yardSaleTypes";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Local PC (`next dev` on localhost) only: the Admin password can unlock
 * that email’s member account so the site owner can open My Space without
 * remembering a separate copy of the live-site password.
 * Never runs on Vercel / the live domain / store apps.
 */
function localAdminPasswordUnlocksMember(
  req: Request,
  email: string,
  password: string
): Member | null {
  if (process.env.NODE_ENV !== "development") return null;
  if (!isLocalPcHost(req.headers.get("host"))) return null;
  const admin = (process.env.ADMIN_PASSWORD || "").trim();
  if (!admin || admin === "changeme" || admin.length < 8) return null;
  if (!secretsMatch(String(password || ""), admin)) return null;
  const member = getMemberByEmail(email);
  if (!member) return null;
  if (member.status === "rejected" || member.status === "suspended") return null;
  return member;
}

export async function POST(req: Request) {
  const limited = rateLimitResponse(req, "member-login", 8);
  if (limited) return limited;
  try {
    const body = await req.json();
    const email = String(body.email || "");
    const password = String(body.password || "");
    let member: Member;
    try {
      member = authenticateMember(email, password);
    } catch (err) {
      const local = localAdminPasswordUnlocksMember(req, email, password);
      if (!local) {
        throw err instanceof Error ? err : new Error("Login failed");
      }
      member = local;
    }
    clearAuthAttempts(req);
    const res = NextResponse.json({
      ok: true,
      member: toPublicMember(member),
    });
    const cookie = memberCookieOptions(member.id);
    res.cookies.set(cookie.name, cookie.value, cookie);
    return res;
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Login failed" },
      { status: 401 }
    );
  }
}
