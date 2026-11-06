"use client";

import {
  Ban,
  Bookmark,
  Flag,
  MoreHorizontal,
  Pencil,
  ShieldBan,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { cancelEvent, deleteEvent } from "@/app/actions/event/event.action";
import { toggleBlock } from "@/app/actions/profile/connections.action";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import ShareButton from "@/components/shared/ShareAction";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  canParticipateInEvent,
  getEffectiveEventStatus,
} from "@/lib/helpers/status";
import type { EventCardData } from "@/types/event.type";

import EventModal from "./EventModal";

export default function EventMoreActions({ event }: { event: EventCardData }) {
  const router = useRouter();

  const organizerName = event.organizer?.name || "Unknown User";
  const organizerUsername = event.organizer?.username;

  // Effective event status
  const effectiveStatus = getEffectiveEventStatus(event);
  const isActive = canParticipateInEvent(effectiveStatus);

  // Permissions
  const canEdit = event.isOwner && isActive;
  const canManageUpcoming = event.isOwner && effectiveStatus === "upcoming";

  const canSaveOrReport = !!event.currentUserId && !event.isOwner;
  const canBlockOrganizer = canSaveOrReport && !!organizerUsername;

  // Dialog states
  const [openEdit, setOpenEdit] = useState(false);

  const [openCancel, setOpenCancel] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const [openDelete, setOpenDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [openBlockUser, setOpenBlockUser] = useState(false);
  const [isBlockingUser, setIsBlockingUser] = useState(false);

  // Cancel Event
  const handleCancel = async () => {
    setIsCancelling(true);

    try {
      const result = await cancelEvent(event.id);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      setOpenCancel(false);
      router.refresh();
    } catch (error) {
      console.error("Cancel Event Error:", error);
      toast.error("Failed to cancel event.");
    } finally {
      setIsCancelling(false);
    }
  };

  // Delete Event
  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const result = await deleteEvent(event.id);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      setOpenDelete(false);
      router.refresh();
    } catch (error) {
      console.error("Delete Event Error:", error);
      toast.error("Failed to delete event.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Block Organizer
  const handleBlockUser = async () => {
    if (!organizerUsername) return;

    setIsBlockingUser(true);

    try {
      const result = await toggleBlock(organizerUsername);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      setOpenBlockUser(false);
      router.refresh();
    } catch (error) {
      console.error("Block User Error:", error);
      toast.error("Failed to block user.");
    } finally {
      setIsBlockingUser(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="secondary"
            size="icon"
            className="pointer-events-auto size-8 cursor-pointer border border-border/60 bg-app-background/85 shadow-sm backdrop-blur-md hover:bg-app-background"
          >
            <MoreHorizontal className="size-4" />
            <span className="sr-only">More actions</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-44 bg-app-background">
          {/* Edit Event */}
          {canEdit && (
            <DropdownMenuItem
              className="cursor-pointer gap-2"
              onClick={() => setOpenEdit(true)}
            >
              <Pencil className="size-4" />
              Edit event
            </DropdownMenuItem>
          )}

          {/* Share Event */}
          <DropdownMenuItem asChild>
            <ShareButton
              title={`Event: ${event.title}`}
              text={`Check out this event: ${event.title} organized by ${organizerName}.`}
              url={`/events/${event.id}`}
              className="h-auto w-full justify-start px-2 py-1.5"
            />
          </DropdownMenuItem>

          {/* Upcoming Event Actions */}
          {canManageUpcoming && (
            <>
              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="cursor-pointer gap-2 text-destructive focus:text-destructive"
                onClick={() => setOpenCancel(true)}
              >
                <Ban className="size-4" />
                Cancel event
              </DropdownMenuItem>

              <DropdownMenuItem
                className="cursor-pointer gap-2 text-destructive focus:text-destructive"
                onClick={() => setOpenDelete(true)}
              >
                <Trash2 className="size-4" />
                Delete event
              </DropdownMenuItem>
            </>
          )}

          {/* Save / Report / Block */}
          {canSaveOrReport && (
            <>
              <DropdownMenuSeparator />

              {/* TODO: Implement save/unsave event functionality. */}
              <DropdownMenuItem className="cursor-pointer gap-2">
                <Bookmark className="size-4" />
                Save event
              </DropdownMenuItem>

              {/* TODO: Implement event reporting functionality. */}
              <DropdownMenuItem className="cursor-pointer gap-2 text-destructive focus:text-destructive">
                <Flag className="size-4" />
                Report event
              </DropdownMenuItem>

              {canBlockOrganizer && (
                <DropdownMenuItem
                  className="cursor-pointer gap-2 text-destructive focus:text-destructive"
                  onClick={() => setOpenBlockUser(true)}
                >
                  <ShieldBan className="size-4" />
                  Block organizer
                </DropdownMenuItem>
              )}
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

      {/* Cancel Confirmation */}
      <ConfirmDialog
        open={openCancel}
        onOpenChange={setOpenCancel}
        title="Cancel Event?"
        description="Are you sure you want to cancel this event? Participants will be notified that this event is cancelled."
        confirmText="Cancel Event"
        loading={isCancelling}
        onConfirm={handleCancel}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={openDelete}
        onOpenChange={setOpenDelete}
        title="Delete Event?"
        description={
          event.goingCount > 0 || event.interestedCount > 0
            ? `This event has ${event.goingCount} going and ${event.interestedCount} interested participants. Deleting it will permanently remove the event. Are you sure?`
            : "This action cannot be undone. Are you sure you want to delete this event?"
        }
        confirmText="Delete Event"
        loading={isDeleting}
        onConfirm={handleDelete}
      />

      {/* Block Confirmation */}
      <ConfirmDialog
        open={openBlockUser}
        onOpenChange={setOpenBlockUser}
        title="Block Organizer?"
        description={`Are you sure you want to block ${organizerName}? You won't see their events anymore.`}
        confirmText="Block User"
        loading={isBlockingUser}
        onConfirm={handleBlockUser}
      />
    </>
  );
}
