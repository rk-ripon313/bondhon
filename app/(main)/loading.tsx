function Skeleton({ className }: { className: string }) {
  return (
    <div className={`animate-pulse rounded-lg bg-app-muted ${className}`} />
  );
}

export default function MainLoading() {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <div className="space-y-3">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-5">
          <div className="rounded-xl border border-border bg-app-card p-4 sm:p-5">
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <Skeleton className="h-9" />
                <Skeleton className="h-9" />
                <Skeleton className="col-span-2 h-9 sm:col-span-1" />
              </div>
            </div>
          </div>

          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="rounded-xl border border-border bg-app-card p-4 sm:p-5"
            >
              <div className="flex items-center gap-3">
                <Skeleton className="size-10 shrink-0 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3.5 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-5/6" />
              </div>

              <div className="mt-5 flex gap-3">
                <Skeleton className="h-9 flex-1" />
                <Skeleton className="h-9 flex-1" />
              </div>
            </div>
          ))}
        </div>

        <aside className="hidden space-y-5 lg:block">
          <div className="rounded-xl border border-border bg-app-card p-5">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="mt-5 h-28 w-full" />
          </div>
          <div className="rounded-xl border border-border bg-app-card p-5">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="mt-5 h-10 w-full" />
            <Skeleton className="mt-3 h-10 w-full" />
          </div>
        </aside>
      </div>
    </div>
  );
}
