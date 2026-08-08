import { NextResponse } from "next/server";
import { tabulatePreviousMonthIfNeededAsync } from "@/lib/bestOfMonth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Cron (1st of each month): tabulate previous month winners + honorable mentions.
 * Page loads also call ensurePastMonthsTabulated as a safety net.
 * Must use async durable load — sync seed write was wiping live pendings.
 */
export async function GET(req: Request) {
  const cronSecret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization") || "";
  const vercelCron = req.headers.get("x-vercel-cron") === "1";
  const headerSecret = req.headers.get("x-cron-secret") || "";

  if (cronSecret) {
    const ok =
      vercelCron ||
      auth === `Bearer ${cronSecret}` ||
      headerSecret === cronSecret;
    if (!ok) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const data = await tabulatePreviousMonthIfNeededAsync();
  return NextResponse.json({
    ok: true,
    resultsCount: data.results.length,
    latest: data.results[0] || null,
  });
}

export async function POST(req: Request) {
  return GET(req);
}
