"use client";

import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil } from "lucide-react";
import { useState } from "react";

import { UserProfile } from "@/types/user.type";
import ProfileEditDialog from "./profile-edit/ProfileEditDialog";

type EditTab = "personal" | "medical" | "location";

interface ProfileCardHeaderProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  defaultTab: EditTab;
  user: UserProfile;
}

export default function ProfileCardHeader({
  icon,
  title,
  description,
  defaultTab,
  user,
}: ProfileCardHeaderProps) {
  const [open, setOpen] = useState(false);

  return (
    <CardHeader className="flex flex-row items-center justify-between gap-4 pb-4">
      <div className="flex min-w-0 items-start gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-muted/50 text-muted-foreground">
          {icon}
        </div>

        <div className="min-w-0">
          <CardTitle className="text-base font-semibold">{title}</CardTitle>

          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        </div>
      </div>

      <>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setOpen(true)}
          className="shrink-0 cursor-pointer gap-1.5 bg-app-background text-xs text-muted-foreground hover:text-foreground"
        >
          <Pencil className="size-3.5" />

          <span className="hidden sm:inline">Edit</span>
        </Button>

        {/* Profile Edit Dialog */}
        <ProfileEditDialog
          open={open}
          onOpenChange={setOpen}
          defaultTab={defaultTab}
          user={user}
        />
      </>
    </CardHeader>
  );
}
