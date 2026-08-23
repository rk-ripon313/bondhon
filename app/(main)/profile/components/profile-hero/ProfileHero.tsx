import { UserProfile } from "@/types/user.type";
import DonorAvailability from "./DonorAvailability";
import ProfileAvatar from "./ProfileAvatar";
import ProfileCompletion from "./ProfileCompletion";
import ProfileMeta from "./ProfileMeta";
import ProfileStats from "./ProfileStats";

export default function ProfileHero({ user }: { user: UserProfile }) {
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
          <ProfileAvatar
            name={user?.name}
            image={user?.image}
            isAvailableForDonate={user?.isAvailableForDonate}
          />
          <ProfileMeta user={user} />
        </div>

        {/* Donor availability */}
        <DonorAvailability isAvailableForDonate={user?.isAvailableForDonate} />
      </div>

      {/* Stats */}
      <ProfileStats
        followersCount={user.followers?.length ?? 0}
        followingCount={user.following?.length ?? 0}
        donationsCount={user.totalDonations ?? 0}
      />

      {/* Profile completion */}
      <ProfileCompletion user={user} />
    </div>
  );
}
