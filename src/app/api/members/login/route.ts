import { NextResponse } from "next/server";
import { authenticateMember, toPublicMember } from "@/lib/yardSale";
import { memberCookieOptions } from "@/lib/memberAuth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const member = authenticateMember(body.email, body.password);
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
