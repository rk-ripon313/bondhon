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
import { createNotifications } from "@/lib/notifications/notification.service";
import { isUserEligibleForAction } from "@/lib/profile/profile-utils";
import { BloodRequest } from "@/models/blood-request.model";
import { User } from "@/models/user.model";

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
      "requester bloodGroupNeeded status neededBefore location interestedDonors assignedDonors",
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
    if (request.status !== "active" || request.neededBefore <= new Date()) {
      return {
        success: false,
        message: "This blood request is no longer accepting interest.",
      };
    }

    const interestedDonors = (request.interestedDonors ??
      []) as Types.ObjectId[];

    const assignedDonors = (request.assignedDonors ?? []) as {
      donor: Types.ObjectId;
      donationStatus: string;
    }[];

    // A donor with an active assignment cannot toggle interest.
    const isAssigned = assignedDonors.some(
      (assignment) => assignment.donor.toString() === userId,
    );

    if (isAssigned) {
      return {
        success: false,
        message: "You are already assigned to this request.",
      };
    }

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
    const updateResult = await BloodRequest.updateOne(
      { _id: requestId },
      {
        $addToSet: {
          interestedDonors: userId,
        },
      },
    );

    if (updateResult.modifiedCount !== 1) {
      return {
        success: false,
        message: "Failed to show interest in this blood request.",
      };
    }

    // Notify requester that a donor showed interest.
    await createNotifications({
      receivers: [request.requester],
      actor: userId,
      type: "blood_request_interested",
      title: "New Interest",
      message: "Someone is interested in donating for your blood request.",
      link: `/blood-requests/${requestId}`,
    });

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
 * A donor can only have one active blood donation assignment at a time.
 * Once assigned to this request, the donor is removed from the
 * interested donors list and the assignment is kept as history.
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

    const request = await BloodRequest.findById(requestId)
      .select(
        "requester status neededBefore quantity bloodGroupNeeded interestedDonors assignedDonors",
      )
      .lean();

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

    // Only active requests can accept new assignments.
    if (request.status !== "active" || request.neededBefore <= new Date()) {
      return {
        success: false,
        message: "This blood request is no longer accepting donors.",
      };
    }

    //  Donor must be interested
    const interestedDonors = (request.interestedDonors ??
      []) as Types.ObjectId[];

    const isInterested = interestedDonors.some(
      (donor) => donor.toString() === donorId,
    );

    if (!isInterested) {
      return {
        success: false,
        message: "This donor is no longer interested in this request.",
      };
    }

    // A donor who has already been assigned to this request
    // cannot be assigned again.
    const assignedDonors = (request.assignedDonors ?? []) as {
      donor: Types.ObjectId;
      donationStatus: string;
    }[];

    const isAlreadyAssigned = assignedDonors.some(
      (assignment) => assignment.donor.toString() === donorId,
    );

    if (isAlreadyAssigned) {
      return {
        success: false,
        message: "This donor is already assigned to this request.",
      };
    }

    const confirmedDonationCount = assignedDonors.filter(
      (assignment) =>
        assignment.donationStatus === "confirmed_by_requester" ||
        assignment.donationStatus === "donated",
    ).length;

    // If the number of confirmed donations is already equal to or greater than the requested quantity, no more donors can be assigned.
    if (confirmedDonationCount >= request.quantity) {
      return {
        success: false,
        message:
          "This blood request has already received the required amount of blood.",
      };
    }

    // Find the donor and check availability.
    const donor = await User.findById(donorId)
      .select("isAvailableForDonate bloodGroup")
      .lean();

    if (!donor || !donor.isAvailableForDonate) {
      return {
        success: false,
        message: "Donor not found or currently unavailable for blood donation.",
      };
    }

    // Check blood group compatibility.
    if (!isBloodGroupCompatible(donor.bloodGroup, request.bloodGroupNeeded)) {
      return {
        success: false,
        message:
          "This donor's blood group is not compatible with this blood request.",
      };
    }
    // ------------------------------
    // CHECK PREVIOUS ASSIGNMENTS
    // ------------------------------
    const previousRequests = await BloodRequest.find({
      _id: { $ne: requestId },
      "assignedDonors.donor": donorId,
    })
      .select("assignedDonors")
      .lean();

    const UNRESOLVED_ASSIGNMENT_TIMEOUT_DAYS = 90;

    let hasActiveAssignment = false;

    //loop through previous requests to check if the donor has any unresolved assignments
    for (const previousRequest of previousRequests) {
      const assignments = previousRequest.assignedDonors ?? [];

      for (const assignment of assignments) {
        if (assignment.donor.toString() !== donorId) {
          continue;
        }

        const donationStatus = assignment.donationStatus;

        // Resolved assignments
        if (
          donationStatus === "canceled_by_donor" ||
          donationStatus === "canceled_by_requester" ||
          donationStatus === "donated"
        ) {
          continue;
        }

        // Unresolved assignments
        if (
          donationStatus === "pending" ||
          donationStatus === "confirmed_by_donor"
        ) {
          // Unresolved assignments
          const unresolvedSince =
            assignment.donorConfirmedAt ?? assignment.assignedAt;

          const staleDate = new Date(unresolvedSince);

          staleDate.setDate(
            staleDate.getDate() + UNRESOLVED_ASSIGNMENT_TIMEOUT_DAYS,
          );

          // Still inside the unresolved assignment window
          if (new Date() < staleDate) {
            hasActiveAssignment = true;
            break;
          }

          // 90 days have passed.
          // This unresolved assignment is stale,
        }
      }

      if (hasActiveAssignment) {
        break;
      }
    }

    if (hasActiveAssignment) {
      return {
        success: false,
        message: "This donor already has an active blood donation assignment.",
      };
    }

    // Assign the donor.
    const result = await BloodRequest.updateOne(
      {
        _id: requestId,
        status: "active",
        interestedDonors: donorId,
        "assignedDonors.donor": { $ne: donorId },
      },
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

    if (result.modifiedCount !== 1) {
      return {
        success: false,
        message: "The donor could not be assigned.",
      };
    }

    // Notify the donor that they have been assigned.
    await createNotifications({
      receivers: [donorId],
      actor: userId,
      type: "blood_request_assigned",
      title: "Donor Assigned",
      message: "You have been assigned to a blood request.",
      link: `/blood-requests/${requestId}`,
    });

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
 *
 * Requesters can cancel an assigned donor,
 * while donors can cancel their own assignment.
 *
 * The assignment is kept as history and only its
 * donationStatus is updated.
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
      .select("requester assignedDonors")
      .lean();

    if (!request) {
      return {
        success: false,
        message: "Blood request not found.",
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
      donationStatus: string;
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

    // Only pending assignments can be cancelled.
    if (assignment.donationStatus !== "pending") {
      return {
        success: false,
        message: "You cannot cancel this assignment after confirmation.",
      };
    }

    const donationStatus = isOwner
      ? "canceled_by_requester"
      : "canceled_by_donor";

    const result = await BloodRequest.updateOne(
      {
        _id: requestId,
        "assignedDonors.donor": donorId,
        "assignedDonors.donationStatus": "pending",
      },
      {
        $set: {
          "assignedDonors.$.donationStatus": donationStatus,
        },
      },
    );

    if (result.modifiedCount !== 1) {
      return {
        success: false,
        message: "The assignment could not be cancelled.",
      };
    }

    // Notify the other party about the cancellation.
    await createNotifications({
      receivers: [isOwner ? donorId : request.requester],
      actor: userId,
      type: isOwner
        ? "blood_request_requester_canceled"
        : "blood_request_donor_canceled",
      title: "Assignment Cancelled",
      message: isOwner
        ? "Your donor assignment for a blood request has been cancelled."
        : "A donor has cancelled their assignment for your blood request.",
      link: `/blood-requests/${requestId}`,
    });

    revalidatePath("/");
    revalidatePath("/profile");
    revalidatePath("/blood-requests");
    revalidatePath(`/blood-requests/${requestId}`);

    return {
      success: true,
      message: isOwner
        ? "Donor assignment cancelled successfully."
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
 *
 * The donor confirms their donation. If the requester has already
 * confirmed, the donation becomes final and the donor's donation
 * history is updated.
 */

export async function confirmBloodDonationByDonor(requestId: string) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser?.id) {
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
      donationStatus: string;
      donorConfirmedAt?: Date;
      requesterConfirmedAt?: Date;
      donatedAt?: Date;
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

    // Canceled or completed assignments cannot be confirmed again.
    if (
      assignment.donationStatus === "canceled_by_donor" ||
      assignment.donationStatus === "canceled_by_requester" ||
      assignment.donationStatus === "donated"
    ) {
      return {
        success: false,
        error: "This assignment can no longer be confirmed.",
      };
    }

    // A donor can confirm their donation only once.
    if (assignment.donorConfirmedAt) {
      return {
        success: false,
        error: "You have already confirmed this donation",
      };
    }

    const now = new Date();

    // Record when the donor confirmed the donation.
    assignment.donorConfirmedAt = now;

    if (assignment.donationStatus === "confirmed_by_requester") {
      // Both donor and requester have now confirmed the donation.
      assignment.donationStatus = "donated";

      // Use the earlier of the requester's confirmation and the deadline.
      const donatedAt =
        assignment.requesterConfirmedAt! <= bloodRequest.neededBefore
          ? assignment.requesterConfirmedAt!
          : bloodRequest.neededBefore;

      assignment.donatedAt = donatedAt;

      // Count fully confirmed donations, including the current donation.
      const donatedCount = assignedDonors.filter(
        (item) => item.donationStatus === "donated",
      ).length;

      const requestCompleted = donatedCount >= bloodRequest.quantity;

      if (requestCompleted) {
        bloodRequest.status = "completed";
      }

      await bloodRequest.save();

      // Update donor history only after the donation becomes final.
      await updateUserDonationHistory(currentUser.id, requestId, donatedAt);

      // Notify requester only when the request is completed.
      if (requestCompleted) {
        await createNotifications({
          receivers: [bloodRequest.requester],
          actor: currentUser.id,
          type: "blood_request_completed",
          title: "Blood Request Completed",
          message: "Your blood request has been completed successfully.",
          link: `/blood-requests/${requestId}`,
        });
      }
    } else {
      // Only donor has confirmed so far.
      assignment.donationStatus = "confirmed_by_donor";

      await bloodRequest.save();

      // Notify requester to confirm the donation.
      await createNotifications({
        receivers: [bloodRequest.requester],
        actor: currentUser.id,
        type: "blood_request_donor_confirmed",
        title: "Donation Confirmation",
        message:
          "The assigned donor has confirmed the donation. Please confirm the donation.",
        link: `/blood-requests/${requestId}`,
      });
    }

    revalidatePath(`/blood-requests/${requestId}`);
    revalidatePath("/profile");

    return {
      success: true,
      message: "Donation confirmation submitted successfully.",
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
 *
 * The requester confirms the donation. If the donor has already
 * confirmed, the assignment becomes final and the donor's donation
 * history is updated.
 */
export async function confirmBloodDonationByRequester(
  requestId: string,
  donorId: string,
) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser?.id) {
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

    // Only the requester can confirm a donor's donation.
    if (bloodRequest.requester.toString() !== currentUser.id) {
      return {
        success: false,
        error: "You are not allowed to confirm this donation",
      };
    }

    const assignedDonors = (bloodRequest.assignedDonors ?? []) as {
      donor: Types.ObjectId;
      donationStatus: string;
      donorConfirmedAt?: Date;
      requesterConfirmedAt?: Date;
      donatedAt?: Date;
    }[];

    const assignment = assignedDonors.find(
      (assignment) => assignment.donor.toString() === donorId,
    );

    if (!assignment) {
      return {
        success: false,
        error: "This donor is not assigned to the request",
      };
    }

    // Canceled or completed assignments cannot be confirmed again.
    if (
      assignment.donationStatus === "canceled_by_donor" ||
      assignment.donationStatus === "canceled_by_requester" ||
      assignment.donationStatus === "donated"
    ) {
      return {
        success: false,
        error: "This assignment can no longer be confirmed.",
      };
    }

    // The requester can confirm this donation only once.
    if (assignment.requesterConfirmedAt) {
      return {
        success: false,
        error: "You have already confirmed this donation",
      };
    }

    const now = new Date();

    // Record when the requester confirmed the donation.
    assignment.requesterConfirmedAt = now;

    if (assignment.donationStatus === "confirmed_by_donor") {
      // Both donor and requester have now confirmed the donation.
      assignment.donationStatus = "donated";

      // Use the earlier of the donor's confirmation and the deadline.
      const donatedAt =
        assignment.donorConfirmedAt! <= bloodRequest.neededBefore
          ? assignment.donorConfirmedAt!
          : bloodRequest.neededBefore;

      assignment.donatedAt = donatedAt;

      // Count fully confirmed donations, including the current donation.
      const donatedCount = assignedDonors.filter(
        (item) => item.donationStatus === "donated",
      ).length;

      const requestCompleted = donatedCount >= bloodRequest.quantity;
      if (requestCompleted) {
        bloodRequest.status = "completed";
      }
      await bloodRequest.save();

      // Update donor history only after the donation becomes final.
      await updateUserDonationHistory(donorId, requestId, donatedAt);

      // Notify donor that the donation is successful.
      await createNotifications({
        receivers: [donorId],
        actor: currentUser.id,
        type: "blood_request_donation_successful",
        title: "Donation Confirmed",
        message: "Your blood donation has been confirmed by the requester.",
        link: `/blood-requests/${requestId}`,
      });

      // Notify requester only when the required quantity is fulfilled.
      if (requestCompleted) {
        await createNotifications({
          receivers: [bloodRequest.requester],
          actor: currentUser.id,
          type: "blood_request_completed",
          title: "Blood Request Completed",
          message: "Your blood request has been completed successfully.",
          link: `/blood-requests/${requestId}`,
        });
      }
    } else {
      // Only the requester has confirmed so far.
      assignment.donationStatus = "confirmed_by_requester";

      await bloodRequest.save();

      // Notify donor to confirm the donation.
      await createNotifications({
        receivers: [donorId],
        actor: currentUser.id,
        type: "blood_request_requester_confirmed",
        title: "Donation Confirmation",
        message:
          "The requester has confirmed your donation. Please confirm it to complete the process.",
        link: `/blood-requests/${requestId}`,
      });
    }

    revalidatePath(`/blood-requests/${requestId}`);
    revalidatePath("/profile");

    return {
      success: true,
      message: "Donation confirmation submitted successfully.",
    };
  } catch (error) {
    console.error("Error confirming donation by requester:", error);

    return {
      success: false,
      error: "Failed to confirm donation",
    };
  }
}
