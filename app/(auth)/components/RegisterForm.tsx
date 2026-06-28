"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, MapPin, X } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

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

import { BLOOD_GROUPS, GENDERS } from "@/constants";
import { debounce } from "@/lib/helpers/debounce";
import { getErrorMessage } from "@/lib/helpers/error";
import { findMe } from "@/lib/location/find-me";
import { searchLocations } from "@/lib/location/search-location";
import {
  registerSchema,
  type RegisterFormInput,
  type RegisterInput,
} from "@/lib/validations/auth/register.schema";

interface LocationOption {
  _id: string;
  area: string;
  district: string;
  coordinates: {
    type: "Point";
    coordinates: number[];
  };
}

const EMPTY_LOCATION = {
  area: "",
  district: "",
  coordinates: {
    type: "Point" as const,
    coordinates: [0, 0] as [number, number],
  },
};

export default function RegisterForm() {
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<LocationOption[]>([]);

  const [isSearching, setIsSearching] = useState(false);
  const [isFindingMe, setIsFindingMe] = useState(false);
  const [isLockedByGps, setIsLockedByGps] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      nickname: "",
      email: "",
      phone: "",
      bloodGroup: undefined,
      gender: undefined,
      dob: "",
      location: EMPTY_LOCATION,
      password: "",
      confirmPassword: "",
      isAvailableForDonate: false,
      acceptTerms: false,
    },
  });

  const currentLocation = watch("location");

  const hasSelectedLocation =
    !!currentLocation.area && !!currentLocation.district;

  const resetLocation = () => {
    setValue("location", EMPTY_LOCATION, {
      shouldValidate: true,
    });
  };

  const setFormLocation = (location: LocationOption) => {
    setValue(
      "location",
      {
        area: location.area,
        district: location.district,
        coordinates: {
          type: "Point",
          coordinates: location.coordinates.coordinates,
        },
      },
      {
        shouldValidate: true,
      },
    );
  };

  const clearLocationSelection = () => {
    setIsLockedByGps(false);
    setQuery("");
    setSuggestions([]);

    resetLocation();
  };

  const selectLocation = (location: LocationOption) => {
    setFormLocation(location);
    setQuery(`${location.area}, ${location.district}`);
    setSuggestions([]);
  };

  // Search fn...

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

  // GPS..

  const handleFindMe = async () => {
    try {
      setIsFindingMe(true);
      const location = await findMe();

      if (!location?.area) {
        toast.error("No matching operational area found.");
        return;
      }

      selectLocation(location);
      setIsLockedByGps(true);
      toast.success("Location locked via GPS!");
    } catch (error) {
      console.error("GPS Location Error:", error);
      toast.error(getErrorMessage(error, "Failed to capture GPS coordinates."));
    } finally {
      setIsFindingMe(false);
    }
  };

  // Form Submit

  const onSubmit = async (data: RegisterFormInput) => {
    try {
      const values = registerSchema.parse(data) as RegisterInput;

      console.log("SUBMIT SUCCESS");
      console.log(values);
      throw new Error();
    } catch (error) {
      console.error("Register Error:", error);
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
      {/* Name */}
      <div>
        <Input placeholder="Full Name" {...register("name")} />
        {errors.name && (
          <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <Input
          type="email"
          placeholder="Email Address"
          {...register("email")}
        />
        {errors.email && (
          <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
        )}
      </div>

      {/* Nickname + Phone */}
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <Input placeholder="Nickname" {...register("nickname")} />
        </div>

        <div>
          <Input placeholder="Public Phone Number" {...register("phone")} />
          {errors.phone && (
            <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>
          )}
        </div>
      </div>

      {/* Blood + Gender + DOB */}
      <div className="grid gap-3 md:grid-cols-3">
        <div>
          <Controller
            control={control}
            name="bloodGroup"
            render={({ field }) => (
              <Select value={field.value ?? ""} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Blood Group" />
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

          {errors.bloodGroup && (
            <p className="mt-1 text-xs text-red-500">
              {errors.bloodGroup.message}
            </p>
          )}
        </div>

        <div>
          <Controller
            control={control}
            name="gender"
            render={({ field }) => (
              <Select value={field.value ?? ""} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Gender" />
                </SelectTrigger>

                <SelectContent>
                  {GENDERS.map((gender) => (
                    <SelectItem key={gender} value={gender}>
                      {gender}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />

          {errors.gender && (
            <p className="mt-1 text-xs text-red-500">{errors.gender.message}</p>
          )}
        </div>

        <div>
          <Input type="date" {...register("dob")} />

          {errors.dob && (
            <p className="mt-1 text-xs text-red-500">{errors.dob.message}</p>
          )}
        </div>
      </div>

      {/* Location Intelligent Search Integration Section */}
      <div className="space-y-2 relative">
        <div className="flex gap-2 items-center">
          <div className="relative flex-1">
            <Input
              value={query}
              disabled={isLockedByGps}
              placeholder={
                isLockedByGps
                  ? "Location locked by GPS"
                  : "Search your area or district..."
              }
              onChange={(e) => {
                const value = e.target.value;

                setQuery(value);

                if (hasSelectedLocation) {
                  resetLocation();
                }

                if (!value.trim()) {
                  setSuggestions([]);
                  return;
                }

                debouncedSearch(value);
              }}
              onFocus={() => {
                if (hasSelectedLocation) {
                  resetLocation();
                  debouncedSearch(query);
                }
              }}
              className="pr-10"
            />
            {isSearching && !isLockedByGps && (
              <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-muted-foreground" />
            )}
            {isLockedByGps && (
              <button
                type="button"
                onClick={clearLocationSelection}
                className="absolute right-3 top-3 text-gray-400 hover:text-red-500"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {!isLockedByGps && (
            <Button
              type="button"
              variant="outline"
              onClick={handleFindMe}
              disabled={isFindingMe}
              className="flex items-center gap-1 shrink-0"
            >
              <MapPin className="h-4 w-4 text-rose-500" />
              Find Me
            </Button>
          )}
        </div>

        {/* Dropdown Box Suggestions Container Layout Stack */}
        {!isLockedByGps &&
          query.trim() &&
          !isSearching &&
          !hasSelectedLocation && (
            <div className="absolute left-0 top-full z-50 mt-1 max-h-60 overflow-y-auto w-full rounded-md border bg-background shadow-lg divide-y divide-muted">
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

        {errors.location && (
          <p className="text-xs text-red-500 mt-1">
            Please select a valid area suggestion
          </p>
        )}
      </div>
      {/* Password */}
      <div className="grid gap-3 md:grid-cols-2">
        <div className="">
          <div className="relative">
            <Input
              type={showPass ? "text" : "password"}
              placeholder="Password"
              {...register("password")}
            />

            <button
              type="button"
              onClick={() => setShowPass((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-xs text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>
        <div className="">
          <div className="relative">
            <Input
              type={showConfirmPass ? "text" : "password"}
              placeholder="Confirm Password"
              {...register("confirmPassword")}
            />

            <button
              type="button"
              onClick={() => setShowConfirmPass((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {showConfirmPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-red-500">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
      </div>

      {/* isAvailableForDonate */}
      <div className="space-y-3">
        <Controller
          control={control}
          name="isAvailableForDonate"
          render={({ field }) => (
            <div className="flex items-center gap-2">
              <Checkbox
                checked={field.value ?? false}
                onCheckedChange={(checked) => field.onChange(!!checked)}
              />
              <label className="text-sm text-muted-foreground">
                I am available for donation
              </label>
            </div>
          )}
        />
        {errors.isAvailableForDonate && (
          <p className="mt-1 text-xs text-red-500">
            {errors.isAvailableForDonate.message}
          </p>
        )}
      </div>

      {/* Terms */}
      <div className="space-y-3">
        <Controller
          control={control}
          name="acceptTerms"
          render={({ field }) => (
            <div className="flex items-center gap-2">
              <Checkbox
                checked={field.value ?? false}
                onCheckedChange={(checked) => field.onChange(!!checked)}
              />

              <label className="text-sm text-muted-foreground">
                I agree to Terms & Privacy Policy
              </label>
            </div>
          )}
        />

        {errors.acceptTerms && (
          <p className="text-xs text-red-500">{errors.acceptTerms.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-app-primary hover:bg-app-primary/90 py-2 rounded-md cursor-pointe"
      >
        {isSubmitting ? "Creating Account..." : "Create Account"}
      </Button>
    </form>
  );
}
