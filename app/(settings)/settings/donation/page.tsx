import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  HeartPulse,
  Info,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import DonorAvailability from "@/app/(main)/profile/components/profile-hero/DonorAvailability";
import { getCurrentUser } from "@/database/queries/user.query";

export default async function DonorPreferencesPage() {
  const user = await getCurrentUser();

  if (!user) redirect("/login");

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
          Donor Preferences
        </h1>

        <p className="text-sm text-muted-foreground">
          Manage your blood donation availability and preferences.
        </p>
      </div>

      <div className="space-y-5">
        {/* Availability */}
        <section className="rounded-xl border border-border bg-app-card p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
              <HeartPulse className="size-5" />
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="text-sm font-semibold">Donation Availability</h2>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Let people know whether you are currently available to donate
                blood.
              </p>
            </div>
          </div>

          <div className="mt-5">
            <DonorAvailability
              isAvailableForDonate={user.isAvailableForDonate}
            />
          </div>

          <div className="mt-4 flex items-start gap-2 rounded-lg bg-app-background p-3">
            <Info className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <p className="text-xs leading-relaxed text-muted-foreground">
              Turning on availability allows eligible people to find you in the
              donor directory. You can turn it off whenever you want.
            </p>
          </div>
        </section>

        {/* Eligibility */}
        <section className="rounded-xl border border-border bg-app-card p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-sky-500/10 text-sky-500">
              <ShieldCheck className="size-4.5" />
            </div>

            <div>
              <h2 className="text-sm font-semibold">Donation Eligibility</h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Requirements for becoming an available donor.
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-500" />
              <div>
                <p className="text-sm font-medium">Complete your profile</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Required personal, medical and location information must be
                  provided.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <UserRound className="mt-0.5 size-4 shrink-0 text-emerald-500" />
              <div>
                <p className="text-sm font-medium">Minimum age: 18 years</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  You must be at least 18 years old to become an available
                  donor.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CalendarDays className="mt-0.5 size-4 shrink-0 text-emerald-500" />
              <div>
                <p className="text-sm font-medium">90-day donation interval</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  You cannot enable availability within 90 days of your last
                  recorded donation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Profile Information */}
        <section className="flex flex-col gap-3 rounded-xl border border-border bg-app-card p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="flex items-start gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-app-primary/10 text-app-primary">
              <AlertCircle className="size-4.5" />
            </div>

            <div>
              <h2 className="text-sm font-semibold">
                Keep Your Information Updated
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Make sure your blood group, contact information and location are
                accurate.
              </p>
            </div>
          </div>

          <Link
            href="/settings/personal"
            className="inline-flex h-9 shrink-0 items-center justify-center rounded-lg border border-border px-3 text-xs font-medium transition-colors hover:bg-app-background"
          >
            Update Profile
          </Link>
        </section>
      </div>
    </div>
  );
}
