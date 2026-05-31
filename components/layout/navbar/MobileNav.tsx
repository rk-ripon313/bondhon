"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";

import { Menu } from "lucide-react";

import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

import { useState } from "react";
import NavLogo from "./NavLogo";
import WeatherButton from "./WeatherButton";

interface MobileNavProps {
  navLinks: {
    label: string;
    href: string;
  }[];
  user: {
    name: string;
    image: string;
  } | null;
}

export default function MobileNav({ navLinks, user }: MobileNavProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden rounded-xl cursor-pointer"
        >
          <Menu size={20} />
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-80 px-0 bg-app-background">
        <VisuallyHidden>
          <SheetTitle>Mobile Navigation</SheetTitle>

          <SheetDescription>
            Mobile navigation menu for BondhOn platform
          </SheetDescription>
        </VisuallyHidden>

        <div className="mt-2 px-6 pb-5 border-b flex justify-start gap-3 items-center">
          <NavLogo />
        </div>

        <div className="flex flex-col gap-2 px-3 py-2">
          <div className="mb-4">
            <WeatherButton mobile />
          </div>
          {/* navlinks */}
          <div className="flex flex-col gap-1">
            {navLinks.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm transition-all duration-200   
                  ${
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

          {/* when user is not logged in */}
          {!user && (
            <div className="border-t pt-4 flex flex-col gap-2">
              <Link href="/login" onClick={() => setOpen(false)}>
                <Button variant="outline" className="w-full cursor-pointer">
                  Login
                </Button>
              </Link>

              <Link href="/register" onClick={() => setOpen(false)}>
                <Button className="w-full bg-app-primary hover:bg-app-primary/90 cursor-pointer">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
