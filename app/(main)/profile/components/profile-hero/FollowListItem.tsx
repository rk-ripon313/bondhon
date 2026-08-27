"use client";

import {
  toggleBlock,
  toggleFollow,
} from "@/app/actions/profile/connections.action";
import { Button } from "@/components/ui/button";
import { getErrorMessage } from "@/lib/helpers/error";
import { UserConnection } from "@/types/user.type";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

type ConnectionType = "followers" | "following";

interface FollowListItemProps {
  user: UserConnection;
  type: ConnectionType;
  onRemove?: (username: string) => void;
}

export default function FollowListItem({
  user,
  type,
  onRemove,
}: FollowListItemProps) {
  const [loading, setLoading] = useState(false);

  const handleFollowToggle = async () => {
    if (!user.username || loading) return;

    try {
      setLoading(true);

      const result = await toggleFollow(user.username);

      if (!result.success) {
        throw new Error(result.message);
      }

      toast.success(result.message);

      // update localstate to remove the user from the list if unfollowed
      if (!result.data) {
        onRemove?.(user.username);
      }
    } catch (error) {
      console.error("Follow action error:", error);
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleBlockToggle = async () => {
    if (!user.username || loading) return;

    try {
      setLoading(true);

      const result = await toggleBlock(user.username);

      if (!result.success) {
        throw new Error(result.message);
      }

      toast.success(result.message);

      // update localstate to remove the user from the list if blocked
      if (result.data) {
        onRemove?.(user.username);
      }
    } catch (error) {
      console.error("Block action error:", error);
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-app-card">
      {/* User */}
      <div className="flex min-w-0 items-center gap-3">
        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-border bg-app-card">
          <Link
            href={user.username ? `/profile/${user.username}` : "#"}
            className="absolute inset-0 z-10"
          >
            <Image
              src={user.image || "/avatars/default.png"}
              alt={user.name || "User avatar"}
              fill
              sizes="40px"
              className="object-cover"
            />
          </Link>
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-app-foreground">
            {user.name || "Unknown User"}
          </p>
        </div>
      </div>

      {/* Action */}
      {type === "following" ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={loading}
          onClick={handleFollowToggle}
          className="h-8 shrink-0 cursor-pointer rounded-lg px-3 text-xs"
        >
          {loading ? "..." : "Unfollow"}
        </Button>
      ) : (
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={loading}
          onClick={handleBlockToggle}
          className="h-8 shrink-0 cursor-pointer rounded-lg px-3 text-xs"
        >
          {loading ? "..." : "Block"}
        </Button>
      )}
    </div>
  );
}
