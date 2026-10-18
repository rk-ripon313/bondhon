"use server";

import { revalidatePath } from "next/cache";

import { getCurrentUser } from "@/database/queries/user.query";
import { dbConnect } from "@/lib/db/db-connect";
import { communityDonorSchema } from "@/lib/validations/donors/community-donor.schema";
import { CommunityDonor } from "@/models/community-donor.model";

export async function createCommunityDonor(input: unknown) {
  try {
    const user = await getCurrentUser();

    if (!user?.id) {
      return {
        success: false,
        message: "Please log in to add a community donor.",
      };
    }

    const result = communityDonorSchema.safeParse(input);

    if (!result.success) {
      return {
        success: false,
        message:
          result.error.issues[0]?.message ?? "Invalid donor information.",
      };
    }

    await dbConnect();

    await CommunityDonor.create({
      ...result.data,
      addedBy: user.id,
    });

    revalidatePath("/donors");

    return {
      success: true,
      message: "Community donor added successfully.",
    };
  } catch (error) {
    console.error("createCommunityDonor error:", error);

    return {
      success: false,
      message: "Could not add community donor. Please try again.",
    };
  }
}
