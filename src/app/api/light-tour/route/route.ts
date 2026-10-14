import { NextResponse } from "next/server";
import { rateLimitResponse } from "@/lib/authRateLimit";
import { rejectIfCrossOrigin } from "@/lib/security";
import {
  holidayFrom,
  isPendingPin,
  locateTourAddress,
  publicPin,
  readLightTour,
  DEFAULT_STOPS,
  MAX_STOPS,
} from "@/lib/lightTour";
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
  let latitude = Number(body?.latitude);
  let longitude = Number(body?.longitude);
  const address = typeof body?.address === "string" ? body.address.trim().slice(0, 180) : "";
  const count = Math.min(MAX_STOPS, Math.max(1, Math.round(Number(body?.count) || DEFAULT_STOPS)));
  const store = await readLightTour();
  if (address) {
    const located = await locateTourAddress(
      address,
      store.pins.filter((pin) => !isPendingPin(pin))
    );
    if (!located) {
      return NextResponse.json(
        { error: "That address was not found near The Villages. Include the street, city, and ZIP." },
        { status: 400 }
      );
    }
    latitude = located.latitude;
    longitude = located.longitude;
  }
  if (!holiday || !Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return NextResponse.json({ error: "Type your street address, or turn on Use my location." }, { status: 400 });
  }
  const far = tourStartProblem({ latitude, longitude });
  if (far) return NextResponse.json({ error: far }, { status: 400 });
  const pins = store.pins.filter((pin) => pin.holiday === holiday && !isPendingPin(pin)).map(publicPin);
  if (!pins.length) {
    return NextResponse.json({
      stops: [],
      line: [],
      warning: "",
      empty: true,
      usedAllPins: true,
      requested: count,
      available: 0,
      start: { latitude, longitude },
    });
  }
  const route = await buildDrivingRoute({
    visitor: { latitude, longitude },
    pins,
    count,
  });
  return NextResponse.json({ ...route, empty: false, start: { latitude, longitude } });
}
