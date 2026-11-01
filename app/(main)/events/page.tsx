import { CalendarDays } from "lucide-react";

import { getEvents } from "@/database/queries/event.query";

import EventFilters from "@/components/events/EventFilters";
import EventCard from "@/components/events/card/EventCard";

import EmptyState from "@/components/shared/EmptyState";
import Pagination from "@/components/shared/Pagination";

import LocationInitializer from "@/components/shared/LocationInitializer";
import { GetEventsParams } from "@/types/event.type";

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<GetEventsParams>;
}) {
  const params = await searchParams;

  const currentPage = Number(params.page) || 1;
  const itemsPerPage = 9;

  const { events, totalPages, totalCount } = await getEvents({
    ...params,
    page: currentPage,
    itemsPerPage,
  });

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <LocationInitializer />
      <div className="mx-auto w-full max-w-7xl">
        {/* Header */}
        <section className="mb-7">
          <p className="mb-2 font-heading text-sm font-medium text-primary">
            Community Events
          </p>

          <h1 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
            Discover events around you
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            Explore community activities, join meaningful events and connect
            with people making a difference.
          </p>
        </section>

        {/* Filters */}
        <EventFilters />

        {/* Events */}
        <section>
          {events.length > 0 ? (
            <>
              <div className="mb-5">
                <h2 className="text-base font-semibold">
                  {params.status === "all" ? "All events" : "Upcoming events"}
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  {totalCount} {totalCount === 1 ? "event" : "events"} found
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {events.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>

              <Pagination currentPage={currentPage} totalPages={totalPages} />
            </>
          ) : (
            <EmptyState
              icon={CalendarDays}
              title="No events found"
              description="There are no events matching your search right now. Try changing your filters or check back later for new community events."
            />
          )}
        </section>
      </div>
    </div>
  );
}
