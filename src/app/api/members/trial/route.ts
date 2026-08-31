import { NextResponse } from "next/server";
import { rateLimitResponse } from "@/lib/authRateLimit";
import { getSessionMember } from "@/lib/memberAuth";
import {
  loadMemberSpaces,
  publicSpacePayload,
  saveMemberSpacesAsync,
  startRoyaltyTrial,
} from "@/lib/memberSpace";
import { getTier } from "@/lib/membershipTiers";
import { toPublicMember } from "@/lib/yardSale";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Start the one-time Square Royalty free month.
 * Standing plan is unchanged — after expiry they keep whatever they purchased,
 * or Porch Waver if they didn't buy.
 */
export async function POST(req: Request) {
  const limited = rateLimitResponse(req, "royalty-trial", 8, 15 * 60 * 1000);
  if (limited) return limited;

  const member = await getSessionMember();
  if (!member) {
    return NextResponse.json({ error: "Please sign in first" }, { status: 401 });
  }
  if (member.status !== "approved") {
    return NextResponse.json(
      {
        error:
          "Your neighbor account must be approved before the free month can start.",
      },
      { status: 403 }
    );
  }

  try {
    const rec = startRoyaltyTrial(member.id, "request");
    await saveMemberSpacesAsync(loadMemberSpaces());
    const space = publicSpacePayload(rec);
    const royalty = getTier("square_royalty");
    return NextResponse.json({
      ok: true,
      plan: space.plan,
      planLabel: royalty.label,
      trialExpiresAt: space.trialExpiresAt,
      standingPlan: space.standingPlan,
      standingPlanLabel: space.standingPlanLabel,
      member: toPublicMember(member),
      space,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not start the free month" },
      { status: 400 }
    );
  }
}
