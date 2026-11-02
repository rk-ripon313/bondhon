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
  description: string;
  thumbnail?: string;
  category: string;
  startsAt: Date | string;
  endsAt: Date | string;
  status: string;

  location?: LocationData;

  organizer: {
    id: string;
    name: string;
    username: string;
    image?: string;
    phone?: string;
    email?: string;
  };

  interestedCount: number;
  goingCount: number;

  isOwner: boolean;
  isFollowing: boolean;
  currentUserId?: string;
  isInterested: boolean;
  isGoing: boolean;

  createdAt?: Date | string;
  updatedAt?: Date | string;
}
