import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen w-full bg-app-background px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-9 w-28 rounded-lg" />
        <Skeleton className="h-9 w-9 rounded-lg" />
      </div>

      {/* Hero */}
      <div className="mt-5 rounded-2xl border border-border bg-app-card p-5 sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-3">
            <div className="flex gap-2">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>

            <Skeleton className="h-8 w-64 max-w-full" />
            <Skeleton className="h-4 w-48 max-w-full" />
          </div>

          <Skeleton className="h-10 w-24 rounded-lg" />
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-5">
          {/* Request Info */}
          <div className="rounded-2xl border border-border bg-app-card p-5 sm:p-6">
            <Skeleton className="h-6 w-32" />

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Skeleton className="size-9 shrink-0 rounded-lg" />

                  <div className="min-w-0 space-y-2">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile requester/actions */}
          <div className="space-y-4 lg:hidden">
            <RequesterSkeleton />
            <ActionsSkeleton />
          </div>

          {/* Interested Donors */}
          <DonorListSkeleton />

          {/* Assigned Donors */}
          <DonorListSkeleton />
        </div>

        {/* Desktop sidebar */}
        <aside className="hidden lg:block">
          <div className="space-y-4">
            <RequesterSkeleton />
            <ActionsSkeleton />
          </div>
        </aside>
      </div>
    </div>
  );
}

function RequesterSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-app-card p-5">
      <div className="flex items-center gap-3">
        <Skeleton className="size-12 rounded-full" />

        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-3 w-36" />
        </div>
      </div>

      <Skeleton className="mt-4 h-10 w-full rounded-lg" />
    </div>
  );
}

function ActionsSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-app-card p-4">
      <div className="flex gap-2">
        <Skeleton className="h-9 flex-1 rounded-lg" />
        <Skeleton className="h-9 flex-1 rounded-lg" />
      </div>
    </div>
  );
}

function DonorListSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-app-card">
      <div className="border-b border-border px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Skeleton className="size-9 rounded-xl" />

          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48 max-w-[60vw]" />
          </div>
        </div>
      </div>

      <div className="divide-y divide-border">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="px-5 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <Skeleton className="size-10 shrink-0 rounded-full" />

              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-40" />
              </div>

              <div className="hidden gap-2 sm:flex">
                <Skeleton className="size-9 rounded-lg" />
                <Skeleton className="h-9 w-20 rounded-lg" />
                <Skeleton className="h-9 w-20 rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
