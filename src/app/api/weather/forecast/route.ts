import { NextRequest, NextResponse } from "next/server";
import { fetchVillagesForecast } from "@/lib/weather";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function numParam(v: string | null, min: number, max: number): number | undefined {
  if (v == null || v === "") return undefined;
  const n = Number(v);
  if (!Number.isFinite(n) || n < min || n > max) return undefined;
  return n;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const lat = numParam(searchParams.get("lat"), -90, 90);
    const lon = numParam(searchParams.get("lon"), -180, 180);
    const tz = String(searchParams.get("tz") || "").trim().slice(0, 80);
    const name = String(searchParams.get("name") || "").trim().slice(0, 80);
    const zip = String(searchParams.get("zip") || "").trim().slice(0, 12);
    const forecast = await fetchVillagesForecast(
      lat != null && lon != null
        ? {
            latitude: lat,
            longitude: lon,
            timezone: tz || "auto",
            locationName: name,
            zip,
          }
        : undefined
    );
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
