"use client";

import {
  Flag,
  MoreHorizontal,
  Pencil,
  Share2,
  Trash2,
  UserRoundX,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { deleteBloodRequest } from "@/app/actions/blood-request/blood-request.action";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { BloodRequestCardData } from "@/types/blood-request.type";
import { useRouter } from "next/navigation";
import { useState } from "react";
import BloodRequestModal from "../BloodRequestModal";

export default function BloodRequestActions({
  request,
}: {
  request: BloodRequestCardData;
}) {
  const { refresh } = useRouter();
  const requesterName = request.requester?.name || "Unknown User";
  const canEditOrDelete = request.isOwner && request.status === "active";

  const [openEdit, setOpenEdit] = useState(false);

  //delete states
  const [openDelete, setOpenDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);

      const result = await deleteBloodRequest(request.id);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      refresh();
    } catch (error) {
      console.error("Delete Blood Request Error:", error);
      toast.error("Failed to delete blood request.");
    } finally {
      setIsDeleting(false);
      setOpenDelete(false);
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

        <DropdownMenuContent align="end" className="w-44">
          {/* Owner Actions */}
          {canEditOrDelete && (
            <>
              <DropdownMenuItem
                className="cursor-pointer gap-2"
                onClick={() => setOpenEdit(true)}
              >
                <Pencil className="size-4" />
                Edit Request
              </DropdownMenuItem>

              <DropdownMenuItem
                className="cursor-pointer gap-2 text-red-500 focus:text-red-500"
                onClick={() => setOpenDelete(true)}
              >
                <Trash2 className="size-4" />
                Delete Request
              </DropdownMenuItem>

              <DropdownMenuSeparator />
            </>
          )}

          {/* Share */}
          <DropdownMenuItem
            className="cursor-pointer gap-2"
            onClick={async () => {
              const shareData = {
                title: `Blood Request by ${requesterName} - ${request.bloodGroupNeeded} Needed`,
                text: `I need ${request.quantity} ${request.quantity === 1 ? "bag" : "bags"} of ${request.bloodGroupNeeded} blood.`,
                url: `${window.location.origin}/blood-requests/${request.id}`,
              };

              try {
                if (navigator.share) {
                  await navigator.share(shareData);
                  toast.success("Blood request shared successfully!");
                } else {
                  await navigator.clipboard.writeText(shareData.url);
                  toast.success("Link copied to clipboard! Share it anywhere.");
                }
              } catch (error) {
                console.error("Error sharing blood request:", error);
              }
            }}
          >
            <Share2 className="size-4" />
            Share
          </DropdownMenuItem>

          {/* Other User Actions */}
          {!request.isOwner && (
            <>
              <DropdownMenuItem className="cursor-pointer gap-2">
                <UserRoundX className="size-4" />
                Block User
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem className="cursor-pointer gap-2 text-red-500 focus:text-red-500">
                <Flag className="size-4" />
                Report
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      {/* Edit Modal */}
      <BloodRequestModal
        mode="edit"
        request={request}
        open={openEdit}
        onOpenChange={setOpenEdit}
      />
      {/* Delete Confirmation */}{" "}
      <ConfirmDialog
        open={openDelete}
        onOpenChange={setOpenDelete}
        title="Delete Blood Request?"
        description="This action cannot be undone. Are you sure you want to delete this blood request?"
        confirmText="Delete Request"
        loading={isDeleting}
        onConfirm={handleDelete}
      />
    </>
  );
}
