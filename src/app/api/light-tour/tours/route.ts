import { NextResponse } from "next/server";
import { rateLimitResponse } from "@/lib/authRateLimit";
import { rejectIfCrossOrigin } from "@/lib/security";
import { holidayFrom, logTour } from "@/lib/lightTour";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  const blocked = rejectIfCrossOrigin(req);
  if (blocked) return blocked;
  const limited = rateLimitResponse(req, "light-tour-log", 40, 15 * 60 * 1000);
  if (limited) return limited;
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  const holiday = holidayFrom(body?.holiday);
  const sessionId = String(body?.sessionId || "").trim();
  const stopCount = Math.max(0, Math.round(Number(body?.stopCount) || 0));
  if (!holiday || !sessionId) {
    return NextResponse.json({ error: "Need a tour id." }, { status: 400 });
  }
  await logTour({
    sessionId,
    holiday,
    stopCount,
    startedAt: String(body?.startedAt || ""),
    completedAt: String(body?.completedAt || ""),
  });
  return NextResponse.json({ ok: true });
}
