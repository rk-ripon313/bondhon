"use client";

import { ArrowDownUp, Filter } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ActivitySortFilterProps = {
  filterOptions: readonly string[];
  defaultSort?: string;
  defaultFilter?: string;
};

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
];

export default function ActivitySortFilter({
  filterOptions,
  defaultSort = "newest",
  defaultFilter = "all",
}: ActivitySortFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const sort = searchParams.get("sort") || defaultSort;
  const filter = searchParams.get("status") || defaultFilter;

  const allFilterOptions = ["all", ...filterOptions];

  const formatLabel = (value: string) =>
    value.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

  const updateParams = (key: "sort" | "status", value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (key === "status" && value === "all") {
      params.delete("status");
    } else {
      params.set(key, value);
    }

    params.delete("page");

    const query = params.toString();

    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };

  return (
    <div className="flex items-center gap-2">
      {/* Sort */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 rounded-lg border-border bg-app-background px-2.5 text-xs font-medium hover:bg-muted"
          >
            <ArrowDownUp className="size-3.5 text-muted-foreground" />

            <span className="hidden sm:inline">{formatLabel(sort)}</span>

            <span className="sr-only">Sort</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-36 border-border bg-app-card"
        >
          <DropdownMenuRadioGroup
            value={sort}
            onValueChange={(value) => updateParams("sort", value)}
          >
            {SORT_OPTIONS.map((option) => (
              <DropdownMenuRadioItem
                key={option.value}
                value={option.value}
                className="cursor-pointer rounded-md"
              >
                {option.label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 rounded-lg border-border bg-app-background px-2.5 text-xs font-medium hover:bg-muted"
          >
            <Filter className="size-3.5 text-muted-foreground" />

            <span className="hidden sm:inline">{formatLabel(filter)}</span>

            <span className="sr-only">Filter</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-36 border-border bg-app-card"
        >
          <DropdownMenuRadioGroup
            value={filter}
            onValueChange={(value) => updateParams("status", value)}
          >
            {allFilterOptions.map((option) => (
              <DropdownMenuRadioItem
                key={option}
                value={option}
                className="cursor-pointer rounded-md"
              >
                {formatLabel(option)}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
