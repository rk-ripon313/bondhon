"use client";

import {
  Bookmark,
  CalendarDays,
  Clock3,
  Flag,
  MapPin,
  MoreHorizontal,
  Pencil,
  Share2,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { formatEventDateRange } from "@/lib/helpers/date";
import { formatLocation } from "@/lib/helpers/location-format";
import { getStatusStyles } from "@/lib/helpers/status";
import { cn } from "@/lib/utils";
import { EventCardData } from "@/types/event.type";

interface EventCardProps {
  event: EventCardData;
  currentUserId?: string;
}

export default function EventCard({ event, currentUserId }: EventCardProps) {
  const isOwner = currentUserId === event.organizer?.id;

  const { dateLabel, timeLabel } = formatEventDateRange(
    event.startsAt,
    event.endsAt,
  );

  return (
    <Card className="group overflow-hidden gap-0 border-border/70 bg-app-card py-0 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      {/* Thumbnail */}
      <div className="relative aspect-[16/9] overflow-hidden bg-app-muted">
        <Link href={`/events/${event.id}`} className="absolute inset-0">
          <Image
            src={event.thumbnail || "/events/default-event.jpg"}
            alt={event.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </Link>

        {/* Image Overlay Actions */}
        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between p-3">
          <Badge
            variant="outline"
            className={cn(
              "border bg-background/85 capitalize shadow-sm backdrop-blur-md",
              getStatusStyles[event.status],
            )}
          >
            {event.status}
          </Badge>

          <DropdownMenu>
            <DropdownMenuTrigger asChild className="bg-app-card">
              <Button
                variant="secondary"
                size="icon"
                className="cursor-pointer pointer-events-auto size-8 border border-border/60 bg-background/85 shadow-sm backdrop-blur-md hover:bg-background"
              >
                <MoreHorizontal className="size-4" />
                <span className="sr-only">More actions</span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-44 bg-app-background">
              {isOwner ? (
                <>
                  <DropdownMenuItem>
                    <Pencil className="size-4" />
                    Edit event
                  </DropdownMenuItem>

                  <DropdownMenuItem>
                    <Share2 className="size-4" />
                    Share event
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem className="text-destructive focus:text-destructive">
                    <Trash2 className="size-4" />
                    Delete event
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem>
                    <Share2 className="size-4" />
                    Share event
                  </DropdownMenuItem>

                  <DropdownMenuItem>
                    <Bookmark className="size-4" />
                    Save event
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem className="text-destructive focus:text-destructive">
                    <Flag className="size-4" />
                    Report event
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <CardContent className="space-y-3 p-4">
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

        {/* Date & Time */}
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
          <Avatar className="size-8">
            <AvatarImage src={event.organizer?.image} />
            <AvatarFallback>
              {event.organizer?.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">
              {event.organizer?.name}
            </p>
            <p className="text-xs text-muted-foreground">Organizer</p>
          </div>

          <div className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
            <span>{event.goingCount} Going</span>
            <span>·</span>
            <span>{event.interestedCount} Interested</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
