"use client";
import { ExternalLink, MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import FollowToggle from "@/components/shared/FollowToggle";
import { Button } from "@/components/ui/button";
import { formatLocation } from "@/lib/helpers/location-format";
import { EventDetailParticipant } from "@/types/event.type";

export default function EventParticipant({
  participant: { name, username, image, location, isFollowing, isYou },
}: {
  participant: EventDetailParticipant;
}) {
  return (
    <div className="flex min-w-0 items-center gap-3 px-5 py-3.5 sm:px-6">
      {/* Avatar */}
      <Link
        href={`/user/${username}`}
        className="relative size-10 shrink-0 overflow-hidden rounded-full border border-border bg-app-muted"
      >
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            sizes="40px"
            className="object-cover"
          />
        ) : (
          <span className="flex size-full items-center justify-center text-sm font-semibold text-muted-foreground">
            {name?.charAt(0)?.toUpperCase() || "U"}
          </span>
        )}
      </Link>

      {/* User Info */}
      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 items-center gap-2">
          <Link
            href={`/user/${username}`}
            className="truncate text-sm font-semibold transition-colors hover:text-app-primary"
          >
            {name}
          </Link>

          {isYou ? (
            <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
              You
            </span>
          ) : (
            <FollowToggle
              username={username}
              isFollowing={isFollowing}
              className="shrink-0"
            />
          )}
        </div>

        <p className="truncate text-xs text-muted-foreground">
          {formatLocation(location)}
        </p>
      </div>

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-2">
        {!isYou && (
          <>
            <Button
              type="button"
              variant="outline"
              size="icon"
              disabled
              title="Messaging is coming soon"
              className="size-8"
            >
              <MessageCircle className="size-3.5" />
            </Button>
          </>
        )}

        <Button
          asChild
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 px-2.5 text-xs"
        >
          <Link href={`/user/${username}`}>
            <span className="hidden sm:inline">Profile</span>
            <ExternalLink className="size-3.5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
