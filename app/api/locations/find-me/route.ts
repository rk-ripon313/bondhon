import { dbConnect } from "@/lib/db/db-connect";
import { Location } from "@/models/location.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const { lat, lng } = await req.json();

    if (lat == null || lng == null) {
      return NextResponse.json(
        { error: "Missing Latitude or Longitude query fields" },
        { status: 400 },
      );
    }

    const closestArea = await Location.findOne({
      coordinates: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },

          $maxDistance: 15000,
        },
      },
    }).lean();
    return NextResponse.json(closestArea, { status: 200 });
  } catch (error) {
    console.error("Geo lookup closest location fetching trace crashed:", error);
    return NextResponse.json(
      { error: "Internal Geo Engine Error" },
      { status: 500 },
    );
  }
}
