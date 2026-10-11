"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

import { Bell, Check, LoaderCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";

import {
  loadNotifications,
  loadUnreadNotificationCount,
} from "@/app/actions/notification/notification.action";
import EmptyState from "@/components/shared/EmptyState";
import { getTimeAgo } from "@/lib/helpers/date";
import { getErrorMessage } from "@/lib/helpers/error";
import { getNotificationIcon } from "@/lib/notifications/notification-utils";
import { Notification } from "@/types/notification.type";
import Link from "next/link";
import LoadingSkeleton from "./LoadingSkeleton";

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

  // Load the unread badge count when the component mounts.
  useEffect(() => {
    const fetchUnreadCount = async () => {
      const result = await loadUnreadNotificationCount();
      setUnreadCount(result.count);
    };
    fetchUnreadCount();
  }, []);

  return (
    <Popover
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (nextOpen) {
          fetchNotifications(activeTab, 0, false);
        }
      }}
    >
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Notifications"
          className="relative size-10 rounded-xl cursor-pointer"
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
            disabled={unreadCount === 0}
            // onClick={markAllAsRead}
            className="h-8 gap-1.5 px-2 text-xs text-emerald-600 hover:bg-emerald-500/10 hover:text-emerald-600"
          >
            <Check className="size-3.5" />
            Mark all read
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 border-b border-border/70 px-3 pt-2">
          {(["all", "unread"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => {
                setActiveTab(tab);
                fetchNotifications(tab, 0, false);
              }}
              className={`relative px-3 py-2.5 text-sm font-medium cursor-pointer capitalize transition-colors ${
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
                onClick={() => fetchNotifications(activeTab, 0, false)}
              >
                Try again
              </Button>
            </div>
          ) : notifications.length > 0 ? (
            <div className="divide-y divide-border/50">
              {notifications.map((notification) => {
                const Icon = getNotificationIcon(notification.type);

                return (
                  <div
                    key={notification.id}
                    className={`relative flex gap-3 px-4 py-3.5 transition-colors hover:bg-muted/50 ${
                      !notification.isRead ? "bg-muted/25" : ""
                    }`}
                  >
                    {/* Actor image or type icon */}
                    <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted">
                      {notification.actor?.image ? (
                        <Link
                          href={`/user/${notification.actor.username}`}
                          className="flex items-center justify-center"
                        >
                          <Image
                            src={notification.actor.image}
                            alt={notification.actor.name || "User"}
                            width={44}
                            height={44}
                            className="size-full object-cover"
                          />
                        </Link>
                      ) : (
                        <Icon
                          className={`size-5 ${
                            notification.type.startsWith("blood_request")
                              ? "text-red-500"
                              : notification.type === "user_followed"
                                ? "text-blue-500"
                                : "text-emerald-600"
                          }`}
                        />
                      )}
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1 pr-1">
                      <p className="text-[13px] leading-5 text-foreground">
                        <span className="font-semibold">
                          {notification.title}
                        </span>{" "}
                        <span className="text-muted-foreground">
                          {notification.message}
                        </span>
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {getTimeAgo(notification.createdAt)}
                      </p>
                    </div>

                    {!notification.isRead && (
                      <span
                        aria-label="Unread"
                        className="mt-1.5 size-2 shrink-0 rounded-full bg-app-primary"
                      />
                    )}
                  </div>
                );
              })}

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
        {hasMore && (
          <div className="border-t border-border/70 p-2.5">
            <Button
              variant="ghost"
              className="h-9 w-full text-sm font-medium text-muted-foreground hover:text-foreground cursor-pointer"
              disabled={loadingMore}
              onClick={() =>
                fetchNotifications(activeTab, notifications.length, true)
              }
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
        )}
      </PopoverContent>
    </Popover>
  );
}
