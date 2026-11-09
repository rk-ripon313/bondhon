import { ArrowUpRight, CalendarDays, Clock3, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

import FollowToggle from "@/components/shared/FollowToggle";
import { Button } from "@/components/ui/button";
import { formatEventDateRange, getTimeAgo } from "@/lib/helpers/date";
import { formatLocation } from "@/lib/helpers/location-format";
import { getEffectiveEventStatus, getStatusStyles } from "@/lib/helpers/status";
import { cn } from "@/lib/utils";
import { EventCardData } from "@/types/event.type";
import EventMoreActions from "../EventMoreActions";
import EventCardParticipation from "./EventCardParticipation";

export default function EventCard({
  event,
  variant = "default",
}: {
  event: EventCardData;
  variant?: "default" | "compact";
}) {
  const isCompact = variant === "compact";

  const { dateLabel, timeLabel } = formatEventDateRange(
    event.startsAt,
    event.endsAt,
  );

  const organizerName = event.organizer?.name || "Unknown User";

  const statusStyles = getStatusStyles(getEffectiveEventStatus(event));

  return (
    <Card
      className={cn(
        "group overflow-hidden gap-0 border-border/70 bg-app-card py-0 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md",
        isCompact && "md:flex md:flex-row",
      )}
    >
      {/* Thumbnail */}
      <div
        className={cn(
          "relative aspect-[16/9] overflow-hidden bg-app-muted",
          isCompact &&
            "aspect-[16/7] md:aspect-auto md:w-60 lg:w-72 xl:w-80 md:shrink-0",
        )}
      >
        <Link href={`/events/${event.id}`} className="absolute inset-0">
          <Image
            src={event.thumbnail || "/events/default-event.jpg"}
            alt={event.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes={
              isCompact
                ? "(max-width: 768px) 100vw, (max-width: 1024px) 208px, 256px"
                : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            }
          />
        </Link>

        {/* Image Overlay Actions */}
        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between p-3">
          <Badge
            variant="outline"
            className="flex items-center gap-1.5 border bg-app-background/85 px-2.5 py-1 text-xs font-medium shadow-sm backdrop-blur-md"
            title={`Status: ${statusStyles.label}`}
          >
            <span
              className={cn("size-1.5 shrink-0 rounded-full", statusStyles.dot)}
              aria-hidden="true"
            />
            <span className="capitalize">{statusStyles.label}</span>
          </Badge>

          <EventMoreActions event={event} />
        </div>
      </div>

      <CardContent
        className={cn("min-w-0 flex-1 space-y-3 p-4", isCompact && "md:p-3.5")}
      >
        {/* Title + Description */}
        <div className="space-y-1.5">
          <Link
            href={`/events/${event.id}`}
            className="line-clamp-1 text-base font-semibold transition-colors hover:text-app-primary"
          >
            {event.title}
          </Link>

          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {event.description}
          </p>
        </div>

        {/* Date + Time & Location */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <CalendarDays className="size-4 shrink-0 text-app-primary" />
            <span>{dateLabel}</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock3 className="size-4 shrink-0 text-muted-foreground" />
            <span className="text-muted-foreground">{timeLabel}</span>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="size-4 shrink-0 text-muted-foreground" />
            <span className="truncate text-muted-foreground">
              {formatLocation(event.location)}
            </span>
          </div>
        </div>
        {/* Organizer + Participation Counts */}
        <div className="flex items-center gap-2 border-t border-border/60 pt-3">
          <Link href={`/user/${event.organizer.username}`}>
            <Avatar className="size-8">
              <AvatarImage src={event.organizer?.image} alt={organizerName} />

              <AvatarFallback className="bg-app-secondary/10 text-sm font-semibold text-app-secondary">
                {organizerName?.at(0)?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          </Link>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <p className="truncate text-sm font-semibold text-app-foreground">
                {organizerName}
              </p>
              {!event.isOwner && (
                <FollowToggle
                  username={event.organizer.username}
                  isFollowing={event.isFollowing}
                />
              )}
            </div>
            <div className="mt-0.5 text-xs text-muted-foreground">
              <span>{getTimeAgo(event.createdAt)}</span>
            </div>
          </div>

          <Link href={`/events/${event.id}`}>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 cursor-pointer bg-app-background text-app-secondary hover:bg-app-secondary/10 hover:text-app-secondary sm:w-auto sm:px-2.5"
              aria-label="View details"
            >
              <span className="hidden sm:inline text-xs font-semibold">
                View Details
              </span>
              <ArrowUpRight className="sm:size-4 size-6" />
            </Button>
          </Link>
        </div>

        {/* Event */}
        <EventCardParticipation event={event} />
      </CardContent>
    </Card>
  );
}
