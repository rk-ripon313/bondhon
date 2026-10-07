"use client";

import { toggleFollow } from "@/app/actions/profile/connections.action";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { getErrorMessage } from "@/lib/helpers/error";
import { UserConnection } from "@/types/user.type";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

interface FollowListItemProps {
  user: UserConnection;
  type: "followers" | "following";
  onRemove?: (username: string) => void;
}

export default function FollowListItem({
  user,
  type,
  onRemove,
}: FollowListItemProps) {
  const [isFollowing, setIsFollowing] = useState(user.isFollowing);
  const [loading, setLoading] = useState(false);
  const [unfollowConfirmOpen, setUnfollowConfirmOpen] = useState(false);

  const handleFollowToggle = () => {
    if (!user.username || loading) return;

    if (isFollowing) {
      setUnfollowConfirmOpen(true);
      return;
    }

    submitFollowToggle();
  };

  const submitFollowToggle = async () => {
    if (!user.username || loading) return;

    try {
      setLoading(true);

      const result = await toggleFollow(user.username);

      if (!result.success) {
        throw new Error(result.message);
      }

      setIsFollowing(Boolean(result.data));
      setUnfollowConfirmOpen(false);

      toast.success(result.message);

      if (result.data === false) {
        onRemove?.(user.username);
      }
    } catch (error) {
      console.error("Follow action error:", error);
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-app-card">
        {/* User */}
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative size-10 shrink-0 overflow-hidden rounded-full border border-border bg-app-card">
            <Link
              href={user.username ? `/user/${user.username}` : "#"}
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

            <p className="truncate text-xs text-app-muted">@{user.username}</p>
          </div>
        </div>

        {/* Follow Action */}
        {user.isMe ? (
          <span className="px-1 text-xs text-app-muted">You</span>
        ) : (
          <Button
            type="button"
            variant={isFollowing ? "outline" : "default"}
            size="sm"
            disabled={loading}
            onClick={handleFollowToggle}
            className={
              isFollowing
                ? "h-8 shrink-0 cursor-pointer rounded-lg px-3 text-xs"
                : "h-8 shrink-0 cursor-pointer rounded-lg bg-emerald-600 px-3 text-xs text-white hover:bg-emerald-700"
            }
          >
            {loading ? "..." : isFollowing ? "Unfollow" : "Follow"}
          </Button>
        )}
      </div>

      <ConfirmDialog
        open={unfollowConfirmOpen}
        onOpenChange={setUnfollowConfirmOpen}
        title="Unfollow user?"
        description={`Are you sure you want to unfollow @${user.username}?`}
        confirmText="Unfollow"
        cancelText="Cancel"
        loading={loading}
        onConfirm={submitFollowToggle}
      />
    </>
  );
}
