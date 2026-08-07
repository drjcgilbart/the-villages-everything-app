import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import {
  ensureEntertainmentFresh,
  loadEntertainmentStore,
  refreshEntertainmentSchedule,
} from "@/lib/entertainmentFetch";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function isCronRequest(req: Request): boolean {
  const cronSecret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization") || "";
  const headerSecret = req.headers.get("x-cron-secret") || "";
  const vercelCron = req.headers.get("x-vercel-cron") === "1";
  if (vercelCron) return true;
  if (!cronSecret) return false;
  return auth === `Bearer ${cronSecret}` || headerSecret === cronSecret;
}

/**
 * Refresh town-square entertainment schedule from official site.
 * - Vercel Cron GET daily
 * - Admin can force refresh
 * - Optional CRON_SECRET for protected cron
 */
export async function POST(req: Request) {
  const isCron = isCronRequest(req);
  const isAdmin = await isAdminAuthenticated();

  let force = false;
  try {
    const body = await req.json().catch(() => ({}));
    force = Boolean(body?.force);
  } catch {
    /* ignore */
  }

  // Public may only soft-refresh when stale (helps local/dev without cron)
  if (!isCron && !isAdmin) {
    const store = await ensureEntertainmentFresh(20);
    return NextResponse.json({
      ok: true,
      mode: "stale-check",
      updatedAt: store?.updatedAt || null,
      eventCount: store?.eventCount || 0,
      nights: store?.nights?.length || 0,
      lastError: store?.lastError || null,
    });
  }

  try {
    const store = force || isCron || isAdmin
      ? await refreshEntertainmentSchedule({
          source: isCron ? "cron" : "manual",
        })
      : await ensureEntertainmentFresh(20);

    return NextResponse.json({
      ok: true,
      mode: isCron ? "cron" : isAdmin ? "admin" : "stale-check",
      updatedAt: store?.updatedAt || null,
      eventCount: store?.eventCount || 0,
      nights: store?.nights?.length || 0,
      lastError: store?.lastError || null,
    });
  } catch (err) {
    const prev = loadEntertainmentStore();
    return NextResponse.json(
      {
        ok: false,
        error: err instanceof Error ? err.message : "Refresh failed",
        updatedAt: prev?.updatedAt || null,
        nights: prev?.nights?.length || 0,
      },
      { status: 502 }
    );
  }
}

export async function GET(req: Request) {
  // Vercel Cron uses GET
  return POST(req);
}
