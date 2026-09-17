"use client";

import { Activity, ArrowUpRight, Heart, Users } from "lucide-react";
import Link from "next/link";

import { toggleBloodRequestInterest } from "@/app/actions/blood-request/blood-request-donor.action";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BloodRequestCardData } from "@/types/blood-request.type";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

export default function BloodRequestCardFooter({
  request,
}: {
  request: BloodRequestCardData;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const { isOwner, isAssigned, isInterested } = request;

  const handleInterestToggle = () => {
    if (isOwner || isAssigned || isPending) return;

    startTransition(async () => {
      const result = await toggleBloodRequestInterest(request.id);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      router.refresh();
    });
  };

  return (
    <div className="border-t border-border/60 bg-muted/20 px-3 py-2.5 sm:px-5 sm:py-3">
      <div className="flex items-center justify-between gap-2">
        {/* Main Action */}
        <Button
          variant={isAssigned ? "outline" : "default"}
          size="sm"
          disabled={isOwner || isPending || isAssigned}
          onClick={handleInterestToggle}
          className={cn(
            "h-8 shrink-0 cursor-pointer gap-1.5 px-2.5 text-xs font-semibold sm:px-3",

            !isInterested &&
              !isAssigned &&
              "bg-app-primary text-white hover:bg-app-primary/90",

            isInterested &&
              !isAssigned &&
              "border border-app-primary/40 bg-app-primary/10 text-app-primary hover:bg-app-primary/20",

            isAssigned && "cursor-not-allowed",

            isOwner && "cursor-not-allowed opacity-40",
          )}
        >
          {isAssigned ? (
            "I Can't Donate"
          ) : (
            <>
              <Heart
                className="size-3.5"
                fill={isInterested ? "currentColor" : "none"}
              />
              {isInterested ? "Not Interested" : "I'm Interested"}
            </>
          )}
        </Button>

        {/* Stats + Details */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Interested Count */}
          <div
            className="flex items-center gap-1 text-xs text-muted-foreground"
            aria-label={`${request.interestedCount} interested donors`}
          >
            <Users className="size-3.5 text-blue-500" />
            <span>{request.interestedCount}</span>
          </div>

          <span className="h-3.5 w-px bg-border" aria-hidden="true" />
          {/* Assigned Count */}
          <div
            className="flex items-center gap-1 text-xs text-muted-foreground"
            aria-label={`${request.assignedCount} assigned donors`}
          >
            <Activity className="size-3.5 text-emerald-500" />
            <span>{request.assignedCount}</span>
          </div>

          {/* View Details */}
          <Link href={`/blood-requests/${request.id}`}>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 cursor-pointer text-app-secondary hover:bg-app-secondary/10 hover:text-app-secondary sm:w-auto sm:px-2.5"
              aria-label="View details"
            >
              <span className="hidden sm:inline text-xs font-semibold">
                View Details
              </span>
              <ArrowUpRight className="size-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
