import { UserProfile } from "@/types/user.type";
import { AtSign, Droplet, MapPin } from "lucide-react";

export default function ProfileMeta({ user }: { user: UserProfile }) {
  return (
    <div className="min-w-0 space-y-2">
      {/* Name */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
        <h2 className="text-xl font-bold tracking-tight text-app-foreground sm:text-2xl">
          {user?.name || "Unnamed User"}
        </h2>

        {user?.nickname && (
          <span className="rounded-full border border-app-primary/20 bg-app-primary/10 px-2 py-0.5 text-xs font-medium text-app-primary">
            {user.nickname}
          </span>
        )}
      </div>

      {/* Username */}
      {user?.username && (
        <div className="flex items-center justify-center gap-1 text-xs text-app-muted sm:justify-start">
          <AtSign className="h-3 w-3" />
          <span>{user.username}</span>
        </div>
      )}

      {/* Meta information */}
      <div className="flex flex-wrap items-center justify-center gap-2 pt-1 sm:justify-start">
        {/* Location */}
        {user?.location?.area || user?.location?.district ? (
          <span className="flex items-center gap-1.5 rounded-lg border border-border bg-app-background px-2.5 py-1.5 text-xs text-app-muted">
            <MapPin className="h-3.5 w-3.5 shrink-0" />

            <span>
              {user.location.area && user.location.district
                ? `${user.location.area}, ${user.location.district}`
                : user.location.area || user.location.district}
            </span>
          </span>
        ) : null}

        {/* Blood group */}
        {user?.bloodGroup && (
          <span className="flex items-center gap-1.5 rounded-lg border border-app-primary/20 bg-app-primary/10 px-2.5 py-1.5 text-xs font-bold text-app-primary">
            <Droplet className="h-3.5 w-3.5 text-red-600" />
            {user.bloodGroup}
          </span>
        )}
      </div>
    </div>
  );
}
