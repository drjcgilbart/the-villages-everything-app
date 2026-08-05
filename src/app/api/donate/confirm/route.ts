import { NextRequest, NextResponse } from "next/server";
import { awardsGoldenLoofah, parseDonationAmount } from "@/lib/donations";
import { getSessionMember } from "@/lib/memberAuth";
import { grantGoldenLoofah, getMemberSpace } from "@/lib/memberSpace";
import { getStripe, stripeConfigured } from "@/lib/stripe";

export const dynamic = "force-dynamic";

/**
 * After Stripe donation checkout, verify payment and award Golden Loofah
 * when amount qualifies (highest cup-of-Joe tier).
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

  const wantsLoofah =
    session.metadata?.awards_golden_loofah === "1" ||
    (amountUsd != null && awardsGoldenLoofah(amountUsd));

  if (!wantsLoofah) {
    return NextResponse.json({
      ok: true,
      goldenLoofah: false,
      amountUsd,
      message: "Thanks for the tip!",
    });
  }

  const member = await getSessionMember();
  const metaMemberId = String(session.metadata?.memberId || "").trim();
  const memberId = member?.id || metaMemberId || null;

  if (!memberId) {
    return NextResponse.json({
      ok: true,
      goldenLoofah: false,
      pendingClaim: true,
      amountUsd,
      message:
        "Payment received. Sign in with the same Hub account and reopen this thank-you page to claim your Golden Loofah.",
    });
  }

  // If signed in as a different member than checkout, prefer session member
  // only when metadata matches or metadata empty
  if (member && metaMemberId && member.id !== metaMemberId) {
    return NextResponse.json(
      {
        error:
          "Signed-in account doesn’t match the donation. Sign in with the account you used at checkout.",
      },
      { status: 403 }
    );
  }

  const alreadyHad = !!getMemberSpace(memberId).goldenLoofah;
  const space = grantGoldenLoofah(memberId);
  return NextResponse.json({
    ok: true,
    goldenLoofah: true,
    amountUsd,
    memberId,
    goldenLoofahAt: space.goldenLoofahAt,
    alreadyHad,
    message: alreadyHad
      ? "You already hold the Golden Loofah. Shine on."
      : "Golden Loofah unlocked! It now appears next to your name across the Hub.",
  });
}
