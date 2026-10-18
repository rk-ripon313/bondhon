import { Users } from "lucide-react";

import EmptyState from "@/components/shared/EmptyState";
import { GetDonorsParams } from "@/types/user.type";

import { Badge } from "@/components/ui/badge";
import AddCommunityDonorDialog from "./AddCommunityDonorDialog";
import CommunityDonorCard from "./CommunityDonorCard";
import DonorFilters from "./DonorFilters";

const communityDonorsMock = [
  {
    id: "community-1",
    name: "Tanvir Ahmed",
    phone: "01700000001",
    bloodGroup: "A+",
    location: {
      district: "Sylhet",
      area: "Zindabazar",
      address: "Near Zindabazar Point",
    },
    addedBy: {
      name: "rion",
      username: "ripon123",
    },
  },
  {
    id: "community-2",
    name: "Sabbir Hossain",
    phone: "01700000002",
    bloodGroup: "O+",
    location: {
      district: "Sylhet",
      area: "Beanibazar",
    },
    addedBy: {
      name: "rion",
      username: "ripon123",
    },
  },
  {
    id: "community-3",
    name: "Nusrat Jahan",
    phone: "01700000003",
    bloodGroup: "B+",
    location: {
      district: "Sylhet",
      area: "South Surma",
      address: "Near South Surma Bus Stand",
    },
    addedBy: {
      name: "rion",
      username: "ripon123",
    },
  },
  {
    id: "community-4",
    name: "Mahmudul Hasan",
    phone: "01700000004",
    bloodGroup: "AB+",
    location: {
      district: "Moulvibazar",
      area: "Sreemangal",
    },
    addedBy: {
      name: "rion",
      username: "ripon123",
    },
  },
  {
    id: "community-5",
    name: "Arif Rahman",
    phone: "01700000005",
    bloodGroup: "O-",
    location: {
      district: "Habiganj",
      area: "Habiganj Sadar",
    },
    addedBy: {
      name: "rion",
      username: "ripon123",
    },
  },
  {
    id: "community-6",
    name: "Farhana Akter",
    phone: "01700000006",
    bloodGroup: "A-",
    location: {
      district: "Sylhet",
      area: "Golapganj",
    },
    addedBy: {
      name: "rion",
      username: "ripon123",
    },
  },
];

export default function CommunityDonorsTab({
  filters,
}: {
  filters: GetDonorsParams;
}) {
  const totalCount = 6;
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

      {communityDonorsMock.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {communityDonorsMock.map((donor) => (
              <CommunityDonorCard key={donor.id} donor={donor} />
            ))}
          </div>
          {/* {totalPages > 1 && (
                    <Pagination currentPage={currentPage} totalPages={totalPages} />
                  )} */}
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
