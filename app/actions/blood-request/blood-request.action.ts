"use server";

import { BLOOD_GROUPS, MAX_NOTIFICATION_RADIUS_KM } from "@/constants";
import { getCurrentUser } from "@/database/queries/user.query";
import { isBloodGroupCompatible } from "@/lib/blood/blood-group";
import { dbConnect } from "@/lib/db/db-connect";
import { localDateTimeToUTC } from "@/lib/helpers/date";
import { createNotifications } from "@/lib/notifications/notification.service";
import { isUserEligibleForAction } from "@/lib/profile/profile-utils";
import {
  BloodRequestFormInput,
  bloodRequestSchema,
} from "@/lib/validations/blood-request/blood-request.schema";
import { BloodRequest } from "@/models/blood-request.model";
import { User } from "@/models/user.model";
import { Types } from "mongoose";
import { revalidatePath } from "next/cache";

/**
 * Creates a new blood request in the database.
 * @param {BloodRequestFormInput} data - The data for the new blood request.
 * @returns {Promise<{ success: boolean; message: string }>} - An object indicating the success status and a message.
 */

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

    if (!isUserEligibleForAction(user)) {
      return {
        success: false,
        message:
          "Please complete your profile before creating a blood request.",
      };
    }

    await dbConnect();

    const neededBefore = localDateTimeToUTC(validation.data.neededBefore);

    const bloodRequest = await BloodRequest.create({
      ...validation.data,
      requester: user?.id,
      neededBefore,
    });

    const compatibleBloodGroups = BLOOD_GROUPS.filter((bloodGroup) =>
      isBloodGroupCompatible(bloodGroup, bloodRequest.bloodGroupNeeded),
    );

    const nearbyDonorIds = await User.find({
      _id: { $ne: user.id },
      bloodGroup: { $in: compatibleBloodGroups },
      isAvailableForDonate: true,
      "location.coordinates.coordinates": {
        $near: {
          $geometry: bloodRequest.location.coordinates,
          $maxDistance: MAX_NOTIFICATION_RADIUS_KM * 1000,
        },
      },
    })
      .select("_id")
      .lean();

    // Notify nearby available donors with compatible blood groups.
    await createNotifications({
      receivers: nearbyDonorIds.map((donor) => donor._id),
      actor: user.id,
      type: "blood_request_created",
      title: "New Blood Request",
      message: `A new ${bloodRequest.bloodGroupNeeded} blood request is available near you.`,
      link: `/blood-requests/${bloodRequest._id.toString()}`,
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
    })
      .select(
        "status bloodGroupNeeded neededBefore interestedDonors assignedDonors",
      )
      .lean();

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

    // Blood group cannot be changed after the request is created.
    if (validation.data.bloodGroupNeeded !== request.bloodGroupNeeded) {
      return {
        success: false,
        message: "Blood group cannot be changed after creating a request.",
      };
    }

    const confirmedDonationCount = (
      (request.assignedDonors ?? []) as { donationStatus: string }[]
    ).filter(
      (assignment) =>
        assignment.donationStatus === "confirmed_by_requester" ||
        assignment.donationStatus === "donated",
    ).length;

    if (validation.data.quantity <= confirmedDonationCount) {
      return {
        success: false,
        message: `Quantity cannot be less than the number of completed donations (${confirmedDonationCount}).`,
      };
    }

    // Notify interested donors and pending assigned donors about the update.
    const interestedDonorIds = (request.interestedDonors ??
      []) as Types.ObjectId[];

    const pendingAssignedDonorIds = (
      (request.assignedDonors ?? []) as {
        donor: Types.ObjectId;
        donationStatus: string;
      }[]
    )
      .filter((assignment) => assignment.donationStatus === "pending")
      .map((assignment) => assignment.donor);

    // Combine interested donors and pending assigned donors for notification.
    const notificationReceiverIds = [
      ...interestedDonorIds,
      ...pendingAssignedDonorIds,
    ];

    const neededBefore = localDateTimeToUTC(validation.data.neededBefore);

    const updateResult = await BloodRequest.updateOne(
      { _id: requestId },
      {
        $set: {
          ...validation.data,
          neededBefore,
        },
      },
    );

    if (updateResult.matchedCount === 0) {
      return {
        success: false,
        message: "Failed to update the blood request.",
      };
    }

    // Notify interested donors and pending assigned donors about the update.
    await createNotifications({
      receivers: notificationReceiverIds,
      actor: user.id,
      type: "blood_request_updated",
      title: "Blood Request Updated",
      message: "A blood request you are connected to has been updated.",
      link: `/blood-requests/${requestId}`,
    });

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
