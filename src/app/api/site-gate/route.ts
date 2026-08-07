import { NextResponse } from "next/server";
import crypto from "crypto";
import { isAdminAuthenticated } from "@/lib/auth";
import {
  clearSiteGateCookieOptions,
  expectedSiteGateToken,
  getSiteGateStatus,
  getSitePassword,
  isSiteGateEnabledAsync,
  setSiteGateEnabled,
  siteGateCookieOptions,
} from "@/lib/siteGate";

export const dynamic = "force-dynamic";

function passwordsMatch(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) {
    crypto.timingSafeEqual(ba, ba);
    return false;
  }
  return crypto.timingSafeEqual(ba, bb);
}

/** POST { password } — unlock site for this browser */
export async function POST(req: Request) {
  if (!(await isSiteGateEnabledAsync())) {
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

/**
 * GET — gate status.
 * Public: { enabled, unlocked }
 * Admin (cookie): also { toggleOn, passwordConfigured, updatedAt }
 * Middleware probe uses ?probe=1 (same public shape).
 */
export async function GET(req: Request) {
  const status = await getSiteGateStatus();
  const enabled = status.enabled;

  if (!enabled) {
    const admin = await isAdminAuthenticated();
    return NextResponse.json({
      enabled: false,
      unlocked: true,
      ...(admin
        ? {
            toggleOn: status.toggleOn,
            passwordConfigured: status.passwordConfigured,
            updatedAt: status.updatedAt,
          }
        : {}),
    });
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

  const admin = await isAdminAuthenticated();
  return NextResponse.json({
    enabled: true,
    unlocked,
    ...(admin
      ? {
          toggleOn: status.toggleOn,
          passwordConfigured: status.passwordConfigured,
          updatedAt: status.updatedAt,
        }
      : {}),
  });
}

/**
 * PATCH { enabled: boolean } — admin only: turn beta wall on/off.
 * Password always comes from SITE_PASSWORD env; this only flips the wall.
 */
export async function PATCH(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const enabled = Boolean(body.enabled);
    const settings = await setSiteGateEnabled(enabled);
    const status = await getSiteGateStatus();

    return NextResponse.json({
      ok: true,
      enabled: status.enabled,
      toggleOn: settings.enabled,
      passwordConfigured: status.passwordConfigured,
      updatedAt: settings.updatedAt,
      message: settings.enabled
        ? status.passwordConfigured
          ? "Beta password wall is ON — visitors need the site password."
          : "Toggle is ON, but SITE_PASSWORD is not set in env — wall stays inactive until you add it."
        : "Beta password wall is OFF — site is public.",
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not update gate" },
      { status: 400 }
    );
  }
}

/** DELETE — clear unlock cookie (optional “lock again” for this browser) */
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
