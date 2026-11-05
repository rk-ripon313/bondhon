import { MessageCircle, UserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import FollowToggle from "@/components/shared/FollowToggle";

interface EventOrganizerProps {
  organizer: {
    id: string;
    name: string;
    username: string;
    image?: string;
  };
  isOwner: boolean;
  isFollowing: boolean;
}

export default function EventOrganizer({
  organizer,
  isOwner,
  isFollowing,
}: EventOrganizerProps) {
  return (
    <section className="min-w-0 rounded-2xl border border-border bg-app-card p-4 sm:p-5">
      {/* Section heading */}
      <div className="flex items-center gap-2">
        <UserRound className="size-4 shrink-0 text-app-primary" />
        <h2 className="font-semibold text-app-foreground">Organized By</h2>
      </div>

      {/* Organizer profile */}
      <div className="mt-5 flex min-w-0 items-center gap-3">
        <Link
          href={`/user/${organizer.username}`}
          aria-label={`View ${organizer.name}'s profile`}
          className="relative size-12 shrink-0 overflow-hidden rounded-full bg-muted ring-1 ring-border transition hover:ring-app-primary/50"
        >
          {organizer.image ? (
            <Image
              src={organizer.image}
              alt={organizer.name}
              fill
              sizes="48px"
              className="object-cover"
            />
          ) : (
            <div className="flex size-full items-center justify-center font-semibold text-muted-foreground">
              {organizer.name.charAt(0).toUpperCase()}
            </div>
          )}
        </Link>

        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
            <p className="min-w-0 truncate text-sm font-semibold text-app-foreground">
              {organizer.name}
            </p>

            {isOwner ? (
              <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                You
              </span>
            ) : (
              <FollowToggle
                username={organizer.username}
                isFollowing={isFollowing}
                className="shrink-0"
              />
            )}
          </div>

          <p className="mt-1 text-xs text-muted-foreground">
            {isOwner ? "You organized this event" : "Event organizer"}
          </p>
        </div>
      </div>

      {/* Profile actions */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        <Link
          href={`/user/${organizer.username}`}
          className="inline-flex h-10 min-w-0 items-center justify-center rounded-lg border border-border px-2 text-sm font-medium text-app-foreground transition hover:border-app-primary/40 hover:bg-muted/50"
        >
          View Profile
        </Link>

        <button
          type="button"
          disabled
          title="Messaging is not available yet"
          className="inline-flex h-10 min-w-0 cursor-not-allowed items-center justify-center gap-1.5 rounded-lg border border-border px-2 text-sm font-medium text-muted-foreground opacity-70"
        >
          <MessageCircle className="size-4 shrink-0" />
          <span>Message</span>
        </button>
      </div>
    </section>
  );
}
