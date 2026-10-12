"use client";

import { Check, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { markAllNotificationsAsRead } from "@/app/actions/notification/notification.action";
import { Button } from "@/components/ui/button";
import { getErrorMessage } from "@/lib/helpers/error";

interface NotificationHeaderProps {
  unreadCount: number;
  onMarkAllRead: () => void;
}

export default function NotificationHeader({
  unreadCount,
  onMarkAllRead,
}: NotificationHeaderProps) {
  const [loading, setLoading] = useState(false);

  const handleMarkAllRead = async () => {
    if (unreadCount === 0 || loading) return;

    setLoading(true);

    try {
      const result = await markAllNotificationsAsRead();

      if (!result.success) {
        throw new Error(result.message);
      }

      onMarkAllRead();
      toast.success("All notifications marked as read.");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between gap-3 px-4 pt-2">
      <div>
        <h2 className="text-base font-semibold">Notifications</h2>

        <p className="mt-0.5 text-xs text-muted-foreground">
          {unreadCount > 0
            ? `${unreadCount} unread notifications`
            : "You're all caught up"}
        </p>
      </div>

      <Button
        variant="ghost"
        size="sm"
        disabled={unreadCount === 0 || loading}
        onClick={handleMarkAllRead}
        className="h-8 gap-1.5 px-2 text-xs text-emerald-600 hover:bg-emerald-500/10 hover:text-emerald-600"
      >
        {loading ? (
          <Loader2 className="size-3.5 animate-spin" />
        ) : (
          <Check className="size-3.5" />
        )}
        Mark all read
      </Button>
    </div>
  );
}
