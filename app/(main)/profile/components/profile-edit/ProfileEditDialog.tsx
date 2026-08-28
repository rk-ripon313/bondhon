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
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl  rounded-2xl border-border bg-app-card  text-app-foreground shadow-lg ">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>

          <DialogDescription>
            Update your personal, medical, and location information.
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as EditTab)}
          className="mt-2 w-full"
        >
          <TabsList className="grid w-full grid-cols-3 rounded-xl bg-app-background ">
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

          <TabsContent value="personal" className="mt-5">
            <PersonalTab user={user} onSuccess={onSuccess} />
          </TabsContent>

          <TabsContent value="medical" className="mt-5">
            <MedicalTab user={user} onSuccess={onSuccess} />
          </TabsContent>

          <TabsContent value="location" className="mt-5">
            <LocationTab user={user} onSuccess={onSuccess} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
