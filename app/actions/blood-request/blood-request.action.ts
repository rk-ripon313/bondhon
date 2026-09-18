"use server";

import { getCurrentUser } from "@/database/queries/user.query";
import { dbConnect } from "@/lib/db/db-connect";
import { localDateTimeToUTC } from "@/lib/helpers/date";
import { isUserEligibleForAction } from "@/lib/profile/profile-utils";
import {
  BloodRequestFormInput,
  bloodRequestSchema,
} from "@/lib/validations/blood-request/blood-request.schema";
import { BloodRequest } from "@/models/blood-request.model";
import { revalidatePath } from "next/cache";

/**
 * Creates a new blood request in the database.
 * @param {BloodRequestFormInput} data - The data for the new blood request.
 * @returns {Promise<{ success: boolean; message: string }>} - An object indicating the success status and a message.
 */

export async function createBloodRequest(
  data: BloodRequestFormInput,
  timeZone: string,
) {
  try {
    const validation = bloodRequestSchema.safeParse(data);

    if (!validation.success) {
      return { success: false, message: "Invalid form data." };
    }
    const user = await getCurrentUser();

    if (!user?.id) {
      return { success: false, message: "User not authenticated." };
    }

    if (!isUserEligibleForAction(user)) {
      return {
        success: false,
        message:
          "Please complete your profile before creating a blood request.",
      };
    }

    await dbConnect();

    const neededBefore = localDateTimeToUTC(
      validation.data.neededBefore,
      timeZone,
    );

    await BloodRequest.create({
      ...validation.data,
      requester: user?.id,
      neededBefore,
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

/** * Updates an existing blood request in the database.
 * @param {string} requestId - The ID of the blood request to update.
 * @param {BloodRequestFormInput} data - The updated data for the blood request.
 * @returns {Promise<{ success: boolean; message: string }>} - An object indicating the success status and a message.
 */

export async function updateBloodRequest(
  requestId: string,
  data: BloodRequestFormInput,
  timeZone: string,
) {
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

    const request = await BloodRequest.findOne({
      _id: requestId,
      requester: user.id,
    });

    if (!request) {
      return {
        success: false,
        message: "Blood request not found or you are not allowed to edit it.",
      };
    }

    if (request.status !== "active") {
      return {
        success: false,
        message: "Only active blood requests can be edited.",
      };
    }
    if (request.neededBefore <= new Date()) {
      return {
        success: false,
        message: "This blood request has already expired.",
      };
    }

    if (request.assignedDonors.length > 0) {
      return {
        success: false,
        message: "A donor has already been assigned to this request.",
      };
    }

    const neededBefore = localDateTimeToUTC(
      validation.data.neededBefore,
      timeZone,
    );

    await BloodRequest.updateOne(
      { _id: requestId },
      {
        $set: {
          ...validation.data,
          neededBefore,
        },
      },
    );

    revalidatePath("/");
    revalidatePath("/profile");
    revalidatePath("/blood-requests");
    revalidatePath(`/blood-requests/${requestId}`);

    return {
      success: true,
      message: "Blood request updated successfully.",
    };
  } catch (error) {
    console.error("Update Blood Request Error:", error);

    return {
      success: false,
      message: "An error occurred while updating the blood request.",
    };
  }
}

/** * Deletes a blood request from the database.
 * @param {string} requestId - The ID of the blood request to delete.
 * @returns {Promise<{ success: boolean; message: string }>} - An object indicating the success status and a message.
 */

export async function deleteBloodRequest(requestId: string) {
  try {
    const user = await getCurrentUser();

    if (!user?.id) {
      return { success: false, message: "User not authenticated." };
    }

    await dbConnect();

    const request = await BloodRequest.findOne({
      _id: requestId,
      requester: user.id,
    });

    if (!request) {
      return {
        success: false,
        message: "Blood request not found or you are not allowed to delete it.",
      };
    }

    if (request.status !== "active") {
      return {
        success: false,
        message: "Only active blood requests can be deleted.",
      };
    }

    if (request.neededBefore <= new Date()) {
      return {
        success: false,
        message: "This blood request has already expired.",
      };
    }

    if (request.assignedDonors.length > 0) {
      return {
        success: false,
        message: "A donor has already been assigned to this request.",
      };
    }

    await BloodRequest.deleteOne({
      _id: requestId,
    });

    revalidatePath("/");
    revalidatePath("/profile");
    revalidatePath("/blood-requests");

    return {
      success: true,
      message: "Blood request deleted successfully.",
    };
  } catch (error) {
    console.error("Delete Blood Request Error:", error);

    return {
      success: false,
      message: "An error occurred while deleting the blood request.",
    };
  }
}
