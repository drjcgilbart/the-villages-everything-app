import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { rateLimitResponse } from "@/lib/authRateLimit";
import { rejectIfCrossOrigin } from "@/lib/security";
import { tourStartProblem } from "@/lib/lightTourShared";
import { hasHolidayLightsAcceptance, termsUserIdForRequest } from "@/lib/holidayLightsTermsStore";
import { drivingChoice } from "@/lib/tourForward";
import { cleanHeading } from "@/lib/tourHeading";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * One driving leg for the phone that is already on a tour.
 * The browser must not call the router itself. This stays inside The Villages area.
 * When the phone sends the direction of travel, the leg continues forward
 * unless the only way back is a turn-around of more than a mile.
 */
export async function POST(req: Request) {
  const blocked = rejectIfCrossOrigin(req);
  if (blocked) return blocked;
  const limited = rateLimitResponse(req, "light-tour-leg", 120, 10 * 60 * 1000);
  if (limited) return limited;
  // Admins can navigate to any pin from the pin map without the member terms flow.
  const admin = await isAdminAuthenticated();
  const termsUserId = admin ? "" : await termsUserIdForRequest();
  if (!admin && (!termsUserId || !(await hasHolidayLightsAcceptance(termsUserId)))) {
    return NextResponse.json(
      { error: "Accept the Holiday Lights terms before a route can start." },
      { status: 403 }
    );
  }
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  const from = { latitude: Number(body?.fromLatitude), longitude: Number(body?.fromLongitude) };
  const to = { latitude: Number(body?.toLatitude), longitude: Number(body?.toLongitude) };
  if (tourStartProblem(from) || tourStartProblem(to)) {
    return NextResponse.json({ error: "That leg is outside the tour area." }, { status: 400 });
  }
  const drawn = await drivingChoice([from, to], cleanHeading(body?.heading));
  return NextResponse.json({ steps: drawn.steps, fallback: drawn.fallback, turnAround: drawn.turnAround });
}
