import { auth } from "@/auth";
import { dbConnect } from "@/lib/db/db-connect";
import { User } from "@/models/user.model";

/** Get the currently authenticated user */

export async function getCurrentUser() {
  await dbConnect();

  const session = await auth();
  if (!session?.user) return null;

  return User.findOne({
    email: session.user.email,
  }).lean();
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
