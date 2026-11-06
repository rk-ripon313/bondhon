import { ArrowLeft, CalendarX, Compass } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function EventNotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12 sm:px-6">
      <div className="w-full max-w-md text-center">
        {/* Icon */}
        <div className="relative mx-auto mb-6 flex size-20 items-center justify-center rounded-3xl border border-border bg-app-card shadow-sm">
          <CalendarX className="size-9 text-muted-foreground" />

          <span className="absolute -right-2 -top-2 flex size-8 items-center justify-center rounded-full border-4 border-app-background bg-app-primary text-xs font-bold text-white">
            !
          </span>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-app-primary">
            404 · Event Not Found
          </p>

          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            This event is unavailable
          </h1>

          <p className="mx-auto max-w-sm text-sm leading-6 text-muted-foreground sm:text-base">
            The event you are looking for may have been removed, cancelled, or
            the link might be incorrect.
          </p>
        </div>

        {/* Actions */}
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild className="gap-2">
            <Link href="/events">
              <Compass className="size-4" />
              Explore Events
            </Link>
          </Button>

          <Button asChild variant="outline" className="gap-2">
            <Link href="/">
              <ArrowLeft className="size-4" />
              Back to Home
            </Link>
          </Button>
        </div>

        <p className="mt-8 text-xs text-muted-foreground">
          BondhOn · Connecting people through meaningful actions.
        </p>
      </div>
    </div>
  );
}
