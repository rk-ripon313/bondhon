import { NextResponse } from "next/server";

import { expireBloodRequests } from "@/lib/jobs/blood-request/expire-blood-requests";
import { remindBloodRequests } from "@/lib/jobs/blood-request/remind-blood-requests";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  const expired = await expireBloodRequests();
  const reminded = await remindBloodRequests();

  return NextResponse.json({
    success: true,
    expired,
    reminded,
  });
}
