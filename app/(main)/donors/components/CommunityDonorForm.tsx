"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, MapPin, Search, X } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BLOOD_GROUPS } from "@/constants";

import { createCommunityDonor } from "@/app/actions/donors/community-donor.action";
import { debounce } from "@/lib/helpers/debounce";
import { getErrorMessage } from "@/lib/helpers/error";
import { findMe } from "@/lib/location/find-me";
import { searchLocations } from "@/lib/location/search-location";
import {
  communityDonorSchema,
  type CommunityDonorFormInput,
} from "@/lib/validations/donors/community-donor.schema";
import type { LocationOption } from "@/types/location.type";
import { useRouter } from "next/navigation";

const EMPTY_LOCATION = {
  area: "",
  district: "",
  address: "",
  coordinates: {
    type: "Point" as const,
    coordinates: [0, 0] as [number, number],
  },
};

interface CommunityDonorFormProps {
  closeOpen: () => void;
}

export default function CommunityDonorForm({
  closeOpen,
}: CommunityDonorFormProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<LocationOption[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isFindingMe, setIsFindingMe] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CommunityDonorFormInput>({
    resolver: zodResolver(communityDonorSchema),
    defaultValues: {
      name: "",
      phone: "",
      bloodGroup: undefined,
      location: EMPTY_LOCATION,
    },
  });

  const location = watch("location");
  const hasSelectedLocation = !!location.area && !!location.district;

  const selectLocation = (item: LocationOption) => {
    setValue(
      "location",
      {
        ...location,
        area: item.area,
        district: item.district,
        coordinates: {
          type: "Point",
          coordinates: item.coordinates.coordinates,
        },
      },
      { shouldValidate: true, shouldDirty: true },
    );

    setQuery(`${item.area}, ${item.district}`);
    setSuggestions([]);
  };

  const clearLocation = () => {
    setValue("location", EMPTY_LOCATION, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setQuery("");
    setSuggestions([]);
  };

  const debouncedSearch = debounce(async (value: string) => {
    try {
      setIsSearching(true);
      setSuggestions(await searchLocations(value));
    } catch (error) {
      setSuggestions([]);
      toast.error(getErrorMessage(error, "Location search failed."));
    } finally {
      setIsSearching(false);
    }
  }, 300);

  const handleFindMe = async () => {
    try {
      setIsFindingMe(true);
      const result = await findMe();

      if (!result?.area) {
        toast.error("No matching location found.");
        return;
      }

      selectLocation(result);
      toast.success("Location detected successfully.");
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not detect your location."));
    } finally {
      setIsFindingMe(false);
    }
  };

  const onSubmit = async (data: CommunityDonorFormInput) => {
    try {
      const result = await createCommunityDonor(data);

      if (!result.success) {
        throw new Error(result.message);
      }

      toast.success(result.message);
      closeOpen();
      router.refresh();
    } catch (error) {
      console.error("Failed to create community donor:", error);
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="custom-scrollbar min-h-0 flex-1 overflow-y-auto p-5"
    >
      <div className="space-y-5">
        {/* Donor details */}
        <section className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="donor-name">Full name</Label>
            <Input
              id="donor-name"
              placeholder="Enter donor's name"
              maxLength={50}
              autoComplete="name"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="donor-phone">Phone number</Label>
              <Input
                id="donor-phone"
                type="tel"
                inputMode="tel"
                placeholder="01XXXXXXXXX"
                autoComplete="tel"
                {...register("phone")}
              />
              {errors.phone && (
                <p className="text-xs text-destructive">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="donor-blood-group">Blood group</Label>
              <Controller
                control={control}
                name="bloodGroup"
                render={({ field }) => (
                  <Select
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger id="donor-blood-group" className="w-full">
                      <SelectValue placeholder="Select group" />
                    </SelectTrigger>
                    <SelectContent className="border-border bg-app-background">
                      {BLOOD_GROUPS.map((group) => (
                        <SelectItem key={group} value={group}>
                          {group}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.bloodGroup && (
                <p className="text-xs text-destructive">
                  {errors.bloodGroup.message}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Location */}
        <section className="space-y-3 rounded-xl border border-border bg-app-background p-3.5 sm:p-4">
          <div className="flex items-start gap-2.5">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <MapPin className="size-4" />
            </div>

            <div className="min-w-0">
              <h3 className="text-sm font-semibold">Donor location</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Search and select a location, or use your current location.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                value={query}
                placeholder="Search area or district..."
                className="h-10 pl-9 pr-9"
                autoComplete="off"
                aria-label="Search donor location"
                aria-invalid={!!errors.location}
                onChange={(event) => {
                  const value = event.target.value;
                  setQuery(value);

                  if (hasSelectedLocation) {
                    setValue("location", EMPTY_LOCATION, {
                      shouldValidate: false,
                      shouldDirty: true,
                    });
                  }

                  if (!value.trim()) {
                    setSuggestions([]);
                    return;
                  }

                  debouncedSearch(value);
                }}
              />

              {isSearching ? (
                <Loader2 className="absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-muted-foreground" />
              ) : query ? (
                <button
                  type="button"
                  onClick={clearLocation}
                  aria-label="Clear location search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-sm text-muted-foreground transition-colors hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <X className="size-4" />
                </button>
              ) : null}
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleFindMe}
              disabled={isFindingMe}
              className="h-10 shrink-0 gap-2 cursor-pointer border-emerald-600/30 hover:bg-emerald-500/10 hover:text-emerald-700 dark:hover:text-emerald-400"
            >
              {isFindingMe ? (
                <Loader2 className="size-4 animate-spin text-emerald-600" />
              ) : (
                <MapPin className="size-4 text-emerald-600" />
              )}
              {isFindingMe ? "Finding..." : "Near me"}
            </Button>
          </div>

          {/* Location suggestions */}
          {query.trim() && !isSearching && !hasSelectedLocation && (
            <div className="custom-scrollbar max-h-48 overflow-y-auto rounded-lg border border-border bg-app-card shadow-sm">
              {suggestions.length > 0 ? (
                suggestions.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => selectLocation(item)}
                    className="flex w-full flex-col gap-0.5 border-b border-border/60 px-3 py-2.5 text-left transition-colors last:border-0 hover:bg-app-muted focus-visible:bg-app-muted focus-visible:outline-none"
                  >
                    <span className="text-sm font-medium">{item.area}</span>
                    <span className="text-xs text-muted-foreground">
                      {item.district} District
                    </span>
                  </button>
                ))
              ) : (
                <p className="px-3 py-4 text-center text-xs text-muted-foreground">
                  No matching locations found.
                </p>
              )}
            </div>
          )}

          {/* Selected location */}
          {hasSelectedLocation && (
            <div className="flex items-center gap-2 rounded-lg border border-emerald-500/25 bg-emerald-500/5 px-3 py-2.5">
              <MapPin className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />

              <p className="min-w-0 flex-1 text-sm font-medium">
                {location.area}, {location.district}
              </p>

              <span className="shrink-0 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                Selected
              </span>
            </div>
          )}

          {errors.location && (
            <p className="text-xs text-destructive">
              Please select a valid location from the suggestions.
            </p>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="donor-address">
              Specific address{" "}
              <span className="font-normal text-muted-foreground">
                (Optional)
              </span>
            </Label>

            <Input
              id="donor-address"
              placeholder="Village, road, area or landmark"
              maxLength={200}
              autoComplete="street-address"
              {...register("location.address")}
            />

            {errors.location?.address && (
              <p className="text-xs text-destructive">
                {errors.location.address.message}
              </p>
            )}
          </div>
        </section>
      </div>

      {/* Submit */}
      <div className="mt-5 flex justify-end border-t border-border pt-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-10 w-full gap-2 cursor-pointer bg-emerald-600 text-white hover:bg-emerald-700 sm:w-auto"
        >
          {isSubmitting && <Loader2 className="size-4 animate-spin" />}
          {isSubmitting ? "Adding donor..." : "Add donor"}
        </Button>
      </div>
    </form>
  );
}
