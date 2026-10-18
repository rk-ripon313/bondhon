import { Types } from "mongoose";

import { dbConnect } from "@/lib/db/db-connect";
import { replaceMongoIdInArray } from "@/lib/helpers/transform-id";
import { CommunityDonor } from "@/models/community-donor.model";
import { User } from "@/models/user.model";
import {
  CommunityDonorType,
  GetDonorsParams,
  VerifiedDonor,
} from "@/types/donor.type";
import { getCurrentUser } from "./user.query";

/**
 * Fetches verified donors based on search, availability, blood group,
 * location, and pagination. Excludes the current user and blocked users.
 *
 * @param {GetDonorsParams} params - The donor filtering and pagination parameters.
 * @returns {Promise<{ varifiedDonor: VerifiedDonor[]; totalCount: number; totalPages: number }>}
 * A promise resolving to the filtered donors, total count, and total pages.
 */

export async function getDonors({
  search,
  availableOnly,
  division,
  district,
  upazila,
  bloodGroup = "all",
  lat,
  lng,
  page = 1,
  itemsPerPage = 9,
}: GetDonorsParams = {}) {
  const currentUser = await getCurrentUser();
  const currentUserId = currentUser?.id;

  await dbConnect();

  const filter: Record<string, unknown> = {};

  // Search
  if (search?.trim()) {
    const searchRegex = new RegExp(
      search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      "i",
    );

    filter.$or = [{ name: searchRegex }, { username: searchRegex }];
  }

  // Blood group
  if (bloodGroup && bloodGroup !== "all") {
    filter.bloodGroup = bloodGroup;
  }

  // Availability
  if (availableOnly === "true") {
    filter.isAvailableForDonate = true;
  }

  // Location filters

  if (!district && division && division !== "all") {
    filter["location.district"] = division;
  }

  if (district && district !== "all") {
    filter["location.district"] = district;
  }

  if (upazila && upazila !== "all") {
    filter["location.area"] = upazila;
  }

  // Exclude current user from blocked-user results.
  const blockedIds = [...(currentUser?.blockedUsers ?? [])].map((id) =>
    id.toString(),
  );

  if (blockedIds.length) {
    filter._id = {
      $nin: blockedIds.map((id) => new Types.ObjectId(id)),
    };
  }

  // URL coordinates take priority; otherwise use saved user coordinates.
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
    const coordinates = currentUser?.location?.coordinates?.coordinates;

    if (Array.isArray(coordinates) && coordinates.length === 2) {
      const [userLng, userLat] = coordinates;

      if (typeof userLat === "number" && typeof userLng === "number") {
        latitude = userLat;
        longitude = userLng;
      }
    }
  }

  const currentPage = Math.max(1, Number(page) || 1);
  const limit = Math.min(50, Math.max(1, Number(itemsPerPage) || 9));
  const skip = (currentPage - 1) * limit;

  const hasLocation = latitude !== undefined && longitude !== undefined;

  const totalCount = await User.countDocuments(filter);
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  let verifiedDonor;

  if (hasLocation) {
    verifiedDonor = await User.aggregate([
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
        $skip: skip,
      },
      {
        $limit: limit,
      },
      {
        $project: {
          name: 1,
          username: 1,
          image: 1,
          bloodGroup: 1,
          isAvailableForDonate: 1,
          location: 1,
          donationHistory: 1,
          distance: 1,
          createdAt: 1,
        },
      },
    ]);
  } else {
    verifiedDonor = await User.find(filter)
      .select(
        "name username image bloodGroup isAvailableForDonate location donationHistory createdAt",
      )
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
  }

  const followingIds = (currentUser?.following ?? []).map((id) =>
    id.toString(),
  );

  const formattedDonors = verifiedDonor.map((donor) => {
    const donorId = donor._id.toString();

    return {
      ...donor,
      isYou: !!currentUserId && donorId === currentUserId,
      isFollowing: followingIds.includes(donorId),
    };
  });

  return {
    verifiedDonor: replaceMongoIdInArray(formattedDonors) as VerifiedDonor[],
    totalCount,
    totalPages,
  };
}

/**
 * Fetches community donors based on search, blood group, location, and pagination.
 * Includes the contributor's name and username, and prioritizes nearby donors
 * when coordinates are available.
 *
 * @param {GetDonorsParams} params - The donor filtering and pagination parameters.
 * @returns {Promise<{ communityDonors: CommunityDonor[]; totalCount: number; totalPages: number }>}
 * A promise resolving to the filtered community donors, total count, and total pages.
 */

export async function getCommunityDonors({
  search,
  bloodGroup = "all",
  division,
  district,
  upazila,
  lat,
  lng,
  page = 1,
  itemsPerPage = 9,
}: GetDonorsParams = {}) {
  const currentUser = await getCurrentUser();

  const filter: Record<string, unknown> = {};

  await dbConnect();

  // Search by donor name, phone, district, area, and address
  if (search?.trim()) {
    const escapedSearch = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const searchRegex = new RegExp(escapedSearch, "i");

    filter.$or = [
      { name: searchRegex },
      { phone: searchRegex },
      { "location.district": searchRegex },
      { "location.area": searchRegex },
      { "location.address": searchRegex },
    ];
  }

  // Blood group filter
  if (bloodGroup && bloodGroup !== "all") {
    filter.bloodGroup = bloodGroup;
  }

  // Location filters

  if (!district && division && division !== "all") {
    filter["location.district"] = division;
  }

  if (district && district !== "all") {
    filter["location.district"] = district;
  }

  if (upazila && upazila !== "all") {
    filter["location.area"] = upazila;
  }

  // Use URL coordinates first, then the current user's saved location

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
    const coordinates = currentUser?.location?.coordinates?.coordinates;

    if (Array.isArray(coordinates) && coordinates.length === 2) {
      const [userLng, userLat] = coordinates;

      if (typeof userLat === "number" && typeof userLng === "number") {
        latitude = userLat;
        longitude = userLng;
      }
    }
  }

  const currentPage = Math.max(1, Number(page) || 1);
  const limit = Math.min(50, Math.max(1, Number(itemsPerPage) || 9));
  const skip = (currentPage - 1) * limit;

  const hasLocation = latitude !== undefined && longitude !== undefined;

  const totalCount = await CommunityDonor.countDocuments(filter);
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  let communityDonors;

  if (hasLocation) {
    communityDonors = await CommunityDonor.aggregate([
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
        $skip: skip,
      },
      {
        $limit: limit,
      },
      {
        $lookup: {
          from: "users",
          localField: "addedBy",
          foreignField: "_id",
          as: "addedBy",
        },
      },

      {
        $unwind: {
          path: "$addedBy",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          name: 1,
          bloodGroup: 1,
          phone: 1,
          location: 1,
          distance: 1,
          addedBy: {
            name: 1,
            username: 1,
          },
          createdAt: 1,
        },
      },
    ]);
  } else {
    communityDonors = await CommunityDonor.find(filter)
      .populate("addedBy", "name username")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
  }

  return {
    communityDonors: replaceMongoIdInArray(
      communityDonors,
    ) as CommunityDonorType[],
    totalCount,
    totalPages,
  };
}
