import {
  DRIVING_CANDIDATE_CAP,
  haversineMeters,
  nearestNeighborOrder,
  straightLineDurations,
  type PublicPin,
} from "./lightTour";

export type RouteStop = PublicPin & {
  order: number;
  metersFromPrevious: number;
  secondsFromPrevious: number;
};

export type BuiltRoute = {
  stops: RouteStop[];
  /** [latitude, longitude] pairs, visitor first. */
  line: [number, number][];
  warning: string;
  usedAllPins: boolean;
  requested: number;
  available: number;
};

type Point = { latitude: number; longitude: number };

const cache = new Map<string, { line: [number, number][]; legs: { meters: number; seconds: number }[] }>();
const CACHE_MAX = 40;

function cacheKey(points: Point[]) {
  return points
    .map((point) => `${point.latitude.toFixed(4)},${point.longitude.toFixed(4)}`)
    .join(";");
}

function remember(key: string, value: { line: [number, number][]; legs: { meters: number; seconds: number }[] }) {
  if (cache.has(key)) cache.delete(key);
  cache.set(key, value);
  while (cache.size > CACHE_MAX) {
    const oldest = cache.keys().next().value;
    if (!oldest) break;
    cache.delete(oldest);
  }
}

async function osrmTable(points: Point[]): Promise<number[][] | null> {
  const path = points.map((point) => `${point.longitude},${point.latitude}`).join(";");
  const url = `https://router.project-osrm.org/table/v1/driving/${path}?annotations=duration`;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(12000) });
    if (!res.ok) return null;
    const data = (await res.json()) as { code?: string; durations?: number[][] };
    if (data.code !== "Ok" || !Array.isArray(data.durations)) return null;
    return data.durations;
  } catch {
    return null;
  }
}

async function osrmLine(points: Point[]): Promise<{ line: [number, number][]; legs: { meters: number; seconds: number }[] } | null> {
  const key = cacheKey(points);
  const hit = cache.get(key);
  if (hit) return hit;
  const path = points.map((point) => `${point.longitude},${point.latitude}`).join(";");
  const url = `https://router.project-osrm.org/route/v1/driving/${path}?overview=full&geometries=geojson&steps=false`;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(12000) });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      code?: string;
      routes?: {
        geometry?: { coordinates?: [number, number][] };
        legs?: { distance?: number; duration?: number }[];
      }[];
    };
    const route = data.routes?.[0];
    if (data.code !== "Ok" || !route?.geometry?.coordinates?.length) return null;
    const line = route.geometry.coordinates.map(([lon, lat]) => [lat, lon] as [number, number]);
    const legs = (route.legs || []).map((leg) => ({
      meters: Math.round(leg.distance || 0),
      seconds: Math.round(leg.duration || 0),
    }));
    const packed = { line, legs };
    remember(key, packed);
    return packed;
  } catch {
    return null;
  }
}

function straightLine(points: Point[]) {
  return {
    line: points.map((point) => [point.latitude, point.longitude] as [number, number]),
    legs: points.slice(1).map((point, index) => ({
      meters: Math.round(haversineMeters(points[index], point)),
      seconds: Math.round(haversineMeters(points[index], point) / 13),
    })),
  };
}

/**
 * Filter is already done. Rank the nearest stops by driving time, then order
 * those stops with greedy nearest neighbor, then draw the driving polyline.
 */
export async function buildDrivingRoute(input: {
  visitor: Point;
  pins: PublicPin[];
  count: number;
}): Promise<BuiltRoute> {
  const available = input.pins.length;
  const requested = input.count;
  if (!available) {
    return { stops: [], line: [], warning: "", usedAllPins: true, requested, available };
  }
  let pool = input.pins;
  let poolNote = "";
  if (pool.length > DRIVING_CANDIDATE_CAP) {
    pool = [...pool]
      .sort((a, b) => haversineMeters(input.visitor, a) - haversineMeters(input.visitor, b))
      .slice(0, DRIVING_CANDIDATE_CAP);
    poolNote = `Driving times were compared for the ${DRIVING_CANDIDATE_CAP} closest houses.`;
  }
  const tablePoints: Point[] = [input.visitor, ...pool];
  let table = await osrmTable(tablePoints);
  let warning = "";
  if (!table) {
    table = straightLineDurations(tablePoints);
    warning = "Driving times could not be loaded, so this route is a straight-line estimate.";
  }
  const ranked = pool
    .map((pin, index) => ({ pin, at: index + 1, duration: table?.[0]?.[index + 1] ?? Number.POSITIVE_INFINITY }))
    .sort((a, b) => a.duration - b.duration)
    .slice(0, Math.min(requested, pool.length));
  const kept = [0, ...ranked.map((row) => row.at)];
  const rankDurations = kept.map((from) => kept.map((to) => table?.[from]?.[to] ?? Number.POSITIVE_INFINITY));
  const order = nearestNeighborOrder(rankDurations);
  const ordered = order.map((index) => ranked[index - 1]?.pin).filter((pin): pin is PublicPin => !!pin);
  const usedAllPins = ordered.length >= available;
  const path = [input.visitor, ...ordered];
  const driven = warning ? null : await osrmLine(path);
  const geometry = driven || straightLine(path);
  if (!driven && !warning) {
    warning = "The driving line could not be loaded, so the map shows a straight-line route.";
  }
  const stops: RouteStop[] = ordered.map((pin, index) => {
    const leg = geometry.legs[index];
    return {
      ...pin,
      order: index + 1,
      metersFromPrevious: leg?.meters ?? Math.round(haversineMeters(path[index], pin)),
      secondsFromPrevious: leg?.seconds ?? 0,
    };
  });
  const shortCount = available < requested
    ? `Only ${available} ${available === 1 ? "house is" : "houses are"} saved for this holiday, so the tour uses all of them.`
    : "";
  return {
    stops,
    line: geometry.line,
    warning: [warning, shortCount, poolNote].filter(Boolean).join(" "),
    usedAllPins,
    requested,
    available,
  };
}
