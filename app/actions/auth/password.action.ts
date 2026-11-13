"use server";

import { auth } from "@/auth";
import { dbConnect } from "@/lib/db/db-connect";
import {
  PasswordFormInput,
  passwordSchema,
} from "@/lib/validations/auth/password.schema";
import { User } from "@/models/user.model";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

export async function updatePassword(data: PasswordFormInput) {
  try {
    const validated = passwordSchema.safeParse(data);

    if (!validated.success) {
      return { success: false, message: "Invalid form data." };
    }

    const { currentPassword, newPassword } = validated.data;

    if (currentPassword === newPassword) {
      return {
        success: false,
        message: "New password must be different from current password.",
        field: "newPassword",
      };
    }

    const session = await auth();

    if (!session?.user?.email) {
      return { success: false, message: "Unauthorized." };
    }

    await dbConnect();

    const user = await User.findOne({
      email: session.user.email,
    }).select("+password");

    if (!user) {
      return { success: false, message: "User not found." };
    }

    const hadPassword = Boolean(user.password);

    if (hadPassword) {
      if (!currentPassword) {
        return {
          success: false,
          message: "Current password is required.",
        };
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);

      if (!isMatch) {
        return {
          success: false,
          message: "Current password is incorrect.",
          field: "currentPassword",
        };
      }
    }

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();

    revalidatePath("/settings/account");

    return {
      success: true,
      message: hadPassword
        ? "Password changed successfully."
        : "Password set successfully.",
    };
  } catch (error) {
    console.error("[UPDATE_PASSWORD]", error);

    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}
