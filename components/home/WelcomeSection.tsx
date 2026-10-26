import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sparkles } from "lucide-react";

interface WelcomeSectionProps {
  name?: string | null;
  username?: string | null;
  image?: string | null;
}

export default function WelcomeSection({
  name,
  username,
  image,
}: WelcomeSectionProps) {
  const displayName = name || username || "there";

  return (
    <section className="bg-app-background py-5 sm:py-7">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-gradient-to-br from-app-card via-app-card to-app-primary/[0.06] p-4 shadow-sm sm:p-6">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-20 size-48 rounded-full bg-app-primary/[0.07] blur-3xl sm:size-60"
          />

          <div className="relative flex items-center gap-3 sm:gap-4">
            <Avatar className="size-12 shrink-0 border border-border/80 sm:size-14">
              <AvatarImage src={image || undefined} alt={displayName} />
              <AvatarFallback className="bg-app-primary/10 font-semibold text-app-primary">
                {displayName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0">
              <p className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-app-primary">
                <Sparkles className="size-3.5" />
                WELCOME BACK
              </p>

              <h1 className="mt-1 truncate text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                Hello, {displayName}!
              </h1>

              <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted-foreground">
                See what’s happening around your community and discover ways to
                make a difference.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
