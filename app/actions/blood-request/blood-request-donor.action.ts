"use server";

import { Types } from "mongoose";
import { revalidatePath } from "next/cache";

import { getCurrentUser } from "@/database/queries/user.query";
import { isBloodGroupCompatible } from "@/lib/blood/blood-group";
import { dbConnect } from "@/lib/db/db-connect";
import { getDistanceInKm } from "@/lib/location/distance";
import { isUserEligibleForAction } from "@/lib/profile/profile-utils";
import { BloodRequest } from "@/models/blood-request.model";

/**
 * Toggle the current user's interest in a blood request.
 *
 * Validates donor eligibility, blood group compatibility, and
 * service distance when adding interest.
 */

const MAX_INTEREST_DISTANCE_KM = 50;

export async function toggleBloodRequestInterest(requestId: string) {
  try {
    const user = await getCurrentUser();

    if (!user?.id) {
      return {
        success: false,
        message: "You must be logged in to show interest.",
      };
    }

    if (!isUserEligibleForAction(user)) {
      return {
        success: false,
        message: "Please complete your profile before showing interest.",
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

    // Request owner cannot show interest in own request.
    if (request.requester.toString() === userId) {
      return {
        success: false,
        message: "You cannot show interest in your own request.",
      };
    }

    // Interest can only be changed while request is active.
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

    const isAssigned = assignedDonors.some(
      (item) => item.donor.toString() === userId,
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

    // ---------------------------
    // --> REMOVE INTEREST
    // ---------------------------
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
    // ---------------------------
    // -->  ADD INTEREST
    // ---------------------------

    // Blood group compatibility

    if (!isBloodGroupCompatible(user.bloodGroup, request.bloodGroupNeeded)) {
      return {
        success: false,
        message: "Your blood group is not compatible with this blood request.",
      };
    }

    // Location is required
    if (!user.location?.coordinates || !request.location?.coordinates) {
      return {
        success: false,
        message: "Please update your location before showing interest.",
      };
    }

    // Distance validation
    const distanceKm = getDistanceInKm(user.location, request.location);

    if (distanceKm === null || distanceKm > MAX_INTEREST_DISTANCE_KM) {
      return {
        success: false,
        message: `This blood request is outside the ${MAX_INTEREST_DISTANCE_KM} km service area.`,
      };
    }

    // Add interest
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
