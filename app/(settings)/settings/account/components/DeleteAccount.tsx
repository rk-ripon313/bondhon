import { AlertTriangle, Trash2 } from "lucide-react";

export default function DeleteAccount() {
  return (
    <section className="rounded-xl border border-destructive/30 bg-app-card p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
          <Trash2 className="size-4.5" />
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-semibold">Delete Account</h2>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Permanently remove your account and associated information.
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 rounded-lg bg-destructive/5 p-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-2">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-destructive" />

          <div>
            <p className="text-sm font-medium">Permanently delete account</p>
            <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
              This action will permanently remove your account and cannot be
              undone.
            </p>
          </div>
        </div>

        <button
          type="button"
          disabled
          className="h-8 shrink-0 cursor-not-allowed rounded-lg border border-destructive/30 px-3 text-xs font-medium text-destructive opacity-70"
        >
          Coming soon
        </button>
      </div>
    </section>
  );
}
