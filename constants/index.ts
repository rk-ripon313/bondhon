export const USER_ROLES = ["user", "admin"] as const;

export const GENDERS = ["male", "female", "other"] as const;

export const BLOOD_GROUPS = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
] as const;

export const REQUEST_STATUSES = [
  "active",
  "assigned",
  "completed",
  "expired",
] as const;

export const REQUEST_URGENCY = ["normal", "urgent", "critical"] as const;

export const EVENT_CATEGORIES = [
  "community-action",
  "health",
  "awareness",
  "education",
  "social",
  "sports",
  "fundraising",
  "other",
] as const;

export const EVENT_STATUS = [
  "upcoming",
  "ongoing",
  "completed",
  "cancelled",
] as const;

export const NOTIFICATION_TYPES = [
  "blood",
  "event",
  "announcement",
  "notice",
  "social",
  "account",
  "system",
] as const;
