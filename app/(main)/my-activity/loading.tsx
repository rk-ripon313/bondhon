import MyActivitySkeleton from "./components/MyActivitySkeleton";

export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      {/* Header */}
      <header className="space-y-2">
        <div className="h-7 w-36 animate-pulse rounded-md bg-muted/70" />
        <div className="h-4 w-72 max-w-full animate-pulse rounded-md bg-muted/70" />
      </header>

      {/* Tabs */}
      <div className="flex w-fit items-center gap-1 rounded-xl border border-border/60 bg-app-background p-1">
        <div className="h-10 w-32 animate-pulse rounded-lg bg-muted/70 sm:w-40" />
        <div className="h-10 w-20 animate-pulse rounded-lg bg-muted/70 sm:w-28" />
      </div>

      {/* Default Tab Content */}
      <MyActivitySkeleton type="requests" />
    </div>
  );
}
