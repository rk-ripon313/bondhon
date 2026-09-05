import { BLOOD_GROUPS, REQUEST_URGENCY } from "@/constants";
import { z } from "zod";
import { locationSchema } from "../shared/location.schema";

export const bloodRequestSchema = z.object({
  bloodGroupNeeded: z.enum(BLOOD_GROUPS, {
    message: "Please select a blood group",
  }),

  quantity: z
    .number({
      message: "Quantity is required",
    })
    .int("Quantity must be a whole number")
    .min(1, "At least 1 bag is required"),

  urgency: z.enum(REQUEST_URGENCY, {
    message: "Please select an urgency level",
  }),

  hospitalName: z
    .string()
    .trim()
    .max(150, "Hospital name is too long")
    .optional()
    .or(z.literal("")),

  location: locationSchema,

  neededBefore: z.string().min(1, "Please select when blood is needed"),

  contactNumber: z
    .string()
    .trim()
    .regex(/^(?:\+8801|8801|01)[3-9]\d{8}$/, "Enter a valid BD phone number")
    .transform((phone) => {
      if (phone.startsWith("+880")) return "0" + phone.slice(4);
      if (phone.startsWith("880")) return "0" + phone.slice(3);
      return phone;
    }),

  additionalNotes: z
    .string()
    .trim()
    .max(1000, "Notes cannot exceed 1000 characters")
    .optional()
    .or(z.literal("")),
});

export type BloodRequestFormInput = z.input<typeof bloodRequestSchema>;
