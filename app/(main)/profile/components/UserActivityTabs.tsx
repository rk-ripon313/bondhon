"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Calendar } from "lucide-react";

export default function UserActivityTabs() {
  return (
    <Tabs defaultValue="requests" className="w-full">
      <TabsList className="h-auto w-full justify-start overflow-x-auto rounded-xl border border-border/60 bg-app-card p-1">
        <TabsTrigger
          value="requests"
          className="flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs sm:text-sm"
        >
          <Activity className="size-4 text-rose-500" />
          Blood Requests
        </TabsTrigger>

        <TabsTrigger
          value="events"
          className="flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs sm:text-sm"
        >
          <Calendar className="size-4 text-amber-500" />
          Events Hosted
        </TabsTrigger>
      </TabsList>

      <TabsContent value="requests" className="mt-4">
        <div className="rounded-2xl border border-border/60 bg-app-card p-8 text-center text-sm text-muted-foreground">
          No blood requests posted yet.
        </div>
      </TabsContent>

      <TabsContent value="events" className="mt-4">
        <div className="rounded-2xl border border-border/60 bg-app-card p-8 text-center text-sm text-muted-foreground">
          No events hosted yet.
        </div>
      </TabsContent>
    </Tabs>
  );
}
