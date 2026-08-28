import { NextResponse } from "next/server";
import { authenticateMember, toPublicMember } from "@/lib/yardSale";
import { memberCookieOptions } from "@/lib/memberAuth";
import { clearAuthAttempts, rateLimitResponse } from "@/lib/authRateLimit";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  const limited = rateLimitResponse(req, "member-login", 8);
  if (limited) return limited;
  try {
    const body = await req.json();
    const member = authenticateMember(body.email, body.password);
    clearAuthAttempts(req);
    const res = NextResponse.json({
      ok: true,
      member: toPublicMember(member),
    });
    const cookie = memberCookieOptions(member.id);
    res.cookies.set(cookie.name, cookie.value, cookie);
    return res;
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Login failed" },
      { status: 401 }
    );
  }
}
