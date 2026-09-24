"use client";

import { Check, MessageCircle, Phone, UserRoundX } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { BloodRequestAssignment } from "@/types/blood-request.type";

import { cancelBloodRequestAssignment } from "@/app/actions/blood-request/blood-request-donor.action";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { toast } from "sonner";
import DonorAvatar from "./DonorAvatar";

interface AssignedDonorRowProps {
  assignment: BloodRequestAssignment;
  isOwner: boolean;
  isCurrentUser: boolean;
  requestId: string;
}

export default function AssignedDonorRow({
  assignment,
  isOwner,
  isCurrentUser,
  requestId,
}: AssignedDonorRowProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  const { donor } = assignment;

  const isRequesterConfirmed = Boolean(assignment.requesterConfirmedAt);
  const isDonorConfirmed = Boolean(assignment.donorConfirmedAt);

  const handleCancelAssignment = () => {
    startTransition(async () => {
      const result = await cancelBloodRequestAssignment(requestId, donor.id);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      setCancelDialogOpen(false);
      router.refresh();
    });
  };

  const handleConfirmDonation = () => {
    // TODO: Connect confirmBloodDonation action.
    startTransition(async () => {
      console.log("Confirm donation:", requestId, donor.id);

      // const result = await confirmBloodDonation(
      //   requestId,
      //   donor.id,
      // );

      // if (!result.success) {
      //   toast.error(result.message);
      //   return;
      // }

      // toast.success(result.message);
      // router.refresh();
    });
  };

  return (
    <>
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

          {/* Actions */}
          <div className="flex items-center gap-2 ">
            {/* Requester / Owner Actions */}
            {isOwner && (
              <>
                {/* Call */}
                <a
                  href={`tel:${donor.phone}`}
                  title={`Call ${donor.name}`}
                  aria-label={`Call ${donor.name}`}
                  className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground transition hover:border-app-primary/30 hover:bg-app-primary/5 hover:text-app-primary"
                >
                  <Phone className="size-4" />
                </a>

                {/* Message */}
                <button
                  type="button"
                  title={`Message ${donor.name}`}
                  aria-label={`Message ${donor.name}`}
                  className="inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-border text-muted-foreground transition hover:border-app-primary/30 hover:bg-app-primary/5 hover:text-app-primary"
                >
                  <MessageCircle className="size-4" />
                </button>

                {/* Remove Assignment */}
                {!isRequesterConfirmed && (
                  <Button
                    type="button"
                    onClick={() => setCancelDialogOpen(true)}
                    disabled={isPending}
                    variant="outline"
                    title="Remove assigned donor"
                    aria-label="Remove assigned donor"
                    className="h-9 w-[105px] shrink-0 cursor-pointer gap-1.5 border-app-primary/30 bg-app-primary/10 px-3 text-xs font-semibold text-app-primary transition hover:bg-app-primary/15 hover:text-app-primary"
                  >
                    <UserRoundX className="size-3.5" />

                    {isPending ? "Removing..." : "Remove"}
                  </Button>
                )}

                {/* Confirm Donation */}
                <Button
                  type="button"
                  onClick={handleConfirmDonation}
                  disabled={isPending || isRequesterConfirmed}
                  variant="outline"
                  title={
                    isRequesterConfirmed
                      ? "Donation confirmed"
                      : "Confirm donation"
                  }
                  aria-label={
                    isRequesterConfirmed
                      ? "Donation confirmed"
                      : "Confirm donation"
                  }
                  className={
                    isRequesterConfirmed
                      ? "h-9 w-[105px] shrink-0 cursor-default gap-1.5 border-emerald-500/30 bg-emerald-500/10 px-3 text-xs font-semibold text-emerald-600 disabled:opacity-100 dark:text-emerald-400"
                      : "h-9 w-[105px] shrink-0 cursor-pointer gap-1.5 border-emerald-500/30 bg-emerald-500/10 px-3 text-xs font-semibold text-emerald-600 transition hover:bg-emerald-500/15 hover:text-emerald-600 dark:text-emerald-400 dark:hover:text-emerald-400"
                  }
                >
                  <Check className="size-3.5 stroke-[3]" />

                  {isPending
                    ? "Confirming..."
                    : isRequesterConfirmed
                      ? "Confirmed"
                      : "Confirm"}
                </Button>
              </>
            )}

            {/* Assigned Donor Actions */}
            {isCurrentUser && !isOwner && (
              <>
                {/* Message */}
                <button
                  type="button"
                  title={`Message ${donor.name}`}
                  aria-label={`Message ${donor.name}`}
                  className="inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-border text-muted-foreground transition hover:border-app-primary/30 hover:bg-app-primary/5 hover:text-app-primary"
                >
                  <MessageCircle className="size-4" />
                </button>

                {/* Cancel Assignment */}
                {!isDonorConfirmed && (
                  <Button
                    type="button"
                    onClick={() => setCancelDialogOpen(true)}
                    disabled={isPending}
                    variant="outline"
                    title="Cancel assignment"
                    aria-label="Cancel assignment"
                    className=" h-9 w-[105px] shrink-0 cursor-pointer gap-1.5 border-app-primary/30 bg-app-primary/10 px-3 text-xs font-semibold text-app-primary transition hover:bg-app-primary/15 hover:text-app-primary sm:order-none"
                  >
                    <UserRoundX className="size-3.5" />

                    {isPending ? "Cancelling..." : "Cancel"}
                  </Button>
                )}

                {/* Confirm Donation */}
                <Button
                  type="button"
                  onClick={handleConfirmDonation}
                  disabled={isPending || isDonorConfirmed}
                  variant="outline"
                  title={
                    isDonorConfirmed ? "Donation confirmed" : "Confirm donation"
                  }
                  aria-label={
                    isDonorConfirmed ? "Donation confirmed" : "Confirm donation"
                  }
                  className={
                    isDonorConfirmed
                      ? "h-9 w-[105px] shrink-0 cursor-default gap-1.5 border-emerald-500/30 bg-emerald-500/10 px-3 text-xs font-semibold text-emerald-600 disabled:opacity-100 dark:text-emerald-400"
                      : "h-9 w-[105px] shrink-0 cursor-pointer gap-1.5 border-emerald-500/30 bg-emerald-500/10 px-3 text-xs font-semibold text-emerald-600 transition hover:bg-emerald-500/15 hover:text-emerald-600 dark:text-emerald-400 dark:hover:text-emerald-400"
                  }
                >
                  <Check className="size-3.5 stroke-[3]" />

                  {isPending
                    ? "Confirming..."
                    : isDonorConfirmed
                      ? "Confirmed"
                      : "Confirm"}
                </Button>
              </>
            )}

            {/* Other User */}
            {!isOwner && !isCurrentUser && (
              <Link
                href={`/user/${donor.username}`}
                title={`View ${donor.name}'s profile`}
                aria-label={`View ${donor.name}'s profile`}
                className="inline-flex h-9 w-[92px] shrink-0 cursor-pointer items-center justify-center rounded-lg border border-border text-xs font-medium text-muted-foreground transition hover:border-app-primary/30 hover:text-app-primary"
              >
                Profile
              </Link>
            )}
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={cancelDialogOpen}
        onOpenChange={setCancelDialogOpen}
        title={isOwner ? "Remove assigned donor?" : "Cancel assignment?"}
        description={
          isOwner
            ? `${donor.name} will be removed from the assigned donors and returned to the interested donors list.`
            : "You will no longer be assigned to this blood request. You will not be added back to the interested donors list."
        }
        confirmText={isOwner ? "Remove Donor" : "Cancel Assignment"}
        cancelText="Keep Assignment"
        loading={isPending}
        onConfirm={handleCancelAssignment}
      />
    </>
  );
}
