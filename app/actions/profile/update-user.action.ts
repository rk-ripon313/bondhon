"use server";

import { revalidatePath } from "next/cache";

import { getCurrentUser } from "@/database/queries/user.query";
import { dbConnect } from "@/lib/db/db-connect";
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
