"use client";

import { Share2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ShareButtonProps {
  title: string;
  text: string;
  url: string;
  className?: string;
}

export default function ShareButton({
  title,
  text,
  url,
  className,
}: ShareButtonProps) {
  const handleShare = async () => {
    const shareUrl = new URL(url, window.location.origin).toString();

    try {
      if (navigator.share) {
        await navigator.share({
          title,
          text,
          url: shareUrl,
        });

        toast.success("Shared successfully!");
        return;
      }

      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied to clipboard!");
    } catch (error) {
      // User cancelled the native share sheet.
      if (error instanceof Error && error.name === "AbortError") {
        return;
      }

      console.error("Share Error:", error);
      toast.error("Unable to share. Please try again.");
    }
  };

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={handleShare}
      className={cn("cursor-pointer gap-2", className)}
    >
      <Share2 className="size-4" />
      Share
    </Button>
  );
}
