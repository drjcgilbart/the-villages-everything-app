import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { rateLimitResponse } from "@/lib/authRateLimit";
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

/** Admin copy of the public house card. Saves an approved pin and does not ask for approval. */
export async function POST(req: Request) {
  const blocked = rejectIfCrossOrigin(req);
  if (blocked) return blocked;
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Sign in on the Admin page first." }, { status: 401 });
  }
  const limited = rateLimitResponse(req, "light-tour-add", 40, 15 * 60 * 1000);
  if (limited) return limited;
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  const holiday = holidayFrom(body?.holiday);
  if (!holiday) {
    return NextResponse.json({ error: "Pick Halloween, Christmas, or Other." }, { status: 400 });
  }
  const member = await getSessionMember();
  try {
    const pin = await submitMemberHouse({
      holiday,
      address: String(body?.address || ""),
      note: String(body?.note || ""),
      photoUrl: safePhoto(body?.photoUrl),
      latitude: num(body?.latitude),
      longitude: num(body?.longitude),
      createdBy: member?.email || "admin",
      status: "approved",
    });
    return NextResponse.json({ ok: true, id: pin.id, status: pin.status });
  } catch (err) {
    return NextResponse.json({ error: saveMessage(err) }, { status: 400 });
  }
}
