"use client";

import { loadUserConnections } from "@/app/actions/profile/connections.action";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getErrorMessage } from "@/lib/helpers/error";
import { UserConnection } from "@/types/user.type";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import FollowListItem from "./FollowListItem";

type ConnectionTab = "followers" | "following";

interface SocialConnectionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeTab: ConnectionTab;
  onTabChange: (tab: ConnectionTab) => void;
}

export default function SocialConnectionsDialog({
  open,
  onOpenChange,
  activeTab,
  onTabChange,
}: SocialConnectionsDialogProps) {
  const [followers, setFollowers] = useState<UserConnection[]>([]);
  const [following, setFollowing] = useState<UserConnection[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    const fetchConnections = async () => {
      try {
        setLoading(true);

        const result = await loadUserConnections();

        if (!result.success) {
          throw new Error(result.message);
        }

        setFollowers(result.followers);
        setFollowing(result.following);
      } catch (error) {
        console.error("Load connections error:", error);
        toast.error(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };

    fetchConnections();
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[70vh] max-h-[600px] min-h-[260px] w-[calc(100%-2rem)] max-w-lg flex-col gap-0 overflow-hidden rounded-2xl border-border bg-app-card p-0 text-app-foreground shadow-lg ">
        {/* Header */}
        <DialogHeader className="shrink-0 border-b border-border px-5 py-4">
          <DialogTitle className="text-base font-semibold text-app-foreground">
            Connections
          </DialogTitle>
        </DialogHeader>

        {/* Connection Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={(value) => onTabChange(value as ConnectionTab)}
          className="flex min-h-0 flex-1 flex-col"
        >
          {/* Tab Navigation */}
          <div className="shrink-0 px-4 pt-4">
            <TabsList className="grid  h-10  w-full  grid-cols-2  rounded-xl  bg-app-background  p-1 ">
              <TabsTrigger
                value="followers"
                className="cursor-pointer rounded-lg text-xs font-medium text-app-muted transition-all data-[state=active]:bg-app-card data-[state=active]:text-app-foreground data-[state=active]:shadow-sm"
              >
                Followers
              </TabsTrigger>

              <TabsTrigger
                value="following"
                className="cursor-pointer rounded-lg text-xs font-medium text-app-muted transition-all data-[state=active]:bg-app-card data-[state=active]:text-app-foreground data-[state=active]:shadow-sm"
              >
                Following
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Followers */}
          <TabsContent
            value="followers"
            className=" min-h-0 flex-1 overflow-y-auto px-4 pb-4 pt-3 outline-none "
          >
            <div className="rounded-xl border border-border bg-app-background p-2">
              {loading ? (
                <div className="flex items-center justify-center gap-4">
                  <Spinner />
                </div>
              ) : followers.length > 0 ? (
                followers.map((user) => (
                  <FollowListItem
                    key={user.username}
                    user={user}
                    type="followers"
                    onRemove={(username) => {
                      setFollowers((prev) =>
                        prev.filter((user) => user.username !== username),
                      );
                    }}
                  />
                ))
              ) : (
                <div className="flex min-h-[180px] items-center justify-center">
                  <div className="text-center">
                    <p className="text-sm font-medium text-app-foreground">
                      No followers yet
                    </p>
                    <p className="mt-1 text-xs text-app-muted">
                      When someone follows you, they’ll appear here.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Following */}
          <TabsContent
            value="following"
            className=" min-h-0 flex-1 overflow-y-auto px-4 pb-4 pt-3 outline-none"
          >
            <div className="rounded-xl border border-border bg-app-background p-2">
              {loading ? (
                <div className="flex items-center justify-center gap-4">
                  <Spinner />
                </div>
              ) : following.length > 0 ? (
                following.map((user) => (
                  <FollowListItem
                    key={user.username}
                    user={user}
                    type="following"
                    onRemove={(username) => {
                      setFollowing((prev) =>
                        prev.filter((user) => user.username !== username),
                      );
                    }}
                  />
                ))
              ) : (
                <div className="flex min-h-[180px] items-center justify-center">
                  <div className="text-center">
                    <p className="text-sm font-medium text-app-foreground">
                      Not following anyone yet
                    </p>
                    <p className="mt-1 text-xs text-app-muted">
                      People you follow will appear here.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
