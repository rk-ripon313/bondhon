"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserProfile } from "@/types/user.type";
import { useRouter } from "next/navigation";
import { useState } from "react";
import LocationTab from "./LocationTab";
import MedicalTab from "./MedicalTab";
import PersonalTab from "./PersonalTab";

type EditTab = "personal" | "medical" | "location";

interface ProfileEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: EditTab;
  user: UserProfile;
}

export default function ProfileEditDialog({
  open,
  onOpenChange,
  defaultTab = "personal",
  user,
}: ProfileEditDialogProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<EditTab>(defaultTab);

  const onSuccess = () => {
    onOpenChange(false);
    router.refresh();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[min(680px,calc(100vh-2rem))] w-[calc(100%-2rem)] !max-w-3xl flex-col gap-0 overflow-hidden rounded-2xl border-border bg-app-card p-0 text-app-foreground shadow-xl">
        {/* Header */}
        <DialogHeader className="shrink-0 border-b border-border/50 px-6 py-5">
          <DialogTitle className="text-xl font-bold">Edit Profile</DialogTitle>

          <DialogDescription className="text-xs text-muted-foreground">
            Update your personal, medical, and location information.
          </DialogDescription>
        </DialogHeader>
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as EditTab)}
          className="flex min-h-0 flex-1 flex-col overflow-hidden"
        >
          {/* Tabs */}
          <div className="shrink-0 px-6 pt-4">
            <TabsList className="grid h-10 w-full grid-cols-3 rounded-xl bg-app-background p-1">
              <TabsTrigger
                value="personal"
                className="cursor-pointer rounded-lg text-xs font-medium text-app-muted transition-all data-[state=active]:bg-app-card data-[state=active]:text-app-foreground data-[state=active]:shadow-sm"
              >
                Personal
              </TabsTrigger>

              <TabsTrigger
                value="medical"
                className="cursor-pointer rounded-lg text-xs font-medium text-app-muted transition-all data-[state=active]:bg-app-card data-[state=active]:text-app-foreground data-[state=active]:shadow-sm"
              >
                Medical
              </TabsTrigger>

              <TabsTrigger
                value="location"
                className="cursor-pointer rounded-lg text-xs font-medium text-app-muted transition-all data-[state=active]:bg-app-card data-[state=active]:text-app-foreground data-[state=active]:shadow-sm"
              >
                Location
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Scrollable Content */}
          <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto px-6 py-5">
            <TabsContent
              value="personal"
              className="mt-0 focus-visible:outline-none"
            >
              <PersonalTab user={user} onSuccess={onSuccess} />
            </TabsContent>

            <TabsContent
              value="medical"
              className="mt-0 focus-visible:outline-none"
            >
              <MedicalTab user={user} onSuccess={onSuccess} />
            </TabsContent>

            <TabsContent
              value="location"
              className="mt-0 focus-visible:outline-none"
            >
              <LocationTab user={user} onSuccess={onSuccess} />
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
