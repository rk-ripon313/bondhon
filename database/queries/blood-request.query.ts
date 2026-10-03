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
  GetBloodRequestsParams,
} from "@/types/blood-request.type";
import { LocationData } from "@/types/location.type";
import { Types } from "mongoose";

export async function getBloodRequests({
  search,
  bloodGroup,
  status,
  urgency,
  sort = "newest",
  lat,
  lng,
  page = 1,
  itemsPerPage = 9,
}: GetBloodRequestsParams = {}) {
  const currentUser = await getCurrentUser();
  const currentUserId = currentUser?.id;

  const filter: Record<string, unknown> = {};

  // Search
  if (search?.trim()) {
    const searchRegex = new RegExp(search.trim(), "i");

    filter.$or = [
      { hospitalName: searchRegex },
      { "location.district": searchRegex },
      { "location.area": searchRegex },
      { "location.address": searchRegex },
    ];
  }

  // Blood Group
  if (bloodGroup && bloodGroup !== "all") {
    filter.bloodGroupNeeded = bloodGroup;
  }

  // Status
  if (status && status !== "all") {
    filter.status = status;
  }

  // Urgency
  if (urgency && urgency !== "all") {
    filter.urgency = urgency;
  }

  // --------------------------------------------------
  // Resolve location
  // URL location has priority.
  // If unavailable, use current user's saved location.
  // --------------------------------------------------

  let latitude: number | undefined;
  let longitude: number | undefined;

  const parsedLat = Number(lat);
  const parsedLng = Number(lng);

  if (Number.isFinite(parsedLat) && Number.isFinite(parsedLng)) {
    latitude = parsedLat;
    longitude = parsedLng;
  } else {
    const userCoordinates = currentUser?.location?.coordinates?.coordinates;

    if (Array.isArray(userCoordinates) && userCoordinates.length === 2) {
      const [userLng, userLat] = userCoordinates;

      if (typeof userLat === "number" && typeof userLng === "number") {
        latitude = userLat;
        longitude = userLng;
      }
    }
  }

  const hasLocation = latitude !== undefined && longitude !== undefined;

  const currentPage = Number(page) || 1;
  const skip = (currentPage - 1) * itemsPerPage;
  const sortOrder = sort === "oldest" ? 1 : -1;

  let bloodRequests;

  if (hasLocation) {
    const currentLatitude = latitude as number;
    const currentLongitude = longitude as number;

    bloodRequests = await BloodRequest.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [currentLongitude, currentLatitude],
          },
          distanceField: "distance",
          spherical: true,
          key: "location.coordinates.coordinates",
          query: filter,
        },
      },

      {
        $sort: {
          distance: 1,
          createdAt: sortOrder,
        },
      },

      {
        $skip: skip,
      },

      {
        $limit: itemsPerPage,
      },

      {
        $lookup: {
          from: "users",
          localField: "requester",
          foreignField: "_id",
          as: "requester",
        },
      },

      {
        $unwind: {
          path: "$requester",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $project: {
          distance: 1,
          bloodGroupNeeded: 1,
          quantity: 1,
          urgency: 1,
          hospitalName: 1,
          contactNumber: 1,
          location: 1,
          neededBefore: 1,
          notes: 1,
          status: 1,
          interestedDonors: 1,
          assignedDonors: 1,

          requester: {
            _id: 1,
            name: 1,
            username: 1,
            image: 1,
            phone: 1,
            email: 1,
          },

          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]);
  } else {
    bloodRequests = await BloodRequest.find(filter)
      .populate({
        path: "requester",
        select: "name username image phone email",
      })
      .sort({ createdAt: sortOrder })
      .skip(skip)
      .limit(itemsPerPage)
      .lean();
  }

  const requests = bloodRequests.map((request) => {
    const interestedDonors = (request.interestedDonors ??
      []) as Types.ObjectId[];

    const assignedDonors = (request.assignedDonors ?? []) as {
      donor: Types.ObjectId;
    }[];

    const requester = request.requester as {
      _id: Types.ObjectId;
      name: string;
      username: string;
      image: string;
    };
    const requestData = { ...request };

    delete requestData.interestedDonors;
    delete requestData.assignedDonors;

    return {
      ...requestData,

      requester: requester ? replaceMongoIdInObject(requester) : null,

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
        ? requester?._id.toString() === currentUserId
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
