import { dbConnect } from "@/lib/db/db-connect";
import { Location } from "@/models/location.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json([], { status: 200 });
    }

    const searchRegex = new RegExp(query, "i");

    const matchResults = await Location.find({
      $or: [{ area: searchRegex }, { district: searchRegex }],
    })
      .limit(6)
      .lean();

    return NextResponse.json(matchResults, { status: 200 });
  } catch (error) {
    console.error("Location lookup error stack:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
