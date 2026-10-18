import { Users } from "lucide-react";

import EmptyState from "@/components/shared/EmptyState";

import Pagination from "@/components/shared/Pagination";
import { Badge } from "@/components/ui/badge";
import { getCommunityDonors } from "@/database/queries/donor.query";
import { GetDonorsParams } from "@/types/donor.type";
import AddCommunityDonorDialog from "./AddCommunityDonorDialog";
import CommunityDonorCard from "./CommunityDonorCard";
import DonorFilters from "./DonorFilters";

export default async function CommunityDonorsTab({
  filters,
}: {
  filters: GetDonorsParams;
}) {
  const currentPage = Number(filters.page) || 1;
  const itemsPerPage = 9;

  const { communityDonors, totalPages, totalCount } = await getCommunityDonors({
    ...filters,
    page: currentPage,
    itemsPerPage,
  });

  return (
    <div className="space-y-6">
      <DonorFilters />

      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-base font-semibold">
            Community Donors
            <Badge
              variant="secondary"
              className="rounded-full px-2 py-0.5 text-xs font-medium tabular-nums"
            >
              {totalCount}
            </Badge>
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Find local donors and help grow the community.
          </p>
        </div>

        <AddCommunityDonorDialog />
      </div>

      {communityDonors.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {communityDonors.map((donor) => (
              <CommunityDonorCard key={donor.id} donor={donor} />
            ))}
          </div>
          {totalPages > 1 && (
            <Pagination currentPage={currentPage} totalPages={totalPages} />
          )}
        </>
      ) : (
        <EmptyState
          icon={Users}
          title="No community donors yet"
          description="Add a donor from your community to help people find blood when they need it."
        />
      )}
    </div>
  );
}
