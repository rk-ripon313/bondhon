import { ArrowLeft, Droplets, SearchX } from "lucide-react";
import Link from "next/link";

export default function BloodRequestNotFound() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-app-background px-4 py-8">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-app-primary/10">
          <Droplets className="size-8 text-app-primary" />
        </div>

        <div className="mb-2 flex items-center justify-center gap-2">
          <SearchX className="size-5 text-muted-foreground" />
          <h1 className="text-2xl font-semibold">Blood Request Not Found</h1>
        </div>

        <p className="mb-6 text-sm leading-6 text-muted-foreground">
          The blood request you are looking for may have been deleted or the
          link may be invalid.
        </p>

        <Link
          href="/blood-requests"
          className="inline-flex items-center gap-2 rounded-md bg-app-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-app-primary/90"
        >
          <ArrowLeft className="size-4" />
          Back to Blood Requests
        </Link>
      </div>
    </div>
  );
}
