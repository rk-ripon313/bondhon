import { BLOOD_GROUPS } from "@/constants";
import { getCurrentUser } from "@/database/queries/user.query";
import { isBloodGroupCompatible } from "@/lib/blood/blood-group";
import {
  replaceMongoIdInArray,
  replaceMongoIdInObject,
} from "@/lib/helpers/transform-id";
import { BloodRequest } from "@/models/blood-request.model";
import { User } from "@/models/user.model";
import {
  BloodRequestAssignment,
  BloodRequestCardData,
  BloodRequestDetailData,
  BloodRequestDetailDonor,
  GetBloodRequestsParams,
  GetMyBloodRequestActivityParams,
} from "@/types/blood-request.type";
import { LocationData } from "@/types/location.type";
import { Types } from "mongoose";

/**
 * Fetches blood requests based on the provided parameters, including search, blood group, status, urgency, sorting, location, and pagination. Returns the filtered blood requests along with total count and total pages.
 *
 * @param {GetBloodRequestsParams} params - The parameters for filtering and sorting blood requests.
 * @returns {Promise<{ requests: BloodRequestCardData[]; totalCount: number; totalPages: number }>} A promise that resolves to an object containing the filtered blood requests, total count, and total pages.
 */

export async function getBloodRequests({
  search,
  division,
  district,
  upazila,
  bloodGroup,
  status = "active",
  urgency,
  sort = "newest",
  lat,
  lng,
  page = 1,
  itemsPerPage = 9,
}: GetBloodRequestsParams = {}) {
  const currentUser = await getCurrentUser();
  const currentUserId = currentUser?.id ?? null;

  const filter: Record<string, unknown> = {};

  // Search Filter
  if (search?.trim()) {
    const searchRegex = new RegExp(
      search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      "i",
    );

    filter.$or = [
      { hospitalName: searchRegex },
      { "location.district": searchRegex },
      { "location.area": searchRegex },
      { "location.address": searchRegex },
    ];
  }

  // Location Filters (Division, District, Upazila)
  if (!district && division && division !== "all") {
    filter["location.district"] = division;
  }

  if (district && district !== "all") {
    filter["location.district"] = district;
  }

  if (upazila && upazila !== "all") {
    filter["location.area"] = upazila;
  }

  // Blood Group Filter
  if (bloodGroup && bloodGroup !== "all") {
    filter.bloodGroupNeeded = bloodGroup;
  } else if (currentUser?.bloodGroup) {
    // Default recommendation: show compatible blood requests if no explicit blood group is selected
    filter.bloodGroupNeeded = {
      $in: BLOOD_GROUPS.filter((group) =>
        isBloodGroupCompatible(currentUser.bloodGroup, group),
      ),
    };
  }

  // Status Filter
  if (status && status !== "all") {
    filter.status = status;
  }

  // Urgency Filter
  if (urgency && urgency !== "all") {
    filter.urgency = urgency;
  }

  // Exclude events from blocked users
  const blockedIds = (currentUser?.blockedUsers ?? []).map(
    (id) => new Types.ObjectId(id.toString()),
  );

  if (blockedIds.length) {
    filter.requester = { $nin: blockedIds };
  }

  // --------------------------------------------------
  // Resolve Geolocation coordinates (URL vs User profile)
  // --------------------------------------------------
  let latitude: number | undefined;
  let longitude: number | undefined;

  const parsedLat = Number(lat);
  const parsedLng = Number(lng);

  if (
    lat !== undefined &&
    lng !== undefined &&
    lat !== "" &&
    lng !== "" &&
    Number.isFinite(parsedLat) &&
    Number.isFinite(parsedLng) &&
    Math.abs(parsedLat) <= 90 &&
    Math.abs(parsedLng) <= 180
  ) {
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

  // Pagination & Sorting calculations
  const currentPage = Math.max(1, Number(page) || 1);
  const limit = Math.min(50, Math.max(1, Number(itemsPerPage) || 9));
  const skip = (currentPage - 1) * limit;
  const sortOrder = sort === "oldest" ? 1 : -1;

  const totalCount = await BloodRequest.countDocuments(filter);
  const totalPages = Math.ceil(totalCount / limit);

  let bloodRequests;

  if (hasLocation) {
    bloodRequests = await BloodRequest.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [longitude!, latitude!],
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
        $limit: limit,
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
          additionalNotes: 1,
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
      .limit(limit)
      .lean();
  }

  // Transform and map formatted requests
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
      isFollowing:
        !!currentUserId &&
        !!requester &&
        requester._id.toString() !== currentUserId &&
        (currentUser?.following ?? []).some(
          (userId) => userId.toString() === requester._id.toString(),
        ),
      currentUserId,
    };
  });

  return {
    requests: replaceMongoIdInArray(requests) as BloodRequestCardData[],
    totalCount,
    totalPages,
  };
}

