import {
  Droplets,
  Ellipsis,
  Flag,
  MapPin,
  MessageCircle,
  Share2,
  ShieldAlert,
  UserPlus,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";

import { getInitials } from "@/lib/helpers/formet-text";
import { formatLocation } from "@/lib/helpers/location-format";
import { UserProfile } from "@/types/user.type";

export default function UserProfileHero({
  user,
  isOwnProfile,
}: {
  user: UserProfile;
  isOwnProfile: boolean;
}) {
  return (
    <section>
      <Card className="border-border/60 bg-app-card shadow-sm">
        <CardContent className="flex flex-col gap-5 p-5 sm:p-6">
          {/* Profile Header */}
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            {/* User Identity */}
            <div className="flex min-w-0 items-center gap-4">
              <Avatar className="size-20 shrink-0 border-2 border-border sm:size-24">
                <AvatarImage
                  src={user.image || "/avatars/default.png"}
                  alt={user.name}
                />

                <AvatarFallback className="text-lg font-semibold">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0 space-y-1">
                {/* Name + Availability */}
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
                    {user.name}
                  </h1>

                  {user.isAvailableForDonate && (
                    <Badge
                      variant="secondary"
                      className="border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-emerald-600 dark:text-emerald-400"
                    >
                      Available
                    </Badge>
                  )}
                </div>

                {/* Username */}
                <p className="text-sm text-muted-foreground">
                  @{user.username}
                </p>

                {/* Location + Blood Group */}
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 pt-1 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="size-3.5 shrink-0" />
                    {formatLocation(user.location)}
                  </span>

                  <span className="text-border">•</span>

                  <Badge
                    variant="outline"
                    className="border-rose-500/30 px-2 py-0.5 text-[11px] text-rose-500"
                  >
                    <Droplets className="mr-1 size-3" />
                    {user.bloodGroup}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Profile Actions */}
            {!isOwnProfile && (
              <div className="flex w-full flex-wrap items-center gap-2 lg:w-auto lg:pt-1">
                <Button
                  size="sm"
                  className="h-9 min-w-24 cursor-pointer bg-emerald-600 px-4 text-white hover:bg-emerald-700"
                >
                  <UserPlus className="mr-1.5 size-4" />
                  Follow
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  className="h-9 min-w-24 cursor-pointer px-4"
                >
                  <MessageCircle className="mr-1.5 size-4" />
                  Message
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="icon"
                      variant="outline"
                      className="size-9 cursor-pointer"
                    >
                      <Ellipsis className="size-4" />
                      <span className="sr-only">More actions</span>
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem className="cursor-pointer">
                      <Share2 className="mr-2 size-4" />
                      Share Profile
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem className="cursor-pointer">
                      <ShieldAlert className="mr-2 size-4" />
                      Block User
                    </DropdownMenuItem>

                    <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
                      <Flag className="mr-2 size-4" />
                      Report User
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>

          <Separator />

          {/* Profile Stats */}

          {/* TODO: Extract ProfileStats component later.
              If it becomes reusable across /profile and /user/[username],
              move it to @/components/shared/ProfileStats.tsx. */}

          <div className="grid grid-cols-3 divide-x divide-border rounded-xl border border-border bg-app-background p-2.5 sm:p-3">
            <button
              type="button"
              className="flex min-h-14 cursor-pointer flex-col items-center justify-center rounded-lg px-2 py-2 transition-colors hover:bg-app-card"
            >
              <span className="text-xs text-app-muted">Followers</span>

              <span className="mt-0.5 text-sm font-semibold text-app-foreground sm:text-base">
                {user.followers?.length ?? 0}
              </span>
            </button>

            <button
              type="button"
              className="flex min-h-14 cursor-pointer flex-col items-center justify-center rounded-lg px-2 py-2 transition-colors hover:bg-app-card"
            >
              <span className="text-xs text-app-muted">Following</span>

              <span className="mt-0.5 text-sm font-semibold text-app-foreground sm:text-base">
                {user.following?.length ?? 0}
              </span>
            </button>

            <div className="flex min-h-14 flex-col items-center justify-center px-2 py-2 text-center">
              <span className="text-xs text-app-muted">Donations</span>

              <span className="mt-0.5 text-sm font-semibold text-app-primary sm:text-base">
                {user.donationHistory?.length ?? 0}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
