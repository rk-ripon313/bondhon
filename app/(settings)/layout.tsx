import { auth } from "@/auth";
import Navbar from "@/components/layout/navbar/Navbar";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import SettingsMobileBack from "./components/SettingsMobileBack";
import SettingsNavigation from "./components/SettingsNavigation";

export default async function SettingsLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen flex-col bg-app-background">
      <Navbar user={session.user} />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
        <SettingsMobileBack />

        <div className="grid grid-cols-1 gap-5 md:grid-cols-[64px_minmax(0,1fr)] lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-6">
          <aside className="hidden md:block">
            <div className="sticky top-24 rounded-xl border border-border bg-app-card p-2 lg:p-3">
              <div className="mb-4 hidden px-2 lg:block">
                <h1 className="text-lg font-semibold tracking-tight">
                  Settings
                </h1>
                <p className="mt-1 text-xs text-muted-foreground">
                  Manage your preferences.
                </p>
              </div>

              <SettingsNavigation />
            </div>
          </aside>

          <div className="min-w-0">{children}</div>
        </div>
      </main>
    </div>
  );
}
