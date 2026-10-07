import { auth } from "@/auth";
import { dbConnect } from "@/lib/db/db-connect";
import { replaceMongoIdInObject } from "@/lib/helpers/transform-id";
import { User } from "@/models/user.model";
import { UserProfile } from "@/types/user.type";
import { Types } from "mongoose";

/**
 *  Get the currently authenticated user
 */

export async function getCurrentUser(): Promise<UserProfile | null> {
  await dbConnect();

  const session = await auth();

  if (!session?.user?.email) return null;

  const user = await User.findOne({
    email: session.user.email,
  }).lean();

  return replaceMongoIdInObject(user) as UserProfile | null;
}

/**
 *  Get a user by their username
 */

export async function getUserByUsername(username: string) {
  await dbConnect();

  const user = await User.findOne({
    username: { $regex: new RegExp(`^${username}$`, "i") },
  }).lean();

  if (!user) {
    return null;
  }
  return replaceMongoIdInObject(user) as UserProfile | null;
}

/**
 *  Check if a username is available
 */

export async function isUsernameAvailable(
  username: string,
  excludeUserId?: string,
) {
  const normalizedUsername = username.trim().toLowerCase();

  if (!normalizedUsername) {
    return false;
  }

  const query: {
    username: string;
    _id?: { $ne: string };
  } = {
    username: normalizedUsername,
  };

  if (excludeUserId) {
    query._id = { $ne: excludeUserId };
  }

  const existingUser = await User.exists(query);

  return !existingUser;
}

/**
 *  Get the connections (followers and following) of a user
 * @param username The username of the user whose connections to load.
 * @returns A promise resolving to the user's connections or null if not found.
 */

export async function getUserConnections(username: string) {
  const currentUser = await getCurrentUser();

  const isOwnProfile = currentUser?.username === username;
  const blockedUsers = currentUser?.blockedUsers ?? [];

  await dbConnect();

  const user = await User.findOne({ username })
    .select("_id followers following")
    .populate([
      {
        path: "followers",
        select: "name username image",
        ...(isOwnProfile
          ? {}
          : {
              match: {
                _id: { $nin: blockedUsers },
              },
            }),
      },
      {
        path: "following",
        select: "name username image",
        ...(isOwnProfile
          ? {}
          : {
              match: {
                _id: { $nin: blockedUsers },
              },
            }),
      },
    ])
    .lean();

  if (!user) {
    return null;
  }

  const followersUser = (user.followers ?? []) as {
    _id: Types.ObjectId;
    name: string;
    username: string;
    image?: string;
  }[];

  const followingUser = (user.following ?? []) as {
    _id: Types.ObjectId;
    name: string;
    username: string;
    image?: string;
  }[];

  const currentFollowingIds = new Set(
    (currentUser?.following ?? []).map((id) => id.toString()),
  );

  return {
    followers: followersUser.map((follower) => ({
      ...follower,
      isFollowing: currentFollowingIds.has(follower._id.toString()),
    })),

    following: followingUser.map((following) => ({
      ...following,
      isFollowing: currentFollowingIds.has(following._id.toString()),
    })),
  };
}

/**
 * Updates the user's donation history after a confirmed blood donation.
 */

export async function updateUserDonationHistory(
  userId: string,
  requestId: string,
  donatedAt: Date,
) {
  return User.findByIdAndUpdate(
    userId,
    {
      $set: {
        isAvailableForDonate: false,
      },
      $push: {
        donationHistory: {
          donatedAt,
          bloodRequest: requestId,
        },
      },
    },
    {
      new: true,
      runValidators: true,
    },
  ).lean();
}
