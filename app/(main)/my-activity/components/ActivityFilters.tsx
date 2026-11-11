"use client";

import { ArrowDownUp, ChevronDown, RotateCcw } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { EVENT_STATUS, REQUEST_STATUSES } from "@/constants";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatLabel } from "@/lib/helpers/formet-text";

interface ActivityFiltersProps {
  type: "requests" | "events";
  counts?: {
    all: number;
    interested: number;
    assigned?: number;
    going?: number;
  };
}

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
];

export default function ActivityFilters({
  type,
  counts,
}: ActivityFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isRequest = type === "requests";

  const roleKey = `${isRequest ? "request" : "event"}Role`;
  const statusKey = `${isRequest ? "request" : "event"}Status`;
  const sortKey = `${isRequest ? "request" : "event"}Sort`;
  const pageKey = `${isRequest ? "request" : "event"}Page`;

  const participationOptions = [
    {
      value: "all",
      label: "All",
      count: counts?.all ?? 0,
    },
    {
      value: "interested",
      label: "Interested",
      count: counts?.interested ?? 0,
    },
    isRequest
      ? {
          value: "assigned",
          label: "Assigned",
          count: counts?.assigned ?? 0,
        }
      : {
          value: "going",
          label: "Going",
          count: counts?.going ?? 0,
        },
  ];
  const statuses = isRequest ? REQUEST_STATUSES : EVENT_STATUS;

  const role = searchParams.get(roleKey) || "all";
  const status = searchParams.get(statusKey) || "all";
  const sort = searchParams.get(sortKey) || "newest";

  const updateParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === "all" || (key === sortKey && value === "newest")) {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    params.delete(pageKey);

    const query = params.toString();

    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };

  const handleReset = () => {
    const params = new URLSearchParams(searchParams.toString());

    params.delete(roleKey);
    params.delete(statusKey);
    params.delete(sortKey);
    params.delete(pageKey);

    const query = params.toString();

    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };

  const hasActiveFilters =
    role !== "all" || status !== "all" || sort !== "newest";

  const triggerClass =
    "h-8 gap-1.5 cursor-pointer rounded-lg border-border bg-app-card px-2.5 text-xs font-medium text-app-foreground shadow-none transition-all duration-200 hover:border-app-primary/30 hover:bg-app-background focus-visible:ring-2 focus-visible:ring-app-primary/20";

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Participation filters */}
      <div className="flex flex-wrap items-center gap-1.5">
        {participationOptions.map((option) => {
          const isActive = role === option.value;

          return (
            <Button
              key={option.value}
              type="button"
              size="sm"
              variant="outline"
              onClick={() => updateParams(roleKey, option.value)}
              className={`h-8 cursor-pointer gap-1.5 rounded-full px-3 text-xs font-medium shadow-none transition-all duration-200 ${
                isActive
                  ? "border-app-primary/30 bg-app-primary/10 text-app-primary hover:border-app-primary/40 hover:bg-app-primary/15 hover:text-app-primary"
                  : "border-border bg-app-card text-muted-foreground hover:border-app-primary/25 hover:bg-app-background hover:text-app-foreground"
              }`}
            >
              {option.value !== "all" && (
                <span
                  className={`size-1.5 shrink-0 rounded-full ${
                    option.value === "assigned" || option.value === "going"
                      ? "bg-emerald-500"
                      : "bg-app-primary"
                  }`}
                />
              )}
              {option.label} ({option.count})
            </Button>
          );
        })}
      </div>

      {/* Sort, Status and Reset */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Sort */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className={triggerClass}
            >
              <ArrowDownUp className="size-3.5 text-muted-foreground" />
              {SORT_OPTIONS.find((option) => option.value === sort)?.label ??
                "Newest"}
              <ChevronDown className="size-3.5 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="min-w-36 bg-app-background"
          >
            <DropdownMenuRadioGroup
              value={sort}
              onValueChange={(value) => updateParams(sortKey, value)}
            >
              {SORT_OPTIONS.map((option) => (
                <DropdownMenuRadioItem
                  key={option.value}
                  value={option.value}
                  className="cursor-pointer text-sm"
                >
                  {option.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Status */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className={`${triggerClass} ${
                status !== "all"
                  ? "border-app-primary/30 bg-app-primary/10 text-app-primary hover:bg-app-primary/15 hover:text-app-primary"
                  : ""
              }`}
            >
              {status === "all" ? "Status" : formatLabel(status)}
              <ChevronDown className="size-3.5 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="min-w-40 bg-app-background"
          >
            <DropdownMenuRadioGroup
              value={status}
              onValueChange={(value) => updateParams(statusKey, value)}
            >
              <DropdownMenuRadioItem
                value="all"
                className="cursor-pointer text-sm "
              >
                All Statuses
              </DropdownMenuRadioItem>

              {statuses.map((item) => (
                <DropdownMenuRadioItem
                  key={item}
                  value={item}
                  className="cursor-pointer text-sm"
                >
                  {formatLabel(item)}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Reset */}
        <Button
          type="button"
          variant="outline"
          onClick={handleReset}
          disabled={!hasActiveFilters}
          className="h-8 cursor-pointer gap-1.5 rounded-lg border-border px-2.5 text-xs font-medium text-muted-foreground shadow-none transition-all duration-200 hover:border-app-primary/25 hover:bg-app-background hover:text-app-primary disabled:pointer-events-none disabled:opacity-40"
        >
          <RotateCcw className="size-3.5 shrink-0" />
          Reset
        </Button>
      </div>
    </div>
  );
}
