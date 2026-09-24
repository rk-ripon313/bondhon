"use client";

import { InfoIcon, MessageCircle, Phone, UserCheck, X } from "lucide-react";
import Link from "next/link";

import { toggleBloodRequestInterest } from "@/app/actions/blood-request/blood-request-donor.action";
import { Button } from "@/components/ui/button";
import { formatBDPhone } from "@/lib/helpers/phone";
import { cn } from "@/lib/utils";
import { BloodRequestDetailDonor } from "@/types/blood-request.type";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import DonorAvatar from "./DonorAvatar";

interface InterestedDonorRowProps {
  donor: BloodRequestDetailDonor;
  isOwner: boolean;
  isCurrentUser: boolean;
  isAssigned: boolean;
  requestId: string;
}

export default function InterestedDonorRow({
  donor,
  isOwner,
  isCurrentUser,
  isAssigned,
  requestId,
}: InterestedDonorRowProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleRemoveInterest = () => {
    startTransition(async () => {
      const result = await toggleBloodRequestInterest(requestId);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      router.refresh();
    });
  };

  return (
    <div className="px-5 py-4 sm:px-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        {/* Donor Info */}
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <DonorAvatar donor={donor} />

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="truncate text-sm font-medium">{donor.name}</p>

              {isCurrentUser && (
                <span className="shrink-0 rounded-full bg-app-primary/10 px-2 py-0.5 text-[11px] font-medium text-app-primary">
                  You
                </span>
              )}
            </div>

            <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="font-medium text-app-primary">
                {donor.bloodGroup}
              </span>

              {donor.location?.area && (
                <>
                  <span>•</span>
                  <span className="truncate">{donor.location.area}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Contact Info */}
        {isOwner && (
          <div className="min-w-0 lg:w-[190px] lg:shrink-0">
            <p className="truncate text-sm font-medium">
              {formatBDPhone(donor.phone)}
            </p>

            <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
              <InfoIcon className="size-3.5 shrink-0 text-amber-500" />
              <span>Contact before assigning</span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 lg:shrink-0">
          {/* Owner Actions */}
          {isOwner && (
            <>
              {/* call */}
              <a
                href={`tel:${donor.phone}`}
                aria-label={`Call ${donor.name}`}
                className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground transition hover:border-app-primary/30 hover:bg-app-primary/5 hover:text-app-primary"
              >
                <Phone className="size-4" />
              </a>

              {/* Message */}
              <button
                type="button"
                aria-label={`Message ${donor.name}`}
                className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground transition hover:border-app-primary/30 hover:bg-app-primary/5 hover:text-app-primary"
              >
                <MessageCircle className="size-4" />
              </button>

              {/* Assign Action */}
              <Button
                type="button"
                disabled={isAssigned}
                variant={isAssigned ? "outline" : "default"}
                className={cn(
                  "h-9 w-[92px] shrink-0 gap-1.5 px-3 text-xs font-semibold shadow-none transition cursor-pointer",
                  isAssigned
                    ? "text-muted-foreground"
                    : "bg-app-primary text-white hover:bg-app-primary/90",
                )}
              >
                <UserCheck className="size-3.5" />
                {isAssigned ? "Assigned" : "Assign"}
              </Button>
            </>
          )}

          {/* Current User Action */}
          {isCurrentUser && !isOwner && (
            <Button
              type="button"
              onClick={handleRemoveInterest}
              disabled={isPending || isAssigned}
              variant="outline"
              className="h-9 w-[112px] shrink-0 gap-1.5 cursor-pointer border-app-primary/30 bg-app-primary/10 px-3 text-xs font-semibold text-app-primary transition hover:bg-app-primary/15 hover:text-app-primary"
            >
              {isAssigned ? (
                <>
                  <UserCheck className="size-3.5" />
                  Assigned
                </>
              ) : (
                <>
                  <X className="size-3.5" />
                  {isPending ? "Removing..." : "Remove"}
                </>
              )}
            </Button>
          )}

          {/* Other User */}
          {!isOwner && !isCurrentUser && (
            <Link
              href={`/user/${donor.username}`}
              className="inline-flex h-9 w-[92px] shrink-0 items-center justify-center rounded-lg border border-border text-xs font-medium text-muted-foreground transition hover:border-app-primary/30 hover:text-app-primary"
            >
              Profile
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
