import { Droplets } from "lucide-react";

import BloodRequestCard from "@/components/blood-request/card/BloodRequestCard";
import Section from "@/components/layout/Section";
import EmptyState from "@/components/shared/EmptyState";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { getBloodRequests } from "@/database/queries/blood-request.query";
import { GetBloodRequestsParams } from "@/types/blood-request.type";

export default async function RecentBloodRequests({
  lat,
  lng,
}: Pick<GetBloodRequestsParams, "lat" | "lng">) {
  const { requests } = await getBloodRequests({
    status: "all",
    sort: "newest",
    page: 1,
    itemsPerPage: 6,
    lat,
    lng,
  });

  return (
    <Section
      title="Recent Blood Requests"
      description="People who need your help right now."
      headerClassName="text-left [&_p]:mx-0"
      link="/blood-requests"
      linkText="See all"
    >
      {requests.length > 0 ? (
        <Carousel opts={{ align: "start" }} className="w-full">
          <CarouselContent className="-ml-4">
            {requests.map((request) => (
              <CarouselItem
                key={request.id}
                className="pl-4 basis-[85%] sm:basis-1/2 lg:basis-1/3"
              >
                <BloodRequestCard request={request} />
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className="cursor-pointer -left-3 size-10 rounded-full border-border/80 bg-app-card text-app-foreground shadow-md transition-all hover:scale-105 hover:bg-app-primary hover:text-white disabled:opacity-0 lg:-left-5" />

          <CarouselNext className="cursor-pointer -right-3 size-10 rounded-full border-border/80 bg-app-card text-app-foreground shadow-md transition-all hover:scale-105 hover:bg-app-primary hover:text-white disabled:opacity-0 lg:-right-5" />
        </Carousel>
      ) : (
        <EmptyState
          icon={Droplets}
          title="No active blood requests"
          description="New requests will appear here when someone needs blood."
        />
      )}
    </Section>
  );
}