// ------------------------------------
// ------------------------------------

// Interface for the populated requester document
interface PopulatedRequester {
  _id: Types.ObjectId;
  name: string;
  username: string;
  image?: string;
  phone: string;
}

// Interface for the populated donor document
interface PopulatedDonor {
  _id: Types.ObjectId;
  name: string;
  username: string;
  image?: string;
  bloodGroup: string;
  phone: string;
  location: LocationData;
}

// Interface for the populated assignment document
interface PopulatedAssignment {
  _id: Types.ObjectId;
  donor: PopulatedDonor;
  assignedAt: Date;
  donationStatus: string;
  donatedAt?: Date;
  donorConfirmedAt?: Date;
  requesterConfirmedAt?: Date;
}

/**
 * Fetches a blood request by its ID and returns detailed information about the request, including requester details, interested donors, assigned donors, and user-specific flags.
 *
 * @param {string} requestId - The ID of the blood request to fetch.
 * @returns {Promise<BloodRequestDetailData | null>} A promise that resolves to the detailed blood request data or null if not found.
 */

export async function getBloodRequestById(
  requestId: string,
): Promise<BloodRequestDetailData | null> {
  // Fetch the current user once to calculate viewer-specific permissions.
  const currentUser = await getCurrentUser();
  const currentUserId = currentUser?.id;

  // Populate only the fields required by the blood request details UI.
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
      select: "name username image bloodGroup phone location",
    })
    .lean();

  // Return null when the request does not exist.
  if (!bloodRequest) return null;

  // Normalize MongoDB IDs before returning data to the UI.
  const requester = replaceMongoIdInObject(
    bloodRequest.requester as PopulatedRequester,
  );

  // A valid requester is required to render the request details.
  if (!requester) return null;

  // Use a Set for efficient following checks across all displayed users.
  const followingIds = new Set(
    (currentUser?.following ?? []).map((userId) => userId.toString()),
  );

  // Calculate whether the current user follows the requester.
  const isFollowing =
    !!currentUserId &&
    requester.id !== currentUserId &&
    followingIds.has(requester.id);

  // Normalize interested donors and attach viewer-specific UI flags.
  const interestedDonors = (
    replaceMongoIdInArray(
      bloodRequest.interestedDonors as PopulatedDonor[],
    ) as BloodRequestDetailDonor[]
  ).map((donor) => ({
    ...donor,
    isFollowing:
      !!currentUserId &&
      donor.id !== currentUserId &&
      followingIds.has(donor.id),
    isYou: !!currentUserId && donor.id === currentUserId,
  }));

  // Normalize assigned donors and attach the same UI flags.
  // Keep this mapping consistent with the interested donors mapping.
  const assignedDonors = (
    bloodRequest.assignedDonors as PopulatedAssignment[]
  ).flatMap((assignment) => {
    // Skip assignments whose donor reference could not be populated.
    if (!assignment.donor) return [];

    const donor = replaceMongoIdInObject(assignment.donor);

    if (!donor) return [];

    return [
      {
        ...assignment,
        donor: {
          ...donor,
          isFollowing:
            !!currentUserId &&
            donor.id !== currentUserId &&
            followingIds.has(donor.id),
          isYou: !!currentUserId && donor.id === currentUserId,
        },
      },
    ];
  }) as BloodRequestAssignment[];

  // These flags control which actions the current viewer can access.
  const isOwner = !!currentUserId && requester.id === currentUserId;

  const isInterested =
    !!currentUserId &&
    (bloodRequest.interestedDonors as PopulatedDonor[]).some(
      (donor) => donor._id.toString() === currentUserId,
    );

  const isAssigned =
    !!currentUserId &&
    (bloodRequest.assignedDonors as PopulatedAssignment[]).some(
      (assignment) => assignment.donor?._id?.toString() === currentUserId,
    );

  // Return normalized request data together with the viewer-specific flags.
  return {
    ...replaceMongoIdInObject(bloodRequest),
    requester,
    interestedDonors,
    assignedDonors,
    interestedCount: interestedDonors.length,
    assignedCount: assignedDonors.length,
    currentUserId,
    isOwner,
    isFollowing,
    isInterested,
    isAssigned,
  } as BloodRequestDetailData;
}

