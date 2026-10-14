import { NextResponse } from "next/server";
import { rateLimitResponse } from "@/lib/authRateLimit";
import {
  deleteOwnedHouse,
  holidayFrom,
  memberOwnsPin,
  readLightTour,
  updateOwnedHouse,
} from "@/lib/lightTour";
import { requireApprovedMember } from "@/lib/memberAuth";
import { rejectIfCrossOrigin } from "@/lib/security";

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

function memberMessage(err: unknown) {
  const code = err && typeof err === "object" && "code" in err ? Number((err as { code: number }).code) : 401;
  if (code === 401) {
    return { error: "Become a member first. The free Porch Waver plan is enough.", status: 401 };
  }
  if (code === 404) return { error: "That house is not yours.", status: 404 };
  const msg = err instanceof Error ? err.message : "Membership is not active.";
  return { error: msg, status: code === 403 ? 403 : 400 };
}

function saveMessage(err: unknown) {
  const refused = memberMessage(err);
  if (refused.status === 401 || refused.status === 403 || refused.status === 404) return refused;
  const msg = err instanceof Error ? err.message : "The house could not be saved.";
  if (/storage-v2|durable storage|Redis HTTP|Vercel Blob|starter file/i.test(msg)) {
    return { error: "The house could not be saved right now. Wait a minute and try again.", status: 400 };
  }
  return { error: msg, status: 400 };
}

export async function GET() {
  let member;
  try {
    member = await requireApprovedMember();
  } catch (err) {
    const refused = memberMessage(err);
    return NextResponse.json({ error: refused.error }, { status: refused.status });
  }
  const store = await readLightTour();
  const pins = store.pins
    .filter((pin) => memberOwnsPin(pin, member))
    .map((pin) => ({
      id: pin.id,
      holiday: pin.holiday,
      latitude: pin.latitude,
      longitude: pin.longitude,
      address: pin.address,
      photoUrl: pin.photoUrl,
      note: pin.note,
      status: pin.status,
      updatedAt: pin.updatedAt,
    }));
  return NextResponse.json({ pins });
}

export async function PUT(req: Request) {
  const blocked = rejectIfCrossOrigin(req);
  if (blocked) return blocked;
  const limited = rateLimitResponse(req, "light-tour-mine", 40, 15 * 60 * 1000);
  if (limited) return limited;
  let member;
  try {
    member = await requireApprovedMember();
  } catch (err) {
    const refused = memberMessage(err);
    return NextResponse.json({ error: refused.error }, { status: refused.status });
  }
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  const holiday = holidayFrom(body?.holiday);
  if (!holiday) {
    return NextResponse.json({ error: "Pick Halloween, Christmas, or Other." }, { status: 400 });
  }
  try {
    const pin = await updateOwnedHouse({
      id: String(body?.id || ""),
      memberId: member.id,
      email: member.email,
      holiday,
      address: String(body?.address || ""),
      note: String(body?.note || ""),
      photoUrl: safePhoto(body?.photoUrl),
      latitude: num(body?.latitude),
      longitude: num(body?.longitude),
    });
    return NextResponse.json({ ok: true, id: pin.id, status: pin.status });
  } catch (err) {
    const refused = saveMessage(err);
    return NextResponse.json({ error: refused.error }, { status: refused.status });
  }
}

export async function DELETE(req: Request) {
  const blocked = rejectIfCrossOrigin(req);
  if (blocked) return blocked;
  const limited = rateLimitResponse(req, "light-tour-mine-delete", 40, 15 * 60 * 1000);
  if (limited) return limited;
  let member;
  try {
    member = await requireApprovedMember();
  } catch (err) {
    const refused = memberMessage(err);
    return NextResponse.json({ error: refused.error }, { status: refused.status });
  }
  const id = new URL(req.url).searchParams.get("id") || "";
  const ok = await deleteOwnedHouse(id, member);
  if (!ok) return NextResponse.json({ error: "That house is not yours." }, { status: 404 });
  return NextResponse.json({ ok: true });
}
