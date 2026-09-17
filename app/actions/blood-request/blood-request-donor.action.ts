"use server";

import { Types } from "mongoose";
import { revalidatePath } from "next/cache";

import { getCurrentUser } from "@/database/queries/user.query";
import { dbConnect } from "@/lib/db/db-connect";
import { BloodRequest } from "@/models/blood-request.model";

export async function toggleBloodRequestInterest(requestId: string) {
  try {
    const user = await getCurrentUser();

    if (!user?.id) {
      return {
        success: false,
        message: "You must be logged in to show interest.",
      };
    }

    await dbConnect();

    const request = await BloodRequest.findById(requestId).select(
      "requester status interestedDonors assignedDonors",
    );

    if (!request) {
      return {
        success: false,
        message: "Blood request not found.",
      };
    }

    const userId = user.id;

    // Request owner cannot show interest in their own request.
    if (request.requester.toString() === userId) {
      return {
        success: false,
        message: "You cannot show interest in your own request.",
      };
    }

    // Interest can only be changed while the request is active.
    if (request.status !== "active") {
      return {
        success: false,
        message: "This blood request is no longer accepting interest.",
      };
    }

    const interestedDonors = (request.interestedDonors ??
      []) as Types.ObjectId[];

    const assignedDonors = (request.assignedDonors ?? []) as Types.ObjectId[];

    // Assigned donors must use the assignment cancellation action.
    const isAssigned = assignedDonors.some(
      (donorId) => donorId.toString() === userId,
    );

    if (isAssigned) {
      return {
        success: false,
        message:
          "You are already assigned to this request. Please cancel your assignment first.",
      };
    }

    const isInterested = interestedDonors.some(
      (donorId) => donorId.toString() === userId,
    );

    if (isInterested) {
      await BloodRequest.updateOne(
        { _id: requestId },
        {
          $pull: {
            interestedDonors: userId,
          },
        },
      );
    } else {
      await BloodRequest.updateOne(
        { _id: requestId },
        {
          $addToSet: {
            interestedDonors: userId,
          },
        },
      );

      // TODO: Notify the requester that a donor showed interest.
    }

    revalidatePath("/");
    revalidatePath("/profile");
    revalidatePath("/blood-requests");
    revalidatePath(`/blood-requests/${requestId}`);

    return {
      success: true,
      message: isInterested
        ? "Interest removed successfully."
        : "You are now interested in this blood request.",
    };
  } catch (error) {
    console.error("Toggle Blood Request Interest Error:", error);

    return {
      success: false,
      message: "Unable to update your interest right now.",
    };
  }
}
