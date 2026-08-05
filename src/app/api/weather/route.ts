import { NextResponse } from "next/server";
import { fetchVillagesWeather } from "@/lib/weather";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const weather = await fetchVillagesWeather();
    return NextResponse.json(weather, {
      headers: {
        // Clients may cache briefly; widget also polls
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Weather unavailable";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
