import { BLOOD_GROUPS, GENDERS, USER_ROLES } from "@/constants";
import { model, models, Schema } from "mongoose";

const userSchema = new Schema(
  {
    role: { type: String, enum: USER_ROLES, default: "user" },
    name: { type: String, required: true, trim: true },
    nickname: { type: String, trim: true },

    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String },

    avatar: { type: String, default: "/avatars/default.png" },

    bloodGroup: { type: String, enum: BLOOD_GROUPS, required: true },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: GENDERS },
    height: { type: Number },
    weight: { type: Number },

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

    isAvailableForDonate: { type: Boolean, default: false },
    lastDonationDate: { type: Date },
    totalDonations: { type: Number, default: 0 },
    badges: { type: [String], default: [] },

    followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  },
);

userSchema.index({
  "location.coordinates.coordinates": "2dsphere",
});

const User = models.User || model("User", userSchema);

export default User;
