import { redirect } from "next/navigation";

import { getCurrentUser, hasUserPassword } from "@/database/queries/user.query";
import AccountInformation from "./components/AccountInformation";
import DeactivateAccount from "./components/DeactivateAccount";
import DeleteAccount from "./components/DeleteAccount";
import PasswordSettings from "./components/PasswordSettings";

export default async function AccountSettingsPage() {
  const user = await getCurrentUser();

  if (!user) redirect("/login");

  const hasPassword = await hasUserPassword();

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="space-y-1">
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
          Account & Security
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your account information and security settings.
        </p>
      </div>

      {/* Account Information */}
      <AccountInformation user={user} />

      {/* Password & Authentication */}
      <PasswordSettings hasPassword={hasPassword} />

      {/* Deactivate Account */}

      {/* Delete Account */}
      <DeactivateAccount />
      <DeleteAccount />
    </div>
  );
}
