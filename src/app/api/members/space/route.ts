import { NextRequest, NextResponse } from "next/server";
import { householdClientPayload } from "@/lib/household";
import { getSessionMember } from "@/lib/memberAuth";
import { badgesForMemberRecord } from "@/lib/memberBadges";
import {
  getMemberSpace,
  memberCanAccess,
  publicSpacePayload,
  updateMemberSpace,
} from "@/lib/memberSpace";
import { normalizePlan, paidTiers, type HubPlanId } from "@/lib/membershipTiers";
import { grantSiteOwnerFullAccess } from "@/lib/siteOwnerAccess";
import { isSiteOwnerEmail } from "@/lib/siteOwner";
import { getMemberById, hydrateYardSale, toPublicMember } from "@/lib/yardSale";
import { POPULAR_CLUBS } from "@/lib/clubs";

export const dynamic = "force-dynamic";

export async function GET() {
  await hydrateYardSale();
  let member = await getSessionMember();
  if (!member) {
    return NextResponse.json({ error: "Please sign in" }, { status: 401 });
  }
  if (isSiteOwnerEmail(member.email)) {
    member = await grantSiteOwnerFullAccess(member);
    member = getMemberById(member.id) || member;
  }
  const space = getMemberSpace(member.id);
  const payload = {
    ...publicSpacePayload(space),
    household: householdClientPayload(member.id, space),
  };
  const favoriteClubs = POPULAR_CLUBS.filter((c) =>
    space.favoriteClubIds.includes(c.id)
  );
  return NextResponse.json({
    member: toPublicMember(member),
    badges: badgesForMemberRecord(member),
    space: payload,
    favoriteClubs,
    upgradeTiers: paidTiers().map((t) => ({
      id: t.id,
      label: t.label,
      tagline: t.tagline,
      blurb: t.blurb,
      householdSeats: t.householdSeats,
    })),
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
    plan?: string;
  };

  if (
    body.devUnlock &&
    process.env.HUB_MEMBER_DEV_UNLOCK === "true" &&
    process.env.VERCEL_ENV !== "production"
  ) {
    const plan = normalizePlan(body.plan || "cart_path_regular") as HubPlanId;
    // Dev unlock never stays on free porch unless explicitly porch_waver
    updateMemberSpace(member.id, {
      plan: plan === "porch_waver" ? "cart_path_regular" : plan,
    });
  }

  if (body.favoriteClubIds) {
    const allowed = new Set(POPULAR_CLUBS.map((c) => c.id));
    const ids = body.favoriteClubIds.filter((id) => allowed.has(id));
    updateMemberSpace(member.id, { favoriteClubIds: ids });
  }

  if (body.spaceTitle !== undefined) {
    if (!memberCanAccess(getMemberSpace(member.id), "weather")) {
      return NextResponse.json(
        { error: "Cart Path Regular or higher required to customize your space" },
        { status: 403 }
      );
    }
    updateMemberSpace(member.id, { spaceTitle: body.spaceTitle });
  }

  const next = getMemberSpace(member.id);
  return NextResponse.json({
    space: {
      ...publicSpacePayload(next),
      household: householdClientPayload(member.id, next),
    },
  });
}
