"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { updatePassword } from "@/app/actions/auth/password.action";
import { getErrorMessage } from "@/lib/helpers/error";
import {
  passwordSchema,
  type PasswordFormInput,
} from "@/lib/validations/auth/password.schema";

interface PasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hasPassword: boolean;
}

export default function PasswordDialog({
  open,
  onOpenChange,
  hasPassword,
}: PasswordDialogProps) {
  const [showPasswords, setShowPasswords] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PasswordFormInput>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const passwordFields = [
    ...(hasPassword
      ? [{ name: "Current Password", id: "currentPassword" as const }]
      : []),
    { name: "New Password", id: "newPassword" as const },
    { name: "Confirm New Password", id: "confirmPassword" as const },
  ];

  const onSubmit = async (data: PasswordFormInput) => {
    try {
      const result = await updatePassword(data);

      if (!result.success) {
        if (result.field === "currentPassword") {
          setError("currentPassword", {
            message: result.message,
          });
        } else {
          toast.error(result.message);
        }
        return;
      }

      toast.success(result.message);
      reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Something went wrong. Please try again.", error);
      toast.error(getErrorMessage(error));
    }
  };

  const handleDialogChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      reset();
      setShowPasswords(false);
    }

    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="gap-0 overflow-hidden rounded-2xl border-border bg-app-card p-0 text-app-foreground shadow-xl sm:max-w-md">
        <div className="space-y-5 p-5 sm:p-6">
          <DialogHeader>
            <DialogTitle>
              {hasPassword ? "Change Password" : "Set Password"}
            </DialogTitle>
            <DialogDescription>
              {hasPassword
                ? "Enter your current password and choose a new one."
                : "Create a password to sign in with your email."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {passwordFields.map((field) => (
              <div key={field.id} className="space-y-2">
                <Label htmlFor={field.id}>{field.name}</Label>

                <div className="relative">
                  <Input
                    id={field.id}
                    type={showPasswords ? "text" : "password"}
                    autoComplete={
                      field.id === "currentPassword"
                        ? "current-password"
                        : "new-password"
                    }
                    {...register(field.id)}
                    className="h-10 pr-10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPasswords((prev) => !prev)}
                    className="absolute inset-y-0 right-3 flex items-center text-muted-foreground transition-colors hover:text-foreground"
                    aria-label={
                      showPasswords ? "Hide passwords" : "Show passwords"
                    }
                  >
                    {showPasswords ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>

                <p className="min-h-4 text-xs leading-4 text-destructive">
                  {errors[field.id]?.message || " "}
                </p>
              </div>
            ))}

            <div className="flex justify-end gap-2 pt-1">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleDialogChange(false)}
                disabled={isSubmitting}
                className="h-9 cursor-pointer rounded-lg border-border bg-app-background px-4 transition-colors hover:bg-app-muted"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-9 cursor-pointer rounded-lg bg-app-primary px-4 text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-app-primary/90 hover:shadow-md active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting
                  ? "Please wait..."
                  : hasPassword
                    ? "Change Password"
                    : "Set Password"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
