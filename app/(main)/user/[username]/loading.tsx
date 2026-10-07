import { Skeleton } from "@/components/ui/skeleton";

export default function UserProfileLoading() {
  return (
    <div className="min-h-screen w-full bg-app-background px-4 pt-4 pb-6 md:px-6 md:pt-5 md:pb-7">
      <div className="mx-auto w-full max-w-7xl space-y-5">
        {/* Profile Hero */}
        <div className="rounded-xl border border-border/60 bg-app-card p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              {/* Avatar */}
              <Skeleton className="size-20 shrink-0 rounded-full sm:size-24" />

              {/* Profile Info */}
              <div className="min-w-0 space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-32 sm:h-7 sm:w-40" />
                  <Skeleton className="h-5 w-20 rounded-full" />
                </div>

                <Skeleton className="h-4 w-24" />

                <div className="flex items-center gap-2 pt-1">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-1" />
                  <Skeleton className="h-5 w-12 rounded-md" />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 lg:pt-1">
              <Skeleton className="h-9 w-24 rounded-md" />
              <Skeleton className="h-9 w-24 rounded-md" />
              <Skeleton className="size-9 rounded-md" />
            </div>
          </div>

          {/* Separator */}
          <div className="my-5 h-px w-full bg-border/60" />

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 sm:justify-start sm:gap-12">
            <div className="space-y-1 text-center">
              <Skeleton className="mx-auto h-5 w-8" />
              <Skeleton className="h-3 w-16" />
            </div>

            <div className="space-y-1 text-center">
              <Skeleton className="mx-auto h-5 w-8" />
              <Skeleton className="h-3 w-16" />
            </div>

            <div className="space-y-1 text-center">
              <Skeleton className="mx-auto h-5 w-8" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        </div>

        {/* Activity + Sidebar */}
        <section className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
          {/* Activity */}
          <div className="rounded-xl border border-border/60 bg-app-card p-4 shadow-sm sm:p-5">
            {/* Tabs + Filter */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex min-w-0 gap-1 rounded-xl border border-border/60 bg-app-background p-1">
                <Skeleton className="h-8 w-20 rounded-lg sm:w-32" />
                <Skeleton className="h-8 w-16 rounded-lg sm:w-28" />
              </div>

              <Skeleton className="size-9 shrink-0 rounded-lg" />
            </div>

            {/* Request Cards */}
            <div className="mt-5 space-y-3">
              <Skeleton className="h-32 w-full rounded-xl" />
              <Skeleton className="h-32 w-full rounded-xl" />
              <Skeleton className="h-32 w-full rounded-xl" />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div className="rounded-xl border border-border/60 bg-app-card p-5 shadow-sm">
              <Skeleton className="h-5 w-28" />

              <div className="mt-4 space-y-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="size-9 rounded-lg" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Skeleton className="size-9 rounded-lg" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-4 w-28" />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Skeleton className="size-9 rounded-lg" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
