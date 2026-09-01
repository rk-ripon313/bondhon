"use client";

import { updateUserField } from "@/app/actions/profile/update-user.action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { debounce } from "@/lib/helpers/debounce";
import { getErrorMessage } from "@/lib/helpers/error";
import { findMe } from "@/lib/location/find-me";
import { searchLocations } from "@/lib/location/search-location";
import {
  LocationInput,
  locationSchema,
} from "@/lib/validations/shared/location.schema";
import { LocationOption } from "@/types/location.type";
import { UserProfile } from "@/types/user.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Lock, Navigation, Search, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface LocationTabProps {
  user: UserProfile;
  onSuccess: () => void;
}

export default function LocationTab({ user, onSuccess }: LocationTabProps) {
  // Initial Display Value (Area, District) for Search Input
  const initialSearchText =
    user.location?.area && user.location?.district
      ? `${user.location.area}, ${user.location.district}`
      : "";

  const [query, setQuery] = useState(initialSearchText);
  const [suggestions, setSuggestions] = useState<LocationOption[]>([]);

  const [isSearching, setIsSearching] = useState(false);
  const [isFindingMe, setIsFindingMe] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<LocationInput>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      district: user.location?.district ?? "",
      area: user.location?.area ?? "",
      address: user.location?.address ?? "",
      coordinates: {
        type: "Point",
        coordinates: user.location?.coordinates?.coordinates ?? [0, 0],
      },
    },
  });

  const area = watch("area");
  const district = watch("district");

  const hasSelectedLocation = !!area && !!district;

  const clearLocation = () => {
    setValue("area", "", {
      shouldDirty: true,
      shouldValidate: false,
    });

    setValue("district", "", {
      shouldDirty: true,
      shouldValidate: false,
    });

    setValue(
      "coordinates",
      {
        type: "Point",
        coordinates: [0, 0],
      },
      {
        shouldDirty: true,
        shouldValidate: false,
      },
    );
    setQuery("");
  };

  // Select Location
  const selectLocation = (location: LocationOption) => {
    setValue("area", location.area, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue("district", location.district, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue(
      "coordinates",
      {
        type: "Point",
        coordinates: location.coordinates.coordinates,
      },
      {
        shouldDirty: true,
        shouldValidate: true,
      },
    );

    setQuery(`${location.area}, ${location.district}`);
    setSuggestions([]);
  };

  // Debounced Search Function
  const debouncedSearch = debounce(async (value: string) => {
    try {
      setIsSearching(true);

      const data = await searchLocations(value);
      setSuggestions(data);
    } catch (error) {
      console.error("Location search failed:", error);
      setSuggestions([]);
      toast.error(getErrorMessage(error, "Error searching locations."));
    } finally {
      setIsSearching(false);
    }
  }, 300);

  // GPS Location Handler
  const handleFindMe = async () => {
    try {
      setIsFindingMe(true);
      const location = await findMe();

      if (!location?.area) {
        toast.error("No matching operational area found.");
        return;
      }

      selectLocation(location);
      toast.success("Location locked via GPS!");
    } catch (error) {
      console.error("GPS Location Error:", error);
      toast.error(getErrorMessage(error, "Failed to capture GPS coordinates."));
    } finally {
      setIsFindingMe(false);
    }
  };

  // Submit Handler
  const onSubmit = async (data: LocationInput) => {
    if (!hasSelectedLocation) {
      toast.error("Please select a valid area and district.");
      return;
    }
    try {
      const result = await updateUserField({
        location: data,
      });

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success("Location updated successfully!");
      onSuccess();
    } catch (error) {
      console.error("Update location error:", error);

      toast.error(getErrorMessage(error, "Failed to update location."));
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit, () => {
        toast.error("Please select an operational location before saving.");
      })}
      className="space-y-6"
    >
      {/* Search & Auto-Detect Section */}
      <div className="rounded-xl border border-border/60 bg-gradient-to-br from-muted/40 via-muted/20 to-transparent p-4 sm:p-5 shadow-sm">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-emerald-500" />
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Search & Detect Location
              </h4>
            </div>
          </div>

          <div className="relative flex flex-col gap-2.5 sm:flex-row sm:items-center">
            {/* Search Input Field */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                className="pl-9 pr-9 text-xs sm:text-sm"
                value={query}
                placeholder="Search your area, thana, or district..."
                onChange={(e) => {
                  const value = e.target.value;

                  setQuery(value);

                  if (hasSelectedLocation) clearLocation();

                  if (!value.trim()) {
                    setSuggestions([]);
                    return;
                  }

                  debouncedSearch(value);
                }}
              />

              {isSearching && (
                <Loader2 className="absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-muted-foreground" />
              )}

              {query && !isSearching && (
                <button
                  type="button"
                  onClick={clearLocation}
                  className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-destructive"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>

            {/* GPS Button */}
            <Button
              type="button"
              variant="outline"
              onClick={handleFindMe}
              disabled={isFindingMe}
              className="h-9 shrink-0 gap-1.5 px-3.5 text-xs font-medium cursor-pointer shadow-xs border-dashed border-border/80 hover:border-emerald-500/50 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20"
            >
              {isFindingMe ? (
                <Loader2 className="size-3.5 animate-spin text-emerald-500" />
              ) : (
                <Navigation className="size-3.5 text-emerald-500" />
              )}
              {isFindingMe ? "Detecting..." : "Detect Location"}
            </Button>

            {/* Dropdown Options */}

            {query.trim() && !isSearching && !hasSelectedLocation && (
              <div className="absolute left-0 top-full z-50 mt-1 max-h-56 w-full overflow-y-auto rounded-lg border border-border/60 bg-popover p-1 shadow-lg backdrop-blur-md divide-y divide-border/40">
                {suggestions.length > 0 ? (
                  suggestions.map((item) => (
                    <button
                      key={item._id}
                      type="button"
                      onClick={() => selectLocation(item)}
                      className="block w-full px-4 py-2.5 text-left text-sm hover:bg-muted font-medium text-foreground transition-colors"
                    >
                      <span className="block text-sm text-gray-800">
                        {item.area}
                      </span>
                      <span className="text-xs text-gray-400">
                        {item.district} District
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-sm text-muted-foreground text-center">
                    No locations found for {`"${query}"`}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Selected Details Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Selected Operational Location
            </h3>
            <p className="text-xs text-muted-foreground">
              Area & District are auto-filled from database to ensure
              geo-indexing accuracy.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Readonly District */}
          <div className="space-y-2">
            <Label
              htmlFor="district"
              className="text-xs font-medium flex items-center gap-1.5"
            >
              District
              <Lock className="size-3 text-muted-foreground" />
            </Label>
            <Input
              id="district"
              readOnly
              placeholder="Select from search above"
              {...register("district")}
              className="cursor-not-allowed bg-muted/50 text-xs font-medium text-foreground sm:text-sm"
            />
            {errors.district && (
              <p className="text-[11px] text-destructive">
                {errors.district.message}
              </p>
            )}
          </div>

          {/* Readonly Area */}
          <div className="space-y-2">
            <Label
              htmlFor="area"
              className="text-xs font-medium flex items-center gap-1.5"
            >
              Area / Upazila / Thana
              <Lock className="size-3 text-muted-foreground" />
            </Label>
            <Input
              id="area"
              readOnly
              placeholder="Select from search above"
              {...register("area")}
              className="bg-muted/50 cursor-not-allowed font-medium text-foreground text-xs sm:text-sm"
            />
            {errors?.area && (
              <p className="text-[11px] text-destructive">
                {errors.area.message}
              </p>
            )}
          </div>

          {/* Editable Specific Address */}
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="address" className="text-xs font-medium">
              Specific Address / House & Road No.{" "}
              <span className="text-muted-foreground font-normal">
                (Optional)
              </span>
            </Label>
            <Input
              id="address"
              placeholder="e.g. House/Road, Village, or Local Address"
              className="text-xs sm:text-sm"
              {...register("address")}
            />
            {errors.address && (
              <p className="text-[11px] text-destructive">
                {errors.address.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-end border-t border-border/50 pt-4">
        <Button
          type="submit"
          disabled={isSubmitting || !isDirty}
          className="min-w-32 cursor-pointer px-6 font-semibold"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </form>
  );
}
