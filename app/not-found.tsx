import { ArrowLeft, Compass } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-[75vh] items-center justify-center bg-app-background px-4 py-12">
      <div className="w-full max-w-lg text-center">
        <div className="relative mx-auto flex size-24 items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-app-primary/5" />
          <Compass className="relative size-12 text-app-primary" />
        </div>

        <p className="mt-7 text-sm font-semibold tracking-[0.2em] text-app-primary">
          ERROR 404
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-app-foreground sm:text-4xl">
          Page Not Found
        </h1>

        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-muted-foreground">
          {`Sorry, the page you're looking for doesn't exist, has been moved, or
          the link may be incorrect.`}
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button
            asChild
            className="h-10 cursor-pointer gap-2 rounded-lg bg-app-primary px-5 text-white transition-colors hover:!bg-app-primary/90"
          >
            <Link href="/">
              <ArrowLeft className="size-4" />
              Back to Home
            </Link>
          </Button>
        </div>

        <p className="mt-8 text-xs text-muted-foreground">
          BondhOn — Civic Action & Emergency Coordination Platform
        </p>
      </div>
    </main>
  );
}
