import { ChevronRight, ShieldCheck, UserRoundX } from "lucide-react";
import Link from "next/link";

import { getBlockedUsersCount } from "@/database/queries/user.query";

export default async function PrivacySettingsPage() {
  const blockedCount = await getBlockedUsersCount();

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
          Privacy
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your privacy and control your connections.
        </p>
      </div>

      <section className="overflow-hidden rounded-xl border border-border bg-app-card">
        <div className="border-b border-border px-4 py-4 sm:px-5">
          <h2 className="text-sm font-semibold">Privacy & Safety</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Manage the people you have blocked on BondhOn.
          </p>
        </div>

        <Link
          href="/settings/privacy/blocked"
          className="group flex items-center gap-3 px-4 py-4 transition-colors hover:bg-app-background/70 sm:px-5"
        >
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-app-primary/10 text-app-primary">
            <UserRoundX className="size-5" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-semibold text-foreground">
                Blocked Users
              </h3>
              <span className="rounded-full bg-app-background px-2 py-0.5 text-[11px] font-medium text-app-primary">
                {blockedCount}
              </span>
            </div>

            <p className="mt-1 text-xs text-muted-foreground">
              View and manage people you have blocked.
            </p>
          </div>

          <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
        </Link>
      </section>

      <div className="flex gap-3 rounded-xl border border-border bg-app-card p-4 sm:p-5">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
          <ShieldCheck className="size-4.5" />
        </div>

        <div className="min-w-0 space-y-1">
          <h3 className="text-sm font-semibold">Your privacy matters</h3>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Blocking helps you manage unwanted connections. You can review your
            blocked users and unblock them whenever you choose.
          </p>
        </div>
      </div>
    </div>
  );
}
