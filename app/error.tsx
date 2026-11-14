"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[GLOBAL_ERROR]", error);
  }, [error]);

  return (
    <main className="flex min-h-[75vh] items-center justify-center bg-app-background px-4 py-12">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-app-card px-6 py-10 text-center sm:px-10">
        <div className="mx-auto flex size-14 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
          <AlertTriangle className="size-7" />
        </div>

        <h1 className="mt-6 text-xl font-semibold tracking-tight text-app-foreground">
          Something Went Wrong
        </h1>

        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          An unexpected error occurred. Please try again. If the problem
          continues, return to the home page.
        </p>

        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Button
            onClick={reset}
            className="h-10 cursor-pointer gap-2 rounded-lg bg-app-primary px-5 text-white hover:!bg-app-primary/90"
          >
            <RefreshCw className="size-4" />
            Try Again
          </Button>

          <Button
            asChild
            variant="outline"
            className="h-10 cursor-pointer rounded-lg border-border bg-app-background px-5 hover:!bg-app-muted"
          >
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
