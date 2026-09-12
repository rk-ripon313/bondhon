import { dbConnect } from "@/lib/db/db-connect";
import { replaceMongoIdInArray } from "@/lib/helpers/transform-id";
import { BloodRequest } from "@/models/blood-request.model";
import { BloodRequestCardData } from "@/types/blood-request.type";

export async function getBloodRequests(requesterId?: string) {
  await dbConnect();

  const filter = requesterId ? { requester: requesterId } : {};

  const bloodRequests = await BloodRequest.find(filter)
    .populate({
      path: "requester",
      select: "name username image",
    })
    .sort({ createdAt: -1 })
    .lean();
  return replaceMongoIdInArray(bloodRequests) as BloodRequestCardData[];
}
