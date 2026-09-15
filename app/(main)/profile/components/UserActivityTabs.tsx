"use client";

import BloodRequestModal from "@/components/blood-request/BloodRequestModal";
import BloodRequestCard from "@/components/blood-request/card/BloodRequestCard";
import EmptyState from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BloodRequestCardData } from "@/types/blood-request.type";
import { Activity, Calendar, Plus } from "lucide-react";
import { useState } from "react";

type UserActivityTabsProps = {
  requests?: BloodRequestCardData[];
  events?: any[];
};

export default function UserActivityTabs({
  requests = [],
  events = [],
}: UserActivityTabsProps) {
  const [open, setOpen] = useState(false);

  return (
    <section className="overflow-hidden rounded-2xl border border-border/60 bg-app-card shadow-sm">
      {/* Section Header */}
      <div className="border-b border-border/60 px-5 py-4 sm:px-6">
        <h2 className="text-lg font-semibold tracking-tight">Activity</h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Manage your blood requests and hosted events.
        </p>
      </div>

      <div className="p-4 sm:p-5">
        <Tabs defaultValue="requests" className="w-full">
          {/* Tabs */}

          <TabsList className="h-auto w-full justify-start gap-1 rounded-xl border bg-app-background  p-1">
            <TabsTrigger
              value="requests"
              className="flex items-center gap-2 px-4 py-3 cursor-pointer rounded-lg text-xs sm:text-sm font-medium text-app-muted transition-all data-[state=active]:bg-app-card data-[state=active]:text-app-foreground data-[state=active]:shadow-sm"
            >
              <Activity className="size-4 text-rose-500" />
              Blood Requests
            </TabsTrigger>

            <TabsTrigger
              value="events"
              className="flex items-center gap-2 px-4 py-3 cursor-pointer rounded-lg text-xs sm:text-sm font-medium text-app-muted transition-all data-[state=active]:bg-app-card data-[state=active]:text-app-foreground data-[state=active]:shadow-sm"
            >
              <Calendar className="size-4 text-amber-500" />
              Events Hosted
            </TabsTrigger>
          </TabsList>

          {/* Blood Requests Tab Content */}
          <TabsContent
            value="requests"
            className="mt-5 space-y-4 outline-hidden"
          >
            <div className="flex items-center justify-between gap-3 rounded-xl border border-border/40 bg-muted/20 p-3.5 sm:p-4">
              <div>
                <h3 className="text-sm font-semibold">Blood Requests</h3>

                <p className="mt-0.5 text-xs text-muted-foreground">
                  Requests you have created.
                </p>
              </div>

              <Button
                className="bg-app-primary text-white hover:bg-app-primary/90 shrink-0 gap-1.5 font-semibold cursor-pointer"
                type="button"
                size="sm"
                onClick={() => setOpen(true)}
              >
                <Plus className="size-4" />
                <span className="hidden sm:inline">Create Request</span>
                <span className="sm:hidden">Create</span>
              </Button>
            </div>

            {/* Requests */}
            {requests.length > 0 ? (
              <div className="space-y-3">
                {requests.map((request) => (
                  <BloodRequestCard key={request.id} request={request} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Activity}
                title="No blood requests yet"
                description="Create a request when blood is needed."
              />
            )}
          </TabsContent>

          {/* Events */}
          <TabsContent value="events" className="mt-5 space-y-4 outline-hidden">
            <div className="flex items-center justify-between gap-3 rounded-xl border border-border/40 bg-muted/20 p-3.5 sm:p-4">
              <div>
                <h3 className="text-sm font-semibold">Events Hosted</h3>

                <p className="mt-0.5 text-xs text-muted-foreground">
                  Events you have organized.
                </p>
              </div>

              <Button
                type="button"
                size="sm"
                className="bg-app-secondary text-white hover:bg-app-secondary/90 shrink-0 gap-1.5 font-semibold cursor-pointer"
              >
                <Plus className="size-4" />

                <span className="hidden sm:inline">Create Event</span>

                <span className="sm:hidden">Create</span>
              </Button>
            </div>

            {/* Events */}
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
        </Tabs>
      </div>

      <BloodRequestModal mode="create" open={open} onOpenChange={setOpen} />
    </section>
  );
}
