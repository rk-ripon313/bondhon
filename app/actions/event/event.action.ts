"use server";

import { getCurrentUser } from "@/database/queries/user.query";

import { dbConnect } from "@/lib/db/db-connect";
import { localDateTimeToUTC } from "@/lib/helpers/date";
import { createNotifications } from "@/lib/notifications/notification.service";
import { isUserEligibleForAction } from "@/lib/profile/profile-utils";
import {
  eventSchema,
  type EventFormInput,
} from "@/lib/validations/event/event.schema";
import { Event } from "@/models/event.model";
import { User } from "@/models/user.model";
import { Types } from "mongoose";
import { revalidatePath } from "next/cache";

/**
 * Creates a new event in the database and notifies the organizer's followers.
 * @param {EventFormInput} data - The data for the new event.
 * @returns {Promise<{ success: boolean; message: string }>} - An object indicating the success status and a message.
 */
export async function createEvent(data: EventFormInput) {
  try {
    const validation = eventSchema.safeParse(data);

    if (!validation.success) {
      return { success: false, message: "Invalid form data." };
    }

    const user = await getCurrentUser();

    if (!user?.id) {
      return { success: false, message: "User not authenticated." };
    }

    if (!isUserEligibleForAction(user)) {
      return {
        success: false,
        message: "Please complete your profile before creating an event.",
      };
    }

    await dbConnect();

    const startsAt = localDateTimeToUTC(validation.data.startsAt);
    const endsAt = localDateTimeToUTC(validation.data.endsAt);

    if (startsAt <= new Date()) {
      return {
        success: false,
        message: "Event start date must be in the future.",
      };
    }

    if (endsAt <= startsAt) {
      return {
        success: false,
        message: "Event end date must be after the start date.",
      };
    }

    const event = await Event.create({
      ...validation.data,
      startsAt,
      endsAt,
      organizer: user.id,
      status: "upcoming",
    });

    const organizer = (await User.findById(user.id)
      .select("followers")
      .lean()) as {
      followers: Types.ObjectId[];
    };

    await createNotifications({
      receivers: (organizer?.followers ?? []).map((id) => id.toString()),
      actor: user.id,
      type: "event_created",
      title: "New Event",
      message: `${user.name}, whom you follow, created a new event: ${event.title}.`,
      link: `/events/${event._id.toString()}`,
    });

    revalidatePath("/");
    revalidatePath("/profile");
    revalidatePath("/events");

    return {
      success: true,
      message: "Event created successfully.",
    };
  } catch (error) {
    console.error("Create Event Error:", error);

    return {
      success: false,
      message: "An error occurred while creating the event.",
    };
  }
}
