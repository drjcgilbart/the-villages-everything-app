import { NextRequest, NextResponse } from "next/server";
import { ensureDurableHydrated } from "@/lib/dataFs";
import { getSessionMember } from "@/lib/memberAuth";
import { getMemberSpace, updateMemberSpaceAsync } from "@/lib/memberSpace";
import { appleProductIdForPlan, getTier, normalizePlan, type HubPlanId } from "@/lib/membershipTiers";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** Give the iPhone app the App Store product id and a token tied to this login. */
export async function POST(req: NextRequest) {
  await ensureDurableHydrated();
  const member = await getSessionMember();
  if (!member) {
    return NextResponse.json({ error: "Please sign in first" }, { status: 401 });
  }
  if (member.status !== "approved") {
    return NextResponse.json(
      { error: "Your account must be approved before subscribing" },
      { status: 403 }
    );
  }
  const space = getMemberSpace(member.id);
  if (space.householdOwnerId) {
    return NextResponse.json(
      { error: "You’re on a household plan. Leave it in My Space → Plans if you want to buy your own membership." },
      { status: 400 }
    );
  }

  let requested: HubPlanId = "cart_path_regular";
  try {
    const body = (await req.json().catch(() => ({}))) as { tier?: string };
    if (body.tier) requested = normalizePlan(body.tier);
  } catch {
    /* empty */
  }
  if (requested === "porch_waver") requested = "cart_path_regular";
  const productId = appleProductIdForPlan(requested);
  if (!productId) {
    return NextResponse.json({ error: "That plan is not sold in the app" }, { status: 400 });
  }

  const appAccountToken = space.appleAppAccountToken || crypto.randomUUID();
  if (!space.appleAppAccountToken) {
    await updateMemberSpaceAsync(member.id, { appleAppAccountToken: appAccountToken });
  }
  const tier = getTier(requested);
  return NextResponse.json({
    productId,
    appAccountToken,
    plan: requested,
    planLabel: tier.label,
  });
}
