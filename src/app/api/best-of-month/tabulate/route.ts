import { NextResponse } from "next/server";
import { tabulatePreviousMonthIfNeeded } from "@/lib/bestOfMonth";

export const dynamic = "force-dynamic";

/**
 * Cron (1st of each month): tabulate previous month winners + honorable mentions.
 * Page loads also call ensurePastMonthsTabulated as a safety net.
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

  const data = tabulatePreviousMonthIfNeeded();
  return NextResponse.json({
    ok: true,
    resultsCount: data.results.length,
    latest: data.results[0] || null,
  });
}

export async function POST(req: Request) {
  return GET(req);
}
