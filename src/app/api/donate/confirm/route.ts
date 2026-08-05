import { NextRequest, NextResponse } from "next/server";
import {
  donationBadgeById,
  donationBadgeForCheckout,
  isTopTierDonationBadge,
  parseDonationAmount,
} from "@/lib/donations";
import { getSessionMember } from "@/lib/memberAuth";
import { getMemberSpace, grantDonationBadge } from "@/lib/memberSpace";
import { getStripe, stripeConfigured } from "@/lib/stripe";

export const dynamic = "force-dynamic";

/**
 * After Stripe donation checkout, award the matching tip badge and, for
 * Golden Loofah / Custom Star Loofah, queue Square Royalty (1yr) for admin.
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

  const isCustom = session.metadata?.is_custom === "1";
  const metaBadge = String(session.metadata?.badge_id || "").trim();
  const fromCheckout =
    amountUsd != null
      ? donationBadgeForCheckout({ amountUsd, isCustom })
      : null;
  const badgeId = metaBadge || fromCheckout?.badgeId || null;

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
      badgeImage: badge?.image || null,
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
  const topTier = isTopTierDonationBadge(badgeId);

  let message = alreadyHad
    ? `You already hold the ${badge?.label || "badge"}. Shine on.`
    : `${badge?.label || "Badge"} unlocked! It now appears next to your name across the Hub.`;

  if (topTier) {
    message +=
      space.topTierNomination?.status === "pending"
        ? " You’ve also been submitted to the Admin Portal for Square Royalty membership (1 year) — pending host approval."
        : space.topTierNomination?.status === "approved"
          ? " Your Square Royalty membership is already approved."
          : "";
  }

  return NextResponse.json({
    ok: true,
    badgeId,
    badgeLabel: badge?.label || null,
    badgeImage: badge?.image || null,
    amountUsd,
    memberId,
    donationBadges: space.donationBadges || [],
    alreadyHad,
    topTierNomination: space.topTierNomination || null,
    message,
  });
}
