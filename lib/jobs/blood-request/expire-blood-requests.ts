import { dbConnect } from "@/lib/db/db-connect";
import { createNotifications } from "@/lib/notifications/notification.service";
import { BloodRequest } from "@/models/blood-request.model";

export async function expireBloodRequests() {
  await dbConnect();

  const now = new Date();

  const expiredRequests = await BloodRequest.find({
    status: "active",
    neededBefore: { $lt: now },
  })
    .select("_id requester bloodGroupNeeded")
    .lean();

  if (expiredRequests.length === 0) {
    return {
      matchedCount: 0,
      modifiedCount: 0,
    };
  }

  const result = await BloodRequest.updateMany(
    {
      _id: { $in: expiredRequests.map((request) => request._id) },
      status: "active",
      neededBefore: { $lt: now },
    },
    {
      $set: {
        status: "expired",
      },
    },
  );

  for (const request of expiredRequests) {
    await createNotifications({
      receivers: [request.requester],
      type: "blood_request_expired",
      title: "Blood Request Expired",
      message: `Your ${request.bloodGroupNeeded} blood request has expired.`,
      link: `/blood-requests/${request._id}`,
    });
  }

  return {
    matchedCount: result.matchedCount,
    modifiedCount: result.modifiedCount,
  };
}
