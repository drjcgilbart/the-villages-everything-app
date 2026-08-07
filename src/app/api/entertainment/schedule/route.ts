import { NextResponse } from "next/server";
import {
  ensureEntertainmentFresh,
  getEntertainmentUpdatedAt,
  loadActiveLineup,
  loadEntertainmentStore,
} from "@/lib/entertainmentFetch";
import {
  floridaDateKey,
  getAllSquaresTonight,
  getSquareDaySchedule,
  type SquareId,
} from "@/lib/squareEntertainment";

export const dynamic = "force-dynamic";

/**
 * Public schedule feed for Town Squares UI.
 * Soft-refreshes from official site when data is older than ~20 hours.
 */
export async function GET(req: Request) {
  await ensureEntertainmentFresh(20);

  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date") || floridaDateKey();
  const square = searchParams.get("square") as SquareId | null;

  const store = loadEntertainmentStore();
  const lineup = loadActiveLineup();
  const tonight = square
    ? [getSquareDaySchedule(square, date, lineup)]
    : getAllSquaresTonight(date, lineup);

  return NextResponse.json({
    date,
    updatedAt: getEntertainmentUpdatedAt() || store?.updatedAt || null,
    eventCount: store?.eventCount || 0,
    nightCount: store?.nights?.length || 0,
    lastError: store?.lastError || null,
    squares: tonight,
    sourceUrls: store?.sourceUrls || [
      "https://www.thevillagesentertainment.com/nightly-entertainment/",
    ],
  });
}
