import { NextResponse } from "next/server";
import {
  ensureCalendarFresh,
  eventsForMonth,
  floridaMonthNow,
  loadCalendarStoreAsync,
} from "@/lib/calendarFetch";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const now = floridaMonthNow();
    const year = Number(searchParams.get("year")) || now.year;
    const month = Number(searchParams.get("month")) || now.month;

    // Soft-refresh if stale (cron is primary; this helps first visitors)
    let store = await loadCalendarStoreAsync();
    if (!store.events.length || !store.updatedAt) {
      store = await ensureCalendarFresh(20);
    } else {
      const age = Date.now() - new Date(store.updatedAt).getTime();
      if (age > 20 * 3600 * 1000) {
        // Don't block response forever — kick soft refresh best-effort
        store = await ensureCalendarFresh(20);
      }
    }

    const monthEvents = eventsForMonth(store, year, month);
    const todayKey = now.todayKey;
    const upcoming = monthEvents.filter((e) => e.date >= todayKey);
    const past = monthEvents.filter((e) => e.date < todayKey);

    // Counts per day for calendar dots
    const byDate: Record<string, number> = {};
    for (const e of monthEvents) {
      byDate[e.date] = (byDate[e.date] || 0) + 1;
    }

    return NextResponse.json({
      year,
      month,
      todayKey,
      events: monthEvents,
      upcoming,
      past,
      byDate,
      updatedAt: store.updatedAt,
      lastError: store.lastError,
      sources: store.sources,
      eventCount: store.eventCount,
    });
  } catch (err) {
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Could not load calendar",
      },
      { status: 500 }
    );
  }
}
