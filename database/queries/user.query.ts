import { auth } from "@/auth";
import { dbConnect } from "@/lib/db/db-connect";
import { User } from "@/models/user.model";

export async function getCurrentUser() {
  await dbConnect();

  const session = await auth();
  if (!session?.user) return null;

  return User.findOne({
    email: session.user.email,
  }).lean();
}
