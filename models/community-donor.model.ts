import { BLOOD_GROUPS } from "@/constants";
import { model, models, Schema } from "mongoose";

const communityDonorSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },

    bloodGroup: {
      type: String,
      enum: BLOOD_GROUPS,
      required: true,
    },

    location: {
      district: { type: String },
      area: { type: String },
      address: { type: String },

      coordinates: {
        type: { type: String, enum: ["Point"], default: "Point" },

        coordinates: {
          type: [Number],
        },
      },
    },

    addedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

communityDonorSchema.index({
  "location.coordinates.coordinates": "2dsphere",
});

export const CommunityDonor =
  models.CommunityDonor || model("CommunityDonor", communityDonorSchema);
