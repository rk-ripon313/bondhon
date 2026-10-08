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

export const REQUEST_STATUSES = ["active", "completed", "expired"] as const;

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
  // Blood request
  "blood_request_created",
  "blood_request_interested",
  "blood_request_assigned",
  "blood_request_updated",
  "blood_request_donor_confirmed",
  "blood_request_donor_canceled",
  "blood_request_requester_confirmed",
  "blood_request_requester_canceled",
  "blood_request_expiring",
  "blood_request_expired",
  "blood_request_completed",
  "blood_request_donation_successful",

  // Social
  "user_followed",

  // Event
  "event_created",
  "event_updated",
  "event_interested",
  "event_going",
  "event_joined",
  "event_canceled",

  // Account
  "account_updated",
  "account_verified",

  // System
  "system_notice",
  "announcement",
] as const;
