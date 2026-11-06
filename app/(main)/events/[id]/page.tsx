import { getEventById } from "@/database/queries/event.query";
import { Heart, Users } from "lucide-react";
import { notFound } from "next/navigation";
import EventDetailHero from "./components/EventDetailHero";
import EventOrganizer from "./components/EventOrganizer";
import EventOverview from "./components/EventOverview";
import ParticipantList from "./components/EventParticipants";
import EventParticipation from "./components/EventParticipation";

export default async function EventDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const event = await getEventById(id);

  if (!event) {
    return notFound();
  }

  const { interestedUsers, goingUsers, ...eventData } = event;

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      {/* Event Detail Hero */}
      <EventDetailHero event={eventData} />

      {/* Event Content */}
      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-5">
          {/* Event Overview */}
          <EventOverview event={eventData} />

          {/* Show organizer and participation inline on smaller screens */}
          <div className="space-y-5 lg:hidden">
            <EventOrganizer
              organizer={eventData.organizer}
              isOwner={eventData.isOwner}
              isFollowing={eventData.isFollowing}
            />

            <EventParticipation event={eventData} />
          </div>

          {/* Event Participants */}
          <div className="space-y-5">
            <ParticipantList
              title="Going"
              description="People who are attending this event."
              participants={goingUsers}
              currentUserId={event.currentUserId}
              icon={Users}
              emptyTitle="No attendees yet"
              emptyDescription="People joining this event will appear here."
            />

            <ParticipantList
              title="Interested"
              description="People who are interested in this event."
              participants={interestedUsers}
              currentUserId={event.currentUserId}
              icon={Heart}
              emptyTitle="No interested people yet"
              emptyDescription="People interested in this event will appear here."
            />
          </div>
        </div>

        {/* Keep organizer and participation sticky in desktop sidebar */}
        <aside className="hidden lg:sticky lg:top-24 lg:block lg:self-start">
          <div className="space-y-5">
            <EventOrganizer
              organizer={eventData.organizer}
              isOwner={eventData.isOwner}
              isFollowing={eventData.isFollowing}
            />

            <EventParticipation event={eventData} />
          </div>
        </aside>
      </div>
    </div>
  );
}
