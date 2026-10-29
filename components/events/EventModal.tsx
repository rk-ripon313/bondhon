"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CalendarPlus } from "lucide-react";
import EventForm from "./EventForm";

interface EventModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EventModal({ open, onOpenChange }: EventModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[min(720px,calc(100vh-2rem))] w-[calc(100%-2rem)] !max-w-3xl flex-col gap-0 overflow-hidden rounded-2xl border-border bg-app-card p-0 text-app-foreground shadow-xl">
        {/* Header */}

        <DialogHeader className="flex shrink-0 flex-row items-center gap-3 border-b border-border/50 px-6 py-5">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
            <CalendarPlus className="size-5" />
          </div>

          <div className="space-y-0.5">
            <DialogTitle className="text-lg font-bold">
              Create Event
            </DialogTitle>

            <DialogDescription className="text-xs text-muted-foreground">
              Organize a community event and bring people together.
            </DialogDescription>
          </div>
        </DialogHeader>

        {/* Form */}
        <EventForm onOpenChange={onOpenChange} />
      </DialogContent>
    </Dialog>
  );
}
