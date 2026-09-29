import { BLOOD_GROUPS, REQUEST_URGENCY } from "@/constants";
import { LocationData } from "./location.type";

export interface BloodRequestCardData {
  id: string;

  requester: {
    id: string;
    name: string;
    username: string;
    image?: string;
    phone?: string;
    email?: string;
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
  isAssigned: boolean;
  isOwner: boolean;
  currentUserId?: string;

  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface BloodRequestDetailDonor {
  id: string;
  name: string;
  username: string;
  image?: string;
  bloodGroup: string;
  phone: string;
  location: LocationData;
}

export interface BloodRequestAssignment {
  donor: BloodRequestDetailDonor;

  assignedAt: Date | string;

  donationStatus:
    | "pending"
    | "confirmed_by_donor"
    | "confirmed_by_requester"
    | "donated"
    | "canceled_by_donor"
    | "canceled_by_requester";

  donatedAt?: Date | string;
  donorConfirmedAt?: Date | string;
  requesterConfirmedAt?: Date | string;
}

export interface BloodRequestDetailData extends BloodRequestCardData {
  interestedDonors: BloodRequestDetailDonor[];
  assignedDonors: BloodRequestAssignment[];
}
