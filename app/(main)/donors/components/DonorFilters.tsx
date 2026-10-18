"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BLOOD_GROUPS } from "@/constants";
import { useDonorLocations } from "@/hooks/use-donor-locations";
import { debounce } from "@/lib/helpers/debounce";
import { findMe } from "@/lib/location/find-me";
import { MapPin, RotateCcw, Search, SlidersHorizontal, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

const CONTROL_CLASS =
  "h-9 w-full min-w-0 rounded-lg border border-border bg-app-card text-xs text-app-foreground sm:text-sm";

export default function DonorFilters({
  showAvailableToggle = false,
}: {
  showAvailableToggle?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const search = searchParams.get("search") ?? "";
  const availableOnly = searchParams.get("availableOnly") === "true";
  const division = searchParams.get("division") ?? "";
  const district = searchParams.get("district") ?? "";
  const upazila = searchParams.get("upazila") ?? "";
  const bloodGroup = searchParams.get("bloodGroup") ?? "";
  const hasLocation =
    Boolean(searchParams.get("lat")) && Boolean(searchParams.get("lng"));

  const [searchInput, setSearchInput] = useState(search);
  const [isFindingLocation, setIsFindingLocation] = useState(false);

  const {
    divisions,
    districts,
    upazillas,
    loadingDivisions,
    loadingDistricts,
    loadingUpazillas,
  } = useDonorLocations(division, district);

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });

      params.delete("page");

      const query = params.toString();

      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    },
    [searchParams, router, pathname],
  );
  const debouncedSearch = debounce((value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value.trim()) {
      params.set("search", value);
    } else {
      params.delete("search");
    }

    params.delete("page");

    router.replace(`${pathname}?${params.toString()}`, {
      scroll: false,
    });
  }, 400);

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    debouncedSearch(value);
  };

  const resetFilters = () => {
    setSearchInput("");
    const params = new URLSearchParams(searchParams.toString());

    [
      "search",
      "availableOnly",
      "division",
      "district",
      "upazila",
      "bloodGroup",
      "lat",
      "lng",
      "page",
    ].forEach((key) => params.delete(key));

    const query = params.toString();

    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };

  const handleFindNearby = async () => {
    if (isFindingLocation) return;

    setIsFindingLocation(true);

    try {
      const location = await findMe();

      if (!location?.coordinates) return;

      const [lng, lat] = location.coordinates.coordinates;

      if (typeof lat !== "number" || typeof lng !== "number") return;

      const params = new URLSearchParams(searchParams.toString());

      params.set("lat", lat.toFixed(5));
      params.set("lng", lng.toFixed(5));
      params.delete("page");

      router.replace(`${pathname}?${params.toString()}`, {
        scroll: false,
      });
    } catch (error) {
      console.warn("Failed to find nearby location:", error);
    } finally {
      setIsFindingLocation(false);
    }
  };

  const hasFilters =
    Boolean(search) ||
    Boolean(searchInput.trim()) ||
    Boolean(division) ||
    Boolean(district) ||
    Boolean(upazila) ||
    Boolean(bloodGroup) ||
    (showAvailableToggle && availableOnly) ||
    hasLocation;

  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <SlidersHorizontal className="size-4 text-app-primary" />
        <h2 className="text-sm font-semibold text-app-foreground">
          Find donors
        </h2>
      </div>

      <div className="flex flex-col gap-2 md:flex-row md:items-center">
        {/* Search */}
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-app-muted" />

          <Input
            value={searchInput}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder={
              showAvailableToggle
                ? "Search by name or username..."
                : "Search by name or location..."
            }
            aria-label={
              showAvailableToggle
                ? "Search by name or username..."
                : "Search by name or location..."
            }
            className={`${CONTROL_CLASS} pl-9 pr-9`}
          />

          {search && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Clear search"
              onClick={() => handleSearchChange("")}
              className="absolute right-2 top-1/2 size-5 -translate-y-1/2 rounded-md p-0 text-muted-foreground hover:bg-transparent hover:text-foreground"
            >
              <X className="size-4" />
            </Button>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2 md:flex-nowrap">
          <Button
            type="button"
            variant="outline"
            onClick={handleFindNearby}
            disabled={isFindingLocation}
            className="h-9 shrink-0 gap-1.5 cursor-pointer rounded-lg border-emerald-600/20 bg-emerald-600/10 px-3 text-xs font-medium text-emerald-700 hover:bg-emerald-600/15 dark:text-emerald-400 sm:text-sm"
          >
            <MapPin className="size-4" />
            {isFindingLocation ? "Finding..." : "Near me"}
          </Button>

          {showAvailableToggle && (
            <label
              htmlFor="available-only"
              className="inline-flex h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-border px-3 text-xs text-app-foreground sm:text-sm"
            >
              <Checkbox
                id="available-only"
                checked={availableOnly}
                onCheckedChange={(checked) =>
                  updateParams({
                    availableOnly: checked === true ? "true" : "",
                  })
                }
                className="size-4 data-[state=checked]:border-emerald-600 data-[state=checked]:bg-emerald-600 data-[state=checked]:text-white"
              />
              Available only
            </label>
          )}

          <Button
            type="button"
            variant="outline"
            onClick={resetFilters}
            disabled={!hasFilters}
            className="h-9 shrink-0 gap-1.5 cursor-pointer rounded-lg border-border px-3 text-xs font-medium text-app-muted transition-colors hover:bg-app-background hover:text-app-foreground disabled:pointer-events-none disabled:opacity-40 sm:text-sm"
          >
            <RotateCcw className="size-3.5" />
            Reset
          </Button>
        </div>
      </div>

      {/* Location and blood group filters */}
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {/* Division */}
        <Select
          value={division || "all"}
          onValueChange={(value) =>
            updateParams({
              division: value === "all" ? "" : value,
              district: "",
              upazila: "",
            })
          }
        >
          <SelectTrigger className={CONTROL_CLASS}>
            <SelectValue placeholder="All divisions" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">
              {loadingDivisions ? "Loading..." : "All divisions"}
            </SelectItem>

            {divisions.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* District */}
        <Select
          value={district || "all"}
          onValueChange={(value) =>
            updateParams({
              district: value === "all" ? "" : value,
              upazila: "",
            })
          }
          disabled={!division || loadingDistricts}
        >
          <SelectTrigger className={CONTROL_CLASS}>
            <SelectValue placeholder="All districts" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">
              {loadingDistricts ? "Loading..." : "All districts"}
            </SelectItem>

            {districts.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Upazila */}
        <Select
          value={upazila || "all"}
          onValueChange={(value) =>
            updateParams({
              upazila: value === "all" ? "" : value,
            })
          }
          disabled={!district || loadingUpazillas}
        >
          <SelectTrigger className={CONTROL_CLASS}>
            <SelectValue placeholder="All upazilas" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">
              {loadingUpazillas ? "Loading..." : "All upazilas"}
            </SelectItem>

            {upazillas.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Blood Group */}
        <Select
          value={bloodGroup || "all"}
          onValueChange={(value) =>
            updateParams({
              bloodGroup: value === "all" ? "" : value,
            })
          }
        >
          <SelectTrigger className={CONTROL_CLASS}>
            <SelectValue placeholder="All blood groups" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All blood groups</SelectItem>

            {BLOOD_GROUPS.map((group) => (
              <SelectItem key={group} value={group}>
                {group}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
