import { dbConnect } from "@/lib/db/db-connect";
import { createNotifications } from "@/lib/notifications/notification.service";
import { BloodRequest } from "@/models/blood-request.model";

export async function remindBloodRequests() {
  await dbConnect();

  const now = new Date();
  const reminderWindowEnd = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  const requests = await BloodRequest.find({
    status: "active",
    neededBefore: {
      $gt: now,
      $lte: reminderWindowEnd,
    },
    reminderSentAt: null,
  })
    .select("_id requester bloodGroupNeeded")
    .lean();

  let remindedCount = 0;

  for (const request of requests) {
    await createNotifications({
      receivers: [request.requester],
      type: "blood_request_expiring",
      title: "Blood Request Expiring Soon",
      message: `Your ${request.bloodGroupNeeded} blood request is expiring within 24 hours.`,
      link: `/blood-requests/${request._id}`,
    });

    await BloodRequest.updateOne(
      {
        _id: request._id,
        reminderSentAt: null,
      },
      {
        $set: { reminderSentAt: new Date() },
      },
    );

    remindedCount++;
  }

  return {
    matchedCount: requests.length,
    remindedCount,
  };
}
