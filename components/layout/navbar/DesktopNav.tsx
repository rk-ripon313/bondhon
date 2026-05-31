"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLinksProps {
  navLinks: {
    label: string;
    href: string;
  }[];
}

export default function DesktopNav({ navLinks }: NavLinksProps) {
  const pathname = usePathname();

  return (
    <div className="hidden lg:flex items-center gap-1">
      {navLinks.map((item) => {
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.label}
            href={item.href}
            className={`px-3 py-2 rounded-lg text-sm transition-all duration-200
            ${
              // isActive
              //   ? "bg-muted text-foreground font-medium"
              //   : "text-muted-foreground hover:text-foreground hover:bg-muted"
              isActive
                ? "bg-app-primary/10 text-app-primary font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
