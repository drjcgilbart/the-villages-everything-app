export const TOUR_HOLIDAYS = ["halloween", "christmas", "other"] as const;
export type TourHoliday = (typeof TOUR_HOLIDAYS)[number];

export const HOLIDAY_LABELS: Record<TourHoliday, string> = {
  halloween: "Halloween",
  christmas: "Christmas",
  other: "Other",
};

export const DEFAULT_STOPS = 10;
export const MAX_STOPS = 50;
export const VILLAGES_CENTER = { latitude: 28.908, longitude: -81.985 };
/** A tour start farther than this is not a Villages driveway. */
export const TOUR_START_MAX_METERS = 200 * 1609.34;
/** Candidate pool sent to the driving table when a holiday has a long list. */
export const DRIVING_CANDIDATE_CAP = 60;
/**
 * Near a house, leaving the street line is pulling up, not a wrong turn, so
 * off-route rerouting stays quiet inside this radius. Not used for arrival
 * (see ARRIVAL_METERS in tourArrival.ts).
 */
export const OFF_ROUTE_QUIET_METERS = 150;
/** @deprecated Kept for older imports. Use OFF_ROUTE_QUIET_METERS. */
export const GEOFENCE_METERS = OFF_ROUTE_QUIET_METERS;

export function haversineMeters(
  a: { latitude: number; longitude: number },
  b: { latitude: number; longitude: number }
) {
  const r = 6371000;
  const dLat = ((b.latitude - a.latitude) * Math.PI) / 180;
  const dLon = ((b.longitude - a.longitude) * Math.PI) / 180;
  const lat1 = (a.latitude * Math.PI) / 180;
  const lat2 = (b.latitude * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * r * Math.asin(Math.min(1, Math.sqrt(h)));
}

/** Blank browser locations arrive as 0, 0, in the ocean off Africa. */
export function tourStartProblem(point: { latitude: number; longitude: number }): string | null {
  const { latitude, longitude } = point;
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude) || latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    return "Type a latitude and longitude, or turn on Use my location.";
  }
  if (Math.abs(latitude) < 0.05 && Math.abs(longitude) < 0.05) {
    return "The browser sent a blank spot in the ocean off Africa, not The Villages. Allow location for this site and try again, or type your latitude and longitude.";
  }
  if (haversineMeters(VILLAGES_CENTER, point) > TOUR_START_MAX_METERS) {
    return "That starting point is not near The Villages, so the route stays on the houses here.";
  }
  return null;
}
