import { getCurrentUser } from "@/database/queries/user.query";
import {
  replaceMongoIdInArray,
  replaceMongoIdInObject,
} from "@/lib/helpers/transform-id";
import { BloodRequest } from "@/models/blood-request.model";
import {
  BloodRequestAssignment,
  BloodRequestCardData,
  BloodRequestDetailData,
  BloodRequestDetailDonor,
} from "@/types/blood-request.type";
import { LocationData } from "@/types/location.type";
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

    const assignedDonors = (request.assignedDonors ?? []) as {
      donor: Types.ObjectId;
    }[];

    return {
      ...request,
      requester: replaceMongoIdInObject(request.requester),
      interestedCount: interestedDonors.length,
      assignedCount: assignedDonors.length,

      isInterested: currentUserId
        ? interestedDonors.some(
            (donorId) => donorId.toString() === currentUserId,
          )
        : false,

      isAssigned: currentUserId
        ? assignedDonors.some((item) => item.donor.toString() === currentUserId)
        : false,

      isOwner: currentUserId
        ? request.requester._id.toString() === currentUserId
        : false,

      currentUserId,
    };
  });

  return replaceMongoIdInArray(requests) as BloodRequestCardData[];
}

interface PopulatedRequester {
  _id: Types.ObjectId;
  name: string;
  username: string;
  image?: string;
  phone: string;
}

interface PopulatedDonor {
  _id: Types.ObjectId;
  name: string;
  username: string;
  image?: string;
  bloodGroup: string;
  phone: string;
  location: LocationData;
}

interface PopulatedAssignment {
  _id: Types.ObjectId;
  donor: PopulatedDonor;
  assignedAt: Date;
  donationStatus: string;
  donatedAt?: Date;
  donorConfirmedAt?: Date;
  requesterConfirmedAt?: Date;
}

export async function getBloodRequestById(
  requestId: string,
): Promise<BloodRequestDetailData | null> {
  const currentUser = await getCurrentUser();
  const currentUserId = currentUser?.id;

  const bloodRequest = await BloodRequest.findById(requestId)
    .populate({
      path: "requester",
      select: "name username image phone email",
    })
    .populate({
      path: "interestedDonors",
      select: "name username image bloodGroup phone location",
    })
    .populate({
      path: "assignedDonors.donor",
      select: "name username image bloodGroup phone  location",
    })
    .lean();

  if (!bloodRequest) return null;

  const requester = replaceMongoIdInObject(
    bloodRequest.requester as PopulatedRequester,
  );

  if (!requester) return null;

  const interestedDonors = replaceMongoIdInArray(
    bloodRequest.interestedDonors as PopulatedDonor[],
  ) as BloodRequestDetailDonor[];

  const assignedDonors = (
    bloodRequest.assignedDonors as PopulatedAssignment[]
  ).map((assignment) => ({
    ...assignment,
    donor: replaceMongoIdInObject(assignment.donor)!,
  })) as BloodRequestAssignment[];

  const isOwner = currentUserId ? requester.id === currentUserId : false;

  const isInterested = currentUserId
    ? (bloodRequest.interestedDonors as PopulatedDonor[]).some(
        (donor) => donor._id.toString() === currentUserId,
      )
    : false;

  const isAssigned = currentUserId
    ? (bloodRequest.assignedDonors as PopulatedAssignment[]).some(
        (assignment) => assignment.donor._id.toString() === currentUserId,
      )
    : false;

  return {
    ...replaceMongoIdInObject(bloodRequest),
    requester,

    interestedDonors,
    assignedDonors,
    interestedCount: interestedDonors.length,
    assignedCount: assignedDonors.length,

    currentUserId,
    isOwner,
    isInterested,
    isAssigned,
  } as BloodRequestDetailData;
}
