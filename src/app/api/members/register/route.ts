import { NextResponse } from "next/server";
import { registerMember } from "@/lib/yardSale";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const member = registerMember({
      name: body.name,
      email: body.email,
      password: body.password,
      phone: body.phone,
      village: body.village,
    });
    return NextResponse.json({
      ok: true,
      member,
      message:
        "Thanks! Your membership request was submitted. You’ll be able to post listings after the admin approves you.",
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Registration failed" },
      { status: 400 }
    );
  }
}
