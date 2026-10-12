"use client";

import { Check, Circle, MoreHorizontal, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createElement, useState } from "react";
import { toast } from "sonner";

import {
  deleteNotification,
  toggleNotificationRead,
} from "@/app/actions/notification/notification.action";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getTimeAgo } from "@/lib/helpers/date";
import { getErrorMessage } from "@/lib/helpers/error";
import { getNotificationIcon } from "@/lib/notifications/notification-utils";
import type { Notification } from "@/types/notification.type";

interface NotificationItemProps {
  notification: Notification;
  onReadChange: (id: string, isRead: boolean) => void;
  onDeleted: (id: string, wasUnread: boolean) => void;
  onOpen: () => void;
}

export default function NotificationItem({
  notification,
  onReadChange,
  onDeleted,
  onOpen,
}: NotificationItemProps) {
  const router = useRouter();

  const [isUpdatingRead, setIsUpdatingRead] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isRead = notification.isRead;

  const notificationIcon = createElement(
    getNotificationIcon(notification.type),
    { className: "size-5" },
  );

  const updateReadStatus = async (nextIsRead: boolean) => {
    if (isUpdatingRead || nextIsRead === isRead) return;

    setIsUpdatingRead(true);

    try {
      const result = await toggleNotificationRead(notification.id, nextIsRead);

      if (!result.success) {
        throw new Error(result.message);
      }

      onReadChange(notification.id, result.isRead);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsUpdatingRead(false);
    }
  };

  const handleOpen = () => {
    onOpen();

    if (!isRead) {
      updateReadStatus(true);
    }

    if (notification.link) {
      router.push(notification.link);
    }
  };

  const handleDelete = async () => {
    if (isDeleting) return;

    setIsDeleting(true);

    try {
      const result = await deleteNotification(notification.id);

      if (!result.success) {
        throw new Error(result.message);
      }

      onDeleted(notification.id, !isRead);
      setConfirmDeleteOpen(false);
      toast.success("Notification deleted.");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div
        className={`flex gap-3 px-4 py-3.5 transition-colors hover:bg-app-muted/50 ${
          !isRead ? "bg-app-muted/25" : ""
        }`}
      >
        <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted">
          {notification.actor?.username ? (
            <Link
              href={`/user/${notification.actor.username}`}
              aria-label={`View ${notification.actor.name}'s profile`}
              className="flex size-full items-center justify-center"
            >
              <Image
                src={notification.actor?.image || "/avatars/default.png"}
                alt={notification.actor?.name || "User"}
                width={44}
                height={44}
                className="size-full object-cover"
              />
            </Link>
          ) : (
            notificationIcon
          )}
        </div>

        <button
          type="button"
          onClick={handleOpen}
          className="min-w-0 flex-1 cursor-pointer text-left"
        >
          <p className="text-[13px] leading-5 text-foreground">
            <span className="font-semibold">{notification.title}</span>{" "}
            <span className="text-muted-foreground">
              {notification.message}
            </span>
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            {getTimeAgo(notification.createdAt)}
          </p>
        </button>

        {!isRead && (
          <span
            aria-label="Unread"
            className="mt-1.5 size-2 shrink-0 rounded-full bg-app-primary"
          />
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Notification options"
              disabled={isUpdatingRead || isDeleting}
              className="size-8 shrink-0 rounded-full cursor-pointer"
            >
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem
              disabled={isUpdatingRead || isDeleting}
              onSelect={() => {
                updateReadStatus(!isRead);
              }}
            >
              {isRead ? (
                <Circle className="mr-2 size-4" />
              ) : (
                <Check className="mr-2 size-4" />
              )}
              Mark as {isRead ? "unread" : "read"}
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              disabled={isUpdatingRead || isDeleting}
              onSelect={() => setConfirmDeleteOpen(true)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 size-4" />
              Delete notification
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ConfirmDialog
        open={confirmDeleteOpen}
        onOpenChange={setConfirmDeleteOpen}
        title="Delete notification?"
        description="Are you sure you want to delete this notification? This action cannot be undone."
        confirmText="Delete"
        loading={isDeleting}
        onConfirm={handleDelete}
      />
    </>
  );
}
