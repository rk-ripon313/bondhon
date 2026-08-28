"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserProfile } from "@/types/user.type";
import { MapPin, Navigation } from "lucide-react";

interface LocationTabProps {
  user: UserProfile;
  onSuccess: () => void;
}

export default function LocationTab({ user, onSuccess }: LocationTabProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-foreground">
          Location Information
        </h3>

        <p className="mt-1 text-xs text-muted-foreground">
          Update your current location information.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {/* District */}
        <div className="space-y-2">
          <Label htmlFor="district">District</Label>

          <Input
            id="district"
            defaultValue={user.location?.district ?? ""}
            placeholder="Select district"
          />
        </div>

        {/* Area */}
        <div className="space-y-2">
          <Label htmlFor="area">Area / Thana</Label>

          <Input
            id="area"
            defaultValue={user.location?.area ?? ""}
            placeholder="Select area"
          />
        </div>

        {/* Address */}
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="address">Address</Label>

          <Input
            id="address"
            defaultValue={user.location?.address ?? ""}
            placeholder="Enter your address"
          />
        </div>
      </div>

      {/* Current Location */}
      <div className="rounded-xl border border-border/50 bg-muted/30 p-4">
        <div className="flex items-start gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-background">
            <MapPin className="size-4 text-muted-foreground" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium">Use your current location</p>

            <p className="mt-1 text-xs text-muted-foreground">
              Automatically detect and update your operational area.
            </p>

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-3 cursor-pointer gap-1.5"
            >
              <Navigation className="size-3.5" />
              Find My Location
            </Button>
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
