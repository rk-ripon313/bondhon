"use client";

import { CalendarClock, Droplets, MapPin, Phone } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type CreateBloodRequestModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function CreateBloodRequestModal({
  open,
  onOpenChange,
}: CreateBloodRequestModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Droplets className="size-5 text-rose-500" />
            Create Blood Request
          </DialogTitle>

          <DialogDescription>
            Provide the details needed to help someone find the right blood
            donor.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          {/* Blood Information */}
          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-semibold">Blood Information</h3>
              <p className="text-xs text-muted-foreground">
                Tell us what type and quantity of blood is needed.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="h-10 rounded-lg border border-border/60 bg-muted/20" />
              <div className="h-10 rounded-lg border border-border/60 bg-muted/20" />
            </div>
          </div>

          {/* Urgency */}
          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-semibold">Urgency</h3>
              <p className="text-xs text-muted-foreground">
                How urgently is the blood needed?
              </p>
            </div>

            <div className="h-10 rounded-lg border border-border/60 bg-muted/20" />
          </div>

          {/* Hospital */}
          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-semibold">Hospital Information</h3>
              <p className="text-xs text-muted-foreground">
                Where should the donor go?
              </p>
            </div>

            <div className="h-10 rounded-lg border border-border/60 bg-muted/20" />
          </div>

          {/* Location */}
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 text-app-secondary" />

              <div>
                <h3 className="text-sm font-semibold">Location</h3>
                <p className="text-xs text-muted-foreground">
                  Provide the location where the blood is needed.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="h-10 rounded-lg border border-border/60 bg-muted/20" />
              <div className="h-10 rounded-lg border border-border/60 bg-muted/20" />
            </div>

            <div className="h-10 rounded-lg border border-border/60 bg-muted/20" />
          </div>

          {/* Needed Before */}
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <CalendarClock className="mt-0.5 size-4 text-app-secondary" />

              <div>
                <h3 className="text-sm font-semibold">Needed Before</h3>
                <p className="text-xs text-muted-foreground">
                  When is the blood needed?
                </p>
              </div>
            </div>

            <div className="h-10 rounded-lg border border-border/60 bg-muted/20" />
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <Phone className="mt-0.5 size-4 text-app-secondary" />

              <div>
                <h3 className="text-sm font-semibold">Contact Number</h3>
                <p className="text-xs text-muted-foreground">
                  Donors may use this number to contact you.
                </p>
              </div>
            </div>

            <div className="h-10 rounded-lg border border-border/60 bg-muted/20" />
          </div>

          {/* Additional Notes */}
          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-semibold">Additional Notes</h3>
              <p className="text-xs text-muted-foreground">
                Add any extra information donors should know.
              </p>
            </div>

            <div className="h-24 rounded-lg border border-border/60 bg-muted/20" />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 border-t border-border/60 pt-4">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-lg border border-border/60 px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled
              className="rounded-lg bg-app-primary px-4 py-2 text-sm font-semibold text-white opacity-60"
            >
              Create Request
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
