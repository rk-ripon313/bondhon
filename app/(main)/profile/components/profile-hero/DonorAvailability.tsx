"use client";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

export default function DonorAvailability({
  isAvailableForDonate = false,
}: {
  isAvailableForDonate?: boolean;
}) {
  const [isAvailable, setIsAvailable] = useState(isAvailableForDonate ?? true);

  const handleToggleAvailability = async (checked: boolean) => {
    setIsAvailable(checked);

    // TODO: Server Action
    // await updateDonorAvailability(checked);
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
        aria-label="Toggle donor availability"
      />
    </div>
  );
}
