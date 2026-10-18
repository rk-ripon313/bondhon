"use client";

import { Droplet, UserPlus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CommunityDonorForm from "./CommunityDonorForm";

export default function AddCommunityDonorDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="shrink-0 gap-2 cursor-pointer bg-app-primary text-white shadow-sm shadow-app-primary/20 transition-all duration-200 hover:bg-app-primary/90 hover:shadow-md hover:shadow-app-primary/25 active:scale-[0.98]">
          <UserPlus className="size-4 transition-transform duration-200 group-hover:scale-110" />
          <span className="hidden sm:inline">Add Donor</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="flex max-h-[min(680px,calc(100dvh-2rem))] w-[calc(100%-2rem)] flex-col gap-0 overflow-hidden rounded-2xl border-border bg-app-card p-0 text-app-foreground shadow-xl sm:max-w-lg">
        <DialogHeader className="flex shrink-0 flex-row items-center gap-3 border-b border-border/50 px-5 py-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-rose-500/10 dark:bg-rose-500/20">
            <Droplet className="size-5 text-rose-600 dark:text-rose-400" />
          </div>

          <div className="space-y-0.5">
            <DialogTitle className="text-lg font-bold">
              Add Community Donor
            </DialogTitle>

            <DialogDescription className="text-xs text-muted-foreground">
              Add a local donor to help others find blood when needed.
            </DialogDescription>
          </div>
        </DialogHeader>

        <CommunityDonorForm closeOpen={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
