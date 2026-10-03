import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { isCronAuthorized } from "@/lib/security";
import { sweepMarketplaceListings } from "@/lib/yardSaleLifecycle";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * Vercel Cron (daily) + admin: email Marketplace members after 7 days,
 * and remove a listing 14 days after it was posted or last refreshed.
 */
export async function POST(req: Request) {
  const cron = isCronAuthorized(req);
  const admin = await isAdminAuthenticated();
  if (!cron && !admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await sweepMarketplaceListings({ sendMail: true });
    return NextResponse.json({
      ok: true,
      mode: cron ? "cron" : "admin",
      ...result,
    });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        error: err instanceof Error ? err.message : "Marketplace sweep failed",
      },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  return POST(req);
}
