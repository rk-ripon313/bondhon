import { LocationOption } from "@/types/location.type";
import { replaceMongoIdInArray } from "../helpers/transform-id";

export async function searchLocations(query: string) {
  const res = await fetch(
    `/api/locations/search?q=${encodeURIComponent(query)}`,
  );

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to fetch locations.");
  }

  const data = await res.json();

  return replaceMongoIdInArray(data) as LocationOption[];
}
