import { UserProfile } from "@/types/user.type";
import { Mail, UserRound } from "lucide-react";

interface AccountInfoItemProps {
  label: string;
  value?: string | null;
  icon: React.ElementType;
}

function AccountInfoItem({ label, value, icon: Icon }: AccountInfoItemProps) {
  return (
    <div className="min-w-0 rounded-lg bg-app-background/60 px-3.5 py-3">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>

      <div className="mt-1.5 flex min-w-0 items-center gap-2 text-sm font-medium">
        <Icon className="size-3.5 shrink-0 text-muted-foreground" />
        <span className="min-w-0 break-all">{value || "Not available"}</span>
      </div>
    </div>
  );
}

export default function AccountInformation({ user }: { user: UserProfile }) {
  return (
    <section className="rounded-xl border border-border bg-app-card p-4 sm:p-5">
      <div className="flex items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-lg bg-app-primary/10 text-app-primary">
          <UserRound className="size-4.5" />
        </div>

        <div>
          <h2 className="text-sm font-semibold">Account Information</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Your basic account details.
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <AccountInfoItem label="Full Name" value={user.name} icon={UserRound} />

        <AccountInfoItem
          label="Username"
          value={user.username ? `@${user.username}` : undefined}
          icon={UserRound}
        />

        <div className="sm:col-span-2">
          <AccountInfoItem
            label="Email Address"
            value={user.email}
            icon={Mail}
          />
        </div>
      </div>
    </section>
  );
}
