import { getBloodRequests } from "@/database/queries/blood-request.query";
import { getCurrentUser } from "@/database/queries/user.query";
import { redirect } from "next/navigation";
import LocationCard from "./components/LocationCard";
import MedicalProfileCard from "./components/MedicalProfileCard";
import PersonalInfoCard from "./components/PersonalInfoCard";
import ProfileHero from "./components/profile-hero/ProfileHero";
import UserActivityTabs from "./components/UserActivityTabs";

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/");
  }
  // console.log(user);
  const { followers, following, blockedUsers, ...editUser } = user;

  const userBloodRequests = await getBloodRequests(user.id);

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
        <UserActivityTabs requests={userBloodRequests} />
      </div>
    </section>
  );
}
