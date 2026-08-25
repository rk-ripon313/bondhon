"use client";

import { updateDonorAvailability } from "@/app/actions/profile/update-user.action";
import { Switch } from "@/components/ui/switch";

import { getErrorMessage } from "@/lib/helpers/error";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export default function DonorAvailability({
  isAvailableForDonate = false,
}: {
  isAvailableForDonate?: boolean;
}) {
  const [isAvailable, setIsAvailable] = useState(isAvailableForDonate);
  const [isPending, startTransition] = useTransition();

  const handleToggleAvailability = (checked: boolean) => {
    startTransition(async () => {
      try {
        const result = await updateDonorAvailability(checked);

        if (!result.success) {
          throw new Error(result.message);
        }

        setIsAvailable(checked);

        toast.success(
          checked
            ? "You are now available for donation."
            : "Donor availability turned off.",
        );
      } catch (error) {
        toast.error(getErrorMessage(error));
      }
    });
  };

  return (
    <div className="flex w-full items-center justify-between gap-5 rounded-xl border border-border bg-app-background p-4 sm:w-auto sm:min-w-[220px]">
      <div className="space-y-0.5">
        <p className="text-xs font-semibold text-app-foreground">
          Donor Availability
        </p>

        <p
          className={`text-[11px] font-medium ${
            isAvailable ? "text-emerald-500" : "text-app-muted"
          }`}
        >
          {isAvailable ? "Ready to Donate" : "Currently Inactive"}
        </p>
      </div>

      <Switch
        checked={isAvailable}
        onCheckedChange={handleToggleAvailability}
        disabled={isPending}
        aria-label="Toggle donor availability"
        className="h-5 w-10 rounded-full border border-border bg-app-card p-[2px] data-[state=checked]:bg-emerald-500 cursor-pointer data-[state=checked]:border-emerald-500 data-[state=unchecked]:border-border"
      />
    </div>
  );
}
