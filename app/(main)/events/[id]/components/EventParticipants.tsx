import type { LucideIcon } from "lucide-react";

import EmptyState from "@/components/shared/EmptyState";
import { EventDetailParticipant } from "@/types/event.type";
import EventParticipant from "./EventParticipant";

interface ParticipantListProps {
  title: string;
  description: string;
  participants: EventDetailParticipant[];
  currentUserId?: string;
  icon: LucideIcon;
  emptyTitle: string;
  emptyDescription: string;
}

export default function EventParticipants({
  title,
  description,
  participants,
  icon: Icon,
  emptyTitle,
  emptyDescription,
}: ParticipantListProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-app-card">
      {/* Header */}
      <div className="border-b border-border px-5 py-4 sm:px-6">
        <div className="flex items-start gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-app-primary/10">
            <Icon className="size-4 text-app-primary" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="font-semibold">{title}</h2>
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                {participants.length}
              </span>
            </div>

            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </div>

      {/* Participants */}
      {participants.length === 0 ? (
        <EmptyState
          icon={Icon}
          title={emptyTitle}
          description={emptyDescription}
        />
      ) : (
        <div className="max-h-[400px] divide-y divide-border overflow-y-auto custom-scrollbar">
          {participants.map((participant) => (
            <EventParticipant key={participant.id} participant={participant} />
          ))}
        </div>
      )}
    </section>
  );
}
