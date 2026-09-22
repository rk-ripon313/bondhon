import { CalendarDays, Hospital, MapPin, UserCheck } from "lucide-react";

import { formatDateTime } from "@/lib/helpers/date";
import { formatLocation } from "@/lib/helpers/location-format";
import { getStatusStyles, getUrgencyStyles } from "@/lib/helpers/status";
import { BloodRequestCardData } from "@/types/blood-request.type";

export function BloodRequestHero({
  request,
}: {
  request: BloodRequestCardData;
}) {
  const statusStyles = getStatusStyles(request.status);
  const urgencyStyles = getUrgencyStyles(request.urgency);

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-app-card p-5 sm:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        {/* Request summary */}
        <div className="flex min-w-0 gap-4">
          <div className="flex size-20 shrink-0 flex-col items-center justify-center rounded-2xl bg-app-primary/10 ring-1 ring-inset ring-app-primary/15 sm:size-24">
            <span className="text-2xl font-bold leading-none text-app-primary sm:text-3xl">
              {request.bloodGroupNeeded}
            </span>

            <span className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {request.quantity} {request.quantity === 1 ? "bag" : "bags"}
            </span>
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full border px-2.5 py-1 text-xs font-medium ${statusStyles.badge} ${statusStyles.text}`}
              >
                {statusStyles.label}
              </span>

              <span
                className={`rounded-full border px-2.5 py-1 text-xs font-medium capitalize ${urgencyStyles}`}
              >
                {request.urgency}
              </span>

              {request.assignedCount > 0 && (
                <span className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/50 px-2.5 py-1 text-xs font-medium text-muted-foreground">
                  <UserCheck className="size-3.5" />
                  {request.assignedCount} assigned
                </span>
              )}
            </div>

            <h1 className="mt-3 text-xl font-bold tracking-tight sm:text-2xl">
              {request.bloodGroupNeeded} blood needed
            </h1>

            {request.hospitalName && (
              <p className="mt-1.5 flex items-start gap-2 text-sm text-muted-foreground">
                <Hospital className="mt-0.5 size-4 shrink-0" />
                <span className="line-clamp-2">{request.hospitalName}</span>
              </p>
            )}
          </div>
        </div>

        {/* Summary info */}
        <div className="flex justify-between gap-4 sm:justify-start">
          <div className="flex min-w-0 items-center gap-3 rounded-xl border border-border bg-muted/30 px-3 py-2.5">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-background text-muted-foreground [&>svg]:size-4">
              <MapPin />
            </span>

            <div className="min-w-0">
              <p className="text-[11px] text-muted-foreground">Location</p>

              <p className="truncate text-sm font-medium">
                {formatLocation(request.location)}
              </p>
            </div>
          </div>

          <div className="flex min-w-0 items-center gap-3 rounded-xl border border-border bg-muted/30 px-3 py-2.5">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-background text-muted-foreground [&>svg]:size-4">
              <CalendarDays />
            </span>

            <div className="min-w-0">
              <p className="text-[11px] text-muted-foreground">
                Needed before{" "}
              </p>

              <p className="truncate text-sm font-medium">
                {formatDateTime(request.neededBefore)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
