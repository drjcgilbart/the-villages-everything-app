import { NextRequest, NextResponse } from "next/server";
import {
  donationBadgeById,
  donationTierForAmount,
  parseDonationAmount,
} from "@/lib/donations";
import { getSessionMember } from "@/lib/memberAuth";
import { getMemberSpace, grantDonationBadge } from "@/lib/memberSpace";
import { getStripe, stripeConfigured } from "@/lib/stripe";

export const dynamic = "force-dynamic";

/**
 * After Stripe donation checkout, verify payment and award the matching
 * cup-of-Joe tier badge (Cup of Joe / Latte / Brunch / Golden Loofah).
 */
export async function POST(req: NextRequest) {
  if (!stripeConfigured()) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const body = (await req.json()) as { sessionId?: string };
  const sessionId = String(body.sessionId || "").trim();
  if (!sessionId) {
    return NextResponse.json({ error: "sessionId required" }, { status: 400 });
  }

  const stripe = getStripe()!;
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.metadata?.purpose !== "site-donation") {
    return NextResponse.json({ error: "Not a donation session" }, { status: 400 });
  }

  if (session.payment_status !== "paid" && session.status !== "complete") {
    return NextResponse.json({ error: "Payment not complete" }, { status: 400 });
  }

  const amountUsd =
    parseDonationAmount(session.metadata?.amount_usd) ??
    (typeof session.amount_total === "number"
      ? session.amount_total / 100
      : null);

  const metaBadge = String(session.metadata?.badge_id || "").trim();
  const fromAmount =
    amountUsd != null ? donationTierForAmount(amountUsd)?.badgeId : null;
  const badgeId = metaBadge || fromAmount || null;

  if (!badgeId) {
    return NextResponse.json({
      ok: true,
      badgeId: null,
      amountUsd,
      message: "Thanks for the tip!",
    });
  }

  const badge = donationBadgeById(badgeId);
  const member = await getSessionMember();
  const metaMemberId = String(session.metadata?.memberId || "").trim();
  const memberId = member?.id || metaMemberId || null;

  if (!memberId) {
    return NextResponse.json({
      ok: true,
      badgeId,
      badgeLabel: badge?.label || null,
      pendingClaim: true,
      amountUsd,
      message: `Payment received. Sign in with your Hub account and reopen this page to claim your ${badge?.label || "donation"} badge.`,
    });
  }

  if (member && metaMemberId && member.id !== metaMemberId) {
    return NextResponse.json(
      {
        error:
          "Signed-in account doesn’t match the donation. Sign in with the account you used at checkout.",
      },
      { status: 403 }
    );
  }

  const before = getMemberSpace(memberId);
  const alreadyHad = (before.donationBadges || []).includes(badgeId);
  const space = grantDonationBadge(memberId, badgeId);

  return NextResponse.json({
    ok: true,
    badgeId,
    badgeLabel: badge?.label || null,
    badgeImage: badge?.image || null,
    amountUsd,
    memberId,
    donationBadges: space.donationBadges || [],
    alreadyHad,
    message: alreadyHad
      ? `You already hold the ${badge?.label || "badge"}. Shine on.`
      : `${badge?.label || "Badge"} unlocked! It now appears next to your name across the Hub.`,
  });
}
