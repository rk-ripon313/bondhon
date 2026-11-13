"use client";

import { Check, Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

const themeOptions = [
  {
    value: "light",
    label: "Light",
    description: "A bright appearance for daytime use.",
    icon: Sun,
  },
  {
    value: "dark",
    label: "Dark",
    description: "A darker appearance that's easier on the eyes.",
    icon: Moon,
  },
  {
    value: "system",
    label: "System",
    description: "Automatically match your device appearance.",
    icon: Monitor,
  },
] as const;

export default function AppearanceSettingsPage() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
          Appearance
        </h1>

        <p className="text-sm text-muted-foreground">
          Customize how BondhOn looks on your device.
        </p>
      </div>

      <div className="space-y-5">
        <section className="rounded-xl border border-border bg-app-card p-4 sm:p-5">
          <div className="space-y-1">
            <h2 className="text-sm font-semibold">Choose Your Theme</h2>
            <p className="text-xs text-muted-foreground">
              Select your preferred appearance for the application.
            </p>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {themeOptions.map((option) => {
              const Icon = option.icon;
              const isActive = mounted && theme === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  disabled={!mounted}
                  onClick={() => setTheme(option.value)}
                  aria-pressed={isActive}
                  className={`cursor-pointer relative flex flex-col items-start rounded-xl border p-4 text-left transition-colors disabled:cursor-not-allowed ${
                    isActive
                      ? "border-app-primary bg-app-primary/5"
                      : "border-border bg-app-background hover:border-app-primary/40"
                  }`}
                >
                  <div className="flex w-full items-center justify-between">
                    <div
                      className={`flex size-10 items-center justify-center rounded-lg ${
                        isActive
                          ? "bg-app-primary/10 text-app-primary"
                          : "bg-app-card text-muted-foreground"
                      }`}
                    >
                      <Icon className="size-5" />
                    </div>

                    {isActive && (
                      <span className="flex size-5 items-center justify-center rounded-full bg-app-primary text-white">
                        <Check className="size-3" />
                      </span>
                    )}
                  </div>

                  <div className="mt-4">
                    <p className="text-sm font-semibold">{option.label}</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {option.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section className="flex items-center gap-3 rounded-xl border border-border bg-app-card p-4 sm:p-5">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-app-primary/10 text-app-primary">
            <Monitor className="size-4.5" />
          </div>

          <div className="min-w-0">
            <h2 className="text-sm font-semibold">Current Appearance</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              {mounted
                ? theme === "system"
                  ? `Following your device settings (${resolvedTheme === "dark" ? "Dark" : "Light"}).`
                  : `${theme === "dark" ? "Dark" : "Light"} theme is currently active.`
                : "Loading appearance..."}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
