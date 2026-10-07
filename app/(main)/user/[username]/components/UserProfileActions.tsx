"use client";

import {
  toggleBlock,
  toggleFollow,
} from "@/app/actions/profile/connections.action";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getErrorMessage } from "@/lib/helpers/error";
import {
  Check,
  Ellipsis,
  Flag,
  Loader2,
  MessageCircle,
  Share2,
  ShieldAlert,
  UserPlus,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface UserProfileActionsProps {
  username: string;
  isFollowing: boolean;
}

export default function UserProfileActions({
  username,
  isFollowing: initialIsFollowing,
}: UserProfileActionsProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [loading, setLoading] = useState(false);

  const [unfollowConfirmOpen, setUnfollowConfirmOpen] = useState(false);
  const [blockConfirmOpen, setBlockConfirmOpen] = useState(false);

  const handleFollowToggle = async () => {
    if (loading) return;

    if (isFollowing) {
      setUnfollowConfirmOpen(true);
      return;
    }

    await submitFollowToggle();
  };

  const submitFollowToggle = async () => {
    try {
      setLoading(true);

      const result = await toggleFollow(username);

      if (!result.success) {
        throw new Error(result.message);
      }

      setIsFollowing(Boolean(result.data));
      setUnfollowConfirmOpen(false);

      toast.success(result.message);
    } catch (error) {
      console.error("Follow action error:", error);
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleBlock = async () => {
    if (loading) return;

    try {
      setLoading(true);

      const result = await toggleBlock(username);

      if (!result.success) {
        throw new Error(result.message);
      }

      setBlockConfirmOpen(false);

      toast.success(result.message);
    } catch (error) {
      console.error("Block action error:", error);
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: `${username}'s Profile - BondhOn`,
      text: `Check out @${username}'s profile on BondhOn.`,
      url: `${window.location.origin}/user/${username}`,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        toast.success("Profile shared successfully!");
      } else {
        await navigator.clipboard.writeText(shareData.url);
        toast.success("Link copied to clipboard! Share it anywhere.");
      }
    } catch (error) {
      console.error("Error sharing profile:", error);
    }
  };

  return (
    <>
      <div className="flex w-full flex-wrap items-center gap-2 lg:w-auto lg:pt-1">
        {/* Follow / Unfollow */}
        <Button
          type="button"
          size="sm"
          variant={isFollowing ? "outline" : "default"}
          disabled={loading}
          onClick={handleFollowToggle}
          className={
            isFollowing
              ? "h-9 min-w-24 cursor-pointer px-4"
              : "h-9 min-w-24 cursor-pointer bg-emerald-600 px-4 text-white hover:bg-emerald-700"
          }
        >
          {loading ? (
            <Loader2 className="mr-1.5 size-4 animate-spin" />
          ) : isFollowing ? (
            <Check className="mr-1.5 size-4" />
          ) : (
            <UserPlus className="mr-1.5 size-4" />
          )}

          {isFollowing ? "Following" : "Follow"}
        </Button>

        {/* Message */}
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled
          className="h-9 min-w-24 cursor-not-allowed px-4 opacity-60"
        >
          <MessageCircle className="mr-1.5 size-4" />
          Message
        </Button>

        {/* More Actions */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              size="icon"
              variant="outline"
              className="size-9 cursor-pointer"
            >
              <Ellipsis className="size-4" />
              <span className="sr-only">More actions</span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-48">
            {/* Share */}
            <DropdownMenuItem className="cursor-pointer" onClick={handleShare}>
              <Share2 className="mr-2 size-4" />
              Share Profile
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {/* Block */}
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => setBlockConfirmOpen(true)}
            >
              <ShieldAlert className="mr-2 size-4" />
              Block User
            </DropdownMenuItem>

            {/* Report */}
            <DropdownMenuItem
              className="cursor-pointer text-destructive focus:text-destructive"
              onClick={() => {
                // TODO: Implement report user action.
              }}
            >
              <Flag className="mr-2 size-4" />
              Report User
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Unfollow Confirmation */}
      <ConfirmDialog
        open={unfollowConfirmOpen}
        onOpenChange={setUnfollowConfirmOpen}
        title="Unfollow user?"
        description={`Are you sure you want to unfollow @${username}?`}
        confirmText="Unfollow"
        cancelText="Cancel"
        loading={loading}
        onConfirm={submitFollowToggle}
      />

      {/* Block Confirmation */}
      <ConfirmDialog
        open={blockConfirmOpen}
        onOpenChange={setBlockConfirmOpen}
        title="Block user?"
        description={`Are you sure you want to block @${username}? Blocking this user will also remove your existing follow relationship.`}
        confirmText="Block"
        cancelText="Cancel"
        loading={loading}
        onConfirm={handleBlock}
      />
    </>
  );
}
