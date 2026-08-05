/** The Villages, FL approximate center (Spanish Springs / central area). */
export const VILLAGES_LAT = 28.9341;
export const VILLAGES_LON = -81.9598;
export const VILLAGES_TZ = "America/New_York";

/** WMO weather interpretation codes (Open-Meteo / WMO). */
export function weatherCodeLabel(code: number): string {
  if (code === 0) return "Clear";
  if (code === 1) return "Mostly clear";
  if (code === 2) return "Partly cloudy";
  if (code === 3) return "Overcast";
  if (code === 45 || code === 48) return "Foggy";
  if (code >= 51 && code <= 55) return "Drizzle";
  if (code >= 56 && code <= 57) return "Freezing drizzle";
  if (code >= 61 && code <= 65) return "Rain";
  if (code >= 66 && code <= 67) return "Freezing rain";
  if (code >= 71 && code <= 77) return "Snow";
  if (code >= 80 && code <= 82) return "Showers";
  if (code >= 85 && code <= 86) return "Snow showers";
  if (code === 95) return "Thunderstorm";
  if (code === 96 || code === 99) return "Storm + hail";
  return "Mixed";
}

/** Simple emoji icon for concise UI (no image assets required). */
export function weatherCodeEmoji(code: number): string {
  if (code === 0 || code === 1) return "☀️";
  if (code === 2) return "⛅";
  if (code === 3) return "☁️";
  if (code === 45 || code === 48) return "🌫️";
  if (code >= 51 && code <= 67) return "🌧️";
  if (code >= 71 && code <= 77) return "❄️";
  if (code >= 80 && code <= 82) return "🌦️";
  if (code >= 85 && code <= 86) return "🌨️";
  if (code >= 95) return "⛈️";
  return "🌤️";
}

export type VillagesWeather = {
  location: string;
  temperatureF: number;
  feelsLikeF: number;
  humidity: number;
  windMph: number;
  weatherCode: number;
  condition: string;
  emoji: string;
  uvIndex: number | null;
  precipIn: number;
  highF: number | null;
  lowF: number | null;
  rainChancePct: number | null;
  updatedAt: string;
  source: string;
};

export async function fetchVillagesWeather(): Promise<VillagesWeather> {
  const params = new URLSearchParams({
    latitude: String(VILLAGES_LAT),
    longitude: String(VILLAGES_LON),
    current: [
      "temperature_2m",
      "relative_humidity_2m",
      "apparent_temperature",
      "precipitation",
      "weather_code",
      "wind_speed_10m",
      "uv_index",
    ].join(","),
    daily: [
      "temperature_2m_max",
      "temperature_2m_min",
      "precipitation_probability_max",
    ].join(","),
    temperature_unit: "fahrenheit",
    wind_speed_unit: "mph",
    precipitation_unit: "inch",
    timezone: VILLAGES_TZ,
    forecast_days: "1",
  });

  const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?${params.toString()}`,
    {
      // Server: revalidate often; client will also poll
      next: { revalidate: 120 },
      headers: { Accept: "application/json" },
    }
  );

  if (!res.ok) {
    throw new Error(`Weather upstream error (${res.status})`);
  }

  const data = (await res.json()) as {
    current?: {
      temperature_2m?: number;
      relative_humidity_2m?: number;
      apparent_temperature?: number;
      precipitation?: number;
      weather_code?: number;
      wind_speed_10m?: number;
      uv_index?: number;
      time?: string;
    };
    daily?: {
      temperature_2m_max?: number[];
      temperature_2m_min?: number[];
      precipitation_probability_max?: number[];
    };
  };

  const current = data.current;
  if (!current || current.temperature_2m == null || current.weather_code == null) {
    throw new Error("Weather data incomplete");
  }

  const code = current.weather_code;

  return {
    location: "The Villages, FL",
    temperatureF: Math.round(current.temperature_2m),
    feelsLikeF: Math.round(current.apparent_temperature ?? current.temperature_2m),
    humidity: Math.round(current.relative_humidity_2m ?? 0),
    windMph: Math.round(current.wind_speed_10m ?? 0),
    weatherCode: code,
    condition: weatherCodeLabel(code),
    emoji: weatherCodeEmoji(code),
    uvIndex:
      current.uv_index != null ? Math.round(current.uv_index * 10) / 10 : null,
    precipIn: Math.round((current.precipitation ?? 0) * 100) / 100,
    highF:
      data.daily?.temperature_2m_max?.[0] != null
        ? Math.round(data.daily.temperature_2m_max[0])
        : null,
    lowF:
      data.daily?.temperature_2m_min?.[0] != null
        ? Math.round(data.daily.temperature_2m_min[0])
        : null,
    rainChancePct:
      data.daily?.precipitation_probability_max?.[0] != null
        ? Math.round(data.daily.precipitation_probability_max[0])
        : null,
    updatedAt: current.time
      ? new Date(current.time).toISOString()
      : new Date().toISOString(),
    source: "Open-Meteo",
  };
}
