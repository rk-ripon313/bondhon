"use server";

import { getCurrentUserConnections } from "@/database/queries/user.query";

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
