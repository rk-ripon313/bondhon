import { UserProfile } from "@/types/user.type";

const DEFAULT_AVATARS = [
  "/avatars/default.png",
  "/avatars/user-default.png",
  "/avatars/anonymous.png",
];

export const calculateProfileCompletion = (user: UserProfile) => {
  let completion = 0;

  if (user.image && !DEFAULT_AVATARS.includes(user.image)) {
    completion += 10;
  }

  if (user.username) completion += 15;
  if (user.phone) completion += 15;
  if (user.bloodGroup) completion += 20;
  if (user.gender) completion += 10;
  if (user.dateOfBirth) completion += 10;

  if (user.location?.district && user.location?.area) {
    completion += 20;
  }

  return completion;
};

export const isUserEligibleForAction = (user: UserProfile) => {
  return Boolean(
    user.username &&
    user.phone &&
    user.bloodGroup &&
    user.gender &&
    user.dateOfBirth &&
    user.location?.district &&
    user.location?.area,
  );
};
