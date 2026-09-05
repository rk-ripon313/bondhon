"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { BLOOD_GROUPS, REQUEST_URGENCY } from "@/constants";
import {
  BloodRequestFormInput,
  bloodRequestSchema,
} from "@/lib/validations/blood-request/blood-request.schema";

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

import { createBloodRequest } from "@/app/actions/blood-request/create-request.action";
import { debounce } from "@/lib/helpers/debounce";
import { getErrorMessage } from "@/lib/helpers/error";
import { findMe } from "@/lib/location/find-me";
import { searchLocations } from "@/lib/location/search-location";
import { LocationOption } from "@/types/location.type";
import { Loader2, Navigation, Search, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface BloodRequestFormProps {
  mode?: "create" | "edit";
  request?: BloodRequestFormInput;
  onOpenChange: (open: boolean) => void;
}

export default function BloodRequestForm({
  mode = "create",
  request,
  onOpenChange,
}: BloodRequestFormProps) {
  //state for location search query and suggestions
  const [query, setQuery] = useState(
    request?.location?.area && request?.location?.district
      ? `${request.location.area}, ${request.location.district}`
      : "",
  );
  const [suggestions, setSuggestions] = useState<LocationOption[]>([]);

  const [isSearching, setIsSearching] = useState(false);
  const [isFindingMe, setIsFindingMe] = useState(false);

  // react-hook-form setup
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<BloodRequestFormInput>({
    resolver: zodResolver(bloodRequestSchema),

    defaultValues: {
      bloodGroupNeeded: request?.bloodGroupNeeded ?? undefined,
      quantity: request?.quantity ?? 1,
      urgency: request?.urgency ?? "normal",

      hospitalName: request?.hospitalName ?? "",

      location: {
        district: request?.location?.district ?? "",
        area: request?.location?.area ?? "",
        address: request?.location?.address ?? "",
        coordinates: {
          type: "Point",
          coordinates: request?.location?.coordinates?.coordinates ?? [0, 0],
        },
      },

      neededBefore: request?.neededBefore
        ? new Date(request.neededBefore).toISOString().slice(0, 16)
        : "",

      contactNumber: request?.contactNumber ?? "",
      additionalNotes: request?.additionalNotes ?? "",
    },
  });

  const isEditMode = mode === "edit";

  const currentLocation = watch("location");
  const hasSelectedLocation =
    !!currentLocation.area && !!currentLocation.district;

  // function to clear the selected location and reset the query
  const clearLocation = () => {
    setValue("location.area", "", {
      shouldDirty: true,
      shouldValidate: false,
    });

    setValue("location.district", "", {
      shouldDirty: true,
      shouldValidate: false,
    });

    setValue(
      "location.coordinates",
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

  // function to set the selected location and update the form values
  const selectLocation = (location: LocationOption) => {
    setValue("location.area", location.area, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue("location.district", location.district, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue(
      "location.coordinates",
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

  // Debounced function to search for locations based on user input

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

  // function to handle the "Find Me" button click, which uses GPS to find the user's location
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

  const onSubmit = async (data: BloodRequestFormInput) => {
    try {
      const result = await createBloodRequest(data);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      onOpenChange(false);
    } catch (error) {
      console.error("Register Error:", error);

      toast.error(getErrorMessage(error));
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex min-h-0 flex-1 flex-col"
    >
      {/* Form Content */}
      <div className="flex-1 space-y-7 overflow-y-auto p-6 custom-scrollbar">
        <section className="space-y-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Blood Details
          </h4>

          <div className="grid gap-4 sm:grid-cols-3">
            {/* Blood Group */}
            <div className="space-y-2">
              <Label className="text-xs font-medium">Blood Group</Label>
              <Controller
                name="bloodGroupNeeded"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="h-10 w-full text-sm">
                      <SelectValue placeholder="Select blood group" />
                    </SelectTrigger>
                    <SelectContent>
                      {BLOOD_GROUPS.map((group) => (
                        <SelectItem key={group} value={group}>
                          {group}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.bloodGroupNeeded && (
                <p className="text-[11px] text-destructive">
                  {errors.bloodGroupNeeded.message}
                </p>
              )}
            </div>

            {/* Quantity */}
            <div className="space-y-2">
              <Label htmlFor="quantity" className="text-xs font-medium">
                Bags Needed <span className="text-rose-500">*</span>
              </Label>

              <Input
                id="quantity"
                type="number"
                min={1}
                {...register("quantity", {
                  valueAsNumber: true,
                })}
                className="h-10 w-full text-sm"
              />

              {errors.quantity && (
                <p className="text-[11px] text-destructive">
                  {errors.quantity.message}
                </p>
              )}
            </div>

            {/* Urgency */}
            <div className="space-y-2">
              <Label className="text-xs font-medium">Urgency</Label>

              <Controller
                name="urgency"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="h-10 w-full text-sm">
                      <SelectValue placeholder="Select urgency" />
                    </SelectTrigger>

                    <SelectContent>
                      {REQUEST_URGENCY.map((item) => (
                        <SelectItem key={item} value={item}>
                          <span className="capitalize">{item}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />

              {errors.urgency && (
                <p className="text-[11px] text-destructive">
                  {errors.urgency.message}
                </p>
              )}
            </div>
          </div>
        </section>

        <section className="space-y-4 border-t border-border/50 pt-6">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Hospital & Location
          </h4>

          {/* Hospital */}
          <div className="space-y-2">
            <Label htmlFor="hospitalName" className="text-xs font-medium">
              Hospital / Medical Center{" "}
              <span className="font-normal text-muted-foreground">
                (Optional)
              </span>
            </Label>

            <Input
              id="hospitalName"
              placeholder="e.g. Sylhet MAG Osmani Medical College"
              {...register("hospitalName")}
              className="h-10 w-full text-sm"
            />

            {errors.hospitalName && (
              <p className="text-[11px] text-destructive">
                {errors.hospitalName.message}
              </p>
            )}
          </div>

          {/* Location */}
          <div className="space-y-2 relative">
            <Label className="text-xs font-medium">
              Location <span className="text-rose-500">*</span>
            </Label>

            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  placeholder="Search area, thana, or district..."
                  className="h-10 w-full pl-9 text-sm"
                  value={query}
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

              <Button
                type="button"
                variant="outline"
                className="h-10 shrink-0 gap-1.5 text-xs"
                onClick={handleFindMe}
                disabled={isFindingMe}
              >
                {isFindingMe ? (
                  <Loader2 className="size-3.5 animate-spin text-emerald-500" />
                ) : (
                  <Navigation className="size-3.5 text-emerald-500" />
                )}
                {isFindingMe ? "Detecting..." : "Detect By GPS"}
              </Button>
            </div>
            {/* dropdown */}
            {query.trim() && !isSearching && !hasSelectedLocation && (
              <div className="absolute left-0 top-full z-50 mt-1 max-h-56 w-full overflow-y-auto custom-scrollbar rounded-lg border border-border/60 bg-popover p-1 shadow-lg backdrop-blur-md divide-y divide-border/40">
                {suggestions.length > 0 ? (
                  suggestions.map((item) => (
                    <button
                      key={item.id}
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

          {/* Specific Address */}
          <div className="space-y-2">
            <Label htmlFor="address" className="text-xs font-medium">
              Specific Address{" "}
              <span className="font-normal text-muted-foreground">
                (Optional)
              </span>
            </Label>

            <Input
              id="address"
              placeholder="e.g. Building 3, Ward 5, Bed No. 402"
              {...register("location.address")}
              className="h-10 w-full text-sm"
            />

            {errors.location?.address && (
              <p className="text-[11px] text-destructive">
                {errors.location.address.message}
              </p>
            )}
          </div>
        </section>

        <section className="space-y-4 border-t border-border/50 pt-6">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Request Details
          </h4>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Needed Before */}
            <div className="space-y-2">
              <Label htmlFor="neededBefore" className="text-xs font-medium">
                Needed Before <span className="text-rose-500">*</span>
              </Label>

              <Input
                id="neededBefore"
                type="datetime-local"
                {...register("neededBefore")}
                className="h-10 w-full text-sm"
              />

              {errors.neededBefore && (
                <p className="text-[11px] text-destructive">
                  {errors.neededBefore.message}
                </p>
              )}
            </div>

            {/* Contact Number */}
            <div className="space-y-2">
              <Label htmlFor="contactNumber" className="text-xs font-medium">
                Contact Number <span className="text-rose-500">*</span>
              </Label>

              <Input
                id="contactNumber"
                type="tel"
                placeholder="017XXXXXXXX"
                {...register("contactNumber")}
                className="h-10 w-full text-sm"
              />

              {errors.contactNumber && (
                <p className="text-[11px] text-destructive">
                  {errors.contactNumber.message}
                </p>
              )}
            </div>
          </div>

          {/* Additional Notes */}
          <div className="space-y-2">
            <Label htmlFor="additionalNotes" className="text-xs font-medium">
              Additional Notes{" "}
              <span className="font-normal text-muted-foreground">
                (Optional)
              </span>
            </Label>

            <textarea
              id="additionalNotes"
              {...register("additionalNotes")}
              placeholder="Mention patient's situation, transfusion requirements, or alternative contact..."
              className="min-h-20 w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
            />

            {errors.additionalNotes && (
              <p className="text-[11px] text-destructive">
                {errors.additionalNotes.message}
              </p>
            )}
          </div>
        </section>
      </div>

      {/* ACTIONS */}

      <div className="flex shrink-0 items-center justify-end gap-3 border-t border-border/50 px-6 py-4">
        <Button
          type="button"
          variant="ghost"
          onClick={() => onOpenChange(false)}
          className="bg-app-background text-xs text-muted-foreground hover:text-foreground"
        >
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={isSubmitting || !isDirty}
          className="min-w-32 bg-rose-600 px-6 text-xs font-semibold text-white shadow-md shadow-rose-600/20 hover:bg-rose-700"
        >
          {isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          {isEditMode ? "Update Request" : "Post Request"}
        </Button>
      </div>
    </form>
  );
}
