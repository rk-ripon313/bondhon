import { ArrowLeft, UserRoundX } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function UserNotFound() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] w-full items-center justify-center bg-app-background px-4 py-8">
      <Card className="w-full max-w-md border-border/60 bg-app-card shadow-sm">
        <CardContent className="flex flex-col items-center px-6 py-10 text-center sm:px-8">
          <div className="mb-5 flex size-16 items-center justify-center rounded-full bg-muted">
            <UserRoundX className="size-8 text-muted-foreground" />
          </div>

          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
            User not found
          </h1>

          <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
            The profile you are looking for doesn&apos;t exist or may no longer
            be available.
          </p>

          <Button asChild variant="outline" className="mt-6 cursor-pointer">
            <Link href="/">
              <ArrowLeft className="mr-2 size-4" />
              Back to Home
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
