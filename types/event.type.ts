import { EVENT_CATEGORIES, EVENT_STATUS } from "@/constants";
import { LocationData } from "./location.type";

export interface GetEventsParams {
  search?: string;
  division?: string;
  district?: string;
  upazila?: string;
  category?: string;
  status?: string;
  sort?: "soonest" | "latest" | "nearest";
  lat?: string | number;
  lng?: string | number;
  page?: string | number;
  itemsPerPage?: number;
}

export interface EventCardData {
  id: string;
  title: string;
  description?: string;
  thumbnail: string;
  category: (typeof EVENT_CATEGORIES)[number];
  tags: string[];
  startsAt: Date | string;
  endsAt: Date | string;
  location?: LocationData;

  status: (typeof EVENT_STATUS)[number];

  organizer: {
    id: string;
    name: string;
    username: string;
    image?: string;
  };

  interestedCount: number;
  goingCount: number;

  isOwner: boolean;
  isInterested: boolean;
  isGoing: boolean;

  createdAt?: Date | string;
  updatedAt?: Date | string;
}
