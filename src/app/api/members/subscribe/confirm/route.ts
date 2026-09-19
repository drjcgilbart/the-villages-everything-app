import { NextRequest, NextResponse } from "next/server";
import { getSessionMember } from "@/lib/memberAuth";
import { fulfillPaidMembershipSession } from "@/lib/memberStripe";
import { updateMemberSpaceAsync } from "@/lib/memberSpace";
import { stripeConfigured } from "@/lib/stripe";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** After Stripe Checkout success, verify session and set membership tier. */
export async function POST(req: NextRequest) {
  const member = await getSessionMember();
  if (!member) {
    return NextResponse.json({ error: "Please sign in" }, { status: 401 });
  }

  if (
    process.env.HUB_MEMBER_DEV_UNLOCK === "true" &&
    !stripeConfigured() &&
    process.env.VERCEL_ENV !== "production"
  ) {
    await updateMemberSpaceAsync(member.id, { plan: "cart_path_regular" });
    return NextResponse.json({
      ok: true,
      plan: "cart_path_regular",
      mode: "dev",
    });
  }

  if (!stripeConfigured()) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const body = (await req.json()) as { sessionId?: string };
  const sessionId = String(body.sessionId || "").trim();
  if (!sessionId) {
    return NextResponse.json({ error: "sessionId required" }, { status: 400 });
  }

  try {
    const result = await fulfillPaidMembershipSession(sessionId, {
      requireMemberId: member.id,
    });
    return NextResponse.json({
      ok: true,
      plan: result.plan,
      planLabel: result.planLabel,
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Could not apply membership";
    const status =
      message.includes("doesn’t match") || message.includes("doesn't match")
        ? 403
        : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
