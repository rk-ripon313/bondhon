import { ArrowLeft, CalendarDays, Heart, MapPin, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import EventMoreActions from "@/components/events/EventMoreActions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/helpers/date";
import { formatLocation } from "@/lib/helpers/location-format";
import { getStatusStyles } from "@/lib/helpers/status";
import { EventCardData } from "@/types/event.type";

export default function EventDetailHero({ event }: { event: EventCardData }) {
  const startDate = new Date(event.startsAt);
  const endDate = new Date(event.endsAt);

  const isSameDay = formatDate(startDate) === formatDate(endDate);

  const dateLabel = isSameDay
    ? formatDate(startDate)
    : `${formatDate(startDate)} – ${formatDate(endDate)}`;

  const statusStyles = getStatusStyles(
    endDate <= new Date() ? "expired" : event.status,
  );

  const categoryLabel = event.category.replaceAll("-", " ");

  return (
    <section className="overflow-hidden rounded-2xl border border-border/70 bg-app-card shadow-sm">
      {/* Event Cover */}
      <div className="relative isolate aspect-[16/10] w-full overflow-hidden bg-app-muted sm:aspect-[16/9] lg:aspect-[2.4/1]">
        <Image
          src={event.thumbnail || "/events/default-event.jpg"}
          alt={event.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        {/* Contrast Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-black/40" />

        {/* Detail Navigation */}
        <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between gap-3 p-4 sm:p-6 lg:p-7">
          <Button
            asChild
            size="sm"
            variant="ghost"
            className="gap-2 border border-white/20 bg-black/45 text-white shadow-lg backdrop-blur-md hover:bg-black/65 hover:text-white"
          >
            <Link href="/events">
              <ArrowLeft className="size-4" />
              Back to Events
            </Link>
          </Button>

          <EventMoreActions event={event} />
        </div>

        {/* Event Introduction */}
        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 lg:p-7">
          <div className="space-y-3">
            {/* Event Status and Category */}
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className="gap-1.5 border-white/25 bg-black/60 px-3 py-1 text-white shadow-sm backdrop-blur-md"
              >
                <span className={`size-1.5 rounded-full ${statusStyles.dot}`} />
                {statusStyles.label}
              </Badge>

              <Badge
                variant="outline"
                className="bg-emerald-500/90 px-3 py-1 text-white capitalize shadow-sm backdrop-blur-md"
              >
                {categoryLabel}
              </Badge>
            </div>

            {/* Event Title */}
            <h1 className="max-w-4xl text-2xl font-bold leading-tight tracking-tight text-white drop-shadow-md sm:text-3xl lg:text-4xl xl:text-5xl">
              {event.title}
            </h1>

            {/* Event Schedule and Location */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <div className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-white/20 bg-black/55 px-3 py-2 text-xs font-medium text-white shadow-sm backdrop-blur-md sm:text-sm">
                <CalendarDays className="size-4 shrink-0" />
                <span>{dateLabel}</span>
              </div>

              {event.location && (
                <div className="flex min-w-0 max-w-full items-center gap-2 rounded-lg border border-white/20 bg-black/55 px-3 py-2 text-xs font-medium text-white shadow-sm backdrop-blur-md sm:max-w-md sm:text-sm">
                  <MapPin className="size-4 shrink-0" />
                  <span className="truncate">
                    {formatLocation(event.location)}
                  </span>
                </div>
              )}
            </div>

            {/* Event Engagement */}
            <div className="flex items-center gap-4 pt-1 text-xs font-medium text-white sm:text-sm">
              <div className="flex items-center gap-1.5">
                <Users className="size-4 text-white/80" />
                <span className="font-semibold">{event.goingCount}</span>
                <span className="text-white/75">Going</span>
              </div>

              <div className="flex items-center gap-1.5">
                <Heart className="size-4 text-white/80" />
                <span className="font-semibold">{event.interestedCount}</span>
                <span className="text-white/75">Interested</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
