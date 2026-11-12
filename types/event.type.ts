import { EVENT_CATEGORIES } from "@/constants";
import { LocationData } from "./location.type";

export interface GetEventsParams {
  search?: string;
  division?: string;
  district?: string;
  upazila?: string;
  category?: string;
  status?: string;
  sort?: string;
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
  category: (typeof EVENT_CATEGORIES)[number];
  startsAt: Date | string;
  endsAt: Date | string;
  status: string;
  tags: string[];

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

export interface EventDetailParticipant {
  id: string;
  name: string;
  username: string;
  image?: string;
  location: LocationData;
  isFollowing: boolean;
  isYou: boolean;
}

export interface EventDetailData extends EventCardData {
  interestedUsers: EventDetailParticipant[];
  goingUsers: EventDetailParticipant[];
}


export interface GetMyEventActivityParams {
  role?: string;
  status?: string;
  sort?: string;
  page?: number;
  itemsPerPage?: number;
}
