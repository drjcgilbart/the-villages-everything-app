export const TOUR_HOLIDAYS = ["halloween", "christmas", "other"] as const;
export type TourHoliday = (typeof TOUR_HOLIDAYS)[number];

export const HOLIDAY_LABELS: Record<TourHoliday, string> = {
  halloween: "Halloween",
  christmas: "Christmas",
  other: "Other",
};

export const DEFAULT_STOPS = 10;
export const MAX_STOPS = 50;
/** Candidate pool sent to the driving table when a holiday has a long list. */
export const DRIVING_CANDIDATE_CAP = 60;
export const GEOFENCE_METERS = 150;

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
