import { LocationData } from "@/types/location.type";

export const formatLocation = (location?: LocationData | null) => {
  if (!location) return "Not specified";

  return `${location.area}, ${location.district}`;
};
