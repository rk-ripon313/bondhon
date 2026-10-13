import { CalendarDays, Droplet, Heart, Info, UserRound } from "lucide-react";

import { NOTIFICATION_TYPES } from "@/constants";

type NotificationType = (typeof NOTIFICATION_TYPES)[number];

const iconConfig = {
  blood_request_created: {
    Icon: Droplet,
    className: "bg-red-500/10 text-red-600 dark:text-red-400",
  },
  blood_request_interested: {
    Icon: Droplet,
    className: "bg-red-500/10 text-red-600 dark:text-red-400",
  },
  blood_request_assigned: {
    Icon: Droplet,
    className: "bg-red-500/10 text-red-600 dark:text-red-400",
  },
  blood_request_updated: {
    Icon: Droplet,
    className: "bg-red-500/10 text-red-600 dark:text-red-400",
  },
  blood_request_donor_confirmed: {
    Icon: Droplet,
    className: "bg-red-500/10 text-red-600 dark:text-red-400",
  },
  blood_request_donor_canceled: {
    Icon: Droplet,
    className: "bg-red-500/10 text-red-600 dark:text-red-400",
  },
  blood_request_requester_confirmed: {
    Icon: Droplet,
    className: "bg-red-500/10 text-red-600 dark:text-red-400",
  },
  blood_request_requester_canceled: {
    Icon: Droplet,
    className: "bg-red-500/10 text-red-600 dark:text-red-400",
  },
  blood_request_expiring: {
    Icon: Droplet,
    className: "bg-red-500/10 text-red-600 dark:text-red-400",
  },
  blood_request_expired: {
    Icon: Droplet,
    className: "bg-red-500/10 text-red-600 dark:text-red-400",
  },
  blood_request_completed: {
    Icon: Droplet,
    className: "bg-red-500/10 text-red-600 dark:text-red-400",
  },
  blood_request_donation_successful: {
    Icon: Heart,
    className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  user_followed: {
    Icon: UserRound,
    className: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  event_created: {
    Icon: CalendarDays,
    className: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  },
  event_updated: {
    Icon: CalendarDays,
    className: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  },
  event_interested: {
    Icon: CalendarDays,
    className: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  },
  event_going: {
    Icon: CalendarDays,
    className: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  },
  event_joined: {
    Icon: CalendarDays,
    className: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  },
  event_canceled: {
    Icon: CalendarDays,
    className: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  },
  account_updated: {
    Icon: UserRound,
    className: "bg-muted text-muted-foreground",
  },
  account_verified: {
    Icon: UserRound,
    className: "bg-muted text-muted-foreground",
  },
  system_notice: {
    Icon: Info,
    className: "bg-muted text-muted-foreground",
  },
  announcement: {
    Icon: Info,
    className: "bg-muted text-muted-foreground",
  },
} satisfies Record<NotificationType, { Icon: typeof Info; className: string }>;

export default function NotificationTypeIcon({ type }: { type: string }) {
  const { Icon, className } = iconConfig[type as NotificationType] ?? {
    Icon: Info,
    className: "bg-muted text-muted-foreground",
  };

  return (
    <div
      className={`flex size-11 shrink-0 items-center justify-center rounded-full ${className}`}
      aria-hidden="true"
    >
      <Icon className="size-5" />
    </div>
  );
}
