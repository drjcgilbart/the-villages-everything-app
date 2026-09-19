import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { isCronAuthorized } from "@/lib/security";
import { sweepRoyaltyTrials } from "@/lib/memberTrialLifecycle";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * Vercel Cron (daily) + admin: 7-day trial reminder emails and
 * automatic roll-back to Porch Waver when the free month ends.
 */
export async function POST(req: Request) {
  const cron = isCronAuthorized(req);
  const admin = await isAdminAuthenticated();
  if (!cron && !admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await sweepRoyaltyTrials({ sendMail: true });
    return NextResponse.json({
      ok: true,
      mode: cron ? "cron" : "admin",
      ...result,
    });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        error: err instanceof Error ? err.message : "Trial sweep failed",
      },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  return POST(req);
}
