import { UserRoundX } from "lucide-react";

export default function DeactivateAccount() {
  return (
    <section className="rounded-xl border border-border bg-app-card p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-app-primary/10 text-app-primary">
          <UserRoundX className="size-4.5" />
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-semibold">Deactivate Account</h2>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Temporarily disable your account. You may be able to restore access
            later.
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 rounded-lg bg-app-background/60 p-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium">Temporarily deactivate</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Your account deactivation option is not available yet.
          </p>
        </div>

        <button
          type="button"
          disabled
          className="h-8 shrink-0 cursor-not-allowed rounded-lg border border-border px-3 text-xs font-medium text-muted-foreground opacity-70"
        >
          Coming soon
        </button>
      </div>
    </section>
  );
}
