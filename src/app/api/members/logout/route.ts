import { NextResponse } from "next/server";
import { clearAdminCookieOptions } from "@/lib/auth";
import { clearMemberCookieOptions } from "@/lib/memberAuth";

export const dynamic = "force-dynamic";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  const member = clearMemberCookieOptions();
  res.cookies.set(member.name, member.value, member);
  const admin = clearAdminCookieOptions();
  res.cookies.set(admin.name, admin.value, admin);
  return res;
}
