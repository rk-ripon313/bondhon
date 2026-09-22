import { formatBDPhone } from "@/lib/helpers/phone";
import { MessageCircle, Phone, UserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type RequesterProps = {
  requester: {
    id: string;
    name: string;
    username: string;
    image?: string;
  };
  contactNumber?: string;
};

export function BloodRequestRequester({
  requester,
  contactNumber,
}: RequesterProps) {
  return (
    <section className="rounded-2xl border border-border bg-app-card p-5 sm:p-6">
      <div className="flex items-center gap-2">
        <UserRound className="size-4 text-app-primary" />

        <h2 className="font-semibold">Requester</h2>
      </div>

      {/* Requester */}
      <div className="mt-5 flex items-center gap-3">
        <div className="relative size-12 shrink-0 overflow-hidden rounded-full bg-muted">
          {requester.image ? (
            <Image
              src={requester.image}
              alt={requester.name}
              fill
              sizes="48px"
              className="object-cover"
            />
          ) : (
            <div className="flex size-full items-center justify-center font-semibold">
              {requester.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div className="min-w-0">
          <p className="truncate font-medium">{requester.name}</p>

          <p className="truncate text-sm text-muted-foreground">
            @{requester.username}
          </p>
        </div>
      </div>

      {/* Profile Action */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        <Link
          href={`/user/${requester.username}`}
          className="inline-flex h-10 items-center justify-center rounded-lg border border-border px-3 text-sm font-medium transition hover:border-app-primary/40 hover:text-app-primary"
        >
          View Profile
        </Link>

        <button
          type="button"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-border px-3 text-sm font-medium transition hover:border-app-primary/40 hover:text-app-primary"
        >
          <MessageCircle className="size-4" />
          Message
        </button>
      </div>

      {/* Contact */}
      {contactNumber && (
        <div className="mt-5 border-t border-border pt-5">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Contact
          </p>

          <a
            href={`tel:${contactNumber}`}
            className="mt-3 flex items-center gap-3 rounded-xl border border-border bg-muted/30 px-3.5 py-3 transition hover:border-app-primary/30 hover:bg-muted/50"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-app-primary/10">
              <Phone className="size-4 text-app-primary" />
            </span>

            <span className="min-w-0 truncate text-sm font-medium">
              {formatBDPhone(contactNumber)}
            </span>
          </a>
        </div>
      )}
    </section>
  );
}