// --------------------------------
// --------------------------------

/**
 * Fetches blood requests created by a specific user based on the provided parameters, including status, sorting, and pagination. Returns the filtered blood requests along with total count and total pages.
 *
 * @param {string} identifier - The user ID or username of the requester.
 * @param {GetBloodRequestsParams} params - The parameters for filtering and sorting blood requests.
 * @returns {Promise<{ requests: BloodRequestCardData[]; totalCount: number; totalPages: number }>} A promise that resolves to an object containing the filtered blood requests, total count, and total pages.
 */

export async function getBloodRequestsByUser(
  identifier: string,
  {
    status = "all",
    sort = "newest",
    page = 1,
    itemsPerPage = 10,
  }: GetBloodRequestsParams = {},
) {
  // Find user by ID or username
  const user = await User.findOne({
    $or: [{ _id: identifier }, { username: identifier }],
  })
    .select("_id blockedUsers")
    .lean();

  if (!user) {
    return {
      requests: [],
      totalCount: 0,
      totalPages: 0,
    };
  }

  const currentUser = await getCurrentUser();
  const currentUserId = currentUser?.id;
  const targetUserId = user._id.toString();

  // Check mutual block relationship
  if (currentUserId && currentUserId !== targetUserId) {
    const isBlocked =
      currentUser.blockedUsers?.some((id) => id.toString() === targetUserId) ||
      user.blockedUsers?.some(
        (id: Types.ObjectId) => id.toString() === currentUserId,
      );

    if (isBlocked) {
      return {
        requests: [],
        totalCount: 0,
        totalPages: 0,
      };
    }
  }

  // Build query filter
  const filter: Record<string, unknown> = {
    requester: user._id,
  };

  if (status !== "all") {
    filter.status = status;
  }

  // Pagination & sorting
  const currentPage = Math.max(1, Number(page) || 1);
  const limit = Math.min(
    50,
    Math.max(1, Math.floor(Number(itemsPerPage) || 10)),
  );
  const skip = (currentPage - 1) * limit;
  const sortOrder = sort === "oldest" ? 1 : -1;

  // Fetch requests and total count
  const [totalCount, bloodRequests] = await Promise.all([
    BloodRequest.countDocuments(filter),

    BloodRequest.find(filter)
      .populate({
        path: "requester",
        select: "name username image phone email",
      })
      .sort({ createdAt: sortOrder })
      .skip(skip)
      .limit(limit)
      .lean(),
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  // Transform request data
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
      image?: string;
      phone?: string;
      email?: string;
    };

    const requestData = { ...request };

    delete requestData.interestedDonors;
    delete requestData.assignedDonors;

    return {
      ...requestData,
      requester: requester ? replaceMongoIdInObject(requester) : null,

      interestedCount: interestedDonors.length,
      assignedCount: assignedDonors.length,

      isInterested:
        !!currentUserId &&
        interestedDonors.some(
          (donorId) => donorId.toString() === currentUserId,
        ),

      isAssigned:
        !!currentUserId &&
        assignedDonors.some((item) => item.donor.toString() === currentUserId),

      isOwner: !!currentUserId && requester?._id.toString() === currentUserId,

      currentUserId,
    };
  });

  return {
    requests: replaceMongoIdInArray(requests) as BloodRequestCardData[],
    totalCount,
    totalPages,
  };
}

