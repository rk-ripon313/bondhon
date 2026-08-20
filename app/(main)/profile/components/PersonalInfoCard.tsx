import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/helpers/date";
import { UserProfile } from "@/types/user.type";
import { CalendarDays, Mail, Pencil, Phone, UserRound } from "lucide-react";

type Props = {
  user: UserProfile;
};

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

export default function PersonalInfoCard({ user }: Props) {
  return (
    <Card className="border-border/60 bg-app-card shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between gap-4 pb-4">
        <div className="flex min-w-0 items-start gap-3">
          {/* Header Icon */}
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-muted/50 text-muted-foreground">
            <UserRound className="size-4" />
          </div>

          <div className="min-w-0">
            <CardTitle className="text-base font-semibold">
              Personal Information
            </CardTitle>

            <p className="mt-1 text-xs text-muted-foreground">
              Your basic account and personal details
            </p>
          </div>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="shrink-0 gap-1.5 text-xs text-muted-foreground hover:text-foreground bg-app-background cursor-pointer"
        >
          <Pencil className="size-3.5" />
          <span className="hidden sm:inline">Edit</span>
        </Button>
      </CardHeader>

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
