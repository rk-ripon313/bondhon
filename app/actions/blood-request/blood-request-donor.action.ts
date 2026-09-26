"use server";

import { Types } from "mongoose";
import { revalidatePath } from "next/cache";

import {
  getCurrentUser,
  updateUserDonationHistory,
} from "@/database/queries/user.query";
import { isBloodGroupCompatible } from "@/lib/blood/blood-group";
import { dbConnect } from "@/lib/db/db-connect";
import { getDistanceInKm } from "@/lib/location/distance";
import { isUserEligibleForAction } from "@/lib/profile/profile-utils";
import { BloodRequest } from "@/models/blood-request.model";

const MAX_INTEREST_DISTANCE_KM = 50;

/**
 * Toggle the current user's interest in a blood request.
 *
 * Removing interest only checks whether the user is already interested.
 * Adding interest validates donor eligibility, availability,
 * blood group compatibility, and service distance.
 */
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
      "requester bloodGroupNeeded status location interestedDonors assignedDonors",
    );

    if (!request) {
      return {
        success: false,
        message: "Blood request not found.",
      };
    }

    const userId = user.id;

    // Cannot interact with your own request.
    if (request.requester.toString() === userId) {
      return {
        success: false,
        message: "You cannot show interest in your own request.",
      };
    }

    // Only active requests can be modified.
    if (request.status !== "active") {
      return {
        success: false,
        message: "This blood request is no longer accepting interest.",
      };
    }

    const interestedDonors = (request.interestedDonors ??
      []) as Types.ObjectId[];

    const assignedDonors = (request.assignedDonors ?? []) as {
      donor: Types.ObjectId;
    }[];

    const isInterested = interestedDonors.some(
      (donorId) => donorId.toString() === userId,
    );

    // Remove interest.
    if (isInterested) {
      await BloodRequest.updateOne(
        { _id: requestId },
        {
          $pull: {
            interestedDonors: userId,
          },
        },
      );

      revalidatePath("/");
      revalidatePath("/profile");
      revalidatePath("/blood-requests");
      revalidatePath(`/blood-requests/${requestId}`);

      return {
        success: true,
        message: "Interest removed successfully.",
      };
    }

    // A donor who is already assigned cannot show interest again.
    const isAssigned = assignedDonors.some(
      (assignment) => assignment.donor.toString() === userId,
    );

    if (isAssigned) {
      return {
        success: false,
        message:
          "You are already assigned to this request. Please cancel your assignment first.",
      };
    }

    // -------------------------
    // Add interest validations
    // -------------------------

    if (!isUserEligibleForAction(user)) {
      return {
        success: false,
        message: "Please complete your profile before showing interest.",
      };
    }

    if (!user.isAvailableForDonate) {
      return {
        success: false,
        message: "You are currently unavailable for blood donation.",
      };
    }

    // Blood group compatibility.
    if (!isBloodGroupCompatible(user.bloodGroup, request.bloodGroupNeeded)) {
      return {
        success: false,
        message: "Your blood group is not compatible with this blood request.",
      };
    }

    // Location is required for distance validation.
    if (!user.location?.coordinates || !request.location?.coordinates) {
      return {
        success: false,
        message: "Please update your location before showing interest.",
      };
    }

    // Donor must be within the service area.
    const distanceKm = getDistanceInKm(user.location, request.location);

    if (distanceKm === null || distanceKm > MAX_INTEREST_DISTANCE_KM) {
      return {
        success: false,
        message: `This blood request is outside the ${MAX_INTEREST_DISTANCE_KM} km service area.`,
      };
    }

    // Add interest.
    await BloodRequest.updateOne(
      { _id: requestId },
      {
        $addToSet: {
          interestedDonors: userId,
        },
      },
    );

    // TODO: Notify requester that a donor showed interest.

    revalidatePath("/");
    revalidatePath("/profile");
    revalidatePath("/blood-requests");
    revalidatePath(`/blood-requests/${requestId}`);

    return {
      success: true,
      message: "You are now interested in this blood request.",
    };
  } catch (error) {
    console.error("Toggle Blood Request Interest Error:", error);

    return {
      success: false,
      message: "Unable to update your interest right now.",
    };
  }
}

/**
 * Assign an interested donor to a blood request.
 *
 * Validates requester ownership, donor interest, duplicate assignment,
 * and blood group compatibility before creating the assignment.
 */

