"use client";

import { UserCheck, UserPlus } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { toggleFollow } from "@/app/actions/profile/connections.action";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { buttonVariants } from "@/components/ui/button";
import { getErrorMessage } from "@/lib/helpers/error";
import type { VariantProps } from "class-variance-authority";
import { useRouter } from "next/navigation";

interface FollowToggleProps {
  username: string;
  isFollowing: boolean;
  className?: string;
  size?: VariantProps<typeof buttonVariants>["size"];
  variant?: VariantProps<typeof buttonVariants>["variant"];
}

export default function FollowToggle({
  username,
  isFollowing: initialIsFollowing,
  className,
  size = "sm",
  variant = "outline",
}: FollowToggleProps) {
  const router = useRouter();

  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isPending, startTransition] = useTransition();

  const handleToggleFollow = () => {
    startTransition(async () => {
      try {
        const result = await toggleFollow(username);

        if (!result.success) {
          throw new Error(result.message);
        }

        setIsFollowing(Boolean(result.data));

        router.refresh();
        toast.success(result.message);
      } catch (error) {
        console.error("Follow action error:", error);
        toast.error(getErrorMessage(error));
      }
    });
  };

  return (
    <Button
      type="button"
      size={size}
      variant={variant}
      disabled={isPending}
      onClick={handleToggleFollow}
      className={cn(
        "h-auto gap-1 rounded-none border-0 bg-transparent cursor-pointer px-1 py-0 text-xs font-medium shadow-none hover:bg-transparent",
        isFollowing
          ? "text-muted-foreground hover:text-app-foreground"
          : "text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300",
        className,
      )}
    >
      {isFollowing ? (
        <UserCheck className="size-4" />
      ) : (
        <UserPlus className="size-4" />
      )}

      {isPending ? "Please wait..." : isFollowing ? "Following" : "Follow"}
    </Button>
  );
}
