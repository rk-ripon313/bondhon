import {
  ArrowUpRight,
  CalendarDays,
  Droplets,
  Mail,
  MapPin,
  Settings,
  UserRound,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/database/queries/user.query";
import { formatDate } from "@/lib/helpers/date";
import { formatLocation } from "@/lib/helpers/location-format";
import SettingsNavigation from "../components/SettingsNavigation";

export default async function SettingsPage() {
  const user = await getCurrentUser();

  if (!user) redirect("/login");

  const overviewItems = [
    {
      label: "Email address",
      value: user.email,
      icon: Mail,
    },
    {
      label: "Blood group",
      value: user.bloodGroup || "Not added",
      icon: Droplets,
    },
    {
      label: "Location",
      value: formatLocation(user.location),
      icon: MapPin,
    },
    {
      label: "Member since",
      value: formatDate(user.createdAt),
      icon: CalendarDays,
    },
  ];

  return (
    <>
      {/* Mobile Settings Categories */}
      <div className="md:hidden">
        <div className="mb-4">
          <h1 className="text-lg font-semibold">Settings</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your preferences and account settings.
          </p>
        </div>

        <SettingsNavigation variant="list" />
      </div>

      {/* Desktop & Tablet Overview */}
      <div className="hidden space-y-5 md:block">
        {/* Profile Summary */}
        <div className="rounded-xl border border-border bg-app-card p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative size-16 shrink-0 overflow-hidden rounded-full border border-border bg-app-muted">
              <Image
                src={user.image || "/avatars/default.png"}
                alt={user.name}
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>

            <div className="min-w-0 flex-1">
              <h1 className="truncate text-lg font-semibold tracking-tight">
                {user.name}
              </h1>
              <p className="mt-0.5 truncate text-sm text-muted-foreground">
                @{user.username}
              </p>
              {user.nickname && (
                <p className="mt-1 text-xs text-muted-foreground">
                  {user.nickname}
                </p>
              )}
            </div>

            <Link
              href="/settings/personal"
              className="inline-flex h-9 shrink-0 items-center gap-2 rounded-lg border border-border px-3 text-sm font-medium transition-colors hover:bg-app-background"
            >
              <UserRound className="size-4" />
              Edit Profile
              <ArrowUpRight className="size-3.5" />
            </Link>
          </div>
        </div>

        {/* Account Overview */}
        <div className="rounded-xl border border-border bg-app-card p-5 sm:p-6">
          <div className="mb-5">
            <h2 className="text-base font-semibold tracking-tight">
              Account Overview
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              A quick overview of your account information.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {overviewItems.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="flex min-w-0 items-start gap-3 rounded-lg border border-border p-3"
                >
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-app-background text-muted-foreground">
                    <Icon className="size-4" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">
                      {item.label}
                    </p>
                    <p className="mt-1 break-words text-sm font-medium">
                      {item.value}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Settings Guide */}
        <div className="rounded-xl border border-border bg-app-card p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-app-primary/10 text-app-primary">
              <Settings className="size-5" />
            </div>

            <div>
              <h2 className="text-base font-semibold tracking-tight">
                Manage Your Settings
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Choose a category from the sidebar to manage your preferences.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
