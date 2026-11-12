type MyActivitySkeletonProps = {
  type: "requests" | "events";
};

function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-md bg-muted/70 ${className}`} />
  );
}

function ActivityFiltersSkeleton({ type }: MyActivitySkeletonProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        {(type === "requests"
          ? ["w-12", "w-24", "w-20"]
          : ["w-12", "w-16", "w-24"]
        ).map((width, index) => (
          <Skeleton key={index} className={`h-9 rounded-lg ${width}`} />
        ))}
      </div>

      <div className="flex items-center gap-2">
        <Skeleton className="h-9 w-28 rounded-lg" />
        <Skeleton className="h-9 w-24 rounded-lg" />
      </div>
    </div>
  );
}

function BloodRequestCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/60 bg-app-card shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 px-5 pt-5 sm:px-6 sm:pt-6">
        <div className="flex min-w-0 items-center gap-3">
          <Skeleton className="size-10 shrink-0 rounded-full sm:size-11" />
          <div className="space-y-2">
            <Skeleton className="h-3.5 w-28" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>

        <Skeleton className="h-5 w-20 shrink-0" />
      </div>

      {/* Details */}
      <div className="px-5 pb-5 pt-5 sm:px-6 sm:pb-6">
        <div className="flex items-center justify-between rounded-xl border border-border/50 bg-muted/20 px-4 py-4">
          <div className="flex items-center gap-3">
            <Skeleton className="size-11 rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-2.5 w-20" />
              <Skeleton className="h-3.5 w-16" />
            </div>
          </div>

          <div className="space-y-2 text-right">
            <Skeleton className="ml-auto h-2.5 w-12" />
            <Skeleton className="ml-auto h-3.5 w-16" />
          </div>
        </div>

        {/* Date, Location, Hospital */}
        <div className="mt-4 space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex items-center gap-3">
              <Skeleton className="size-8 shrink-0 rounded-lg" />
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-2.5 w-20" />
                <Skeleton className="h-3.5 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-border/60 px-5 py-4 sm:px-6">
        <Skeleton className="h-8 w-24 rounded-lg" />
        <Skeleton className="h-9 w-28 rounded-lg" />
      </div>
    </div>
  );
}

function EventCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/70 bg-app-card shadow-sm">
      {/* Thumbnail */}
      <Skeleton className="aspect-[16/9] w-full rounded-none" />

      <div className="space-y-3 p-4">
        {/* Title and Description */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-4/5" />
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-2/3" />
        </div>

        {/* Date, Time, Location */}
        <div className="space-y-3 py-1">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex items-center gap-2">
              <Skeleton className="size-4 shrink-0 rounded" />
              <Skeleton className="h-3.5 w-3/4" />
            </div>
          ))}
        </div>

        {/* Organizer */}
        <div className="flex items-center gap-2 border-t border-border/60 pt-3">
          <Skeleton className="size-8 shrink-0 rounded-full" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
          <Skeleton className="size-8 rounded-lg" />
        </div>

        {/* Participation */}
        <div className="flex items-center gap-2 border-t border-border/60 pt-3">
          <Skeleton className="h-9 flex-1 rounded-lg" />
          <Skeleton className="h-9 flex-1 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export default function MyActivitySkeleton({ type }: MyActivitySkeletonProps) {
  return (
    <div className="space-y-5 sm:space-y-6">
      <ActivityFiltersSkeleton type={type} />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index}>
            {type === "requests" ? (
              <BloodRequestCardSkeleton />
            ) : (
              <EventCardSkeleton />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
