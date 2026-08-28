"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserProfile } from "@/types/user.type";

interface MedicalTabProps {
  user: UserProfile;
  onSuccess: () => void;
}

export default function MedicalTab({ user, onSuccess }: MedicalTabProps) {
  return (
    <div className="space-y-6">
      {/* Editable Medical Information */}
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Medical Information
          </h3>

          <p className="mt-1 text-xs text-muted-foreground">
            Keep your medical information up to date.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {/* Blood Group */}
          <div className="space-y-2">
            <Label htmlFor="bloodGroup">Blood Group</Label>

            <Input
              id="bloodGroup"
              defaultValue={user.bloodGroup ?? ""}
              placeholder="Select blood group"
            />
          </div>

          {/* Height */}
          <div className="space-y-2">
            <Label htmlFor="height">Height</Label>

            <div className="relative">
              <Input
                id="height"
                type="number"
                defaultValue={user.height ?? ""}
                placeholder="Enter height"
                className="pr-12"
              />

              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                cm
              </span>
            </div>
          </div>

          {/* Weight */}
          <div className="space-y-2">
            <Label htmlFor="weight">Weight</Label>

            <div className="relative">
              <Input
                id="weight"
                type="number"
                defaultValue={user.weight ?? ""}
                placeholder="Enter weight"
                className="pr-12"
              />

              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                kg
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Donation Information */}
      <div className="border-t border-border/50 pt-5">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-foreground">
            Donation Information
          </h3>

          <p className="mt-1 text-xs text-muted-foreground">
            These details are managed automatically by BondhOn.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-border/50 bg-muted/30 p-3">
            <p className="text-xs text-muted-foreground">Total Donations</p>

            <p className="mt-1 text-sm font-semibold">
              {user.totalDonations ?? 0} times
            </p>
          </div>

          <div className="rounded-xl border border-border/50 bg-muted/30 p-3">
            <p className="text-xs text-muted-foreground">Last Donation</p>

            <p className="mt-1 text-sm font-semibold">
              {user.lastDonationDate
                ? new Date(user.lastDonationDate).toLocaleDateString("en-BD", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "Never"}
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end border-t border-border/50 pt-5">
        <Button type="button" onClick={onSuccess} className="cursor-pointer">
          Save Changes
        </Button>
      </div>
    </div>
  );
}
