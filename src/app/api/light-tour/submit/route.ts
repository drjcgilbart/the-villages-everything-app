import { NextResponse } from "next/server";
import { notifyAdminOfApprovalRequest } from "@/lib/adminNotify";
import { rateLimitResponse } from "@/lib/authRateLimit";
import { houseAddressFromInput } from "@/lib/houseAddress";
import { holidayFrom, submitMemberHouse } from "@/lib/lightTour";
import { getSessionMember } from "@/lib/memberAuth";
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

function saveMessage(err: unknown) {
  const msg = err instanceof Error ? err.message : "The house could not be saved.";
  if (/storage-v2|durable storage|Redis HTTP|Vercel Blob|starter file/i.test(msg)) {
    return "The house could not be saved right now. Wait a minute and try again.";
  }
  return msg;
}

export async function POST(req: Request) {
  const blocked = rejectIfCrossOrigin(req);
  if (blocked) return blocked;
  const limited = rateLimitResponse(req, "light-tour-submit", 20, 15 * 60 * 1000);
  if (limited) return limited;
  const member = await getSessionMember();
  const canOwn = member?.status === "pending" || member?.status === "approved";
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  const holiday = holidayFrom(body?.holiday);
  if (!holiday) {
    return NextResponse.json({ error: "Pick Halloween, Christmas, or Other." }, { status: 400 });
  }
  let place: ReturnType<typeof houseAddressFromInput>;
  try {
    place = houseAddressFromInput(body || {});
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Type the street address." }, { status: 400 });
  }
  try {
    const pin = await submitMemberHouse({
      holiday,
      address: place.address,
      note: String(body?.note || ""),
      photoUrl: safePhoto(body?.photoUrl),
      latitude: num(body?.latitude),
      longitude: num(body?.longitude),
      createdBy: member ? `${member.name} · ${member.email}` : "Neighbor",
      ownerId: canOwn && member ? member.id : "",
      zip: place.explicitZip ? place.zip : "",
    });
    void notifyAdminOfApprovalRequest({
      topic: "Holiday Lights",
      title: pin.address || "New house",
      submittedBy: member?.name || "Neighbor",
      details: {
        Holiday: pin.holiday,
        Address: pin.address,
        Note: pin.note,
        Email: member?.email || "No account",
      },
    }).catch(() => undefined);
    return NextResponse.json({ ok: true, id: pin.id });
  } catch (err) {
    return NextResponse.json({ error: saveMessage(err) }, { status: 400 });
  }
}
