import { cn } from "@/lib/utils";
import React from "react";

export default function Section({
  title,
  description,
  children,
}: {
  title?: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={cn(
        "bg-app-background py-20 border-t border-border/60 relative",
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 ">
        {/* section header  */}{" "}
        {title && (
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold"> {title} </h2>

            <p className="mt-4 max-w-2xl mx-auto text-base md:text-lg text-app-muted leading-relaxed">
              {description}
            </p>
          </div>
        )}
        {/* section main content */}
        {children}
      </div>
    </section>
  );
}