/**
 * Fetches the activity for the current user's blood requests based on specified filters.
 *  @param {GetMyBloodRequestActivityParams} params - The parameters for filtering and sorting the user's blood request activity.
 *  @returns {Promise<{ requests: BloodRequestCardData[]; totalPages: number; counts: { all: number; interested: number; assigned: number } }>} A promise that resolves to an object containing the filtered blood requests, total pages, and counts of different activity types.
 *
 */

export async function getMyBloodRequestActivity({
  role = "all",
  status = "all",
  sort = "newest",
  page = 1,
  itemsPerPage = 9,
}: GetMyBloodRequestActivityParams = {}) {
  const currentUser = await getCurrentUser();
  const currentUserId = currentUser?.id;

  if (!currentUserId) {
    return {
      requests: [],
      totalPages: 0,
      counts: {
        all: 0,
        interested: 0,
        assigned: 0,
      },
    };
  }

  const userObjectId = new Types.ObjectId(currentUserId);

  // Base filter
  const baseFilter: Record<string, unknown> = {};

  // Status filter
  if (status !== "all") {
    baseFilter.status = status;
  }

  // Exclude requests from users blocked by the current user
  const blockedIds = (currentUser.blockedUsers ?? []).map(
    (id) => new Types.ObjectId(id.toString()),
  );

  if (blockedIds.length) {
    baseFilter.requester = { $nin: blockedIds };
  }

  // Participation filters
  const roleFilter =
    role === "interested"
      ? { interestedDonors: userObjectId }
      : role === "assigned"
        ? { "assignedDonors.donor": userObjectId }
        : {
            $or: [
              { interestedDonors: userObjectId },
              { "assignedDonors.donor": userObjectId },
            ],
          };

  const filter = {
    ...baseFilter,
    ...roleFilter,
  };

  // Pagination and sorting
  const currentPage = Math.max(1, Number(page) || 1);
  const limit = Math.min(
    50,
    Math.max(1, Math.floor(Number(itemsPerPage) || 9)),
  );

  const skip = (currentPage - 1) * limit;
  const sortOrder = sort === "oldest" ? 1 : -1;

  // Fetch requests and activity counts
  const [bloodRequests, allCount, interestedCount, assignedCount] =
    await Promise.all([
      BloodRequest.find(filter)
        .populate({
          path: "requester",
          select: "name username image phone email",
        })
        .sort({ createdAt: sortOrder })
        .skip(skip)
        .limit(limit)
        .lean(),

      BloodRequest.countDocuments({
        ...baseFilter,
        $or: [
          { interestedDonors: userObjectId },
          { "assignedDonors.donor": userObjectId },
        ],
      }),

      BloodRequest.countDocuments({
        ...baseFilter,
        interestedDonors: userObjectId,
      }),

      BloodRequest.countDocuments({
        ...baseFilter,
        "assignedDonors.donor": userObjectId,
      }),
    ]);

  const counts = {
    all: allCount,
    interested: interestedCount,
    assigned: assignedCount,
  };

  const totalPages = Math.ceil(
    (counts[role as keyof typeof counts] ?? allCount) / limit,
  );

  // Transform request data for BloodRequestCard
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
      image?: string;
    } | null;

    const requestData = { ...request };

    delete requestData.interestedDonors;
    delete requestData.assignedDonors;

    return {
      ...requestData,

      requester: requester ? replaceMongoIdInObject(requester) : null,

      interestedCount: interestedDonors.length,
      assignedCount: assignedDonors.length,

      isInterested: interestedDonors.some(
        (donorId) => donorId.toString() === currentUserId,
      ),

      isAssigned: assignedDonors.some(
        (item) => item.donor.toString() === currentUserId,
      ),

      isOwner: requester?._id.toString() === currentUserId,

      isFollowing:
        !!requester &&
        requester._id.toString() !== currentUserId &&
        (currentUser.following ?? []).some(
          (userId) => userId.toString() === requester._id.toString(),
        ),

      currentUserId,
    };
  });

  return {
    requests: replaceMongoIdInArray(requests) as BloodRequestCardData[],
    totalPages,
    counts: {
      all: allCount,
      interested: interestedCount,
      assigned: assignedCount,
    },
  };
}
