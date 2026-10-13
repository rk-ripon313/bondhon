"use client";

import { useCallback, useState } from "react";

import { Bell, LoaderCircle } from "lucide-react";
import { toast } from "sonner";

import {
  loadNotifications,
  markAllNotificationsAsRead,
} from "@/app/actions/notification/notification.action";
import EmptyState from "@/components/shared/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getErrorMessage } from "@/lib/helpers/error";
import type { Notification } from "@/types/notification.type";

import { useNotificationPolling } from "@/hooks/use-notification-polling";
import LoadingSkeleton from "./LoadingSkeleton";
import NotificationHeader from "./NotificationHeader";
import NotificationItem from "./NotificationItem";

// Available notification tabs.
type NotificationFilter = "all" | "unread";

export default function NotificationButton() {
  const [open, setOpen] = useState(false);

  const [activeTab, setActiveTab] = useState<NotificationFilter>("all");

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState("");

  // Handles background polling, unread-count refresh, and notification sound.
  useNotificationPolling({
    open,
    setUnreadCount,
  });

  // Fetches notifications and either replaces the list or appends another page.
  const fetchNotifications = useCallback(
    async (filter: NotificationFilter, skip: number, append: boolean) => {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
        setError("");
      }

      try {
        const result = await loadNotifications(filter, skip, 6);

        if (!result.success) {
          throw new Error(result.message);
        }

        const items = result.notifications as Notification[];

        setNotifications((current) =>
          append ? [...current, ...items] : items,
        );

        setUnreadCount(result.unreadCount);
        setHasMore(result.hasMore);
      } catch (error) {
        setError("Something went wrong while loading notifications.");
        toast.error(getErrorMessage(error));
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [],
  );

  // Updates the selected tab and loads its first page.
  const handleTabChange = (tab: NotificationFilter) => {
    if (tab === activeTab) return;

    setActiveTab(tab);
    void fetchNotifications(tab, 0, false);
  };

  // Updates local notification state after a notification's read status changes.
  const handleReadChange = (id: string, isRead: boolean) => {
    const currentNotification = notifications.find(
      (notification) => notification.id === id,
    );

    if (!currentNotification || currentNotification.isRead === isRead) {
      return;
    }

    // Remove read notifications from the Unread tab.
    if (activeTab === "unread" && isRead) {
      setNotifications((current) =>
        current.filter((notification) => notification.id !== id),
      );
    } else {
      setNotifications((current) =>
        current.map((notification) =>
          notification.id === id ? { ...notification, isRead } : notification,
        ),
      );
    }

    setUnreadCount((count) => Math.max(0, count + (isRead ? -1 : 1)));
  };

  // Removes a deleted notification and adjusts the unread badge if necessary.
  const handleDeleted = (id: string, wasUnread: boolean) => {
    setNotifications((current) =>
      current.filter((notification) => notification.id !== id),
    );

    if (wasUnread) {
      setUnreadCount((count) => Math.max(0, count - 1));
    }
  };

  // Marks all notifications as read on the server before updating the UI.
  const handleMarkAllRead = async () => {
    try {
      const result = await markAllNotificationsAsRead();

      if (!result.success) {
        throw new Error(result.message);
      }

      if (activeTab === "unread") {
        setNotifications([]);
        setHasMore(false);
      } else {
        setNotifications((current) =>
          current.map((notification) => ({
            ...notification,
            isRead: true,
          })),
        );
      }

      setUnreadCount(0);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <Popover
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);

        if (nextOpen) {
          void fetchNotifications(activeTab, 0, false);
        }
      }}
    >
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Notifications"
          className="relative size-10 cursor-pointer rounded-xl"
        >
          <Bell className="size-[18px]" />

          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold leading-none text-white ring-2 ring-background">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={10}
        className="w-[calc(100vw-24px)] max-w-[400px] overflow-hidden rounded-2xl border-border/70 bg-app-background p-0 shadow-xl sm:w-[400px]"
      >
        {/* Header */}
        <NotificationHeader
          unreadCount={unreadCount}
          onMarkAllRead={handleMarkAllRead}
        />

        {/* Tabs */}
        <div className="flex items-center gap-1 border-b border-border/70 px-3 pt-2">
          {(["all", "unread"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => handleTabChange(tab)}
              className={`relative cursor-pointer px-3 py-2.5 text-sm font-medium capitalize transition-colors ${
                activeTab === tab
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}

              {tab === "unread" && unreadCount > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-1.5 h-5 min-w-5 justify-center px-1 text-[10px] text-app-primary"
                >
                  {unreadCount}
                </Badge>
              )}

              {activeTab === tab && (
                <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-app-primary" />
              )}
            </button>
          ))}
        </div>

        {/* Notification list */}
        <div className="h-[min(420px,60vh)] overflow-y-auto custom-scrollbar">
          {loading ? (
            <LoadingSkeleton />
          ) : error ? (
            <div className="flex min-h-40 flex-col items-center justify-center gap-3 px-5 text-center">
              <p className="text-sm text-muted-foreground">{error}</p>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  fetchNotifications(activeTab, 0, false);
                }}
              >
                Try again
              </Button>
            </div>
          ) : notifications.length > 0 ? (
            <div className="divide-y divide-border/50">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onReadChange={handleReadChange}
                  onDeleted={handleDeleted}
                  onOpen={() => setOpen(false)}
                />
              ))}

              {loadingMore && <LoadingSkeleton />}
            </div>
          ) : (
            <EmptyState
              icon={Bell}
              title={
                activeTab === "unread"
                  ? "You're all caught up"
                  : "No notifications yet"
              }
            />
          )}
        </div>

        {/* Load more */}
        {hasMore ? (
          <div className="border-t border-border/70 p-2.5">
            <Button
              variant="ghost"
              className="h-9 w-full cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground"
              disabled={loadingMore}
              onClick={() => {
                fetchNotifications(activeTab, notifications.length, true);
              }}
            >
              {loadingMore ? (
                <span className="flex items-center justify-center gap-2">
                  <LoaderCircle className="size-4 animate-spin" />
                  Loading more...
                </span>
              ) : (
                "See more Notification"
              )}
            </Button>
          </div>
        ) : (
          !loading &&
          !loadingMore &&
          !error &&
          notifications.length > 0 && (
            <p className="border-t border-border/50 px-4 py-3 text-center text-xs text-muted-foreground">
              {"You've reached the end"}
            </p>
          )
        )}
      </PopoverContent>
    </Popover>
  );
}
