import { Skeleton } from "@/components/ui/skeleton";

function FilterSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-app-card p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Skeleton className="h-10 w-full sm:flex-1 sm:min-w-48" />
        <Skeleton className="h-10 w-full sm:w-36" />
        <Skeleton className="h-10 w-full sm:w-36" />
        <Skeleton className="h-10 w-full sm:w-36" />
        <Skeleton className="h-10 w-full sm:w-24" />
      </div>
    </div>
  );
}

function DonorCardSkeleton() {
  return (
    <div className="space-y-4 rounded-2xl border border-border bg-app-card p-4 sm:p-5">
      {/* Donor info */}
      <div className="flex items-center gap-3">
        <Skeleton className="size-12 shrink-0 rounded-full" />

        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-4 w-32 max-w-full" />
          <Skeleton className="h-3 w-24 max-w-full" />
        </div>

        <Skeleton className="h-6 w-12 shrink-0 rounded-full" />
      </div>

      {/* Donor details */}
      <div className="space-y-3 border-t border-border/60 pt-4">
        <div className="flex items-center gap-2">
          <Skeleton className="size-4 shrink-0 rounded" />
          <Skeleton className="h-3 w-36 max-w-full" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="size-4 shrink-0 rounded" />
          <Skeleton className="h-3 w-44 max-w-full" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="size-4 shrink-0 rounded" />
          <Skeleton className="h-3 w-28 max-w-full" />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 border-t border-border/60 pt-4">
        <Skeleton className="h-9 flex-1 rounded-lg" />
        <Skeleton className="h-9 flex-1 rounded-lg" />
        <Skeleton className="h-9 flex-1 rounded-lg" />
      </div>
    </div>
  );
}

function DonorGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 9 }, (_, index) => (
        <DonorCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function VerifiedDonorsSkeleton() {
  return (
    <div className="space-y-6">
      <FilterSkeleton />

      <div className="flex items-end justify-between gap-3">
        <div className="space-y-2">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-4 w-56 max-w-full" />
        </div>
        <Skeleton className="h-4 w-16 shrink-0" />
      </div>

      <DonorGridSkeleton />
    </div>
  );
}

export function CommunityDonorsSkeleton() {
  return (
    <div className="space-y-6">
      <FilterSkeleton />

      <div className="flex items-end justify-between gap-3">
        <div className="space-y-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-60 max-w-full" />
        </div>
        <Skeleton className="h-4 w-16 shrink-0" />
      </div>

      <DonorGridSkeleton />
    </div>
  );
}

export function DonorsPageSkeleton() {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 md:px-6 md:py-8">
      {/* Page heading */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-44 max-w-full" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </div>

      {/* Tabs */}
      <Skeleton className="h-11 w-full rounded-xl sm:w-80" />

      <VerifiedDonorsSkeleton />
    </div>
  );
}
