"use client";

import {
  Activity,
  ArrowUpRight,
  Building2,
  Flag,
  MapPin,
  MoreHorizontal,
  Pencil,
  Share2,
  Trash2,
  UserRoundX,
  Users,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDateTime, getTimeAgo } from "@/lib/helpers/date";
import { getStatusStyles } from "@/lib/helpers/status";
import { BloodRequestCardData } from "@/types/blood-request.type";
import Link from "next/link";
import { toast } from "sonner";

interface BloodRequestCardProps {
  request: BloodRequestCardData;
  isOwner?: boolean;
}

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
  isOwner = false,
}: BloodRequestCardProps) {
  const requesterName = request.requester?.name || "Unknown User";
  const statusStyles = getStatusStyles(request.status);

  const locationText = [request.location?.area, request.location?.district]
    .filter(Boolean)
    .join(", ");

  const interestedCount = request.interestedDonors?.length || 0;
  const assignedCount = request.assignedDonors?.length || 0;

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

        {/* Status + More */}
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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 cursor-pointer rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <MoreHorizontal className="size-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-44">
              {isOwner && request.status === "active" && (
                <>
                  <DropdownMenuItem className="cursor-pointer gap-2">
                    <Pencil className="size-4" />
                    Edit Request
                  </DropdownMenuItem>

                  <DropdownMenuItem className="cursor-pointer gap-2 text-red-500 focus:text-red-500">
                    <Trash2 className="size-4" />
                    Delete Request
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />
                </>
              )}

              {/* Share */}
              <DropdownMenuItem
                className="cursor-pointer gap-2"
                onClick={async () => {
                  const shareData = {
                    title: `Blood Request by ${requesterName} - ${request.bloodGroupNeeded} Needed`,
                    text: `I need ${request.quantity} ${request.quantity === 1 ? "bag" : "bags"} of ${request.bloodGroupNeeded} blood.`,
                    url: `${window.location.origin}/blood-requests/${request.id}`,
                  };

                  try {
                    if (navigator.share) {
                      await navigator.share(shareData);
                      toast.success("Blood request shared successfully!");
                    } else {
                      await navigator.clipboard.writeText(shareData.url);
                      toast.success(
                        "Link copied to clipboard! Share it anywhere.",
                      );
                    }
                  } catch (error) {
                    console.error("Error sharing blood request:", error);
                  }
                }}
              >
                <Share2 className="size-4" />
                Share
              </DropdownMenuItem>

              {!isOwner && (
                <>
                  <DropdownMenuItem className="cursor-pointer gap-2">
                    <UserRoundX className="size-4" />
                    Block User
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem className="cursor-pointer gap-2 text-red-500 focus:text-red-500">
                    <Flag className="size-4" />
                    Report
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-5 pb-5 pt-5 sm:px-6 sm:pb-6">
        {/* Blood / Needed Before / Urgency */}
        <div className="rounded-xl border border-border/50 bg-muted/20 px-4 py-3.5">
          <div className="flex items-center">
            {/* Blood */}
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-app-primary/10 text-xl font-bold text-app-primary ring-1 ring-app-primary/15">
                {request.bloodGroupNeeded}
              </div>

              <div className="min-w-0">
                <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                  Blood Needed
                </p>

                <p className="mt-0.5 text-sm font-semibold text-app-foreground">
                  {request.quantity} {request.quantity === 1 ? "bag" : "bags"}
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="mx-3 h-10 w-px shrink-0 bg-border/70 sm:mx-4" />

            {/* Needed Before */}
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                Needed Before
              </p>

              <p className="mt-0.5 truncate text-sm font-semibold text-app-foreground">
                {formatDateTime(request.neededBefore)}
              </p>
            </div>

            {/* Divider */}
            <div className="mx-3 h-10 w-px shrink-0 bg-border/70 sm:mx-4" />

            {/* Urgency */}
            <div className="w-[62px] shrink-0 text-right sm:w-[72px]">
              <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                Urgency
              </p>

              <p
                className={`mt-0.5 text-xs font-bold uppercase tracking-wide ${getUrgencyClass(
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
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Donors Engagement Stats */}
          <div className="flex items-center justify-between sm:justify-start gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5 font-medium">
              <Users className="h-3.5 w-3.5 text-blue-500" />
              <span>{interestedCount} interested</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <Activity className="h-3.5 w-3.5 text-emerald-500" />
              <span>{assignedCount} assigned</span>
            </div>
          </div>

          {/* Action Buttons */}
          <Link href={`/blood-requests/${request.id}`}>
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
