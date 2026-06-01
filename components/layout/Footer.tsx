import { Heart, Mail, MapPin, Users } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t bg-app-background/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid gap-10 md:grid-cols-4 ">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-app-primary text-white flex items-center justify-center font-bold">
                B
              </div>

              <div>
                <h3 className="font-heading font-semibold">BondhOn</h3>

                <p className="text-xs text-muted-foreground">
                  Civic Coordination Platform
                </p>
              </div>
            </div>

            <p className="mt-4 text-sm text-muted-foreground leading-6">
              Connecting donors, volunteers and communities through one
              platform.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-medium mb-4">Quick Links</h4>

            <div className="flex flex-col gap-2 text-sm">
              {[
                { label: "Home", href: "/" },
                { label: "Blood Requests", href: "/blood-requests" },
                { label: "Events", href: "/events" },
                { label: "Donors", href: "/donors" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Community */}
          <div>
            <h4 className="font-medium mb-4">Community</h4>

            <div className="flex flex-col gap-2 text-sm">
              {[
                { label: "Become a Donor", href: "/become-donor" },
                { label: "Create Event", href: "/create-event" },
                { label: "Volunteer", href: "/volunteer" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-medium mb-4">Contact</h4>

            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex gap-2">
                <Mail size={16} />
                hello@bondhon.org
              </div>

              <div className="flex gap-2">
                <MapPin size={16} />
                Sylhet, Bangladesh
              </div>

              <div className="flex gap-2">
                <Users size={16} />
                Community Driven
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs md:text-sm text-muted-foreground">
            © 2026 BondhOn. All rights reserved.
            <span className="mx-1">•</span>
            <Link
              href="https://rk-ripon313.vercel.app/"
              target="_blank"
              className="font-medium text-foreground hover:text-app-primary transition-colors"
            >
              Built by RK Ripon
            </Link>
          </p>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Heart size={14} className="text-app-primary" />
            Built for social impact
          </div>
        </div>
      </div>
    </footer>
  );
}