export async function assignBloodRequestDonor(
  requestId: string,
  donorId: string,
) {
  try {
    const user = await getCurrentUser();

    if (!user?.id) {
      return {
        success: false,
        message: "You must be logged in to assign a donor.",
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

    // Only the requester can assign a donor.
    if (request.requester.toString() !== userId) {
      return {
        success: false,
        message: "Only the requester can assign a donor.",
      };
    }

    // Donor cannot be the requester.
    if (donorId === userId) {
      return {
        success: false,
        message: "You cannot assign yourself as a donor.",
      };
    }

    // Only active requests can accept donor assignments.
    if (request.status !== "active") {
      return {
        success: false,
        message: "This blood request is no longer active.",
      };
    }

    const interestedDonors = (request.interestedDonors ??
      []) as Types.ObjectId[];

    const assignedDonors = (request.assignedDonors ?? []) as {
      donor: Types.ObjectId;
    }[];

    // Donor must currently be interested.
    const isInterested = interestedDonors.some(
      (donor) => donor.toString() === donorId,
    );

    if (!isInterested) {
      return {
        success: false,
        message: "This donor is no longer interested in this request.",
      };
    }

    // Prevent duplicate assignment.
    const isAlreadyAssigned = assignedDonors.some(
      (assignment) => assignment.donor.toString() === donorId,
    );

    if (isAlreadyAssigned) {
      return {
        success: false,
        message: "This donor is already assigned to the request.",
      };
    }

    await BloodRequest.updateOne(
      { _id: requestId },
      {
        $pull: {
          interestedDonors: donorId,
        },

        $push: {
          assignedDonors: {
            donor: donorId,
            assignedAt: new Date(),
            donationStatus: "pending",
          },
        },
      },
    );

    // TODO: Notify the donor that they have been assigned.

    revalidatePath("/");
    revalidatePath("/profile");
    revalidatePath("/blood-requests");
    revalidatePath(`/blood-requests/${requestId}`);

    return {
      success: true,
      message: "Donor assigned successfully.",
    };
  } catch (error) {
    console.error("Assign Blood Request Donor Error:", error);

    return {
      success: false,
      message: "Unable to assign this donor right now.",
    };
  }
}

/**
 * Cancels an assigned donor from a blood request.
 * Requesters can remove donors, while donors can cancel their own assignment.
 */

export async function cancelBloodRequestAssignment(
  requestId: string,
  donorId: string,
) {
  try {
    const user = await getCurrentUser();

    if (!user?.id) {
      return {
        success: false,
        message: "You must be logged in to cancel this assignment.",
      };
    }

    await dbConnect();

    const request = await BloodRequest.findById(requestId)
      .select("requester status interestedDonors assignedDonors")
      .lean();

    if (!request) {
      return {
        success: false,
        message: "Blood request not found.",
      };
    }

    if (request.status !== "active") {
      return {
        success: false,
        message: "This blood request is no longer active.",
      };
    }

    const userId = user.id;

    const isOwner = request.requester.toString() === userId;
    const isDonor = donorId === userId;

    if (!isOwner && !isDonor) {
      return {
        success: false,
        message: "You are not allowed to cancel this assignment.",
      };
    }

    const assignedDonors = (request.assignedDonors ?? []) as {
      donor: Types.ObjectId;
      requesterConfirmedAt?: Date;
      donorConfirmedAt?: Date;
    }[];

    const assignment = assignedDonors.find(
      (assignment) => assignment.donor.toString() === donorId,
    );

    if (!assignment) {
      return {
        success: false,
        message: "This donor is not assigned to this request.",
      };
    }

    // A confirmed assignment cannot be cancelled by either side.
    if (assignment.requesterConfirmedAt || assignment.donorConfirmedAt) {
      return {
        success: false,
        message: "You cannot cancel the assignment after confirmation.",
      };
    }

    if (isOwner) {
      // Requester removes the donor.
      // The donor goes back to the interested list.
      await BloodRequest.updateOne(
        { _id: requestId },
        {
          $pull: {
            assignedDonors: {
              donor: donorId,
            },
          },
          $addToSet: {
            interestedDonors: donorId,
          },
        },
      );

      // TODO: Notify donor that the assignment was removed.
    } else {
      // Donor cancels their own assignment.
      // The donor is also removed from the interested list.
      await BloodRequest.updateOne(
        { _id: requestId },
        {
          $pull: {
            assignedDonors: {
              donor: donorId,
            },
            interestedDonors: donorId,
          },
        },
      );

      // TODO: Notify requester that the donor cancelled the assignment.
    }

    revalidatePath("/");
    revalidatePath("/profile");
    revalidatePath("/blood-requests");
    revalidatePath(`/blood-requests/${requestId}`);

    return {
      success: true,
      message: isOwner
        ? "Donor removed from the assignment."
        : "Assignment cancelled successfully.",
    };
  } catch (error) {
    console.error("Cancel Blood Request Assignment Error:", error);

    return {
      success: false,
      message: "Unable to cancel the assignment right now.",
    };
  }
}

/**
 * Confirms that an assigned donor has donated blood.
 * The donor confirms their donation, allowing the requester
 * to verify that the blood was received.
 */

export async function confirmBloodDonationByDonor(requestId: string) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    await dbConnect();

    const bloodRequest = await BloodRequest.findById(requestId);

    if (!bloodRequest) {
      return {
        success: false,
        error: "Blood request not found",
      };
    }

    const assignedDonors = (bloodRequest.assignedDonors ?? []) as {
      donor: Types.ObjectId;
      donorConfirmedAt?: Date;
      requesterConfirmedAt?: Date;
    }[];

    const assignment = assignedDonors.find(
      (assignment) => assignment.donor.toString() === currentUser.id,
    );

    if (!assignment) {
      return {
        success: false,
        error: "You are not an assigned donor for this request",
      };
    }

    if (assignment.donorConfirmedAt) {
      return {
        success: false,
        error: "You have already confirmed this donation",
      };
    }

    assignment.donorConfirmedAt = new Date();

    await bloodRequest.save();

    // Notify requester to confirm the donation receipt.
    if (!assignment.requesterConfirmedAt) {
      // TODO: Create notification for requester
    }

    revalidatePath(`/blood-requests/${requestId}`);

    return {
      success: true,
      message: "Donation confirmed successfully",
    };
  } catch (error) {
    console.error("Error confirming donation by donor:", error);

    return {
      success: false,
      error: "Failed to confirm donation",
    };
  }
}

