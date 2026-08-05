import { NextResponse } from "next/server";
import crypto from "crypto";
import {
  clearSiteGateCookieOptions,
  expectedSiteGateToken,
  getSitePassword,
  isSiteGateEnabled,
  siteGateCookieOptions,
} from "@/lib/siteGate";

export const dynamic = "force-dynamic";

function passwordsMatch(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) {
    // Still do a dummy compare to reduce timing leaks on length
    crypto.timingSafeEqual(ba, ba);
    return false;
  }
  return crypto.timingSafeEqual(ba, bb);
}

/** POST { password } — unlock site for this browser */
export async function POST(req: Request) {
  if (!isSiteGateEnabled()) {
    return NextResponse.json({ ok: true, gate: "off" });
  }

  let body: { password?: string } = {};
  try {
    body = await req.json();
  } catch {
    /* empty */
  }

  const password = String(body.password || "");
  if (!password || !passwordsMatch(password, getSitePassword())) {
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  }

  const cookie = siteGateCookieOptions();
  const res = NextResponse.json({
    ok: true,
    // Helps debug “accepted but still gated” without leaking the password
    cookieSet: true,
  });
  res.cookies.set({
    name: cookie.name,
    value: cookie.value,
    httpOnly: cookie.httpOnly,
    sameSite: cookie.sameSite,
    secure: cookie.secure,
    path: cookie.path,
    maxAge: cookie.maxAge,
  });
  return res;
}

/** GET — is gate on, and is this browser unlocked? */
export async function GET(req: Request) {
  const enabled = isSiteGateEnabled();
  if (!enabled) {
    return NextResponse.json({ enabled: false, unlocked: true });
  }

  const cookieHeader = req.headers.get("cookie") || "";
  const match = cookieHeader.match(/(?:^|;\s*)tvh_site_gate=([^;]+)/);
  const val = match?.[1] ? decodeURIComponent(match[1]) : "";
  let unlocked = false;
  try {
    const expected = expectedSiteGateToken();
    unlocked =
      Boolean(val) &&
      val.length === expected.length &&
      crypto.timingSafeEqual(Buffer.from(val), Buffer.from(expected));
  } catch {
    unlocked = false;
  }

  return NextResponse.json({ enabled: true, unlocked });
}

/** DELETE — clear unlock cookie (optional “lock again”) */
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  const cookie = clearSiteGateCookieOptions();
  res.cookies.set(cookie.name, cookie.value, {
    httpOnly: cookie.httpOnly,
    sameSite: cookie.sameSite,
    secure: cookie.secure,
    path: cookie.path,
    maxAge: cookie.maxAge,
  });
  return res;
}
