import LocationInitializer from "@/components/shared/LocationInitializer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { GetDonorsParams } from "@/types/donor.type";
import { HeartHandshake, ShieldCheck, Users } from "lucide-react";
import CommunityDonorsTab from "./components/CommunityDonorsTab";
import VerifiedDonorsTab from "./components/VerifiedDonorsTab";

export const metadata = {
  title: "Donors | BondhOn",
  description: "Find eligible blood donors near you",
};

export default async function DonorsPage({
  searchParams,
}: {
  searchParams: Promise<GetDonorsParams>;
}) {
  const params = await searchParams;

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <LocationInitializer />
      {/* Header */}
      <header className="flex items-start gap-3 sm:gap-4">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-app-primary/10 text-app-primary sm:size-12">
          <HeartHandshake className="size-5 sm:size-6" />
        </div>

        <div className="min-w-0 space-y-1">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Find Blood Donors
          </h1>

          <p className="max-w-2xl text-sm leading-6 text-app-muted sm:text-base">
            Find eligible donors and connect with people who can help when it
            matters most.
          </p>
        </div>
      </header>

      {/* Donor Categories */}

      <Tabs defaultValue="verified" className="w-full space-y-6">
        <TabsList className="h-auto min-w-0 flex-1 justify-start gap-1 rounded-xl border border-border/60 bg-app-background p-1 sm:flex-none">
          <TabsTrigger
            value="verified"
            className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-2 py-2.5 text-xs font-medium text-muted-foreground transition-all sm:flex-none sm:gap-2 sm:px-4 sm:py-3 sm:text-sm data-[state=active]:bg-app-card data-[state=active]:text-app-foreground data-[state=active]:shadow-sm"
          >
            <ShieldCheck className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400 sm:size-[18px]" />
            Verified Donors
          </TabsTrigger>

          <TabsTrigger
            value="community"
            className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-2 py-2.5 text-xs font-medium text-muted-foreground transition-all sm:flex-none sm:gap-2 sm:px-4 sm:py-3 sm:text-sm data-[state=active]:bg-app-card data-[state=active]:text-app-foreground data-[state=active]:shadow-sm"
          >
            <Users className="size-4 shrink-0 text-app-secondary sm:size-[18px]" />
            Community
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="verified"
          className="mt-0 space-y-6 focus-visible:outline-none"
        >
          <VerifiedDonorsTab filters={params} />
        </TabsContent>

        <TabsContent
          value="community"
          className="mt-0 space-y-6 focus-visible:outline-none"
        >
          <CommunityDonorsTab filters={params} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
