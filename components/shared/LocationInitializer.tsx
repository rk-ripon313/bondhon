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

    // If coordinates already exist in URL, notify WeatherButton.
    if (existingLat && existingLng) {
      window.dispatchEvent(
        new CustomEvent("bondhon:location-updated", {
          detail: {
            lat: existingLat,
            lng: existingLng,
          },
        }),
      );

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

        const latValue = lat.toFixed(5);
        const lngValue = lng.toFixed(5);

        const params = new URLSearchParams(searchParams.toString());

        params.set("lat", latValue);
        params.set("lng", lngValue);

        router.replace(`${pathname}?${params.toString()}`, {
          scroll: false,
        });

        // Notify WeatherButton about the newly detected location.
        window.dispatchEvent(
          new CustomEvent("bondhon:location-updated", {
            detail: {
              lat: latValue,
              lng: lngValue,
            },
          }),
        );
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
