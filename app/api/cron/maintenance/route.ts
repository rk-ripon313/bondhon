import { NextResponse } from "next/server";

import { expireBloodRequests } from "@/lib/jobs/blood-request/expire-blood-requests";
import { remindBloodRequests } from "@/lib/jobs/blood-request/remind-blood-requests";
import { updateEventStatuses } from "@/lib/jobs/event/update-event-statuses";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");

  if (
    !process.env.CRON_SECRET ||
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  const expired = await expireBloodRequests();
  const reminded = await remindBloodRequests();
  const events = await updateEventStatuses();

  return NextResponse.json({
    success: true,
    expired,
    reminded,
    events,
  });
}
