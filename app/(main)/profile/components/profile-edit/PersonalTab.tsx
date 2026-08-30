"use client";

import {
  checkUsername,
  updateUserField,
} from "@/app/actions/profile/update-user.action";
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
import { GENDERS } from "@/constants";
import {
  updatePersonalSchema,
  type UpdatePersonalInput,
} from "@/lib/validations/profile/update-profile.schema";
import { UserProfile } from "@/types/user.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ShieldAlert } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

interface PersonalTabProps {
  user: UserProfile;
  onSuccess: () => void;
}

export default function PersonalTab({ user, onSuccess }: PersonalTabProps) {
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(
    null,
  );

  const {
    register,
    control,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<UpdatePersonalInput>({
    resolver: zodResolver(updatePersonalSchema),
    defaultValues: {
      name: user.name ?? "",
      nickname: user.nickname ?? "",
      username: user.username ?? "",
      phone: user.phone ?? "",
      gender: user.gender as UpdatePersonalInput["gender"],
      dateOfBirth: user.dateOfBirth
        ? new Date(user.dateOfBirth).toISOString().split("T")[0]
        : "",
    },
  });

  const handleCheckUsername = async () => {
    const username = getValues("username").trim();

    if (!username) {
      toast.error("Please enter a username first.");
      return;
    }

    const validation = updatePersonalSchema.shape.username.safeParse(username);

    if (!validation.success) {
      toast.error(validation.error.issues[0]?.message ?? "Invalid username.");
      return;
    }

    try {
      setIsCheckingUsername(true);
      setUsernameAvailable(null);

      const result = await checkUsername(username);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      setUsernameAvailable(result.available);

      if (result.available) {
        toast.success("Username is available.");
      } else {
        toast.error("Username is already taken.");
      }
    } catch (error) {
      console.error("Check username error:", error);
      toast.error("Failed to check username.");
    } finally {
      setIsCheckingUsername(false);
    }
  };

  const onSubmit = async (data: UpdatePersonalInput) => {
    try {
      const result = await updateUserField(data);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      onSuccess();
    } catch (error) {
      console.error("Update personal profile error:", error);
      toast.error("Failed to update profile.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Identity */}
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Basic Information
          </h3>

          <p className="text-xs text-muted-foreground">
            Personal details visible across your account profile.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-xs font-medium">
              Full Name
            </Label>

            <Input
              id="name"
              placeholder="e.g. John Doe"
              {...register("name")}
            />

            {errors.name && (
              <p className="text-[11px] text-destructive">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Nickname */}
          <div className="space-y-2">
            <Label htmlFor="nickname" className="text-xs font-medium">
              Nickname
            </Label>

            <Input
              id="nickname"
              placeholder="e.g. Johnny"
              {...register("nickname")}
            />

            {errors.nickname && (
              <p className="text-[11px] text-destructive">
                {errors.nickname.message}
              </p>
            )}
          </div>

          {/* Username */}
          <div className="space-y-2">
            <Label htmlFor="username" className="text-xs font-medium">
              Username
            </Label>

            <div className="flex gap-2">
              <Input
                id="username"
                placeholder="Choose a username"
                className="min-w-0 flex-1"
                {...register("username", {
                  onChange: () => setUsernameAvailable(null),
                })}
              />

              <Button
                type="button"
                variant="secondary"
                size="sm"
                disabled={isCheckingUsername}
                onClick={handleCheckUsername}
                className="shrink-0 font-medium cursor-pointer"
              >
                {isCheckingUsername ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  "Check"
                )}
              </Button>
            </div>

            <div className="min-h-4 text-[11px]">
              {errors.username ? (
                <p className="text-destructive">{errors.username.message}</p>
              ) : usernameAvailable === true ? (
                <p className="text-emerald-500">Username is available.</p>
              ) : usernameAvailable === false ? (
                <p className="text-destructive">Username is already taken.</p>
              ) : (
                <p className="text-muted-foreground">
                  Unique handle for your public profile URL.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <hr className="border-border/50" />

      {/* Contact & Account */}
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Contact & Identity
          </h3>

          <p className="text-xs text-muted-foreground">
            Manage your contact and personal information.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs font-medium">
              Email Address
            </Label>

            <Input
              id="email"
              value={user.email}
              disabled
              className="cursor-not-allowed bg-muted/40 opacity-80"
            />

            <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <ShieldAlert className="size-3 shrink-0 text-amber-500" />
              Email address cannot be changed.
            </p>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-xs font-medium">
              Phone Number
            </Label>

            <Input
              id="phone"
              placeholder="01XXXXXXXXX"
              {...register("phone")}
            />

            {errors.phone && (
              <p className="text-[11px] text-destructive">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <Label htmlFor="gender" className="text-xs font-medium">
              Gender
            </Label>

            <Controller
              control={control}
              name="gender"
              render={({ field }) => (
                <Select
                  value={field.value ?? ""}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger id="gender">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>

                  <SelectContent>
                    {GENDERS.map((gender) => (
                      <SelectItem key={gender} value={gender}>
                        {gender.charAt(0).toUpperCase() + gender.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />

            {errors.gender && (
              <p className="text-[11px] text-destructive">
                {errors.gender.message}
              </p>
            )}
          </div>

          {/* Date of Birth */}
          <div className="space-y-2">
            <Label htmlFor="dateOfBirth" className="text-xs font-medium">
              Date of Birth
            </Label>

            <Input id="dateOfBirth" type="date" {...register("dateOfBirth")} />

            {errors.dateOfBirth && (
              <p className="text-[11px] text-destructive">
                {errors.dateOfBirth.message}
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
