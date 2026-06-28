import { z } from "zod";

export const locationSchema = z.object({
  area: z.string().trim().min(1, "Area/Upazila/Thana is required"),
  district: z.string().trim().min(1, "District is required"),
  coordinates: z.object({
    type: z.literal("Point").default("Point"),
    coordinates: z
      .array(z.number())
      .length(2, "Coordinates must contain exactly longitude and latitude")

      .refine((coords) => coords[0] >= -180 && coords[0] <= 180, {
        message: "Invalid longitude value",
      })
      .refine((coords) => coords[1] >= -90 && coords[1] <= 90, {
        message: "Invalid latitude value",
      }),
  }),
});

export type LocationInput = z.infer<typeof locationSchema>;
