"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BloodRequestCardData } from "@/types/blood-request.type";
import { Droplet } from "lucide-react";
import BloodRequestForm from "./BloodRequestForm";

interface BloodRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode?: "create" | "edit";
  request?: BloodRequestCardData;
}

export default function BloodRequestModal({
  open,
  onOpenChange,
  mode = "create",
  request,
}: BloodRequestModalProps) {
  const isEditMode = mode === "edit";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[min(680px,calc(100vh-2rem))] w-[calc(100%-2rem)] !max-w-3xl flex-col gap-0 overflow-hidden rounded-2xl border-border bg-app-card p-0 text-app-foreground shadow-xl">
        {/* Header */}
        <DialogHeader className="flex shrink-0 flex-row items-center gap-3 border-b border-border/50 px-6 py-5">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-rose-500/10 dark:bg-rose-500/20">
            <Droplet className="size-5 fill-rose-600 text-rose-600 dark:fill-rose-400 dark:text-rose-400" />
          </div>

          <div className="space-y-0.5">
            <DialogTitle className="text-lg font-bold">
              {isEditMode ? "Edit Blood Request" : "Create Blood Request"}
            </DialogTitle>

            <DialogDescription className="text-xs text-muted-foreground">
              {isEditMode
                ? "Update the details of your blood request."
                : "Fill in the details to reach nearby potential blood donors."}
            </DialogDescription>
          </div>
        </DialogHeader>

        {/* Form */}
        <BloodRequestForm
          mode={mode}
          onOpenChange={onOpenChange}
          request={request}
        />
      </DialogContent>
    </Dialog>
  );
}
