import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import {
  blobConfigured,
  durableConfigured,
  ensureDurableHydrated,
  isEphemeralHost,
  missingDurableStorageHelp,
  redisConfigured,
} from "@/lib/dataFs";
import { badgesForMemberRecord } from "@/lib/memberBadges";
import {
  approveTopTierMembership,
  getMemberSpace,
  grantGoldenLoofah,
  loadMemberSpaces,
  publicSpacePayload,
  rejectTopTierMembership,
  saveMemberSpacesAsync,
  startRoyaltyTrial,
  updateMemberSpace,
} from "@/lib/memberSpace";
import { HUB_TIERS, normalizePlan } from "@/lib/membershipTiers";
import {
  getMemberById,
  listMembers,
  loadYardSale,
  saveYardSaleAsync,
  setMemberPassword,
  setMemberStatus,
} from "@/lib/yardSale";
import type { MemberStatus } from "@/lib/yardSaleTypes";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

async function persistAll() {
  await saveMemberSpacesAsync(loadMemberSpaces());
  await saveYardSaleAsync(loadYardSale());
}

function membersWithPlans() {
  return listMembers().map((m) => {
    const full = getMemberById(m.id);
    const space = getMemberSpace(m.id);
    const pub = publicSpacePayload(space);
    return {
      ...m,
      plan: pub.standingPlan,
      accessPlan: pub.plan,
      planLabel: pub.planLabel,
      planExpiresAt: pub.planExpiresAt,
      trialActive: pub.trialActive,
      trialExpiresAt: pub.trialExpiresAt,
      householdOwnerId: pub.householdOwnerId || null,
      householdSeats: pub.householdSeats,
      goldenLoofah: pub.goldenLoofah,
      donationBadges: pub.donationBadges,
      topTierNomination: pub.topTierNomination,
      badges: full ? badgesForMemberRecord(full) : [],
    };
  });
}

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await ensureDurableHydrated();
  const durable = durableConfigured();
  const redis = redisConfigured();
  const blob = blobConfigured();
  let durableHint: string | null = null;
  if (isEphemeralHost() && !redis) {
    // Blob Hobby is over quota for this project — Redis is required until reset/Pro
    durableHint = missingDurableStorageHelp();
  } else if (!isEphemeralHost()) {
    durableHint = null;
  }
  return NextResponse.json({
    members: membersWithPlans(),
    tiers: HUB_TIERS.map((t) => ({
      id: t.id,
      label: t.label,
      shortLabel: t.shortLabel,
      rank: t.rank,
      householdSeats: t.householdSeats,
    })),
    durableStorage: durable,
    redisStorage: redis,
    blobStorage: blob,
    storageCode: "storage-v2",
    durableHint,
  });
}

export async function POST(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    await ensureDurableHydrated();
    const body = await req.json();

    if (body.action === "setPassword") {
      const member = setMemberPassword(String(body.id || ""), body.password);
      await persistAll();
      return NextResponse.json({
        member,
        members: membersWithPlans(),
        durableStorage: durableConfigured(),
      });
    }

    if (body.action === "setPlan") {
      const id = String(body.id || "");
      const plan = normalizePlan(body.plan);
      updateMemberSpace(id, {
        plan,
        // Manual plan set is open-ended unless clearing royalty
        planExpiresAt: plan === "square_royalty" ? null : null,
      });
      await persistAll();
      return NextResponse.json({
        memberId: id,
        plan,
        planLabel: publicSpacePayload(getMemberSpace(id)).planLabel,
        members: membersWithPlans(),
        durableStorage: durableConfigured(),
      });
    }

    if (body.action === "setGoldenLoofah") {
      const id = String(body.id || "");
      if (body.goldenLoofah === false) {
        const space = getMemberSpace(id);
        const badges = (space.donationBadges || []).filter(
          (b) => b !== "golden_loofah" && b !== "custom_star_loofah"
        );
        updateMemberSpace(id, {
          donationBadges: badges,
          goldenLoofah: false,
          goldenLoofahAt: null,
        });
      } else {
        grantGoldenLoofah(id);
      }
      await persistAll();
      return NextResponse.json({
        memberId: id,
        goldenLoofah: !!getMemberSpace(id).goldenLoofah,
        members: membersWithPlans(),
        durableStorage: durableConfigured(),
      });
    }

    if (body.action === "approveTopTier") {
      const id = String(body.id || "");
      const mem = getMemberById(id);
      if (mem && mem.status === "pending") {
        setMemberStatus(id, "approved");
      }
      approveTopTierMembership(id);
      await persistAll();
      return NextResponse.json({
        memberId: id,
        members: membersWithPlans(),
        durableStorage: durableConfigured(),
      });
    }

    if (body.action === "grantTrial") {
      const id = String(body.id || "");
      try {
        startRoyaltyTrial(id, "admin");
      } catch {
        const now = new Date();
        const ends = new Date(now);
        ends.setUTCDate(ends.getUTCDate() + 30);
        updateMemberSpace(id, {
          trial: {
            startedAt: now.toISOString(),
            expiresAt: ends.toISOString(),
            source: "admin",
          },
        });
      }
      await persistAll();
      return NextResponse.json({
        memberId: id,
        members: membersWithPlans(),
        durableStorage: durableConfigured(),
      });
    }

    if (body.action === "endTrial") {
      const id = String(body.id || "");
      const space = getMemberSpace(id);
      if (space.trial) {
        updateMemberSpace(id, {
          trial: {
            ...space.trial,
            expiresAt: new Date().toISOString(),
          },
        });
      }
      await persistAll();
      return NextResponse.json({
        memberId: id,
        members: membersWithPlans(),
        durableStorage: durableConfigured(),
      });
    }

    if (body.action === "rejectTopTier") {
      const id = String(body.id || "");
      rejectTopTierMembership(id);
      await persistAll();
      return NextResponse.json({
        memberId: id,
        members: membersWithPlans(),
        durableStorage: durableConfigured(),
      });
    }

    const status = body.status as MemberStatus;
    if (!["pending", "approved", "rejected", "suspended"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    const member = setMemberStatus(body.id, status, body.notes);
    await persistAll();
    return NextResponse.json({
      member,
      members: membersWithPlans(),
      durableStorage: durableConfigured(),
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Update failed" },
      { status: 400 }
    );
  }
}
