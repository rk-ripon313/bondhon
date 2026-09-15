import { getCurrentUser } from "@/database/queries/user.query";
import {
  replaceMongoIdInArray,
  replaceMongoIdInObject,
} from "@/lib/helpers/transform-id";
import { BloodRequest } from "@/models/blood-request.model";
import { BloodRequestCardData } from "@/types/blood-request.type";
import { Types } from "mongoose";

export async function getBloodRequests(requesterId?: string) {
  const currentUser = await getCurrentUser();
  const currentUserId = currentUser?.id;

  const filter = requesterId ? { requester: requesterId } : {};

  const bloodRequests = await BloodRequest.find(filter)
    .populate({
      path: "requester",
      select: "name username image",
    })
    .sort({ createdAt: -1 })
    .lean();

  const requests = bloodRequests.map((request) => {
    const interestedDonors = (request.interestedDonors ??
      []) as Types.ObjectId[];

    return {
      ...request,
      requester: replaceMongoIdInObject(request.requester),
      interestedCount: interestedDonors.length,
      assignedCount: request.assignedDonors?.length ?? 0,

      isInterested: currentUserId
        ? interestedDonors.some(
            (donorId) => donorId.toString() === currentUserId,
          )
        : false,

      isOwner: currentUserId
        ? request.requester._id.toString() === currentUserId
        : false,
    };
  });

  return replaceMongoIdInArray(requests) as BloodRequestCardData[];
}
