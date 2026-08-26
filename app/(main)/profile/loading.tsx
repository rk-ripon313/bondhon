import { Skeleton } from "@/components/ui/skeleton";

function ProfileHeroSkeleton() {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-border bg-app-card p-5 shadow-sm sm:p-6">
      <div className="flex flex-col items-center justify-between gap-6 md:flex-row md:items-start">
        {/* Avatar + Meta */}
        <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
          <Skeleton className="h-24 w-24 shrink-0 rounded-2xl sm:h-28 sm:w-28" />

          <div className="space-y-3">
            <Skeleton className="h-6 w-40 sm:h-7 sm:w-48" />
            <Skeleton className="h-4 w-52" />

            <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
              <Skeleton className="h-8 w-32 rounded-lg" />
              <Skeleton className="h-8 w-16 rounded-lg" />
            </div>
          </div>
        </div>

        {/* Donor Availability */}
        <div className="flex w-full items-center justify-between gap-5 rounded-xl border border-border bg-app-background p-4 sm:w-auto sm:min-w-[220px]">
          <div className="space-y-2">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-3 w-24" />
          </div>

          <Skeleton className="h-5 w-9 rounded-full" />
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-3 divide-x divide-border rounded-xl border border-border bg-app-background p-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="flex flex-col items-center gap-2 px-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-5 w-8" />
          </div>
        ))}
      </div>

      {/* Profile Completion */}
      <div className="mt-6 border-t border-border pt-5">
        <div className="mb-2 flex items-center justify-between">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-3 w-10" />
        </div>

        <Skeleton className="h-2 w-full rounded-full" />

        <Skeleton className="mt-3 h-3 w-72 max-w-full" />
      </div>
    </div>
  );
}

function ProfileCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-app-card p-5 shadow-sm sm:p-6">
      <Skeleton className="h-5 w-36" />

      <div className="mt-5 space-y-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="flex items-center justify-between gap-4">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-4 w-32" />
          </div>
        ))}
      </div>
    </div>
  );
}

function LocationSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-app-card p-5 shadow-sm sm:p-6">
      <Skeleton className="h-5 w-28" />

      <div className="mt-5 space-y-4">
        <Skeleton className="h-10 w-full rounded-xl" />
        <Skeleton className="h-10 w-full rounded-xl" />
      </div>
    </div>
  );
}

function ActivitySkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-app-card p-5 shadow-sm sm:p-6">
      <div className="flex items-center gap-4 border-b border-border pb-4">
        <Skeleton className="h-9 w-24 rounded-lg" />
        <Skeleton className="h-9 w-24 rounded-lg" />
        <Skeleton className="h-9 w-24 rounded-lg" />
      </div>

      <div className="mt-5 space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-3 w-52 max-w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ProfileLoading() {
  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 md:px-6">
      <div className="space-y-6">
        {/* Profile Hero */}
        <ProfileHeroSkeleton />

        {/* Profile Information */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <ProfileCardSkeleton />
          <ProfileCardSkeleton />
        </div>

        {/* Location */}
        <LocationSkeleton />

        {/* User Activity */}
        <ActivitySkeleton />
      </div>
    </section>
  );
}
