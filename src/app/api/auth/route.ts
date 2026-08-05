import { NextResponse } from "next/server";
import {
  adminCookieOptions,
  clearAdminCookieOptions,
  getAdminPassword,
  isAdminAuthenticated,
} from "@/lib/auth";

export async function GET() {
  const ok = await isAdminAuthenticated();
  return NextResponse.json({ authenticated: ok });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const password = String(body.password || "");
  if (!password || password !== getAdminPassword()) {
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  const cookie = adminCookieOptions();
  res.cookies.set(cookie.name, cookie.value, cookie);
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  const cookie = clearAdminCookieOptions();
  res.cookies.set(cookie.name, cookie.value, cookie);
  return res;
}
