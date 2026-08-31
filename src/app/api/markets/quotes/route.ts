import { NextRequest, NextResponse } from "next/server";
import {
  fetchTickerQuotes,
  isValidTickerShape,
  normalizeTicker,
} from "@/lib/markets";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const MAX_SYMBOLS = 40;

export async function GET(req: NextRequest) {
  try {
    const raw = req.nextUrl.searchParams.get("symbols") || "";
    const symbols = raw
      .split(",")
      .map(normalizeTicker)
      .filter((s) => s && isValidTickerShape(s));

    const unique = [...new Set(symbols)].slice(0, MAX_SYMBOLS);
    if (unique.length === 0) {
      return NextResponse.json(
        { error: "Provide symbols query, e.g. ?symbols=AAPL,VOO" },
        { status: 400 }
      );
    }

    const { quotes, missing } = await fetchTickerQuotes(unique);
    return NextResponse.json(
      {
        quotes,
        missing,
        fetchedAt: new Date().toISOString(),
        disclaimer:
          "Quotes are for orientation only, may be delayed, and are not investment advice.",
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=15, stale-while-revalidate=30",
        },
      }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Quotes unavailable";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
