import UserActivityTabs from "@/components/profile/UserActivityTabs";
import { getBloodRequestsByUser } from "@/database/queries/blood-request.query";
import { getEventsByUser } from "@/database/queries/event.query";
import { getCurrentUser } from "@/database/queries/user.query";
import { redirect } from "next/navigation";
import LocationCard from "./components/LocationCard";
import MedicalProfileCard from "./components/MedicalProfileCard";
import PersonalInfoCard from "./components/PersonalInfoCard";
import ProfileHero from "./components/profile-hero/ProfileHero";

interface ProfileSearchParams {
  page?: string;
  requestStatus?: string;
  requestSort?: string;
  eventStatus?: string;
  eventSort?: string;
}
export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<ProfileSearchParams>;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/");
  }
  // console.log(user);
  const { followers, following, blockedUsers, ...editUser } = user;

  const params = await searchParams;
  const currentPage = Number(params.page) || 1;

  const requestParams = {
    status: params.requestStatus || "all",
    sort: params.requestSort || "newest",
    page: currentPage,
    itemsPerPage: 10,
  };

  const eventParams = {
    status: params.eventStatus || "all",
    sort: params.eventSort || "newest",
    page: currentPage,
    itemsPerPage: 10,
  };

  const [requestData, eventData] = await Promise.all([
    getBloodRequestsByUser(user.id, requestParams),
    getEventsByUser(user.id, eventParams),
  ]);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-5 px-4 pt-4 pb-6 md:px-6 md:pt-5 md:pb-7">
      {/* Profile Header */}
      <ProfileHero user={user} />

      {/* Profile Information */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <PersonalInfoCard user={editUser} />
        <MedicalProfileCard user={editUser} />
      </div>

      {/* Location */}
      <LocationCard user={editUser} />

      {/* User Activity */}
      <UserActivityTabs
        requests={requestData.requests}
        events={eventData.events}
        currentPage={currentPage}
        requestTotalPages={requestData.totalPages}
        eventTotalPages={eventData.totalPages}
      />
    </div>
  );
}
