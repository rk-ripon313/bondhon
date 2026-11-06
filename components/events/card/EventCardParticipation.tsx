"use client";

import { CheckCircle2, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { toggleEventParticipation } from "@/app/actions/event/event.action";
import { Button } from "@/components/ui/button";
import { getErrorMessage } from "@/lib/helpers/error";
import {
  canParticipateInEvent,
  getEffectiveEventStatus,
} from "@/lib/helpers/status";
import { cn } from "@/lib/utils";
import { EventCardData } from "@/types/event.type";

export default function EventParticipation({
  event,
}: {
  event: EventCardData;
}) {
  const {
    id: eventId,
    status,
    startsAt,
    endsAt,
    isInterested,
    isGoing,
    interestedCount,
    goingCount,
  } = event;

  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const effectiveStatus = getEffectiveEventStatus({
    status,
    startsAt,
    endsAt,
  });

  const canParticipate = canParticipateInEvent(effectiveStatus);

  const handleParticipation = (action: "interested" | "going") => {
    startTransition(async () => {
      try {
        const result = await toggleEventParticipation(eventId, action);

        if (!result.success) {
          toast.error(result.message);
          return;
        }

        toast.success(result.message);
        router.refresh();
      } catch (error) {
        console.error("Participation Error:", error);
        toast.error(
          getErrorMessage(error) ||
            "An error occurred while updating participation.",
        );
      }
    });
  };
  return (
    <div className="flex items-center gap-2 border-t border-border/60 pt-3">
      {canParticipate ? (
        <>
          <Button
            size="sm"
            variant={isInterested ? "default" : "outline"}
            disabled={isPending}
            onClick={() => handleParticipation("interested")}
            className={cn(
              "flex-1 cursor-pointer gap-1.5 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0",
              isInterested
                ? "border-app-primary bg-app-primary text-white hover:bg-app-primary/90"
                : "hover:border-app-primary/50 hover:bg-app-primary/5 hover:text-app-primary",
            )}
          >
            <Star className={cn("size-4", isInterested && "fill-current")} />
            Interested
            <span className="text-xs opacity-80">({interestedCount})</span>
          </Button>

          <Button
            size="sm"
            variant={isGoing ? "default" : "outline"}
            disabled={isPending}
            onClick={() => handleParticipation("going")}
            className={cn(
              "flex-1 cursor-pointer gap-1.5 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0",
              isGoing
                ? "border-emerald-600 bg-emerald-600 text-white hover:bg-emerald-700"
                : "hover:border-emerald-600/50 hover:bg-emerald-500/5 hover:text-emerald-600",
            )}
          >
            <CheckCircle2 className="size-4" />
            {isGoing ? "Going" : "Go"}
            <span className="text-xs opacity-80">({goingCount})</span>
          </Button>
        </>
      ) : (
        <div className="flex flex-1 items-center justify-center gap-5 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Star className="size-3.5" />
            Interested ({interestedCount})
          </span>

          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="size-3.5" />
            Going ({goingCount})
          </span>
        </div>
      )}
    </div>
  );
}
