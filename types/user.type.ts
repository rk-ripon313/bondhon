export interface SessionUser {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export interface UserProfile {
  _id: string;
  name: string;
  nickname?: string;

  username: string;
  email: string;
  phone?: string;

  image?: string;

  bloodGroup?: string;
  gender?: string;
  dateOfBirth?: Date | string;
  height?: number;
  weight?: number;

  location?: {
    district?: string;
    area?: string;
    address?: string;
  };

  followers?: string[];
  following?: string[];

  isAvailableForDonate?: boolean;
  lastDonationDate?: Date | string;
  totalDonations?: number;

  badges?: string[];

  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface UserConnection {
  username: string;
  name: string;
  image?: string;
}
