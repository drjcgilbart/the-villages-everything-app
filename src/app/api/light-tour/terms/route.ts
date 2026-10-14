import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { rateLimitResponse } from "@/lib/authRateLimit";
import { rejectIfCrossOrigin } from "@/lib/security";
import { getSessionMember, getSessionMemberId } from "@/lib/memberAuth";
import { memberRosterUnreadable } from "@/lib/dataFs";
import { hydrateYardSale } from "@/lib/yardSale";
import { memberEmailIsVerified } from "@/lib/memberEmailVerify";
import {
  hasHolidayLightsAcceptance,
  listHolidayLightsAcceptances,
  recordHolidayLightsAcceptance,
} from "@/lib/holidayLightsTermsStore";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function json(body: unknown, status = 200) {
  const res = NextResponse.json(body, { status });
  res.headers.set("Cache-Control", "private, no-store, max-age=0");
  res.headers.set("Vary", "Cookie");
  return res;
}

function errorStatus(err: unknown) {
  if (err && typeof err === "object" && "status" in err) {
    const status = Number((err as { status: number }).status);
    if (status >= 400 && status < 600) return status;
  }
  return 500;
}

export async function GET(req: Request) {
  const blocked = rejectIfCrossOrigin(req);
  if (blocked) return blocked;
  const limited = rateLimitResponse(req, "light-tour-terms-read", 60, 15 * 60 * 1000);
  if (limited) return limited;
  const admin = new URL(req.url).searchParams.get("admin") === "1";
  if (admin) {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: "Sign in as the site owner." }, { status: 401 });
    }
    const acceptances = await listHolidayLightsAcceptances();
    return json({ acceptances });
  }
  const sessionId = await getSessionMemberId();
  if (sessionId) await hydrateYardSale();
  const member = sessionId ? await getSessionMember() : null;
  if (sessionId && !member && memberRosterUnreadable()) {
    return json(
      { error: "You are signed in, but the membership list did not load. Refresh this page." },
      503
    );
  }
  const userId = member?.id && member.status !== "rejected" && member.status !== "suspended" ? member.id : "";
  const accepted = userId ? await hasHolidayLightsAcceptance(userId) : false;
  return json({
    accepted,
    signedIn: Boolean(member?.id),
    name: member?.name || "",
    email: member?.email || "",
    status: member?.status || "",
    emailVerified: member ? memberEmailIsVerified(member) : false,
  });
}

export async function POST(req: Request) {
  const blocked = rejectIfCrossOrigin(req);
  if (blocked) return blocked;
  const limited = rateLimitResponse(req, "light-tour-terms-save", 20, 15 * 60 * 1000);
  if (limited) return limited;
  try {
    const record = await recordHolidayLightsAcceptance(req);
    return json({
      accepted: true,
      acceptedAt: record.acceptedAt,
      name: record.memberName,
      email: record.memberEmail,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "The acceptance did not save.";
    return json({ error: message }, { status: errorStatus(err) });
  }
}
