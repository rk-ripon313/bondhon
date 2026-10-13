"use client";

import type { Dispatch, SetStateAction } from "react";
import { useCallback, useEffect, useRef } from "react";

import { loadNotifications } from "@/app/actions/notification/notification.action";
import {
  cleanupNotificationSound,
  enableNotificationSound,
  playNotificationSound,
} from "@/lib/notifications/notification-sound";
import type { Notification } from "@/types/notification.type";

interface UseNotificationPollingProps {
  open: boolean;
  setUnreadCount: Dispatch<SetStateAction<number>>;
}

export function useNotificationPolling({
  open,
  setUnreadCount,
}: UseNotificationPollingProps) {
  const latestNotificationIdRef = useRef<string | null>(null);
  const pollingRef = useRef(false);

  // Initialize the latest notification without playing sound.
  useEffect(() => {
    let cancelled = false;

    async function initializeNotifications() {
      try {
        const result = await loadNotifications("all", 0, 1);

        if (cancelled || !result.success) return;

        const latest = result.notifications[0] as Notification | undefined;

        latestNotificationIdRef.current = latest?.id ?? null;
        setUnreadCount(result.unreadCount);
      } catch {
        // Ignore initialization errors.
      }
    }

    void initializeNotifications();

    return () => {
      cancelled = true;
    };
  }, [setUnreadCount]);

  const pollNotifications = useCallback(
    async (playSound = true) => {
      if (pollingRef.current || document.hidden) return;

      pollingRef.current = true;

      try {
        const result = await loadNotifications("all", 0, 1);

        if (!result.success) return;

        const latest = result.notifications[0] as Notification | undefined;
        const latestId = latest?.id ?? null;
        const previousId = latestNotificationIdRef.current;

        if (
          latestId &&
          previousId &&
          latestId !== previousId &&
          latest &&
          !latest.isRead &&
          playSound
        ) {
          playNotificationSound();
        }
        latestNotificationIdRef.current = latestId;
        setUnreadCount(result.unreadCount);
      } catch {
        // Ignore background polling errors.
      } finally {
        pollingRef.current = false;
      }
    },
    [setUnreadCount],
  );

  // Enable audio after the user's first interaction.
  useEffect(() => {
    document.addEventListener("pointerdown", enableNotificationSound);
    document.addEventListener("keydown", enableNotificationSound);

    return () => {
      document.removeEventListener("pointerdown", enableNotificationSound);
      document.removeEventListener("keydown", enableNotificationSound);
      cleanupNotificationSound();
    };
  }, []);

  // Poll only while the notification popover is closed.
  useEffect(() => {
    if (open) return;

    const intervalId = window.setInterval(() => {
      void pollNotifications();
    }, 60_000);

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        void pollNotifications(false);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [open, pollNotifications]);
}
