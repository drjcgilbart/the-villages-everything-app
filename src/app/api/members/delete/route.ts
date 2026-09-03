import { NextResponse } from "next/server";
import { rateLimitResponse } from "@/lib/authRateLimit";
import { clearMemberCookieOptions, getSessionMember } from "@/lib/memberAuth";
import { deleteMemberAccount } from "@/lib/memberDelete";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  const limited = rateLimitResponse(req, "member-delete", 4);
  if (limited) return limited;

  const member = await getSessionMember();
  if (!member) {
    return NextResponse.json({ error: "Please sign in" }, { status: 401 });
  }

  try {
    const body = (await req.json().catch(() => ({}))) as { confirm?: string };
    if (String(body.confirm || "").trim().toUpperCase() !== "DELETE") {
      return NextResponse.json(
        { error: "Type DELETE to confirm account deletion" },
        { status: 400 }
      );
    }
    await deleteMemberAccount(member.id);
    const res = NextResponse.json({
      ok: true,
      message: "Your account and private data were deleted.",
    });
    const cookie = clearMemberCookieOptions();
    res.cookies.set(cookie.name, cookie.value, cookie);
    return res;
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Could not delete this account",
      },
      { status: 500 }
    );
  }
}
