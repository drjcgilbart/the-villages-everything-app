import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import {
  ensureCalendarFresh,
  loadCalendarStore,
  refreshCalendarEvents,
} from "@/lib/calendarFetch";

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
 * Refresh local events from public entertainment calendars.
 * Vercel Cron GET daily · Admin can force · Soft stale-check for others
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

  if (!isCron && !isAdmin) {
    const store = await ensureCalendarFresh(20);
    return NextResponse.json({
      ok: true,
      mode: "stale-check",
      updatedAt: store.updatedAt,
      eventCount: store.eventCount,
      lastError: store.lastError,
    });
  }

  try {
    const store =
      force || isCron || isAdmin
        ? await refreshCalendarEvents({
            source: isCron ? "cron" : "manual",
          })
        : await ensureCalendarFresh(20);

    return NextResponse.json({
      ok: true,
      mode: isCron ? "cron" : isAdmin ? "admin" : "stale-check",
      updatedAt: store.updatedAt,
      eventCount: store.eventCount,
      lastError: store.lastError,
    });
  } catch (err) {
    const prev = loadCalendarStore();
    return NextResponse.json(
      {
        ok: false,
        error: err instanceof Error ? err.message : "Refresh failed",
        updatedAt: prev.updatedAt,
        eventCount: prev.eventCount,
      },
      { status: 502 }
    );
  }
}

export async function GET(req: Request) {
  return POST(req);
}
