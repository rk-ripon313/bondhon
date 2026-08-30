import { BLOOD_GROUPS, GENDERS } from "@/constants";
import { calculateAge } from "@/lib/helpers/date";
import { z } from "zod";

export const updatePersonalSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Full name must be at least 3 characters")
    .max(50, "Full name cannot exceed 50 characters"),

  nickname: z
    .string()
    .trim()
    .max(30, "Nickname cannot exceed 30 characters")
    .optional(),

  username: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username cannot exceed 20 characters")
    .regex(
      /^[a-z0-9_]+$/,
      "Username can only contain letters, numbers and underscores",
    ),

  phone: z
    .string()
    .trim()
    .regex(/^(?:\+8801|8801|01)[3-9]\d{8}$/, "Enter a valid BD phone number")
    .transform((phone) => {
      if (phone.startsWith("+880")) return "0" + phone.slice(4);
      if (phone.startsWith("880")) return "0" + phone.slice(3);
      return phone;
    }),

  gender: z.enum(GENDERS, {
    message: "Gender is required",
  }),

  dateOfBirth: z
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
});

export type UpdatePersonalInput = z.infer<typeof updatePersonalSchema>;

export const updateMedicalSchema = z.object({
  bloodGroup: z.enum(BLOOD_GROUPS, {
    message: "Blood group is required",
  }),

  height: z
    .string()
    .trim()
    .refine((value) => {
      if (!value) return true;

      const height = Number(value);

      return Number.isFinite(height) && height >= 50 && height <= 250;
    }, "Enter a valid height between 50 and 250 cm")
    .optional(),

  weight: z
    .string()
    .trim()
    .refine((value) => {
      if (!value) return true;

      const weight = Number(value);

      return Number.isFinite(weight) && weight >= 20 && weight <= 300;
    }, "Enter a valid weight between 20 and 300 kg")
    .optional(),
});

export type UpdateMedicalInput = z.infer<typeof updateMedicalSchema>;
