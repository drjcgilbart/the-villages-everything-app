import { NextResponse } from "next/server";
import { notifyAdminOfApprovalRequest } from "@/lib/adminNotify";
import { rateLimitResponse } from "@/lib/authRateLimit";
import { holidayFrom, submitMemberHouse } from "@/lib/lightTour";
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
  const msg = err instanceof Error ? err.message : "Membership is not active.";
  return { error: msg, status: 403 };
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
    const pin = await submitMemberHouse({
      holiday,
      address: String(body?.address || ""),
      note: String(body?.note || ""),
      photoUrl: safePhoto(body?.photoUrl),
      latitude: num(body?.latitude),
      longitude: num(body?.longitude),
      createdBy: `${member.name} · ${member.email}`,
    });
    void notifyAdminOfApprovalRequest({
      topic: "Holiday Lights",
      title: pin.address || "New house",
      submittedBy: member.name,
      details: {
        Holiday: pin.holiday,
        Address: pin.address,
        Note: pin.note,
        Email: member.email,
      },
    }).catch(() => undefined);
    return NextResponse.json({ ok: true, id: pin.id });
  } catch (err) {
    return NextResponse.json({ error: saveMessage(err) }, { status: 400 });
  }
}
