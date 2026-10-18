import { CheckCircle2, MapPin, MessageCircle, ShieldAlert } from "lucide-react";
import Link from "next/link";

import FollowToggle from "@/components/shared/FollowToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getInitials } from "@/lib/helpers/formet-text";
import { formatLocation } from "@/lib/helpers/location-format";
import { VerifiedDonor } from "@/types/donor.type";

export default function VerifiedDonorCard({
  verifiedDonor,
}: {
  verifiedDonor: VerifiedDonor;
}) {
  const totalDonations = verifiedDonor.donationHistory?.length ?? 0;

  return (
    <article className="group flex h-full flex-col rounded-2xl border border-border bg-app-card p-4 shadow-sm transition-all duration-200 hover:border-app-primary/30 hover:shadow-md sm:p-5">
      {/* Header */}
      <div className="flex items-start gap-3">
        <Link
          href={`/user/${verifiedDonor.username}`}
          className="shrink-0 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-primary focus-visible:ring-offset-2"
          aria-label={`View ${verifiedDonor.name}'s profile`}
        >
          <Avatar className="size-12 border border-border sm:size-14">
            <AvatarImage
              src={verifiedDonor.image || "/avatars/default.png"}
              alt={verifiedDonor.name}
            />
            <AvatarFallback className="bg-app-primary/10 font-semibold text-app-primary">
              {getInitials(verifiedDonor.name)}
            </AvatarFallback>
          </Avatar>
        </Link>

        <div className="min-w-0 flex-1 pt-0.5">
          <Link
            href={`/user/${verifiedDonor.username}`}
            className="line-clamp-2 text-sm font-semibold text-app-foreground transition-colors hover:text-app-primary sm:text-base"
          >
            {verifiedDonor.name}
          </Link>

          {verifiedDonor.isYou ? (
            <span className="inline-flex items-center rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-700 shadow-sm dark:text-emerald-400">
              You
            </span>
          ) : (
            <FollowToggle
              username={verifiedDonor.username}
              isFollowing={verifiedDonor.isFollowing}
              className="shrink-0"
            />
          )}
        </div>

        {verifiedDonor.bloodGroup && (
          <div className="flex size-12 shrink-0 flex-col items-center justify-center rounded-xl border border-app-primary/25 bg-app-primary/10 sm:size-14">
            <span className="text-[9px] font-semibold tracking-wider text-app-primary/80">
              BLOOD
            </span>
            <span className="text-lg font-extrabold leading-tight text-app-primary">
              {verifiedDonor.bloodGroup}
            </span>
          </div>
        )}
      </div>

      {/* Availability and donations */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {verifiedDonor.isAvailableForDonate ? (
          <Badge
            variant="outline"
            className="gap-1 border-emerald-500/25 bg-emerald-500/10 px-2 py-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-400"
          >
            <CheckCircle2 className="size-3" />
            Available
          </Badge>
        ) : (
          <Badge
            variant="outline"
            className="gap-1 border-border px-2 py-1 text-[11px] font-medium text-muted-foreground"
          >
            <ShieldAlert className="size-3" />
            Unavailable
          </Badge>
        )}

        <Badge
          variant="secondary"
          className="gap-1 px-2 py-1 text-[11px] font-medium"
        >
          {totalDonations} {totalDonations === 1 ? "Donation" : "Donations"}
        </Badge>
      </div>

      {/* Location */}
      <div className="mt-4 flex items-start gap-2.5 mb-2">
        <MapPin className="mt-0.5 size-4 shrink-0 text-app-muted" />

        <div className="min-w-0">
          <p className="text-xs font-medium text-app-muted">Location</p>
          <p className="mt-0.5 line-clamp-2 text-sm leading-5 text-app-foreground">
            {formatLocation(verifiedDonor.location)}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-auto grid grid-cols-2 gap-2 border-t border-border/70 pt-4">
        <Button
          asChild
          size="sm"
          className="min-w-0 bg-emerald-600 px-2 text-white hover:!bg-emerald-700 dark:bg-emerald-600 "
        >
          <Link href={`/user/${verifiedDonor.username}`}>View Profile</Link>
        </Button>

        <Button
          size="sm"
          variant="outline"
          disabled
          title="Messaging is not available yet"
          className="min-w-0 gap-1.5 border-border px-2 text-muted-foreground"
        >
          <MessageCircle className="size-3.5 shrink-0" />
          Message
        </Button>
      </div>
    </article>
  );
}
