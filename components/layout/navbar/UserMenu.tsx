"use client";

import { LogOut, Pencil, Settings, User } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { SessionUser } from "@/types/user.type";

const menuItems = [
  {
    label: "My Profile",
    href: "/profile",
    icon: User,
  },
  {
    label: "Edit Profile",
    href: "/profile/edit",
    icon: Pencil,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export default function UserMenu({ user }: { user: SessionUser }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Open user menu"
          className="rounded-full outline-none ring-offset-background transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <Avatar className="size-10 border border-border">
            <AvatarImage
              src={user?.image ?? "/avatars/default.png"}
              alt={user?.name ?? "User avatar"}
            />

            <AvatarFallback>
              {user?.name?.charAt(0).toUpperCase() ?? "U"}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64 rounded-2xl p-2">
        <DropdownMenuLabel className="space-y-1 rounded-xl px-3 py-3">
          <p className="truncate text-sm font-semibold">
            {user?.name ?? "User"}
          </p>

          <p className="truncate text-xs text-muted-foreground">
            {user?.email}
          </p>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <DropdownMenuItem
                key={item.href}
                asChild
                className="cursor-pointer rounded-lg"
              >
                <Link href={item.href}>
                  <Icon className="size-4" />
                  <span>{item.label}</span>
                </Link>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => signOut({ redirectTo: "/" })}
          className="cursor-pointer rounded-lg text-destructive focus:text-destructive"
        >
          <LogOut className="size-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
