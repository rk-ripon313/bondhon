import { getBloodRequestById } from "@/database/queries/blood-request.query";

import { notFound } from "next/navigation";
import { BloodRequestDetailHeader } from "./components/BloodRequestDetailHeader";

import AssignedDonorList from "./components/AssignedDonorList";
import { BloodRequestHero } from "./components/BloodRequestHero";
import { BloodRequestInfo } from "./components/BloodRequestInfo";
import { BloodRequestRequester } from "./components/BloodRequestRequester";
import { BloodRequestActions } from "./components/BloodRequestUserActions";
import { InterestedDonorList } from "./components/InterestedDonorList";

export default async function BloodRequestDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const bloodRequest = await getBloodRequestById(id);

  if (!bloodRequest) {
    return notFound();
  }

  const { interestedDonors, assignedDonors, ...request } = bloodRequest;

  return (
    <div className="min-h-screen w-full bg-app-background px-4 py-8 sm:px-6 lg:px-8">
      <BloodRequestDetailHeader request={request} />

      <BloodRequestHero request={request} />

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-5">
          <BloodRequestInfo request={request} />

          {/* Show requester and user actions inline on smaller screens */}
          <div className="lg:hidden">
            <BloodRequestRequester
              requester={request.requester}
              contactNumber={request.contactNumber}
            />

            <BloodRequestActions request={request} />
          </div>

          <InterestedDonorList
            interestedDonors={interestedDonors}
            currentUserId={request.currentUserId}
            isOwner={request.isOwner}
            requestId={request.id}
          />

          <AssignedDonorList
            assignedDonors={assignedDonors}
            currentUserId={request.currentUserId}
            isOwner={request.isOwner}
            requestId={request.id}
          />
        </div>

        {/* Keep requester and user actions sticky in the desktop sidebar */}
        <aside className="hidden lg:block lg:sticky lg:top-24 lg:self-start">
          <div className="space-y-4">
            <BloodRequestRequester
              requester={request.requester}
              contactNumber={request.contactNumber}
            />

            <BloodRequestActions request={request} />
          </div>
        </aside>
      </div>
    </div>
  );
}
