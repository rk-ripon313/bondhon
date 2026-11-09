"use client";

import BloodRequestCard from "@/components/blood-request/card/BloodRequestCard";
import EventCard from "@/components/events/card/EventCard";

import EmptyState from "@/components/shared/EmptyState";
import Pagination from "@/components/shared/Pagination";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EVENT_STATUS, REQUEST_STATUSES } from "@/constants";
import { BloodRequestCardData } from "@/types/blood-request.type";
import { EventCardData } from "@/types/event.type";
import { Activity, Calendar } from "lucide-react";
import { useState } from "react";
import ActivitySortFilter from "./ActivitySortFilter";

interface UserActivityTabsProps {
  requests: BloodRequestCardData[];
  events: EventCardData[];
  currentPage: number;
  requestTotalPages: number;
  eventTotalPages: number;
}

export default function UserActivityTabs({
  requests = [],
  events = [],
  currentPage = 1,
  requestTotalPages = 1,
  eventTotalPages = 1,
}: UserActivityTabsProps) {
  const [activeTab, setActiveTab] = useState("requests");

  const isRequestsTab = activeTab === "requests";

  return (
    <div className="w-full rounded-2xl border border-border/60 bg-app-card shadow-sm">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
                  <span className="sm:hidden">Requests</span>
                  <span className="hidden sm:inline">Blood Requests</span>
                </TabsTrigger>

                <TabsTrigger
                  value="events"
                  className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-[11px] font-medium text-muted-foreground transition-all sm:flex-none sm:gap-2 sm:px-4 sm:py-2.5 sm:text-sm data-[state=active]:bg-app-card data-[state=active]:text-app-foreground data-[state=active]:shadow-sm"
                >
                  <Calendar className="size-3.5 shrink-0 text-amber-500 sm:size-4" />
                  <span className="sm:hidden">Events</span>
                  <span className="hidden sm:inline">Events Hosted</span>
                </TabsTrigger>
              </TabsList>

              <ActivitySortFilter
                type={isRequestsTab ? "requests" : "events"}
                filterOptions={isRequestsTab ? REQUEST_STATUSES : EVENT_STATUS}
              />
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

                <Pagination
                  currentPage={currentPage}
                  totalPages={requestTotalPages}
                />
              </>
            ) : (
              <EmptyState
                icon={Activity}
                title="No blood requests found"
                description="No blood requests match your current filters. Try adjusting or resetting your filters."
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
              <>
                <div className="space-y-3">
                  {events.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>

                <Pagination
                  currentPage={currentPage}
                  totalPages={eventTotalPages}
                />
              </>
            ) : (
              <EmptyState
                icon={Calendar}
                title="No events found"
                description="No events match your current filters. Try adjusting or resetting your filters."
              />
            )}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
