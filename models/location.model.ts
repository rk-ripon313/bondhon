import { Schema, model, models } from "mongoose";

const locationSchema = new Schema(
  {
    area: {
      type: String,
      required: true,
      trim: true,
    },

    district: {
      type: String,
      required: true,
      trim: true,
    },

    coordinates: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },

      coordinates: {
        type: [Number],
        required: true,
      },
    },
  },
  {
    timestamps: true,
  },
);

locationSchema.index({
  coordinates: "2dsphere",
});

export const Location = models.Location || model("Location", locationSchema);
