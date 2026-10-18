import { BLOOD_GROUPS } from "@/constants";
import { z } from "zod";
import { locationSchema } from "../shared/location.schema";

export const communityDonorSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name cannot exceed 50 characters"),

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
    message: "Please select a blood group",
  }),

  location: locationSchema,
});

export type CommunityDonorFormInput = z.input<typeof communityDonorSchema>;
