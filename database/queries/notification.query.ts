import { getCurrentUser } from "@/database/queries/user.query";
import { dbConnect } from "@/lib/db/db-connect";
import {
  replaceMongoIdInArray,
  replaceMongoIdInObject,
} from "@/lib/helpers/transform-id";
import { Notification } from "@/models/notification.model";

export const getUnreadNotificationCount = async () => {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  await dbConnect();

  return await Notification.countDocuments({
    receiver: user.id,
    isRead: false,
  });
};

export const getNotifications = async (
  filter: "all" | "unread" = "all",
  skip = 0,
  limit = 10,
) => {
  const user = await getCurrentUser();

  if (!user?.id) {
    throw new Error("User not authenticated.");
  }

  await dbConnect();

  const safeSkip = Math.max(0, Math.floor(skip));
  const safeLimit = Math.min(20, Math.max(1, Math.floor(limit)));

  const query = {
    receiver: user.id,
    ...(filter === "unread" ? { isRead: false } : {}),
  };

  const [items, unreadCount] = await Promise.all([
    Notification.find(query)
      .populate("actor", "name username image")
      .sort({ createdAt: -1, _id: -1 })
      .skip(safeSkip)
      .limit(safeLimit + 1)
      .lean(),

    Notification.countDocuments({
      receiver: user.id,
      isRead: false,
    }),
  ]);

  const hasMore = items.length > safeLimit;
  const pageItems = items.slice(0, safeLimit);

  const notifications = pageItems.map((notification) => ({
    ...notification,
    receiver: notification.receiver.toString(),
    actor: notification.actor
      ? replaceMongoIdInObject(notification.actor)
      : null,
  }));

  return {
    notifications: replaceMongoIdInArray(notifications),
    unreadCount,
    hasMore,
  };
};
