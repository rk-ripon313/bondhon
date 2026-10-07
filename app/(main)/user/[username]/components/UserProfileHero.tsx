import { Droplets, MapPin } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import ProfileStats from "@/components/profile/ProfileStats";
import { getInitials } from "@/lib/helpers/formet-text";
import { formatLocation } from "@/lib/helpers/location-format";
import { UserProfile } from "@/types/user.type";
import UserProfileActions from "./UserProfileActions";

type PublicUserProfile = UserProfile & {
  isOwnProfile: boolean;
  isFollowing: boolean;
};

export default function UserProfileHero({ user }: { user: PublicUserProfile }) {
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
            {!user.isOwnProfile && (
              <UserProfileActions
                username={user.username}
                isFollowing={user.isFollowing}
              />
            )}
          </div>

          <Separator />

          {/* Profile Stats */}
          <ProfileStats
            username={user.username}
            followersCount={user.followers?.length ?? 0}
            followingCount={user.following?.length ?? 0}
            donationsCount={user.donationHistory?.length ?? 0}
          />
        </CardContent>
      </Card>
    </section>
  );
}
