import { getBloodRequestById } from "@/database/queries/blood-request.query";

import { notFound } from "next/navigation";
import { BloodRequestDetailHeader } from "./components/BloodRequestDetailHeader";

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
    </div>
  );
}
