import { Progress } from "@/components/ui/progress";
import {
  calculateProfileCompletion,
  isUserEligibleForAction,
} from "@/lib/profile/profile-utils";
import { UserProfile } from "@/types/user.type";
import { AlertCircle, CheckCircle2, ShieldCheck } from "lucide-react";

export default function ProfileCompletion({ user }: { user: UserProfile }) {
  const completionPercentage = calculateProfileCompletion(user);
  const isEligibleForAction = isUserEligibleForAction(user);

  return (
    <div className="relative mt-6 border-t border-border pt-5">
      <div className="mb-2 flex items-center justify-between gap-3 text-xs">
        <span className="flex items-center gap-1.5 text-app-muted">
          {isEligibleForAction ? (
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
          ) : (
            <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
          )}
          Profile Completion
        </span>

        <span
          className={`font-bold ${
            isEligibleForAction ? "text-emerald-500" : "text-amber-500"
          }`}
        >
          {completionPercentage}%
        </span>
      </div>

      <Progress
        value={completionPercentage}
        className="h-2 bg-app-background"
      />

      {/* Profile status */}
      {!isEligibleForAction ? (
        <div className="mt-3 flex items-center gap-2 text-[11px] text-app-muted">
          <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
          Complete your required information to participate in BondhOn
          activities.
        </div>
      ) : completionPercentage < 100 ? (
        <div className="mt-3 flex items-center gap-2 text-[11px] text-app-muted">
          <ShieldCheck className="h-3.5 w-3.5 text-app-secondary" />
          Your profile is ready for BondhOn. Complete the remaining information
          to finish your profile.
        </div>
      ) : (
        <div className="mt-3 flex items-center gap-2 text-[11px] text-emerald-500">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Your profile is complete and ready for BondhOn.
        </div>
      )}
    </div>
  );
}
