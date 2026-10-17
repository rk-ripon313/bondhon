"use client";

import { useEffect, useState } from "react";

interface ApiResponse<T> {
  data?: T[];
}

export function useDonorLocations(division: string, district: string) {
  const [divisions, setDivisions] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [upazillas, setUpazillas] = useState<string[]>([]);

  const [loadingDivisions, setLoadingDivisions] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingUpazillas, setLoadingUpazillas] = useState(false);

  // Load divisions
  useEffect(() => {
    let cancelled = false;

    async function loadDivisions() {
      setLoadingDivisions(true);

      try {
        const response = await fetch("https://bdapis.com/api/v1.2/divisions");

        if (!response.ok) return;

        const result: ApiResponse<{ division?: string }> =
          await response.json();

        if (!cancelled) {
          setDivisions(
            (result.data ?? [])
              .map((item) => item.division)
              .filter((item): item is string => Boolean(item))
              .sort(),
          );
        }
      } catch {
        if (!cancelled) setDivisions([]);
      } finally {
        if (!cancelled) setLoadingDivisions(false);
      }
    }

    void loadDivisions();

    return () => {
      cancelled = true;
    };
  }, []);

  // Load districts when division changes
  useEffect(() => {
    let cancelled = false;

    async function loadDistricts() {
      setDistricts([]);
      setUpazillas([]);

      if (!division) {
        setLoadingDistricts(false);
        return;
      }

      setLoadingDistricts(true);

      try {
        const response = await fetch(
          `https://bdapis.com/api/v1.2/division/${encodeURIComponent(division)}`,
        );

        if (!response.ok) return;

        const result: ApiResponse<{ district?: string; upazillas?: string[] }> =
          await response.json();

        if (!cancelled) {
          setDistricts(
            (result.data ?? [])
              .map((item) => item.district)
              .filter((item): item is string => Boolean(item))
              .sort(),
          );
        }
      } catch {
        if (!cancelled) setDistricts([]);
      } finally {
        if (!cancelled) setLoadingDistricts(false);
      }
    }

    void loadDistricts();

    return () => {
      cancelled = true;
    };
  }, [division]);

  // Load upazillas when district changes
  useEffect(() => {
    let cancelled = false;

    async function loadUpazillas() {
      setUpazillas([]);

      if (!district) {
        setLoadingUpazillas(false);
        return;
      }

      setLoadingUpazillas(true);

      try {
        const response = await fetch(
          `https://bdapis.com/api/v1.2/district/${encodeURIComponent(district)}`,
        );

        if (!response.ok) return;

        const result: ApiResponse<{ upazillas?: string[] }> =
          await response.json();

        if (!cancelled) {
          setUpazillas(result.data?.[0]?.upazillas ?? []);
        }
      } catch {
        if (!cancelled) setUpazillas([]);
      } finally {
        if (!cancelled) setLoadingUpazillas(false);
      }
    }

    void loadUpazillas();

    return () => {
      cancelled = true;
    };
  }, [district]);

  return {
    divisions,
    districts,
    upazillas,
    loadingDivisions,
    loadingDistricts,
    loadingUpazillas,
  };
}
