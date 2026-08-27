"use server";

import {
  getCurrentUser,
  getCurrentUserConnections,
} from "@/database/queries/user.query";
import { dbConnect } from "@/lib/db/db-connect";
import { User } from "@/models/user.model";
import { revalidatePath } from "next/cache";

export async function loadUserConnections() {
  try {
    const connections = await getCurrentUserConnections();

    if (!connections) {
      return {
        success: false,
        message: "Unauthorized.",
        followers: [],
        following: [],
      };
    }

    return {
      success: true,
      followers: connections.followers,
      following: connections.following,
    };
  } catch (error) {
    console.error("Load user connections error:", error);

    return {
      success: false,
      message: "Failed to load connections.",
      followers: [],
      following: [],
    };
  }
}

/**
 * Toggles the follow status of a user
 * @param username a string representing the username of the user to follow or unfollow
 * @returns an object containing the success status, a message, and the new follow status (true for following, false for not following)
 */

export async function toggleFollow(username: string) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser?._id) {
      return { success: false, message: "Unauthorized." };
    }

    if (!username) {
      return { success: false, message: "Username is required." };
    }

    await dbConnect();

    const targetUser = await User.findOne({ username }).select("_id");

    if (!targetUser) {
      return { success: false, message: "User not found." };
    }

    const currentUserId = currentUser._id;
    const targetUserId = targetUser._id;

    if (currentUserId.equals(targetUserId)) {
      return { success: false, message: "You cannot follow yourself." };
    }

    const [isBlockedByTarget, hasBlockedTarget, isFollowing] =
      await Promise.all([
        User.exists({
          _id: targetUser._id,
          blockedUsers: currentUser._id,
        }),

        User.exists({
          _id: currentUser._id,
          blockedUsers: targetUser._id,
        }),

        User.exists({
          _id: currentUser._id,
          following: targetUser._id,
        }),
      ]);

    if (isBlockedByTarget || hasBlockedTarget) {
      return { success: false, message: "You cannot follow this user." };
    }

    if (isFollowing) {
      await Promise.all([
        User.findByIdAndUpdate(currentUserId, {
          $pull: { following: targetUserId },
        }),
        User.findByIdAndUpdate(targetUserId, {
          $pull: { followers: currentUserId },
        }),
      ]);

      revalidatePath("/profile");

      return {
        success: true,
        data: false,
        message: "Unfollowed successfully.",
      };
    }

    await Promise.all([
      User.findByIdAndUpdate(currentUserId, {
        $addToSet: { following: targetUserId },
      }),
      User.findByIdAndUpdate(targetUserId, {
        $addToSet: { followers: currentUserId },
      }),
    ]);

    revalidatePath("/profile");

    return {
      success: true,
      data: true,
      message: "Started following!",
    };
  } catch (error) {
    console.error("Toggle follow error:", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update follow status.",
    };
  }
}
/**
 * Toggles the block status of a user
 * @param username a string representing the username of the user to block or unblock
 * @returns an object containing the success status, a message, and the new block status (true for blocked, false for unblocked)
 */

export async function toggleBlock(username: string) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser?._id) {
      return { success: false, message: "Unauthorized." };
    }

    if (!username) {
      return { success: false, message: "Username is required." };
    }

    await dbConnect();

    const targetUser = await User.findOne({ username }).select("_id");

    if (!targetUser) {
      return { success: false, message: "User not found." };
    }

    const currentUserId = currentUser._id;
    const targetUserId = targetUser._id;

    if (currentUserId.equals(targetUserId)) {
      return { success: false, message: "You cannot block yourself." };
    }

    const isBlocked = await User.exists({
      _id: currentUserId,
      blockedUsers: targetUserId,
    });

    if (isBlocked) {
      await User.findByIdAndUpdate(currentUserId, {
        $pull: {
          blockedUsers: targetUserId,
        },
      });

      revalidatePath("/profile");

      return {
        success: true,
        data: false,
        message: "User unblocked successfully.",
      };
    }

    await Promise.all([
      // Add target user to current user's blocked list
      User.findByIdAndUpdate(currentUserId, {
        $addToSet: {
          blockedUsers: targetUserId,
        },
        $pull: {
          following: targetUserId,
          followers: targetUserId,
        },
      }),

      // Remove current user from target user's relationships
      User.findByIdAndUpdate(targetUserId, {
        $pull: {
          following: currentUserId,
          followers: currentUserId,
        },
      }),
    ]);

    revalidatePath("/profile");

    return {
      success: true,
      data: true,
      message: "User blocked successfully.",
    };
  } catch (error) {
    console.error("Toggle block error:", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update block status.",
    };
  }
}
