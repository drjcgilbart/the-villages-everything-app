import { NextResponse } from "next/server";
import { rateLimitResponse } from "@/lib/authRateLimit";
import { rejectIfCrossOrigin } from "@/lib/security";
import { holidayFrom, publicPin, readLightTour, DEFAULT_STOPS, MAX_STOPS } from "@/lib/lightTour";
import { tourStartProblem } from "@/lib/lightTourShared";
import { buildDrivingRoute } from "@/lib/lightTourRoute";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  const blocked = rejectIfCrossOrigin(req);
  if (blocked) return blocked;
  const limited = rateLimitResponse(req, "light-tour-route", 30, 10 * 60 * 1000);
  if (limited) return limited;
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  const holiday = holidayFrom(body?.holiday);
  const latitude = Number(body?.latitude);
  const longitude = Number(body?.longitude);
  const count = Math.min(MAX_STOPS, Math.max(1, Math.round(Number(body?.count) || DEFAULT_STOPS)));
  if (!holiday || !Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return NextResponse.json({ error: "Need a holiday and your location." }, { status: 400 });
  }
  const far = tourStartProblem({ latitude, longitude });
  if (far) return NextResponse.json({ error: far }, { status: 400 });
  const store = await readLightTour();
  const pins = store.pins.filter((pin) => pin.holiday === holiday).map(publicPin);
  if (!pins.length) {
    return NextResponse.json({
      stops: [],
      line: [],
      warning: "",
      empty: true,
      usedAllPins: true,
      requested: count,
      available: 0,
    });
  }
  const route = await buildDrivingRoute({
    visitor: { latitude, longitude },
    pins,
    count,
  });
  return NextResponse.json({ ...route, empty: false });
}
