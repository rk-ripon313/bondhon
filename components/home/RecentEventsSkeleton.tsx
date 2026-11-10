import Section from "@/components/layout/Section";

export default function RecentEventsSkeleton() {
  return (
    <Section
      title="Upcoming Events"
      description="Discover upcoming events in your community."
      headerClassName="text-left [&_p]:mx-0"
      link="/events"
      linkText="See all"
    >
      <div className="relative">
        <div className="-ml-4 flex overflow-hidden">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="shrink-0 basis-[85%] pl-4 sm:basis-1/2 lg:basis-1/3"
            >
              <div className="overflow-hidden rounded-xl border border-border/70 bg-app-card shadow-sm">
                {/* Thumbnail */}
                <div className="aspect-[16/9] animate-pulse bg-app-muted" />

                <div className="space-y-4 p-4">
                  {/* Category and status */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="h-6 w-20 animate-pulse rounded-full bg-app-muted" />
                    <div className="h-6 w-16 animate-pulse rounded-full bg-app-muted" />
                  </div>

                  {/* Title */}
                  <div className="space-y-2">
                    <div className="h-5 w-full animate-pulse rounded-md bg-app-muted" />
                    <div className="h-5 w-3/4 animate-pulse rounded-md bg-app-muted" />
                  </div>

                  {/* Event details */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="size-8 shrink-0 animate-pulse rounded-lg bg-app-muted" />
                      <div className="h-4 w-36 max-w-full animate-pulse rounded-md bg-app-muted" />
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="size-8 shrink-0 animate-pulse rounded-lg bg-app-muted" />
                      <div className="h-4 w-28 max-w-full animate-pulse rounded-md bg-app-muted" />
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between border-t border-border/60 pt-4">
                    <div className="h-9 w-28 animate-pulse rounded-full bg-app-muted" />
                    <div className="h-9 w-20 animate-pulse rounded-lg bg-app-muted" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
