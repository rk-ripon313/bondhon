import { auth } from "@/auth";
import { dbConnect } from "@/lib/db/db-connect";
import { replaceMongoIdInObject } from "@/lib/helpers/transform-id";
import { User } from "@/models/user.model";
import { UserProfile } from "@/types/user.type";

/** Get the currently authenticated user */

export async function getCurrentUser(): Promise<UserProfile | null> {
  await dbConnect();

  const session = await auth();

  if (!session?.user?.email) return null;

  const user = await User.findOne({
    email: session.user.email,
  }).lean();

  return replaceMongoIdInObject(user) as UserProfile | null;
}

/** Get the currently authenticated user's connections (followers and following) */

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
