import { dbConnect } from "@/lib/db/db-connect";
import {
  replaceMongoIdInArray,
  replaceMongoIdInObject,
} from "@/lib/helpers/transform-id";
import { Event } from "@/models/event.model";
import { EventCardData, GetEventsParams } from "@/types/event.type";
import { Types } from "mongoose";
import { getCurrentUser } from "./user.query";

export async function getEvents({
  search,
  division,
  district,
  upazila,
  category,
  status = "upcoming",
  sort = "soonest",
  lat,
  lng,
  page = 1,
  itemsPerPage = 9,
}: GetEventsParams = {}) {
  const currentUser = await getCurrentUser();
  const currentUserId = currentUser?.id ?? null;

  await dbConnect();

  // Base filter
  const filter: Record<string, unknown> = {};

  // Search
  if (search?.trim()) {
    const searchRegex = new RegExp(
      search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      "i",
    );
    filter.$or = [
      { title: searchRegex },
      { category: searchRegex },
      { tags: searchRegex },
    ];
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

  // Category
  if (category && category !== "all") {
    filter.category = category;
  }

  // Status
  if (status && status !== "all") {
    filter.status = status;
  }

  // Exclude events from blocked users
  const blockedIds = (currentUser?.blockedUsers ?? []).map(
    (id) => new Types.ObjectId(id.toString()),
  );

  if (blockedIds.length) {
    filter.organizer = { $nin: blockedIds };
  }

  // Coordinates: URL first, then saved user location
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

  const hasLocation = latitude !== undefined && longitude !== undefined;

  // Pagination
  const currentPage = Math.max(1, Number(page) || 1);
  const limit = Math.min(50, Math.max(1, Number(itemsPerPage) || 9));
  const skip = (currentPage - 1) * limit;

  const totalCount = await Event.countDocuments(filter);
  const totalPages = Math.ceil(totalCount / limit);

  // Fetch events
  let events;

  if (sort === "nearest" && hasLocation) {
    events = await Event.aggregate([
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
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: "users",
          localField: "organizer",
          foreignField: "_id",
          as: "organizer",
        },
      },
      {
        $unwind: {
          path: "$organizer",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          title: 1,
          description: 1,
          thumbnail: 1,
          category: 1,
          startsAt: 1,
          endsAt: 1,
          status: 1,
          location: 1,
          tags: 1,
          interestedUsers: 1,
          goingUsers: 1,
          distance: 1,
          createdAt: 1,
          updatedAt: 1,
          organizer: {
            _id: 1,
            name: 1,
            username: 1,
            image: 1,
            phone: 1,
            email: 1,
          },
        },
      },
    ]);
  } else {
    events = await Event.find(filter)
      .populate({
        path: "organizer",
        select: "name username image phone email",
      })
      .sort(sort === "latest" ? { createdAt: -1 } : { startsAt: 1 })
      .skip(skip)
      .limit(limit)
      .lean();
  }

  // Format events and current user relationships
  const formattedEvents = events.map((event) => {
    const interestedUsers = (event.interestedUsers ?? []) as Types.ObjectId[];
    const goingUsers = (event.goingUsers ?? []) as Types.ObjectId[];

    const organizer = event.organizer as {
      _id: Types.ObjectId;
      name: string;
      username: string;
      image: string;
    };

    const organizerId = organizer?._id.toString();

    const eventData = { ...event };

    delete eventData.interestedUsers;
    delete eventData.goingUsers;

    return {
      ...eventData,

      organizer: organizer ? replaceMongoIdInObject(organizer) : null,

      interestedCount: interestedUsers.length,
      goingCount: goingUsers.length,

      currentUserId,

      isOwner: !!currentUserId && organizerId === currentUserId,

      isFollowing:
        !!currentUserId &&
        organizerId !== currentUserId &&
        (currentUser?.following ?? []).some(
          (userId) => userId.toString() === organizerId,
        ),

      isInterested:
        !!currentUserId &&
        interestedUsers.some((userId) => userId.toString() === currentUserId),

      isGoing:
        !!currentUserId &&
        goingUsers.some((userId) => userId.toString() === currentUserId),
    };
  });

  return {
    events: replaceMongoIdInArray(formattedEvents) as EventCardData[],
    totalCount,
    totalPages,
  };
}
