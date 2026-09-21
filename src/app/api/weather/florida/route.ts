import { NextRequest, NextResponse } from "next/server";
import { VILLAGES_LAT, VILLAGES_LON } from "@/lib/weather";
import { fetchFloridaWeatherExtra } from "@/lib/weatherFlorida";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const lat = Number(req.nextUrl.searchParams.get("lat"));
    const lon = Number(req.nextUrl.searchParams.get("lon"));
    const extra = await fetchFloridaWeatherExtra(
      Number.isFinite(lat) ? lat : VILLAGES_LAT,
      Number.isFinite(lon) ? lon : VILLAGES_LON
    );
    return NextResponse.json(extra, {
      headers: {
        "Cache-Control": "public, s-maxage=120, stale-while-revalidate=300",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Alerts unavailable";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
