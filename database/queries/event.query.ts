import { dbConnect } from "@/lib/db/db-connect";
import { Event } from "@/models/event.model";
import { EventCardData, GetEventsParams } from "@/types/event.type";

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
  await dbConnect();

  const filter: Record<string, any> = {};

  // Search
  if (search?.trim()) {
    const regex = new RegExp(
      search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      "i",
    );

    filter.$or = [{ title: regex }, { category: regex }, { tags: regex }];
  }

  // Location filters
  if (division) {
    filter["location.division"] = new RegExp(`^${division}$`, "i");
  }

  if (district) {
    filter["location.district"] = new RegExp(`^${district}$`, "i");
  }

  if (upazila) {
    filter["location.upazila"] = new RegExp(`^${upazila}$`, "i");
  }

  // Category
  if (category && category !== "all") {
    filter.category = category;
  }

  // Status
  if (status && status !== "all") {
    filter.status = status;
  }

  // Nearest location
  const latitude = Number(lat);
  const longitude = Number(lng);

  const hasCoordinates =
    lat !== undefined &&
    lng !== undefined &&
    Number.isFinite(latitude) &&
    Number.isFinite(longitude);

  const useNearest = sort === "nearest" && hasCoordinates;

  const countFilter = { ...filter };

  if (useNearest) {
    filter["location.coordinates"] = {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
      },
    };
  }

  const currentPage = Math.max(Number(page) || 1, 1);
  const limit = Math.max(Number(itemsPerPage) || 9, 1);
  const skip = (currentPage - 1) * limit;

  const sortOption = sort === "latest" ? { createdAt: -1 } : { startsAt: 1 };

  const eventsQuery = Event.find(filter)
    .populate("organizer", "name username image")
    .skip(skip)
    .limit(limit)
    .lean();

  // $near already sorts by distance
  if (!useNearest) {
    eventsQuery.sort(sortOption);
  }

  const [events, totalCount] = await Promise.all([
    eventsQuery,
    Event.countDocuments(countFilter),
  ]);

  const serializedEvents = events.map((event) => {
    const organizer = event.organizer as unknown as {
      _id: { toString(): string };
      name: string;
      username: string;
      image?: string;
    };

    return {
      ...event,
      id: event._id.toString(),
      organizer: organizer
        ? {
            id: organizer._id.toString(),
            name: organizer.name,
            username: organizer.username,
            image: organizer.image,
          }
        : null,
      interestedCount: event.interestedUsers?.length ?? 0,
      goingCount: event.goingUsers?.length ?? 0,
    };
  });

  const totalPages = Math.ceil(totalCount / limit);

  return {
    events: serializedEvents as EventCardData[],
    totalCount,
    totalPages,
    currentPage,
  };
}
