import Section from "@/components/layout/Section";

export default function RecentBloodRequestsSkeleton() {
  return (
    <Section
      title="Recent Blood Requests"
      description="People who need your help right now."
      headerClassName="text-left [&_p]:mx-0"
      link="/blood-requests"
      linkText="See all"
    >
      <div className="relative">
        <div className="-ml-4 flex overflow-hidden">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="shrink-0 basis-[85%] pl-4 sm:basis-1/2 lg:basis-1/3"
            >
              <div className="h-full overflow-hidden rounded-xl border border-border/70 bg-app-card p-4 shadow-sm">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <div className="size-11 shrink-0 animate-pulse rounded-full bg-app-muted" />

                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="h-4 w-28 max-w-full animate-pulse rounded-md bg-app-muted" />
                      <div className="h-3 w-20 animate-pulse rounded-md bg-app-muted" />
                    </div>
                  </div>

                  <div className="h-6 w-14 shrink-0 animate-pulse rounded-full bg-app-muted" />
                </div>

                {/* Request details */}
                <div className="mt-5 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="size-8 shrink-0 animate-pulse rounded-lg bg-app-muted" />
                    <div className="h-5 w-16 animate-pulse rounded-md bg-app-muted" />
                    <div className="h-5 w-12 animate-pulse rounded-md bg-app-muted" />
                  </div>

                  <div className="space-y-2">
                    <div className="h-3.5 w-full animate-pulse rounded-md bg-app-muted" />
                    <div className="h-3.5 w-3/4 animate-pulse rounded-md bg-app-muted" />
                    <div className="h-3.5 w-1/2 animate-pulse rounded-md bg-app-muted" />
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-5 flex items-center justify-between gap-3 border-t border-border/60 pt-4">
                  <div className="h-4 w-24 animate-pulse rounded-md bg-app-muted" />
                  <div className="h-9 w-24 animate-pulse rounded-lg bg-app-muted" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
