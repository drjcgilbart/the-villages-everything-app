import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { rateLimitResponse } from "@/lib/authRateLimit";
import { rejectIfCrossOrigin } from "@/lib/security";
import { getSessionMember } from "@/lib/memberAuth";
import {
  hasHolidayLightsAcceptance,
  listHolidayLightsAcceptances,
  recordHolidayLightsAcceptance,
  termsUserIdForRequest,
} from "@/lib/holidayLightsTermsStore";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

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
    return NextResponse.json({ acceptances });
  }
  const member = await getSessionMember();
  const userId = await termsUserIdForRequest();
  const accepted = userId ? await hasHolidayLightsAcceptance(userId) : false;
  return NextResponse.json({
    accepted,
    signedIn: Boolean(member?.id),
    name: member?.name || "",
    email: member?.email || "",
    status: member?.status || "",
  });
}

export async function POST(req: Request) {
  const blocked = rejectIfCrossOrigin(req);
  if (blocked) return blocked;
  const limited = rateLimitResponse(req, "light-tour-terms-save", 20, 15 * 60 * 1000);
  if (limited) return limited;
  try {
    const record = await recordHolidayLightsAcceptance(req);
    return NextResponse.json({
      accepted: true,
      acceptedAt: record.acceptedAt,
      name: record.memberName,
      email: record.memberEmail,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "The acceptance did not save.";
    return NextResponse.json({ error: message }, { status: errorStatus(err) });
  }
}
