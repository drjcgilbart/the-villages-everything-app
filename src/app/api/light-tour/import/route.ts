import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getSessionMember } from "@/lib/memberAuth";
import { rejectIfCrossOrigin } from "@/lib/security";
import { holidayFrom, importPins, parsePinImport } from "@/lib/lightTour";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  const blocked = rejectIfCrossOrigin(req);
  if (blocked) return blocked;
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Sign in on the Admin page first." }, { status: 401 });
  }
  const body = (await req.json().catch(() => null)) as { text?: string; holiday?: string } | null;
  const holiday = holidayFrom(body?.holiday);
  const text = String(body?.text || "");
  if (!holiday) return NextResponse.json({ error: "Pick a holiday for this import." }, { status: 400 });
  if (text.length > 2_000_000) {
    return NextResponse.json({ error: "That file is too large." }, { status: 400 });
  }
  const drafts = parsePinImport(text, holiday);
  if (!drafts.length) {
    return NextResponse.json(
      { error: "No map points found. Use lat, lng lines, a CSV with latitude and longitude, or GeoJSON points." },
      { status: 400 }
    );
  }
  const member = await getSessionMember();
  const pins = await importPins(drafts.slice(0, 2000), member?.email || "admin");
  return NextResponse.json({ added: pins.length });
}
