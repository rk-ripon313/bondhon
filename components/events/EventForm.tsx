"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import imageCompression from "browser-image-compression";
import {
  CalendarDays,
  ImagePlus,
  Loader2,
  MapPin,
  Navigation,
  Plus,
  Search,
  Tag,
  X,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
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
import { EVENT_CATEGORIES } from "@/constants";

import { createEvent } from "@/app/actions/event/event.action";
import { uploadFileToCloudinary } from "@/lib/helpers/cloudinary-upload";
import { debounce } from "@/lib/helpers/debounce";
import { getErrorMessage } from "@/lib/helpers/error";
import { findMe } from "@/lib/location/find-me";
import { searchLocations } from "@/lib/location/search-location";
import {
  EventFormInput,
  eventSchema,
} from "@/lib/validations/event/event.schema";
import { LocationOption } from "@/types/location.type";

interface EventFormProps {
  onOpenChange: (open: boolean) => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function EventForm({ onOpenChange }: EventFormProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<LocationOption[]>([]);

  const [isSearching, setIsSearching] = useState(false);
  const [isFindingMe, setIsFindingMe] = useState(false);

  const [tagInput, setTagInput] = useState("");

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<EventFormInput>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      description: "",
      category: undefined,
      tags: [],
      eventDate: "",
      thumbnail: "",
      location: {
        area: "",
        district: "",
        address: "",
        coordinates: {
          type: "Point",
          coordinates: [0, 0],
        },
      },
    },
  });

  const tags = watch("tags") ?? [];
  const currentLocation = watch("location");
  const hasSelectedLocation =
    !!currentLocation.area && !!currentLocation.district;

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
      { shouldDirty: true, shouldValidate: true },
    );

    setQuery(`${location.area}, ${location.district}`);
    setSuggestions([]);
  };

  const debouncedSearch = debounce(async (value: string) => {
    try {
      setIsSearching(true);
      const results = await searchLocations(value);
      setSuggestions(results);
    } catch (error) {
      console.error("Event location search failed:", error);
      setSuggestions([]);
      toast.error(getErrorMessage(error, "Unable to search locations."));
    } finally {
      setIsSearching(false);
    }
  }, 300);

  const handleLocationChange = (value: string) => {
    setQuery(value);

    if (hasSelectedLocation) {
      setValue("location.area", "", { shouldDirty: true });
      setValue("location.district", "", { shouldDirty: true });
      setValue(
        "location.coordinates",
        { type: "Point", coordinates: [0, 0] },
        { shouldDirty: true },
      );
    }

    if (!value.trim()) {
      setSuggestions([]);
      return;
    }

    debouncedSearch(value);
  };

  const handleFindMe = async () => {
    try {
      setIsFindingMe(true);
      const location = await findMe();

      if (!location?.area) {
        toast.error("No matching operational area found.");
        return;
      }

      selectLocation(location);
      toast.success("Location detected successfully.");
    } catch (error) {
      console.error("Event GPS location error:", error);
      toast.error(getErrorMessage(error, "Unable to detect your location."));
    } finally {
      setIsFindingMe(false);
    }
  };

  const addTag = () => {
    const tag = tagInput.trim().replace(/^#/, "");

    if (!tag) return;

    if (tags.length >= 10) {
      toast.error("You can add up to 10 tags.");
      return;
    }

    if (tag.length > 30) {
      toast.error("Each tag must be 30 characters or less.");
      return;
    }

    if (tags.some((item) => item.toLowerCase() === tag.toLowerCase())) {
      toast.error("This tag has already been added.");
      return;
    }

    setValue("tags", [...tags, tag], {
      shouldDirty: true,
      shouldValidate: true,
    });
    setTagInput("");
  };

  const removeTag = (tagToRemove: string) => {
    setValue(
      "tags",
      tags.filter((tag) => tag !== tagToRemove),
      { shouldDirty: true, shouldValidate: true },
    );
  };

  const onSubmit = async (data: EventFormInput) => {
    try {
      let thumbnail: string | undefined;

      if (coverFile) {
        //  Compress image
        const compressedFile = await imageCompression(coverFile, {
          maxSizeMB: 1,
          useWebWorker: true,
        });

        //  Upload to Cloudinary
        const uploadedThumbnail = await uploadFileToCloudinary({
          files: compressedFile,
          fileType: "image",
          subFolder: "Events",
        });

        thumbnail = Array.isArray(uploadedThumbnail)
          ? uploadedThumbnail[0]
          : uploadedThumbnail;

        if (!thumbnail) {
          throw new Error("Image upload failed.");
        }
      }
      const result = await createEvent({ ...data, thumbnail });

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      onOpenChange(false);
    } catch (error) {
      console.error("Event  Error", error);
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex min-h-0 flex-1 flex-col overflow-hidden"
    >
      <div className="min-h-0 flex-1 space-y-7 overflow-x-hidden overflow-y-auto p-4 custom-scrollbar sm:p-6">
        {/* Event Details */}
        <section className="space-y-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Event Details
          </h4>

          <div className="space-y-2">
            <Label htmlFor="title" className="text-xs font-medium">
              Event Title <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="title"
              placeholder="e.g. Community Blood Donation Camp"
              {...register("title")}
              className="h-10 text-sm"
            />
            {errors.title && (
              <p className="text-[11px] text-destructive">
                {errors.title.message}
              </p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="category" className="text-xs font-medium">
                Category <span className="text-rose-500">*</span>
              </Label>

              <Select
                value={watch("category") || ""}
                onValueChange={(value) =>
                  setValue("category", value as EventFormInput["category"], {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger id="category" className="h-10 w-full text-sm">
                  <SelectValue placeholder="Choose a category" />
                </SelectTrigger>
                <SelectContent className="bg-app-background">
                  {EVENT_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category
                        .split("-")
                        .map(
                          (word) =>
                            word.charAt(0).toUpperCase() + word.slice(1),
                        )
                        .join(" ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {errors.category && (
                <p className="text-[11px] text-destructive">
                  {errors.category.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="eventDate" className="text-xs font-medium">
                Date & Time <span className="text-rose-500">*</span>
              </Label>
              <div className="relative">
                <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="eventDate"
                  type="datetime-local"
                  {...register("eventDate")}
                  className="h-10 w-full pl-9 text-sm"
                />
              </div>
              {errors.eventDate && (
                <p className="text-[11px] text-destructive">
                  {errors.eventDate.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-xs font-medium">
              Description{" "}
              <span className="font-normal text-muted-foreground">
                (Optional)
              </span>
            </Label>
            <textarea
              id="description"
              rows={4}
              placeholder="Tell people what the event is about, who can join, and what to expect..."
              {...register("description")}
              className="w-full resize-y rounded-md border border-input bg-app-background px-3 py-2.5 text-sm outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
            />
            <div className="flex justify-between gap-2">
              {errors.description ? (
                <p className="text-[11px] text-destructive">
                  {errors.description.message}
                </p>
              ) : (
                <span />
              )}
              <span className="text-[11px] text-muted-foreground">
                {(watch("description") ?? "").length}/2000
              </span>
            </div>
          </div>
        </section>

        {/* Cover Image */}
        <section className="space-y-4 border-t border-border/50 pt-6">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Cover Image
            <span className="ml-2 font-normal normal-case tracking-normal">
              (Optional)
            </span>
          </h4>

          <label
            htmlFor="event-thumbnail"
            className="group flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-border bg-app-background/60 transition hover:border-emerald-500/60 hover:bg-emerald-500/[0.03]"
          >
            {coverPreview ? (
              <div className="relative w-full h-44 object-cover sm:h-52">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={coverPreview}
                  alt="Selected event cover preview"
                  className="h-44 w-full object-cover sm:h-52"
                />
                <span className="absolute bottom-3 right-3 rounded-full bg-black/65 px-3 py-1.5 text-xs font-medium text-white">
                  Change image
                </span>
              </div>
            ) : (
              <div className="flex w-full flex-col items-center px-4 py-8 text-center">
                <span className="mb-3 flex size-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 transition group-hover:scale-105">
                  <ImagePlus className="size-5" />
                </span>
                <span className="text-sm font-medium text-foreground">
                  Choose an event cover
                </span>
                <span className="mt-1 text-xs text-muted-foreground">
                  Select an image from your device
                </span>
                <span className="mt-3 text-[11px] text-muted-foreground">
                  JPG, PNG or WebP
                </span>
              </div>
            )}
          </label>

          <input
            id="event-thumbnail"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file) return;

              if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
                toast.error("Please select a JPG, PNG, or WebP image.");
                return;
              }

              if (file.size > MAX_FILE_SIZE) {
                toast.error("Image size must be smaller than 5MB.");
                return;
              }

              const imageUrl = URL.createObjectURL(file);

              setCoverPreview(imageUrl);
            }}
          />

          {coverFile && (
            <div className="flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-app-background px-3 py-2">
              <p className="min-w-0 truncate text-xs text-muted-foreground">
                {coverFile.name}
              </p>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setCoverFile(null)}
                className="size-8 shrink-0 text-muted-foreground hover:text-destructive"
                aria-label="Remove cover image"
              >
                <X className="size-4" />
              </Button>
            </div>
          )}
        </section>

        {/* Location */}
        <section className="space-y-4 border-t border-border/50 pt-6">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Event Location
          </h4>

          <div className="relative space-y-2">
            <Label htmlFor="event-location" className="text-xs font-medium">
              Area / District <span className="text-rose-500">*</span>
            </Label>

            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative min-w-0 flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="event-location"
                  value={query}
                  disabled={isFindingMe}
                  onChange={(event) => handleLocationChange(event.target.value)}
                  placeholder={
                    isFindingMe
                      ? "Finding by Gps.."
                      : "Search area, thana, or district..."
                  }
                  className="h-10 w-full pl-9 pr-9 text-sm"
                  autoComplete="off"
                />

                {isSearching ? (
                  <Loader2 className="absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-muted-foreground" />
                ) : query ? (
                  <button
                    type="button"
                    onClick={() => {
                      setValue("location.area", "", { shouldDirty: true });
                      setValue("location.district", "", { shouldDirty: true });
                      setValue(
                        "location.coordinates",
                        { type: "Point", coordinates: [0, 0] },
                        { shouldDirty: true },
                      );
                      setQuery("");
                      setSuggestions([]);
                    }}
                    aria-label="Clear location"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-destructive"
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
                className="h-10 shrink-0 gap-2 text-xs cursor-pointer"
              >
                {isFindingMe ? (
                  <Loader2 className="size-3.5 animate-spin text-emerald-500" />
                ) : (
                  <Navigation className="size-3.5 text-emerald-500" />
                )}
                {isFindingMe ? "Detecting..." : "Detect by GPS"}
              </Button>
            </div>

            {query.trim() &&
              !isFindingMe &&
              !isSearching &&
              !hasSelectedLocation && (
                <div className="absolute left-0 top-full z-50 mt-1 max-h-52 w-full overflow-y-auto custom-scrollbar rounded-lg border border-border bg-app-background p-1 shadow-xl">
                  {suggestions.length > 0 ? (
                    suggestions.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => selectLocation(item)}
                        className="flex w-full items-start gap-3 rounded-md px-3 py-2.5 text-left transition hover:bg-app-accent"
                      >
                        <MapPin className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                        <span className="min-w-0">
                          <span className="block text-sm font-medium text-foreground">
                            {item.area}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {item.district} District
                          </span>
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

            {hasSelectedLocation && (
              <p className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
                <MapPin className="size-3.5" />
                {currentLocation.area}, {currentLocation.district}
              </p>
            )}

            {errors.location?.area && (
              <p className="text-[11px] text-destructive">
                {errors.location.area.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="text-xs font-medium">
              Specific Address{" "}
              <span className="font-normal text-muted-foreground">
                (Optional)
              </span>
            </Label>
            <Input
              id="address"
              placeholder="Venue name, road, building, or landmark"
              {...register("location.address")}
              className="h-10 text-sm"
            />
            {errors.location?.address && (
              <p className="text-[11px] text-destructive">
                {errors.location.address.message}
              </p>
            )}
          </div>
        </section>

        {/* Tags */}
        <section className="space-y-4 border-t border-border/50 pt-6">
          <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Tag className="size-3.5" />
            Event Tags
            <span className="font-normal normal-case tracking-normal">
              (Optional)
            </span>
          </h4>

          <div className="flex gap-2">
            <Input
              value={tagInput}
              onChange={(event) => setTagInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  addTag();
                }
              }}
              placeholder="e.g. blood-donation, volunteering"
              className="h-10 min-w-0 text-sm"
            />
            <Button
              type="button"
              variant="outline"
              onClick={addTag}
              disabled={!tagInput.trim() || tags.length >= 10}
              className="h-10 shrink-0 gap-1.5"
            >
              <Plus className="size-4" />
              Add
            </Button>
          </div>

          {tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 py-1 pl-3 pr-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-300"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    aria-label={`Remove ${tag}`}
                    className="rounded-full p-0.5 transition hover:bg-emerald-500/15"
                  >
                    <X className="size-3.5" />
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">
              Add relevant tags to help people discover your event. Up to 10
              tags.
            </p>
          )}

          {errors.tags && (
            <p className="text-[11px] text-destructive">
              {errors.tags.message}
            </p>
          )}
        </section>
      </div>

      {/* Footer Actions */}
      <div className="flex shrink-0 items-center justify-end gap-2 border-t border-border/50 bg-app-card px-4 py-3 sm:gap-3 sm:px-6 sm:py-4">
        <Button
          type="button"
          variant="ghost"
          onClick={() => onOpenChange(false)}
          className="bg-app-background text-xs text-muted-foreground hover:text-foreground cursor-pointer"
        >
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={isSubmitting || !isDirty}
          className="min-w-32 cursor-pointer bg-emerald-600 text-xs font-semibold text-white shadow-sm shadow-emerald-600/20 hover:bg-emerald-700"
        >
          {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
          Create Event
        </Button>
      </div>
    </form>
  );
}
