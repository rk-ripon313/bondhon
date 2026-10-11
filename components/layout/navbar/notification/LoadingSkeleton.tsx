export default function LoadingSkeleton() {
  return (
    <div className="divide-y divide-border/50">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="flex animate-pulse gap-3 px-4 py-3.5 bg-app-card"
        >
          <div className="size-11 shrink-0 rounded-full bg-muted" />

          <div className="flex-1 space-y-2 pt-1">
            <div className="h-3 w-3/4 rounded bg-muted" />
            <div className="h-3 w-full rounded bg-muted" />
            <div className="h-2.5 w-16 rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}
