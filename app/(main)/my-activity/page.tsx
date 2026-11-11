import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, Droplet } from "lucide-react";
import { Suspense } from "react";
import MyBloodActivity from "./components/MyBloodActivity";

export interface MyActivitySearchParams {
  requestRole?: string;
  requestStatus?: string;
  requestSort?: string;
  requestPage?: string;

  eventRole?: string;
  eventStatus?: string;
  eventSort?: string;
  eventPage?: string;
}

export default async function MyActivityPage({
  searchParams,
}: {
  searchParams: Promise<MyActivitySearchParams>;
}) {
  const params = await searchParams;

  const requestParams = {
    role: params.requestRole || "all",
    status: params.requestStatus || "all",
    sort: params.requestSort || "newest",
    page: Number(params.requestPage) || 1,
    itemsPerPage: 9,
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      {/* Header */}
      <header className="space-y-1.5">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          My Activity
        </h1>

        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Keep track of your blood requests and event participation.
        </p>
      </header>

      <Tabs defaultValue="blood" className="w-full">
        <TabsList className="h-auto justify-start gap-1 rounded-xl border border-border/60 bg-app-background p-1">
          <TabsTrigger
            value="blood"
            className="flex-1 cursor-pointer justify-center gap-1.5 rounded-lg px-3 py-2.5 text-xs font-medium text-muted-foreground transition-all sm:flex-none sm:gap-2 sm:px-5 sm:py-3 sm:text-sm data-[state=active]:bg-app-card data-[state=active]:text-app-foreground data-[state=active]:shadow-sm"
          >
            <Droplet className="size-4 shrink-0 text-app-primary sm:size-[18px]" />
            Blood Requests
          </TabsTrigger>
          <TabsTrigger
            value="events"
            className="flex-1 cursor-pointer justify-center gap-1.5 rounded-lg px-3 py-2.5 text-xs font-medium text-muted-foreground transition-all sm:flex-none sm:gap-2 sm:px-5 sm:py-3 sm:text-sm data-[state=active]:bg-app-card data-[state=active]:text-app-foreground data-[state=active]:shadow-sm"
          >
            <CalendarDays className="size-4 shrink-0 text-app-secondary sm:size-[18px]" />
            Events
          </TabsTrigger>
        </TabsList>

        {/* Blood Requests */}
        <TabsContent value="blood" className="mt-6">
          <Suspense fallback={null}>
            <MyBloodActivity requestParams={requestParams} />
          </Suspense>
        </TabsContent>

        {/* Events */}
        <TabsContent value="events" className="mt-6">
          {/* Activity content will be added later */}
        </TabsContent>
      </Tabs>
    </div>
  );
}
