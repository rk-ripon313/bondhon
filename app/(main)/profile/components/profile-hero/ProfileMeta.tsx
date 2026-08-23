import { UserProfile } from "@/types/user.type";
import { Droplet, MapPin } from "lucide-react";

export default function ProfileMeta({user}: {user :  UserProfile} ) {
  return (
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
  );
}