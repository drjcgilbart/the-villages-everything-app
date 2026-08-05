import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { marketSummary, refreshMarket } from "@/lib/realEstate";

export const dynamic = "force-dynamic";

/**
 * Refresh market snapshot.
 * - Public/on-demand: allowed (rate-friendly — just recompute local snapshot)
 * - Cron: Authorization: Bearer CRON_SECRET or x-cron-secret header
 * - Admin: always allowed
 */
export async function POST(req: Request) {
  const cronSecret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization") || "";
  const headerSecret = req.headers.get("x-cron-secret") || "";
  const isCron =
    Boolean(cronSecret) &&
    (auth === `Bearer ${cronSecret}` || headerSecret === cronSecret);
  const isAdmin = await isAdminAuthenticated();

  let source: "manual" | "hourly" = "manual";
  try {
    const body = await req.json().catch(() => ({}));
    if (body?.source === "hourly" || isCron) source = "hourly";
  } catch {
    /* ignore */
  }
  if (isCron) source = "hourly";

  // Optional: if CRON_SECRET is set, require it for non-admin hourly jobs only.
  // Manual public refresh is intentionally allowed so "Refresh now" works for visitors.
  if (source === "hourly" && cronSecret && !isCron && !isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = refreshMarket(source);
  return NextResponse.json({
    ok: true,
    market: data.market,
    summary: marketSummary(),
  });
}

export async function GET(req: Request) {
  // Vercel Cron uses GET by default
  return POST(req);
}
