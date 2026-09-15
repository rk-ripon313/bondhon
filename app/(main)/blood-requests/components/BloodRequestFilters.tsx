"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";

import {
  BLOOD_GROUPS,
  REQUEST_STATUSES,
  REQUEST_URGENCY,
} from "@/constants/index";

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
  {
    value: "needed-soonest",
    label: "Needed soonest",
  },
  {
    value: "newest",
    label: "Newest",
  },
  {
    value: "urgency",
    label: "Highest urgency",
  },
];

const getLabel = (value: string) => {
  return value.charAt(0).toUpperCase() + value.slice(1);
};

export default function BloodRequestFilters() {
  const [search, setSearch] = useState("");
  const [bloodGroup, setBloodGroup] = useState("all");
  const [status, setStatus] = useState("all");
  const [urgency, setUrgency] = useState("all");
  const [sortBy, setSortBy] = useState("needed-soonest");

  const hasFilters =
    search.trim() !== "" ||
    bloodGroup !== "all" ||
    status !== "all" ||
    urgency !== "all" ||
    sortBy !== "needed-soonest";

  const clearAll = () => {
    setSearch("");
    setBloodGroup("all");
    setStatus("all");
    setUrgency("all");
    setSortBy("needed-soonest");
  };

  const removeFilter = (filter: string) => {
    if (filter === "search") setSearch("");
    if (filter === "bloodGroup") setBloodGroup("all");
    if (filter === "status") setStatus("all");
    if (filter === "urgency") setUrgency("all");
    if (filter === "sortBy") setSortBy("needed-soonest");
  };

  return (
    <section className="mb-7 rounded-xl border border-border bg-app-card p-4 sm:p-5">
      {/* Header */}
      <div className="mb-4 flex items-center gap-2">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-app-primary/10 text-app-primary">
          <SlidersHorizontal className="size-4" />
        </div>

        <div>
          <h2 className="text-sm font-semibold">Search & filters</h2>

          <p className="text-xs text-muted-foreground">
            Narrow down blood requests
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-3">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search hospital, area or district..."
          className="h-10 pl-9"
        />
      </div>

      {/* Filter controls */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* Blood group */}
        <Select value={bloodGroup} onValueChange={setBloodGroup}>
          <SelectTrigger className="h-10 w-full">
            <SelectValue placeholder="Blood group" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All groups</SelectItem>

            {BLOOD_GROUPS.map((group) => (
              <SelectItem key={group} value={group}>
                {group}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status */}
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="h-10 w-full">
            <SelectValue placeholder="Status" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>

            {REQUEST_STATUSES.map((item) => (
              <SelectItem key={item} value={item}>
                {getLabel(item)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Urgency */}
        <Select value={urgency} onValueChange={setUrgency}>
          <SelectTrigger className="h-10 w-full">
            <SelectValue placeholder="Urgency" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All urgency</SelectItem>

            {REQUEST_URGENCY.map((item) => (
              <SelectItem key={item} value={item}>
                {getLabel(item)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="h-10 w-full">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>

          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Active filters */}
      <div className="mt-4 border-t border-border pt-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="mb-2 text-xs font-medium text-muted-foreground">
              Active filters
            </p>

            {hasFilters ? (
              <div className="flex flex-wrap gap-2">
                {search.trim() && (
                  <FilterBadge
                    label={`Search: ${search}`}
                    onRemove={() => removeFilter("search")}
                  />
                )}

                {bloodGroup !== "all" && (
                  <FilterBadge
                    label={`Blood: ${bloodGroup}`}
                    onRemove={() => removeFilter("bloodGroup")}
                  />
                )}

                {status !== "all" && (
                  <FilterBadge
                    label={`Status: ${getLabel(status)}`}
                    onRemove={() => removeFilter("status")}
                  />
                )}

                {urgency !== "all" && (
                  <FilterBadge
                    label={`Urgency: ${getLabel(urgency)}`}
                    onRemove={() => removeFilter("urgency")}
                  />
                )}

                {sortBy !== "needed-soonest" && (
                  <FilterBadge
                    label={`Sort: ${
                      SORT_OPTIONS.find((option) => option.value === sortBy)
                        ?.label
                    }`}
                    onRemove={() => removeFilter("sortBy")}
                  />
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No filters applied
              </p>
            )}
          </div>

          {hasFilters && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearAll}
              className="h-8 shrink-0 cursor-pointer self-start text-muted-foreground hover:text-foreground"
            >
              Clear all
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}

function FilterBadge({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <span className="inline-flex max-w-full items-center gap-1 rounded-full border border-border bg-app-background px-2.5 py-1 text-xs text-foreground">
      <span className="max-w-[220px] truncate">{label}</span>

      <button
        type="button"
        onClick={onRemove}
        className="shrink-0 cursor-pointer rounded-full p-0.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        aria-label={`Remove ${label} filter`}
      >
        <X className="size-3" />
      </button>
    </span>
  );
}
