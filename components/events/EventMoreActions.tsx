"use client";

import {
  Bookmark,
  Flag,
  MoreHorizontal,
  Pencil,
  ShieldBan,
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

import { deleteEvent } from "@/app/actions/event/event.action";
import { toggleBlock } from "@/app/actions/profile/connections.action";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import ShareButton from "@/components/shared/ShareAction";
import { EventCardData } from "@/types/event.type";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import EventModal from "./EventModal";

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

  const [openBlockUser, setOpenBlockUser] = useState(false);
  const [isBlockingUser, setIsBlockingUser] = useState(false);

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
      refresh();
    } catch (error) {
      console.error("Delete Event Error:", error);
      toast.error("Failed to delete event.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBlockUser = async () => {
    setIsBlockingUser(true);

    try {
      const result = await toggleBlock(event.organizer.username);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      setOpenBlockUser(false);
      refresh();
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
        <DropdownMenuTrigger asChild className="bg-app-background">
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

          <DropdownMenuItem asChild>
            <ShareButton
              title={`Event: ${event.title}`}
              text={`Check out this event: ${event.title} organized by ${organizerName}.`}
              url={`/events/${event.id}`}
              className="h-auto w-full justify-start px-2 py-1.5"
            />
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
          {/* TODO: Implement save/unsave event functionality. */}
          {/* TODO: Implement event reporting functionality. */}
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

              <DropdownMenuItem
                className="cursor-pointer gap-2 text-destructive focus:text-destructive"
                onClick={() => setOpenBlockUser(true)}
              >
                <ShieldBan className="size-4" />
                Block organizer
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
