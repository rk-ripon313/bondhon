import { z } from "zod";

export const locationSchema = z.object({
  area: z.string().trim().min(1, "Area/Upazila/Thana is required"),
  district: z.string().trim().min(1, "District is required"),
  address: z
    .string()
    .trim()
    .max(200, "Address must be at most 200 characters")
    .optional(),

  coordinates: z.object({
    type: z.literal("Point"),
    coordinates: z
      .tuple([z.number(), z.number()])
      .refine(([lng]) => lng >= -180 && lng <= 180, {
        message: "Invalid longitude value",
      })
      .refine(([, lat]) => lat >= -90 && lat <= 90, {
        message: "Invalid latitude value",
      }),
  }),
});

export type LocationInput = z.infer<typeof locationSchema>;
