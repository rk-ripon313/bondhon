"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserProfile } from "@/types/user.type";

interface PersonalTabProps {
  user: UserProfile;
  onSuccess: () => void;
}

export default function PersonalTab({ user, onSuccess }: PersonalTabProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-5 sm:grid-cols-2">
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>

          <Input
            id="name"
            defaultValue={user.name ?? ""}
            placeholder="Enter your full name"
          />
        </div>

        {/* Username */}
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>

          <div className="flex gap-2">
            <Input
              id="username"
              defaultValue={user.username ?? ""}
              placeholder="Enter username"
            />

            <Button
              type="button"
              variant="outline"
              className="shrink-0 cursor-pointer"
            >
              Check
            </Button>
          </div>

          <p className="text-[11px] text-muted-foreground">
            Username must be unique.
          </p>
        </div>

        {/* Nickname */}
        <div className="space-y-2">
          <Label htmlFor="nickname">Nickname</Label>

          <Input
            id="nickname"
            defaultValue={user.nickname ?? ""}
            placeholder="Enter your nickname"
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>

          <Input
            id="email"
            value={user.email}
            disabled
            className="cursor-not-allowed opacity-70"
          />

          <p className="text-[11px] text-muted-foreground">
            Email address cannot be changed.
          </p>
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>

          <Input
            id="phone"
            defaultValue={user.phone ?? ""}
            placeholder="01XXXXXXXXX"
          />
        </div>

        {/* Gender */}
        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>

          <Input
            id="gender"
            defaultValue={user.gender ?? ""}
            placeholder="Select gender"
          />
        </div>

        {/* Date of Birth */}
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="dateOfBirth">Date of Birth</Label>

          <Input
            id="dateOfBirth"
            type="date"
            defaultValue={
              user.dateOfBirth
                ? new Date(user.dateOfBirth).toISOString().split("T")[0]
                : ""
            }
          />
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
