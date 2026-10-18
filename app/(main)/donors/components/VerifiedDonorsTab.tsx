import { User } from "lucide-react";

import EmptyState from "@/components/shared/EmptyState";
import Pagination from "@/components/shared/Pagination";
import { getDonors } from "@/database/queries/donor.query";

import { GetDonorsParams } from "@/types/donor.type";
import DonorFilters from "./DonorFilters";
import VerifiedDonorCard from "./VerifiedDonorCard";

export default async function VerifiedDonorsTab({
  filters,
}: {
  filters: GetDonorsParams;
}) {
  const currentPage = Number(filters.page) || 1;
  const itemsPerPage = 9;

  const { verifiedDonor, totalPages, totalCount } = await getDonors({
    ...filters,
    page: currentPage,
    itemsPerPage,
  });

  return (
    <div className="space-y-6">
      {/* Filters */}
      <DonorFilters showAvailableToggle />

      {/* Donor Results */}
      {verifiedDonor.length > 0 ? (
        <>
          {/* Header */}
          <div className="flex items-end justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold">Verified Donors</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Connect with eligible blood donors.
              </p>
            </div>

            <span className="shrink-0 text-sm text-muted-foreground">
              {totalCount} found
            </span>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {verifiedDonor.map((donor) => (
              <VerifiedDonorCard key={donor.id} verifiedDonor={donor} />
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination currentPage={currentPage} totalPages={totalPages} />
          )}
        </>
      ) : (
        <EmptyState
          icon={User}
          title="No donors found"
          description="No verified donors match your current filters. Try adjusting your search or location."
        />
      )}
    </div>
  );
}
