import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function Section({
  title,
  description,
  children,
  headerClassName,
  link,
  linkText = "See all",
}: {
  title?: string;
  description?: string;
  children: React.ReactNode;
  headerClassName?: string;
  link?: string;
  linkText?: string;
}) {
  return (
    <section className="relative border-t border-border/60 bg-app-background py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {title && (
          <div
            className={cn(
              "mb-10 flex items-end justify-between gap-4 sm:mb-12",
              !link && "justify-center text-center",
              headerClassName,
            )}
          >
            <div className={cn(!link && "max-w-2xl")}>
              <h2 className="text-2xl font-bold text-app-foreground sm:text-3xl md:text-4xl">
                {title}
              </h2>

              {description && (
                <p
                  className={cn(
                    "mt-3 text-sm leading-relaxed text-app-muted sm:text-base",
                    !link && "mx-auto",
                  )}
                >
                  {description}
                </p>
              )}
            </div>

            {link && (
              <Link
                href={link}
                className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-app-primary transition-colors hover:underline"
              >
                {linkText}
                <ArrowRight className="size-4" />
              </Link>
            )}
          </div>
        )}

        {children}
      </div>
    </section>
  );
}
