import { NextRequest, NextResponse } from "next/server";
import { getSessionMember } from "@/lib/memberAuth";
import {
  getMemberSpace,
  isSubscriber,
  memberHasSpaceAccess,
  updateMemberSpace,
} from "@/lib/memberSpace";
import { toPublicMember } from "@/lib/yardSale";
import { POPULAR_CLUBS } from "@/lib/clubs";

export const dynamic = "force-dynamic";

export async function GET() {
  const member = await getSessionMember();
  if (!member) {
    return NextResponse.json({ error: "Please sign in" }, { status: 401 });
  }
  const space = getMemberSpace(member.id);
  const favoriteClubs = POPULAR_CLUBS.filter((c) =>
    space.favoriteClubIds.includes(c.id)
  );
  return NextResponse.json({
    member: toPublicMember(member),
    space: {
      plan: space.plan,
      favoriteClubIds: space.favoriteClubIds,
      spaceTitle: space.spaceTitle,
      updatedAt: space.updatedAt,
      hasSpaceAccess: memberHasSpaceAccess(space),
      isSubscriber: isSubscriber(space),
    },
    favoriteClubs,
  });
}

export async function PATCH(req: NextRequest) {
  const member = await getSessionMember();
  if (!member) {
    return NextResponse.json({ error: "Please sign in" }, { status: 401 });
  }
  if (member.status !== "approved") {
    return NextResponse.json(
      { error: "Membership must be approved first" },
      { status: 403 }
    );
  }

  const body = (await req.json()) as {
    favoriteClubIds?: string[];
    spaceTitle?: string;
    /** Dev unlock when HUB_MEMBER_DEV_UNLOCK=true */
    devUnlock?: boolean;
  };

  const space = getMemberSpace(member.id);

  if (body.devUnlock && process.env.HUB_MEMBER_DEV_UNLOCK === "true") {
    updateMemberSpace(member.id, { plan: "subscriber" });
  }

  if (body.favoriteClubIds) {
    const allowed = new Set(POPULAR_CLUBS.map((c) => c.id));
    const ids = body.favoriteClubIds.filter((id) => allowed.has(id));
    // Free members can still save favorites; full My Space page needs subscriber
    updateMemberSpace(member.id, { favoriteClubIds: ids });
  }

  if (body.spaceTitle !== undefined) {
    if (!memberHasSpaceAccess(getMemberSpace(member.id))) {
      return NextResponse.json(
        { error: "Subscriber plan required to customize your space" },
        { status: 403 }
      );
    }
    updateMemberSpace(member.id, { spaceTitle: body.spaceTitle });
  }

  const next = getMemberSpace(member.id);
  return NextResponse.json({
    space: {
      plan: next.plan,
      favoriteClubIds: next.favoriteClubIds,
      spaceTitle: next.spaceTitle,
      updatedAt: next.updatedAt,
      hasSpaceAccess: memberHasSpaceAccess(next),
      isSubscriber: isSubscriber(next),
    },
  });
}
