import { Activity } from "lucide-react";
import Link from "next/link";

import { getBloodRequests } from "@/database/queries/blood-request.query";

import BloodRequestFilters from "@/components/blood-request/BloodRequestFilters";
import BloodRequestPagination from "@/components/blood-request/BloodRequestPagination";
import BloodRequestCard from "@/components/blood-request/card/BloodRequestCard";
import EmptyState from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";

export default async function BloodRequestsPage() {
  const requests = await getBloodRequests();

  return (
    <div className="min-h-screen w-full bg-app-background px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        {/* Header */}
        <section className="mb-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 font-heading text-sm font-medium text-primary">
                Blood Requests
              </p>

              <h1 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
                Find someone who needs blood
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                Browse blood requests and help someone in need.
              </p>
            </div>

            <Link href="/donors">
              <Button className="cursor-pointer text-white bg-app-primary hover:bg-app-primary/90">
                Find Donors
              </Button>
            </Link>
          </div>
        </section>

        {/* Filters */}
        <BloodRequestFilters />

        {/* Requests */}
        <section>
          {requests.length > 0 ? (
            <>
              <div className="mb-5 flex items-end justify-between gap-4">
                <div>
                  <h2 className="text-base font-semibold">
                    Available blood requests
                  </h2>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {requests.length} requests found
                  </p>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {requests.map((request) => (
                  <BloodRequestCard key={request.id} request={request} />
                ))}
              </div>

              {/*  pagination UI */}
              <BloodRequestPagination />
            </>
          ) : (
            <EmptyState
              icon={Activity}
              title="No blood requests found"
              description="There are no blood requests available right now. New requests will appear here when someone needs help."
            />
          )}
        </section>
      </div>
    </div>
  );
}
