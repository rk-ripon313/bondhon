"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function MainError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[MAIN_ERROR]", error);
  }, [error]);

  return (
    <div className="flex min-h-[65vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-border bg-app-card px-6 py-10 text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
          <AlertTriangle className="size-7" />
        </div>

        <h1 className="mt-6 text-xl font-semibold tracking-tight text-app-foreground">
          Something Went Wrong
        </h1>

        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          {` We couldn't load this page. Please try again or return to the home
          page.`}
        </p>

        <Button
          onClick={reset}
          className="mt-7 h-10 cursor-pointer gap-2 rounded-lg bg-app-primary px-5 text-white hover:!bg-app-primary/90"
        >
          <RefreshCw className="size-4" />
          Try Again
        </Button>
      </div>
    </div>
  );
}
