import { NextResponse } from "next/server";
import { rateLimitResponse } from "@/lib/authRateLimit";
import { rejectIfCrossOrigin } from "@/lib/security";
import { tourStartProblem } from "@/lib/lightTourShared";
import { hasHolidayLightsAcceptance, termsUserIdForRequest } from "@/lib/holidayLightsTermsStore";
import type { DrivingStep } from "@/lib/tourDirections";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type OsrmStep = {
  distance?: number;
  name?: string;
  maneuver?: { type?: string; modifier?: string; location?: [number, number] };
};

/**
 * One driving leg for the phone that is already on a tour.
 * The browser must not call the router itself. This stays inside The Villages area.
 */
export async function POST(req: Request) {
  const blocked = rejectIfCrossOrigin(req);
  if (blocked) return blocked;
  const limited = rateLimitResponse(req, "light-tour-leg", 120, 10 * 60 * 1000);
  if (limited) return limited;
  const termsUserId = await termsUserIdForRequest();
  if (!termsUserId || !(await hasHolidayLightsAcceptance(termsUserId))) {
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
  const path = `${from.longitude},${from.latitude};${to.longitude},${to.latitude}`;
  const url = `https://router.project-osrm.org/route/v1/driving/${path}?overview=false&steps=true`;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(12000) });
    if (!res.ok) return NextResponse.json({ steps: [], fallback: true });
    const data = (await res.json()) as {
      code?: string;
      routes?: { legs?: { steps?: OsrmStep[] }[] }[];
    };
    const raw = data.code === "Ok" ? data.routes?.[0]?.legs?.[0]?.steps || [] : [];
    const steps: DrivingStep[] = [];
    for (const step of raw) {
      const loc = step.maneuver?.location;
      if (!loc || loc.length < 2) continue;
      const latitude = loc[1];
      const longitude = loc[0];
      if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) continue;
      steps.push({
        type: step.maneuver?.type || "continue",
        modifier: step.maneuver?.modifier || "",
        name: step.name || "",
        latitude,
        longitude,
        meters: Math.round(step.distance || 0),
      });
      if (steps.length >= 40) break;
    }
    return NextResponse.json({ steps, fallback: steps.length === 0 });
  } catch {
    return NextResponse.json({ steps: [], fallback: true });
  }
}
