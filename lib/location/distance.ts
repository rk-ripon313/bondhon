import { LocationData } from "@/types/location.type";

const EARTH_RADIUS_KM = 6371;

export function getDistanceInKm(
  from?: LocationData,
  to?: LocationData,
): number | null {
  const fromCoordinates = from?.coordinates?.coordinates;
  const toCoordinates = to?.coordinates?.coordinates;

  if (!fromCoordinates || !toCoordinates) {
    return null;
  }

  const [fromLng, fromLat] = fromCoordinates;
  const [toLng, toLat] = toCoordinates;

  if (
    !Number.isFinite(fromLng) ||
    !Number.isFinite(fromLat) ||
    !Number.isFinite(toLng) ||
    !Number.isFinite(toLat)
  ) {
    return null;
  }

  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

  const lat1 = toRadians(fromLat);
  const lat2 = toRadians(toLat);
  const deltaLat = toRadians(toLat - fromLat);
  const deltaLng = toRadians(toLng - fromLng);

  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_KM * c;
}
