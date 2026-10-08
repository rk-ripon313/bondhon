import { NOTIFICATION_TYPES } from "@/constants";
import { Notification } from "@/models/notification.model";
import { Types } from "mongoose";

type CreateNotificationsParams = {
  receivers: (string | Types.ObjectId)[];
  actor?: string | Types.ObjectId;
  type: (typeof NOTIFICATION_TYPES)[number];
  title: string;
  message: string;
  link?: string;
};

export async function createNotifications({
  receivers,
  actor,
  type,
  title,
  message,
  link,
}: CreateNotificationsParams) {
  if (receivers.length === 0) return;

  try {
    await Notification.insertMany(
      receivers.map((receiver) => ({
        receiver,
        actor,
        type,
        title,
        message,
        link,
      })),
    );
  } catch (error) {
    console.error("Create Notifications Error:", error);
  }
}
