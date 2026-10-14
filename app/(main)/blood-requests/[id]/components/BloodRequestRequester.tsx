import { formatBDPhone } from "@/lib/helpers/phone";
import { MessageCircle, Phone, UserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import FollowToggle from "@/components/shared/FollowToggle";

interface RequesterProps {
  requester: {
    id: string;
    name: string;
    username: string;
    image?: string;
  };
  contactNumber?: string;
  isOwner: boolean;
  isFollowing: boolean;
}

export function BloodRequestRequester({
  requester,
  contactNumber,
  isOwner,
  isFollowing,
}: RequesterProps) {
  return (
    <section className="min-w-0 rounded-2xl border border-border bg-app-card p-4 sm:p-5">
      {/* Section heading */}
      <div className="flex items-center gap-2">
        <UserRound className="size-4 shrink-0 text-app-primary" />

        <h2 className="font-semibold text-app-foreground">Requester</h2>
      </div>

      {/* Requester profile */}
      <div className="mt-5 flex min-w-0 items-center gap-3">
        <Link
          href={`/user/${requester.username}`}
          aria-label={`View ${requester.name}'s profile`}
          className="relative size-12 shrink-0 overflow-hidden rounded-full bg-muted ring-1 ring-border transition hover:ring-app-primary/50"
        >
          {requester.image ? (
            <Image
              src={requester.image}
              alt={requester.name}
              fill
              sizes="48px"
              className="object-cover"
            />
          ) : (
            <div className="flex size-full items-center justify-center font-semibold text-muted-foreground">
              {requester.name.charAt(0).toUpperCase()}
            </div>
          )}
        </Link>

        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
            <p className="min-w-0 truncate text-sm font-semibold text-app-foreground">
              {requester.name}
            </p>

            {isOwner ? (
              <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                You
              </span>
            ) : (
              <FollowToggle
                username={requester.username}
                isFollowing={isFollowing}
                className="shrink-0"
              />
            )}
          </div>

          <p className="mt-1 text-xs text-muted-foreground">
            {isOwner ? "Your blood request" : "Blood request requester"}
          </p>
        </div>
      </div>

      {/* Profile actions */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        <Link
          href={`/user/${requester.username}`}
          className="inline-flex h-10 min-w-0 items-center justify-center rounded-lg border border-border px-2 text-sm font-medium text-app-foreground transition hover:border-app-primary/40 hover:bg-muted/50"
        >
          View Profile
        </Link>

        {!isOwner ? (
          <button
            type="button"
            disabled
            title="Messaging is not available yet"
            className="inline-flex h-10 min-w-0 cursor-not-allowed items-center justify-center gap-1.5 rounded-lg border border-border px-2 text-sm font-medium text-muted-foreground opacity-70"
          >
            <MessageCircle className="size-4 shrink-0" />
            <span>Message</span>
          </button>
        ) : (
          <div className="flex h-10 items-center justify-center rounded-lg bg-muted/50 px-2 text-xs font-medium text-muted-foreground">
            Your request
          </div>
        )}
      </div>

      {/* Contact information */}
      {contactNumber && (
        <div className="mt-5 border-t border-border pt-4">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Contact
          </p>

          <a
            href={`tel:${contactNumber}`}
            className="mt-3 flex min-w-0 items-center gap-3 rounded-xl border border-border bg-muted/30 px-3 py-3 transition hover:border-emerald-500/40 hover:bg-emerald-500/5"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
              <Phone className="size-4 text-emerald-600 dark:text-emerald-400" />
            </span>

            <span className="min-w-0 flex-1 break-words text-sm font-medium text-app-foreground">
              {formatBDPhone(contactNumber)}
            </span>
          </a>
        </div>
      )}
    </section>
  );
}
