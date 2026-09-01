"use server";

import { hash } from "bcryptjs";

import { dbConnect } from "@/lib/db/db-connect";
import {
  registerSchema,
  type RegisterFormInput,
} from "@/lib/validations/auth/register.schema";
import { User } from "@/models/user.model";

// Generate a unique username based on the user's name, current timestamp, and a random number

function generateUsername(name: string) {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "")
    .slice(0, 15);

  const timestamp = Date.now().toString().slice(-6);

  const random = Math.floor(100 + Math.random() * 900);

  return `${base || "user"}${timestamp}${random}`;
}

// Register a new user

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

    //unique username
    let username = generateUsername(userData.name);

    while (await User.exists({ username })) {
      username = generateUsername(userData.name);
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Create user
    await User.create({
      ...userData,
      username,
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
