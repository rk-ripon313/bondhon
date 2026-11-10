import { HeartPulse } from "lucide-react";
import Link from "next/link";

export default function NavLogo() {
  return (
    <Link href="/" className="flex shrink-0 items-center gap-2 sm:gap-3">
      <div className="flex size-8 items-center justify-center rounded-xl bg-linear-to-br from-red-600 to-rose-500 text-white shadow-lg shadow-red-500/20 sm:size-10 sm:rounded-2xl">
        <HeartPulse className="size-[18px] sm:size-5" />
      </div>

      <div className="whitespace-nowrap leading-tight">
        <h2 className="font-heading text-sm font-semibold sm:text-base">
          Bondh<span className="text-red-600">On</span>
        </h2>

        <p className="hidden text-xs text-muted-foreground sm:block">
          Civic Coordination
        </p>
      </div>
    </Link>
  );
}
