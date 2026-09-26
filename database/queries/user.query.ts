import { auth } from "@/auth";
import { dbConnect } from "@/lib/db/db-connect";
import { replaceMongoIdInObject } from "@/lib/helpers/transform-id";
import { User } from "@/models/user.model";
import { UserProfile } from "@/types/user.type";

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
 *  Get the currently authenticated user's connections (followers and following)
 */

export async function getCurrentUserConnections() {
  const session = await auth();

  if (!session?.user?.email) {
    return null;
  }

  await dbConnect();

  return User.findOne({ email: session.user.email })
    .select("followers following")
    .populate("followers", "name username image -_id")
    .populate("following", "name username image -_id")
    .lean();
}

/**
 * Updates the user's donation history after a confirmed blood donation.
 */

export async function updateUserDonationHistory(
  userId: string,
  donatedAt: Date,
) {
  return User.findByIdAndUpdate(
    userId,
    {
      $set: {
        lastDonationAt: donatedAt,
      },
      $inc: {
        totalDonations: 1,
      },
    },
    {
      new: true,
      runValidators: true,
    },
  ).lean();
}
