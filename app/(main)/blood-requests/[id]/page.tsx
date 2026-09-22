import { getBloodRequestById } from "@/database/queries/blood-request.query";

import { notFound } from "next/navigation";
import { BloodRequestDetailHeader } from "./components/BloodRequestDetailHeader";
import { BloodRequestHero } from "./components/BloodRequestHero";
import { BloodRequestInfo } from "./components/BloodRequestInfo";
import { BloodRequestRequester } from "./components/BloodRequestRequester";

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

          <div className="lg:hidden space-y-4">
            <BloodRequestRequester
              requester={request.requester}
              contactNumber={request.contactNumber}
            />
          </div>
        </div>

        <aside className="hidden lg:block lg:sticky lg:top-24 lg:self-start">
          <div className="space-y-4">
            <BloodRequestRequester
              requester={request.requester}
              contactNumber={request.contactNumber}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
