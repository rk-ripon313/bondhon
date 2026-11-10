import EventCard from "@/components/events/card/EventCard";
import Section from "@/components/layout/Section";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { getEvents } from "@/database/queries/event.query";
import { GetEventsParams } from "@/types/event.type";

export default async function RecentEvents({
  lat,
  lng,
}: Pick<GetEventsParams, "lat" | "lng">) {
  const { events } = await getEvents({
    status: "upcoming",
    sort: "soonest",
    page: 1,
    itemsPerPage: 6,
    lat,
    lng,
  });

  // Don't render an empty section on the homepage
  if (!events.length) return null;

  return (
    <Section
      title="Upcoming Events"
      description="Discover what's happening in your community."
      headerClassName="text-left [&_p]:mx-0"
      link="/events"
      linkText="See all"
    >
      <Carousel opts={{ align: "start" }} className="w-full">
        <CarouselContent className="-ml-4">
          {events.map((event) => (
            <CarouselItem
              key={event.id}
              className="pl-4 basis-[85%] sm:basis-1/2 lg:basis-1/3"
            >
              <EventCard event={event} />
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="cursor-pointer -left-3 size-10 rounded-full border-border/80 bg-app-card text-app-foreground shadow-md transition-all hover:scale-105 hover:bg-app-primary hover:text-white disabled:opacity-0 lg:-left-5" />

        <CarouselNext className="cursor-pointer -right-3 size-10 rounded-full border-border/80 bg-app-card text-app-foreground shadow-md transition-all hover:scale-105 hover:bg-app-primary hover:text-white disabled:opacity-0 lg:-right-5" />
      </Carousel>
    </Section>
  );
}
