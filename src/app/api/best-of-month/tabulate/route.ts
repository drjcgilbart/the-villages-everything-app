import { NextResponse } from "next/server";
import { tabulatePreviousMonthIfNeededAsync } from "@/lib/bestOfMonth";
import { isAdminAuthenticated } from "@/lib/auth";
import { isCronAuthorized, isProductionHost } from "@/lib/security";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Cron (1st of each month): tabulate previous month winners + honorable mentions.
 * Page loads also call ensurePastMonthsTabulated as a safety net.
 * Must use async durable load — sync seed write was wiping live pendings.
 */
export async function GET(req: Request) {
  const cronOk = isCronAuthorized(req);
  const admin = await isAdminAuthenticated();
  if (isProductionHost() && !cronOk && !admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!cronOk && !admin && process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
