import { Skeleton } from "@/components/ui/skeleton";

export default function BloodRequestsLoading() {
  return (
    <div className="min-h-screen bg-app-background mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <section className="mb-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-3">
            <Skeleton className="h-4 w-28" />

            <Skeleton className="h-8 w-72 sm:h-9 sm:w-96" />

            <Skeleton className="h-4 w-[280px] sm:w-[430px]" />
          </div>

          <Skeleton className="h-16 w-28 rounded-lg" />
        </div>
      </section>

      {/* Filters */}
      <section className="mb-7">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      </section>

      {/* Section heading */}
      <div className="mb-4 flex items-center justify-between">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-20" />
      </div>

      {/* Cards */}
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <BloodRequestCardSkeleton key={index} />
        ))}
      </section>
    </div>
  );
}

function BloodRequestCardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      {/* User */}
      <div className="flex items-center gap-3">
        <Skeleton className="size-10 rounded-full" />

        <div className="space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-3 w-20" />
        </div>

        <Skeleton className="ml-auto h-7 w-20 rounded-full" />
      </div>

      {/* Blood details */}
      <div className="mt-5 grid grid-cols-3 gap-3">
        <Skeleton className="h-20 rounded-lg" />
        <Skeleton className="h-20 rounded-lg" />
        <Skeleton className="h-20 rounded-lg" />
      </div>

      {/* Main information */}
      <div className="mt-5 space-y-3">
        <div className="flex items-center gap-3">
          <Skeleton className="size-4 rounded" />
          <Skeleton className="h-4 w-40" />
        </div>

        <div className="flex items-center gap-3">
          <Skeleton className="size-4 rounded" />
          <Skeleton className="h-4 w-48" />
        </div>

        <div className="flex items-center gap-3">
          <Skeleton className="size-4 rounded" />
          <Skeleton className="h-4 w-36" />
        </div>
      </div>

      {/* Footer */}
      <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-9 w-24 rounded-md" />
      </div>
    </div>
  );
}
