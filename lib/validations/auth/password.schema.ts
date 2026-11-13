import { z } from "zod";

export const passwordSchema = z
  .object({
    currentPassword: z.string().optional(),

    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/,
        "Password must contain uppercase, lowercase and a number",
      ),

    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  })
  .refine(
    (data) =>
      !data.currentPassword || data.currentPassword !== data.newPassword,
    {
      path: ["newPassword"],
      message: "New password must be different from current password.",
    },
  );
export type PasswordFormInput = z.infer<typeof passwordSchema>;
