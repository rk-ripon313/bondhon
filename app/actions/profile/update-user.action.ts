"use server";

import { revalidatePath } from "next/cache";

import {
  getCurrentUser,
  isUsernameAvailable,
} from "@/database/queries/user.query";
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
    | "username"
    | "phone"
    | "image"
    | "bloodGroup"
    | "gender"
    | "dateOfBirth"
    | "height"
    | "weight"
    | "location"
    | "isAvailableForDonate"
  >
>;

/**
 * Updates the specified fields of the current user's profile.
 */
export async function updateUserField(updates: UpdateUserData) {
  try {
    const user = await getCurrentUser();

    if (!user?.id || !user.email) {
      return {
        success: false,
        message: "Unauthorized.",
      };
    }

    if (Object.keys(updates).length === 0) {
      return {
        success: false,
        message: "No data provided.",
      };
    }

    await dbConnect();

    // Username changed → verify uniqueness again on the server
    if (updates.username) {
      const newUsername = updates.username.trim().toLowerCase();
      const currentUsername = user.username?.toLowerCase();

      if (newUsername !== currentUsername) {
        const usernameAvailable = await isUsernameAvailable(
          newUsername,
          user.id,
        );

        if (!usernameAvailable) {
          return {
            success: false,
            field: "username",
            message: "Username is already taken.",
          };
        }

        updates.username = newUsername;
      }
    }

    // Age changed → disable donor availability if user is under 18
    if (updates.dateOfBirth) {
      const isAdult = calculateAge(updates.dateOfBirth) >= 18;

      if (!isAdult) {
        updates.isAvailableForDonate = false;
      }
    }

    const updatedUser = await User.findOneAndUpdate(
      { email: user.email },
      { $set: updates },
      {
        new: true,
        runValidators: true,
      },
    ).lean();

    if (!updatedUser) {
      return {
        success: false,
        message: "User not found.",
      };
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
 * Checks if a username is available for the current user.
 */
export async function checkUsername(username: string) {
  try {
    const user = await getCurrentUser();

    if (!user?.id) {
      return {
        success: false,
        available: false,
        message: "Unauthorized.",
      };
    }

    await dbConnect();

    const available = await isUsernameAvailable(username, user.id);

    return {
      success: true,
      available,
      message: available
        ? "Username is available."
        : "Username is already taken.",
    };
  } catch (error) {
    console.error("Check username error:", error);

    return {
      success: false,
      available: false,
      message: "Failed to check username availability.",
    };
  }
}

/**
 * Updates the donor availability status of the current user.
 */
export async function updateDonorAvailability(isAvailableForDonate: boolean) {
  try {
    const user = await getCurrentUser();

    if (!user?.id || !user.email) {
      return {
        success: false,
        message: "Unauthorized.",
      };
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
      {
        $set: {
          isAvailableForDonate,
        },
      },
      {
        new: true,
      },
    ).lean();

    if (!updatedUser) {
      return {
        success: false,
        message: "Not updated.",
      };
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
