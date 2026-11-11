import { Activity } from "lucide-react";

import ActivityFilters from "./ActivityFilters";

import BloodRequestCard from "@/components/blood-request/card/BloodRequestCard";
import EmptyState from "@/components/shared/EmptyState";

import Pagination from "@/components/shared/Pagination";
import { getMyBloodRequestActivity } from "@/database/queries/blood-request.query";
import { GetMyBloodRequestActivityParams } from "@/types/blood-request.type";

export default async function MyBloodActivity({
  requestParams,
}: {
  requestParams: GetMyBloodRequestActivityParams;
}) {
  const { requests, counts, totalPages } =
    await getMyBloodRequestActivity(requestParams);
  return (
    <div className="space-y-5 sm:space-y-6">
      <ActivityFilters type="requests" counts={counts} />

      {requests.length > 0 ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {requests.map((request) => (
              <BloodRequestCard key={request.id} request={request} />
            ))}
          </div>

          <Pagination
            currentPage={requestParams.page}
            totalPages={totalPages}
            pageKey="requestPage"
          />
        </>
      ) : (
        <EmptyState
          icon={Activity}
          title="No matching activity found"
          description="No blood requests match your current filters. Try adjusting your filters to see more results."
        />
      )}
    </div>
  );
}
