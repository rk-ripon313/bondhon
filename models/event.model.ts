import { EVENT_CATEGORIES, EVENT_STATUS } from "@/constants";
import { model, models, Schema } from "mongoose";

const eventSchema = new Schema(
  {
    organizer: { type: Schema.Types.ObjectId, ref: "User", required: true },

    title: { type: String, required: true, trim: true },
    description: { type: String },
    thumbnail: { type: String, default: "/events/default-event.jpg" },

    category: { type: String, enum: EVENT_CATEGORIES, required: true },
    tags: { type: [String], default: [] },

    eventDate: { type: Date, required: true },

    location: {
      district: { type: String },
      area: { type: String },
      address: { type: String },

      coordinates: {
        type: {
          type: String,
          enum: ["Point"],
          default: "Point",
        },

        coordinates: {
          type: [Number], // [lng, lat]
        },
      },
    },

    status: { type: String, enum: EVENT_STATUS, default: "upcoming" },

    interestedUsers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    goingUsers: [{ type: Schema.Types.ObjectId, ref: "User" }],

    //Q & A section
  },
  {
    timestamps: true,
  },
);

eventSchema.index({
  "location.coordinates.coordinates": "2dsphere",
});

export const Event = models.Event || model("Event", eventSchema);
