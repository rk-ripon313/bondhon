import { Skeleton } from "@/components/ui/skeleton";

function ParticipantSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-app-card">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border px-5 py-4 sm:px-6">
        <Skeleton className="size-9 rounded-xl" />

        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-48 max-w-full" />
        </div>
      </div>

      {/* Participant Rows */}
      <div className="divide-y divide-border">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center gap-3 px-5 py-3.5 sm:px-6"
          >
            <Skeleton className="size-10 shrink-0 rounded-full" />

            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-3.5 w-28 max-w-full" />
              <Skeleton className="h-3 w-20" />
            </div>

            <div className="flex shrink-0 items-center gap-1.5">
              <Skeleton className="size-8 rounded-md" />
              <Skeleton className="size-8 rounded-md" />
              <Skeleton className="size-8 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EventOrganizerSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-app-card p-5">
      <Skeleton className="mb-5 h-4 w-28" />

      <div className="flex items-center gap-3">
        <Skeleton className="size-12 shrink-0 rounded-full" />

        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-4 w-32 max-w-full" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2">
        <Skeleton className="h-9 rounded-lg" />
        <Skeleton className="h-9 rounded-lg" />
      </div>
    </div>
  );
}

function EventParticipationSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-app-card p-5">
      <Skeleton className="h-4 w-36" />
      <Skeleton className="mt-2 h-3 w-52 max-w-full" />

      <div className="mt-4 grid grid-cols-2 gap-2">
        <Skeleton className="h-9 rounded-lg" />
        <Skeleton className="h-9 rounded-lg" />
      </div>
    </div>
  );
}

export default function EventDetailsLoading() {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      {/* Event Hero */}
      <div className="relative overflow-hidden rounded-2xl border border-border">
        <Skeleton className="aspect-[16/10] w-full sm:aspect-[16/9] lg:aspect-[2.4/1]" />

        <div className="absolute inset-x-0 bottom-0 space-y-4 p-5 sm:p-8">
          <Skeleton className="h-7 w-24 rounded-full" />
          <Skeleton className="h-7 w-3/4 max-w-lg sm:h-9" />

          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-8 w-36 rounded-lg" />
            <Skeleton className="h-8 w-40 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Event Content */}
      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-5">
          {/* Overview */}
          <div className="rounded-2xl border border-border bg-app-card p-5 sm:p-6">
            <Skeleton className="h-5 w-36" />

            <div className="mt-5 space-y-3">
              <Skeleton className="h-3.5 w-full" />
              <Skeleton className="h-3.5 w-full" />
              <Skeleton className="h-3.5 w-4/5" />
              <Skeleton className="h-3.5 w-2/3" />
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <Skeleton className="h-7 w-20 rounded-full" />
              <Skeleton className="h-7 w-24 rounded-full" />
              <Skeleton className="h-7 w-16 rounded-full" />
            </div>
          </div>

          {/* Mobile Organizer and Participation */}
          <div className="space-y-5 lg:hidden">
            <EventOrganizerSkeleton />
            <EventParticipationSkeleton />
          </div>

          {/* Participants */}
          <ParticipantSkeleton />
          <ParticipantSkeleton />
        </div>

        {/* Desktop Sidebar */}
        <aside className="hidden space-y-5 lg:block">
          <EventOrganizerSkeleton />
          <EventParticipationSkeleton />
        </aside>
      </div>
    </div>
  );
}
