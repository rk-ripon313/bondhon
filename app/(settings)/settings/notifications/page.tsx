import { Bell, Clock3 } from "lucide-react";

export default function NotificationsSettingsPage() {
  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
          Notifications
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage how and when you receive notifications.
        </p>
      </div>

      <section className="flex min-h-[320px] flex-col items-center justify-center rounded-xl border border-border bg-app-card px-5 py-10 text-center sm:min-h-[380px]">
        <div className="relative mb-5 flex size-16 items-center justify-center rounded-2xl bg-app-primary/10 text-app-primary">
          <Bell className="size-7" />
          <span className="absolute -right-1 -top-1 flex size-6 items-center justify-center rounded-full border-2 border-app-card bg-app-primary text-white">
            <Clock3 className="size-3" />
          </span>
        </div>

        <span className="mb-3 rounded-full border border-app-primary/20 bg-app-primary/10 px-3 py-1 text-xs font-medium text-app-primary">
          Coming Soon
        </span>

        <h2 className="text-lg font-semibold tracking-tight">
          Notification preferences
        </h2>

        <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
          Notification preferences are coming soon. You&apos;ll be able to
          personalize the updates and alerts you receive to stay informed about
          what matters most.
        </p>
      </section>
    </div>
  );
}
