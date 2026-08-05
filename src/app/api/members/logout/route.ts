import { NextResponse } from "next/server";
import { clearMemberCookieOptions } from "@/lib/memberAuth";

export const dynamic = "force-dynamic";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  const cookie = clearMemberCookieOptions();
  res.cookies.set(cookie.name, cookie.value, cookie);
  return res;
}
