import { dbConnect } from "@/lib/db/db-connect";
import { Event } from "@/models/event.model";

export async function updateEventStatuses() {
  await dbConnect();

  const now = new Date();

  // Upcoming → Ongoing
  const ongoingResult = await Event.updateMany(
    {
      status: "upcoming",
      startsAt: { $lte: now },
      endsAt: { $gt: now },
    },
    {
      $set: {
        status: "ongoing",
      },
    },
  );

  // Upcoming / Ongoing → Completed
  const completedResult = await Event.updateMany(
    {
      status: { $in: ["upcoming", "ongoing"] },
      endsAt: { $lte: now },
    },
    {
      $set: {
        status: "completed",
      },
    },
  );

  return {
    ongoing: {
      matchedCount: ongoingResult.matchedCount,
      modifiedCount: ongoingResult.modifiedCount,
    },
    completed: {
      matchedCount: completedResult.matchedCount,
      modifiedCount: completedResult.modifiedCount,
    },
  };
}
