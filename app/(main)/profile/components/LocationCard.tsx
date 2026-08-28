import { Card, CardContent } from "@/components/ui/card";
import { UserProfile } from "@/types/user.type";
import { MapPin, MapPinned, Navigation } from "lucide-react";
import ProfileCardHeader from "./ProfileCardHeader";

function LocationItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value?: string | null;
}) {
  return (
    <div className="flex min-w-0 items-start gap-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-muted/50 text-muted-foreground">
        <Icon className="size-4" />
      </div>

      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>

        <p className="mt-0.5 truncate text-sm font-medium text-foreground">
          {value || "Not provided"}
        </p>
      </div>
    </div>
  );
}

export default function LocationCard({ user }: { user: UserProfile }) {
  return (
    <Card className="border-border/60 bg-app-card shadow-sm">
      <ProfileCardHeader
        icon={<MapPin className="size-4" />}
        title="Location"
        description="Your current location information"
        defaultTab="location"
        user={user}
      />

      <CardContent className="grid gap-x-5 gap-y-5 border-t border-border/50 pt-5 sm:grid-cols-3">
        <LocationItem
          icon={MapPinned}
          label="District"
          value={user.location?.district}
        />

        <LocationItem
          icon={MapPin}
          label="Area / Thana"
          value={user.location?.area}
        />

        <LocationItem
          icon={Navigation}
          label="Address"
          value={user.location?.address}
        />
      </CardContent>
    </Card>
  );
}
