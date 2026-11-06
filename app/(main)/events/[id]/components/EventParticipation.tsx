"use client";

import { toggleEventParticipation } from "@/app/actions/event/event.action";
import { Button } from "@/components/ui/button";
import { getErrorMessage } from "@/lib/helpers/error";
import {
  canParticipateInEvent,
  getEffectiveEventStatus,
} from "@/lib/helpers/status";
import { EventCardData } from "@/types/event.type";
import { Heart, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

export default function EventParticipation({
  event,
}: {
  event: EventCardData;
}) {
  const { id, isOwner, isGoing, isInterested, goingCount, interestedCount } =
    event;

  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const effectiveStatus = getEffectiveEventStatus(event);
  const canParticipate = canParticipateInEvent(effectiveStatus);

  const handleParticipation = (action: "going" | "interested") => {
    startTransition(async () => {
      try {
        const result = await toggleEventParticipation(id, action);

        if (!result.success) {
          toast.error(result.message);
          return;
        }

        toast.success(result.message);
        router.refresh();
      } catch (error) {
        toast.error(
          getErrorMessage(error) ||
            "An error occurred while updating participation.",
        );
      }
    });
  };

  return (
    <section className="rounded-2xl border border-border bg-app-card p-4 shadow-sm sm:p-5">
      <h2 className="text-base font-semibold">Join this Event</h2>

      <p className="mt-1.5 text-sm text-muted-foreground">
        Be part of this event and connect with the community.
      </p>

      <div className="mt-4 grid grid-cols-2 gap-2">
        {/* Going */}
        <Button
          type="button"
          variant="outline"
          disabled={!canParticipate || isPending}
          onClick={() => handleParticipation("going")}
          className={`h-9 min-w-0 cursor-pointer gap-1.5 rounded-lg px-2 text-xs font-semibold shadow-none transition-all duration-200 disabled:cursor-not-allowed ${
            isGoing
              ? "border-emerald-600 bg-emerald-600 text-white hover:border-emerald-700 hover:bg-emerald-700 dark:border-emerald-500 dark:bg-emerald-500 dark:text-white dark:hover:bg-emerald-600"
              : "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 hover:border-emerald-500/50 hover:bg-emerald-500/15 dark:text-emerald-400"
          }`}
        >
          <Users className="size-3.5 shrink-0" />
          <span className="truncate">{isGoing ? "Going" : "Join"}</span>
          <span className="shrink-0 text-[11px] tabular-nums opacity-80">
            {goingCount}
          </span>
        </Button>

        {/* Interested */}
        <Button
          type="button"
          variant="outline"
          disabled={!canParticipate || isPending}
          onClick={() => handleParticipation("interested")}
          className={`h-9 min-w-0 cursor-pointer gap-1.5 rounded-lg px-2 text-xs font-semibold shadow-none transition-all duration-200 disabled:cursor-not-allowed ${
            isInterested
              ? "border-rose-600 bg-rose-600 text-white hover:border-rose-700 hover:bg-rose-700 dark:border-rose-500 dark:bg-rose-500 dark:text-white dark:hover:bg-rose-600"
              : "border-rose-500/30 bg-rose-500/10 text-rose-700 hover:border-rose-500/50 hover:bg-rose-500/15 dark:text-rose-400"
          }`}
        >
          <Heart
            className={`size-3.5 shrink-0 ${isInterested ? "fill-current" : ""}`}
          />
          <span className="truncate">Interested</span>
          <span className="shrink-0 text-[11px] tabular-nums opacity-80">
            {interestedCount}
          </span>
        </Button>
      </div>

      {isOwner && (
        <p className="mt-3 text-center text-xs text-muted-foreground">
          You are the organizer of this event.
        </p>
      )}

      {effectiveStatus === "completed" && (
        <p className="mt-3 text-center text-xs text-muted-foreground">
          This event has ended.
        </p>
      )}

      {effectiveStatus === "cancelled" && (
        <p className="mt-3 text-center text-xs text-destructive">
          This event has been cancelled.
        </p>
      )}
    </section>
  );
}
