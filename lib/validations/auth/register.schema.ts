import { BLOOD_GROUPS, GENDERS } from "@/constants";
import { calculateAge } from "@/lib/helpers/date";
import { z } from "zod";
import { locationSchema } from "../shared/location.schema";

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, "Full name must be at least 3 characters")
      .max(50, "Full name cannot exceed 50 characters"),

    nickname: z
      .string()
      .max(30, "Nickname is too long")
      .optional()
      .transform((val) => (val?.trim() === "" ? undefined : val)),

    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("Please enter a valid email address"),

    phone: z
      .string()
      .trim()
      .regex(/^(?:\+8801|8801|01)[3-9]\d{8}$/, "Enter a valid BD phone number")
      .transform((phone) => {
        if (phone.startsWith("+880")) return "0" + phone.slice(4);
        if (phone.startsWith("880")) return "0" + phone.slice(3);
        return phone;
      }),

    bloodGroup: z.enum(BLOOD_GROUPS, {
      message: "Blood group is required",
    }),

    gender: z.enum(GENDERS, {
      message: "Gender is required",
    }),

    dob: z
      .string()
      .min(1, "Date of birth is required")
      .refine((value) => !isNaN(new Date(value).getTime()), {
        message: "Invalid date",
      })
      .refine((value) => new Date(value) <= new Date(), {
        message: "Date cannot be in the future",
      })
      .refine((value) => calculateAge(value) <= 120, {
        message: "Invalid date of birth",
      }),

    location: locationSchema,

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/,
        "Password must contain uppercase, lowercase and a number",
      ),

    confirmPassword: z.string().min(1, "Please confirm your password"),

    isAvailableForDonate: z.boolean(),

    acceptTerms: z.boolean().refine((value) => value === true, {
      message: "You must accept the Terms & Privacy Policy",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  })
  .refine(
    (data) => {
      if (!data.isAvailableForDonate) return true;

      const age = calculateAge(data.dob);
      return age >= 18;
    },
    {
      path: ["isAvailableForDonate"],
      message: "Must be 18+ to donate blood",
    },
  );

export type RegisterFormInput = z.input<typeof registerSchema>;
