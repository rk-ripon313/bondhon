import { HeartPulse } from "lucide-react";
import Link from "next/link";

export default function NavLogo() {
  return (
    <Link href="/" className="flex items-center gap-3 shrink-0">
      <div className="size-10 rounded-2xl bg-linear-to-br from-red-600 to-rose-500 flex items-center justify-center text-white shadow-lg shadow-red-500/20">
        <HeartPulse size={20} />
      </div>

      <div className="leading-tight">
        <h2 className="font-semibold text-base font-heading">
          Bondh<span className="text-red-600">On</span>
        </h2>

        <p className="hidden sm:block text-xs text-muted-foreground">
          Civic Coordination
        </p>
      </div>
    </Link>
  );
}
