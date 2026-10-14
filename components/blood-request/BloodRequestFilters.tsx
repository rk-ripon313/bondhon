"use client";

import { LoaderCircle, MapPin, Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { BLOOD_GROUPS, REQUEST_STATUSES, REQUEST_URGENCY } from "@/constants";
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
import { debounce } from "@/lib/helpers/debounce";

const SORT_OPTIONS = ["newest", "oldest"] as const;

const CONTROL_CLASS =
  "h-8 min-h-8 w-full !rounded-lg border border-border bg-app-background px-3 py-0 text-sm leading-none";

export default function BloodRequestFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [isFindingLocation, setIsFindingLocation] = useState(false);

  const bloodGroup = searchParams.get("bloodGroup") ?? "all";
  const status = searchParams.get("status") ?? "active";
  const urgency = searchParams.get("urgency") ?? "all";

  const sortParam = searchParams.get("sort");
  const sortBy: (typeof SORT_OPTIONS)[number] = SORT_OPTIONS.includes(
    sortParam as (typeof SORT_OPTIONS)[number],
  )
    ? (sortParam as (typeof SORT_OPTIONS)[number])
    : "newest";

  const hasActiveFilters =
    search.trim() !== "" ||
    bloodGroup !== "all" ||
    status !== "active" ||
    urgency !== "all" ||
    sortBy !== "newest";

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (key === "status" && value === "all") {
      params.set("status", "all");
    } else if (!value || value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    params.delete("page");

    router.replace(`${pathname}?${params.toString()}`, {
      scroll: false,
    });
  };

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
    setSearch(value);
    debouncedSearch(value);
  };

  const handleClearFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    params.delete("search");
    params.delete("bloodGroup");
    params.delete("status");
    params.delete("urgency");
    params.delete("sort");
    params.delete("page");

    setSearch("");

    router.replace(`${pathname}?${params.toString()}`, {
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

  return (
    <section className="mb-8 rounded-xl border border-border bg-app-card/40 p-3">
      {/* Top Row */}
      <div className="grid min-w-0 grid-cols-1 gap-2 lg:grid-cols-[minmax(0,1fr)_170px_170px]">
        {/* Search */}
        <div className="relative min-w-0">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search blood requests..."
            className={`${CONTROL_CLASS} min-w-0 pl-9 pr-9`}
          />

          {search && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => handleSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        {/* Find Nearby */}
        <Button
          type="button"
          variant="outline"
          onClick={handleFindNearby}
          disabled={isFindingLocation}
          className={`${CONTROL_CLASS} cursor-pointer disabled:cursor-not-allowed`}
        >
          {isFindingLocation ? (
            <LoaderCircle className="size-4 animate-spin" />
          ) : (
            <MapPin className="size-4" />
          )}

          {isFindingLocation ? "Finding location..." : "Use my location"}
        </Button>

        {/* Sort */}
        <Select
          value={sortBy}
          onValueChange={(value) => {
            if (SORT_OPTIONS.includes(value as (typeof SORT_OPTIONS)[number])) {
              updateParam("sort", value);
            }
          }}
        >
          <SelectTrigger className={CONTROL_CLASS}>
            <SelectValue placeholder="Sort" />
          </SelectTrigger>

          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {option === "newest" ? "Newest" : "Oldest"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Bottom Row */}
      <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {/* Blood Group */}
        <Select
          value={bloodGroup}
          onValueChange={(value) => updateParam("bloodGroup", value)}
        >
          <SelectTrigger className={CONTROL_CLASS}>
            <SelectValue placeholder="Blood Group" />
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

        {/* Status */}
        <Select
          value={status}
          onValueChange={(value) => updateParam("status", value)}
        >
          <SelectTrigger className={CONTROL_CLASS}>
            <SelectValue placeholder="Status" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>

            {REQUEST_STATUSES.map((item) => (
              <SelectItem key={item} value={item}>
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Urgency */}
        <Select
          value={urgency}
          onValueChange={(value) => updateParam("urgency", value)}
        >
          <SelectTrigger className={CONTROL_CLASS}>
            <SelectValue placeholder="Urgency" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All urgencies</SelectItem>

            {REQUEST_URGENCY.map((item) => (
              <SelectItem key={item} value={item}>
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        <Button
          type="button"
          variant="outline"
          onClick={handleClearFilters}
          disabled={!hasActiveFilters}
          className={`${CONTROL_CLASS} cursor-pointer disabled:cursor-not-allowed disabled:opacity-50`}
        >
          Clear filters
        </Button>
      </div>
    </section>
  );
}
