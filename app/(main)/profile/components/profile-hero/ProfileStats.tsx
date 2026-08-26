"use client";

import { useState } from "react";
import SocialConnectionsDialog from "./SocialConnectionsDialog";

export default function ProfileStats({
  followersCount,
  followingCount,
  donationsCount,
}: {
  followersCount: number;
  followingCount: number;
  donationsCount: number;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"followers" | "following">(
    "followers",
  );

  const handleOpen = (tab: "followers" | "following") => {
    setActiveTab(tab);
    setIsDialogOpen(true);
  };

  return (
    <>
      <div className="relative mt-6 grid grid-cols-3 divide-x divide-border rounded-xl border border-border bg-app-background p-3 text-center">
        <button
          type="button"
          onClick={() => handleOpen("followers")}
          className="cursor-pointer rounded-lg px-2 py-1 transition-colors hover:bg-app-card"
        >
          <p className="text-xs text-app-muted">Followers</p>

          <p className="mt-0.5 text-sm font-semibold text-app-foreground">
            {followersCount}
          </p>
        </button>

        <button
          type="button"
          onClick={() => handleOpen("following")}
          className="rounded-lg px-2 py-1 transition-colors hover:bg-app-card  cursor-pointer"
        >
          <p className="text-xs text-app-muted">Following</p>

          <p className="mt-0.5 text-sm font-semibold text-app-foreground">
            {followingCount}
          </p>
        </button>

        <div className="px-2">
          <p className="text-xs text-app-muted">Donations</p>

          <p className="mt-0.5 text-sm font-semibold text-app-primary">
            {donationsCount}
          </p>
        </div>
      </div>

      {/* Dialog */}
      <SocialConnectionsDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </>
  );
}
