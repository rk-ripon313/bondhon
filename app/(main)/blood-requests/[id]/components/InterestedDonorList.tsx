import { Users } from "lucide-react";

import EmptyState from "@/components/shared/EmptyState";
import { BloodRequestDetailData } from "@/types/blood-request.type";
import InterestedDonorRow from "./InterestedDonorRow";

export function InterestedDonorList({
  bloodRequest,
}: {
  bloodRequest: BloodRequestDetailData;
}) {
  const { interestedDonors, assignedDonors, currentUserId, isOwner, id } =
    bloodRequest;

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-app-card">
      {/* Header */}
      <div className="border-b border-border px-5 py-4 sm:px-6">
        <div className="flex items-start gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-app-primary/10">
            <Users className="size-4 text-app-primary" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="font-semibold">Interested Donors</h2>

              <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                {interestedDonors.length}
              </span>
            </div>

            <p className="mt-1 text-sm text-muted-foreground">
              People who are willing to help with this request.
            </p>
          </div>
        </div>
      </div>

      {/* Empty state */}
      {interestedDonors.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No interested donors yet"
          description=" Donors who want to help with this request will appear here."
        />
      ) : (
        <div className="max-h-[400px] divide-y divide-border overflow-y-auto custom-scrollbar">
          {interestedDonors.map((donor) => {
            const isCurrentUser = donor.id === currentUserId;

            const isAssigned = assignedDonors.some(
              (assignment) => assignment.donor.id === donor.id,
            );

            return (
              <InterestedDonorRow
                key={donor.id}
                donor={donor}
                isOwner={isOwner}
                isCurrentUser={isCurrentUser}
                isAssigned={isAssigned}
                requestId={id}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}
