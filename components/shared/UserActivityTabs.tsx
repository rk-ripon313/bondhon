"use client";

import BloodRequestCard from "@/components/blood-request/card/BloodRequestCard";

import EmptyState from "@/components/shared/EmptyState";
import Pagination from "@/components/shared/Pagination";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { REQUEST_STATUSES } from "@/constants";
import { BloodRequestCardData } from "@/types/blood-request.type";
import { Activity, Calendar } from "lucide-react";
import ActivitySortFilter from "./ActivitySortFilter";

interface UserActivityTabsProps {
  requests?: BloodRequestCardData[];
  currentPage?: number;
  totalPages?: number;
}

export default function UserActivityTabs({
  requests = [],
  currentPage = 1,
  totalPages = 1,
}: UserActivityTabsProps) {
  const events = [];

  return (
    <div className="w-full rounded-2xl border border-border/60 bg-app-card shadow-sm">
      <Tabs defaultValue="requests" className="w-full">
        {/* Sticky Activity Header + Toolbar */}
        <div className="sticky top-16 z-30 border-b border-border/60 bg-app-card/95 px-4 py-4 backdrop-blur-md supports-[backdrop-filter]:bg-app-card/80 sm:px-5">
          <div className="space-y-4">
            {/* Activity Heading */}
            <div>
              <h2 className="text-lg font-semibold tracking-tight">Activity</h2>
            </div>

            {/* Activity Toolbar */}
            <div className="flex items-center justify-between gap-2">
              {/* Activity Tabs */}
              <TabsList className="h-auto min-w-0 flex-1 justify-start gap-1 rounded-xl border border-border/60 bg-app-background p-1 sm:flex-none">
                <TabsTrigger
                  value="requests"
                  className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-[11px] font-medium text-muted-foreground transition-all sm:flex-none sm:gap-2 sm:px-4 sm:py-2.5 sm:text-sm data-[state=active]:bg-app-card data-[state=active]:text-app-foreground data-[state=active]:shadow-sm"
                >
                  <Activity className="size-3.5 shrink-0 text-rose-500 sm:size-4" />
                  <span>Blood Requests</span>
                </TabsTrigger>

                <TabsTrigger
                  value="events"
                  className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-[11px] font-medium text-muted-foreground transition-all sm:flex-none sm:gap-2 sm:px-4 sm:py-2.5 sm:text-sm data-[state=active]:bg-app-card data-[state=active]:text-app-foreground data-[state=active]:shadow-sm"
                >
                  <Calendar className="size-3.5 shrink-0 text-amber-500 sm:size-4" />
                  <span>Events Hosted</span>
                </TabsTrigger>
              </TabsList>

              <ActivitySortFilter filterOptions={REQUEST_STATUSES} />
            </div>
          </div>
        </div>

        {/* Activity Content */}
        <div className="p-4 sm:p-5">
          {/* Blood Requests */}
          <TabsContent
            value="requests"
            className="mt-0 space-y-4 outline-hidden"
          >
            <div className="rounded-xl border border-border/40 bg-muted/20 p-3.5 sm:p-4">
              <h3 className="text-sm font-semibold">Blood Requests</h3>

              <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
                Blood requests created by this user.
              </p>
            </div>

            {requests.length > 0 ? (
              <>
                <div className="space-y-3">
                  {requests.map((request) => (
                    <BloodRequestCard key={request.id} request={request} />
                  ))}
                </div>

                <Pagination currentPage={currentPage} totalPages={totalPages} />
              </>
            ) : (
              <EmptyState
                icon={Activity}
                title="No blood requests yet"
                description="Create a request when blood is needed."
              />
            )}
          </TabsContent>

          {/* Events */}
          <TabsContent value="events" className="mt-0 space-y-4 outline-hidden">
            <div className="rounded-xl border border-border/40 bg-muted/20 p-3.5 sm:p-4">
              <h3 className="text-sm font-semibold">Events Hosted</h3>

              <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
                Events created by this user.
              </p>
            </div>

            {events.length > 0 ? (
              <div className="space-y-3">
                {/* EventCard will be added here */}
              </div>
            ) : (
              <EmptyState
                icon={Calendar}
                title="No events hosted yet"
                description="Create an event to bring people together for a community activity."
              />
            )}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
