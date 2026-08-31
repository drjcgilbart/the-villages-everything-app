import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type GeoHit = {
  name?: string;
  admin1?: string;
  country?: string;
  country_code?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  postcodes?: string[];
};

function labelFor(hit: GeoHit): string {
  if (hit.country_code === "US" && hit.admin1 && hit.name) {
    return `${hit.name}, ${hit.admin1}`;
  }
  if (hit.country && hit.name && hit.country !== hit.name) {
    return `${hit.name}, ${hit.country}`;
  }
  return hit.name || "Saved location";
}

export async function GET(req: NextRequest) {
  const q = String(req.nextUrl.searchParams.get("q") || "").trim();
  if (q.length < 2) {
    return NextResponse.json({ results: [] });
  }
  try {
    const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
    url.searchParams.set("name", q);
    url.searchParams.set("count", "8");
    url.searchParams.set("language", "en");
    url.searchParams.set("format", "json");
    const res = await fetch(url.toString(), {
      headers: { Accept: "application/json" },
      next: { revalidate: 300 },
    });
    if (!res.ok) {
      return NextResponse.json({ error: "Location search failed" }, { status: 502 });
    }
    const data = (await res.json()) as { results?: GeoHit[] };
    const zip = /^\d{5}(-\d{4})?$/.test(q) ? q.slice(0, 5) : "";
    const results = (data.results || [])
      .filter((hit) => Number.isFinite(hit.latitude) && Number.isFinite(hit.longitude))
      .map((hit) => ({
        name: String(hit.name || "").slice(0, 80),
        admin1: String(hit.admin1 || "").slice(0, 80),
        country: String(hit.country || "").slice(0, 80),
        countryCode: String(hit.country_code || "").slice(0, 8),
        latitude: Number(hit.latitude),
        longitude: Number(hit.longitude),
        timezone: String(hit.timezone || "auto").slice(0, 80),
        zip: zip || (Array.isArray(hit.postcodes) ? String(hit.postcodes[0] || "").slice(0, 12) : ""),
        label: labelFor(hit).slice(0, 80),
        query: q.slice(0, 80),
      }));
    return NextResponse.json({ results });
  } catch {
    return NextResponse.json({ error: "Location search failed" }, { status: 502 });
  }
}
