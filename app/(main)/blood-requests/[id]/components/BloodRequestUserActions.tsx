"use client";

import {
  cancelBloodRequestAssignment,
  confirmBloodDonationByDonor,
  toggleBloodRequestInterest,
} from "@/app/actions/blood-request/blood-request-donor.action";
import BloodRequestModal from "@/components/blood-request/BloodRequestModal";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import {
  BloodRequestAssignment,
  BloodRequestCardData,
} from "@/types/blood-request.type";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckCircle2, Clock3, Heart, Pencil, X, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export function BloodRequestActions({
  request,
  assignedDonors,
}: {
  request: BloodRequestCardData;
  assignedDonors: BloodRequestAssignment[];
}) {
  const { isOwner, currentUserId, isInterested } = request;

  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [openEdit, setOpenEdit] = useState(false);

  const [removeInterestDialogOpen, setRemoveInterestDialogOpen] =
    useState(false);
  const [confirmDonationDialogOpen, setConfirmDonationDialogOpen] =
    useState(false);
  const [cancelDonationDialogOpen, setCancelDonationDialogOpen] =
    useState(false);

  const currentAssignment = assignedDonors.find(
    (assignment) => assignment.donor.id === currentUserId,
  );

  const handleInterestToggle = () => {
    if (isPending) return;

    startTransition(async () => {
      const result = await toggleBloodRequestInterest(request.id);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      setRemoveInterestDialogOpen(false);
      toast.success(result.message);
      router.refresh();
    });
  };

  const handleDonorConfirmation = () => {
    if (isPending) return;

    startTransition(async () => {
      const result = await confirmBloodDonationByDonor(request.id);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      setConfirmDonationDialogOpen(false);
      toast.success(result.message);
      router.refresh();
    });
  };

  const handleCancelAssignment = () => {
    if (!currentUserId || isPending) return;

    startTransition(async () => {
      const result = await cancelBloodRequestAssignment(
        request.id,
        currentUserId,
      );

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      setCancelDonationDialogOpen(false);
      toast.success(result.message);
      router.refresh();
    });
  };

  // ─────────────────────────────────────────────
  // Owner actions
  // ─────────────────────────────────────────────

  if (isOwner) {
    return (
      <>
        <section className="rounded-2xl border border-border bg-app-card p-5 sm:p-6">
          <h2 className="font-semibold">Request Actions</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage your blood request.
          </p>

          <Button
            type="button"
            disabled={request.status !== "active"}
            onClick={() => setOpenEdit(true)}
            className="mt-4 h-10 w-full cursor-pointer gap-2 border border-app-primary/30 bg-app-primary/10 font-semibold text-app-primary shadow-none transition hover:border-app-primary/50 hover:bg-app-primary/20 hover:text-app-primary disabled:cursor-not-allowed disabled:border-border disabled:bg-muted/50 disabled:text-muted-foreground disabled:opacity-100 disabled:hover:border-border disabled:hover:bg-muted/50"
          >
            <Pencil className="size-4" />
            Edit Request
          </Button>
        </section>

        <BloodRequestModal
          mode="edit"
          request={request}
          open={openEdit}
          onOpenChange={setOpenEdit}
        />
      </>
    );
  }

  // ─────────────────────────────────────────────
  // Assigned donor actions
  // ─────────────────────────────────────────────

  if (currentAssignment) {
    const { donationStatus } = currentAssignment;

    return (
      <>
        <section className="rounded-2xl border border-border bg-app-card p-5 sm:p-6">
          <h2 className="font-semibold">
            {donationStatus === "donated"
              ? "Donation Completed"
              : "Donation Assignment"}
          </h2>

          <p className="mt-1 text-sm leading-5 text-muted-foreground">
            {donationStatus === "pending" &&
              "You are assigned to this request. Confirm your donation after donating, or cancel the assignment if you can no longer donate."}

            {donationStatus === "confirmed_by_donor" &&
              "You have confirmed your donation. Waiting for the requester to confirm."}

            {donationStatus === "confirmed_by_requester" &&
              "The requester has confirmed the donation. Confirm after you have completed the donation."}

            {donationStatus === "donated" &&
              "This donation has been confirmed by both sides."}

            {donationStatus === "canceled_by_donor" &&
              "You canceled this donation assignment."}

            {donationStatus === "canceled_by_requester" &&
              "The requester canceled this donation assignment."}
          </p>

          {/* Pending */}
          {donationStatus === "pending" && (
            <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
              {/* I've Donated */}
              <Button
                type="button"
                onClick={() => setConfirmDonationDialogOpen(true)}
                disabled={isPending}
                className={cn(
                  "h-10 w-full cursor-pointer gap-2 bg-emerald-600 font-semibold text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600",
                  isPending && "cursor-wait",
                )}
              >
                <CheckCircle2 className="size-4" />
                {"I've Donated"}
              </Button>

              {/* Cancel Assignment */}
              <Button
                type="button"
                variant="outline"
                onClick={() => setCancelDonationDialogOpen(true)}
                disabled={isPending}
                className="h-10 w-full cursor-pointer gap-2 border-destructive/30 text-destructive hover:bg-destructive/10"
              >
                <XCircle className="size-4" />
                Cancel Assignment
              </Button>
            </div>
          )}

          {/* Requester Confirmed */}
          {donationStatus === "confirmed_by_requester" && (
            <Button
              type="button"
              onClick={() => setConfirmDonationDialogOpen(true)}
              disabled={isPending}
              className={cn(
                "mt-4 h-10 w-full cursor-pointer gap-2 bg-emerald-600 font-semibold text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600",
                isPending && "cursor-wait",
              )}
            >
              <CheckCircle2 className="size-4" />
              {"I've Donated"}
            </Button>
          )}

          {/* Waiting for Requester */}
          {donationStatus === "confirmed_by_donor" && (
            <div className="mt-4 flex items-center justify-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm font-medium text-amber-600 dark:text-amber-400">
              <Clock3 className="size-4" />
              Waiting for requester confirmation
            </div>
          )}

          {/* Donation Completed */}
          {donationStatus === "donated" && (
            <div className="mt-4 flex items-center justify-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-500/15 px-3 py-2 text-sm font-medium text-emerald-600 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-400">
              <CheckCircle2 className="size-4" />
              Donation completed
            </div>
          )}

          {/* Canceled */}
          {(donationStatus === "canceled_by_donor" ||
            donationStatus === "canceled_by_requester") && (
            <div className="mt-4 rounded-lg border border-slate-400/40 bg-slate-500/10 px-3 py-2 text-center text-sm font-medium text-slate-600 dark:border-slate-400/30 dark:bg-slate-400/10 dark:text-slate-400">
              {donationStatus === "canceled_by_donor"
                ? "Canceled by You"
                : "Canceled by Requester"}
            </div>
          )}
        </section>

        {/* Donation confirmation */}
        <ConfirmDialog
          open={confirmDonationDialogOpen}
          onOpenChange={setConfirmDonationDialogOpen}
          title="Confirm Donation?"
          description="Only confirm this after you have actually donated blood. This will notify the requester that you have completed the donation."
          confirmText="Yes, I've Donated"
          cancelText="Not Yet"
          loading={isPending}
          onConfirm={handleDonorConfirmation}
        />

        {/* Assignment cancellation */}
        <ConfirmDialog
          open={cancelDonationDialogOpen}
          onOpenChange={setCancelDonationDialogOpen}
          title="Cancel Assignment?"
          description="You will no longer be assigned to this blood request. This assignment will remain in the history as canceled."
          confirmText="Cancel Assignment"
          cancelText="Keep Assignment"
          loading={isPending}
          onConfirm={handleCancelAssignment}
        />
      </>
    );
  }

  // ─────────────────────────────────────────────
  // Interested / non-assigned donor actions
  // ─────────────────────────────────────────────

  return (
    <>
      <section className="rounded-2xl border border-border bg-app-card p-5 sm:p-6">
        us
        <h2 className="font-semibold">Want to help?</h2>
        <p className="mt-1 text-sm leading-5 text-muted-foreground">
          Let the requester know if you can donate.
        </p>
        <Button
          type="button"
          disabled={isPending}
          onClick={
            isInterested
              ? () => setRemoveInterestDialogOpen(true)
              : handleInterestToggle
          }
          variant={isInterested ? "outline" : "default"}
          className={
            isInterested
              ? "mt-4 h-10 w-full cursor-pointer gap-2 border-app-primary/30 bg-app-primary/10 font-semibold text-app-primary shadow-none transition hover:border-app-primary/50 hover:bg-app-primary/20 hover:text-app-primary disabled:cursor-not-allowed"
              : "mt-4 h-10 w-full cursor-pointer gap-2 bg-app-primary font-semibold text-white shadow-none transition hover:bg-app-primary/90 disabled:cursor-not-allowed"
          }
        >
          {isInterested ? (
            <>
              <X className="size-4" />
              Remove Interest
            </>
          ) : (
            <>
              <Heart className="size-4" />
              Show Interest
            </>
          )}
        </Button>
      </section>

      <ConfirmDialog
        open={removeInterestDialogOpen}
        onOpenChange={setRemoveInterestDialogOpen}
        title="Remove Interest?"
        description="Are you sure you want to remove your interest from this blood request?"
        confirmText="Remove Interest"
        cancelText="Keep Interest"
        loading={isPending}
        onConfirm={handleInterestToggle}
      />
    </>
  );
}
