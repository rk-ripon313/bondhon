import { UserCheck } from "lucide-react";

import EmptyState from "@/components/shared/EmptyState";
import { BloodRequestDetailData } from "@/types/blood-request.type";
import AssignedDonorRow from "./AssignedDonorRow";

export default function AssignedDonorList({
  bloodRequest,
}: {
  bloodRequest: BloodRequestDetailData;
}) {
  const { assignedDonors, currentUserId, isOwner, id } = bloodRequest;

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-app-card">
      {/* Header */}
      <div className="border-b border-border px-5 py-4 sm:px-6">
        <div className="flex items-start gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-app-primary/10">
            <UserCheck className="size-4 text-app-primary" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="font-semibold">Assigned Donors</h2>

              <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                {assignedDonors.length}
              </span>
            </div>

            <p className="mt-1 text-sm text-muted-foreground">
              Donors who have been assigned to help with this request.
            </p>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {assignedDonors.length === 0 ? (
        <EmptyState
          icon={UserCheck}
          title="No donors assigned yet"
          description="Donors assigned to this request will appear here."
        />
      ) : (
        <div className="max-h-[400px] divide-y divide-border overflow-y-auto custom-scrollbar">
          {assignedDonors.map((assignment) => (
            <AssignedDonorRow
              key={assignment.donor.id}
              assignment={assignment}
              isOwner={isOwner}
              isCurrentUser={assignment.donor.id === currentUserId}
              requestId={id}
            />
          ))}
        </div>
      )}
    </section>
  );
}
