"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { findMe } from "@/lib/location/find-me";

export default function LocationInitializer() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const existingLat = searchParams.get("lat");
    const existingLng = searchParams.get("lng");

    if (existingLat && existingLng) {
      return;
    }

    let cancelled = false;

    async function initializeLocation() {
      try {
        const location = await findMe();

        if (cancelled || !location?.coordinates) {
          return;
        }

        const [lng, lat] = location.coordinates.coordinates;

        if (typeof lat !== "number" || typeof lng !== "number") {
          return;
        }

        const params = new URLSearchParams(searchParams.toString());

        params.set("lat", lat.toFixed(5));
        params.set("lng", lng.toFixed(5));

        router.replace(`${pathname}?${params.toString()}`, {
          scroll: false,
        });
      } catch {
        console.warn("Failed to initialize location:");
      }
    }

    initializeLocation();

    return () => {
      cancelled = true;
    };
  }, [pathname, router, searchParams]);

  return null;
}
