import { notFound } from "next/navigation";

import { getBloodRequestsByUser } from "@/database/queries/blood-request.query";
import {
  getCurrentUser,
  getUserByUsername,
} from "@/database/queries/user.query";

import UserActivityTabs from "@/components/shared/UserActivityTabs";
import UserProfileHero from "./components/UserProfileHero";
import UserSidebar from "./components/UserSidebar";

type UserPageProps = {
  params: Promise<{
    username: string;
  }>;
  searchParams: Promise<{
    page?: string;
    status?: string;
    sort?: string;
  }>;
};

export default async function UserProfilePage({
  params,
  searchParams,
}: UserPageProps) {
  const { username } = await params;
  const query = await searchParams;

  const user = await getUserByUsername(username);

  if (!user) {
    notFound();
  }

  const currentUser = await getCurrentUser();
  const isOwnProfile = currentUser?.id === user.id;

  const currentPage = Number(query.page) || 1;
  const { requests, totalPages } = await getBloodRequestsByUser(user.id, {
    ...query,
    page: currentPage,
    itemsPerPage: 10,
  });

  return (
    <div className="min-h-screen w-full bg-app-background px-4 pt-4 pb-6 md:px-6 md:pt-5 md:pb-7">
      <div className="space-y-5 mx-auto w-full max-w-7xl">
        {/* Profile Hero */}
        <UserProfileHero user={user} isOwnProfile={isOwnProfile} />

        <section className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
          {/* Activity */}
          <UserActivityTabs
            requests={requests}
            currentPage={currentPage}
            totalPages={totalPages}
          />

          {/* Sidebar */}
          <UserSidebar user={user} />
        </section>
      </div>
    </div>
  );
}


