"use client";

import { Heart, Pencil, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { toggleBloodRequestInterest } from "@/app/actions/blood-request/blood-request-donor.action";
import BloodRequestModal from "@/components/blood-request/BloodRequestModal";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { BloodRequestCardData } from "@/types/blood-request.type";

export function BloodRequestActions({
  request,
}: {
  request: BloodRequestCardData;
}) {
  const router = useRouter();

  const [openEdit, setOpenEdit] = useState(false);
  const [isPending, startTransition] = useTransition();

  const { isOwner, isAssigned, isInterested } = request;

  const handleUserAction = () => {
    // TODO: Cancel assignment
    if (isAssigned) {
      return;
    }

    if (isPending) return;

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

  // Owner actions
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
            onClick={() => setOpenEdit(true)}
            className="mt-4 h-10 w-full cursor-pointer gap-2 border border-app-primary/30 bg-app-primary/10 font-semibold text-app-primary shadow-none transition hover:border-app-primary/50 hover:bg-app-primary/20 hover:text-app-primary"
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

  // Donor actions
  return (
    <section className="rounded-2xl border border-border bg-app-card p-5 sm:p-6">
      <h2 className="font-semibold">
        {isAssigned ? "Donation Assignment" : "Want to help?"}
      </h2>

      <p className="mt-1 text-sm leading-5 text-muted-foreground">
        {isAssigned
          ? "You are currently assigned to this blood request."
          : "Let the requester know if you can donate."}
      </p>

      <Button
        type="button"
        onClick={handleUserAction}
        disabled={isPending}
        variant={isAssigned ? "outline" : "default"}
        className={cn(
          "mt-4 h-10 w-full cursor-pointer gap-2 font-semibold transition",

          !isInterested &&
            !isAssigned &&
            "bg-app-primary text-white hover:bg-app-primary/90",

          isInterested &&
            !isAssigned &&
            "border border-app-primary/40 bg-app-primary/10 text-app-primary hover:bg-app-primary/20",

          isAssigned &&
            "border-destructive/30 text-destructive hover:bg-destructive/10",

          isPending && "cursor-wait",
        )}
      >
        {isPending && <Spinner />}

        {isAssigned ? (
          <>
            <XCircle className="size-4" />
            Cancel Assignment
          </>
        ) : (
          <>
            <Heart
              className="size-4"
              fill={isInterested ? "currentColor" : "none"}
            />

            {isInterested ? "Not Interested" : "I'm Interested"}
          </>
        )}
      </Button>
    </section>
  );
}
