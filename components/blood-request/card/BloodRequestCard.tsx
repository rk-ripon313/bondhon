"use client";

import { Building2, Clock3, MapPin } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDateTime, getTimeAgo } from "@/lib/helpers/date";
import { formatLocation } from "@/lib/helpers/location-format";
import { getStatusStyles, getUrgencyStyles } from "@/lib/helpers/status";
import { BloodRequestCardData } from "@/types/blood-request.type";
import Link from "next/link";
import BloodRequestActions from "./BloodRequestActions";
import BloodRequestCardFooter from "./BloodRequestCardFooter";

export default function BloodRequestCard({
  request,
}: {
  request: BloodRequestCardData;
}) {
  const requesterName = request.requester?.name || "Unknown User";

  const effectiveStatus =
    new Date(request.neededBefore) <= new Date() ? "expired" : request.status;

  const statusStyles = getStatusStyles(effectiveStatus);

  const urgencyStyles = getUrgencyStyles(request.urgency);

  const locationText = formatLocation(request.location);

  return (
    <article className="group overflow-hidden rounded-2xl border border-border/60 bg-app-card shadow-sm transition-shadow hover:shadow-md">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 px-5 pt-5 sm:px-6 sm:pt-6">
        <div className="flex min-w-0 items-center gap-3">
          <Link href={`/user/${request.requester.username}`}>
            <Avatar className="size-10 shrink-0 border border-border/60 sm:size-11">
              <AvatarImage src={request.requester?.image} alt={requesterName} />

              <AvatarFallback className="bg-app-secondary/10 text-sm font-semibold text-app-secondary">
                {requesterName?.at(0)?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>{" "}
          </Link>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="truncate text-sm font-semibold text-app-foreground">
                {requesterName}
              </p>
            </div>

            <div className="mt-0.5 text-xs text-muted-foreground">
              <span>{getTimeAgo(request.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Status + actions dropdown */}
        <div className="flex shrink-0 items-center gap-1.5">
          <div
            className={`flex items-center gap-1.5 text-xs font-medium ${statusStyles.text}`}
            title={`Status: ${statusStyles.label}`}
          >
            <span
              className={`size-1.5 rounded-full ${statusStyles.dot}`}
              aria-hidden="true"
            />

            <span className="hidden sm:inline">{statusStyles.label}</span>
          </div>

          {/* Actions dropdown */}
          <BloodRequestActions request={request} />
        </div>
      </div>

      {/* Main Content */}
      <div className="px-5 pb-5 pt-5 sm:px-6 sm:pb-6">
        {/* Request Details */}
        <div className="rounded-xl border border-border/50 bg-muted/20 px-3 py-3 sm:px-4 sm:py-3.5">
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Blood */}
            <div className="flex min-w-0 flex-1 items-center gap-2.5 sm:gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-app-primary/10 text-base font-bold text-app-primary ring-1 ring-app-primary/15 sm:size-12 sm:rounded-xl sm:text-xl">
                {request.bloodGroupNeeded}
              </div>

              <div className="min-w-0">
                <p className="text-[9px] font-medium uppercase tracking-wide text-muted-foreground sm:text-[10px]">
                  Blood Needed
                </p>

                <p className="mt-0.5 truncate text-xs font-semibold text-app-foreground sm:text-sm">
                  {request.quantity} {request.quantity === 1 ? "bag" : "bags"}
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="h-10 w-px shrink-0 bg-border/70" />

            {/* Urgency */}
            {/* Urgency */}
            <div className="shrink-0 text-right">
              <p className="text-[9px] font-medium uppercase tracking-wide text-muted-foreground sm:text-[10px]">
                Urgency
              </p>

              <p
                className={`mt-0.5 text-[10px] font-bold uppercase tracking-wide sm:text-xs ${urgencyStyles.text}`}
              >
                {urgencyStyles.label}
              </p>
            </div>
          </div>
        </div>
        {/* Needed Before Hospital & Location */}
        <div className="mt-4 space-y-3">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted/60">
              <Clock3 className="h-4 w-4 shrink-0 text-primary/70" />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                Needed Before
              </p>
              <p className="mt-0.5 truncate text-sm font-medium text-app-foreground">
                {formatDateTime(request.neededBefore)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted/60">
              <MapPin className="h-4 w-4 shrink-0 text-primary/70" />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                Location
              </p>

              <p className="mt-0.5 truncate text-sm font-medium text-app-foreground">
                {locationText}
              </p>
            </div>
          </div>

          {request.hospitalName && (
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted/60">
                <Building2 className="h-4 w-4 shrink-0 text-primary/70" />
              </div>

              <div className="min-w-0">
                <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                  Hospital
                </p>

                <p className="mt-0.5 truncate text-sm font-medium text-app-foreground">
                  {request.hospitalName}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <BloodRequestCardFooter request={request} />
    </article>
  );
}
