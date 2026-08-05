import { NextResponse } from "next/server";
import { badgesForMemberRecord } from "@/lib/memberBadges";
import { getSessionMember } from "@/lib/memberAuth";
import { getMemberSpace, publicSpacePayload } from "@/lib/memberSpace";
import { toPublicMember } from "@/lib/yardSale";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const member = await getSessionMember();
  if (!member) {
    return NextResponse.json({ member: null });
  }
  const space = getMemberSpace(member.id);
  return NextResponse.json({
    member: toPublicMember(member),
    badges: badgesForMemberRecord(member, space.plan),
    space: publicSpacePayload(space),
  });
}
