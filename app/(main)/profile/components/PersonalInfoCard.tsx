import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/helpers/date";
import { UserProfile } from "@/types/user.type";
import { CalendarDays, Mail, Phone, UserRound } from "lucide-react";
import ProfileCardHeader from "./ProfileCardHeader";

function InfoItem({
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

export default function PersonalInfoCard({ user }: { user: UserProfile }) {
  return (
    <Card className="border-border/60 bg-app-card shadow-sm">
      <ProfileCardHeader
        icon={<UserRound className="size-4" />}
        title="Personal Information"
        description="Your basic account and personal details"
        defaultTab="personal"
        user={user}
      />

      <CardContent className="grid gap-x-5 gap-y-5 border-t border-border/50 pt-5 sm:grid-cols-2">
        <InfoItem icon={Mail} label="Email Address" value={user.email} />

        <InfoItem icon={Phone} label="Phone Number" value={user.phone} />

        <InfoItem icon={UserRound} label="Gender" value={user.gender} />

        <InfoItem
          icon={CalendarDays}
          label="Date of Birth"
          value={formatDate(user.dateOfBirth)}
        />
      </CardContent>
    </Card>
  );
}
