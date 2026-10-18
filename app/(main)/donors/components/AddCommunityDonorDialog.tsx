"use client";

import { UserPlus } from "lucide-react";
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

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Community Donor</DialogTitle>
          <DialogDescription>
            Add a local donor to help others find blood when needed.
          </DialogDescription>
        </DialogHeader>

        {/* Form */}
      </DialogContent>
    </Dialog>
  );
}
