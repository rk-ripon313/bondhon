import { EVENT_CATEGORIES } from "@/constants";
import { z } from "zod";
import { locationSchema } from "../shared/location.schema";

export const eventSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(150, "Title cannot exceed 150 characters"),

  description: z
    .string()
    .trim()
    .max(2000, "Description cannot exceed 2000 characters")
    .optional()
    .or(z.literal("")),

  category: z.enum(EVENT_CATEGORIES, {
    message: "Please select an event category",
  }),

  tags: z
    .array(z.string().trim().min(1).max(30))
    .max(10, "You can add up to 10 tags")
    .default([]),

  eventDate: z
    .string()
    .min(1, "Please select the event date and time")
    .refine(
      (value) => !Number.isNaN(new Date(value).getTime()),
      "Please enter a valid date and time",
    )
    .refine(
      (value) => new Date(value).getTime() > Date.now(),
      "Event date must be in the future",
    ),

  thumbnail: z.string().trim().optional().or(z.literal("")),

  location: locationSchema,
});

export type EventFormInput = z.input<typeof eventSchema>;
