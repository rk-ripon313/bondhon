"use client";

import { deleteBloodRequest } from "@/app/actions/blood-request/blood-request.action";
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
import type { BloodRequestCardData } from "@/types/blood-request.type";
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
import BloodRequestModal from "./BloodRequestModal";

export default function BloodRequestMoreActions({
  request,
}: {
  request: BloodRequestCardData;
}) {
  const router = useRouter();

  const requesterName = request.requester?.name || "Unknown User";
  const requesterUsername = request.requester?.username;

  // Effective status calculation
  const isExpired = new Date(request.neededBefore) <= new Date();
  const isActive = request.status === "active" && !isExpired;

  // Permissions
  const canEdit = request.isOwner && isActive;
  const canManageActive = request.isOwner && request.status === "active";

  const canSaveOrReport = !!request.currentUserId && !request.isOwner;
  const canBlockRequester = canSaveOrReport && !!requesterUsername;

  // Dialog states
  const [openEdit, setOpenEdit] = useState(false);

  const [openDelete, setOpenDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [openBlockUser, setOpenBlockUser] = useState(false);
  const [isBlockingUser, setIsBlockingUser] = useState(false);

  // Delete Request
  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const result = await deleteBloodRequest(request.id);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      setOpenDelete(false);
      router.refresh();
    } catch (error) {
      console.error("Delete Blood Request Error:", error);
      toast.error("Failed to delete blood request.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Block Requester
  const handleBlockUser = async () => {
    if (!requesterUsername) return;

    setIsBlockingUser(true);

    try {
      const result = await toggleBlock(requesterUsername);

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
            variant="ghost"
            size="icon"
            className="size-8 cursor-pointer rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <MoreHorizontal className="size-4" />
            <span className="sr-only">More options</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-48 bg-app-background">
          {/* Edit Request */}
          {canEdit && (
            <DropdownMenuItem
              className="cursor-pointer gap-2"
              onClick={() => setOpenEdit(true)}
            >
              <Pencil className="size-4" />
              Edit request
            </DropdownMenuItem>
          )}

          {/* Share Request */}
          <DropdownMenuItem asChild>
            <ShareButton
              title={`Urgent Blood Needed: ${request.bloodGroupNeeded}`}
              text={`Blood needed (${request.bloodGroupNeeded}) at ${request.hospitalName}. Posted by ${requesterName}.`}
              url={`/blood-requests/${request.id}`}
              className="h-auto w-full justify-start px-2 py-1.5"
            />
          </DropdownMenuItem>

          {/* Owner Actions */}
          {canManageActive && (
            <>
              <DropdownMenuSeparator />

              {/* TODO: Implement Cancel request functionality. */}
              <DropdownMenuItem className="cursor-pointer gap-2 text-destructive focus:text-destructive">
                <Ban className="size-4" />
                Cancel request
              </DropdownMenuItem>

              <DropdownMenuItem
                className="cursor-pointer gap-2 text-destructive focus:text-destructive"
                onClick={() => setOpenDelete(true)}
              >
                <Trash2 className="size-4" />
                Delete request
              </DropdownMenuItem>
            </>
          )}

          {/* Save / Report / Block */}
          {canSaveOrReport && (
            <>
              <DropdownMenuSeparator />

              {/* TODO: Implement save/unsave request functionality. */}
              <DropdownMenuItem className="cursor-pointer gap-2">
                <Bookmark className="size-4" />
                Save request
              </DropdownMenuItem>

              {/* TODO: Implement request reporting functionality. */}
              <DropdownMenuItem className="cursor-pointer gap-2 text-destructive focus:text-destructive">
                <Flag className="size-4" />
                Report request
              </DropdownMenuItem>

              {canBlockRequester && (
                <DropdownMenuItem
                  className="cursor-pointer gap-2 text-destructive focus:text-destructive"
                  onClick={() => setOpenBlockUser(true)}
                >
                  <ShieldBan className="size-4" />
                  Block requester
                </DropdownMenuItem>
              )}
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit Modal (if BloodRequestModal component exists) */}
      {openEdit && (
        <BloodRequestModal
          mode="edit"
          request={request}
          open={openEdit}
          onOpenChange={setOpenEdit}
        />
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={openDelete}
        onOpenChange={setOpenDelete}
        title="Delete Blood Request?"
        description={
          request.interestedCount > 0
            ? `This request has ${request.interestedCount} interested donor(s). Deleting it will permanently remove it. Are you sure?`
            : "This action cannot be undone. Are you sure you want to delete this blood request?"
        }
        confirmText="Delete Request"
        loading={isDeleting}
        onConfirm={handleDelete}
      />

      {/* Block Confirmation */}
      <ConfirmDialog
        open={openBlockUser}
        onOpenChange={setOpenBlockUser}
        title="Block Requester?"
        description={`Are you sure you want to block ${requesterName}? You won't see their blood requests anymore.`}
        confirmText="Block User"
        loading={isBlockingUser}
        onConfirm={handleBlockUser}
      />
    </>
  );
}
