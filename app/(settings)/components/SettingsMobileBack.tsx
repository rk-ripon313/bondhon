"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SettingsMobileBack() {
  const pathname = usePathname();

  if (pathname === "/settings") return null;

  return (
    <Link
      href="/settings"
      className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground md:hidden"
    >
      <ArrowLeft className="size-4" />
      Back to Settings
    </Link>
  );
}
