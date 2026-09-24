import { BLOOD_GROUPS } from "@/constants";

type BloodGroup = (typeof BLOOD_GROUPS)[number];

const COMPATIBLE_DONORS: Record<BloodGroup, readonly BloodGroup[]> = {
  "A+": ["A+", "A-", "O+", "O-"],
  "A-": ["A-", "O-"],
  "B+": ["B+", "B-", "O+", "O-"],
  "B-": ["B-", "O-"],
  "AB+": ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
  "AB-": ["A-", "B-", "AB-", "O-"],
  "O+": ["O+", "O-"],
  "O-": ["O-"],
};

export function isBloodGroupCompatible(
  donorBloodGroup: string | undefined,
  recipientBloodGroup: string,
): boolean {
  if (!donorBloodGroup) {
    return false;
  }

  if (
    !BLOOD_GROUPS.includes(donorBloodGroup as BloodGroup) ||
    !BLOOD_GROUPS.includes(recipientBloodGroup as BloodGroup)
  ) {
    return false;
  }

  return COMPATIBLE_DONORS[recipientBloodGroup as BloodGroup].includes(
    donorBloodGroup as BloodGroup,
  );
}
