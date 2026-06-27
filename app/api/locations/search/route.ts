import { dbConnect } from "@/lib/db/db-connect";
import { Location } from "@/models/location.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    if (!query || !query.trim()) {
      return NextResponse.json([], { status: 200 });
    }

    const searchStr = query.trim();
    let mongoQuery = {};

    if (searchStr.includes(",")) {
      const parts = searchStr
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean);

      const areaPattern = parts[0].split("").join("\\s*");
      const areaRegex = new RegExp(areaPattern, "i");

      const districtRegex = parts[1]
        ? new RegExp(parts[1].split("").join("\\s*"), "i")
        : null;

      mongoQuery = {
        $and: [
          { area: areaRegex },
          ...(districtRegex ? [{ district: districtRegex }] : []),
        ],
      };
    } else {
      const cleanPattern = searchStr
        .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
        .split(/\s*/)
        .join("\\s*");

      const searchRegex = new RegExp(cleanPattern, "i");

      mongoQuery = {
        $or: [{ area: searchRegex }, { district: searchRegex }],
      };
    }

    const matchResults = await Location.find(mongoQuery).limit(6).lean();

    return NextResponse.json(matchResults, { status: 200 });
  } catch (error) {
    console.error("Location lookup error stack:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
