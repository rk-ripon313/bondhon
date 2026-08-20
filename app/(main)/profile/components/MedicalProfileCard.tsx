import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserProfile } from "@/types/user.type";
import {
  Award,
  CheckCircle2,
  Droplet,
  Pencil,
  Ruler,
  Scale,
  XCircle,
} from "lucide-react";

export default function MedicalProfileCard({ user }: { user: UserProfile }) {
  const formatDate = (date?: Date | string) => {
    if (!date) return "Never";

    return new Date(date).toLocaleDateString("en-BD", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <Card className="border-border/60 bg-app-card shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between gap-4 pb-4">
        <div className="flex min-w-0 items-start gap-3">
          {/* Header Icon */}
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-muted/50 text-muted-foreground">
            <Droplet className="size-4" />
          </div>

          <div className="min-w-0">
            <CardTitle className="text-base font-semibold">
              Medical & Donor Profile
            </CardTitle>

            <p className="mt-1 text-xs text-muted-foreground">
              Your medical and donor information
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

      <CardContent className="space-y-5 border-t border-border/50 pt-5">
        {/* Blood & Donation Summary */}
        <div className="grid grid-cols-2 gap-3 rounded-xl border border-border/50 bg-muted/30 p-3 sm:grid-cols-4">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Blood Group</p>

            <p className="mt-0.5 text-xl font-bold text-rose-600 dark:text-rose-400">
              {user.bloodGroup || "N/A"}
            </p>
          </div>

          <div className="text-center">
            <p className="text-xs text-muted-foreground">Donor Status</p>

            {user.isAvailableForDonate ? (
              <Badge
                variant="outline"
                className="mt-1 gap-1 border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              >
                <CheckCircle2 className="size-3" />
                Available
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="mt-1 gap-1 border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400"
              >
                <XCircle className="size-3" />
                Unavailable
              </Badge>
            )}
          </div>

          <div className="text-center">
            <p className="text-xs text-muted-foreground">Total Donated</p>

            <p className="mt-1 text-sm font-semibold text-foreground">
              {user.totalDonations ?? 0} times
            </p>
          </div>

          <div className="text-center">
            <p className="text-xs text-muted-foreground">Last Donation</p>

            <p className="mt-1 text-xs font-semibold text-foreground">
              {formatDate(user.lastDonationDate)}
            </p>
          </div>
        </div>

        {/* Height & Weight */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-3 rounded-xl border border-border/40 bg-background/40 p-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted/60">
              <Ruler className="size-4 text-muted-foreground" />
            </div>

            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Height</p>

              <p className="mt-0.5 text-sm font-medium">
                {user.height ? `${user.height} cm` : "Not provided"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-border/40 bg-background/40 p-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted/60">
              <Scale className="size-4 text-muted-foreground" />
            </div>

            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Weight</p>

              <p className="mt-0.5 text-sm font-medium">
                {user.weight ? `${user.weight} kg` : "Not provided"}
              </p>
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="border-t border-border/50 pt-4">
          <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Award className="size-4 text-amber-500" />
            Earned Badges
          </p>

          <div className="flex flex-wrap gap-1.5">
            {user.badges?.length ? (
              user.badges.map((badge: string) => (
                <Badge
                  key={badge}
                  variant="secondary"
                  className="bg-muted/60 text-[11px] font-medium"
                >
                  {badge}
                </Badge>
              ))
            ) : (
              <p className="text-xs italic text-muted-foreground">
                No badges earned yet
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
