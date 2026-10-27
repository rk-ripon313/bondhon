import GuestCTA from "@/components/home/GuestCTA";
import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import ImpactStats from "@/components/home/ImpactStats";
import RecentBloodRequests from "@/components/home/RecentBloodRequests";
import RecentBloodRequestsSkeleton from "@/components/home/RecentBloodRequestsSkeleton";
import TrustSection from "@/components/home/TrustSection";
import WelcomeSection from "@/components/home/WelcomeSection";
import WhatYouCanDo from "@/components/home/WhatYouCanDo";
import LocationInitializer from "@/components/shared/LocationInitializer";
import { getCurrentUser } from "@/database/queries/user.query";
import { GetBloodRequestsParams } from "@/types/blood-request.type";
import { Suspense } from "react";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<GetBloodRequestsParams>;
}) {
  const params = await searchParams;
  const lat = params.lat?.toString();
  const lng = params.lng?.toString();

  const user = await getCurrentUser();

  return (
    <>
      <LocationInitializer />
      {user ? (
        <>
          <WelcomeSection
            name={user.name}
            username={user.username}
            image={user.image}
          />
          <Suspense fallback={<RecentBloodRequestsSkeleton />}>
            <RecentBloodRequests lat={lat} lng={lng} />
          </Suspense>
        </>
      ) : (
        <>
          <Hero />
          <Suspense fallback={<RecentBloodRequestsSkeleton />}>
            <RecentBloodRequests lat={lat} lng={lng} />
          </Suspense>
          <ImpactStats />
          <WhatYouCanDo />
          <HowItWorks />
          <TrustSection />
          <GuestCTA />
        </>
      )}
    </>
  );
}
