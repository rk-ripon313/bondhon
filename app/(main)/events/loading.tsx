import { Skeleton } from "@/components/ui/skeleton";

export default function EventsLoading() {
  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        {/* Header */}
        <section className="mb-7">
          <div className="space-y-3">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-8 w-72 sm:h-9 sm:w-96" />
            <Skeleton className="h-4 w-[280px] max-w-full sm:w-[430px]" />
          </div>
        </section>

        {/* Filters */}
        <section className="mb-7">
          <div className="rounded-xl border border-border bg-app-card p-4">
            <div className="space-y-4">
              {/* Search */}
              <Skeleton className="h-10 w-full" />

              {/* Location, Category, Status and Sort */}
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <Skeleton key={index} className="h-10 w-full" />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section heading */}
        <div className="mb-5 space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>

        {/* Event Cards */}
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <EventCardSkeleton key={index} />
          ))}
        </section>

        {/* Pagination */}
        <div className="mt-8 flex justify-center gap-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="size-9 rounded-md" />
          ))}
        </div>
      </div>
    </div>
  );
}

function EventCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-border/70 bg-app-card shadow-sm">
      {/* Thumbnail + Status */}
      <div className="relative aspect-[16/9] bg-app-muted">
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3">
          <Skeleton className="h-7 w-20 rounded-full" />
          <Skeleton className="size-8 rounded-full" />
        </div>
      </div>

      <div className="space-y-3 p-4">
        {/* Title + Description */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </div>

        {/* Date, Time and Location */}
        <div className="space-y-3 py-1">
          <div className="flex items-center gap-2">
            <Skeleton className="size-4 shrink-0 rounded" />
            <Skeleton className="h-4 w-40" />
          </div>

          <div className="flex items-center gap-2">
            <Skeleton className="size-4 shrink-0 rounded" />
            <Skeleton className="h-4 w-28" />
          </div>

          <div className="flex items-center gap-2">
            <Skeleton className="size-4 shrink-0 rounded" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>

        {/* Organizer */}
        <div className="flex items-center gap-2 border-t border-border/60 pt-3">
          <Skeleton className="size-8 shrink-0 rounded-full" />

          <div className="min-w-0 flex-1 space-y-1.5">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-20" />
          </div>

          <Skeleton className="h-8 w-24 rounded-md" />
        </div>

        {/* Participation */}
        <div className="flex items-center gap-2 border-t border-border/60 pt-3">
          <Skeleton className="h-9 flex-1 rounded-md" />
          <Skeleton className="h-9 flex-1 rounded-md" />
        </div>
      </div>
    </div>
  );
}
