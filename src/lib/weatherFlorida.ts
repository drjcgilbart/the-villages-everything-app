import { VILLAGES_LAT, VILLAGES_LON } from "@/lib/weather";

const NWS_UA = "(TheVillagesEverythingApp, https://www.thevillageseverythingapp.com)";

export type WxAlertKind =
  | "hurricane"
  | "storm"
  | "heat"
  | "flood"
  | "freeze"
  | "other";

export type WxAlert = {
  id: string;
  event: string;
  headline: string;
  severity: string;
  urgency: string;
  onset: string | null;
  ends: string | null;
  instruction: string;
  area: string;
  kind: WxAlertKind;
};

export type HurricaneStorm = {
  id: string;
  name: string;
  classification: string;
  classificationLabel: string;
  windMph: number | null;
  pressureMb: number | null;
  latitude: number | null;
  longitude: number | null;
  milesFromVillages: number | null;
  movement: string;
  advisoryUrl: string;
  graphicsUrl: string;
  discussionUrl: string;
};

export type AirQuality = {
  usAqi: number | null;
  pm25: number | null;
  label: string;
  tip: string;
};

export type FloridaWeatherExtra = {
  alerts: WxAlert[];
  storms: HurricaneStorm[];
  air: AirQuality;
  sources: string[];
};

function classifyEvent(event: string): WxAlertKind {
  const e = event.toLowerCase();
  if (/hurricane|tropical|typhoon|storm surge/.test(e)) return "hurricane";
  if (/thunder|tornado|severe|lightning|special weather/.test(e)) return "storm";
  if (/heat/.test(e)) return "heat";
  if (/flood/.test(e)) return "flood";
  if (/freeze|frost|cold|winter|ice/.test(e)) return "freeze";
  return "other";
}

function clip(s: unknown, n: number) {
  return String(s || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, n);
}

function haversineMi(lat1: number, lon1: number, lat2: number, lon2: number) {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const R = 3958.8;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.min(1, Math.sqrt(a))));
}

function parseNhcCoord(raw: string, kind: "lat" | "lon"): number | null {
  const m = String(raw || "")
    .trim()
    .match(/^([\d.]+)\s*([NSEW])$/i);
  if (!m) return null;
  let n = Number(m[1]);
  const dir = m[2].toUpperCase();
  if (kind === "lat" && dir === "S") n = -n;
  if (kind === "lon" && (dir === "W" || dir === "S")) n = -n;
  if (kind === "lon" && dir === "E") n = n;
  if (!Number.isFinite(n)) return null;
  return n;
}

function nhcPage(raw: unknown): string {
  const s = clip(raw, 200);
  if (!s.startsWith("https://www.nhc.noaa.gov/")) return "";
  return s;
}

function nhcNestedUrl(obj: unknown): string {
  if (!obj || typeof obj !== "object") return "";
  return nhcPage((obj as { url?: unknown }).url);
}

function stormClassLabel(code: string) {
  const c = code.toUpperCase();
  if (c === "HU" || c === "MH") return "Hurricane";
  if (c === "TS") return "Tropical storm";
  if (c === "TD") return "Tropical depression";
  if (c === "PTC") return "Potential tropical cyclone";
  if (c === "STD" || c === "SS") return "Subtropical";
  if (c === "LO" || c === "DB") return "Disturbance";
  if (c === "EX") return "Post-tropical";
  return code || "Storm";
}

function aqiBand(n: number | null): Pick<AirQuality, "label" | "tip"> {
  if (n == null)
    return { label: "—", tip: "Air quality not in yet." };
  if (n <= 50)
    return { label: "Good", tip: "Fine for a long cart loop." };
  if (n <= 100)
    return { label: "Moderate", tip: "Sensitive neighbors may want a shorter outing." };
  if (n <= 150)
    return {
      label: "Unhealthy for sensitive groups",
      tip: "Ease up if you have asthma or heart notes.",
    };
  if (n <= 200)
    return { label: "Unhealthy", tip: "Keep outdoor time short." };
  return { label: "Very unhealthy", tip: "Stay indoors if you can." };
}

async function fetchJson(url: string, headers: Record<string, string>, ms = 8000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    const res = await fetch(url, { headers, signal: ctrl.signal, cache: "no-store" });
    if (!res.ok) throw new Error(String(res.status));
    return res.json();
  } finally {
    clearTimeout(t);
  }
}

