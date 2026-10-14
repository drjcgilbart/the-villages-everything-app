import { NextResponse } from "next/server";
import { rateLimitResponse } from "@/lib/authRateLimit";
import { getSessionMember } from "@/lib/memberAuth";
import { sendMemberVerificationEmail } from "@/lib/memberEmailVerify";
import { rejectIfCrossOrigin } from "@/lib/security";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  const blocked = rejectIfCrossOrigin(req);
  if (blocked) return blocked;
  const limited = rateLimitResponse(req, "member-email-verify-send", 3, 15 * 60 * 1000);
  if (limited) return limited;
  const member = await getSessionMember();
  if (!member?.id) {
    return NextResponse.json({ error: "Sign in before we can send the confirmation email." }, { status: 401 });
  }
  const sent = await sendMemberVerificationEmail(member.id);
  if (!sent.ok) {
    return NextResponse.json({ error: sent.error }, { status: 503 });
  }
  return NextResponse.json({ ok: true, already: sent.already, email: member.email });
}
