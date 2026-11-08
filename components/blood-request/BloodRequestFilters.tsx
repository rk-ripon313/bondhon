"use client";

import { LoaderCircle, MapPin, RotateCcw, Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

import { BLOOD_GROUPS, REQUEST_STATUSES, REQUEST_URGENCY } from "@/constants";
import { useDonorLocations } from "@/hooks/use-donor-locations";
import { debounce } from "@/lib/helpers/debounce";
import { formatLabel } from "@/lib/helpers/formet-text";
import { findMe } from "@/lib/location/find-me";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
] as const;

const CONTROL_CLASS =
  "h-9 w-full min-w-0 rounded-lg border border-border bg-app-card text-xs text-app-foreground sm:text-sm";

export default function BloodRequestFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const search = searchParams.get("search") ?? "";
  const division = searchParams.get("division") ?? "";
  const district = searchParams.get("district") ?? "";
  const upazila = searchParams.get("upazila") ?? "";
  const bloodGroup = searchParams.get("bloodGroup") ?? "";
  const urgency = searchParams.get("urgency") ?? "";
  const status = searchParams.get("status") ?? "active";
  const sort = searchParams.get("sort") ?? "newest";

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
      params.set("search", value.trim());
    } else {
      params.delete("search");
    }

    params.delete("page");

    const query = params.toString();

    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  }, 400);

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    debouncedSearch(value);
  };

  const handleFindNearby = async () => {
    if (isFindingLocation) return;

    if (hasLocation) {
      updateParams({ lat: "", lng: "" });
      return;
    }

    setIsFindingLocation(true);

    try {
      const location = await findMe();

      if (!location?.coordinates) return;

      const [lng, lat] = location.coordinates.coordinates;

      if (typeof lat !== "number" || typeof lng !== "number") return;

      updateParams({
        lat: lat.toFixed(5),
        lng: lng.toFixed(5),
      });
    } catch (error) {
      console.warn("Failed to find nearby blood requests:", error);
    } finally {
      setIsFindingLocation(false);
    }
  };

  const resetFilters = () => {
    setSearchInput("");

    updateParams({
      search: "",
      division: "",
      district: "",
      upazila: "",
      bloodGroup: "",
      urgency: "",
      status: "",
      sort: "",
      lat: "",
      lng: "",
    });
  };

  const hasActiveFilters =
    Boolean(search) ||
    Boolean(searchInput.trim()) ||
    Boolean(division) ||
    Boolean(district) ||
    Boolean(upazila) ||
    Boolean(bloodGroup) ||
    Boolean(urgency) ||
    status !== "active" ||
    sort !== "newest" ||
    hasLocation;

  return (
    <div className="mb-7 rounded-xl border border-border bg-app-card/40 p-3 sm:p-4">
      {/* 
        ========================================================================
        ROW 1: Search, Near Me, Sort, Reset
        ========================================================================
      */}
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
        {/* Row 1.1: Search */}
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            value={searchInput}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search blood requests, hospital or details..."
            aria-label="Search blood requests"
            className={`${CONTROL_CLASS} pl-9 pr-9`}
          />

          {searchInput && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Clear search"
              onClick={() => handleSearchChange("")}
              className="absolute right-2 top-1/2 size-5 -translate-y-1/2 p-0 text-muted-foreground hover:bg-transparent"
            >
              <X className="size-4" />
            </Button>
          )}
        </div>

        {/* Row 1.2: Near Me, Sort, Reset */}
        <div className="grid grid-cols-3 gap-2 lg:flex lg:shrink-0">
          {/* Near Me */}
          <Button
            type="button"
            variant="outline"
            onClick={handleFindNearby}
            disabled={isFindingLocation}
            className={`h-9 cursor-pointer gap-1.5 rounded-lg px-2.5 text-xs font-medium sm:px-3 sm:text-sm ${
              hasLocation
                ? "border-emerald-600/30 bg-emerald-600/10 text-emerald-600 dark:text-emerald-400"
                : "border-emerald-600/20 bg-emerald-600/5 text-emerald-700 hover:bg-emerald-600/10 dark:text-emerald-400"
            }`}
          >
            {isFindingLocation ? (
              <LoaderCircle className="size-4 animate-spin shrink-0" />
            ) : (
              <MapPin className="size-4 shrink-0" />
            )}
            <span className="truncate">
              {isFindingLocation
                ? "Finding..."
                : hasLocation
                  ? "Nearby active"
                  : "Near Me"}
            </span>
          </Button>

          {/* Sort */}
          <Select
            value={sort}
            onValueChange={(value) => updateParams({ sort: value })}
          >
            <SelectTrigger
              className={`${CONTROL_CLASS} cursor-pointer px-2.5 sm:px-3`}
            >
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>

            <SelectContent className="bg-app-background">
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Reset */}
          <Button
            type="button"
            variant="outline"
            onClick={resetFilters}
            disabled={!hasActiveFilters}
            className="h-9 cursor-pointer gap-1.5 rounded-lg border-border px-2.5 text-xs font-medium text-muted-foreground hover:bg-app-background hover:text-foreground disabled:pointer-events-none disabled:opacity-40 sm:px-3 sm:text-sm"
          >
            <RotateCcw className="size-3.5 shrink-0" />
            Reset
          </Button>
        </div>
      </div>

      {/* 
        ========================================================================
        ROW 2: Filters (Location & Blood Request Specific Filters)
        ========================================================================
      */}
      <div className="mt-2 flex flex-col gap-2 lg:flex-row">
        {/* Row 2.1 in sm/md (Location Filters: Division, District, Upazila) */}
        <div className="grid min-w-0 grid-cols-3 gap-2 lg:flex-1">
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

            <SelectContent className="bg-app-background">
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

            <SelectContent className="bg-app-background">
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

            <SelectContent className="bg-app-background">
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
        </div>

        {/* Row 2.2 in sm/md (Blood Request Filters: Blood Group, Urgency, Status) */}
        <div className="grid min-w-0 grid-cols-3 gap-2 lg:flex-1">
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

            <SelectContent className="bg-app-background">
              <SelectItem value="all">All blood groups</SelectItem>

              {BLOOD_GROUPS.map((group) => (
                <SelectItem key={group} value={group}>
                  {group}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Urgency */}
          <Select
            value={urgency || "all"}
            onValueChange={(value) =>
              updateParams({
                urgency: value === "all" ? "" : value,
              })
            }
          >
            <SelectTrigger className={CONTROL_CLASS}>
              <SelectValue placeholder="All urgencies" />
            </SelectTrigger>

            <SelectContent className="bg-app-background">
              <SelectItem value="all">All urgencies</SelectItem>

              {REQUEST_URGENCY.map((item) => (
                <SelectItem key={item} value={item}>
                  {formatLabel(item)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status */}
          <Select
            value={status}
            onValueChange={(value) => updateParams({ status: value })}
          >
            <SelectTrigger className={CONTROL_CLASS}>
              <SelectValue placeholder="Status" />
            </SelectTrigger>

            <SelectContent className="bg-app-background">
              <SelectItem value="all">All statuses</SelectItem>

              {REQUEST_STATUSES.map((item) => (
                <SelectItem key={item} value={item}>
                  {formatLabel(item)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
