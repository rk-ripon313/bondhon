import { CheckCircle2, Droplets, MapPin, Users } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatLocation } from "@/lib/helpers/location-format";
import { UserProfile } from "@/types/user.type";

export default function UserSidebar({ user }: { user: UserProfile }) {
  return (
    <aside className="space-y-5">
      {/* About */}
      <Card className="border-border/60 bg-app-card shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">About</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <ProfileInfoRow
            icon={MapPin}
            label="Location"
            value={formatLocation(user.location)}
            iconClassName="text-sky-500"
            iconBgClassName="bg-sky-500/10"
          />

          <ProfileInfoRow
            icon={Droplets}
            label="Blood Group"
            value={user.bloodGroup ?? "Not specified"}
            iconClassName="text-rose-500"
            iconBgClassName="bg-rose-500/10"
          />

          <ProfileInfoRow
            icon={Users}
            label="Community"
            value="BondhOn Member"
            iconClassName="text-violet-500"
            iconBgClassName="bg-violet-500/10"
          />

          <ProfileInfoRow
            icon={CheckCircle2}
            label="Membership"
            value="Verified Member"
            iconClassName="text-emerald-500"
            iconBgClassName="bg-emerald-500/10"
          />
        </CardContent>
      </Card>

      {/* Donation Journey */}
      <Card className="border-border/60 bg-app-card shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Donation Journey</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="rounded-xl border border-emerald-500/15 bg-emerald-500/5 p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/10">
                <Droplets className="size-5 text-emerald-500" />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-semibold">
                  {user.donationHistory?.length ?? 0} Donations
                </p>

                <p className="mt-0.5 text-xs text-muted-foreground">
                  Blood donations completed
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </aside>
  );
}

function ProfileInfoRow({
  icon: Icon,
  label,
  value,
  iconClassName,
  iconBgClassName,
}: {
  icon: typeof MapPin;
  label: string;
  value: string;
  iconClassName: string;
  iconBgClassName: string;
}) {
  return (
    <div className="flex min-w-0 items-start gap-3">
      <div
        className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg ${iconBgClassName}`}
      >
        <Icon className={`size-4 ${iconClassName}`} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>

        <p className="mt-0.5 break-words text-sm font-medium text-app-foreground">
          {value}
        </p>
      </div>
    </div>
  );
}
