"use client";

import {
  BadgeCheck,
  Check,
  CheckCircle2,
  Clock3,
  MessageCircle,
  Phone,
  UserRoundX,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import {
  cancelBloodRequestAssignment,
  confirmBloodDonationByDonor,
  confirmBloodDonationByRequester,
} from "@/app/actions/blood-request/blood-request-donor.action";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { BloodRequestAssignment } from "@/types/blood-request.type";

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

  const [isCancelPending, startCancelTransition] = useTransition();
  const [isDonorConfirmPending, startDonorConfirmTransition] = useTransition();
  const [isRequesterConfirmPending, startRequesterConfirmTransition] =
    useTransition();

  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [donorConfirmDialogOpen, setDonorConfirmDialogOpen] = useState(false);
  const [requesterConfirmDialogOpen, setRequesterConfirmDialogOpen] =
    useState(false);

  const { donor } = assignment;
  const { donationStatus } = assignment;

  const isPending = donationStatus === "pending";
  const isDonorConfirmed = donationStatus === "confirmed_by_donor";
  const isRequesterConfirmed = donationStatus === "confirmed_by_requester";
  const isDonated = donationStatus === "donated";
  const isCanceled =
    donationStatus === "canceled_by_donor" ||
    donationStatus === "canceled_by_requester";

  const handleCancelAssignment = () => {
    startCancelTransition(async () => {
      const result = await cancelBloodRequestAssignment(requestId, donor.id);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      setCancelDialogOpen(false);
      toast.success(result.message);
      router.refresh();
    });
  };

  const handleConfirmDonationByDonor = () => {
    startDonorConfirmTransition(async () => {
      const result = await confirmBloodDonationByDonor(requestId);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      setDonorConfirmDialogOpen(false);
      toast.success(result.message);
      router.refresh();
    });
  };

  const handleConfirmDonationByRequester = () => {
    startRequesterConfirmTransition(async () => {
      const result = await confirmBloodDonationByRequester(requestId, donor.id);

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      setRequesterConfirmDialogOpen(false);
      toast.success(result.message);
      router.refresh();
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

                <span>•</span>

                {isDonated ? (
                  <span className="flex items-center gap-1 text-emerald-500">
                    <BadgeCheck className="size-3.5" />
                    Donation completed
                  </span>
                ) : isCanceled ? (
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <XCircle className="size-3.5" />
                    {donationStatus === "canceled_by_donor"
                      ? "Canceled by donor"
                      : "Canceled by requester"}
                  </span>
                ) : isDonorConfirmed ? (
                  <span className="flex items-center gap-1 text-blue-500">
                    <CheckCircle2 className="size-3.5" />
                    Donor confirmed
                  </span>
                ) : isRequesterConfirmed ? (
                  <span className="flex items-center gap-1 text-blue-500">
                    <CheckCircle2 className="size-3.5" />
                    Requester confirmed
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-amber-500">
                    <Clock3 className="size-3.5" />
                    Awaiting confirmation
                  </span>
                )}
              </div>
            </div>
          </div>

          {/*  Actions Wrapper */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Phone (Only for Owner) */}
            {isOwner && (
              <a
                href={`tel:${donor.phone}`}
                title={`Call ${donor.name}`}
                aria-label={`Call ${donor.name}`}
                className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground transition hover:border-app-primary/30 hover:bg-app-primary/5 hover:text-app-primary"
              >
                <Phone className="size-4" />
              </a>
            )}

            {/* Message (For Owner or Current User) */}
            {(isOwner || isCurrentUser) && (
              <button
                type="button"
                title={`Message ${donor.name}`}
                aria-label={`Message ${donor.name}`}
                className="inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-border text-muted-foreground transition hover:border-app-primary/30 hover:bg-app-primary/5 hover:text-app-primary"
              >
                <MessageCircle className="size-4" />
              </button>
            )}

            {/* Cancel Button (Owner or Current User when status is Pending) */}
            {(isOwner || isCurrentUser) && isPending && (
              <Button
                type="button"
                onClick={() => setCancelDialogOpen(true)}
                disabled={isCancelPending}
                variant="outline"
                className="h-9 w-[105px] shrink-0 cursor-pointer gap-1.5 border-destructive/30 px-3 text-xs font-semibold text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <UserRoundX className="size-3.5" />
                Cancel
              </Button>
            )}

            {/* Requester Confirm Action */}
            {isOwner && (isPending || isDonorConfirmed) && (
              <Button
                type="button"
                onClick={() => setRequesterConfirmDialogOpen(true)}
                disabled={isRequesterConfirmPending}
                className="h-9 w-[105px] shrink-0 cursor-pointer gap-1.5 bg-emerald-600 px-3 text-xs font-semibold text-white shadow-none hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
              >
                <Check className="size-3.5" />
                Confirm
              </Button>
            )}

            {/* Donor Confirm Action */}
            {isCurrentUser &&
              !isOwner &&
              (isPending || isRequesterConfirmed) && (
                <Button
                  type="button"
                  onClick={() => setDonorConfirmDialogOpen(true)}
                  disabled={isDonorConfirmPending}
                  className="h-9 w-[105px] shrink-0 cursor-pointer gap-1.5 bg-emerald-600 px-3 text-xs font-semibold text-white shadow-none hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
                >
                  <Check className="size-3.5" />
                  {"I've Donated"}
                </Button>
              )}

            {/* Waiting Status  */}
            {((isOwner && isRequesterConfirmed) ||
              (isCurrentUser && !isOwner && isDonorConfirmed)) && (
              <Button
                type="button"
                disabled
                variant="outline"
                className="h-9 w-[105px] shrink-0 cursor-default gap-1.5 border-amber-500/30 bg-amber-500/10 px-3 text-xs font-semibold text-amber-600 opacity-100 dark:text-amber-400"
              >
                <Clock3 className="size-3.5" />
                Waiting
              </Button>
            )}

            {/* Completed Status */}
            {(isOwner || isCurrentUser) && isDonated && (
              <Button
                type="button"
                disabled
                variant="outline"
                className="h-9 w-[145px] shrink-0 cursor-default gap-1.5 border-emerald-500/40 bg-emerald-500/15 px-3 text-xs font-semibold text-emerald-600 opacity-100 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-400"
              >
                <BadgeCheck className="size-3.5" />
                Completed
              </Button>
            )}

            {/* Canceled Status  */}
            {(isOwner || isCurrentUser) && isCanceled && (
              <Button
                type="button"
                disabled
                variant="outline"
                title={
                  donationStatus === "canceled_by_donor"
                    ? "Canceled by Donor"
                    : "Canceled by Requester"
                }
                className="h-9 max-w-[145px] shrink-0 cursor-default gap-1.5 border-slate-400/40 bg-slate-500/10 px-3 text-xs font-semibold text-slate-600 opacity-100 dark:border-slate-400/30 dark:bg-slate-400/10 dark:text-slate-400"
              >
                <XCircle className="size-3.5 shrink-0" />
                <span className="truncate">
                  {donationStatus === "canceled_by_donor"
                    ? "Canceled — Donor"
                    : "Canceled — Requester"}
                </span>
              </Button>
            )}

            {/* Profile Link (Others Viewers) */}
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

      {/* Cancel Assignment Dialog */}
      <ConfirmDialog
        open={cancelDialogOpen}
        onOpenChange={setCancelDialogOpen}
        title="Cancel Assignment?"
        description={
          isOwner
            ? `Are you sure you want to cancel ${donor.name}'s assignment? This assignment will remain in the history as canceled.`
            : "Are you sure you want to cancel your assignment? This assignment will remain in the history as canceled."
        }
        confirmText="Cancel Assignment"
        cancelText="Keep Assignment"
        loading={isCancelPending}
        onConfirm={handleCancelAssignment}
      />

      {/* Donor Confirmation Dialog */}
      <ConfirmDialog
        open={donorConfirmDialogOpen}
        onOpenChange={setDonorConfirmDialogOpen}
        title="Confirm Donation?"
        description="Only confirm this after you have actually donated blood. This will notify the requester that you have completed the donation."
        confirmText="Yes, I've Donated"
        cancelText="Not Yet"
        loading={isDonorConfirmPending}
        onConfirm={handleConfirmDonationByDonor}
      />

      {/* Requester Confirmation Dialog */}
      <ConfirmDialog
        open={requesterConfirmDialogOpen}
        onOpenChange={setRequesterConfirmDialogOpen}
        title="Confirm Donation?"
        description={`Please confirm that ${donor.name} has actually donated blood for this request.`}
        confirmText="Confirm Donation"
        cancelText="Not Yet"
        loading={isRequesterConfirmPending}
        onConfirm={handleConfirmDonationByRequester}
      />
    </>
  );
}
