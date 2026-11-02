"use client";

import {
  Bookmark,
  Flag,
  MoreHorizontal,
  Pencil,
  Share2,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { EventCardData } from "@/types/event.type";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import EventModal from "../EventModal";

export default function EventMoreActions({ event }: { event: EventCardData }) {
  const { refresh } = useRouter();
  const organizerName = event.organizer?.name || "Unknown User";

  const isExpired = new Date(event.endsAt) <= new Date();

  const canEditOrDelete =
    event.isOwner &&
    !isExpired &&
    ["upcoming", "ongoing"].includes(event.status);

  const canSaveOrReport = !!event.currentUserId && !event.isOwner;

  const [openEdit, setOpenEdit] = useState(false);

  const [openDelete, setOpenDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: `Event: ${event.title}`,
      text: `Check out this event: ${event.title} organized by ${organizerName}.`,
      url: `${window.location.origin}/events/${event.id}`,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        toast.success("Event shared successfully!");
      } else {
        await navigator.clipboard.writeText(shareData.url);
        toast.success("Link copied to clipboard! Share it anywhere.");
      }
    } catch (error) {
      console.error("Error sharing event:", error);
    }
  };
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="bg-app-card">
          <Button
            variant="secondary"
            size="icon"
            className="cursor-pointer pointer-events-auto size-8 border border-border/60 bg-background/85 shadow-sm backdrop-blur-md hover:bg-background"
          >
            <MoreHorizontal className="size-4" />
            <span className="sr-only">More actions</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-44 bg-app-background">
          {canEditOrDelete && (
            <>
              <DropdownMenuItem
                className="cursor-pointer gap-2"
                onClick={() => setOpenEdit(true)}
              >
                <Pencil className="size-4" />
                Edit event
              </DropdownMenuItem>
            </>
          )}

          <DropdownMenuItem
            className="cursor-pointer gap-2"
            onClick={handleShare}
          >
            <Share2 className="size-4" />
            Share event
          </DropdownMenuItem>

          {canEditOrDelete && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer gap-2 text-destructive focus:text-destructive"
                onClick={() => setOpenDelete(true)}
              >
                <Trash2 className="size-4" />
                Delete event
              </DropdownMenuItem>
            </>
          )}

          {canSaveOrReport && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer gap-2">
                <Bookmark className="size-4" />
                Save event
              </DropdownMenuItem>

              <DropdownMenuItem className="cursor-pointer gap-2 text-destructive focus:text-destructive">
                <Flag className="size-4" />
                Report event
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit Modal */}
      <EventModal
        mode="edit"
        event={event}
        open={openEdit}
        onOpenChange={setOpenEdit}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={openDelete}
        onOpenChange={setOpenDelete}
        title="Delete Event?"
        description="This action cannot be undone. Are you sure you want to delete this event?"
        confirmText="Delete Request"
        loading={isDeleting}
        onConfirm={() => setIsDeleting(false)}
      />
    </>
  );
}
