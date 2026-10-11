"use server";

import {
  getNotifications,
  getUnreadNotificationCount,
} from "@/database/queries/notification.query";

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
