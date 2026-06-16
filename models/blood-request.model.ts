import { BLOOD_GROUPS, REQUEST_STATUSES, REQUEST_URGENCY } from "@/constants";
import { model, models, Schema } from "mongoose";

const bloodRequestSchema = new Schema(
  {
    requester: { type: Schema.Types.ObjectId, ref: "User", required: true },

    bloodGroupNeeded: { type: String, enum: BLOOD_GROUPS, required: true },
    quantity: { type: Number, default: 1 },
    urgency: { type: String, enum: REQUEST_URGENCY, default: "normal" },

    hospitalName: { type: String },

    location: {
      district: { type: String },
      area: { type: String },
      address: { type: String },

      coordinates: {
        type: { type: String, enum: ["Point"], default: "Point" },
        coordinates: {
          type: [Number], // [lng, lat]
        },
      },
    },

    neededBefore: { type: Date, required: true },
    additionalNotes: { type: String },

    contactNumber: { type: String, required: true },

    status: { type: String, enum: REQUEST_STATUSES, default: "active" },

    interestedDonors: [{ type: Schema.Types.ObjectId, ref: "User" }],
    assignedDonors: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  },
);

bloodRequestSchema.index({
  "location.coordinates.coordinates": "2dsphere",
});

export const BloodRequest =
  models.BloodRequest || model("BloodRequest", bloodRequestSchema);
