import { Activity } from "lucide-react";

import EventCard from "@/components/events/card/EventCard";
import EmptyState from "@/components/shared/EmptyState";
import Pagination from "@/components/shared/Pagination";
import ActivityFilters from "./ActivityFilters";

import { getMyEventActivity } from "@/database/queries/event.query";
import { GetMyEventActivityParams } from "@/types/event.type";

export default async function MyEventActivity({
  eventParams,
}: {
  eventParams: GetMyEventActivityParams;
}) {
  const { events, counts, totalPages } = await getMyEventActivity(eventParams);

  return (
    <div className="space-y-5 sm:space-y-6">
      <ActivityFilters type="events" counts={counts} />

      {events.length > 0 ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>

          <Pagination
            currentPage={eventParams.page}
            totalPages={totalPages}
            pageKey="eventPage"
          />
        </>
      ) : (
        <EmptyState
          icon={Activity}
          title="No matching activity found"
          description="No blood requests match your current filters. Try adjusting your filters to see more results."
        />
      )}
    </div>
  );
}
