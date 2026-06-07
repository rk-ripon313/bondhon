import GuestCTA from "@/components/home/GuestCTA";
import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import ImpactStats from "@/components/home/ImpactStats";
import TrustSection from "@/components/home/TrustSection";
import WhatYouCanDo from "@/components/home/WhatYouCanDo";

export default function Home() {
  return (
    <>
      <Hero />
      <ImpactStats />
      <WhatYouCanDo />
      <HowItWorks />
      <TrustSection />
      <GuestCTA />
    </>
  );
}
