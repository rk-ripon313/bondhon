"use client";

import { Activity, ArrowUpRight, Building2, MapPin, Users } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatDateTime, getTimeAgo } from "@/lib/helpers/date";
import { getStatusStyles } from "@/lib/helpers/status";
import { BloodRequestCardData } from "@/types/blood-request.type";
import Link from "next/link";
import BloodRequestActions from "./BloodRequestActions";

function getUrgencyClass(urgency: string) {
  switch (urgency) {
    case "critical":
      return "text-red-500";
    case "urgent":
      return "text-orange-500";
    default:
      return "text-app-secondary";
  }
}

export default function BloodRequestCard({
  request,
}: {
  request: BloodRequestCardData;
}) {
  const requesterName = request.requester?.name || "Unknown User";
  const statusStyles = getStatusStyles(request.status);

  const locationText = [request.location?.area, request.location?.district]
    .filter(Boolean)
    .join(", ");

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
              className={`size-1.5 rounded-full animate-pulse ${statusStyles.dot}`}
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
          <div className="grid grid-cols-2 gap-x-3 gap-y-3 md:flex md:items-center md:gap-0">
            {/* Blood */}
            <div className="flex min-w-0 items-center gap-2.5 sm:flex-[1.15] sm:gap-3">
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
            <div className="hidden h-10 w-px shrink-0 bg-border/70 sm:mx-4 sm:block" />

            {/* Needed Before */}
            <div className="min-w-0">
              <p className="text-[9px] font-medium uppercase tracking-wide text-muted-foreground sm:text-[10px]">
                Needed Before
              </p>

              <p className="mt-0.5 truncate text-xs font-semibold text-app-foreground sm:text-sm">
                {formatDateTime(request.neededBefore)}
              </p>
            </div>

            {/* Mobile Divider */}
            <div className="col-span-2 h-px w-full bg-border/70 sm:hidden" />

            {/* Urgency */}
            <div className="col-span-2 flex items-center justify-between sm:ml-auto sm:w-[72px] sm:shrink-0 sm:flex-col sm:items-end">
              <p className="text-[9px] font-medium uppercase tracking-wide text-muted-foreground sm:text-[10px]">
                Urgency
              </p>

              <p
                className={`text-[10px] font-bold uppercase tracking-wide sm:mt-0.5 sm:text-xs ${getUrgencyClass(
                  request.urgency,
                )}`}
              >
                {request.urgency}
              </p>
            </div>
          </div>
        </div>

        {/* Hospital & Location */}
        <div className="mt-4 space-y-3">
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
        </div>

        {/* Additional Notes */}
        {request.additionalNotes && (
          <div className="mt-4 border-l-2 border-app-secondary/50 pl-3">
            <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
              {request.additionalNotes}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-border/60 bg-muted/20 px-4 py-3 sm:px-5">
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
          {/* Donors Engagement Stats */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5 font-medium">
              <Users className="h-3.5 w-3.5 text-blue-500" />
              <span>{request.interestedCount} interested</span>
            </div>

            <div className="flex items-center gap-1.5 font-medium">
              <Activity className="h-3.5 w-3.5 text-emerald-500" />
              <span>{request.assignedCount} assigned</span>
            </div>
          </div>

          {/* Action Button */}
          <Link
            href={`/blood-requests/${request.id}`}
            className="self-end sm:self-auto"
          >
            <Button
              variant="ghost"
              size="sm"
              className="h-8 shrink-0 cursor-pointer gap-1.5 px-2.5 text-xs font-semibold text-app-secondary hover:bg-app-secondary/10 hover:text-app-secondary"
            >
              View Details
              <ArrowUpRight className="size-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </article>
  );
}
