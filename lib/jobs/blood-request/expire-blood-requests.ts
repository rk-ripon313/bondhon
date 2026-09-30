import { dbConnect } from "@/lib/db/db-connect";
import { BloodRequest } from "@/models/blood-request.model";

export async function expireBloodRequests() {
  await dbConnect();

  const now = new Date();

  const result = await BloodRequest.updateMany(
    {
      status: "active",
      neededBefore: { $lt: now },
    },
    {
      $set: {
        status: "expired",
      },
    },
  );

  return {
    matchedCount: result.matchedCount,
    modifiedCount: result.modifiedCount,
  };
}
