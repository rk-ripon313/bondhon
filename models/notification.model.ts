import { NOTIFICATION_TYPES } from "@/constants";
import { model, models, Schema } from "mongoose";

const notificationSchema = new Schema(
  {
    receiver: { type: Schema.Types.ObjectId, ref: "User", required: true },
    sender: { type: Schema.Types.ObjectId, ref: "User" },

    type: { type: String, enum: NOTIFICATION_TYPES, required: true },

    title: { type: String, required: true },
    message: { type: String, required: true },
    link: { type: String },

    isRead: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

const Notification =
  models.Notification || model("Notification", notificationSchema);

export default Notification;
