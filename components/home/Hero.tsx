import { Button } from "@/components/ui/button";
import { ArrowRight, CalendarDays, CheckCircle2, Droplets } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-14 pb-14 lg:pt-16 lg:pb-16 ">
      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-125 w-225 rounded-full bg-app-primary/10 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 ">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left */}
          <div className="lg:col-span-7 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-2 text-xs font-medium">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              Real-Time Emergency Coordination
            </div>

            <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight">
              Real People.
              <br />
              Real Emergencies.
              <br />
              <span className="text-primary">Real Impact.</span>
            </h1>

            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto lg:mx-0">
              Bondhon connects blood donors, emergency responders, volunteers,
              and communities through location-based real-world coordination.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/register">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-app-primary hover:bg-app-primary/90 text-white cursor-pointer"
                >
                  Create Account
                </Button>
              </Link>

              <Link href="/blood-requests">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto rounded-xl gap-2 cursor-pointer"
                >
                  Explore Emergencies
                  <ArrowRight size={18} />
                </Button>
              </Link>
            </div>
          </div>

          {/* Right  */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl border bg-app-card p-6 shadow-xl">
              <div className="space-y-4">
                {/* Blood Request */}
                <div className="rounded-2xl border p-4 bg-app-background ">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-red-500/10">
                      <Droplets className="text-red-500" />
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground">
                        Critical Blood Request
                      </p>

                      <p className="font-semibold">O+ Needed • 2.4 km Away</p>
                    </div>
                  </div>
                </div>

                {/* Event */}
                <div className="rounded-2xl border p-4 bg-app-background">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-blue-500/10">
                      <CalendarDays className="text-blue-500" />
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground">
                        Community Event
                      </p>

                      <p className="font-semibold">Tree Plantation Drive</p>
                    </div>
                  </div>
                </div>

                {/* Match */}
                <div className="rounded-2xl border p-4 bg-app-background">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-emerald-500/10">
                      <CheckCircle2 className="text-emerald-500" />
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground">
                        Match Found
                      </p>

                      <p className="font-semibold">Donor Assigned in 1.2 km</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center">
                <div className="text-5xl">🩸</div>
                <p className="mt-2 font-bold text-xl">BondhOn Engine</p>

                <p className="text-sm text-muted-foreground">
                  Geo-Based Matching Active
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
