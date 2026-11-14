function SettingsCardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-app-card p-4 sm:p-5">
      <div className="flex items-center gap-3">
        <div className="size-9 animate-pulse rounded-lg bg-app-background" />

        <div className="flex-1 space-y-2">
          <div className="h-4 w-36 animate-pulse rounded bg-app-background" />
          <div className="h-3 w-52 max-w-full animate-pulse rounded bg-app-background" />
        </div>
      </div>

      <div className="mt-5 space-y-3">
        <div className="h-11 animate-pulse rounded-lg bg-app-background" />
        <div className="h-11 animate-pulse rounded-lg bg-app-background" />
      </div>
    </div>
  );
}

export default function SettingsLoading() {
  return (
    <div className="space-y-5">
      {/* Page heading */}
      <div className="space-y-2">
        <div className="h-6 w-44 animate-pulse rounded bg-app-background" />
        <div className="h-4 w-64 max-w-full animate-pulse rounded bg-app-background" />
      </div>

      {/* Settings content */}
      <div className="space-y-4">
        <SettingsCardSkeleton />
        <SettingsCardSkeleton />
      </div>
    </div>
  );
}