export async function fetchNwsAlerts(lat: number, lon: number): Promise<WxAlert[]> {
  const data = (await fetchJson(
    `https://api.weather.gov/alerts/active?point=${lat.toFixed(4)},${lon.toFixed(4)}`,
    { Accept: "application/geo+json", "User-Agent": NWS_UA }
  )) as {
    features?: {
      id?: string;
      properties?: Record<string, unknown>;
    }[];
  };
  const out: WxAlert[] = [];
  for (const f of data.features || []) {
    const p = f.properties || {};
    const event = clip(p.event, 80);
    if (!event) continue;
    const instruction = clip(p.instruction || p.description, 280);
    out.push({
      id: clip(f.id || p.id, 120) || event,
      event,
      headline: clip(p.headline, 180) || event,
      severity: clip(p.severity, 24),
      urgency: clip(p.urgency, 24),
      onset: p.onset ? String(p.onset) : p.effective ? String(p.effective) : null,
      ends: p.ends ? String(p.ends) : p.expires ? String(p.expires) : null,
      instruction,
      area: clip(p.areaDesc, 120),
      kind: classifyEvent(event),
    });
    if (out.length >= 12) break;
  }
  return out;
}

export async function fetchNhcStorms(): Promise<HurricaneStorm[]> {
  const data = (await fetchJson(
    "https://www.nhc.noaa.gov/CurrentStorms.json",
    { Accept: "application/json", "User-Agent": NWS_UA },
    8000
  )) as {
    activeStorms?: Record<string, unknown>[];
  };
  const out: HurricaneStorm[] = [];
  for (const s of data.activeStorms || []) {
    const latNum = Number(s.latitudeNumeric);
    const lonNum = Number(s.longitudeNumeric);
    const lat =
      parseNhcCoord(String(s.latitude || ""), "lat") ??
      (Number.isFinite(latNum) ? latNum : null);
    const lon =
      parseNhcCoord(String(s.longitude || ""), "lon") ??
      (Number.isFinite(lonNum) ? lonNum : null);
    const wind = Number(s.intensity);
    const dir = Number(s.movementDir);
    const spd = Number(s.movementSpeed);
    const dirLabel =
      Number.isFinite(dir) && Number.isFinite(spd)
        ? `Moving ${["N", "NE", "E", "SE", "S", "SW", "W", "NW"][Math.round((((dir % 360) + 360) % 360) / 45) % 8]} at ${Math.round(spd)} mph`
        : clip(s.movementStr, 80);
    out.push({
      id: clip(s.id || s.name, 40),
      name: clip(s.name, 40) || "Unnamed",
      classification: clip(s.classification, 8),
      classificationLabel: stormClassLabel(String(s.classification || "")),
      windMph: Number.isFinite(wind) ? Math.round(wind) : null,
      pressureMb: Number.isFinite(Number(s.pressure)) ? Math.round(Number(s.pressure)) : null,
      latitude: lat,
      longitude: lon,
      milesFromVillages:
        lat != null && lon != null ? haversineMi(VILLAGES_LAT, VILLAGES_LON, lat, lon) : null,
      movement: dirLabel || "Movement not listed",
      advisoryUrl: nhcNestedUrl(s.publicAdvisory),
      graphicsUrl: nhcNestedUrl(s.forecastGraphics),
      discussionUrl: nhcNestedUrl(s.forecastDiscussion),
    });
  }
  return out;
}

export async function fetchAirQuality(lat: number, lon: number): Promise<AirQuality> {
  const data = (await fetchJson(
    `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi,pm2_5`,
    { Accept: "application/json" }
  )) as { current?: { us_aqi?: number; pm2_5?: number } };
  const usAqi =
    data.current?.us_aqi != null ? Math.round(Number(data.current.us_aqi)) : null;
  const pm25 =
    data.current?.pm2_5 != null
      ? Math.round(Number(data.current.pm2_5) * 10) / 10
      : null;
  const band = aqiBand(usAqi);
  return { usAqi, pm25, ...band };
}

export async function fetchFloridaWeatherExtra(
  lat = VILLAGES_LAT,
  lon = VILLAGES_LON
): Promise<FloridaWeatherExtra> {
  const sources: string[] = [];
  const [alertsR, stormsR, airR] = await Promise.allSettled([
    fetchNwsAlerts(lat, lon),
    fetchNhcStorms(),
    fetchAirQuality(lat, lon),
  ]);
  const alerts = alertsR.status === "fulfilled" ? alertsR.value : [];
  if (alertsR.status === "fulfilled") sources.push("NWS");
  const storms = stormsR.status === "fulfilled" ? stormsR.value : [];
  if (stormsR.status === "fulfilled") sources.push("NHC");
  const air =
    airR.status === "fulfilled"
      ? airR.value
      : { usAqi: null, pm25: null, label: "—", tip: "Air quality unavailable." };
  if (airR.status === "fulfilled") sources.push("Open-Meteo air");
  return { alerts, storms, air, sources };
}
