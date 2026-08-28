import { NextResponse } from "next/server";
import { registerMember } from "@/lib/yardSale";
import { rateLimitResponse } from "@/lib/authRateLimit";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  const limited = rateLimitResponse(req, "member-register", 6);
  if (limited) return limited;
  try {
    const body = await req.json();
    const member = registerMember({
      name: body.name,
      email: body.email,
      password: body.password,
      phone: body.phone,
      village: body.village,
    });
    const updatedPending = member.status === "pending";
    return NextResponse.json({
      ok: true,
      member,
      message: updatedPending
        ? "Thanks! Your membership request is on file (or was updated). You can sign in with this password while pending; posting listings still needs admin approval."
        : "Thanks! Your membership request was submitted. You’ll be able to post listings after the admin approves you.",
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Registration failed" },
      { status: 400 }
    );
  }
}
