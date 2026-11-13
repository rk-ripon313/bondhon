import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { getBlockedUsers } from "@/database/queries/user.query";
import BlockedUsers from "../components/BlockedUsers";

export default async function BlockedUsersPage() {
  const blockedUsers = await getBlockedUsers();

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <Link
          href="/settings/privacy"
          className="mb-2 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Privacy
        </Link>

        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
          Blocked Users
        </h1>

        <p className="text-sm text-muted-foreground">
          View and manage the people you have blocked.
        </p>
      </div>

      <BlockedUsers users={blockedUsers} />

      <div className="rounded-xl border border-border bg-app-card p-4">
        <p className="text-xs leading-relaxed text-muted-foreground">
          Unblocking someone allows them to follow you again. Previous follow
          relationships will not be restored automatically.
        </p>
      </div>
    </div>
  );
}
