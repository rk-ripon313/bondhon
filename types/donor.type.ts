export interface GetDonorsParams {
  search?: string;
  availableOnly?: string;
  division?: string;
  district?: string;
  upazila?: string;
  bloodGroup?: string;
  lat?: string | number;
  lng?: string | number;
  page?: string | number;
  itemsPerPage?: number;
}

export interface VerifiedDonor {
  id: string;
  name: string;
  username: string;
  image?: string;
  bloodGroup: string;
  isAvailableForDonate: boolean;
  location: {
    district: string;
    area: string;
    address?: string;
  };
  donationHistory?: unknown[];
  distance?: number;
  isYou: boolean;
  isFollowing: boolean;
}

export interface CommunityDonorType {
  id: string;
  name: string;
  phone: string;
  bloodGroup: string;
  location: {
    district: string;
    area: string;
    address?: string;
  };
  addedBy: {
    name: string;
    username: string;
  };
}
