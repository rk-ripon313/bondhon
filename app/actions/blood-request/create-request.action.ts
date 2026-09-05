"use server";

import { getCurrentUser } from "@/database/queries/user.query";
import { dbConnect } from "@/lib/db/db-connect";
import {
  BloodRequestFormInput,
  bloodRequestSchema,
} from "@/lib/validations/blood-request/blood-request.schema";
import { BloodRequest } from "@/models/blood-request.model";
import { revalidatePath } from "next/cache";

export async function createBloodRequest(data: BloodRequestFormInput) {
  try {
    const validation = bloodRequestSchema.safeParse(data);

    if (!validation.success) {
      return { success: false, message: "Invalid form data." };
    }
    const user = await getCurrentUser();

    if (!user?.id) {
      return { success: false, message: "User not authenticated." };
    }

    await dbConnect();

    await BloodRequest.create({
      ...validation.data,
      requester: user?.id,
      neededBefore: new Date(validation.data.neededBefore),
    });

    revalidatePath("/");
    revalidatePath("/profile");
    revalidatePath("/blood-requests");

    return {
      success: true,
      message: "Blood request created successfully.",
    };
  } catch (error) {
    console.error("Create Blood Request Error:", error);
    return {
      success: false,
      message: "An error occurred while creating the blood request.",
    };
  }
}
