import { NextResponse } from "next/server";
import { fetchVillagesForecast } from "@/lib/weather";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const forecast = await fetchVillagesForecast();
    return NextResponse.json(forecast, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Weather unavailable";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
