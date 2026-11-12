"use client";

import {
  Bell,
  ChevronRight,
  Droplets,
  Palette,
  ShieldCheck,
  UserRound,
  UserRoundCog,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const settingsItems = [
  {
    title: "Personal Information",
    description: "Manage your personal and profile information",
    href: "/settings/personal",
    icon: UserRound,
  },
  {
    title: "Notifications",
    description: "Manage your notification preferences and sound",
    href: "/settings/notifications",
    icon: Bell,
  },
  {
    title: "Privacy",
    description: "Manage your privacy and blocked users",
    href: "/settings/privacy",
    icon: ShieldCheck,
  },
  {
    title: "Donor Preferences",
    description: "Manage your donation availability",
    href: "/settings/donation",
    icon: Droplets,
  },
  {
    title: "Appearance",
    description: "Customize your application theme",
    href: "/settings/appearance",
    icon: Palette,
  },
  {
    title: "Account & Security",
    description: "Manage your account and security",
    href: "/settings/account",
    icon: UserRoundCog,
  },
];
interface SettingsNavigationProps {
  variant?: "sidebar" | "list";
}

export default function SettingsNavigation({
  variant = "sidebar",
}: SettingsNavigationProps) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {settingsItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`group flex items-center gap-3 rounded-lg transition-colors ${
              variant === "sidebar"
                ? "px-3 py-2.5 md:justify-center lg:justify-start"
                : "p-3"
            } ${
              isActive
                ? "bg-app-primary/10 text-app-primary"
                : "text-muted-foreground hover:bg-app-background hover:text-foreground"
            }`}
          >
            <Icon className="size-5 shrink-0" />

            {variant === "sidebar" ? (
              <span className="hidden truncate text-sm font-medium lg:block">
                {item.title}
              </span>
            ) : (
              <>
                <span className="min-w-0 flex-1">
                  <span
                    className={`block text-sm font-medium ${
                      isActive ? "text-app-primary" : "text-foreground"
                    }`}
                  >
                    {item.title}
                  </span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    {item.description}
                  </span>
                </span>

                <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
              </>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
