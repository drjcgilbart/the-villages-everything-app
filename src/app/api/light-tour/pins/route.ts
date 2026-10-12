import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getSessionMember } from "@/lib/memberAuth";
import { rateLimitResponse } from "@/lib/authRateLimit";
import { rejectIfCrossOrigin } from "@/lib/security";
import {
  deletePin,
  holidayFrom,
  publicPin,
  readLightTour,
  reverseGeocode,
  savePin,
  type TourHoliday,
} from "@/lib/lightTour";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function num(value: unknown): number | null {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : null;
}

function safePhoto(value: unknown) {
  const text = String(value || "").trim();
  if (!text) return "";
  if (text.startsWith("/api/media/")) return text.slice(0, 400);
  try {
    const url = new URL(text);
    if (url.protocol === "https:") return text.slice(0, 400);
  } catch {
    return "";
  }
  return "";
}

async function createdBy() {
  const member = await getSessionMember();
  return member?.email || "admin";
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const holiday = holidayFrom(url.searchParams.get("holiday"));
  const admin = url.searchParams.get("admin") === "1";
  if (admin && !(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Sign in on the Admin page first." }, { status: 401 });
  }
  const store = await readLightTour();
  const pins = holiday ? store.pins.filter((pin) => pin.holiday === holiday) : store.pins;
  return NextResponse.json({
    pins: admin ? pins : pins.map(publicPin),
  });
}

export async function POST(req: Request) {
  const blocked = rejectIfCrossOrigin(req);
  if (blocked) return blocked;
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Sign in on the Admin page first." }, { status: 401 });
  }
  const limited = rateLimitResponse(req, "light-tour-pin", 60, 15 * 60 * 1000);
  if (limited) return limited;
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  const holiday = holidayFrom(body?.holiday);
  const latitude = num(body?.latitude);
  const longitude = num(body?.longitude);
  if (!holiday || latitude == null || longitude == null) {
    return NextResponse.json({ error: "Need a holiday and a map point." }, { status: 400 });
  }
  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    return NextResponse.json({ error: "That location is not on the map." }, { status: 400 });
  }
  let address = String(body?.address || "").trim();
  if (!address) address = await reverseGeocode(latitude, longitude);
  const pin = await savePin({
    holiday,
    latitude,
    longitude,
    address,
    photoUrl: safePhoto(body?.photoUrl),
    note: String(body?.note || ""),
    createdBy: await createdBy(),
  });
  return NextResponse.json({ pin });
}

export async function PUT(req: Request) {
  const blocked = rejectIfCrossOrigin(req);
  if (blocked) return blocked;
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Sign in on the Admin page first." }, { status: 401 });
  }
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  const id = String(body?.id || "").trim();
  const holiday = holidayFrom(body?.holiday) as TourHoliday | null;
  const latitude = num(body?.latitude);
  const longitude = num(body?.longitude);
  if (!id || !holiday || latitude == null || longitude == null) {
    return NextResponse.json({ error: "Need the pin, holiday, and location." }, { status: 400 });
  }
  const store = await readLightTour();
  const existing = store.pins.find((pin) => pin.id === id);
  if (!existing) return NextResponse.json({ error: "That pin is gone." }, { status: 404 });
  let address = String(body?.address ?? existing.address).trim();
  const moved = Math.abs(existing.latitude - latitude) > 0.00001 || Math.abs(existing.longitude - longitude) > 0.00001;
  if (moved && !String(body?.address || "").trim()) address = await reverseGeocode(latitude, longitude);
  const pin = await savePin({
    id,
    holiday,
    latitude,
    longitude,
    address,
    photoUrl: body?.photoUrl === undefined ? existing.photoUrl : safePhoto(body.photoUrl),
    note: body?.note === undefined ? existing.note : String(body.note),
    createdBy: existing.createdBy,
  });
  return NextResponse.json({ pin });
}

export async function DELETE(req: Request) {
  const blocked = rejectIfCrossOrigin(req);
  if (blocked) return blocked;
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Sign in on the Admin page first." }, { status: 401 });
  }
  const id = new URL(req.url).searchParams.get("id") || "";
  if (!id) return NextResponse.json({ error: "Need a pin id." }, { status: 400 });
  const ok = await deletePin(id);
  if (!ok) return NextResponse.json({ error: "That pin is gone." }, { status: 404 });
  return NextResponse.json({ ok: true });
}
