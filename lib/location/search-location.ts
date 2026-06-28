export async function searchLocations(query: string) {
  const res = await fetch(
    `/api/locations/search?q=${encodeURIComponent(query)}`,
  );

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to fetch locations.");
  }

  return res.json();
}
