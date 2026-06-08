import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <section className="min-h-screen bg-app-background">
      <div className="container mx-auto px-4">
        <div className="grid min-h-screen lg:grid-cols-2">
          {/* Left Side */}
          <div className="hidden lg:flex flex-col justify-center pr-12">
            <span className="text-sm font-medium text-app-primary">
              BondhOn
            </span>

            <h1 className="mt-4 text-5xl font-bold leading-tight">
              Connect. Donate.
              <br />
              Save Lives.
            </h1>

            <p className="mt-6 max-w-md text-muted-foreground">
              Join Bangladesh’s civic action platform and help people in
              emergencies through blood donation and community events.
            </p>
          </div>

          {/* Right Side */}
          <div className="flex items-center justify-center py-10">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
