import { UserProfile } from "@/types/user.type";

const DEFAULT_AVATARS = [
  "/avatars/default.png",
  "/avatars/user-default.png",
  "/avatars/anonymous.png",
];

export const calculateProfileCompletion = (user: UserProfile) => {
  let completion = 0;

  // Profile image
  if (user.image && !DEFAULT_AVATARS.includes(user.image)) {
    completion += 10;
  }

  // Important personal information
  if (user.phone) completion += 15;
  if (user.bloodGroup) completion += 20;
  if (user.gender) completion += 10;
  if (user.dateOfBirth) completion += 10;

  // Location
  if (user.location?.district && user.location?.area) {
    completion += 20;
  }

  // Optional information
  if (user.height) completion += 5;
  if (user.weight) completion += 5;
  if (user.location?.address) completion += 5;

  return completion;
};

export const isUserEligibleForAction = (user: UserProfile) => {
  return Boolean(
    user.phone &&
    user.bloodGroup &&
    user.gender &&
    user.dateOfBirth &&
    user.location?.district &&
    user.location?.area,
  );
};
