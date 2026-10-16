import { NextResponse } from "next/server";
import { rateLimitResponse } from "@/lib/authRateLimit";
import { rejectIfCrossOrigin } from "@/lib/security";
import { MAX_STOPS, tourStartProblem } from "@/lib/lightTourShared";
import { drivingLineThrough } from "@/lib/lightTourRoute";
import { hasHolidayLightsAcceptance, termsUserIdForRequest } from "@/lib/holidayLightsTermsStore";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type Point = { latitude: number; longitude: number };

function pointFrom(value: unknown): Point | null {
  if (!value || typeof value !== "object") return null;
  const row = value as Record<string, unknown>;
  const point = { latitude: Number(row.latitude), longitude: Number(row.longitude) };
  if (!Number.isFinite(point.latitude) || !Number.isFinite(point.longitude)) return null;
  return point;
}

/**
 * Off-route reroute for a phone already on a tour. Draws a new driving line
 * from the driver's position through the remaining stops, in the same order.
 * The browser must not call the router itself.
 */
export async function POST(req: Request) {
  const blocked = rejectIfCrossOrigin(req);
  if (blocked) return blocked;
  const limited = rateLimitResponse(req, "light-tour-reroute", 40, 10 * 60 * 1000);
  if (limited) return limited;
  const termsUserId = await termsUserIdForRequest();
  if (!termsUserId || !(await hasHolidayLightsAcceptance(termsUserId))) {
    return NextResponse.json(
      { error: "Accept the Holiday Lights terms before a route can start." },
      { status: 403 }
    );
  }
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  const from = pointFrom(body?.from);
  const rawStops = Array.isArray(body?.stops) ? body.stops.slice(0, MAX_STOPS) : [];
  const stops = rawStops.map(pointFrom);
  if (!from || !stops.length || stops.some((stop) => !stop)) {
    return NextResponse.json({ error: "The reroute needs your position and the stops ahead." }, { status: 400 });
  }
  const points = [from, ...(stops as Point[])];
  if (points.some((point) => tourStartProblem(point))) {
    return NextResponse.json({ error: "That reroute is outside the tour area." }, { status: 400 });
  }
  const drawn = await drivingLineThrough(points);
  return NextResponse.json({ line: drawn.line, legs: drawn.legs, fallback: drawn.fallback });
}
