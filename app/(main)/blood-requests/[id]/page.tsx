import { getBloodRequestById } from "@/database/queries/blood-request.query";

import { notFound } from "next/navigation";

import BloodRequestMoreActions from "@/components/blood-request/BloodRequestMoreActions";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
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
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      {/* Detail Navigation */}
      <div className="mb-5 flex items-center justify-between gap-3">
        <Button
          variant="ghost"
          asChild
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <Link href="/blood-requests">
            <ArrowLeft className="size-4" />
            <span>Back to Requests</span>
          </Link>
        </Button>

        <BloodRequestMoreActions request={request} />
      </div>

      {/*Request post hero   */}
      <BloodRequestHero request={request} />

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-5">
          <BloodRequestInfo request={request} />

          {/* Show requester and user actions inline on smaller screens */}
          <div className="lg:hidden">
            <BloodRequestRequester
              requester={request.requester}
              contactNumber={request.contactNumber}
              isOwner={request.isOwner}
              isFollowing={request.isFollowing}
            />

            <BloodRequestActions
              request={request}
              assignedDonors={assignedDonors}
            />
          </div>

          <AssignedDonorList
            assignedDonors={assignedDonors}
            currentUserId={request.currentUserId}
            isOwner={request.isOwner}
            requestId={request.id}
          />

          <InterestedDonorList
            interestedDonors={interestedDonors}
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
              isOwner={request.isOwner}
              isFollowing={request.isFollowing}
            />

            <BloodRequestActions
              request={request}
              assignedDonors={assignedDonors}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
