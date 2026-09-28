import { NextResponse } from "next/server";

export const revalidate = 1800;

/** Forecast for the middle of The Villages, not a reading at the ramp. */
export async function GET() {
  const empty = { temp: null, wind: null, gust: null, code: null, rainChance: null };
  try {
    const url =
      "https://api.open-meteo.com/v1/forecast?latitude=28.93&longitude=-81.96&current=temperature_2m,weather_code,wind_speed_10m,wind_gusts_10m&daily=precipitation_probability_max,wind_gusts_10m_max&timezone=America%2FNew_York&forecast_days=1&wind_speed_unit=mph&temperature_unit=fahrenheit";
    const res = await fetch(url, { next: { revalidate: 1800 } });
    if (!res.ok) throw new Error("wind");
    const data = (await res.json()) as {
      current?: {
        temperature_2m?: number;
        weather_code?: number;
        wind_speed_10m?: number;
        wind_gusts_10m?: number;
      };
      daily?: { precipitation_probability_max?: number[]; wind_gusts_10m_max?: number[] };
    };
    const wind = data.current?.wind_speed_10m == null ? null : Math.round(data.current.wind_speed_10m);
    const gustRaw = data.current?.wind_gusts_10m ?? data.daily?.wind_gusts_10m_max?.[0];
    const gust = gustRaw == null ? null : Math.round(gustRaw);
    const temp = data.current?.temperature_2m == null ? null : Math.round(data.current.temperature_2m);
    const code = data.current?.weather_code ?? null;
    const rainChance = data.daily?.precipitation_probability_max?.[0] ?? null;
    return NextResponse.json({ temp, wind, gust, code, rainChance });
  } catch {
    return NextResponse.json(empty);
  }
}
