import { ArrowLeft, Settings2 } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function SettingsNotFound() {
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center rounded-xl border border-border bg-app-card px-5 py-12 text-center sm:min-h-[480px]">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-app-background text-muted-foreground">
        <Settings2 className="size-7" />
      </div>

      <h2 className="mt-5 text-lg font-semibold tracking-tight">
        Settings Not Found
      </h2>

      <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
        {`The settings page you're looking for doesn't exist or may have been
        moved. Please return to Settings and choose another section.`}
      </p>

      <Button
        asChild
        className="mt-6 h-9 cursor-pointer gap-2 rounded-lg bg-app-primary px-4 text-white transition-colors hover:bg-app-primary/90"
      >
        <Link href="/settings">
          <ArrowLeft className="size-4" />
          Back to Settings
        </Link>
      </Button>
    </div>
  );
}
