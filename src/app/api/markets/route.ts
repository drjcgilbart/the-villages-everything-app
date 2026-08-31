import { NextRequest, NextResponse } from "next/server";
import { fetchAllMarketIndices } from "@/lib/markets";
import { MARKET_RANGES } from "@/lib/financeCatalog";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const raw = req.nextUrl.searchParams.get("range") || "1d";
    const spec = MARKET_RANGES.find((r) => r.id === raw) || MARKET_RANGES[0];
    const quotes = await fetchAllMarketIndices(spec.yahooRange, spec.interval);
    if (quotes.length === 0) {
      return NextResponse.json(
        { error: "Market data temporarily unavailable" },
        { status: 502 }
      );
    }
    return NextResponse.json(
      {
        quotes,
        range: spec.id,
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
    const message = err instanceof Error ? err.message : "Markets unavailable";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
