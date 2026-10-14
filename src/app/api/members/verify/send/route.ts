import { NextResponse } from "next/server";
import { rateLimitResponse } from "@/lib/authRateLimit";
import { getSessionMember, getSessionMemberId } from "@/lib/memberAuth";
import { memberRosterUnreadable } from "@/lib/dataFs";
import { hydrateYardSale } from "@/lib/yardSale";
import { sendMemberVerificationEmail } from "@/lib/memberEmailVerify";
import { rejectIfCrossOrigin } from "@/lib/security";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  const blocked = rejectIfCrossOrigin(req);
  if (blocked) return blocked;
  const limited = rateLimitResponse(req, "member-email-verify-send", 3, 15 * 60 * 1000);
  if (limited) return limited;
  const sessionId = await getSessionMemberId();
  if (sessionId) await hydrateYardSale();
  const member = sessionId ? await getSessionMember() : null;
  if (!member?.id) {
    if (sessionId && memberRosterUnreadable()) {
      return NextResponse.json(
        { error: "You are signed in, but the membership list did not load. Refresh this page." },
        { status: 503 }
      );
    }
    return NextResponse.json({ error: "Sign in before we can send the confirmation email." }, { status: 401 });
  }
  const sent = await sendMemberVerificationEmail(member.id);
  if (!sent.ok) {
    return NextResponse.json({ error: sent.error }, { status: 503 });
  }
  const res = NextResponse.json({ ok: true, already: sent.already, email: member.email });
  res.headers.set("Cache-Control", "private, no-store, max-age=0");
  return res;
}
