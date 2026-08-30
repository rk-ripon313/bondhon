"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
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

import { updateUserField } from "@/app/actions/profile/update-user.action";
import { BLOOD_GROUPS } from "@/constants";
import {
  updateMedicalSchema,
  type UpdateMedicalInput,
} from "@/lib/validations/profile/update-profile.schema";
import { UserProfile } from "@/types/user.type";

interface MedicalTabProps {
  user: UserProfile;
  onSuccess: () => void;
}

export default function MedicalTab({ user, onSuccess }: MedicalTabProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<UpdateMedicalInput>({
    resolver: zodResolver(updateMedicalSchema),
    defaultValues: {
      bloodGroup: user.bloodGroup as UpdateMedicalInput["bloodGroup"],
      height: user.height?.toString() ?? "",
      weight: user.weight?.toString() ?? "",
    },
  });

  const onSubmit = async (data: UpdateMedicalInput) => {
    try {
      const result = await updateUserField({
        bloodGroup: data.bloodGroup,
        height: Number(data.height),
        weight: Number(data.weight),
      });

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      onSuccess();
    } catch (error) {
      console.error("Medical profile update error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update medical information.",
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Editable Medical Information */}
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Medical Information
          </h3>

          <p className="mt-1 text-xs text-muted-foreground">
            Keep your medical information up to date.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {/* Blood Group */}
          <div className="space-y-2">
            <Label htmlFor="bloodGroup" className="text-xs font-medium">
              Blood Group
            </Label>

            <Controller
              control={control}
              name="bloodGroup"
              render={({ field }) => (
                <Select
                  value={field.value ?? ""}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger id="bloodGroup">
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

            {errors.bloodGroup && (
              <p className="text-[11px] text-destructive">
                {errors.bloodGroup.message}
              </p>
            )}
          </div>

          {/* Height */}
          <div className="space-y-2">
            <Label htmlFor="height" className="text-xs font-medium">
              Height
            </Label>

            <div className="relative">
              <Input
                id="height"
                type="number"
                min={50}
                max={250}
                step="0.1"
                placeholder="Enter height"
                className="pr-12"
                {...register("height")}
              />

              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                cm
              </span>
            </div>

            {errors.height && (
              <p className="text-[11px] text-destructive">
                {errors.height.message}
              </p>
            )}
          </div>

          {/* Weight */}
          <div className="space-y-2">
            <Label htmlFor="weight" className="text-xs font-medium">
              Weight
            </Label>

            <div className="relative">
              <Input
                id="weight"
                type="number"
                min={20}
                max={300}
                step="0.1"
                placeholder="Enter weight"
                className="pr-12"
                {...register("weight")}
              />

              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                kg
              </span>
            </div>

            {errors.weight && (
              <p className="text-[11px] text-destructive">
                {errors.weight.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Donation Information */}
      <div className="border-t border-border/50 pt-5">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-foreground">
            Donation Information
          </h3>

          <p className="mt-1 text-xs text-muted-foreground">
            These details are managed automatically by BondhOn.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-border/50 bg-muted/30 p-3">
            <p className="text-xs text-muted-foreground">Total Donations</p>

            <p className="mt-1 text-sm font-semibold">
              {user.totalDonations ?? 0} times
            </p>
          </div>

          <div className="rounded-xl border border-border/50 bg-muted/30 p-3">
            <p className="text-xs text-muted-foreground">Last Donation</p>

            <p className="mt-1 text-sm font-semibold">
              {user.lastDonationDate
                ? new Date(user.lastDonationDate).toLocaleDateString("en-BD", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "Never"}
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end border-t border-border/50 pt-5">
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
