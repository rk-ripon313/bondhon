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

/**
 * Updates an existing event in the database and notifies interested and going users if the event details have changed.
 * @param {string} eventId - The ID of the event to update.
 * @param {EventFormInput} data - The updated data for the event.
 * @returns {Promise<{ success: boolean; message: string }>} - An object indicating the success status and a message.
 */

export async function updateEvent(eventId: string, data: EventFormInput) {
  try {
    const validation = eventSchema.safeParse(data);

    if (!validation.success) {
      return { success: false, message: "Invalid form data." };
    }

    const user = await getCurrentUser();

    if (!user?.id) {
      return { success: false, message: "User not authenticated." };
    }

    await dbConnect();

    // Verify ownership
    const event = await Event.findOne({
      _id: eventId,
      organizer: user.id,
    })
      .select(
        "status endsAt title startsAt location interestedUsers goingUsers",
      )
      .lean();

    if (!event) {
      return {
        success: false,
        message: "Event not found or you are not allowed to edit it.",
      };
    }

    if (!["upcoming", "ongoing"].includes(event.status)) {
      return {
        success: false,
        message: "Only upcoming or ongoing events can be edited.",
      };
    }

    const now = new Date();

    if (event.endsAt <= now) {
      return {
        success: false,
        message: "This event has already ended.",
      };
    }

    const startsAt = localDateTimeToUTC(validation.data.startsAt);
    const endsAt = localDateTimeToUTC(validation.data.endsAt);

    if (endsAt <= startsAt) {
      return {
        success: false,
        message: "Event end date must be after the start date.",
      };
    }

    if (endsAt <= now) {
      return {
        success: false,
        message: "Event end date must be in the future.",
      };
    }

    if (event.status === "upcoming" && startsAt <= now) {
      return {
        success: false,
        message: "Upcoming event must start in the future.",
      };
    }

    if (event.status === "ongoing" && startsAt > now) {
      return {
        success: false,
        message: "An ongoing event cannot have a future start date.",
      };
    }

    // Update event
    const updateResult = await Event.updateOne(
      {
        _id: eventId,
        organizer: user.id,
        status: { $in: ["upcoming", "ongoing"] },
        endsAt: { $gt: now },
      },
      {
        $set: {
          ...validation.data,
          startsAt,
          endsAt,
        },
      },
    );

    if (updateResult.matchedCount === 0) {
      return {
        success: false,
        message: "Failed to update the event. It may no longer be editable.",
      };
    }

    //Notify interested and going users if the event details have changed
    const shouldNotify =
      event.title !== validation.data.title ||
      event.startsAt.getTime() !== startsAt.getTime() ||
      event.endsAt.getTime() !== endsAt.getTime() ||
      event.location.district !== validation.data.location.district ||
      event.location.area !== validation.data.location.area;

    if (shouldNotify) {
      const receivers = [
        ...new Set([
          ...event.interestedUsers.map(String),
          ...event.goingUsers.map(String),
        ]),
      ]
        .filter((id) => id !== user.id)
        .map((id) => new Types.ObjectId(id));

      if (receivers.length) {
        await createNotifications({
          receivers,
          actor: user.id,
          type: "event_updated",
          title: "Event Updated",
          message: `${validation.data.title} has important updates.`,
          link: `/events/${eventId}`,
        });
      }
    }

    revalidatePath("/");
    revalidatePath("/profile");
    revalidatePath("/events");
    revalidatePath(`/events/${eventId}`);

    return {
      success: true,
      message: "Event updated successfully.",
    };
  } catch (error) {
    console.error("Update Event Error:", error);

    return {
      success: false,
      message: "An error occurred while updating the event.",
    };
  }
}

/**
 * Deletes an existing event from the database and notifies interested and going users about the deletion.
 * @param {string} eventId - The ID of the event to delete.
 * @returns {Promise<{ success: boolean; message: string }>} - An object indicating the success status and a message.
 */

export async function deleteEvent(eventId: string) {
  try {
    const user = await getCurrentUser();

    if (!user?.id) {
      return { success: false, message: "User not authenticated." };
    }

    await dbConnect();

    const now = new Date();

    // Verify ownership, status and expiry before deleting.
    const deletedEvent = await Event.findOneAndDelete({
      _id: eventId,
      organizer: user.id,
      status: "upcoming",
      endsAt: { $gt: now },
    });

    if (!deletedEvent) {
      return {
        success: false,
        message: "Event not found or it is no longer available for deletion.",
      };
    }

    revalidatePath("/");
    revalidatePath("/profile");
    revalidatePath("/events");
    revalidatePath(`/events/${eventId}`);

    return {
      success: true,
      message: "Event deleted successfully.",
    };
  } catch (error) {
    console.error("Delete Event Error:", error);

    return {
      success: false,
      message: "An error occurred while deleting the event.",
    };
  }
}
