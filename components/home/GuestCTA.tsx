import { Button } from "@/components/ui/button";
import { ArrowRight, HeartHandshake, ShieldCheck } from "lucide-react";
import Link from "next/link";
import Section from "../layout/Section";

export default function GuestCTA() {
  return (
    <Section>
      {/* Glow Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 left-0 h-72 w-72 rounded-full bg-app-primary/15 blur-3xl" />

        <div className="absolute -bottom-20 right-0 h-72 w-72 rounded-full bg-app-secondary/15 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="rounded-[2rem] border bg-app-card p-8 md:p-12 text-center shadow-sm">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border bg-app-background px-4 py-2 text-sm font-medium">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            Trusted Community Platform
          </div>

          {/* Heading */}
          <h2 className="mt-8 text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
            One Notification.
            <br />
            One Donor.
            <br />
            <span className="text-app-primary">One Life Saved.</span>
          </h2>

          {/* Description */}
          <p className="mt-6 max-w-2xl mx-auto text-base md:text-lg text-muted-foreground leading-relaxed">
            Join a network built for real-world impact, emergency response,
            blood donation, and community action.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/register">
              <Button
                size="lg"
                className=" w-full sm:w-auto rounded-xl bg-app-primary hover:bg-app-primary/90 text-white gap-2 cursor-pointer"
              >
                <HeartHandshake className="h-5 w-5" />
                Join BondhOn
              </Button>
            </Link>

            <Link href="/blood-requests">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto rounded-xl gap-2 cursor-alias"
              >
                Explore Requests
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Mini Stats */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 border-t pt-8">
            <div>
              <p className="text-2xl font-black font-mono">12K+</p>

              <p className="text-xs text-muted-foreground">Donors</p>
            </div>

            <div>
              <p className="text-2xl font-black font-mono">3.8K+</p>

              <p className="text-xs text-muted-foreground">Lives Impacted</p>
            </div>

            <div>
              <p className="text-2xl font-black font-mono">420+</p>

              <p className="text-xs text-muted-foreground">Events</p>
            </div>

            <div>
              <p className="text-2xl font-black font-mono">64</p>

              <p className="text-xs text-muted-foreground">Districts</p>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
