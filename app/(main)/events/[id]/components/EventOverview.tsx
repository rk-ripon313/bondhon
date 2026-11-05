import { EventCardData } from "@/types/event.type";
import { Tag } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
export default function EventOverview({ event }: { event: EventCardData }) {
  return (
    <section className="rounded-2xl border border-border bg-app-card p-4 sm:p-6">
      <h2 className="text-lg font-semibold">About this event</h2>

      <p className="mt-4 whitespace-pre-line text-sm leading-7 text-muted-foreground">
        {event.description}
      </p>

      {event.tags?.length ? (
        <>
          <Separator className="my-5" />
          <div className="flex items-center gap-2 text-sm font-medium">
            <Tag className="size-4 text-muted-foreground" />
            Topics
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {event.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                #{tag}
              </Badge>
            ))}
          </div>
        </>
      ) : null}
    </section>
  );
}
