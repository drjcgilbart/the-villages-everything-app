import { NextResponse } from "next/server";
import { getSessionMember } from "@/lib/memberAuth";
import { toPublicMember } from "@/lib/yardSale";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const member = await getSessionMember();
  if (!member) {
    return NextResponse.json({ member: null });
  }
  return NextResponse.json({ member: toPublicMember(member) });
}
