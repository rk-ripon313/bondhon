export type BloodRequestCardData = {
  id: string;

  requester: {
    name: string;
    username: string;
    image?: string;
  };

  bloodGroupNeeded: string;
  quantity: number;
  urgency: string;

  contactNumber?: string | number;
  hospitalName?: string;

  location?: {
    district?: string;
    area?: string;
    address?: string;
  };

  neededBefore: Date;
  additionalNotes?: string;

  status: string;

  interestedDonors?: string[];
  assignedDonors?: string[];

  createdAt?: Date | string;
  updatedAt?: Date | string;
};
