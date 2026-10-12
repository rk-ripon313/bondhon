"use server";

import {
  getNotifications,
  getUnreadNotificationCount,
} from "@/database/queries/notification.query";
import { getCurrentUser } from "@/database/queries/user.query";
import { dbConnect } from "@/lib/db/db-connect";
import { Notification } from "@/models/notification.model";

export async function loadUnreadNotificationCount() {
  try {
    const count = await getUnreadNotificationCount();

    return {
      success: count !== null,
      count: count ?? 0,
    };
  } catch (error) {
    console.error("Load Unread Notification Count Error:", error);

    return { success: false, count: 0 };
  }
}

export async function loadNotifications(
  filter: "all" | "unread" = "all",
  skip = 0,
  limit = 10,
) {
  try {
    const result = await getNotifications(filter, skip, limit);

    return {
      success: true,
      ...result,
    };
  } catch (error) {
    console.error("Load Notifications Error:", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to load notifications.",
      notifications: [],
      unreadCount: 0,
      hasMore: false,
    };
  }
}

// Toggle read / unread
export async function toggleNotificationRead(
  notificationId: string,
  isRead: boolean,
) {
  try {
    const user = await getCurrentUser();

    if (!user?.id) {
      return { success: false, message: "You must be logged in." };
    }

    await dbConnect();

    const notification = await Notification.findOneAndUpdate(
      {
        _id: notificationId,
        receiver: user.id,
      },
      { $set: { isRead } },
      { new: true },
    )
      .select("_id isRead")
      .lean();

    if (!notification) {
      return { success: false, message: "Notification not found." };
    }

    return {
      success: true,
      isRead: notification.isRead,
    };
  } catch {
    return {
      success: false,
      message: "Failed to update notification.",
    };
  }
}

// Delete notification
export async function deleteNotification(notificationId: string) {
  try {
    const user = await getCurrentUser();

    if (!user?.id) {
      return { success: false, message: "You must be logged in." };
    }

    await dbConnect();

    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      receiver: user.id,
    }).select("_id");

    if (!notification) {
      return { success: false, message: "Notification not found." };
    }

    return {
      success: true,
      id: notification._id.toString(),
    };
  } catch {
    return {
      success: false,
      message: "Failed to delete notification.",
    };
  }
}

// Mark all notifications as read
export async function markAllNotificationsAsRead() {
  try {
    const user = await getCurrentUser();

    if (!user?.id) {
      return { success: false, message: "You must be logged in." };
    }

    await dbConnect();

    const result = await Notification.updateMany(
      {
        receiver: user.id,
        isRead: false,
      },
      { $set: { isRead: true } },
    );

    return {
      success: true,
      modifiedCount: result.modifiedCount,
    };
  } catch {
    return {
      success: false,
      message: "Failed to mark notifications as read.",
    };
  }
}
