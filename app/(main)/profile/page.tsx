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
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 md:px-6">
      <div className="space-y-6">
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
    </section>
  );
}
