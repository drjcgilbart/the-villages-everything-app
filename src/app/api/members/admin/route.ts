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
import { deleteMemberAccount } from "@/lib/memberDelete";
import { isSiteOwnerEmail } from "@/lib/siteOwner";
import {
  appendAdminLog,
  getAdminLog,
  getMemberById,
  listMembers,
  loadYardSale,
  saveYardSaleAsync,
  setMemberPassword,
  setMemberStatus,
  toPublicMember,
  updateMemberDetails,
} from "@/lib/yardSale";
import type { MemberStatus } from "@/lib/yardSaleTypes";
import { sendMemberWelcomeEmail } from "@/lib/memberWelcomeMail";

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
      adminLog: getAdminLog(m.id),
      notes: full?.notes || "",
      approvedAt: full?.approvedAt || null,
      hasPassword: Boolean(full?.passwordHash),
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

    if (body.action === "deleteMember") {
      const id = String(body.id || "");
      const mem = getMemberById(id);
      if (!mem) {
        return NextResponse.json({ error: "Member not found" }, { status: 404 });
      }
      if (isSiteOwnerEmail(mem.email)) {
        return NextResponse.json(
          { error: "The site-owner account cannot be deleted from here." },
          { status: 400 }
        );
      }
      appendAdminLog(id, "Admin started delete (account will be removed).");
      await deleteMemberAccount(id);
      await persistAll();
      return NextResponse.json({
        memberId: id,
        deleted: true,
        members: membersWithPlans(),
        durableStorage: durableConfigured(),
      });
    }

    if (body.action === "sendWelcomeEmail") {
      const id = String(body.id || "");
      const mem = getMemberById(id);
      if (!mem) {
        return NextResponse.json({ error: "Member not found" }, { status: 404 });
      }
      const welcomeEmail = await sendMemberWelcomeEmail(mem);
      appendAdminLog(
        id,
        welcomeEmail.ok
          ? "Welcome email sent."
          : `Welcome email failed${"error" in welcomeEmail && welcomeEmail.error ? `: ${welcomeEmail.error}` : ""}.`
      );
      await persistAll();
      return NextResponse.json({
        memberId: id,
        members: membersWithPlans(),
        durableStorage: durableConfigured(),
        welcomeEmail,
      });
    }

    if (body.action === "updateMember") {
      const id = String(body.id || "");
      const updated = updateMemberDetails(id, {
        name: body.name,
        email: body.email,
        phone: body.phone,
        village: body.village,
        notes: body.notes,
        password: body.password,
      });
      const bits = ["Profile details saved."];
      if (String(body.password || "").trim()) bits.push("Password updated.");
      appendAdminLog(id, bits.join(" "));
      await persistAll();
      return NextResponse.json({
        member: toPublicMember(updated),
        members: membersWithPlans(),
        durableStorage: durableConfigured(),
      });
    }

    if (body.action === "setPassword") {
      const member = setMemberPassword(String(body.id || ""), body.password);
      appendAdminLog(String(body.id || ""), "Password was set by admin.");
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
      appendAdminLog(id, `Plan set to ${publicSpacePayload(getMemberSpace(id)).planLabel}.`);
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
      appendAdminLog(
        id,
        body.goldenLoofah === false ? "Golden Loofah removed." : "Golden Loofah granted."
      );
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
      const becameApproved = mem?.status === "pending";
      if (becameApproved) {
        setMemberStatus(id, "approved");
      }
      approveTopTierMembership(id);
      appendAdminLog(id, "Square Royalty (1 year) approved.");
      await persistAll();
      let welcomeEmail: Awaited<ReturnType<typeof sendMemberWelcomeEmail>> | null =
        null;
      if (becameApproved && mem) {
        welcomeEmail = await sendMemberWelcomeEmail(mem);
      }
      return NextResponse.json({
        memberId: id,
        members: membersWithPlans(),
        durableStorage: durableConfigured(),
        welcomeEmail,
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
      appendAdminLog(id, "Free Square Royalty month granted.");
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
      appendAdminLog(id, "Free month ended.");
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
      appendAdminLog(id, "Square Royalty nomination rejected.");
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
    const before = getMemberById(String(body.id || ""));
    const member = setMemberStatus(body.id, status, body.notes);
    const statusLine =
      status === "approved"
        ? "Membership approved."
        : status === "rejected"
          ? "Membership rejected."
          : status === "suspended"
            ? "Membership suspended."
            : status === "pending"
              ? "Membership set back to pending."
              : `Status set to ${status}.`;
    appendAdminLog(String(body.id || ""), statusLine);
    await persistAll();
    let welcomeEmail: Awaited<ReturnType<typeof sendMemberWelcomeEmail>> | null =
      null;
    if (status === "approved" && before && before.status !== "approved") {
      const full = getMemberById(String(body.id || ""));
      if (full) {
        welcomeEmail = await sendMemberWelcomeEmail(full);
        appendAdminLog(
          String(body.id || ""),
          welcomeEmail.ok
            ? "Welcome email sent."
            : `Welcome email failed${"error" in welcomeEmail && welcomeEmail.error ? `: ${welcomeEmail.error}` : ""}.`
        );
        await persistAll();
      }
    }
    return NextResponse.json({
      member,
      members: membersWithPlans(),
      durableStorage: durableConfigured(),
      welcomeEmail,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Update failed" },
      { status: 400 }
    );
  }
}
