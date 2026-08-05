import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { badgesForMemberRecord } from "@/lib/memberBadges";
import {
  approveTopTierMembership,
  getMemberSpace,
  grantGoldenLoofah,
  publicSpacePayload,
  rejectTopTierMembership,
  updateMemberSpace,
} from "@/lib/memberSpace";
import { HUB_TIERS, normalizePlan } from "@/lib/membershipTiers";
import {
  getMemberById,
  listMembers,
  setMemberPassword,
  setMemberStatus,
} from "@/lib/yardSale";
import type { MemberStatus } from "@/lib/yardSaleTypes";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function membersWithPlans() {
  return listMembers().map((m) => {
    const full = getMemberById(m.id);
    const space = getMemberSpace(m.id);
    const pub = publicSpacePayload(space);
    return {
      ...m,
      plan: pub.plan,
      planLabel: pub.planLabel,
      planExpiresAt: pub.planExpiresAt,
      goldenLoofah: pub.goldenLoofah,
      donationBadges: pub.donationBadges,
      topTierNomination: pub.topTierNomination,
      badges: full ? badgesForMemberRecord(full, space.plan) : [],
    };
  });
}

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({
    members: membersWithPlans(),
    tiers: HUB_TIERS.map((t) => ({
      id: t.id,
      label: t.label,
      shortLabel: t.shortLabel,
      rank: t.rank,
    })),
  });
}

export async function POST(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();

    if (body.action === "setPassword") {
      const member = setMemberPassword(String(body.id || ""), body.password);
      return NextResponse.json({ member, members: membersWithPlans() });
    }

    if (body.action === "setPlan") {
      const id = String(body.id || "");
      const plan = normalizePlan(body.plan);
      updateMemberSpace(id, { plan });
      return NextResponse.json({
        memberId: id,
        plan,
        planLabel: publicSpacePayload(getMemberSpace(id)).planLabel,
        members: membersWithPlans(),
      });
    }

    if (body.action === "setGoldenLoofah") {
      const id = String(body.id || "");
      if (body.goldenLoofah === false) {
        updateMemberSpace(id, { goldenLoofah: false, goldenLoofahAt: null });
      } else {
        grantGoldenLoofah(id);
      }
      return NextResponse.json({
        memberId: id,
        goldenLoofah: !!getMemberSpace(id).goldenLoofah,
        members: membersWithPlans(),
      });
    }

    if (body.action === "approveTopTier") {
      const id = String(body.id || "");
      // Ensure account can use the site as a member
      const mem = getMemberById(id);
      if (mem && mem.status === "pending") {
        setMemberStatus(id, "approved");
      }
      approveTopTierMembership(id);
      return NextResponse.json({
        memberId: id,
        members: membersWithPlans(),
      });
    }

    if (body.action === "rejectTopTier") {
      const id = String(body.id || "");
      rejectTopTierMembership(id);
      return NextResponse.json({
        memberId: id,
        members: membersWithPlans(),
      });
    }

    const status = body.status as MemberStatus;
    if (!["pending", "approved", "rejected", "suspended"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    const member = setMemberStatus(body.id, status, body.notes);
    return NextResponse.json({ member, members: membersWithPlans() });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Update failed" },
      { status: 400 }
    );
  }
}
