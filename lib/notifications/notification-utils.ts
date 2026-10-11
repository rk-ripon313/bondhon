import type { NOTIFICATION_TYPES } from "@/constants";
import {
  CalendarDays,
  Droplet,
  Heart,
  Info,
  UserRound,
  type LucideIcon,
} from "lucide-react";

type NotificationType = (typeof NOTIFICATION_TYPES)[number];

const notificationIcons: Record<NotificationType, LucideIcon> = {
  blood_request_created: Droplet,
  blood_request_interested: Droplet,
  blood_request_assigned: Droplet,
  blood_request_updated: Droplet,
  blood_request_donor_confirmed: Droplet,
  blood_request_donor_canceled: Droplet,
  blood_request_requester_confirmed: Droplet,
  blood_request_requester_canceled: Droplet,
  blood_request_expiring: Droplet,
  blood_request_expired: Droplet,
  blood_request_completed: Droplet,
  blood_request_donation_successful: Heart,

  user_followed: UserRound,

  event_created: CalendarDays,
  event_updated: CalendarDays,
  event_interested: CalendarDays,
  event_going: CalendarDays,
  event_joined: CalendarDays,
  event_canceled: CalendarDays,

  account_updated: UserRound,
  account_verified: UserRound,

  system_notice: Info,
  announcement: Info,
};

export function getNotificationIcon(type: string): LucideIcon {
  return notificationIcons[type as NotificationType] ?? Info;
}
