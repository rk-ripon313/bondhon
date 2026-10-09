"use client";

import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="shrink-0 cursor-pointer rounded-full transition-all duration-200 hover:scale-105 active:scale-95"
    >
      {isDark ? (
        <Sun className="size-5 transition-transform duration-300 hover:rotate-45" />
      ) : (
        <Moon className="size-5 transition-transform duration-300 hover:-rotate-12" />
      )}

      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
