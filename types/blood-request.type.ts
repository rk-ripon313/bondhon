import { BLOOD_GROUPS, REQUEST_URGENCY } from "@/constants";
import { LocationData } from "./location.type";

export type BloodRequestCardData = {
  id: string;

  requester: {
    id: string;
    name: string;
    username: string;
    image?: string;
  };

  bloodGroupNeeded: (typeof BLOOD_GROUPS)[number];
  quantity: number;
  urgency: (typeof REQUEST_URGENCY)[number];

  contactNumber?: string;
  hospitalName?: string;

  location?: LocationData;

  neededBefore: Date;
  additionalNotes?: string;

  status: string;

  interestedCount: number;
  assignedCount: number;

  isInterested: boolean;
  isOwner: boolean;

  createdAt?: Date | string;
  updatedAt?: Date | string;
};
