import { redirect } from "next/navigation";

import { getCurrentUser } from "@/database/queries/user.query";
import PersonalInformationContent from "./components/PersonalInformationContent";

export default async function PersonalInformationPage() {
  const user = await getCurrentUser();

  if (!user) redirect("/login");

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
          Personal Information
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your personal details, medical information and location.
        </p>
      </div>

      <PersonalInformationContent user={user} />
    </div>
  );
}
