import { ArrowLeft, SearchX } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function MainNotFound() {
  return (
    <div className="flex min-h-[65vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-app-muted text-muted-foreground">
          <SearchX className="size-8" />
        </div>

        <p className="mt-6 text-sm font-semibold tracking-widest text-app-primary">
          PAGE NOT FOUND
        </p>

        <h1 className="mt-2 text-2xl font-bold tracking-tight text-app-foreground">
          Nothing Here
        </h1>

        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          {` We couldn't find the page you're looking for. It may have been
          removed or the link might be incorrect.`}
        </p>

        <Button
          asChild
          className="mt-7 h-10 cursor-pointer gap-2 rounded-lg bg-app-primary px-5 text-white hover:bg-app-primary/90"
        >
          <Link href="/">
            <ArrowLeft className="size-4" />
            Back to Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