/**
 * Confirms that an assigned donor has donated blood.
 * The requester can then verify that the blood was received.
 */

export async function confirmBloodDonationByRequester(
  requestId: string,
  donorId: string,
) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    await dbConnect();

    const bloodRequest = await BloodRequest.findById(requestId);

    if (!bloodRequest) {
      return {
        success: false,
        error: "Blood request not found",
      };
    }

    if (bloodRequest.status === "completed") {
      return {
        success: false,
        error: "This blood request has already been completed",
      };
    }

    const requesterId = bloodRequest.requester.toString();

    if (requesterId !== currentUser.id) {
      return {
        success: false,
        error: "You are not allowed to confirm this donation",
      };
    }

    const assignedDonors = (bloodRequest.assignedDonors ?? []) as {
      donor: Types.ObjectId;
      donorConfirmedAt?: Date;
      requesterConfirmedAt?: Date;
      donationStatus?: string;
      donatedAt?: Date;
    }[];

    const assignment = assignedDonors.find(
      (item) => item.donor.toString() === donorId,
    );

    if (!assignment) {
      return {
        success: false,
        error: "This donor is not assigned to the request",
      };
    }

    if (assignment.requesterConfirmedAt) {
      return {
        success: false,
        error: "You have already confirmed this donation",
      };
    }

    const confirmedCount = assignedDonors.filter(
      (item) => item.requesterConfirmedAt,
    ).length;

    if (confirmedCount >= bloodRequest.quantity) {
      return {
        success: false,
        error: "The required blood quantity has already been fulfilled",
      };
    }

    const now = new Date();

    assignment.requesterConfirmedAt = now;
    assignment.donationStatus = "donated";
    assignment.donatedAt = now;

    const newConfirmedCount = confirmedCount + 1;

    if (newConfirmedCount >= bloodRequest.quantity) {
      bloodRequest.status = "completed";
    }

    await bloodRequest.save();

    const user = await updateUserDonationHistory(donorId, now);

    // Notify donor based on their confirmation status
    if (!assignment.donorConfirmedAt) {
      // TODO: Notify donor that the requester confirmed receiving the donation
    } else {
      // TODO: Notify donor that the donation is fully confirmed
    }

    // TODO: Create completion notification if the request is completed

    revalidatePath("/blood-requests");
    revalidatePath(`/blood-requests/${requestId}`);
    revalidatePath(`/user/${user.username}`);

    return {
      success: true,
      message:
        newConfirmedCount >= bloodRequest.quantity
          ? "Donation confirmed and blood request completed"
          : "Donation confirmed successfully",
    };
  } catch (error) {
    console.error("Error confirming donation by requester:", error);

    return {
      success: false,
      error: "Failed to confirm donation",
    };
  }
}
