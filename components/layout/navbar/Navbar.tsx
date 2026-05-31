"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { LogIn, UserPlus } from "lucide-react";
import Link from "next/link";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";
import NavLogo from "./NavLogo";
import NotificationButton from "./NotificationButton";
import UserMenu from "./UserMenu";
import WeatherButton from "./WeatherButton";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Blood Requests", href: "/blood-requests" },
  { label: "Events", href: "/events" },
  { label: "Donors", href: "/donors" },
];

interface UserProps {
  user: {
    name: string;
    image: string;
  } | null;
}

export default function Navbar({ user }: UserProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 
      ${
        isScrolled
          ? "bg-app-background/80 backdrop-blur-xl border-border shadow-sm"
          : "bg-app-background/95 border-transparent"
      }`}
    >
      <nav className="h-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
          {/* LEFT */}
          <div className="flex items-center gap-8">
            <NavLogo />
            <DesktopNav navLinks={navLinks} />
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-2">
            <WeatherButton />

            {user ? (
              <>
                <NotificationButton />
                <UserMenu user={user} />
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button
                    variant="outline"
                    className="hidden lg:flex gap-2 cursor-pointer"
                  >
                    <LogIn size={16} />
                    Login
                  </Button>
                </Link>

                <Link href="/register">
                  <Button className="hidden lg:flex gap-2 bg-app-primary cursor-pointer">
                    <UserPlus size={16} />
                    Sign Up
                  </Button>
                </Link>
              </>
            )}

            <MobileNav navLinks={navLinks} user={user} />
          </div>
        </div>
      </nav>
    </header>
  );
}
