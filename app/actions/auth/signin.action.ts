"use server";

import { signIn } from "@/auth";
import {
  loginSchema,
  type LoginFormInput,
} from "@/lib/validations/auth/login.schema";
import { AuthError } from "next-auth";

// credentials log in...
export async function credentialLogin(data: LoginFormInput) {
  const validated = loginSchema.safeParse(data);

  if (!validated.success) {
    return { success: false, message: "Invalid input" };
  }

  try {
    await signIn("credentials", {
      email: validated.data.email,
      password: validated.data.password,
      redirect: false,
    });

    return { success: true, message: "Login successful" };
  } catch (error) {
    console.error("Login Error:", error);

    if (error instanceof AuthError) {
      const cause = error.cause as { err?: Error };

      return {
        success: false,
        message: cause?.err?.message ?? "Invalid email or password",
      };
    }

    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}
