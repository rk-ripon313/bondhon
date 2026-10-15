import UserActivityTabs from "@/components/profile/UserActivityTabs";
import { getBloodRequestsByUser } from "@/database/queries/blood-request.query";
import { getCurrentUser } from "@/database/queries/user.query";
import { GetBloodRequestsParams } from "@/types/blood-request.type";
import { redirect } from "next/navigation";
import LocationCard from "./components/LocationCard";
import MedicalProfileCard from "./components/MedicalProfileCard";
import PersonalInfoCard from "./components/PersonalInfoCard";
import ProfileHero from "./components/profile-hero/ProfileHero";

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<GetBloodRequestsParams>;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/");
  }
  // console.log(user);
  const { followers, following, blockedUsers, ...editUser } = user;

  const params = await searchParams;
  const currentPage = Number(params.page) || 1;

  const { requests, totalPages } = await getBloodRequestsByUser(user.id, {
    ...params,
    page: currentPage,
    itemsPerPage: 10,
  });

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
        requests={requests}
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </div>
  );
}
