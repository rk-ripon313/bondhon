import { notFound } from "next/navigation";

import { getBloodRequestsByUser } from "@/database/queries/blood-request.query";
import { getUserByUsername } from "@/database/queries/user.query";

import UserActivityTabs from "@/components/profile/UserActivityTabs";
import { getEventsByUser } from "@/database/queries/event.query";
import UserProfileHero from "./components/UserProfileHero";
import UserSidebar from "./components/UserSidebar";

interface UserPageProps {
  params: Promise<{
    username: string;
  }>;
  searchParams: Promise<{
    page?: string;
    requestStatus?: string;
    requestSort?: string;
    eventStatus?: string;
    eventSort?: string;
  }>;
}

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

  const currentPage = Number(query.page) || 1;

  const [requestData, eventData] = await Promise.all([
    getBloodRequestsByUser(user.id, {
      status: query.requestStatus || "all",
      sort: query.requestSort || "newest",
      page: currentPage,
      itemsPerPage: 10,
    }),
    getEventsByUser(user.id, {
      status: query.eventStatus || "all",
      sort: query.eventSort || "newest",
      page: currentPage,
      itemsPerPage: 10,
    }),
  ]);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-5 px-4 pt-4 pb-6 md:px-6 md:pt-5 md:pb-7">
      {/* Profile Hero */}
      <UserProfileHero user={user} />

      <section className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        {/* Sidebar */}
        <div className="order-1 lg:order-2">
          <UserSidebar user={user} />
        </div>

        {/* Activity */}
        <div className="order-2 lg:order-1">
          <UserActivityTabs
            requests={requestData.requests}
            events={eventData.events}
            currentPage={currentPage}
            requestTotalPages={requestData.totalPages}
            eventTotalPages={eventData.totalPages}
          />
        </div>
      </section>
    </div>
  );
}
