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

export type ForecastHour = {
  time: string;
  tempF: number;
  feelsLikeF: number;
  precipProb: number | null;
  weatherCode: number;
  emoji: string;
  condition: string;
  windMph: number;
  uvIndex: number | null;
  isDay: boolean;
};

export type ForecastDay = {
  date: string;
  weatherCode: number;
  emoji: string;
  condition: string;
  highF: number;
  lowF: number;
  precipProb: number | null;
  precipIn: number | null;
  uvMax: number | null;
  sunrise: string | null;
  sunset: string | null;
  windMaxMph: number | null;
};

export type VillagesForecast = VillagesWeather & {
  zip: string;
  pressureInHg: number | null;
  cloudCover: number | null;
  windGustMph: number | null;
  windDirDeg: number | null;
  visibilityMi: number | null;
  sunrise: string | null;
  sunset: string | null;
  hourly: ForecastHour[];
  daily: ForecastDay[];
};

function windDirLabel(deg: number | null | undefined): string {
  if (deg == null || Number.isNaN(deg)) return "—";
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return dirs[Math.round(((deg % 360) + 360) % 360 / 45) % 8];
}

export { windDirLabel };

async function fetchOpenMeteoRaw(forecastDays: number) {
  const params = new URLSearchParams({
    latitude: String(VILLAGES_LAT),
    longitude: String(VILLAGES_LON),
    timezone: VILLAGES_TZ,
    temperature_unit: "fahrenheit",
    wind_speed_unit: "mph",
    precipitation_unit: "inch",
    current: [
      "temperature_2m",
      "relative_humidity_2m",
      "apparent_temperature",
      "is_day",
      "precipitation",
      "weather_code",
      "cloud_cover",
      "pressure_msl",
      "wind_speed_10m",
      "wind_direction_10m",
      "wind_gusts_10m",
      "uv_index",
    ].join(","),
    hourly: [
      "temperature_2m",
      "apparent_temperature",
      "precipitation_probability",
      "weather_code",
      "wind_speed_10m",
      "uv_index",
      "visibility",
      "is_day",
    ].join(","),
    daily: [
      "weather_code",
      "temperature_2m_max",
      "temperature_2m_min",
      "sunrise",
      "sunset",
      "uv_index_max",
      "precipitation_sum",
      "precipitation_probability_max",
      "wind_speed_10m_max",
    ].join(","),
    forecast_days: String(forecastDays),
  });

  const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?${params.toString()}`,
    {
      next: { revalidate: 120 },
      headers: { Accept: "application/json" },
    }
  );
  if (!res.ok) throw new Error(`Weather upstream error (${res.status})`);
  return res.json();
}

export async function fetchVillagesWeather(): Promise<VillagesWeather> {
  const forecast = await fetchVillagesForecast();
  const {
    hourly: _h,
    daily: _d,
    zip: _z,
    pressureInHg: _p,
    cloudCover: _c,
    windGustMph: _g,
    windDirDeg: _wd,
    visibilityMi: _v,
    sunrise: _sr,
    sunset: _ss,
    ...basic
  } = forecast;
  return basic;
}

/** Full dashboard forecast (current + 24h hourly + 7-day) — from the desktop weather-app. */
export async function fetchVillagesForecast(): Promise<VillagesForecast> {
  const data = (await fetchOpenMeteoRaw(7)) as {
    current?: Record<string, number | string | undefined>;
    hourly?: {
      time?: string[];
      temperature_2m?: (number | null)[];
      apparent_temperature?: (number | null)[];
      precipitation_probability?: (number | null)[];
      weather_code?: (number | null)[];
      wind_speed_10m?: (number | null)[];
      uv_index?: (number | null)[];
      visibility?: (number | null)[];
      is_day?: (number | null)[];
    };
    daily?: {
      time?: string[];
      weather_code?: (number | null)[];
      temperature_2m_max?: (number | null)[];
      temperature_2m_min?: (number | null)[];
      sunrise?: string[];
      sunset?: string[];
      uv_index_max?: (number | null)[];
      precipitation_sum?: (number | null)[];
      precipitation_probability_max?: (number | null)[];
      wind_speed_10m_max?: (number | null)[];
    };
  };

  const current = data.current;
  if (
    !current ||
    current.temperature_2m == null ||
    current.weather_code == null
  ) {
    throw new Error("Weather data incomplete");
  }

  const code = Number(current.weather_code);
  const now = Date.now();
  const hourlyTimes = data.hourly?.time || [];
  let startIdx = 0;
  for (let i = 0; i < hourlyTimes.length; i++) {
    if (new Date(hourlyTimes[i]).getTime() >= now - 30 * 60 * 1000) {
      startIdx = i;
      break;
    }
  }

  const hourly: ForecastHour[] = [];
  for (let i = startIdx; i < Math.min(startIdx + 24, hourlyTimes.length); i++) {
    const wc = Number(data.hourly?.weather_code?.[i] ?? 0);
    hourly.push({
      time: hourlyTimes[i],
      tempF: Math.round(Number(data.hourly?.temperature_2m?.[i] ?? 0)),
      feelsLikeF: Math.round(
        Number(
          data.hourly?.apparent_temperature?.[i] ??
            data.hourly?.temperature_2m?.[i] ??
            0
        )
      ),
      precipProb:
        data.hourly?.precipitation_probability?.[i] != null
          ? Math.round(Number(data.hourly.precipitation_probability[i]))
          : null,
      weatherCode: wc,
      emoji: weatherCodeEmoji(wc),
      condition: weatherCodeLabel(wc),
      windMph: Math.round(Number(data.hourly?.wind_speed_10m?.[i] ?? 0)),
      uvIndex:
        data.hourly?.uv_index?.[i] != null
          ? Math.round(Number(data.hourly.uv_index[i]) * 10) / 10
          : null,
      isDay: Number(data.hourly?.is_day?.[i] ?? 1) === 1,
    });
  }

  const daily: ForecastDay[] = [];
  const days = data.daily?.time?.length || 0;
  for (let i = 0; i < days; i++) {
    const wc = Number(data.daily?.weather_code?.[i] ?? 0);
    daily.push({
      date: data.daily!.time![i],
      weatherCode: wc,
      emoji: weatherCodeEmoji(wc),
      condition: weatherCodeLabel(wc),
      highF: Math.round(Number(data.daily?.temperature_2m_max?.[i] ?? 0)),
      lowF: Math.round(Number(data.daily?.temperature_2m_min?.[i] ?? 0)),
      precipProb:
        data.daily?.precipitation_probability_max?.[i] != null
          ? Math.round(Number(data.daily.precipitation_probability_max[i]))
          : null,
      precipIn:
        data.daily?.precipitation_sum?.[i] != null
          ? Math.round(Number(data.daily.precipitation_sum[i]) * 100) / 100
          : null,
      uvMax:
        data.daily?.uv_index_max?.[i] != null
          ? Math.round(Number(data.daily.uv_index_max[i]) * 10) / 10
          : null,
      sunrise: data.daily?.sunrise?.[i] || null,
      sunset: data.daily?.sunset?.[i] || null,
      windMaxMph:
        data.daily?.wind_speed_10m_max?.[i] != null
          ? Math.round(Number(data.daily.wind_speed_10m_max[i]))
          : null,
    });
  }

  const visM = data.hourly?.visibility?.[startIdx];
  const pressureHpa =
    current.pressure_msl != null ? Number(current.pressure_msl) : null;

  return {
    location: "The Villages, FL",
    zip: "34762",
    temperatureF: Math.round(Number(current.temperature_2m)),
    feelsLikeF: Math.round(
      Number(current.apparent_temperature ?? current.temperature_2m)
    ),
    humidity: Math.round(Number(current.relative_humidity_2m ?? 0)),
    windMph: Math.round(Number(current.wind_speed_10m ?? 0)),
    weatherCode: code,
    condition: weatherCodeLabel(code),
    emoji: weatherCodeEmoji(code),
    uvIndex:
      current.uv_index != null
        ? Math.round(Number(current.uv_index) * 10) / 10
        : hourly[0]?.uvIndex ?? null,
    precipIn: Math.round(Number(current.precipitation ?? 0) * 100) / 100,
    highF: daily[0]?.highF ?? null,
    lowF: daily[0]?.lowF ?? null,
    rainChancePct: daily[0]?.precipProb ?? null,
    updatedAt: current.time
      ? new Date(String(current.time)).toISOString()
      : new Date().toISOString(),
    source: "Open-Meteo",
    pressureInHg:
      pressureHpa != null
        ? Math.round((pressureHpa * 0.02953) * 100) / 100
        : null,
    cloudCover:
      current.cloud_cover != null
        ? Math.round(Number(current.cloud_cover))
        : null,
    windGustMph:
      current.wind_gusts_10m != null
        ? Math.round(Number(current.wind_gusts_10m))
        : null,
    windDirDeg:
      current.wind_direction_10m != null
        ? Math.round(Number(current.wind_direction_10m))
        : null,
    visibilityMi:
      visM != null
        ? Math.round((Number(visM) / 1609.34) * 10) / 10
        : null,
    sunrise: daily[0]?.sunrise ?? null,
    sunset: daily[0]?.sunset ?? null,
    hourly,
    daily,
  };
}
