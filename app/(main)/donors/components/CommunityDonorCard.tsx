"use client";
import { MapPin, Phone } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { formatLocation } from "@/lib/helpers/location-format";
import { Copy } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface CommunityDonorData {
  id: string;
  name: string;
  phone: string;
  bloodGroup: string;
  location: {
    district: string;
    area: string;
    address?: string;
  };
  addedBy: {
    name: string;
    username: string;
  };
}

export default function CommunityDonorCard({
  donor,
}: {
  donor: CommunityDonorData;
}) {
  const handleCopyPhone = async () => {
    try {
      await navigator.clipboard.writeText(donor.phone);
      toast.success("Phone number copied");
    } catch {
      toast.error("Could not copy phone number");
    }
  };

  return (
    <article className="group flex h-full min-w-0 flex-col rounded-2xl border border-border bg-app-card p-4 shadow-sm transition-all duration-200 hover:border-app-primary/30 hover:shadow-md sm:p-5">
      {/* Header */}
      <div className="flex min-w-0 items-start gap-3">
        <div className="min-w-0 flex-1 pt-0.5">
          <h3 className="line-clamp-2 break-words text-sm font-semibold text-app-foreground transition-colors group-hover:text-app-primary sm:text-base">
            {donor.name}
          </h3>

          <Badge
            variant="secondary"
            className="mt-1.5 max-w-full text-[11px] font-medium"
          >
            Community Donor
          </Badge>

          <p className="mt-1.5 text-xs text-muted-foreground">
            Added by{" "}
            <Link
              href={`/user/${donor.addedBy.username}`}
              className="font-medium text-app-primary transition-colors hover:underline"
            >
              {donor.addedBy.name}
            </Link>
          </p>
        </div>

        <div className="flex size-12 shrink-0 flex-col items-center justify-center rounded-xl border border-app-primary/25 bg-app-primary/10 sm:size-14">
          <span className="text-[9px] font-semibold tracking-wider text-app-primary/80">
            BLOOD
          </span>
          <span className="text-lg font-extrabold leading-tight text-app-primary">
            {donor.bloodGroup}
          </span>
        </div>
      </div>

      {/* Phone */}
      <div className="mt-4 flex min-w-0 items-center gap-2 rounded-xl border border-border/70 bg-app-background p-2.5 sm:p-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
          <Phone className="size-4" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-medium text-muted-foreground">
            Phone number
          </p>
          <p className="mt-0.5 break-all text-sm font-semibold tabular-nums text-app-foreground">
            {donor.phone}
          </p>
        </div>

        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={handleCopyPhone}
          aria-label={`Copy ${donor.name}'s phone number`}
          title="Copy phone number"
          className="cursor-pointer size-8 shrink-0 text-muted-foreground hover:text-app-primary"
        >
          <Copy className="size-4" />
        </Button>
      </div>

      {/* Location */}
      <div className="mt-4 flex min-w-0 items-start gap-2.5">
        <MapPin className="mt-0.5 size-4 shrink-0 text-app-muted" />

        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-app-muted">Location</p>

          <p className="mt-0.5 break-words text-sm font-medium leading-5 text-app-foreground">
            {formatLocation(donor.location)}
          </p>

          {donor.location.address && (
            <p className="mt-1 line-clamp-2 break-words text-xs leading-5 text-muted-foreground">
              {donor.location.address}
            </p>
          )}
        </div>
      </div>

      {/* Action */}
      <div className="mt-auto pt-4">
        <div className="border-t border-border/70 pt-4">
          <Button
            asChild
            size="sm"
            className="w-full min-w-0 gap-2 bg-emerald-600 text-white hover:!bg-emerald-700"
          >
            <a href={`tel:${donor.phone}`} aria-label={`Call ${donor.name}`}>
              <Phone className="size-4 shrink-0" />
              <span className="truncate">Call Donor</span>
            </a>
          </Button>
        </div>
      </div>
    </article>
  );
}
