"use server";

import { hash } from "bcryptjs";

import { dbConnect } from "@/lib/db/db-connect";
import {
  registerSchema,
  type RegisterFormInput,
} from "@/lib/validations/auth/register.schema";
import { User } from "@/models/user.model";

export async function registerUser(data: RegisterFormInput) {
  try {
    // Validate incoming data
    const validation = registerSchema.safeParse(data);

    if (!validation.success) {
      return { success: false, message: "Invalid form data." };
    }

    await dbConnect();

    const { password, confirmPassword, acceptTerms, dob, ...userData } =
      validation.data;

    // Check duplicate email / phone
    const existingUser = await User.findOne({
      $or: [{ email: userData.email }, { phone: userData.phone }],
    });

    if (existingUser) {
      if (existingUser.email === userData.email) {
        return {
          success: false,
          message: "Email is already registered.",
        };
      }
      if (existingUser.phone === userData.phone) {
        return {
          success: false,
          message: "Phone number is already registered.",
        };
      }
    }
    // Hash password
    const hashedPassword = await hash(password, 12);

    // Create user
    await User.create({
      ...userData,
      password: hashedPassword,
      dateOfBirth: new Date(dob),
    });

    return { success: true, message: "Account created successfully." };
  } catch (error) {
    console.error("Registration Error:", error);

    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}
