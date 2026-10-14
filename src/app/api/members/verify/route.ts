import { NextResponse } from "next/server";
import { rateLimitResponse } from "@/lib/authRateLimit";
import { confirmMemberEmail } from "@/lib/memberEmailVerify";
import { rejectIfCrossOrigin } from "@/lib/security";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  const blocked = rejectIfCrossOrigin(req);
  if (blocked) return blocked;
  const limited = rateLimitResponse(req, "member-email-verify", 10, 15 * 60 * 1000);
  if (limited) return limited;
  const body = (await req.json().catch(() => null)) as { token?: unknown } | null;
  const queryToken = new URL(req.url).searchParams.get("token") || "";
  try {
    const member = await confirmMemberEmail(String(body?.token || queryToken));
    const res = NextResponse.json({ ok: true, email: member.email });
    res.headers.set("Cache-Control", "private, no-store, max-age=0");
    return res;
  } catch (err) {
    const status =
      err && typeof err === "object" && "status" in err ? Number((err as { status: number }).status) : 400;
    const message = err instanceof Error ? err.message : "This link has expired or was already used.";
    return NextResponse.json({ error: message }, { status: status >= 400 && status < 600 ? status : 400 });
  }
}
