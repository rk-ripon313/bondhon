"use client";

import { Loader2 } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  onConfirm: () => void;
}

export default function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  loading = false,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="w-[calc(100%-2rem)] max-w-md rounded-2xl border-border/60 bg-app-card p-5 sm:p-6">
        <AlertDialogHeader className="space-y-2">
          <AlertDialogTitle className="text-base sm:text-lg">
            {title}
          </AlertDialogTitle>

          <AlertDialogDescription className="text-xs leading-5 sm:text-sm">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-2 flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <AlertDialogCancel
            disabled={loading}
            className="mt-0 w-full cursor-pointer sm:w-auto"
          >
            {cancelText}
          </AlertDialogCancel>

          <AlertDialogAction
            disabled={loading}
            onClick={(event) => {
              event.preventDefault();
              onConfirm();
            }}
            className="w-full cursor-pointer bg-red-500 text-white hover:bg-red-600 sm:w-auto transition-colors disabled:cursor-not-allowed disabled:bg-red-500/50 disabled:text-white/70"
          >
            {loading && <Loader2 className="size-4 animate-spin" />}
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
