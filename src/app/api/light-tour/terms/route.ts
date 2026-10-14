import { NextResponse } from "next/server";
import { rateLimitResponse } from "@/lib/authRateLimit";
import { rejectIfCrossOrigin } from "@/lib/security";
import { hasHolidayLightsAcceptance, recordHolidayLightsAcceptance, termsUserIdForRequest } from "@/lib/holidayLightsTermsStore";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: Request) {
  const blocked = rejectIfCrossOrigin(req);
  if (blocked) return blocked;
  const limited = rateLimitResponse(req, "light-tour-terms-read", 60, 15 * 60 * 1000);
  if (limited) return limited;
  const visitorId = new URL(req.url).searchParams.get("visitorId");
  const userId = await termsUserIdForRequest(visitorId);
  if (!userId) return NextResponse.json({ accepted: false });
  const accepted = await hasHolidayLightsAcceptance(userId);
  return NextResponse.json({ accepted });
}

export async function POST(req: Request) {
  const blocked = rejectIfCrossOrigin(req);
  if (blocked) return blocked;
  const limited = rateLimitResponse(req, "light-tour-terms-save", 20, 15 * 60 * 1000);
  if (limited) return limited;
  const body = (await req.json().catch(() => null)) as { visitorId?: unknown } | null;
  const userId = await termsUserIdForRequest(body?.visitorId);
  if (!userId) {
    return NextResponse.json({ error: "Need a user id." }, { status: 400 });
  }
  try {
    const record = await recordHolidayLightsAcceptance(userId, req);
    return NextResponse.json({
      accepted: true,
      acceptedAt: record.acceptedAt,
      userId: record.userId,
      deviceType: record.deviceType,
      appVersion: record.appVersion,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "The acceptance did not save.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
