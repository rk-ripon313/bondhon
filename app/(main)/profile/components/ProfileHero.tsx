"use client";

import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import {
  calculateProfileCompletion,
  isUserEligibleForAction,
} from "@/lib/profile/profile-utils";
import { UserProfile } from "@/types/user.type";
import {
  AlertCircle,
  CheckCircle2,
  Droplet,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function ProfileHero({ user }: { user: UserProfile }) {
  const completionPercentage = calculateProfileCompletion(user);
  const isEligibleForAction = isUserEligibleForAction(user);

  const [isAvailable, setIsAvailable] = useState(
    user?.isAvailableForDonate ?? true,
  );

  const handleToggleAvailability = async (checked: boolean) => {
    setIsAvailable(checked);

    // TODO: Server Action
    // await updateDonorAvailability(checked);
  };

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-border bg-app-card p-5 shadow-sm sm:p-6">
      {/* Background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-app-primary/10 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 left-1/3 h-40 w-40 rounded-full bg-app-secondary/5 blur-3xl"
      />

      {/* Main profile header */}
      <div className="relative flex flex-col items-center justify-between gap-6 md:flex-row md:items-start">
        {/* User information */}
        <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="rounded-2xl bg-gradient-to-br from-app-primary/30 via-border to-app-secondary/20 p-[2px]">
              <Image
                src={user?.image || "/avatars/default.png"}
                alt={user?.name || "User avatar"}
                width={112}
                height={112}
                className="h-24 w-24 rounded-[14px] border border-border bg-background object-cover sm:h-28 sm:w-28"
              />
            </div>

            {/* Online / available indicator */}
            {isAvailable && (
              <span className="absolute -bottom-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-app-card bg-emerald-500">
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
              </span>
            )}
          </div>

          {/* Meta */}
          <div className="min-w-0 space-y-2">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <h2 className="text-xl font-bold tracking-tight text-app-foreground sm:text-2xl">
                {user?.name || "Unnamed User"}
              </h2>

              {user?.nickname && (
                <span className="rounded-full border border-app-primary/20 bg-app-primary/10 px-2 py-0.5 text-xs font-medium text-app-primary">
                  ({user.nickname})
                </span>
              )}
            </div>

            <p className="truncate text-sm text-app-muted">{user?.email}</p>

            <div className="flex flex-wrap items-center justify-center gap-2 pt-1 sm:justify-start">
              {/* Location */}
              <span className="flex items-center gap-1.5 rounded-lg border border-border bg-app-background px-2.5 py-1.5 text-xs text-app-muted">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span>
                  {user?.location?.area || "Area not set"},{" "}
                  {user?.location?.district || "District not set"}
                </span>
              </span>

              {/* Blood group */}
              <span className="flex items-center gap-1.5 rounded-lg border border-app-primary/20 bg-app-primary/10 px-2.5 py-1.5 text-xs font-bold text-app-primary">
                <span>
                  <Droplet className="h-3.5 w-3.5 shrink-0 text-red-600" />
                </span>
                {user?.bloodGroup || "Not Set"}
              </span>
            </div>
          </div>
        </div>

        {/* Donor availability */}
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
      </div>

      {/* Stats */}
      <div className="relative mt-6 grid grid-cols-3 divide-x divide-border rounded-xl border border-border bg-app-background p-3 text-center">
        <div className="px-2">
          <p className="text-xs text-app-muted">Followers</p>
          <p className="mt-0.5 text-base font-bold text-app-foreground">
            {user?.followers?.length || 0}
          </p>
        </div>

        <div className="px-2">
          <p className="text-xs text-app-muted">Following</p>
          <p className="mt-0.5 text-base font-bold text-app-foreground">
            {user?.following?.length || 0}
          </p>
        </div>

        <div className="px-2">
          <p className="text-xs text-app-muted">Donations</p>
          <p className="mt-0.5 text-base font-bold text-app-primary">
            {user?.totalDonations || 0}
          </p>
        </div>
      </div>

      {/* Profile completion */}
      <div className="relative mt-6 border-t border-border pt-5">
        <div className="mb-2 flex items-center justify-between gap-3 text-xs">
          <span className="flex items-center gap-1.5 text-app-muted">
            {isEligibleForAction ? (
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            ) : (
              <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
            )}
            Profile Completion
          </span>

          <span
            className={`font-bold ${
              isEligibleForAction ? "text-emerald-500" : "text-amber-500"
            }`}
          >
            {completionPercentage}%
          </span>
        </div>

        <Progress
          value={completionPercentage}
          className="h-2 bg-app-background"
        />

        {/* Profile status */}
        {!isEligibleForAction ? (
          <div className="mt-3 flex items-center gap-2 text-[11px] text-app-muted">
            <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
            Complete your required information to participate in BondhOn
            activities.
          </div>
        ) : completionPercentage < 100 ? (
          <div className="mt-3 flex items-center gap-2 text-[11px] text-app-muted">
            <ShieldCheck className="h-3.5 w-3.5 text-app-secondary" />
            Your profile is ready for BondhOn. Complete the remaining
            information to finish your profile.
          </div>
        ) : (
          <div className="mt-3 flex items-center gap-2 text-[11px] text-emerald-500">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Your profile is complete and ready for BondhOn.
          </div>
        )}
      </div>
    </div>
  );
}
