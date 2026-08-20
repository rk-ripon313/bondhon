import { UserProfile } from "@/types/user.type";

export function calculateProfileCompletion(user: UserProfile) {
  let completion = 0;

  if (user.phone) completion += 20;
  if (user.bloodGroup) completion += 20;
  if (user.gender) completion += 15;
  if (user.dateOfBirth) completion += 15;
  if (user.location?.district) completion += 15;
  if (user.location?.area) completion += 15;

  return completion;
}

export function isProfileComplete(user: UserProfile) {
  return calculateProfileCompletion(user) === 100;
}
