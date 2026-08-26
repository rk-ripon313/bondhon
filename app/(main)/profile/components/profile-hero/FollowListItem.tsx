"use client";

import { Button } from "@/components/ui/button";
import { UserConnection } from "@/types/user.type";

import Image from "next/image";
import Link from "next/link";

type ConnectionType = "followers" | "following";

interface FollowListItemProps {
  user: UserConnection;
  type: ConnectionType;
}

export default function FollowListItem({ user, type }: FollowListItemProps) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-app-card">
      {/* User */}
      <div className="flex min-w-0 items-center gap-3">
        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-border bg-app-card">
          <Link
            href={user?.username ? `/profile/${user.username}` : ""}
            className="absolute inset-0 z-10"
          >
            <Image
              src={user?.image || "/avatars/default.png"}
              alt={user?.name || "User avatar"}
              fill
              sizes="40px"
              className="object-cover"
            />
          </Link>
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-app-foreground">
            {user?.name || "Unknown User"}
          </p>
        </div>
      </div>

      {/* Action */}
      {type === "following" ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 shrink-0 rounded-lg px-3 text-xs cursor-pointer"
        >
          Unfollow
        </Button>
      ) : (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 shrink-0 rounded-lg px-3 text-xs cursor-pointer"
        >
          Block
        </Button>
      )}
    </div>
  );
}
