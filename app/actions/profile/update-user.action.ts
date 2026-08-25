"use server";

import { revalidatePath } from "next/cache";

import { getCurrentUser } from "@/database/queries/user.query";
import { dbConnect } from "@/lib/db/db-connect";
import { calculateAge } from "@/lib/helpers/date";
import { isUserEligibleForAction } from "@/lib/profile/profile-utils";
import { User } from "@/models/user.model";
import { UserProfile } from "@/types/user.type";

type UpdateUserData = Partial<
  Pick<
    UserProfile,
    | "name"
    | "nickname"
    | "phone"
    | "image"
    | "bloodGroup"
    | "gender"
    | "dateOfBirth"
    | "height"
    | "weight"
  >
>;

/**
 * Updates the specified fields of the current user's profile in the database.
 * @param updates - An object containing the fields to update and their new values.
 * @returns An object containing the success status and a message.
 */
export async function updateUserField(updates: UpdateUserData) {
  try {
    const user = await getCurrentUser();

    if (!user?._id || !user?.email) {
      return { success: false, message: "Unauthorized." };
    }

    if (Object.keys(updates).length === 0) {
      return { success: false, message: "No data provided." };
    }

    await dbConnect();

    const updatedUser = await User.findOneAndUpdate(
      { email: user.email },
      { $set: updates },
      {
        new: true,
        runValidators: true,
      },
    ).lean();

    if (!updatedUser) {
      return { success: false, message: "User not found." };
    }

    revalidatePath("/profile");

    return {
      success: true,
      message: "Profile updated successfully.",
    };
  } catch (error) {
    console.error("Update user field error:", error);

    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to update profile.",
    };
  }
}

/**
 * Updates the donor availability status of the current user in the database.
 * @param isAvailableForDonate - A boolean indicating whether the user is available for donation.
 * @returns An object containing the success status and a message.
 */

export async function updateDonorAvailability(isAvailableForDonate: boolean) {
  try {
    const user = await getCurrentUser();

    if (!user?._id || !user.email) {
      return { success: false, message: "Unauthorized." };
    }

    if (isAvailableForDonate) {
      if (!isUserEligibleForAction(user)) {
        return {
          success: false,
          message:
            "Complete your required profile information before becoming available for donation.",
        };
      }

      const isAdult = user.dateOfBirth
        ? calculateAge(user.dateOfBirth) >= 18
        : false;

      if (!isAdult) {
        return {
          success: false,
          message: "You must be at least 18 years old to donate blood.",
        };
      }

      const hasRecentDonation = user.lastDonationDate
        ? Date.now() - new Date(user.lastDonationDate).getTime() <
          90 * 24 * 60 * 60 * 1000
        : false;

      if (hasRecentDonation) {
        return {
          success: false,
          message:
            "You cannot become available yet because your last donation was too recent.",
        };
      }
    }

    await dbConnect();

    const updatedUser = await User.findOneAndUpdate(
      { email: user.email },
      { $set: { isAvailableForDonate } },
      { new: true },
    ).lean();

    if (!updatedUser) {
      return { success: false, message: "Not updated " };
    }

    revalidatePath("/profile");

    return {
      success: true,
      message: isAvailableForDonate
        ? "You are now available for donation."
        : "Donor availability turned off.",
    };
  } catch (error) {
    console.error("Update donor availability error:", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update donor availability.",
    };
  }
}
