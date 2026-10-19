import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { rateLimitResponse } from "@/lib/authRateLimit";
import { readTourZips, reviewTourZip } from "@/lib/lightTour";
import { rejectIfCrossOrigin } from "@/lib/security";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: Request) {
  const admin = new URL(req.url).searchParams.get("admin") === "1";
  if (admin && !(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Sign in on the Admin page first." }, { status: 401 });
  }
  const data = await readTourZips();
  if (!admin) return NextResponse.json({ zips: data.zips });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const blocked = rejectIfCrossOrigin(req);
  if (blocked) return blocked;
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Sign in on the Admin page first." }, { status: 401 });
  }
  const limited = rateLimitResponse(req, "light-tour-zip", 40, 15 * 60 * 1000);
  if (limited) return limited;
  const body = (await req.json().catch(() => null)) as { zip?: unknown; decision?: unknown } | null;
  const decision = body?.decision === "approved" || body?.decision === "declined" ? body.decision : null;
  if (!decision) return NextResponse.json({ error: "Approve or decline that ZIP." }, { status: 400 });
  try {
    await reviewTourZip(String(body?.zip || ""), decision);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "The ZIP did not update.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
